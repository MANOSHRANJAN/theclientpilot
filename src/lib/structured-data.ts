/**
 * Structured-data (JSON-LD) builders.
 *
 * Pure functions that turn the single {@link SeoConfig} source of truth into
 * the four schema.org JSON-LD blocks search engines consume: Organization,
 * WebSite, ProfessionalService/LocalBusiness, and FAQPage.
 *
 * Design invariants enforced here:
 * - Every `url`/`logo`/`image`/`sameAs` value is produced via
 *   {@link absoluteUrl} and validated with {@link isAbsoluteHttps} (Req 6.4).
 * - `image` references the raster OG image absolute URL, never the SVG
 *   (Req 5.6, Req 6.7).
 * - Owner-provided fields (`streetAddress`, `postalCode`, `telephone`, `geo`,
 *   `openingHoursSpecification`, `sameAs`) are emitted only when defined,
 *   non-empty, AND satisfying their format/range constraint; otherwise the
 *   property is omitted entirely (Req 5.8, Req 5.9).
 * - Organization and LocalBusiness read identical NAP + telephone from the one
 *   config, guaranteeing NAP consistency (Req 6.5).
 *
 * These builders have no dependency on Next.js so they can be unit- and
 * property-tested in isolation.
 */

import { FAQ_ITEMS } from "./faq";
import type { OpeningHours, SeoConfig } from "./seo";
import { absoluteUrl, isAbsoluteHttps } from "./url";

/** Valid schema.org `dayOfWeek` values for opening-hours specifications. */
const DAYS_OF_WEEK: ReadonlySet<string> = new Set([
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
]);

/** E.164: leading `+` followed by at most 15 digits. */
const E164_PATTERN = /^\+\d{1,15}$/;

/** 24-hour `HH:MM` time (00:00–23:59). */
const HH_MM_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;

/**
 * Service types offered by TheClientPilot. Preserved verbatim from the inline
 * JSON-LD previously declared in `layout.tsx`.
 */
const SERVICE_TYPES: readonly string[] = [
  "AI Agents",
  "AI Ads",
  "Website Design & Development",
  "Lead Generation",
  "Performance Marketing",
  "SEO",
  "Meta Ads",
  "Google Ads",
  "Marketing for Dentists",
  "Marketing for Spas",
  "Marketing for Doctors",
  "Best AI Agency in India",
  "Best AI Agency in Assam",
  "Best AI Agency in Guwahati",
];

/**
 * Offer catalog. Preserved verbatim from the inline JSON-LD previously declared
 * in `layout.tsx`.
 */
const OFFER_CATALOG = {
  "@type": "OfferCatalog",
  name: "TheClientPilot Services",
  itemListElement: [
    { "@type": "Offer", itemOffered: { "@type": "Service", name: "AI Agents" } },
    { "@type": "Offer", itemOffered: { "@type": "Service", name: "AI Ads Agency" } },
    { "@type": "Offer", itemOffered: { "@type": "Service", name: "Website Agency" } },
    { "@type": "Offer", itemOffered: { "@type": "Service", name: "Lead Generation" } },
    {
      "@type": "Offer",
      itemOffered: { "@type": "Service", name: "SEO & Performance Marketing" },
    },
  ],
} as const;

// ---------------------------------------------------------------------------
// Format / range validators (Req 5.2, 5.3, 5.4, 5.9)
// ---------------------------------------------------------------------------

/** Returns `true` when `value` is a non-empty string after trimming. */
function isNonEmptyString(value: string | undefined): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

/** Returns `true` when `telephone` is a valid E.164 number. */
function isValidTelephone(telephone: string | undefined): telephone is string {
  return typeof telephone === "string" && E164_PATTERN.test(telephone);
}

/** Returns `true` when `geo` has an in-range latitude and longitude. */
function isValidGeo(
  geo: SeoConfig["geo"],
): geo is { latitude: number; longitude: number } {
  if (!geo) {
    return false;
  }
  const { latitude, longitude } = geo;
  return (
    Number.isFinite(latitude) &&
    Number.isFinite(longitude) &&
    latitude >= -90 &&
    latitude <= 90 &&
    longitude >= -180 &&
    longitude <= 180
  );
}

/** Returns `true` when a single opening-hours entry conforms to its constraints. */
function isValidOpeningHoursEntry(entry: OpeningHours): boolean {
  return (
    Array.isArray(entry.dayOfWeek) &&
    entry.dayOfWeek.length > 0 &&
    entry.dayOfWeek.every((day) => DAYS_OF_WEEK.has(day)) &&
    HH_MM_PATTERN.test(entry.opens) &&
    HH_MM_PATTERN.test(entry.closes)
  );
}

// ---------------------------------------------------------------------------
// Shared NAP builders (guarantee Organization / LocalBusiness consistency)
// ---------------------------------------------------------------------------

/** The absolute https URL of the raster OG image (never the SVG). */
function ogImageUrl(c: SeoConfig): string {
  return absoluteUrl(c.ogImagePath, c.siteUrl);
}

