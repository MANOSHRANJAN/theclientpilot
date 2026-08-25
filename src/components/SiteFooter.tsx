import Link from "next/link";
import { BondButton } from "./BondButton";
import { LANDING_PAGES } from "@/lib/landing-pages";

const CONTACT = [
  { text: "theclientpilot@outlook.com", href: "mailto:theclientpilot@outlook.com" },
  { text: "@theclientpilot", href: "https://instagram.com/theclientpilot" },
];

export function SiteFooter() {
  return (
    <footer className="text-copula-white bg-almost-black w-full overflow-hidden px-5 py-10 md:px-(--padding-x) md:pb-6">
      <div className="flex flex-col items-start gap-19 md:gap-12 lg:grid lg:grid-cols-2 lg:justify-between lg:gap-6">
        <div className="flex shrink-0 flex-col gap-8">
          <Link href="/" className="shrink-0">
            <span className="display text-copula-white block text-[40px] uppercase leading-none md:text-[56px]">
              theclientpilot
            </span>
          </Link>

          {/* Site-wide internal links so every landing page is reachable from
              any page on the site, giving crawlers a path to all of them. */}
          <nav aria-label="Locations and services">
            <ul className="flex flex-col gap-2.5">
              {LANDING_PAGES.map((page) => (
                <li key={page.slug}>
                  <Link
                    href={`/${page.slug}`}
                    className="smallBody uppercase transition-opacity duration-300 hover:opacity-55"
                  >
                    {page.linkLabel}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div className="contents items-start justify-between gap-6 lg:flex">
          <div className="flex shrink-0">
            <ul className="flex flex-col gap-2.5">
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
