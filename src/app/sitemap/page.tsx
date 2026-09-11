import type { Metadata } from "next";
import Link from "next/link";

import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import {
  CLUSTER_LABELS,
  CLUSTER_ORDER,
  LANDING_PAGES,
} from "@/lib/landing-pages";
import { seoConfig } from "@/lib/seo";
import { absoluteUrl } from "@/lib/url";

/**
 * HTML sitemap (`/sitemap`).
 *
 * Every location and service page previously had zero inbound internal links —
 * they were reachable only through `sitemap.xml`. Search engines treat internal
 * links as a signal of which pages matter, so a page nothing links to is
 * crawled rarely and ranks well below one that is linked, no matter how good
 * its content is.
 *
 * This page fixes that the legitimate way: a genuinely useful index that a
 * visitor can read, linked once from the footer. It is emphatically NOT the
 * hidden link list the codebase warns against elsewhere — nothing here is
 * `sr-only`, offscreen, or zero-opacity. Every link on this page is visible to
 * a human exactly as it is to a crawler, which is the line between an internal
 * link and cloaking.
 *
 * Note this route coexists with `src/app/sitemap.ts`; that file is a Next.js
 * metadata convention that serves the XML at `/sitemap.xml`, a different path.
 */

const TITLE = "Sitemap | TheClientPilot";
const DESCRIPTION =
  "Every page on TheClientPilot: AI agency locations across Assam and India, AI automation systems, websites and SEO services.";

export const metadata: Metadata = {
  metadataBase: new URL(seoConfig.siteUrl),
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: absoluteUrl("/sitemap", seoConfig.siteUrl) },
  robots: { index: true, follow: true },
};

export default function SitemapPage() {
  return (
    <>
      <SiteHeader />

      <main>
        <section className="bg-copula-orange text-copula-white w-full px-(--padding-x) pb-16 pt-32 md:pb-24 md:pt-44">
          <div className="mx-auto flex max-w-292.5 flex-col gap-6">
            <nav aria-label="Breadcrumb">
              <ol className="smallBody flex flex-wrap items-center gap-2 uppercase">
                <li>
                  <Link
                    href="/"
                    className="underline transition-opacity hover:opacity-70"
                  >
                    Home
                  </Link>
                </li>
                <li aria-hidden className="opacity-70">
                  /
                </li>
                <li aria-current="page" className="opacity-90">
                  Sitemap
                </li>
              </ol>
            </nav>

            <h1 className="h1 max-w-5xl">Everything on this site</h1>

            <p className="max-w-3xl text-lg leading-relaxed md:text-xl">
              Every page we publish, grouped by what it covers — the places we
              work in, the systems we build, and the services we run.
            </p>
          </div>
        </section>

        <section className="bg-copula-white text-text-black w-full px-(--padding-x) py-16 md:py-24">
          <div className="mx-auto flex max-w-292.5 flex-col gap-14 md:gap-20">
            {CLUSTER_ORDER.map((cluster) => {
              const pages = LANDING_PAGES.filter(
                (page) => page.cluster === cluster,
              );
              if (pages.length === 0) {
                return null;
              }

              return (
                <div key={cluster} className="flex flex-col gap-5">
                  <h2 className="h2 max-w-4xl">{CLUSTER_LABELS[cluster]}</h2>

                  <ul className="flex max-w-3xl flex-col gap-4">
                    {pages.map((page) => (
                      <li key={page.slug} className="flex flex-col gap-1">
                        <Link
                          href={`/${page.slug}`}
                          className="text-copula-orange text-lg font-semibold underline underline-offset-4 transition-opacity hover:opacity-70 md:text-xl"
                        >
                          {page.linkLabel}
                        </Link>
                        <p className="text-dark-grey text-base leading-relaxed">
                          {page.description}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
