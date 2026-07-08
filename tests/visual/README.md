# Visual-regression acceptance gate (no-visual-change)

This harness enforces **Requirement 1** of the `seo-ranking-optimization` spec:
every SEO optimization must be "under the hood" and must **not** change the
rendered output or the visible copy at any supported viewport width.

- **Pixel gate (Req 1.1, 1.3, 1.4):** `toHaveScreenshot({ maxDiffPixels: 0 })`
  at widths **320, 375, 414, 768, 1024, 1280, 1920**. A single differing pixel
  fails the gate.
- **Visible-copy gate (Req 1.2):** a committed visible-text snapshot
  (`home-visible-text.txt`) detects any added / removed / modified visible copy.
- **Rejection on diff (Req 1.5, 1.6):** if the gate fails, the offending change
  must be **reverted** and the rejection **recorded**.

## Files

- `../../playwright.config.ts` — `visual-regression` project, `baseURL`
  `http://localhost:3000`, `expect.toHaveScreenshot` default `maxDiffPixels: 0`.
- `no-visual-change.spec.ts` — the gate itself.
- `no-visual-change.spec.ts-snapshots/` — committed reference screenshots and
  the `home-visible-text.txt` snapshot (created by `--update-snapshots`).

## Determinism (animated hero)

The Hero contains non-deterministic motion that is neutralized so screenshots
are reproducible:

- **JS-driven rotating word** (`.hero-word`, swaps every 2.2s): its text is
  changed by React state and cannot be frozen with CSS, so it is **masked** in
  screenshots and **excluded** from the visible-text snapshot.
- **CSS animations** (slow-spin star `.animate-spin-slow`, marquee, letter
  reveals): frozen via an injected stylesheet that disables all
  animations/transitions.

## Prerequisites (one-time, run manually — not part of task 15.1)

The test **runner** and browser binaries are not installed yet:

```bash
npm i -D @playwright/test    # test runner + expect(page).toHaveScreenshot
npx playwright install chromium
```

## Pre-change reference procedure (IMPORTANT)

The SEO edits are **already applied** on this working tree, so reference
artifacts must be captured from the **pre-change** git state. Otherwise the gate
would compare the changed site against itself and never catch a regression.

1. Move to the pre-change state (choose one):
   ```bash
   git stash                 # if the SEO edits are uncommitted
   # or
   git checkout <base-commit> # the commit before the SEO edits
   ```
2. Capture the reference screenshots and visible-text snapshot:
   ```bash
   npm run test:visual:update
   ```
3. Restore the current (post-change) working tree:
   ```bash
   git stash pop             # or: git checkout -
   ```
4. Assert zero pixel diff and unchanged visible copy against the references:
   ```bash
   npm run test:visual
   ```

**The gate fails on any diff.** If step 4 reports differing pixels or a changed
visible-text snapshot, the SEO edit that caused it must be reverted (restoring
the pre-change rendering) and the rejection recorded (Req 1.5 / 1.6).

> Note: capture and assertion must use the **same** rendering mode and machine.
> Screenshots are environment-sensitive; run capture and comparison on the same
> OS/browser build (e.g. the same CI image) to avoid false positives.
