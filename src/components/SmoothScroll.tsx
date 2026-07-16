"use client";

import { useEffect } from "react";
import Lenis from "lenis";

export function SmoothScroll() {
  useEffect(() => {
    // Respect users who prefer reduced motion
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (prefersReduced.matches) return;

    const lenis = new Lenis({
      // Wheel/continuous smoothing. High lerp = the scroll position catches up
      // to input almost immediately (no trailing/floaty lag), while still
      // taking the edge off raw wheel notches.
      lerp: 0.35,
      // Anchor / programmatic scrollTo animation: short duration + fast
      // ease-out so link jumps feel immediate, not like a slow glide.
      duration: 0.5,
      easing: (t: number) => 1 - Math.pow(1 - t, 2),
      // Native-feeling wheel input — no added momentum.
      wheelMultiplier: 1,
      touchMultiplier: 1,
      // Smooth the wheel; let touch devices keep native OS feel.
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
