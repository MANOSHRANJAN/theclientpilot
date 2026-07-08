# Implementation Plan: SEO Ranking Optimization

## Overview

This plan implements the design in two layers, in dependency order. The **pure logic layer** (`src/lib`: SEO config, URL helpers, structured-data builders, metadata builder, validation, image-audit, heading-order, audit-classification) is built and property-tested first, because it has clear input/output behavior and carries the omit-when-unavailable, NAP-consistency, absolute-URL, and length-clamp invariants. Only then is the **framework/IO layer** (`src/app` route files, `opengraph-image`, `layout.tsx`, component semantic/alt/performance edits) wired on top of those pure functions.

A baseline SEO audit is recorded early — after the audit classification logic exists but **before** any optimization touches the rendered app (Req 11.4). The Playwright visual-regression gate (`maxDiffPixels: 0`, 320–1920px) captures pre-change reference screenshots before the semantic/alt/performance edits, and the pixel-identical assertion plus the final Lighthouse audit run at the very end.

The hard constraint is enforced throughout: **no change to rendered visuals or visible copy** (Req 1). Every markup, alt, and performance task is attribute-/tag-/config-only and is gated by the visual-regression harness.

Language: TypeScript (the existing Next.js 16 App Router codebase). Test tooling: `fast-check` for property-based tests, Playwright (already a devDependency) for DOM and visual-regression tests, Lighthouse for the audit script. Each property test lives in its own file (e.g. `structured-data.property1.test.ts`) so independent tests can run in parallel without file contention.

## Tasks

- [x] 1. Create the SEO config single source of truth
  - [x] 1.1 Implement `src/lib/seo.ts`
    - Define `OpeningHours`, `SeoConfig` interfaces exactly as in the design (required fields present; owner-provided NAP fields `streetAddress`, `postalCode`, `telephone`, `geo`, `openingHours`, `sameAs` optional/`undefined` when unavailable).
    - Export the `seoConfig` object with known values (`siteUrl`/`canonicalUrl` = `https://theclientpilot.store` no trailing slash, `siteName`, `addressLocality` Guwahati, `addressRegion` Assam, `addressCountry` IN, `areaServed` = Guwahati/Assam/Northeast India/India, `ogImagePath`, `ogImageAlt`, `title`, `description`). Leave unavailable owner fields omitted so downstream builders exercise the omit-path.
    - _Requirements: 5.1, 5.7, 5.8, 7.1, 7.7, 12.1_

- [x] 2. Implement URL helper module
  - [x] 2.1 Implement `src/lib/url.ts`
    - `isAbsoluteHttps(url)` (begins `https://` and has a host), `absoluteUrl(path, base)` (join with no double slash), `canonicalHome(base)` (base, no trailing slash beyond domain root).
    - _Requirements: 2.3, 2.4, 3.5, 4.2, 4.3, 5.5, 5.6, 6.4, 7.1_
  - [ ]* 2.2 Write unit tests for URL helpers (`url.test.ts`)
    - Cover trailing-slash normalization, path joining, and https/host detection edge cases.
    - _Requirements: 3.5, 7.1_

