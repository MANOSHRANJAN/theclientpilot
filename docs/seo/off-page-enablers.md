# Off-Page & Local-Pack Enablers — TheClientPilot (Guwahati / Assam)

This document covers the **off-page** work needed to pursue top rankings and local-pack
visibility for TheClientPilot (TCP) for the target queries:

- "best AI agency"
- "best agency"
- "best AI agency in Guwahati"
- "best agency in Guwahati"
- "best AI agency in Assam"
- "best agency in Assam"

On-page and technical SEO (metadata, structured data, `robots.txt`, `sitemap.xml`, Core Web
Vitals, semantic markup, image alt text) are handled inside this codebase. The items below
live **outside** the codebase and must be executed manually by the business owner. They are
the levers that actually move local and organic rankings once the on-page foundation is in
place.

---

## ⚠️ No-Guarantee Statement

**A #1 ranking for the target queries ("best AI agency", "best agency", "best AI agency in
Guwahati/Assam") cannot be guaranteed by on-page changes alone.** Search rankings are
determined by Google's ranking systems and depend on off-page factors that are not controlled
by the website code. Ranking outcomes depend on, at minimum, the following off-page factors:

1. **Google Business Profile (GBP)** — a complete, verified, and actively maintained local
   business listing. Local-pack (map) results are driven primarily by GBP, not by the website.
2. **Customer reviews** — the quantity, quality, recency, and rating of reviews on the GBP
   listing. Reviews are a strong local-pack ranking signal and a direct driver of click-through.
3. **Backlinks** — the number and authority of external websites that link to
   `theclientpilot.store`. Authoritative, relevant, local backlinks build domain trust and
   organic ranking strength.
4. **Competition** — the strength of competing agencies for the same queries in the same
   geography. Rankings are relative; a well-optimized competitor can outrank TCP regardless of
   TCP's own on-page quality.

The on-page/technical work in this repository makes TCP **eligible** to rank and **enables**
the off-page factors below. It does not, and cannot, **guarantee** a specific ranking position.

---

## Off-Page Actions

The following are the three distinct off-page actions required to pursue local-pack ranking.
Each is an independent, ongoing workstream.

### 1. Google Business Profile (GBP) Creation

A verified GBP listing is the single most important off-page asset for local-pack ranking in
Guwahati/Assam. Without it, TCP cannot appear in the map/local pack at all.

**Actions:**

- [ ] Create a Google Business Profile at <https://business.google.com> using the official
      TheClientPilot business identity.
- [ ] Choose accurate primary and secondary categories, e.g. **"Marketing agency"**,
      **"Advertising agency"**, and where available **"Internet marketing service"** /
      **"Software company"** to reflect the AI focus.
- [ ] Enter the business **Name, Address, and Phone number (NAP)** so they are **character-for-character
      identical** to the values used in the website's LocalBusiness structured data (see
      `src/lib/seo.ts`). NAP consistency across GBP, the site, and citations is a ranking signal.
- [ ] Set the service area to **Guwahati, Assam, Northeast India, and India** to match the
      site's `areaServed`. If TCP operates without a public storefront, configure it as a
      service-area business rather than exposing a street address.
- [ ] Complete the **verification** process (postcard, phone, email, or video as offered by
      Google). An unverified profile does not rank.
- [ ] Fill every field: business description (naturally include "AI agency" and "Guwahati" /
      "Assam"), hours of operation, website URL `https://theclientpilot.store`, WhatsApp/phone,
      and services list.
- [ ] Upload high-quality photos (logo, team, office, work samples) and post updates regularly.
- [ ] Link the verified GBP profile URL back into the site's `sameAs` list in `src/lib/seo.ts`
      once it exists, so the site and the listing are cross-associated.

**Why it matters:** GBP is the data source for the local pack. A complete, verified, active
profile is a prerequisite for appearing in "...in Guwahati" / "...in Assam" map results.

