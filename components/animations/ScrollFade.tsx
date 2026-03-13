"use client";

import { useRef, useEffect, useState, type ReactNode, type CSSProperties } from "react";

interface ScrollFadeProps {
  children: ReactNode;
  className?: string;
  /** Pixels to translate on enter. Default: 20 */
  translateY?: number;
  /** Delay in ms before animation starts. Default: 0 */
  delay?: number;
  /** Duration in ms. Default: 600 */
  duration?: number;
  /** Only animate once. Default: true */
  once?: boolean;
}

/**
 * Wraps children in a fade + translateY on scroll-enter.
 * Respects prefers-reduced-motion — instant reveal if motion is reduced.
 * Pure CSS transitions via IntersectionObserver — no Motion dependency.
 */
export default function ScrollFade({
  children,
  className = "",
  translateY = 20,
  delay = 0,
  duration = 600,
  once = true,
}: ScrollFadeProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [prefersReduced, setPrefersReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReduced(mq.matches);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setVisible(false);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [once]);

  const style: CSSProperties = prefersReduced
    ? {}
    : {
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : `translateY(${translateY}px)`,
        transition: `opacity ${duration}ms ease ${delay}ms, transform ${duration}ms ease ${delay}ms`,
      };

  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  );
}