- [x] 3. Implement structured-data builders
  - [x] 3.1 Implement `src/lib/structured-data.ts`
    - `buildOrganization`, `buildWebSite`, `buildLocalBusiness` (`["ProfessionalService","LocalBusiness"]`), `buildFaqPage`, `buildAllStructuredData`.
    - Pass every `url`/`logo`/`image`/`sameAs` value through `absoluteUrl`/`isAbsoluteHttps`; `image` references the raster OG image absolute URL (never the SVG).
    - Conditionally include `streetAddress`, `postalCode`, `telephone`, `geo`, `openingHoursSpecification`, `sameAs` only when the config field is defined, non-empty, and satisfies its format/range constraint; otherwise omit the property entirely.
    - Organization and LocalBusiness read identical NAP + telephone from the single config.
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.8, 5.9, 6.1, 6.4, 6.5, 6.7, 12.1_
  - [ ]* 3.2 Write property test for field omission (`structured-data.property1.test.ts`)
    - **Property 1: Unavailable owner fields are omitted, never emitted empty**
    - Use a `fast-check` `SeoConfig` arbitrary toggling each owner field present/absent; assert no emitted property is empty/null/placeholder and unavailable fields are absent keys. Min 100 iterations; tag: `Feature: seo-ranking-optimization, Property 1`.
    - **Validates: Requirements 5.8**
  - [ ]* 3.3 Write property test for LocalBusiness format/range conformance (`structured-data.property3.test.ts`)
    - **Property 3: LocalBusiness values conform to their format and range constraints**
    - Generate valid/invalid `telephone`, `geo`, `openingHours`; assert emitted values match E.164 / lat[-90,90] / lon[-180,180] / `HH:MM` / Monday–Sunday, and any non-conforming field is omitted. Min 100 iterations; tag: `Feature: seo-ranking-optimization, Property 3`.
    - **Validates: Requirements 5.2, 5.3, 5.4, 5.9**
  - [ ]* 3.4 Write property test for required properties (`structured-data.property4.test.ts`)
    - **Property 4: Each block contains its schema.org-required properties**
    - Assert each block includes its required properties and LocalBusiness address always has `addressLocality`=Guwahati, `addressRegion`=Assam, `addressCountry`=IN. Min 100 iterations; tag: `Feature: seo-ranking-optimization, Property 4`.
    - **Validates: Requirements 5.1, 6.1**
  - [ ]* 3.5 Write property test for NAP consistency (`structured-data.property5.test.ts`)
    - **Property 5: NAP values are identical across Organization and LocalBusiness**
    - Assert business name, postal address fields, and telephone are character-identical (after trim) across Organization and LocalBusiness. Min 100 iterations; tag: `Feature: seo-ranking-optimization, Property 5`.
    - **Validates: Requirements 6.5**
  - [ ]* 3.6 Write unit tests for `areaServed` and raster image reference
    - Assert `areaServed` contains Guwahati/Assam/Northeast India/India and `image` is the raster OG URL, not the SVG.
    - _Requirements: 5.6, 5.7, 6.7_

- [x] 4. Implement metadata builder
  - [x] 4.1 Implement `src/lib/metadata.ts`
    - `clampText(value, max)` trims to `<= max` at a word boundary without introducing characters not in the source. `buildMetadata(config)` returns Next.js `Metadata` with: title clamped `<=60`, description clamped `<=160`; exactly one `alternates.canonical` = `canonicalUrl`; `robots.index=true`, `robots.follow=true`; `verification.google` set only when a token is configured; OG + Twitter `images` referencing the raster OG image with width 1200, height 630, non-empty alt `<=420`.
    - _Requirements: 4.2, 4.3, 4.4, 7.1, 7.3, 7.4, 7.5, 7.6, 7.7_
  - [ ]* 4.2 Write property test for length clamping (`metadata.property7.test.ts`)
    - **Property 7: Title and description are clamped within length bounds**
    - Generate arbitrary (including overlong) title/description; assert rendered title 1–60 and description 1–160, derived from a prefix of the source. Min 100 iterations; tag: `Feature: seo-ranking-optimization, Property 7`.
    - **Validates: Requirements 7.3, 7.4**
  - [ ]* 4.3 Write property test for metadata single-value invariants (`metadata.property6.test.ts`)
    - **Property 6: Metadata single-value invariants hold**
    - Assert exactly one canonical = `canonicalUrl`, `index=true`/`follow=true`, at most one Google token (exactly one when configured), OG image 1200×630 with non-empty alt `<=420`. Min 100 iterations; tag: `Feature: seo-ranking-optimization, Property 6`.
    - **Validates: Requirements 4.4, 7.1, 7.5, 7.7**
  - [ ]* 4.4 Write property test for absolute-https URL invariant (`metadata.property2.test.ts`)
    - **Property 2: Every URL-bearing field is an absolute https URL**
    - Across builders + metadata + the pure canonical/robots-host/sitemap URL values produced by the helpers: assert every `url`/`logo`/`image`/`sameAs`, OG/Twitter image, canonical, robots host, sitemap host, and sitemap entry URL begins with `https://` + host, with no trailing slash beyond the domain root for canonical/sitemap URLs. Min 100 iterations; tag: `Feature: seo-ranking-optimization, Property 2`.
    - **Validates: Requirements 2.3, 2.4, 3.5, 4.2, 4.3, 5.5, 5.6, 6.4, 7.1**
  - [ ]* 4.5 Write unit tests for `lang` and conflict flagging integration
    - Assert `lang="en"` is produced and a single verification token is present.
    - _Requirements: 7.6, 7.7_

