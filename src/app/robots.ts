import type { MetadataRoute } from "next";

import { seoConfig } from "@/lib/seo";
import { absoluteUrl, canonicalHome } from "@/lib/url";

/**
 * AI crawlers granted an explicit allow rule.
 *
 * The wildcard rule below already permits every one of these, so these entries
 * change no bot's actual behaviour. They are declared anyway because several of
 * these operators document that they look for their own user-agent token first
 * and only fall back to `*`, and because an explicit, named allow is a clear
 * public statement of intent — useful if a crawler's default posture ever
 * changes to "opt-in only".
 *
 * Two distinct classes are listed together deliberately:
 * - Retrieval/search bots (`OAI-SearchBot`, `PerplexityBot`, `Claude-SearchBot`,
 *   `ChatGPT-User`) fetch pages to answer a live user question and cite the
 *   source. These are what put TheClientPilot in front of someone asking an AI
 *   for an agency in Guwahati.
 * - Training crawlers (`GPTBot`, `ClaudeBot`, `Google-Extended`, `CCBot`,
 *   `Applebot-Extended`, `meta-externalagent`) collect data for model training.
 *   Allowing these is what gets the brand into a model's parametric knowledge,
 *   so it can be named even with no live retrieval.
 *
 * `Google-Extended` and `Applebot-Extended` are not crawlers at all — they are
 * AI-usage opt-out tokens for content Googlebot/Applebot already fetched.
 * Allowing them keeps the site eligible for Gemini and Apple Intelligence
 * grounding without affecting normal search indexing either way.
 */
const AI_CRAWLERS: readonly string[] = [
  // OpenAI
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  // Anthropic
  "ClaudeBot",
  "Claude-SearchBot",
  "Claude-User",
  // Perplexity
  "PerplexityBot",
  "Perplexity-User",
  // Google / Apple AI-usage controls
  "Google-Extended",
  "Applebot-Extended",
  // Meta, Amazon, Common Crawl, DuckDuckGo, Mistral
  "meta-externalagent",
  "Amazonbot",
  "CCBot",
  "DuckAssistBot",
  "MistralAI-User",
];

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
 *   non-public paths (internal API routes) (Req 2.2, 2.5).
 * - Every AI crawler in {@link AI_CRAWLERS} gets the same allow/disallow pair,
 *   so `/api/` stays off-limits to them too rather than an explicit `Allow: /`
 *   accidentally widening their access beyond the wildcard rule's.
 * - `/_next/` is deliberately NOT disallowed. Google requires access to a
 *   page's CSS and JavaScript to render and evaluate it; blocking `/_next/`
 *   blocks every static chunk and every optimized image, which degrades
 *   rendering, Core Web Vitals assessment and image indexing.
 * - Declares the sitemap absolute URL (Req 2.3, 12.6).
 * - Declares the canonical host absolute URL (Req 2.4).
 */
export default function robots(): MetadataRoute.Robots {
  const host = canonicalHome(seoConfig.siteUrl);
  const sitemap = absoluteUrl("/sitemap.xml", seoConfig.siteUrl);

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"],
      },
      ...AI_CRAWLERS.map((userAgent) => ({
        userAgent,
        allow: "/",
        disallow: ["/api/"],
      })),
    ],
    sitemap,
    host,
  };
}
