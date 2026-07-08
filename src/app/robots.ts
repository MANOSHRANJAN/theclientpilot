import type { MetadataRoute } from "next";

import { seoConfig } from "@/lib/seo";
import { absoluteUrl, canonicalHome } from "@/lib/url";

/**
 * Robots route (`/robots.txt`).
 *
 * Next.js serves the returned `MetadataRoute.Robots` as a `text/plain`
 * response with an HTTP 200 status. The object is built atomically from the
 * SEO config and URL helpers — all values are computed first, then returned in
 * a single expression, so no partial or malformed directive can ever be
 * emitted. If any value cannot be computed the function throws before
 * returning, and Next.js serves a 5xx response with no partial body
 * (Req 2.6).
 *
 * - Wildcard rule allows crawling of all resources except the disallowed
 *   non-public paths (build artifacts and internal API routes) (Req 2.2, 2.5).
 * - Declares the sitemap absolute URL (Req 2.3, 12.6).
 * - Declares the canonical host absolute URL (Req 2.4).
 */
export default function robots(): MetadataRoute.Robots {
  const host = canonicalHome(seoConfig.siteUrl);
  const sitemap = absoluteUrl("/sitemap.xml", seoConfig.siteUrl);

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/_next/"],
    },
    sitemap,
    host,
  };
}