- [x] 5. Implement structured-data validation and GBP-readiness utilities
  - [x] 5.1 Implement `src/lib/seo-validate.ts`
    - Pure validators returning structured errors: missing schema.org-required property (identify entity type + property); inconsistent NAP between Organization and LocalBusiness (identify property + both values); duplicate/differing canonical declaration; duplicate Google verification token; and a `gbpReadiness(config)` validator returning the exact set of missing fields among business name, postal address, telephone, non-empty `sameAs`.
    - _Requirements: 6.3, 6.6, 7.2, 7.8, 12.2_
  - [ ]* 5.2 Write property test for GBP-readiness (`seo-validate.property11.test.ts`)
    - **Property 11: GBP-readiness validation returns the exact missing-field set**
    - Assert readiness is satisfied iff name, address, telephone, and non-empty `sameAs` are all present, and otherwise returns exactly the missing set. Min 100 iterations; tag: `Feature: seo-ranking-optimization, Property 11`.
    - **Validates: Requirements 12.1, 12.2**
  - [ ]* 5.3 Write unit tests for validation error messages
    - Cover missing-required, inconsistent-NAP, duplicate-canonical, duplicate-verification error shapes.
    - _Requirements: 6.3, 6.6, 7.2, 7.8_

- [x] 6. Implement image-audit, heading-order, and audit-classification pure utilities
  - [x] 6.1 Implement `src/lib/image-audit.ts`
    - Given image descriptors, classify content vs decorative; accept content image only when `alt` is 1–125 chars, accept decorative only when `alt` is `""`, and flag content images with missing/empty `alt`. No rendering side effects.
    - _Requirements: 9.1, 9.2, 9.4_
  - [ ]* 6.2 Write property test for image-alt classification (`image-audit.property8.test.ts`)
    - **Property 8: Image alt audit classifies and flags correctly**
    - Generate arbitrary image descriptor sets; assert acceptance/flagging exactly matches the rule. Min 100 iterations; tag: `Feature: seo-ranking-optimization, Property 8`.
    - **Validates: Requirements 9.1, 9.2, 9.4**
  - [x] 6.3 Implement `src/lib/heading-order.ts`
    - Checker over a sequence of heading levels that reports valid iff, in document order, no heading is more than one level deeper than the nearest preceding heading.
    - _Requirements: 8.3_
  - [ ]* 6.4 Write property test for heading order (`heading-order.property9.test.ts`)
    - **Property 9: Heading order never skips more than one level**
    - Generate arbitrary heading-level sequences; assert the checker's verdict matches the rule. Min 100 iterations; tag: `Feature: seo-ranking-optimization, Property 9`.
    - **Validates: Requirements 8.3**
  - [x] 6.5 Implement `src/lib/audit-classify.ts`
    - Given a structured-data error list and an SEO score 0–100, classify SD validity as valid iff the error list is empty, and classify the score as meeting target iff `>= 95`.
    - _Requirements: 11.3, 11.8_
  - [ ]* 6.6 Write property test for audit classification (`audit-classify.property10.test.ts`)
    - **Property 10: Audit scoring classification is correct**
    - Generate arbitrary error lists and scores; assert both classifications. Min 100 iterations; tag: `Feature: seo-ranking-optimization, Property 10`.
    - **Validates: Requirements 11.3, 11.8**

- [x] 7. Checkpoint - pure logic layer
  - Ensure all tests pass, ask the user if questions arise.

- [x] 8. Set up audit tooling and record the baseline (before any optimization wiring)
  - [x] 8.1 Implement `scripts/seo-audit.mjs`
    - Run a Lighthouse mobile lab audit (simulated mobile, default throttling) for SEO + Core Web Vitals against each indexable URL, plus a structured-data validation step; use `audit-classify.ts` for validity/score classification; write a timestamped record to `docs/seo/audits/<timestamp>.json` (shape per design: `timestamp`, `isBaseline`, per-page `seoScore`/`coreWebVitals`/`structuredDataValid`/`structuredDataErrors`). On failure, retain previously recorded results unchanged and return an error indication. Support baseline flagging and baseline-vs-post comparison.
    - _Requirements: 11.1, 11.2, 11.5, 11.6, 11.9, 10.1, 10.2, 10.3, 10.6_
  - [x] 8.2 Create `docs/seo/README.md`
    - Document the re-runnable audit command/procedure and the `<=3` point reproducibility expectation.
    - _Requirements: 11.9_
  - [x] 8.3 Run the baseline audit and record it as the Baseline_Audit
    - Execute the audit script against the current (pre-optimization) site and commit the resulting record with `isBaseline: true` under `docs/seo/audits/`.
    - _Requirements: 11.2, 11.4_

