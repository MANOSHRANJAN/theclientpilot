"use client";

import Image from "next/image";
import { useState } from "react";
import { ChevronArrowIcon, StarBurst } from "./icons";
import { cn } from "@/lib/utils";

interface Service {
  number: string;
  title: string;
  intro: string;
  items: string[];
  result: string;
}

const SERVICES: Service[] = [
  {
    number: "01",
    title: "AI Systems",
    intro: "Never miss another lead.",
    items: [
      "AI Receptionists",
      "Call Answering",
      "Appointment Booking",
      "Lead Qualification",
      "WhatsApp Automation",
      "CRM Automation",
      "Workflow Automation",
      "Follow-Up Systems",
    ],
    result: "More leads. Less manual work.",
  },
  {
    number: "02",
    title: "Websites",
    intro: "Built to convert.",
    items: [
      "Custom-Coded Websites",
      "WordPress Websites",
      "Landing Pages",
      "SEO Optimization",
      "Speed Optimization",
      "Conversion Design",
      "Mobile Responsive",
    ],
    result: "More visitors become customers.",
  },
  {
    number: "03",
    title: "AI Content & Ads",
    intro: "Content that scales.",
    items: [
      "AI Video Ads",
      "UGC Ads",
      "Social Media Content",
      "Ad Creatives",
      "Performance Creatives",
      "Brand Content",
      "Marketing Assets",
    ],
    result: "More attention. More conversions.",
  },
];

export function Services() {
  const [open, setOpen] = useState(0);

  return (
    <section className="relative px-(--padding-x) py-5">
      <div className="text-text-black flex items-center gap-2">
        <StarBurst className="size-6 animate-spin-slow text-text-black" />
        <p className="display uppercase text-[40px] leading-none">Services</p>
      </div>

      <div className="mx-auto flex max-w-292.5 flex-col items-center justify-between gap-10 overflow-hidden py-12 md:py-19 lg:flex-row">
        <div className="flex h-full max-w-181 flex-col">
          <div className="flex flex-col gap-4">
            {SERVICES.map((s, i) => {
              const isOpen = open === i;
              return (
                <div
                  key={s.title}
                  className="border-b border-text-black/15 last:border-b-0"
                  data-state={isOpen ? "open" : "closed"}
                >
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? -1 : i)}
                    className={cn(
                      "group flex w-full items-center justify-between gap-4 py-6 text-left transition-colors md:py-8",
                      isOpen ? "text-text-black" : "text-text-black/85 hover:text-text-black"
                    )}
                  >
                    <div className="flex items-baseline gap-4 md:gap-6">
                      <span className="display text-dark-grey text-[clamp(20px,2.5vw,28px)] uppercase leading-none">
                        {s.number}
                      </span>
                      <h2 className="display text-[clamp(40px,7vw,84px)] uppercase leading-[0.95]">
                        {s.title}
                      </h2>
                    </div>
                    <ChevronArrowIcon
                      className={cn(
                        "size-8 shrink-0 text-dark-grey transition-all duration-500 md:size-12",
                        isOpen ? "rotate-180 opacity-100" : "opacity-60 group-hover:opacity-100"
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
                      <div className="pb-8 md:pb-10">
                        <p className="text-dark-grey mb-4 max-w-2xl text-base md:text-lg">
                          {s.intro}
                        </p>
                        <ul className="mb-6 flex flex-wrap gap-x-6 gap-y-3">
                          {s.items.map((it) => (
                            <li
                              key={it}
                              className="smallBody rounded-full border border-text-black/30 px-4 py-2 text-text-black"
                            >
                              {it}
                            </li>
                          ))}
                        </ul>
                        <p className="smallBody text-text-black">
                          <span className="font-semibold">Result:</span> {s.result}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="relative hidden aspect-square h-auto w-full max-w-94 lg:block">
          <Image
            src="/images/Performance-_-growth-icon.webp"
            alt="Performance & Growth"
            fill
            sizes="(min-width: 1024px) 376px, 100vw"
            className="object-cover object-center"
            priority={false}
          />
        </div>
      </div>
    </section>
  );
}
