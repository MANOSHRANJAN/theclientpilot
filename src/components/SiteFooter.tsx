import Link from "next/link";
import { BondButton } from "./BondButton";

const NAV = [
  { text: "About", href: "/about" },
  { text: "Blog", href: "/blog" },
  { text: "Work", href: "/#work" },
  { text: "Contact", href: "/contact" },
];

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
              {NAV.map((n) => (
                <li key={n.href}>
                  <Link
                    href={n.href}
                    className="h3 uppercase transition-opacity duration-300 hover:opacity-55"
                  >
                    {n.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex shrink-0 justify-end">
            <BondButton
              href="/contact"
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
