import {
  CLUSTER_LABELS,
  CLUSTER_ORDER,
  LANDING_PAGES,
  type LandingCluster,
} from "@/lib/landing-pages";
import { seoConfig } from "@/lib/seo";
import { absoluteUrl, canonicalHome } from "@/lib/url";

/**
 * `/llms.txt` route.
 *
 * Serves the emerging llms.txt convention (proposed by Answer.AI, 2024): a
 * plain Markdown file at the site root that gives AI crawlers (ChatGPT,
 * Perplexity, Claude, Gemini, Google AI Overviews) a curated, human-readable
 * map of the site's most important content and an authoritative brand summary.
 *
 * It is a courtesy index for LLMs — NOT a blocking mechanism and NOT an
 * official standard — so it complements robots.txt / sitemap.xml rather than
 * replacing them. All URLs are derived from the single SEO config so they stay
 * on the canonical www host.
 *
 * Served as `text/plain` (Markdown) with an HTTP 200.
 */
export const dynamic = "force-static";

/**
 * Renders one `## <cluster>` section listing every landing page in it as a
 * Markdown link with its meta description as the annotation — the exact shape
 * the llms.txt convention asks for.
 *
 * Returns an empty string for a cluster with no pages so a future cluster can
 * be added to the type without emitting a dangling heading here.
 */
function renderCluster(cluster: LandingCluster, base: string): string {
  const pages = LANDING_PAGES.filter((page) => page.cluster === cluster);
  if (pages.length === 0) {
    return "";
  }

  const lines = pages.map(
    (page) =>
      `- [${page.linkLabel}](${absoluteUrl(page.slug, base)}): ${page.description}`,
  );

  return `\n## ${CLUSTER_LABELS[cluster]}\n${lines.join("\n")}\n`;
}

export function GET(): Response {
  const base = canonicalHome(seoConfig.siteUrl);
  const home = base;
  const sitemap = absoluteUrl("/sitemap.xml", base);
  const clusters = CLUSTER_ORDER.map((cluster) =>
    renderCluster(cluster, base),
  ).join("");

  // Naming the person behind the brand is the single clearest way to tell an
  // assistant that TheClientPilot is a real, attributable business rather than
  // an anonymous site. Mirrors the `Organization.founder` node in the JSON-LD.
  const founder = seoConfig.founder;
  const founderSection = founder
    ? `\n## Founder\n${founder.name} — ${founder.jobTitle}, ${seoConfig.siteName}.\n${(
        founder.sameAs ?? []
      )
        .map((url) => `- ${url}`)
        .join("\n")}\n`
    : "";

  const body = `# ${seoConfig.siteName}

> ${seoConfig.siteName} is an AI marketing agency in India, building custom AI agents, AI-powered ads (Meta & Google) and high-converting websites that bring real clients to dentists, spas, doctors and growing service businesses.

## About
${seoConfig.siteName} (TCP) is an AI-first marketing agency operating across India. It combines AI agents, AI ads and conversion-focused websites in a single offer, serving ${seoConfig.areaServed.join(", ")}.

## Key pages
- [Home](${home}): Overview of ${seoConfig.siteName} — AI agents, AI ads and websites for businesses that want more clients.
${clusters}
## Services
- AI Agents: custom AI agents for lead capture, qualification, booking and follow-up.
- AI Ads: AI-optimized Meta and Google ad campaigns focused on measurable ROI.
- Websites: fast, SEO-optimized, high-converting websites for service businesses.
- Lead Generation & Performance Marketing: campaigns for dentists, spas, clinics and doctors.
- SEO & AI Automation: local/national SEO, workflow automation and AI customer support.

## Who it serves
Dentists, dental clinics, medical spas, aesthetic clinics, doctors, healthcare practices and other local service businesses across ${seoConfig.areaServed.join(", ")}.

## Location
A service area business — no public premises. Based in ${seoConfig.addressLocality}, ${seoConfig.addressRegion} (${seoConfig.addressCountry}) and working remotely with clients across ${seoConfig.areaServed.join(", ")}. Contactable 9am–9pm every day.
${founderSection}
## Contact
${seoConfig.email ? `- Email: ${seoConfig.email}` : ""}
${(seoConfig.sameAs ?? []).map((url) => `- ${url}`).join("\n")}

## More
- [Sitemap](${sitemap})
`;

  return new Response(body, {
    status: 200,
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=0, must-revalidate",
    },
  });
}
