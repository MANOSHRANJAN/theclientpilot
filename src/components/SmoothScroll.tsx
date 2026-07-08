"use client";

import { useEffect } from "react";
import Lenis from "lenis";

export function SmoothScroll() {
  useEffect(() => {
    // Respect users who prefer reduced motion
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (prefersReduced.matches) return;

    const lenis = new Lenis({
      // Wheel/continuous smoothing. Lower lerp = more inertia carried between
      // frames, so scrolling glides more (was 0.1; 0.075 feels more fluid).
      lerp: 0.075,
      // Anchor / programmatic scrollTo animation: a longer duration with an
      // exponential ease-out gives a smooth, gliding settle to the target.
      duration: 1.4,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      // A touch more momentum so a single wheel flick travels further.
      wheelMultiplier: 1.1,
      touchMultiplier: 1.5,
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