- [x] 9. Implement robots and sitemap routes
  - [x] 9.1 Implement `src/app/robots.ts`
    - Return `MetadataRoute.Robots`: `{ userAgent: "*", allow: "/", disallow: ["/api/","/_next/"] }`, `sitemap: "https://theclientpilot.store/sitemap.xml"`, `host: "https://theclientpilot.store"`, built atomically from config/url helpers (no partial output on error).
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 12.6_
  - [ ]* 9.2 Write integration test for `/robots.txt`
    - Assert HTTP 200, `text/plain`, `<1000ms`, wildcard allow, disallow `/api/` + `/_next/`, sitemap + host values; verify no partial body on the failure path.
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6_
  - [x] 9.3 Implement `src/app/sitemap.ts`
    - Return `MetadataRoute.Sitemap` with exactly one entry `{ url: canonicalHome(base), lastModified: <ISO8601> }`; built atomically (no malformed body on error).
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6_
  - [ ]* 9.4 Write unit + integration tests for sitemap
    - Unit: exactly one entry, canonical home URL, ISO-8601 `lastModified`. Integration: HTTP 200, well-formed UTF-8 XML, `application/xml`, `<1000ms`, 5xx-on-failure with no partial body.
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.6_

- [x] 10. Implement the OG image route
  - [x] 10.1 Implement `src/app/opengraph-image.tsx`
    - Export `size = { width: 1200, height: 630 }`, `contentType = "image/png"`, and a default `ImageResponse` producing a 1200×630 PNG `<5MB` that embeds no visible-page copy; error path returns HTTP `>=400`, never image content typed `image/png`/`image/jpeg`.
    - _Requirements: 4.1, 4.5, 4.6_
  - [ ]* 10.2 Write integration test for the OG image
    - Assert 1200×630, PNG, `<5MB`, HTTP 200 within 2s, and error path `>=400` without image content type.
    - _Requirements: 4.1, 4.5, 4.6_

- [x] 11. Refactor `layout.tsx` to consume the builders
  - [x] 11.1 Refactor `src/app/layout.tsx`
    - Replace inline metadata with `export const metadata = buildMetadata(seoConfig)`; inject JSON-LD via `<Script type="application/ld+json">` for each block from `buildAllStructuredData(seoConfig)`; ensure `lang="en"` on `<html>`; keep exactly one Google verification token. No change to rendered body markup or copy.
    - _Requirements: 4.2, 4.3, 4.4, 5.6, 6.2, 7.1, 7.5, 7.6, 7.7_
  - [ ]* 11.2 Write integration test for rendered structured data
    - Run the structured-data validator against the rendered page: zero errors across all four blocks; referenced image URLs return HTTP 200 within 5s; unreachable image flagged.
    - _Requirements: 6.2, 6.7, 6.8_

- [x] 12. Apply single-h1 semantic markup fix (zero visual change)
  - [x] 12.1 Consolidate the two `<h1>` in `src/components/Hero.tsx`
    - Keep a single `<h1>`; convert the second visible line to a non-heading element (`<span>`/`<div>`) carrying the identical `display` styling class so computed text, position, dimensions, typography, and color are unchanged.
    - _Requirements: 8.1, 8.4, 8.5, 8.6_
  - [x] 12.2 Fix headings/landmarks in `src/app/page.tsx`
    - Demote the `sr-only` `<h1>` to `<h2>` (or remove) so heading order stays sequential; keep exactly one `<main>`; ensure descending levels never skip more than one. `sr-only` keeps it non-visual.
    - _Requirements: 8.2, 8.3, 8.7, 1.3_
  - [ ]* 12.3 Write Playwright DOM/semantic test
    - Assert exactly one `<h1>` and one `<main>` in the rendered document, and the rendered heading sequence passes the heading-order checker.
    - _Requirements: 8.1, 8.2, 8.3_

- [x] 13. Audit and fix image alt attributes (attribute-only)
  - [x] 13.1 Apply alt fixes across components using the image-audit utility
    - For every content image ensure a 1–125 char descriptive `alt`; for decorative images set `alt=""`. Attribute-only edits, no change to rendered dimensions/position/pixels.
    - _Requirements: 9.1, 9.2, 9.3, 9.4_
  - [ ]* 13.2 Write test asserting alt compliance
    - Run `image-audit` over the rendered image set; assert zero flagged content images and decorative images have empty alt.
    - _Requirements: 9.1, 9.2, 9.4_

