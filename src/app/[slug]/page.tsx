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

  const otherPages = LANDING_PAGES.filter((other) => other.slug !== page.slug);

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

        {/* Internal links: distribute crawl paths and link equity between pages. */}
        <section className="bg-copula-white text-text-black w-full px-(--padding-x) py-16 md:py-24">
          <div className="mx-auto flex max-w-292.5 flex-col gap-8">
            <h2 className="h2">Explore more</h2>
            <ul className="flex flex-col gap-4">
              {otherPages.map((other) => (
                <li key={other.slug}>
                  <Link
                    href={`/${other.slug}`}
                    className="h3 hover:text-copula-orange inline-block uppercase underline transition-colors"
                  >
                    {other.linkLabel}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/"
                  className="h3 hover:text-copula-orange inline-block uppercase underline transition-colors"
                >
                  TheClientPilot home
                </Link>
              </li>
            </ul>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
