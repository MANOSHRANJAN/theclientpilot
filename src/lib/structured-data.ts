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
import type { LandingPage } from "./landing-pages";
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

// ---------------------------------------------------------------------------
// Stable node identifiers
// ---------------------------------------------------------------------------

/**
 * Stable `@id` fragments for the site-wide entities.
 *
 * Without an explicit `@id`, each JSON-LD block is an anonymous node, so a
 * consumer sees three unrelated things that happen to share a name. Giving each
 * a stable IRI and referencing it by `{"@id": …}` elsewhere turns them into one
 * connected graph — which is precisely what a knowledge-graph or an AI
 * assistant needs in order to state that TheClientPilot the website, the
 * organisation, and the Guwahati business are the same entity.
 *
 * The fragments are appended to the canonical origin so the IRIs are globally
 * unique and stable across every page that emits them.
 */
export const NODE_IDS = {
  organization: "#organization",
  website: "#website",
  localBusiness: "#localbusiness",
  founder: "#founder",
} as const;

/** Builds the absolute IRI for a node fragment, e.g. `https://host/#organization`. */
function nodeId(c: SeoConfig, fragment: string): string {
  return `${absoluteUrl("", c.siteUrl)}/${fragment}`;
}

/** A `{"@id": …}` reference to another node in the graph. */
function ref(c: SeoConfig, fragment: string): { "@id": string } {
  return { "@id": nodeId(c, fragment) };
}

/**
 * Builds the `Person` node for the founder, or `undefined` when no founder is
 * configured.
 *
 * Only `sameAs` entries that are absolute https URLs survive, matching the
 * organisation-level sanitisation.
 */
function buildFounder(c: SeoConfig): Record<string, unknown> | undefined {
  const founder = c.founder;
  if (!founder || !isNonEmptyString(founder.name)) {
    return undefined;
  }

  const person: Record<string, unknown> = {
    "@type": "Person",
    "@id": nodeId(c, NODE_IDS.founder),
    name: founder.name,
  };

  if (isNonEmptyString(founder.jobTitle)) {
    person.jobTitle = founder.jobTitle;
  }

  const profiles = Array.isArray(founder.sameAs)
    ? founder.sameAs.filter(
        (url) => isNonEmptyString(url) && isAbsoluteHttps(url),
      )
    : [];
  if (profiles.length > 0) {
    person.sameAs = profiles;
  }

  return person;
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
    "@id": nodeId(c, NODE_IDS.organization),
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

  if (isNonEmptyString(c.email)) {
    org.email = c.email;
  }

  const founder = buildFounder(c);
  if (founder) {
    org.founder = founder;
  }

  const sameAs = sanitizeSameAs(c);
  if (sameAs) {
    org.sameAs = sameAs;
  }

  return org;
}

/**
 * Builds the WebSite JSON-LD block.
 *
 * `publisher` is a `{"@id"}` reference to the Organization node rather than an
 * inline copy of it, so the site and the organisation are one connected graph
 * instead of two nodes that merely share a name.
 *
 * No `potentialAction`/`SearchAction` is declared. The previous version pointed
 * at `/?q={search_term_string}`, but the site has no search feature and that
 * query parameter does nothing — it was markup describing a capability that
 * does not exist. Google only renders a sitelinks search box for a working
 * endpoint, so the block earned nothing while asserting something untrue.
 * Reinstate it only if a real search results page is built.
 */
export function buildWebSite(c: SeoConfig): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": nodeId(c, NODE_IDS.website),
    name: c.siteName,
    url: absoluteUrl("", c.siteUrl),
    publisher: ref(c, NODE_IDS.organization),
    inLanguage: "en",
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
    "@id": nodeId(c, NODE_IDS.localBusiness),
    name: c.siteName,
    url: absoluteUrl("", c.siteUrl),
    image: ogImageUrl(c),
    description: c.description,
    priceRange: "$$",
    address: buildPostalAddress(c),
    areaServed: c.areaServed,
    serviceType: [...SERVICE_TYPES],
    hasOfferCatalog: OFFER_CATALOG,
    // Ties the trading location back to the brand node. Without it, the
    // Organization and this block read as two separate businesses that happen
    // to share a name and address.
    parentOrganization: ref(c, NODE_IDS.organization),
  };

  if (isValidTelephone(c.telephone)) {
    business.telephone = c.telephone;
  }

  if (isNonEmptyString(c.email)) {
    business.email = c.email;
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
 * Builds the site-wide structured-data blocks emitted from the root layout on
 * every page: Organization, WebSite, LocalBusiness.
 *
 * FAQPage is deliberately excluded. It describes the question/answer content of
 * one specific page, so emitting it from the shared layout would put the home
 * page's FAQ on every URL — and on the landing pages, which carry their own
 * FAQPage, that produced two conflicting FAQPage entities on a single URL.
 * Google resolves such conflicts by picking one arbitrarily or ignoring both.
 * Each page therefore emits its own FAQPage alongside these.
 */
export function buildSiteStructuredData(
  c: SeoConfig,
): Record<string, unknown>[] {
  return [buildOrganization(c), buildWebSite(c), buildLocalBusiness(c)];
}

/**
 * Builds a `BreadcrumbList` for a landing page: Home > {label}.
 *
 * Breadcrumb markup lets Google render the site hierarchy in the result snippet
 * instead of a bare URL, and reinforces that these pages belong to the same
 * site rather than being unrelated one-offs.
 */
export function buildBreadcrumbList(
  c: SeoConfig,
  page: LandingPage,
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: absoluteUrl("", c.siteUrl),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: page.breadcrumbLabel,
        item: absoluteUrl(page.slug, c.siteUrl),
      },
    ],
  };
}

/**
 * Builds the `Service` block for a landing page.
 *
 * `provider` reuses the same organisation name and postal address as
 * {@link buildOrganization} and {@link buildLocalBusiness}, so NAP stays
 * consistent across every entity on the site (Req 6.5). `areaServed` is the
 * page's own service area, which is what differentiates these blocks from one
 * another.
 */
export function buildService(
  c: SeoConfig,
  page: LandingPage,
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: page.serviceName,
    serviceType: [...SERVICE_TYPES],
    description: page.description,
    url: absoluteUrl(page.slug, c.siteUrl),
    // A reference to the Organization node emitted by the root layout on this
    // same page, rather than an inline duplicate of the NAP. One node, one set
    // of facts — the duplicate could previously drift out of sync with the
    // Organization block sitting a few hundred bytes above it in the HTML.
    provider: ref(c, NODE_IDS.organization),
    areaServed: [...page.areaServed],
  };
}

/**
 * Builds the FAQPage block for a landing page from that page's own visible
 * question/answer content.
 *
 * As with {@link buildFaqPage}, every pair marked up here renders visibly on the
 * page, which is what Google's FAQPage guidelines require.
 */
export function buildLandingFaqPage(
  page: LandingPage,
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: page.faqs.map(({ question, answer }) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: { "@type": "Answer", text: answer },
    })),
  };
}

/**
 * Builds every structured-data block for a landing page, in render order:
 * Service, BreadcrumbList, FAQPage.
 *
 * Organization / WebSite / LocalBusiness are emitted once from the root layout
 * and are deliberately not repeated here.
 */
export function buildLandingStructuredData(
  c: SeoConfig,
  page: LandingPage,
): Record<string, unknown>[] {
  return [
    buildService(c, page),
    buildBreadcrumbList(c, page),
    buildLandingFaqPage(page),
  ];
}
