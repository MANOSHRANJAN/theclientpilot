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

/**
 * A named person associated with the business (currently the founder).
 *
 * Emitted as a schema.org `Person`. Naming a real, externally-verifiable person
 * behind the brand is one of the strongest entity signals available: it is what
 * lets Google and AI assistants connect "TheClientPilot" to an actual identity
 * rather than treating it as an unattributed string, and it is the concrete
 * form the E-E-A-T guidelines ask for.
 */
export interface Founder {
  /** Full name as it should appear in search results. */
  name: string;
  /** Role at the organisation, e.g. "Founder". */
  jobTitle: string;
  /**
   * Absolute https profile URLs that corroborate this person's identity
   * (LinkedIn, personal site). Same `sameAs` semantics as the org-level list.
   */
  sameAs?: string[];
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
  /** Contact email published in the site footer. */
  email?: string;
  /** The person behind the brand; emitted as `Organization.founder`. */
  founder?: Founder;

  /** Guwahati, Assam, Northeast India, India */
  areaServed: string[];
  /**
   * Human-readable service area, written as a sentence fragment for display.
   *
   * Deliberately NOT derived from {@link SeoConfig.areaServed}. That array is
   * written for search engines: it names Assam and Northeast India explicitly
   * because landing pages target those exact phrases, and schema.org is happy
   * to receive overlapping regions. Joining it for display produced
   * "Serving India · Guwahati · Assam · Northeast India · Delhi NCR", which
   * reads as five separate places when India already contains the other four.
   */
  areaServedLabel: string;
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
  // budgets exactly as written, so `clampText` never truncates them. An
  // overflowing title gets cut mid-phrase, which invites Google to discard it
  // and synthesize its own snippet instead.
  //
  // The home page leads with India rather than a single city. The business
  // operates from Guwahati and Delhi NCR with no premises in either, so
  // claiming one city here would (a) misrepresent the other, and (b) waste the
  // home page — the strongest URL on the site — on one local query. City-level
  // targeting is the job of the location pages in `landing-pages.ts`, which
  // each own one intent and can rank for it properly.
  title: "Best AI Agency in India | TheClientPilot",
  description:
    "TheClientPilot builds AI agents, AI ads and high-converting websites for clinics, dentists and service businesses across India. Get more booked clients.",
  ogImagePath: "/opengraph-image",
  ogImageAlt: "TheClientPilot — AI marketing agency",

  // TheClientPilot is a SERVICE AREA BUSINESS: it serves clients across the
  // `areaServed` regions but has no premises the public can visit. Google's
  // guidance for that model is to declare the region and service area and to
  // omit the street address — which is why `streetAddress` and `postalCode`
  // are deliberately absent here.
  //
  // Do NOT add them back. The only street address available is the founder's
  // family home in Guwahati, and publishing it would (a) expose a private
  // residence, and (b) assert a staffed public location that does not exist —
  // grounds for a Google Business Profile suspension if the two ever conflict.
  //
  // Locality/region stay: they are the business's base and are what local
  // search matches against.
  addressLocality: "Guwahati",
  addressRegion: "Assam",
  addressCountry: "IN",
  // E.164: the +91 country code is required. A bare 10-digit national number
  // fails the format check in structured-data.ts and would be omitted entirely.
  // Must stay byte-identical to the number rendered in the footer and listed on
  // the Google Business Profile — inconsistent NAP across those surfaces is the
  // classic reason a local business fails to consolidate into one entity.
  telephone: "+918822652276",

  // Contactable 9am–9pm, all seven days. For a service area business these are
  // the hours enquiries are answered, not the hours a door is unlocked.
  openingHours: [
    {
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "09:00",
      closes: "21:00",
    },
  ],

  // Profiles that corroborate the business is a real, single entity. Every URL
  // here must be one the business actually controls and that links back to this
  // site where possible — `sameAs` pointing at a profile that never mentions
  // TheClientPilot confirms nothing.
  sameAs: ["https://www.instagram.com/theclientpilot"],
  email: "theclientpilot@outlook.com",

  founder: {
    name: "Manosh Ranjan",
    jobTitle: "Founder",
    // Confirmed by the owner. Note this is the `/in/` profile URL, not the
    // `/posts/` view — `sameAs` must point at the profile itself, since that is
    // the URL search engines reconcile against their entity graph.
    sameAs: ["https://www.linkedin.com/in/manoshranjan"],
  },

  // Owner-provided fields intentionally omitted (undefined) until available:
  // postalCode, streetAddress, telephone, geo, openingHours.

  // Delhi NCR is listed because the founder is physically based there during
  // term time, so it is a market the business can actually serve in person —
  // and there is already a landing page targeting it.
  areaServed: [
    "India",
    "Guwahati",
    "Assam",
    "Northeast India",
    "Delhi NCR",
  ],

  // Names the two places the business can actually show up in person, then the
  // country it works across remotely — rather than listing every region in
  // `areaServed`, which overlap and read as redundant to a visitor.
  areaServedLabel: "Guwahati, Delhi NCR & across India",
};
