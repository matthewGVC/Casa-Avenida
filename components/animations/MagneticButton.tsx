"use client";

import { useRef, type ReactNode } from "react";

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  /** Pull distance in px, default 4 */
  strength?: number;
  /** Radius in px within which pull activates, default 30 */
  radius?: number;
}

/**
 * Wraps children in a div that applies a subtle magnetic pull on hover.
 * ±strength px within radius px of the element's center.
 * Resets on mouse leave. No JS animation libraries — pure transform.
 */
export default function MagneticButton({
  children,
  className = "",
  strength = 4,
  radius = 30,
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;

    // Check reduced motion preference
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist > radius) return;

    const factor = (1 - dist / radius) * strength;
    el.style.transform = `translate(${(dx / dist) * factor}px, ${(dy / dist) * factor}px)`;
  };

  const handleLeave = () => {
    if (ref.current) {
      ref.current.style.transform = "translate(0px, 0px)";
    }
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={`inline-block transition-transform duration-150 ease-out ${className}`}
    >
      {children}
    </div>
  );
}
