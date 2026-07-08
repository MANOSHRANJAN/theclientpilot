import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright configuration for the SEO no-visual-change acceptance gate.
 *
 * Requirement 1 (seo-ranking-optimization) mandates that every SEO edit leave
 * the rendered output pixel-identical and the visible copy unchanged. This
 * config wires the visual-regression project that operationalizes that gate:
 *   - baseURL points at the local Next.js server (http://localhost:3000)
 *   - toHaveScreenshot defaults to maxDiffPixels: 0 (ANY differing pixel fails)
 *
 * The gate is asserted by tests/visual/no-visual-change.spec.ts. See
 * tests/visual/README.md for the pre-change reference-capture procedure.
 */
export default defineConfig({
  testDir: "./tests/visual",
  // Deterministic ordering; screenshots must be reproducible run-to-run.
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,
  reporter: [["list"]],

  // Zero-tolerance pixel diff — Req 1.1/1.5/1.6: any diff fails the gate.
  expect: {
    toHaveScreenshot: {
      maxDiffPixels: 0,
      // No ratio/threshold leniency: a single differing pixel is a failure.
      maxDiffPixelRatio: 0,
      animations: "disabled",
      caret: "hide",
    },
  },

  use: {
    baseURL: "http://localhost:3000",
    // Deterministic rendering hints.
    colorScheme: "light",
    reducedMotion: "reduce",
  },

  projects: [
    {
      name: "visual-regression",
      use: { ...devices["Desktop Chrome"] },
    },
  ],

  /**
   * Local server for the gate. `reuseExistingServer` lets you either point at a
   * server you already started (e.g. `npm run dev`) or let Playwright start one.
   * `npm run build && npm run start` is preferred for stable production-mode
   * rendering, but dev works for a quick local run.
   */
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
