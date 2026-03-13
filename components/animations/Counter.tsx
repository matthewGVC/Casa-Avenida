"use client";

import { useEffect, useRef, useState } from "react";

interface CounterProps {
  target: number;
  duration?: number; // ms, default 2000
  prefix?: string;
  suffix?: string;
  className?: string;
}

/**
 * Animates a number from 0 → target using IntersectionObserver + rAF.
 * Fires once when the element enters the viewport.
 * Respects prefers-reduced-motion.
 */
export default function Counter({
  target,
  duration = 2000,
  prefix = "",
  suffix = "",
  className = "",
}: CounterProps) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started.current) return;
        started.current = true;
        observer.disconnect();

        if (prefersReduced) {
          setValue(target);
          return;
        }

        const start = performance.now();
        const tick = (now: number) => {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          // Ease out cubic
          const eased = 1 - Math.pow(1 - progress, 3);
          setValue(Math.round(eased * target));
          if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {value.toLocaleString("en-US")}
      {suffix}
    </span>
  );
}
