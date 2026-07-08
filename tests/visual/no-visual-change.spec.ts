/**
 * No-visual-change acceptance gate (seo-ranking-optimization Req 1.1–1.6).
 *
 * WHAT THIS GATE PROVES
 * ---------------------
 * Every SEO optimization in this spec must be "under the hood": it must leave
 * the rendered output pixel-identical and the visible copy unchanged at every
 * supported viewport width. This spec operationalizes that:
 *   - toHaveScreenshot({ maxDiffPixels: 0 }) at widths 320,375,414,768,1024,
 *     1280,1920 asserts ZERO differing pixels (Req 1.1, 1.3, 1.4).
 *   - A committed visible-text snapshot asserts that no visible copy is added,
 *     removed, or modified (Req 1.2).
 * Any diff fails the gate; a failing change must be reverted and the rejection
 * recorded (Req 1.5, 1.6).
 *
 * REFERENCE (PRE-CHANGE) PROCEDURE — READ tests/visual/README.md
 * --------------------------------------------------------------
 * Because the SEO edits are already applied on this working tree, the reference
 * screenshots / text snapshot must be captured from the PRE-CHANGE git state:
 *   1. Stash or check out the base commit:  git stash  (or)  git checkout <base>
 *   2. Capture references:                  npm run test:visual:update
 *   3. Restore the working tree:            git stash pop  (or)  git checkout -
 *   4. Assert zero diff on post-change:     npm run test:visual
 * The gate FAILS on any pixel diff or any visible-text change.
 *
 * DETERMINISM (animated hero)
 * ---------------------------
 * The Hero has (a) a JS-driven rotating word (`.hero-word`) that swaps every
 * 2.2s and (b) CSS animations (slow-spin star `.animate-spin-slow`, marquee,
 * letter reveals). CSS animations are frozen via an injected stylesheet
 * (animation/transition disabled). The rotating word cannot be frozen by CSS
 * because its text is swapped by React state, so it is MASKED in screenshots
 * and EXCLUDED from the visible-text snapshot.
 */
import { test, expect, type Page } from "@playwright/test";

// Supported viewport widths (Req 1.1–1.4). Height is fixed; full-page
// screenshots capture content below the fold regardless.
const VIEWPORT_WIDTHS = [320, 375, 414, 768, 1024, 1280, 1920] as const;
const VIEWPORT_HEIGHT = 900;

// Selector for the JS-driven rotating hero word (non-deterministic text).
const ROTATING_WORD_SELECTOR = ".hero-word";

/**
 * Freeze all CSS animations/transitions so screenshots are deterministic.
 * Snaps every animation to a stable state and removes transition timing.
 */
async function freezeAnimations(page: Page): Promise<void> {
  await page.addStyleTag({
    content: `
      *, *::before, *::after {
        animation-duration: 0s !important;
        animation-delay: 0s !important;
        animation-iteration-count: 1 !important;
        animation-play-state: paused !important;
        transition-duration: 0s !important;
        transition-delay: 0s !important;
        scroll-behavior: auto !important;
      }
    `,
  });
}

/**
 * Navigate, wait for the network to settle, freeze animations, and let layout
 * settle so the screenshot / text capture is deterministic.
 */
async function gotoHomeSettled(page: Page): Promise<void> {
  await page.goto("/", { waitUntil: "networkidle" });
  await freezeAnimations(page);
  // Allow fonts + any layout to settle after freezing.
  await page.evaluate(async () => {
    // @ts-expect-error - document.fonts exists in the browser context.
    if (document.fonts?.ready) await document.fonts.ready;
  });
  await page.waitForTimeout(300);
}

test.describe("No-visual-change gate (Req 1)", () => {
  for (const width of VIEWPORT_WIDTHS) {
    test(`renders pixel-identically at ${width}px wide`, async ({ page }) => {
      await page.setViewportSize({ width, height: VIEWPORT_HEIGHT });
      await gotoHomeSettled(page);

      // Req 1.1/1.3/1.4: zero differing pixels vs the pre-change reference.
      // The rotating hero word is masked because its text is JS-driven and
      // therefore non-deterministic; every other pixel must match exactly.
      await expect(page).toHaveScreenshot(`home-${width}.png`, {
        fullPage: true,
        maxDiffPixels: 0,
        animations: "disabled",
        mask: [page.locator(ROTATING_WORD_SELECTOR)],
      });
    });
  }

  test("visible copy is unchanged (visible-text snapshot)", async ({ page }) => {
    // Use a mid-range viewport; the visible text content is width-independent.
    await page.setViewportSize({ width: 1280, height: VIEWPORT_HEIGHT });
    await gotoHomeSettled(page);

    // Collect the innerText of every VISIBLE text node, excluding the JS-driven
    // rotating hero word. Any added/removed/modified visible copy changes this
    // string and fails the committed snapshot (Req 1.2).
    const visibleText = await page.evaluate((rotatingSelector) => {
      const isVisible = (el: Element): boolean => {
        const s = window.getComputedStyle(el);
        if (s.display === "none") return false;
        if (s.visibility === "hidden" || s.visibility === "collapse") return false;
        if (Number(s.opacity) === 0) return false;
        return true;
      };

      const parts: string[] = [];
      const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT,
      );
      let node: Node | null;
      while ((node = walker.nextNode())) {
        const parent = (node as Text).parentElement;
        if (!parent) continue;
        // Exclude the non-deterministic rotating word.
        if (parent.closest(rotatingSelector)) continue;
        // Exclude sr-only / metadata-only nodes are still "text"; the
        // visible-copy contract is about pixels a sighted user sees, so we
        // walk up the chain and require every ancestor to be visible.
        let el: Element | null = parent;
        let visible = true;
        while (el) {
          if (!isVisible(el)) {
            visible = false;
            break;
          }
          el = el.parentElement;
        }
        if (!visible) continue;
        const text = (node.textContent ?? "").replace(/\s+/g, " ").trim();
        if (text) parts.push(text);
      }
      return parts.join(" \u2022 ");
    }, ROTATING_WORD_SELECTOR);

    // Committed snapshot: written on `--update-snapshots`, asserted otherwise.
    expect(visibleText).toMatchSnapshot("home-visible-text.txt");
  });
});
