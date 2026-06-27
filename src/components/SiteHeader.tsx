"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { PlusIcon } from "./icons";
import { GetStartedDialog } from "./GetStartedDialog";
import { cn } from "@/lib/utils";

const NAV = [
  { text: "Our Manifesto", href: "/#manifesto" },
  { text: "Services", href: "/#services" },
  { text: "Featured Work", href: "/#work" },
  { text: "Our Clients", href: "/#clients" },
  { text: "About Us", href: "/#about" },
];

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 80);
      if (y < 80) {
        setHidden(false);
      } else if (y > lastY + 4) {
        setHidden(true);
      } else if (y < lastY - 4) {
        setHidden(false);
      }
      lastY = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header
      className={cn(
        "pointer-events-none fixed inset-x-0 top-0 z-50 transition-transform duration-300 ease-out",
        hidden && !open ? "-translate-y-full" : "translate-y-0"
      )}
    >
      <nav
        className={cn(
          "group pointer-events-auto w-full transition-all duration-500",
          scrolled || open
            ? "bg-copula-white/90 text-text-black backdrop-blur-md"
            : "bg-transparent text-copula-white"
        )}
      >
        <div className="flex items-center justify-between border-b border-current/20 px-(--padding-x) py-[0.18rem] md:py-[0.24rem]">
          <Link href="/" aria-label="theclientpilot" className="shrink-0">
            <span className="display block text-[40px] uppercase leading-none md:text-[52px]">
              theclientpilot
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setFormOpen(true)}
              className="inline-flex items-center justify-center rounded-full border-2 border-almost-black bg-almost-black px-5 py-2 text-sm font-semibold uppercase tracking-wider text-copula-white transition-all duration-300 hover:scale-110 hover:bg-copula-white hover:text-almost-black"
            >
              Book Now
            </button>

            <button
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className={cn(
                "flex size-9 items-center justify-center rounded-full transition-colors",
                scrolled || open
                  ? "bg-almost-black text-copula-white"
                  : "bg-copula-white text-copula-orange"
              )}
            >
              <PlusIcon
                className={cn(
                  "size-3 transition-transform duration-300",
                  open && "rotate-45"
                )}
              />
            </button>
          </div>
        </div>

        <div
          className={cn(
            "grid overflow-hidden transition-[grid-template-rows,opacity] duration-500 ease-out",
            open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
          )}
        >
          <div className="overflow-hidden">
            <ul className="flex flex-col items-start gap-2 px-(--padding-x) py-10 md:items-end md:py-12">
              {NAV.map((n, i) => (
                <li
                  key={n.href}
                  style={{
                    transitionDelay: open ? `${i * 60 + 60}ms` : "0ms",
                  }}
                  className={cn(
                    "transition-all duration-500",
                    open ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                  )}
                >
                  <Link
                    href={n.href}
                    onClick={() => setOpen(false)}
                    className="display text-text-black block text-[80px] uppercase leading-[0.95] transition-colors hover:text-copula-orange"
                  >
                    {n.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>

      <div
        className={cn(
          "pointer-events-auto absolute left-(--padding-x) top-[--nav-height] hidden items-start transition-opacity duration-300 md:flex",
          (scrolled || open) && "opacity-0"
        )}
      >
        <p className="smallBody max-w-38 p-4 pl-0 pt-3 font-bold text-copula-white">
          AI Systems For Modern Businesses
        </p>
      </div>

      <GetStartedDialog open={formOpen} onClose={() => setFormOpen(false)} />
    </header>
  );
}
