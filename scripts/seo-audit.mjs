#!/usr/bin/env node
/**
 * SEO audit script (Node ESM).
 *
 * Runs a Lighthouse mobile lab audit (simulated mobile, default throttling) for
 * the SEO + performance categories against each indexable URL, plus a
 * structured-data validation step, and writes a timestamped record to
 * `docs/seo/audits/<timestamp>.json`.
 *
 * Design reference: `.kiro/specs/seo-ranking-optimization/design.md`
 *   → Component "11. Audit tooling" and the "Audit record" data model.
 * Documented interface: `docs/seo/README.md`.
 *
 * Usage:
 *   node scripts/seo-audit.mjs              # standard run → new timestamped record
 *   node scripts/seo-audit.mjs --baseline   # marks the record isBaseline: true
 *   node scripts/seo-audit.mjs --compare    # runs, then prints post vs baseline scores
 *
 * Target URL:
 *   Defaults to http://localhost:3000. Override with the SEO_AUDIT_URL env var
 *   or the --url=<url> argument (the argument takes precedence).
 *
 * Requirements: 11.1, 11.2, 11.5, 11.6, 11.9, 10.1, 10.2, 10.3, 10.6
 *
 * Notes on dependencies:
 *   The Lighthouse lab audit uses the `lighthouse` and `chrome-launcher` npm
 *   packages programmatically. They are NOT declared dependencies of this
 *   project; if they are absent the script prints clear installation
 *   instructions and exits without corrupting any recorded result.
 */

import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Default target when neither --url nor SEO_AUDIT_URL is provided. */
const DEFAULT_TARGET = "http://localhost:3000";

/** Directory (relative to project root) where audit records are written. */
const AUDITS_DIR = path.join("docs", "seo", "audits");

/**
 * The set of indexable paths for the site. TheClientPilot is a single-page
 * site, so the only indexable URL is the home page. Add paths here if the site
 * grows additional indexable routes.
 */
const INDEXABLE_PATHS = ["/"];

// -- Inline classification thresholds ---------------------------------------
// Re-implemented from src/lib/audit-classify.ts because this is an .mjs script
// and cannot import the TypeScript module directly. Keep these in sync.

/** The minimum SEO score (inclusive) that meets the optimization target. */
const SEO_SCORE_TARGET = 95;

/** Structured data is valid iff there are zero reported errors. */
function classifyStructuredDataValid(errors) {
  return Array.isArray(errors) && errors.length === 0;
}

/** An SEO score meets the target iff it is >= SEO_SCORE_TARGET (95). */
function classifyScoreMeetsTarget(score) {
  return typeof score === "number" && Number.isFinite(score) && score >= SEO_SCORE_TARGET;
}

// ---------------------------------------------------------------------------
// Argument / target resolution
// ---------------------------------------------------------------------------

/**
 * Parses process argv into a flags object.
 * @param {string[]} argv
 */
function parseArgs(argv) {
  const flags = { baseline: false, compare: false, url: undefined };
  for (const arg of argv) {
    if (arg === "--baseline") flags.baseline = true;
    else if (arg === "--compare") flags.compare = true;
    else if (arg.startsWith("--url=")) flags.url = arg.slice("--url=".length);
  }
  return flags;
}

/**
 * Resolves the target base URL. The --url argument wins, then SEO_AUDIT_URL,
 * then the default localhost target. The trailing slash is normalized away.
 */
function resolveTarget(flags) {
  const raw = flags.url || process.env.SEO_AUDIT_URL || DEFAULT_TARGET;
  return raw.replace(/\/+$/, "");
}

/** Builds the full list of indexable URLs from a base URL. */
function indexableUrls(base) {
  return INDEXABLE_PATHS.map((p) =>
    p === "/" ? base : `${base}${p.startsWith("/") ? "" : "/"}${p}`
  );
}

