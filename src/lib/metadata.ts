/**
 * Metadata builder for the SEO system.
 *
 * Turns the single-source {@link SeoConfig} into a Next.js `Metadata` object.
 * All length clamping, canonical/robots/verification invariants, and the
 * absolute OG/Twitter image URL derivation live here as pure logic so they can
 * be unit- and property-tested independently of the framework.
 *
 * The `lang` attribute is intentionally NOT produced here — it stays on the
 * `<html>` element in `layout.tsx` (Req 7.6).
 */

import type { Metadata } from "next";
import type { LandingPage } from "./landing-pages";
import type { SeoConfig } from "./seo";
import { absoluteUrl } from "./url";

/** Maximum rendered length of the metadata title (Req 7.3). */
const TITLE_MAX = 60;
/** Maximum rendered length of the metadata description (Req 7.3). */
const DESCRIPTION_MAX = 160;
/** Maximum length of the OG image alt text (Req 4.4). */
const OG_ALT_MAX = 420;
/** OG/Twitter raster image dimensions (Req 4.4). */
const OG_IMAGE_WIDTH = 1200;
const OG_IMAGE_HEIGHT = 630;

/**
 * Auxiliary metadata fields preserved from the current `layout.tsx` metadata.
 * These are not part of {@link SeoConfig} but must be retained verbatim so the
 * layout refactor (task 11.1) produces identical output.
 */
const KEYWORDS = [
  "best agency in India",
  "best agency in Assam",
  "best agency in Guwahati",
  "best AI agency in India",
  "best AI agency in Assam",
  "best AI agency in Guwahati",
  "best digital marketing agency in India",
  "best digital marketing agency in Assam",
  "best digital marketing agency in Guwahati",
  "best marketing agency in Assam",
  "best marketing agency in Guwahati",
  "top agency in Guwahati",
  "top AI agency in Assam",
  "number 1 agency in Guwahati",
  "#1 marketing agency Assam",
  "best AI ads agency in India",
  "best AI ads agency in Assam",
  "best AI ads agency in Guwahati",
  "best website agency in India",
  "best website agency in Assam",
  "best website agency in Guwahati",
  "best web design agency Guwahati",
  "best web development company Guwahati",
  "best SEO agency Guwahati",
  "best Meta ads agency Guwahati",
  "best Google ads agency Guwahati",
  "best lead generation agency Assam",
  "best performance marketing agency Guwahati",
  "best AI automation agency Assam",
  "marketing agency for dentists in Guwahati",
  "marketing agency for clinics in Assam",
  "marketing agency for doctors in Guwahati",
  "marketing agency for spas in Guwahati",
  "dental marketing agency Assam",
  "aesthetic clinic marketing Guwahati",
  "healthcare marketing agency Northeast India",
  "best agency in Northeast India",
  "top digital agency Northeast India",
  "AI agency Northeast India",
  "Assam marketing company",
  "Guwahati advertising agency",
  "top advertising agency Assam",
  "best AI agents",
  "best AI ads agency",
  "best website agency",
  "AI marketing agency",
  "AI agents for business",
  "lead generation agency",
  "marketing agency for dentists",
  "marketing agency for spas",
  "marketing agency for doctors",
  "TheClientPilot",
  "The Client Pilot",
  "TCP agency",
  "TCP Guwahati",
  "TheClientPilot Assam",
  "TheClientPilot India",
] as const;

const ICONS: Metadata["icons"] = {
  icon: [
    { url: "/seo/favicon.ico" },
    { url: "/seo/logo.svg", type: "image/svg+xml" },
  ],
  shortcut: "/seo/favicon.ico",
  apple: "/seo/logo.svg",
};

/**
 * Trims `value` to at most `max` characters at a word boundary, without
 * introducing any character not already present in the source (no ellipsis or
 * other decorative characters are appended).
 *
 * The result is always a prefix of the source:
 * - If `value` already fits within `max`, it is returned unchanged.
 * - Otherwise the first `max` characters are taken and, when that split falls
 *   mid-word, the result is backed off to the last preceding word boundary and
 *   trailing whitespace is stripped.
 * - If a single leading word already exceeds `max` (no word boundary to back
 *   off to), the value is hard-trimmed to exactly `max` characters.
 *
 * @param value - The source string to clamp.
 * @param max - The maximum number of characters allowed in the result.
 * @returns A prefix-derived string of length `<= max`.
 */
export function clampText(value: string, max: number): string {
  if (max <= 0) {
    return "";
  }
  if (value.length <= max) {
    return value;
  }

  // The first `max` characters are the upper bound for the result.
  const candidate = value.slice(0, max);

  // If the source continues with whitespace right after the cut, the candidate
  // already ends on a complete word — just drop any trailing whitespace.
  if (/\s/.test(value.charAt(max))) {
    const trimmed = candidate.replace(/\s+$/, "");
    return trimmed.length > 0 ? trimmed : candidate;
  }

  // Otherwise the cut lands mid-word: back off to the last whitespace boundary.
  const lastBoundary = candidate.search(/\s\S*$/);
  if (lastBoundary === -1) {
    // A single word longer than `max`: hard-trim to `max`.
    return candidate;
  }

  const trimmed = candidate.slice(0, lastBoundary).replace(/\s+$/, "");
  // Guard against a whitespace-only prefix collapsing to empty.
  return trimmed.length > 0 ? trimmed : candidate;
}

