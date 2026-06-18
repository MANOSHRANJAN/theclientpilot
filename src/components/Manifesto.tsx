"use client";

import { useEffect, useRef, useState } from "react";
import { StarBurst } from "./icons";

const COPY =
  "We believe business owners should focus on growth. Not missed calls. Not repetitive tasks. Not spreadsheet chaos. Great businesses run on systems. We build those systems.";

const WORDS = COPY.split(" ");
const CURVE_TEXT = "The system behind business growth";

export function Manifesto() {
  const sectionRef = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const FRAME_MS = 40; // 25Hz cinematic step
    let last = 0;
    let pending = false;

    const compute = () => {
      pending = false;
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = el.offsetHeight - window.innerHeight;
      const scrolled = Math.min(Math.max(-rect.top, 0), total);
      setProgress(total > 0 ? scrolled / total : 0);
    };

    const onScroll = () => {
      const now = performance.now();
      const elapsed = now - last;
      if (elapsed >= FRAME_MS) {
        last = now;
        compute();
      } else if (!pending) {
        pending = true;
        window.setTimeout(() => {
          last = performance.now();
          compute();
        }, FRAME_MS - elapsed);
      }
    };

    compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Stage A: curved text slides in from off-screen left → through center → off-screen right (0 → 0.42)
  // Stage B: paragraph reveals (0.46 → 0.70)
  // Stage C: paragraph holds (0.70 → 1)
  const curveT = Math.max(0, Math.min(1, progress / 0.42));
  // Linear travel so the chain keeps moving at a steady pace
  // -50% (off-screen left) → 150% (off-screen right)
  const curveOffset = -50 + curveT * 200;
  const curveOpacity = progress < 0.44 ? 1 : Math.max(0, 1 - (progress - 0.44) * 8);

  const paragraphOpacity = Math.max(0, Math.min(1, (progress - 0.46) * 12));
  const cascadeT = Math.max(0, Math.min(1, (progress - 0.5) / 0.32));
  const cascadeEased = 1 - Math.pow(1 - cascadeT, 3);
  const reveal = Math.floor(cascadeEased * (WORDS.length + 4));

  return (
    <section ref={sectionRef} id="manifesto" className="relative h-[280vh] md:h-[320vh]">
      <div className="bg-copula-blue text-copula-white sticky top-0 flex h-svh w-full items-center justify-center overflow-hidden">
        <div className="absolute left-0 top-0 z-20 flex items-center gap-2 p-(--padding-x)">
          <StarBurst className="size-6 animate-spin-slow text-copula-white" />
          <p className="display uppercase text-[40px] leading-none">Our manifesto</p>
        </div>

        <div
          className="absolute inset-0 flex items-center justify-center overflow-hidden transition-opacity duration-300"
          style={{ opacity: curveOpacity }}
        >
          <svg
            viewBox="0 -120 1441 500"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute left-1/2 top-1/2 h-auto w-[200%] -translate-x-1/2 -translate-y-1/2 md:w-full"
            style={{ overflow: "visible" }}
          >
            <defs>
              <path
                id="manifesto-curve"
                d="M0.339844 163.94C224.22 39.5598 496.45 39.5598 720.34 163.94C944.22 288.32 1216.45 288.32 1440.34 163.94"
              />
            </defs>
            <text
              fill="currentColor"
              className="fill-copula-white"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "120px",
                textTransform: "uppercase",
                letterSpacing: "0.005em",
              }}
            >
              <textPath
                href="#manifesto-curve"
                startOffset={`${curveOffset}%`}
                textAnchor="middle"
              >
                {CURVE_TEXT}
              </textPath>
            </text>
          </svg>
        </div>

        <div
          className="relative z-10 mx-auto w-full max-w-[80rem] px-(--padding-x) text-center"
          style={{ opacity: paragraphOpacity }}
        >
          <h2 className="h1 text-copula-white uppercase leading-[1.05]">
            {WORDS.map((w, i) => (
              <span
                key={i}
                className="inline-block transition-all duration-500 ease-out"
                style={{
                  opacity: i < reveal ? 1 : 0,
                  transform: i < reveal ? "translateY(0)" : "translateY(28px)",
                  marginRight: "0.28em",
                  transitionDelay: `${Math.min(i, 10) * 35}ms`,
                }}
              >
                {w}
              </span>
            ))}
          </h2>
        </div>
      </div>
    </section>
  );
}
