"use client";

import { useEffect, useState } from "react";
import { BondButton } from "./BondButton";
import { StarBurstLarge } from "./icons";

const ROTATING = ["automation", "ai", "website", "marketing", "growth", "all-in-1"];

export function Hero() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setIdx((i) => (i + 1) % ROTATING.length);
    }, 2200);
    return () => clearInterval(t);
  }, []);

  const word = ROTATING[idx];

  return (
    <section className="bg-copula-orange text-copula-white relative flex min-h-[100svh] w-full items-end overflow-hidden px-(--padding-x) py-(--padding-x)">
      <div className="flex w-full flex-col">
        <h1 className="display flex flex-col leading-[0.85]">
          <span className="block">Your</span>
          <span className="relative block min-h-[1em] overflow-hidden">
            <span key={word} className="hero-word block whitespace-nowrap">
              {word.split("").map((ch, i) => (
                <span
                  key={`${word}-${i}`}
                  style={{ animationDelay: `${i * 45}ms` }}
                >
                  {ch}
                </span>
              ))}
            </span>
          </span>
        </h1>
        <div className="mt-2 flex flex-col items-baseline md:flex-row md:items-center md:justify-between">
          <h1 className="display leading-[0.85]">agency</h1>
          <div className="mt-8 flex items-center gap-x-10 md:mt-0 md:gap-x-14">
            <StarBurstLarge className="text-copula-blue size-29.5 animate-spin-slow" />
            <BondButton blobClass="text-copula-blue" textClass="text-copula-white" />
          </div>
        </div>
      </div>
    </section>
  );
}
