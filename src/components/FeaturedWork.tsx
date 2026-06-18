"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { StarBurst } from "./icons";
import { cn } from "@/lib/utils";

const HOVER_OPEN_DELAY = 100;
const HOVER_CLOSE_DELAY = 200;

interface Work {
  title: string;
  tagline: string;
  blurb: string;
  image?: string;
}

const WORKS: Work[] = [
  {
    title: "AI Receptionists",
    tagline: "Never miss a lead again.",
    blurb:
      "Always-on AI voice agents that answer every call, qualify leads, and book appointments — so no opportunity slips through.",
    image: "/images/ai-receptionist.png",
  },
  {
    title: "Business Automations",
    tagline: "Remove repetitive work.",
    blurb:
      "Custom workflows that wire your tools together and run the busywork in the background, freeing your team for what actually moves the business.",
    image: "/images/business-automation.png",
  },
  {
    title: "High-Converting Websites",
    tagline: "Built for growth.",
    blurb:
      "Fast, beautifully designed sites engineered around conversion — clear messaging, strong CTAs, and analytics baked in from day one.",
    image: "/images/high-converting-websites.png",
  },
  {
    title: "AI Ad Creatives",
    tagline: "Designed to drive results.",
    blurb:
      "Scroll-stopping ad creatives produced and iterated with AI — testing variations at the speed your campaigns demand.",
    image: "/images/ai-ad-creatives.png",
  },
];

export function FeaturedWork() {
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
  const openTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [active, setActive] = useState(0);
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const clearTimers = () => {
    if (openTimerRef.current) {
      clearTimeout(openTimerRef.current);
      openTimerRef.current = null;
    }
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  };

  const handleEnter = (i: number) => {
    clearTimers();
    if (openIdx === i) return;
    openTimerRef.current = setTimeout(() => {
      setOpenIdx(i);
    }, HOVER_OPEN_DELAY);
  };

  const handleLeave = () => {
    if (openTimerRef.current) {
      clearTimeout(openTimerRef.current);
      openTimerRef.current = null;
    }
    closeTimerRef.current = setTimeout(() => {
      setOpenIdx(null);
    }, HOVER_CLOSE_DELAY);
  };

  useEffect(() => () => clearTimers(), []);

  useEffect(() => {
    const onScroll = () => {
      const focus = window.innerHeight * 0.5;
      let bestIdx = 0;
      let bestDist = Infinity;
      itemRefs.current.forEach((el, i) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const center = rect.top + rect.height / 2;
        const dist = Math.abs(center - focus);
        if (dist < bestDist) {
          bestDist = dist;
          bestIdx = i;
        }
      });
      setActive(bestIdx);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <section id="work" className="relative bg-copula-white pt-(--padding-x)">
      <div className="text-text-black flex items-center gap-2 px-(--padding-x) pb-6">
        <StarBurst className="size-6 animate-spin-slow text-text-black" />
        <p className="display uppercase text-[40px] leading-none">Featured Work</p>
      </div>

      <div className="relative">
        <ul className="flex flex-col items-center py-[15vh]">
          {WORKS.map((w, i) => {
            const isActive = active === i;
            const isOpen = openIdx === i;
            return (
              <li
                key={w.title}
                ref={(el) => {
                  itemRefs.current[i] = el;
                }}
                onMouseEnter={() => handleEnter(i)}
                onMouseLeave={handleLeave}
                className="flex w-full flex-col items-center px-(--padding-x) py-2 text-center md:py-3"
              >
                <button
                  type="button"
                  onClick={() => setOpenIdx(isOpen ? null : i)}
                  onFocus={() => handleEnter(i)}
                  onBlur={handleLeave}
                  className="group flex flex-col items-center"
                  aria-expanded={isOpen}
                >
                  <h2
                    className={cn(
                      "display uppercase leading-[0.9] text-[clamp(48px,11vw,150px)] transition-colors duration-300",
                      isOpen ? "text-text-black" : "text-light-tan",
                      "group-hover:text-text-black"
                    )}
                  >
                    {w.title}
                  </h2>
                  <span
                    className={cn(
                      "smallBody mt-2 uppercase tracking-wider text-dark-grey transition-opacity duration-500",
                      isActive || isOpen ? "opacity-100" : "opacity-0",
                      "group-hover:opacity-100"
                    )}
                  >
                    {w.tagline}
                  </span>
                </button>

                <div
                  className={cn(
                    "grid w-full max-w-6xl overflow-hidden transition-[grid-template-rows,opacity,margin] duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
                    isOpen
                      ? "mt-8 grid-rows-[1fr] opacity-100"
                      : "mt-0 grid-rows-[0fr] opacity-0"
                  )}
                >
                  <div className="overflow-hidden">
                    <div
                      className={cn(
                        "grid gap-8 pb-6 text-left transition-all duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] md:grid-cols-[1.4fr_1fr] md:gap-14",
                        isOpen
                          ? "translate-y-0 opacity-100 delay-150"
                          : "translate-y-4 opacity-0"
                      )}
                    >
                      <div className="relative w-full overflow-hidden rounded-3xl md:rounded-[2rem]">
                        {w.image && (
                          <Image
                            src={w.image}
                            alt={w.title}
                            width={1600}
                            height={1600}
                            sizes="(min-width: 768px) 56vw, 95vw"
                            className="h-auto w-full scale-105 object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
                          />
                        )}
                      </div>
                      <div className="flex flex-col justify-center">
                        <p className="text-dark-grey text-base md:text-xl">{w.blurb}</p>
                      </div>
                    </div>
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
