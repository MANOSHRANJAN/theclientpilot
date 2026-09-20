import Link from "next/link";
import { BondButton } from "./BondButton";
import { seoConfig } from "@/lib/seo";

const CONTACT = [
  { text: "theclientpilot@outlook.com", href: "mailto:theclientpilot@outlook.com" },
  { text: "@theclientpilot", href: "https://instagram.com/theclientpilot" },
];

/**
 * Human-readable phone number.
 *
 * `seoConfig.telephone` is stored in E.164 (`+918822652276`) because that is
 * what schema.org and the `tel:` protocol require, but that form is unpleasant
 * to read. This renders the same digits grouped the way an Indian mobile number
 * is normally written, while the underlying `tel:` href stays E.164.
 */
function formatPhone(e164: string): string {
  const match = /^\+(\d{2})(\d{5})(\d{5})$/.exec(e164);
  return match ? `+${match[1]} ${match[2]} ${match[3]}` : e164;
}

/**
 * Site footer.
 *
 * The location/service landing pages are not enumerated here — the footer
 * carries a single visible "Sitemap" link to `/sitemap`, which indexes them
 * all. That keeps the footer short while still giving both visitors and
 * crawlers a real path to every page. Previously nothing linked to them at all,
 * so they were orphaned and ranked accordingly.
 *
 * The rule that produced the original no-links decision still stands and must
 * not be relaxed: links must never be hidden with `sr-only`, `display: none`,
 * zero opacity or an off-screen position in order to keep them for crawlers
 * while concealing them from visitors. That is cloaking, a direct spam-policy
 * violation, and a far more serious risk than the ranking value the links would
 * provide. Either a link is visible to everyone, or it is not in the markup at
 * all. The `/sitemap` link and every link on that page satisfy this.
 */
export function SiteFooter() {
  return (
    <footer className="text-copula-white bg-almost-black w-full overflow-hidden px-5 py-10 md:px-(--padding-x) md:pb-6">
      <div className="flex flex-col items-start gap-19 md:gap-12 lg:grid lg:grid-cols-2 lg:justify-between lg:gap-6">
        <div className="flex shrink-0 flex-col">
          <Link href="/" className="shrink-0">
            <span className="display text-copula-white block text-[40px] uppercase leading-none md:text-[56px]">
              theclientpilot
            </span>
          </Link>
        </div>
        <div className="contents items-start justify-between gap-6 lg:flex">
          <div className="flex shrink-0 flex-col gap-6">
            <ul className="flex flex-col gap-2.5">
              {seoConfig.telephone && (
                <li>
                  <Link
                    href={`tel:${seoConfig.telephone}`}
                    className="h3 uppercase transition-opacity duration-300 hover:opacity-55 break-all"
                  >
                    {formatPhone(seoConfig.telephone)}
                  </Link>
                </li>
              )}
              {CONTACT.map((n) => (
                <li key={n.href}>
                  <Link
                    href={n.href}
                    target={n.href.startsWith("http") ? "_blank" : undefined}
                    rel={n.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="h3 uppercase transition-opacity duration-300 hover:opacity-55 break-all"
                  >
                    {n.text}
                  </Link>
                </li>
              ))}
            </ul>

            {/*
              Rendered as visible text because the LocalBusiness JSON-LD asserts
              the same facts, and Google's structured-data guidelines require
              markup to describe content actually present on the page. Reads
              from `seoConfig` — the same object the JSON-LD builders read — so
              the visible and marked-up values cannot drift apart.

              No street address: this is a service area business with no public
              premises. See the comment in `src/lib/seo.ts`; the wording below
              says where the business operates and when it replies, and claims
              nothing it cannot honour.
            */}
            <address className="smallBody flex flex-col gap-1 not-italic uppercase opacity-70">
              <span>
                {seoConfig.addressLocality}, {seoConfig.addressRegion}
              </span>
              <span>Serving {seoConfig.areaServedLabel}</span>
              <span>We reply 9am &ndash; 9pm, every day</span>
            </address>

            {/*
              The single visible entry point to the location and service pages.
              One honest link to a real index page gives crawlers a path to all
              of them without listing every page name in the footer — and
              without resorting to the hidden links this file warns against.
            */}
            <Link
              href="/sitemap"
              className="smallBody uppercase underline underline-offset-4 opacity-70 transition-opacity hover:opacity-100"
            >
              Sitemap
            </Link>
          </div>
          <div className="flex shrink-0 justify-end">
            <BondButton
              href="mailto:theclientpilot@outlook.com"
              label="Let's bond"
              blobClass="text-copula-orange"
              textClass="text-copula-white"
            />
          </div>
        </div>
      </div>
    </footer>
  );
}
