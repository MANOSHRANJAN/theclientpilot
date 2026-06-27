"use client";

import { useEffect } from "react";
import Lenis from "lenis";

export function SmoothScroll() {
  useEffect(() => {
    // Respect users who prefer reduced motion
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (prefersReduced.matches) return;

    const lenis = new Lenis({
      // Inertial smoothing. Higher = more "glide", lower = snappier.
      lerp: 0.1,
      // Wheel multiplier — keep close to native so jumps still feel responsive
      wheelMultiplier: 1,
      touchMultiplier: 1.2,
      // Allow native scroll on touch devices (mobile users expect OS feel)
      smoothWheel: true,
    });

    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    let rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return null;
}
