"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { StarBurst } from "./icons";

const COPY =
  "We're thinkers, makers, and doers, coffee lovers (mostly all), food obsessed, curious by nature, strategic by choice. We explore, question, and connect until the answer fits. Every project is a journey, and we're here for the ride.";
const WORDS = COPY.split(" ");

export function About() {
  const ref = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = el.offsetHeight - window.innerHeight;
      const p = Math.min(Math.max(-rect.top, 0), total);
      setProgress(total > 0 ? p / total : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Choreography:
  // 0 → 0.4 : two FULL-WIDTH orange ellipses grow from top + bottom toward each other
  //           "Nice to bond with you" sits BEHIND them in cream — emerges as orange surrounds it
  // 0.4→0.55: orange floods the rest of the viewport entirely
  // 0.7→0.78: headline fades out
  // 0.78→1  : manifesto paragraph cascades word-by-word

  // Ellipses grow past 50vh so they overlap and form the X / lens crossover
  // with white triangles still visible on the left and right. They keep
  // growing through the next phase until the white wedges close.
  const approach = Math.min(1, Math.max(0, progress / 0.6));
  const approachEased = 1 - Math.pow(1 - approach, 2.4);
  const semiHeight = approachEased * 75; // each grows 0 → 75vh tall

  const flood = Math.max(0, Math.min(1, (progress - 0.56) / 0.05));
  const floodEased = 1 - Math.pow(1 - flood, 3);

  const headlineFadeOut = Math.max(0, 1 - Math.max(0, (progress - 0.6) * 16));

  const copyOpacity = Math.max(0, Math.min(1, (progress - 0.64) * 14));
  const cascadeT = Math.max(0, Math.min(1, (progress - 0.64) / 0.2));
  const cascadeEased = 1 - Math.pow(1 - cascadeT, 3);
  const reveal = Math.floor(cascadeEased * (WORDS.length + 4));

  return (
    <section ref={ref} className="relative">
      <div className="relative h-[320vh]">
        <div className="sticky top-0 h-svh w-full overflow-hidden bg-copula-white">
          {/* Eyebrow */}
          <div className="text-copula-white absolute left-0 top-0 z-30 flex items-center gap-2 p-(--padding-x)">
            <StarBurst className="size-6 animate-spin-slow text-copula-white" />
            <p className="display uppercase text-[40px] leading-none">About us</p>
          </div>

          {/* TOP orange ellipse — full width, grows down */}
          <div
            className="pointer-events-none absolute left-1/2 top-0 z-10 -translate-x-1/2 will-change-[height]"
            style={{
              width: "220vw",
              height: `${semiHeight}vh`,
              borderBottomLeftRadius: "50% 100%",
              borderBottomRightRadius: "50% 100%",
              backgroundColor: "var(--color-copula-orange)",
            }}
          />

          {/* BOTTOM orange ellipse — full width, grows up */}
          <div
            className="pointer-events-none absolute bottom-0 left-1/2 z-10 -translate-x-1/2 will-change-[height]"
            style={{
              width: "220vw",
              height: `${semiHeight}vh`,
              borderTopLeftRadius: "50% 100%",
              borderTopRightRadius: "50% 100%",
              backgroundColor: "var(--color-copula-orange)",
            }}
          />

          {/* Full-screen orange flood after collision */}
          <div
            className="pointer-events-none absolute inset-0 z-[15] bg-copula-orange transition-opacity duration-200"
            style={{ opacity: floodEased }}
          />

          {/* Headline — sits ABOVE the ellipses and the flood, so it stays
              visible in white as the orange collides and surrounds it. */}
          <div
            className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center px-(--padding-x) transition-opacity duration-300"
            style={{ opacity: headlineFadeOut }}
          >
            <h2 className="display text-copula-white text-center leading-[0.85] whitespace-pre-line">
              Nice to bond
              {"\n"}with you
            </h2>
          </div>

          {/* Manifesto paragraph + CTA */}
          <div
            className="absolute inset-0 z-20 flex items-center px-(--padding-x) py-6"
            style={{
              opacity: copyOpacity,
              pointerEvents: copyOpacity > 0.5 ? "auto" : "none",
            }}
          >
            <div className="mx-auto flex max-w-305 flex-col gap-6 md:gap-14">
              <p className="h1 text-copula-white flex flex-wrap gap-x-2 leading-[1.1] md:gap-x-4">
                {WORDS.map((w, i) => (
                  <span
                    key={i}
                    className="inline-block transition-all duration-500 ease-out"
                    style={{
                      opacity: i < reveal ? 1 : 0,
                      transform:
                        i < reveal ? "translateY(0)" : "translateY(24px)",
                      transitionDelay: `${Math.min(i, 14) * 32}ms`,
                    }}
                  >
                    {w}
                  </span>
                ))}
              </p>
              <Link
                href="/about"
                className="group flex w-max items-center gap-2 transition-opacity hover:opacity-70"
              >
                <span className="h3 text-copula-white relative pb-2 uppercase underline underline-offset-8">
                  Bond more with us
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
