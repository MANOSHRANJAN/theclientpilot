/**
 * SEO config single source of truth.
 *
 * All NAP (Name/Address/Phone), geo, opening hours, `sameAs`, verification
 * token, and canonical URL live in one typed object so that downstream pure
 * builders (structured-data, metadata, robots, sitemap) read identical values.
 *
 * Required fields are always present. Owner-provided fields are optional and
 * are left `undefined` when unavailable, so the structured-data builders
 * exercise the "omit-when-unavailable" path (Req 5.8) rather than emitting
 * empty/placeholder values.
 */

export interface OpeningHours {
  /** e.g. ["Monday","Tuesday"] */
  dayOfWeek: string[];
  /** "HH:MM" 24h */
  opens: string;
  /** "HH:MM" 24h */
  closes: string;
}

export interface SeoConfig {
  /** "https://theclientpilot.store" (no trailing slash) */
  siteUrl: string;
  /** "TheClientPilot" */
  siteName: string;
  /** === siteUrl for the home page */
  canonicalUrl: string;
  /** source title (may exceed 60) */
  title: string;
  /** source description (may exceed 160) */
  description: string;
  /** "/opengraph-image" or "/seo/og.png" */
  ogImagePath: string;
  /** 1..420 chars */
  ogImageAlt: string;
  /** Search Console token */
  googleVerification?: string;

  // NAP (owner-provided; omit when undefined) --------------------------------
  /** "Guwahati" (known) */
  addressLocality: string;
  /** "Assam" (known) */
  addressRegion: string;
  /** "IN" (known) */
  addressCountry: string;
  postalCode?: string;
  streetAddress?: string;
  /** E.164, +<=15 digits */
  telephone?: string;
  geo?: { latitude: number; longitude: number };
  openingHours?: OpeningHours[];
  /** absolute https URLs */
  sameAs?: string[];

  /** Guwahati, Assam, Northeast India, India */
  areaServed: string[];
}

// Canonical host MUST match the host the site actually serves on. The apex
// domain 308-redirects to the www subdomain, so www is the canonical host;
// pointing canonical/sitemap/structured-data URLs at the non-www apex would
// declare a canonical that immediately redirects, confusing crawlers.
const SITE_URL = "https://www.theclientpilot.store";

export const seoConfig: SeoConfig = {
  siteUrl: SITE_URL,
  siteName: "TheClientPilot",
  canonicalUrl: SITE_URL,
  // Title and description are authored to fit the 60/160-character render
  // budgets exactly as written, so `clampText` never truncates them. The
  // previous values overflowed and were cut to a dangling "… Guwahati |" title
  // and a mid-sentence description ("… doctors and growing"), which invites
  // Google to discard them and synthesize its own snippet instead — the reason
  // the "Best AI Agency" wording showed up inconsistently in results.
  title: "Best AI Agency in Guwahati, Assam & India | TheClientPilot",
  description:
    "TheClientPilot is the best AI agency in Guwahati, Assam and India. AI agents, AI ads and websites that bring dentists, spas and clinics more clients.",
  ogImagePath: "/opengraph-image",
  ogImageAlt: "TheClientPilot — AI marketing agency",

  // Known NAP values.
  addressLocality: "Guwahati",
  addressRegion: "Assam",
  addressCountry: "IN",

  // Owner-provided fields intentionally omitted (undefined) until available:
  // postalCode, streetAddress, telephone, geo, openingHours, sameAs.

  areaServed: ["Guwahati", "Assam", "Northeast India", "India"],
};