/**
 * Builds the shared `PostalAddress` object read identically by the Organization
 * and LocalBusiness blocks. `streetAddress` and `postalCode` are included only
 * when defined and non-empty (Req 5.8).
 */
function buildPostalAddress(c: SeoConfig): Record<string, unknown> {
  const address: Record<string, unknown> = { "@type": "PostalAddress" };

  if (isNonEmptyString(c.streetAddress)) {
    address.streetAddress = c.streetAddress;
  }
  address.addressLocality = c.addressLocality;
  address.addressRegion = c.addressRegion;
  if (isNonEmptyString(c.postalCode)) {
    address.postalCode = c.postalCode;
  }
  address.addressCountry = c.addressCountry;

  return address;
}

/**
 * Returns the sanitized `sameAs` list (absolute https URLs only) when at least
 * one valid entry exists, otherwise `undefined` so the property can be omitted.
 */
function sanitizeSameAs(c: SeoConfig): string[] | undefined {
  if (!Array.isArray(c.sameAs)) {
    return undefined;
  }
  const valid = c.sameAs.filter(
    (url) => isNonEmptyString(url) && isAbsoluteHttps(url),
  );
  return valid.length > 0 ? valid : undefined;
}

// ---------------------------------------------------------------------------
// Builders
// ---------------------------------------------------------------------------

/**
 * Builds the Organization JSON-LD block. Reads the same NAP + telephone as
 * {@link buildLocalBusiness} so the two blocks stay consistent (Req 6.5).
 */
export function buildOrganization(c: SeoConfig): Record<string, unknown> {
  const image = ogImageUrl(c);

  const org: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: c.siteName,
    url: absoluteUrl("", c.siteUrl),
    logo: image,
    image,
    description: c.description,
    address: buildPostalAddress(c),
    areaServed: c.areaServed,
  };

  if (isValidTelephone(c.telephone)) {
    org.telephone = c.telephone;
  }

  const sameAs = sanitizeSameAs(c);
  if (sameAs) {
    org.sameAs = sameAs;
  }

  return org;
}

/** Builds the WebSite JSON-LD block. */
export function buildWebSite(c: SeoConfig): Record<string, unknown> {
  const url = absoluteUrl("", c.siteUrl);

  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: c.siteName,
    url,
    publisher: { "@type": "Organization", name: c.siteName },
    potentialAction: {
      "@type": "SearchAction",
      target: `${url}/?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

/**
 * Builds the ProfessionalService/LocalBusiness JSON-LD block.
 *
 * `telephone`, `geo`, `openingHoursSpecification`, and `sameAs` are included
 * only when the config field is defined, non-empty, AND satisfies its
 * format/range constraint; otherwise the property is omitted entirely
 * (Req 5.8, Req 5.9). NAP + telephone are read identically to
 * {@link buildOrganization} (Req 6.5).
 */
export function buildLocalBusiness(c: SeoConfig): Record<string, unknown> {
  const business: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": ["ProfessionalService", "LocalBusiness"],
    name: c.siteName,
    url: absoluteUrl("", c.siteUrl),
    image: ogImageUrl(c),
    description: c.description,
    priceRange: "$$",
    address: buildPostalAddress(c),
    areaServed: c.areaServed,
    serviceType: [...SERVICE_TYPES],
    hasOfferCatalog: OFFER_CATALOG,
  };

  if (isValidTelephone(c.telephone)) {
    business.telephone = c.telephone;
  }

  if (isValidGeo(c.geo)) {
    business.geo = {
      "@type": "GeoCoordinates",
      latitude: c.geo.latitude,
      longitude: c.geo.longitude,
    };
  }

  if (Array.isArray(c.openingHours)) {
    const validHours = c.openingHours.filter(isValidOpeningHoursEntry);
    if (validHours.length > 0) {
      business.openingHoursSpecification = validHours.map((entry) => ({
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [...entry.dayOfWeek],
        opens: entry.opens,
        closes: entry.closes,
      }));
    }
  }

  const sameAs = sanitizeSameAs(c);
  if (sameAs) {
    business.sameAs = sameAs;
  }

  return business;
}

/**
 * Builds the FAQPage JSON-LD block from {@link FAQ_ITEMS} — the same list the
 * visible FAQ accordion renders.
 *
 * Google's FAQPage guidelines require every marked-up question and answer to be
 * visible on the page. Marking up questions that exist only in the JSON-LD is a
 * structured-data policy violation and gets the block ignored (or the site
 * flagged), which is why this reads the rendered content rather than its own
 * keyword-oriented list.
 */
export function buildFaqPage(_c: SeoConfig): Record<string, unknown> {
  // Keep the builder signature consistent with the other config-driven blocks.
  void _c;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_ITEMS.map(({ question, answer }) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: { "@type": "Answer", text: answer },
    })),
  };
}

/**
 * Builds all four structured-data blocks in the order they are injected into
 * the document: Organization, WebSite, LocalBusiness, FAQPage.
 */
export function buildAllStructuredData(c: SeoConfig): Record<string, unknown>[] {
  return [
    buildOrganization(c),
    buildWebSite(c),
    buildLocalBusiness(c),
    buildFaqPage(c),
  ];
}