// ---------------------------------------------------------------------------
// Structured-data validation step
// ---------------------------------------------------------------------------

/**
 * Fetches a URL and validates the JSON-LD structured data embedded in the page.
 *
 * Extracts every `<script type="application/ld+json">` block, parses it, and
 * flags: parse failures, missing `@context`, and missing `@type`. Returns a
 * list of human-readable error strings (empty when the page's structured data
 * is well-formed). A page with no JSON-LD at all is reported as an error.
 *
 * @param {string} url
 * @returns {Promise<string[]>} the structured-data errors for the page
 */
async function validateStructuredData(url) {
  const errors = [];
  let html;
  try {
    const res = await fetch(url, { redirect: "follow" });
    if (!res.ok) {
      return [`Failed to fetch page for structured-data validation: HTTP ${res.status}`];
    }
    html = await res.text();
  } catch (err) {
    return [`Failed to fetch page for structured-data validation: ${err?.message ?? err}`];
  }

  const blockRegex =
    /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  const blocks = [];
  let match;
  while ((match = blockRegex.exec(html)) !== null) {
    blocks.push(match[1].trim());
  }

  if (blocks.length === 0) {
    return ["No JSON-LD structured data (application/ld+json) found on the page."];
  }

  blocks.forEach((raw, index) => {
    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch (err) {
      errors.push(`JSON-LD block #${index + 1} is not valid JSON: ${err?.message ?? err}`);
      return;
    }
    const entities = Array.isArray(parsed) ? parsed : [parsed];
    entities.forEach((entity, entityIndex) => {
      const label = `JSON-LD block #${index + 1}` + (Array.isArray(parsed) ? `[${entityIndex}]` : "");
      if (!entity || typeof entity !== "object") {
        errors.push(`${label} is not a structured-data object.`);
        return;
      }
      if (!("@context" in entity) || !entity["@context"]) {
        errors.push(`${label} is missing "@context".`);
      }
      if (!("@type" in entity) || !entity["@type"]) {
        errors.push(`${label} is missing "@type".`);
      }
    });
  });

  return errors;
}

// ---------------------------------------------------------------------------
// Lighthouse lab audit
// ---------------------------------------------------------------------------

/**
 * Attempts to load the `lighthouse` and `chrome-launcher` packages. Returns
 * `null` when either is unavailable so the caller can print install guidance.
 * @returns {Promise<{ lighthouse: Function, chromeLauncher: object } | null>}
 */
async function loadLighthouse() {
  try {
    const [lighthouseMod, chromeLauncherMod] = await Promise.all([
      import("lighthouse"),
      import("chrome-launcher"),
    ]);
    return {
      lighthouse: lighthouseMod.default ?? lighthouseMod,
      chromeLauncher: chromeLauncherMod.default ?? chromeLauncherMod,
    };
  } catch {
    return null;
  }
}

/** Safely reads a numeric audit value, rounding to an integer (ms). */
function readNumeric(audits, id, { round = true } = {}) {
  const value = audits?.[id]?.numericValue;
  if (typeof value !== "number" || !Number.isFinite(value)) return null;
  return round ? Math.round(value) : value;
}

/**
 * Runs a single-URL Lighthouse mobile lab audit (SEO + performance) and returns
 * the extracted score + Core Web Vitals.
 *
 * @param {Function} lighthouse
 * @param {number} port - the debugging port of the launched Chrome instance
 * @param {string} url
 */