- [x] 14. Apply Core Web Vitals performance hints (no visual change)
  - [x] 14.1 Convert content images to `next/image` with explicit dimensions
    - Use `next/image` with explicit `width`/`height` matching intrinsic aspect ratio and modern formats (WebP/AVIF via Next image optimization), with original-format fallback when next-gen is unavailable. Exclude any change that would alter rendered appearance.
    - _Requirements: 10.4, 10.5, 10.6, 10.7_
  - [ ]* 14.2 Write integration test for image delivery
    - Assert content images are served WebP/AVIF (with original-format fallback) and render with explicit width/height matching aspect ratio.
    - _Requirements: 10.4, 10.6, 10.7_

- [x] 15. Build the visual-regression acceptance gate
  - [x] 15.1 Implement the Playwright visual-diff harness and capture pre-change references
    - `toHaveScreenshot` with `maxDiffPixels: 0` at viewport widths 320, 375, 414, 768, 1024, 1280, 1920; add a visible text-node comparison to detect added/removed/modified visible copy; wire a mechanism to record a rejection and revert when the gate fails. Capture the pre-optimization reference screenshots before the semantic/alt/performance edits are applied.
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6_
  - [ ]* 15.2 Run the visual-regression gate against post-change renders
    - Compare post-change renders to references at all widths; assert zero differing pixels and unchanged visible text; confirm any failing change is reverted and its rejection recorded.
    - _Requirements: 1.1, 1.2, 8.4, 8.5, 8.6, 8.7, 9.3, 10.5_

- [x] 16. Document off-page enablers and sitemap submission
  - [x] 16.1 Create `docs/seo/off-page-enablers.md`
    - Document, as separate items, GBP creation, review acquisition, and local citation building; include the no-guarantee statement enumerating GBP, reviews, backlinks, and competition; include the sitemap submission URL `https://theclientpilot.store/sitemap.xml`.
    - _Requirements: 12.4, 12.5, 12.6_
  - [x] 16.2 Implement the sitemap-submission helper (`src/lib/sitemap-submit.ts`)
    - Provide the sitemap absolute URL for Search Console submission and surface an unavailability indication rather than returning a broken URL when the sitemap is unavailable.
    - _Requirements: 12.6, 12.7_

- [x] 17. Run the post-optimization audit
  - [x] 17.1 Execute the audit script post-optimization and compare against baseline
    - Record the post-optimization SEO score, Core Web Vitals, and structured-data validity; present alongside the Baseline_Audit score; assert score `>= 95` (record a failed-target indication otherwise); confirm re-runs against the unchanged site differ by `<= 3` points.
    - _Requirements: 11.5, 11.7, 11.8, 11.9_

- [~] 18. Final checkpoint
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional test sub-tasks and can be skipped for a faster MVP; core implementation tasks are never optional.
- Each task references specific requirement sub-clauses for traceability.
- Property tests use `fast-check`, run a minimum of 100 iterations each, are tagged `Feature: seo-ranking-optimization, Property {n}`, and map 1:1 to the 11 Correctness Properties in the design. Each property test lives in its own file so it can run in parallel.
- Pure logic modules and their property tests (tasks 1–6) precede all framework/IO wiring (tasks 8–16), per the design's two-layer split.
- The baseline audit (8.3) is recorded before any optimization touches the rendered app (Req 11.4); the visual-regression gate (15) and post-optimization Lighthouse audit (17) run at the end.
- The no-visual-change constraint (Req 1) governs every markup/alt/performance edit and is enforced by the visual-regression gate.

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "2.1", "16.1"] },
    { "id": 1, "tasks": ["2.2", "3.1", "4.1", "5.1", "6.1", "6.3", "6.5", "8.2"] },
    { "id": 2, "tasks": ["3.2", "3.3", "3.4", "3.5", "3.6", "4.2", "4.3", "4.4", "4.5", "5.2", "5.3", "6.2", "6.4", "6.6", "8.1"] },
    { "id": 3, "tasks": ["8.3", "9.1", "9.3", "10.1", "15.1", "16.2"] },
    { "id": 4, "tasks": ["9.2", "9.4", "10.2", "11.1"] },
    { "id": 5, "tasks": ["11.2", "12.1", "12.2"] },
    { "id": 6, "tasks": ["12.3", "13.1"] },
    { "id": 7, "tasks": ["13.2", "14.1"] },
    { "id": 8, "tasks": ["14.2"] },
    { "id": 9, "tasks": ["15.2", "17.1"] }
  ]
}
```
