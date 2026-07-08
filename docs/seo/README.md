# SEO Audit — TheClientPilot

This document describes how to run the re-runnable SEO audit, what it produces, and how to
compare a post-optimization run against the recorded baseline.

The audit is a repeatable, documented measurement run that records the Lighthouse SEO score,
Core Web Vitals, and structured-data validity for every indexable page at a point in time
(Requirement 11). It is implemented by `scripts/seo-audit.mjs` and writes timestamped records
into `docs/seo/audits/`.

> Note: the audit script (`scripts/seo-audit.mjs`) is delivered by task 8.1. This document
> describes the command and interface as specified by the design so the procedure is
> documented ahead of and alongside the script itself.

---

## What the audit does

For each indexable URL the audit performs two steps:

1. **Lighthouse mobile lab audit** — a simulated mobile device run with default mobile
   network and CPU throttling, capturing:
   - the **SEO score** (0–100), and
   - **Core Web Vitals**: Largest Contentful Paint (LCP), Cumulative Layout Shift (CLS),
     and Interaction to Next Paint (INP, or its lab proxy).
2. **Structured-data validation** — validates the JSON-LD blocks emitted by the page. The
   result is classified as valid only when zero structured-data errors are reported for the
   page.

Each completed run is written as a single timestamped JSON record under `docs/seo/audits/`.

---

## Prerequisites

- Node.js `>= 24` (see `.nvmrc` / `package.json` `engines`).
- Project dependencies installed: `npm install`.
- A running site to audit. Use the production build so scores reflect real delivery:

  ```bash
  npm run build
  npm run start        # serves the production build on http://localhost:3000
  ```

  Audit the live domain (`https://theclientpilot.store`) or the local production server,
  depending on what you want to measure. Use the same target for every run you intend to
  compare.

---

## Running the audit

Run the script directly with Node from the project root:

```bash
# Standard run — records a timestamped audit under docs/seo/audits/
node scripts/seo-audit.mjs
```

### Recording the baseline

The **first** audit — run before any optimization changes are applied — is recorded as the
`Baseline_Audit`. Flag it explicitly so the record is marked `"isBaseline": true`:

```bash
# Record the baseline (run once, before optimization work)
node scripts/seo-audit.mjs --baseline
```

### Comparing a later run against the baseline

After optimization, run the audit again and compare against the recorded baseline. The
comparison prints the post-optimization SEO score alongside the baseline score for each page:

```bash
# Post-optimization run + baseline comparison
node scripts/seo-audit.mjs --compare
```

> The exact flag names are defined by the script (task 8.1). The three procedures above —
> standard run, baseline flagging, and baseline-vs-post comparison — are the documented,
> supported workflows.

---

## Output

Each run writes one record to `docs/seo/audits/<timestamp>.json`. The record shape is:

```jsonc
{
  "timestamp": "2024-01-01T00:00:00Z",   // identifies the audit run
  "isBaseline": true,                     // true only for the Baseline_Audit
  "pages": [
    {
      "url": "https://theclientpilot.store",
      "seoScore": 96,                     // Lighthouse SEO score, 0–100
      "coreWebVitals": {
        "lcpMs": 2100,                    // Largest Contentful Paint, ms
        "cls": 0.02,                      // Cumulative Layout Shift
        "inpMs": 150                      // Interaction to Next Paint (or lab proxy), ms
      },
      "structuredDataValid": true,        // true only when zero SD errors
      "structuredDataErrors": []
    }
  ]
}
```

Records are timestamped and never overwritten, so the full audit history is preserved in
`docs/seo/audits/`.

### On failure

If an audit fails to complete or does not produce an SEO score, the script leaves any
previously recorded audit results unchanged and returns an error indication describing the
failure. A failed run does not corrupt or replace existing records, including the baseline.

---

## Baseline vs post-optimization workflow

1. **Record the baseline** before touching the rendered app:

   ```bash
   node scripts/seo-audit.mjs --baseline
   ```

   This produces a record with `"isBaseline": true`. Commit it under `docs/seo/audits/`.

2. **Apply optimizations** (metadata, structured data, robots/sitemap, semantic markup,
   image alt attributes, Core Web Vitals hints). None of these change rendered visuals or
   visible copy.

3. **Run the post-optimization audit and compare**:

   ```bash
   node scripts/seo-audit.mjs --compare
   ```

   The post-optimization SEO score for each page is presented alongside the baseline score
   so the improvement is visible at a glance.

### Interpreting the comparison

- **Target:** every audited page should reach an SEO score of **at least 95/100**. A score
  below 95 is recorded as a failed target and the run returns an indication that the minimum
  score was not met.
- **Core Web Vitals targets:** LCP ≤ 2.5s, CLS ≤ 0.1, INP (or lab proxy) ≤ 200ms.
- **Structured data:** `structuredDataValid` must be `true` (zero errors) on every page.
- Compare `seoScore`, `coreWebVitals`, and `structuredDataValid` in the post-optimization
  record against the baseline record of the same page.

---

## Reproducibility expectation (≤ 3 points)

The audit is re-runnable via the documented command above. Lab audits carry small run-to-run
variance, so a single repeated run is not expected to be bit-identical. The expectation is:

> **Repeated audit runs against an unchanged site SHALL produce SEO score values that differ
> by no more than 3 points.**

When validating reproducibility, run the audit two or more times against the same unchanged
target and confirm the SEO scores stay within a 3-point spread. A larger spread indicates an
unstable measurement environment (background load, network throttling variance, a changing
site) rather than a real SEO change, and should be investigated before trusting a comparison.

Tips for stable, comparable runs:

- Audit the same target (same URL, same build) for every run you compare.
- Prefer the production build (`npm run build && npm run start`) over the dev server.
- Minimize competing load on the machine running the audit.

---

## Related documents

- `docs/seo/off-page-enablers.md` — GBP creation, review acquisition, local citation
  building, the no-guarantee statement, and the sitemap submission URL.
- `docs/seo/audits/` — timestamped audit records, including the `Baseline_Audit`.