### 2. Customer Review Acquisition

Reviews on the GBP listing are a primary local-pack ranking factor and the strongest trust
signal for prospective clients comparing agencies.

**Actions:**

- [ ] Generate the GBP **"Get more reviews"** short link from the profile dashboard.
- [ ] Request a review from every satisfied client immediately after a successful engagement,
      while the result is fresh. Send the direct review link by WhatsApp/email.
- [ ] Aim for a **steady, natural cadence** of new reviews rather than a single burst — recency
      and consistency matter more than volume spikes, and sudden spikes can look inauthentic.
- [ ] Encourage reviewers to mention the **service and location** naturally (e.g. "AI marketing
      in Guwahati") — keyword-relevant, location-relevant review text reinforces local relevance.
- [ ] **Respond to every review**, positive or negative, promptly and professionally. Response
      activity is a signal of an active, credible business.
- [ ] Never buy fake reviews or incentivize reviews in violation of Google's policies — this
      risks suppression or removal of the listing.

**Why it matters:** Review count, average rating, recency, and owner responses all feed local
ranking and directly influence whether searchers choose TCP over competitors.

### 3. Local Citation Building

Citations are mentions of the business NAP on other websites and directories. Consistent
citations build local trust and corroborate the GBP data.

**Actions:**

- [ ] List TCP with **consistent NAP** on major India-wide directories: **Justdile, Sulekha,
      IndiaMART, Google Maps, Bing Places, Apple Business Connect**, and industry directories
      for marketing/AI agencies. (Verify current directory names before submitting.)
- [ ] Add listings on **Guwahati / Assam / Northeast India regional** directories and local
      business listings to build geographic relevance for the target queries.
- [ ] Create/claim profiles on relevant **social and professional platforms** (LinkedIn company
      page, Facebook business page, Instagram business profile) and keep the NAP and website URL
      consistent. Add these profile URLs to the site's `sameAs` list in `src/lib/seo.ts`.
- [ ] Ensure **every citation uses identical NAP** to GBP and the website structured data.
      Inconsistent addresses or phone numbers dilute the local signal and can hurt ranking.
- [ ] Periodically **audit citations** for duplicates or stale/incorrect entries and correct
      them.

**Why it matters:** Consistent citations across authoritative and local directories corroborate
the business's identity and location, strengthening local-pack eligibility and organic trust.

---

## Google Search Console — Sitemap Submission

Verify ownership of the site in **Google Search Console** (<https://search.google.com/search-console>)
using the Google site-verification token wired into the site metadata, then submit the sitemap
so Google can discover and index the canonical URLs.

**Sitemap submission URL:**

```
https://theclientpilot.store/sitemap.xml
```

**Steps:**

1. Add the property `https://theclientpilot.store` in Search Console and complete ownership
   verification.
2. Open **Sitemaps** in the left navigation.
3. Enter `https://theclientpilot.store/sitemap.xml` and click **Submit**.
4. Confirm the sitemap is read successfully (status "Success") and monitor coverage/indexing.

> If the sitemap is unavailable at submission time, resolve the outage before submitting rather
> than submitting a broken URL. Search Console will report fetch errors for an unreachable
> sitemap.

---

## Ongoing Cadence Summary

| Workstream | Setup (one-time) | Ongoing |
| --- | --- | --- |
| Google Business Profile | Create, verify, complete every field | Post updates, add photos, keep NAP/hours current |
| Customer reviews | Generate review link | Request after each engagement, respond to all reviews |
| Local citations | Submit to core + regional directories | Audit for consistency, fix duplicates |
| Search Console | Verify ownership, submit sitemap | Monitor coverage, target-query performance |

These off-page workstreams, combined with the on-page/technical SEO in this repository,
position TheClientPilot to compete for the target queries in Guwahati and Assam. They enable —
but do not guarantee — top rankings, which remain subject to reviews, backlinks, GBP strength,
and competition.
