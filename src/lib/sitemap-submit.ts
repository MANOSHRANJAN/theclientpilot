/**
 * Sitemap-submission helper for Google Search Console.
 *
 * Pure, dependency-free logic that produces the absolute sitemap URL to submit
 * to Search Console (Req 12.6) and, when the sitemap is unavailable, surfaces a
 * typed unavailability indication rather than returning a broken URL (Req 12.7).
 *
 * The sitemap URL is derived from the single SEO config source of truth via the
 * URL helpers, so it stays consistent with the canonical host and the
 * `app/sitemap.ts` route (`https://theclientpilot.store/sitemap.xml`).
 */

import { seoConfig, type SeoConfig } from "./seo";
import { absoluteUrl, canonicalHome } from "./url";

/** Path (relative to the canonical host) at which the sitemap is served. */
export const SITEMAP_PATH = "/sitemap.xml";

/**
 * Result of resolving the sitemap submission URL.
 *
 * A discriminated union: when the sitemap is available the caller receives a
 * concrete absolute `url` to submit; when it is unavailable the caller receives
 * a human-readable `reason` and no URL, guaranteeing a broken URL is never
 * handed to Search Console.
 */
export type SitemapSubmission =
  | { available: true; url: string }
  | { available: false; reason: string };

/**
 * Builds the absolute sitemap URL from the SEO config using the URL helpers.
 *
 * @param config - The SEO config providing the canonical host.
 * @returns The absolute sitemap URL, e.g. `https://theclientpilot.store/sitemap.xml`.
 */
export function getSitemapUrl(config: SeoConfig = seoConfig): string {
  const base = canonicalHome(config.siteUrl);
  return absoluteUrl(SITEMAP_PATH, base);
}

/**
 * Resolves the sitemap URL to submit to Google Search Console.
 *
 * When `available` is `true`, returns a success result carrying the absolute
 * sitemap URL (Req 12.6). When `available` is `false`, returns a failure result
 * carrying a reason string instead of a URL, so a broken URL is never submitted
 * (Req 12.7).
 *
 * @param available - Whether the sitemap is currently available at submission time.
 * @param config - The SEO config providing the canonical host (defaults to `seoConfig`).
 * @returns A typed {@link SitemapSubmission} result.
 */
export function getSitemapSubmissionUrl(
  available: boolean,
  config: SeoConfig = seoConfig,
): SitemapSubmission {
  if (!available) {
    return {
      available: false,
      reason:
        "Sitemap is unavailable; not providing a submission URL to Search Console.",
    };
  }

  return { available: true, url: getSitemapUrl(config) };
}
