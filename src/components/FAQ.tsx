"use client";

import { useState } from "react";
import { ChevronArrowIcon, StarBurst } from "./icons";
import { FAQ_ITEMS } from "@/lib/faq";
import { cn } from "@/lib/utils";

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  // The FAQPage JSON-LD for these items is emitted once from the root layout
  // (see `lib/structured-data.ts`). Emitting a second FAQPage block here would
  // put two conflicting FAQPage entities on the same URL.
  return (
    <section id="faq" className="relative bg-copula-orange px-(--padding-x) py-12 md:py-20">
      <div className="mx-auto flex max-w-292.5 flex-col gap-10 md:gap-16">
        <div className="flex flex-col gap-6">
          <div className="text-copula-white flex items-center gap-2">
            <StarBurst className="size-6 animate-spin-slow text-copula-white" />
            <p className="display uppercase text-[40px] leading-none">FAQ</p>
          </div>
          <h2 className="display text-copula-white leading-[0.9] max-w-4xl">
            Questions
            <br />
            we hear often.
          </h2>
        </div>

        <ul className="flex flex-col">
          {FAQ_ITEMS.map((f, i) => {
            const isOpen = open === i;
            return (
              <li
                key={f.question}
                className="border-b border-copula-white/25"
              >
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="group flex w-full items-center justify-between gap-4 py-6 text-left md:py-8"
                  aria-expanded={isOpen}
                >
                  <h3 className="h2 text-copula-white uppercase leading-[1.05]">
                    {f.question}
                  </h3>
                  <ChevronArrowIcon
                    className={cn(
                      "size-7 shrink-0 text-copula-white transition-all duration-500 md:size-10",
                      isOpen ? "rotate-180 opacity-100" : "opacity-70 group-hover:opacity-100"
                    )}
                  />
                </button>
                <div
                  className={cn(
                    "grid overflow-hidden transition-[grid-template-rows,opacity] duration-500",
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  )}
                >
                  <div className="overflow-hidden">
                    <p className="text-copula-white/90 pb-6 text-base leading-relaxed md:pb-10 md:text-lg max-w-3xl">
                      {f.answer}
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
