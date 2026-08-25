import type { MetadataRoute } from "next";

import { LANDING_PAGES } from "@/lib/landing-pages";
import { seoConfig } from "@/lib/seo";
import { absoluteUrl, canonicalHome } from "@/lib/url";

/**
 * Sitemap route (`/sitemap.xml`).
 *
 * Next.js turns the default export of this file into a well-formed, UTF-8,
 * `application/xml` sitemap conforming to the sitemaps.org protocol.
 *
 * The sitemap lists exactly one entry: the canonical home-page URL derived from
 * the single SEO config source of truth via {@link canonicalHome} (absolute
 * https, no trailing slash beyond the domain root), with an ISO 8601
 * `lastModified` timestamp.
 *
 * The entry is constructed atomically — the full array is built and returned in
 * one expression — so a failure while producing it throws before any partial or
 * malformed body can be emitted, letting the framework serve a 5xx response
 * instead (Req 3.6).
 *
 * Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    {
      url: canonicalHome(seoConfig.siteUrl),
      lastModified,
      // The home page stays the highest-priority URL; the landing pages below
      // target individual query intents and are ranked slightly under it.
      priority: 1,
    },
    ...LANDING_PAGES.map((page) => ({
      url: absoluteUrl(page.slug, seoConfig.siteUrl),
      lastModified,
      priority: 0.8,
    })),
  ];
}
