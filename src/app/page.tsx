import { About } from "@/components/About";
import { Clients } from "@/components/Clients";
import { CtaBanner } from "@/components/CtaBanner";
import { FAQ } from "@/components/FAQ";
import { FeaturedWork } from "@/components/FeaturedWork";
import { Hero } from "@/components/Hero";
import { LatestNews } from "@/components/LatestNews";
import { Manifesto } from "@/components/Manifesto";
import { Services } from "@/components/Services";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { seoConfig } from "@/lib/seo";
import { buildFaqPage } from "@/lib/structured-data";

/**
 * FAQPage for the home page's own FAQ accordion.
 *
 * This lives here rather than in the root layout because FAQPage describes one
 * page's visible content. Emitting it from the layout would attach the home
 * page's FAQ to every URL on the site and collide with the landing pages' own
 * FAQPage blocks.
 */
const faqPageJson = JSON.stringify(buildFaqPage(seoConfig)).replace(
  /</g,
  "\\u003c",
);

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: faqPageJson }}
      />
      {/*
        A single, honest, screen-reader-only H1 naming the business and what it
        does. The visible hero is a rotating word animation, so it cannot serve
        as a stable H1.

        This deliberately replaces the previous hidden block, which repeated
        "best ... agency" across an H1 plus roughly 400 words of invisible copy
        and even listed "Top searches we rank for". Hidden keyword lists are
        named directly in Google's spam policies and are a likely cause of
        unstable ranking. That content now lives as real visible copy on the
        location pages under src/lib/landing-pages.ts, where it can rank
        legitimately.
      */}
      <h1 className="sr-only">
        TheClientPilot — AI marketing agency in Guwahati, Assam
      </h1>
      <SiteHeader />
      <main>
        <Hero />
        <Manifesto />
        <Services />
        <CtaBanner />
        <FeaturedWork />
        <Clients />
        <About />
        <LatestNews />
        <FAQ />
      </main>
      <SiteFooter />
    </>
  );
}
