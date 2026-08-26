import Link from "next/link";
import { BondButton } from "./BondButton";

const CONTACT = [
  { text: "theclientpilot@outlook.com", href: "mailto:theclientpilot@outlook.com" },
  { text: "@theclientpilot", href: "https://instagram.com/theclientpilot" },
];

/**
 * Site footer.
 *
 * The location/service landing pages are deliberately NOT linked here. They stay
 * publicly reachable and are listed in `sitemap.xml`, which is how search engines
 * discover them.
 *
 * They must never be hidden with `sr-only`, `display: none`, zero opacity or an
 * off-screen position in order to keep the links for crawlers while concealing
 * them from visitors. That is cloaking, a direct spam-policy violation, and a
 * far more serious risk than the ranking value the links would provide.
 * Either a link is visible to everyone, or it is not in the markup at all.
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
