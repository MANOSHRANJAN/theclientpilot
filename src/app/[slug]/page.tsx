import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { StarBurst } from "@/components/icons";
import { LANDING_PAGES, findLandingPage } from "@/lib/landing-pages";
import { buildLandingMetadata } from "@/lib/metadata";
import { seoConfig } from "@/lib/seo";
import { buildLandingStructuredData } from "@/lib/structured-data";

/**
 * Location and service landing pages.
 *
 * Every entry in `LANDING_PAGES` is statically generated at build time, so each
 * URL is served as pre-rendered HTML with its own title, description, canonical
 * and JSON-LD already in the markup — no JavaScript execution required for a
 * crawler to read any of it.
 *
 * Unknown slugs return a 404 via `notFound()` rather than rendering an empty
 * shell, which prevents this dynamic segment from generating an unbounded set of
 * thin, indexable URLs.
 */

export const dynamicParams = false;

export function generateStaticParams(): { slug: string }[] {
  return LANDING_PAGES.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = findLandingPage(slug);

  if (!page) {
    return { title: "Page not found", robots: { index: false, follow: false } };
  }

  return buildLandingMetadata(seoConfig, page);
}

export default async function LandingPageRoute({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = findLandingPage(slug);

  if (!page) {
    notFound();
  }

  // Rendered as native <script> tags so the payload is present in the
  // server HTML for every crawler, including those that do not run JavaScript.
  const structuredData = buildLandingStructuredData(seoConfig, page).map(
    (block) => JSON.stringify(block).replace(/</g, "\\u003c"),
  );



  return (
    <>
      {structuredData.map((json, index) => (
        <script
          key={`ld-${page.slug}-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: json }}
        />
      ))}

      <SiteHeader />

      <main>
        {/* Coloured hero: also keeps the transparent fixed header legible. */}
        <section className="bg-copula-orange text-copula-white w-full px-(--padding-x) pb-16 pt-32 md:pb-24 md:pt-44">
          <div className="mx-auto flex max-w-292.5 flex-col gap-6">
            <nav aria-label="Breadcrumb">
              <ol className="smallBody flex flex-wrap items-center gap-2 uppercase">
                <li>
                  <Link href="/" className="underline transition-opacity hover:opacity-70">
                    Home
                  </Link>
                </li>
                <li aria-hidden className="opacity-70">
                  /
                </li>
                <li aria-current="page" className="opacity-90">
                  {page.breadcrumbLabel}
                </li>
              </ol>
            </nav>

            <h1 className="h1 max-w-5xl">{page.h1}</h1>

            <p className="max-w-3xl text-lg leading-relaxed md:text-xl">
              {page.intro}
            </p>

            <div className="mt-2">
              <Link
                href="/#faq"
                className="inline-flex items-center justify-center rounded-full border-2 border-copula-white px-6 py-3 text-sm font-semibold uppercase tracking-wider transition-all duration-300 hover:bg-copula-white hover:text-copula-orange"
              >
                See how it works
              </Link>
            </div>
          </div>
        </section>

        {/* Body content */}
        <section className="bg-copula-white text-text-black w-full px-(--padding-x) py-16 md:py-24">
          <div className="mx-auto flex max-w-292.5 flex-col gap-14 md:gap-20">
            {page.sections.map((section) => (
              <div key={section.heading} className="flex flex-col gap-5">
                <h2 className="h2 max-w-4xl">{section.heading}</h2>

                {section.paragraphs?.map((paragraph) => (
                  <p
                    key={paragraph.slice(0, 48)}
                    className="max-w-3xl text-base leading-relaxed md:text-lg"
                  >
                    {paragraph}
                  </p>
                ))}

                {section.bullets && (
                  <ul className="flex max-w-3xl flex-col gap-3">
                    {section.bullets.map((bullet) => (
                      <li
                        key={bullet.slice(0, 48)}
                        className="flex items-start gap-3 text-base leading-relaxed md:text-lg"
                      >
                        <span
                          aria-hidden
                          className="bg-copula-orange mt-2.5 size-2 shrink-0 rounded-full"
                        />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Visible FAQ — the source of this page's FAQPage markup. */}
        <section className="bg-copula-orange text-copula-white w-full px-(--padding-x) py-16 md:py-24">
          <div className="mx-auto flex max-w-292.5 flex-col gap-10 md:gap-14">
            <div className="flex items-center gap-2">
              <StarBurst className="text-copula-white size-6 animate-spin-slow" />
              <p className="display text-[40px] uppercase leading-none">FAQ</p>
            </div>

            <dl className="flex flex-col gap-10">
              {page.faqs.map((faq) => (
                <div key={faq.question} className="flex flex-col gap-3">
                  <dt className="h2 max-w-4xl">{faq.question}</dt>
                  <dd className="max-w-3xl text-base leading-relaxed md:text-lg">
                    {faq.answer}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/*
          No cross-links between landing pages.

          These pages are reachable only via sitemap.xml and search results —
          they are intentionally orphaned so no visitor ever sees a list of
          location/service page names.

          Do NOT reinstate these links behind `sr-only`, `display: none`, zero
          opacity or an off-screen wrapper in order to regain the internal-link
          value while keeping them out of sight. Serving links to crawlers that
          are concealed from visitors is cloaking, and carries a far heavier
          penalty than the ranking benefit is worth.
        */}
      </main>

      <SiteFooter />
    </>
  );
}