/**
 * Builds the Next.js `Metadata` object from the SEO config, enforcing the
 * feature's metadata invariants:
 *
 * - `title` clamped to `<= 60`, `description` clamped to `<= 160` (Req 7.3/7.4).
 * - Exactly one `alternates.canonical` equal to `config.canonicalUrl`
 *   (Req 7.1).
 * - `robots.index = true`, `robots.follow = true`, preserving the existing
 *   googleBot directives (Req 7.5).
 * - `verification.google` set only when a token is configured (Req 7.7).
 * - OpenGraph + Twitter images reference the raster OG image at an absolute
 *   https URL, 1200x630, with a non-empty alt of at most 420 chars (Req 4.2/4.3/4.4).
 * - `keywords`, `applicationName`, `authors`, `creator`, `publisher`,
 *   `category`, and `icons` preserved from the current layout metadata.
 *
 * @param config - The single-source SEO configuration.
 * @returns A Next.js `Metadata` object.
 */
export function buildMetadata(config: SeoConfig): Metadata {
  const title = clampText(config.title, TITLE_MAX);
  const description = clampText(config.description, DESCRIPTION_MAX);
  const ogImageUrl = absoluteUrl(config.ogImagePath, config.siteUrl);
  const ogImageAlt = clampText(config.ogImageAlt, OG_ALT_MAX);

  const metadata: Metadata = {
    metadataBase: new URL(config.siteUrl),
    title,
    description,
    keywords: [...KEYWORDS],
    applicationName: config.siteName,
    authors: [{ name: config.siteName, url: config.siteUrl }],
    creator: config.siteName,
    publisher: config.siteName,
    category: "Marketing & Advertising",
    alternates: { canonical: config.canonicalUrl },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    icons: ICONS,
    openGraph: {
      type: "website",
      url: config.canonicalUrl,
      siteName: config.siteName,
      title,
      description,
      images: [
        {
          url: ogImageUrl,
          width: OG_IMAGE_WIDTH,
          height: OG_IMAGE_HEIGHT,
          alt: ogImageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [
        {
          url: ogImageUrl,
          width: OG_IMAGE_WIDTH,
          height: OG_IMAGE_HEIGHT,
          alt: ogImageAlt,
        },
      ],
    },
  };

  // Set the Google verification token only when configured (Req 7.7) so that no
  // empty/duplicate verification declaration is ever emitted.
  if (config.googleVerification !== undefined) {
    metadata.verification = { google: config.googleVerification };
  }

  return metadata;
}

/**
 * Builds the `Metadata` for a location/service landing page.
 *
 * Mirrors {@link buildMetadata}'s invariants — clamped title and description,
 * exactly one canonical, indexable robots directives, absolute https OG image —
 * but the canonical points at the landing page's own URL rather than the site
 * root. Getting this wrong is the classic multi-page SEO failure: if every page
 * declares the home page as canonical, Google drops them all from the index.
 *
 * The site-wide `keywords` list is intentionally not repeated here. Each landing
 * page targets one intent, so its title, headings and body copy carry the
 * relevance; a duplicated 57-term keyword list adds nothing and dilutes it.
 *
 * @param config - The single-source SEO configuration.
 * @param page - The landing page to build metadata for.
 * @returns A Next.js `Metadata` object for that page.
 */
export function buildLandingMetadata(
  config: SeoConfig,
  page: LandingPage,
): Metadata {
  const title = clampText(page.title, TITLE_MAX);
  const description = clampText(page.description, DESCRIPTION_MAX);
  const canonical = absoluteUrl(page.slug, config.siteUrl);
  const ogImageUrl = absoluteUrl(config.ogImagePath, config.siteUrl);
  const ogImageAlt = clampText(config.ogImageAlt, OG_ALT_MAX);

  return {
    metadataBase: new URL(config.siteUrl),
    title,
    description,
    applicationName: config.siteName,
    authors: [{ name: config.siteName, url: config.siteUrl }],
    creator: config.siteName,
    publisher: config.siteName,
    category: "Marketing & Advertising",
    alternates: { canonical },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    icons: ICONS,
    openGraph: {
      type: "website",
      url: canonical,
      siteName: config.siteName,
      title,
      description,
      images: [
        {
          url: ogImageUrl,
          width: OG_IMAGE_WIDTH,
          height: OG_IMAGE_HEIGHT,
          alt: ogImageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [
        {
          url: ogImageUrl,
          width: OG_IMAGE_WIDTH,
          height: OG_IMAGE_HEIGHT,
          alt: ogImageAlt,
        },
      ],
    },
  };
}