async function runLighthouse(lighthouse, port, url) {
  // Lighthouse defaults to a mobile form factor with simulated (lab) throttling,
  // which is exactly the "simulated mobile, default throttling" run we want.
  const options = {
    logLevel: "error",
    output: "json",
    onlyCategories: ["seo", "performance"],
    port,
  };

  const runnerResult = await lighthouse(url, options);
  const lhr = runnerResult?.lhr;
  if (!lhr || !lhr.categories?.seo || typeof lhr.categories.seo.score !== "number") {
    throw new Error(`Lighthouse produced no SEO score for ${url}`);
  }

  const seoScore = Math.round(lhr.categories.seo.score * 100);
  const audits = lhr.audits ?? {};

  // INP is a field metric; use the interaction-to-next-paint audit when
  // available, otherwise fall back to a lab proxy (total-blocking-time).
  const inpMs =
    readNumeric(audits, "interaction-to-next-paint") ??
    readNumeric(audits, "total-blocking-time");

  return {
    url,
    seoScore,
    coreWebVitals: {
      lcpMs: readNumeric(audits, "largest-contentful-paint"),
      cls: readNumeric(audits, "cumulative-layout-shift", { round: false }),
      inpMs,
    },
  };
}

// ---------------------------------------------------------------------------
// Audit-record persistence
// ---------------------------------------------------------------------------

/** Sanitizes an ISO timestamp into a filesystem-safe filename. */
function timestampToFilename(iso) {
  return `${iso.replace(/[:.]/g, "-")}.json`;
}

/** Reads every recorded audit under docs/seo/audits, newest first. */
async function readAllRecords(dir) {
  if (!existsSync(dir)) return [];
  const entries = await readdir(dir);
  const records = [];
  for (const entry of entries) {
    if (!entry.endsWith(".json")) continue;
    try {
      const raw = await readFile(path.join(dir, entry), "utf8");
      const parsed = JSON.parse(raw);
      records.push({ file: entry, record: parsed });
    } catch {
      // Ignore unreadable/corrupt files rather than failing the whole run.
    }
  }
  records.sort((a, b) => {
    const ta = a.record?.timestamp ?? "";
    const tb = b.record?.timestamp ?? "";
    return tb.localeCompare(ta);
  });
  return records;
}

/** Finds the most recent recorded baseline, or null when none exists. */
function findBaseline(records) {
  const baseline = records.find((r) => r.record?.isBaseline === true);
  return baseline ? baseline.record : null;
}

// ---------------------------------------------------------------------------
// Comparison output
// ---------------------------------------------------------------------------

/** Prints a post-vs-baseline score comparison for each page. */
function printComparison(postRecord, baselineRecord) {
  console.log("\n=== Post-optimization vs Baseline ===");
  if (!baselineRecord) {
    console.log(
      "No baseline record found. Record one first with: node scripts/seo-audit.mjs --baseline"
    );
    return;
  }

  const baselineByUrl = new Map(
    (baselineRecord.pages ?? []).map((p) => [p.url, p])
  );

  for (const page of postRecord.pages ?? []) {
    const base = baselineByUrl.get(page.url);
    const baseScore = base ? base.seoScore : undefined;
    const delta =
      typeof baseScore === "number" ? page.seoScore - baseScore : undefined;
    const deltaStr =
      delta === undefined
        ? "(no baseline for this URL)"
        : `${delta >= 0 ? "+" : ""}${delta}`;
    console.log(
      `  ${page.url}\n    baseline SEO: ${baseScore ?? "n/a"}  →  post SEO: ${page.seoScore}  (${deltaStr})` +
        `\n    target >= ${SEO_SCORE_TARGET}: ${classifyScoreMeetsTarget(page.seoScore) ? "met" : "NOT met"}`
    );
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

/**
 * Runs the audit end-to-end.
 * @returns {Promise<{ ok: boolean, error?: string, record?: object, file?: string }>}
 */
async function runAudit(argv) {
  const flags = parseArgs(argv);
  const target = resolveTarget(flags);
  const urls = indexableUrls(target);

  console.log(`SEO audit target: ${target}`);
  console.log(`Indexable URLs: ${urls.join(", ")}`);
  if (flags.baseline) console.log("Mode: baseline (record will be marked isBaseline: true)");
  if (flags.compare) console.log("Mode: compare (post vs baseline scores will be printed)");

  // Load the Lighthouse toolchain, or print install guidance and stop without
  // touching any recorded result.
  const toolchain = await loadLighthouse();
  if (!toolchain) {
    const msg =
      "Lighthouse and/or chrome-launcher are not installed.\n" +
      "The SEO audit needs them to run a Lighthouse mobile lab audit.\n\n" +
      "Install them as dev dependencies:\n\n" +
      "  npm i -D lighthouse chrome-launcher\n\n" +
      "Then re-run: node scripts/seo-audit.mjs" +
      (flags.baseline ? " --baseline" : "") +
      (flags.compare ? " --compare" : "");
    console.error(msg);
    return { ok: false, error: "missing-dependencies" };
  }

  const { lighthouse, chromeLauncher } = toolchain;

  let chrome;
  const pages = [];
  try {
    chrome = await chromeLauncher.launch({
      chromeFlags: ["--headless=new", "--no-sandbox", "--disable-gpu"],
    });

    for (const url of urls) {
      console.log(`\nAuditing ${url} ...`);
      const lab = await runLighthouse(lighthouse, chrome.port, url);
      const structuredDataErrors = await validateStructuredData(url);
      const structuredDataValid = classifyStructuredDataValid(structuredDataErrors);

      pages.push({
        url: lab.url,
        seoScore: lab.seoScore,
        coreWebVitals: lab.coreWebVitals,
        structuredDataValid,
        structuredDataErrors,
      });

      console.log(
        `  SEO score: ${lab.seoScore} (target >= ${SEO_SCORE_TARGET}: ${classifyScoreMeetsTarget(lab.seoScore) ? "met" : "NOT met"})`
      );
      console.log(
        `  CWV: LCP ${lab.coreWebVitals.lcpMs ?? "n/a"}ms, CLS ${lab.coreWebVitals.cls ?? "n/a"}, INP ${lab.coreWebVitals.inpMs ?? "n/a"}ms`
      );
      console.log(
        `  Structured data: ${structuredDataValid ? "valid" : `INVALID (${structuredDataErrors.length} error(s))`}`
      );
    }
  } catch (err) {
    // Audit failed: retain previously recorded results unchanged (we never
    // wrote anything) and return an error indication (Req 11.6).
    const message = err?.message ?? String(err);
    console.error(`\nAudit failed: ${message}`);
    console.error("Previously recorded audit results are left unchanged.");
    return { ok: false, error: message };
  } finally {
    if (chrome) {
      try {
        await chrome.kill();
      } catch {
        /* best-effort cleanup */
      }
    }
  }

  // Guard: if no page produced a usable score, treat as failure and do not write.
  if (pages.length === 0 || pages.every((p) => typeof p.seoScore !== "number")) {
    console.error("\nAudit produced no SEO score; leaving recorded results unchanged.");
    return { ok: false, error: "no-score" };
  }

  const timestamp = new Date().toISOString();
  const record = {
    timestamp,
    isBaseline: flags.baseline === true,
    pages,
  };

  await mkdir(AUDITS_DIR, { recursive: true });
  const file = path.join(AUDITS_DIR, timestampToFilename(timestamp));
  await writeFile(file, `${JSON.stringify(record, null, 2)}\n`, "utf8");
  console.log(`\nRecorded audit → ${file}`);

  if (flags.compare) {
    const existing = await readAllRecords(AUDITS_DIR);
    // Exclude the record we just wrote when locating the baseline.
    const baseline = findBaseline(existing.filter((r) => r.file !== path.basename(file)));
    printComparison(record, baseline);
  }

  return { ok: true, record, file };
}

// Run when invoked directly (not when imported).
const invokedDirectly =
  process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1]);

if (invokedDirectly) {
  const result = await runAudit(process.argv.slice(2));
  process.exit(result.ok ? 0 : 1);
}

export { runAudit, validateStructuredData, classifyStructuredDataValid, classifyScoreMeetsTarget };
