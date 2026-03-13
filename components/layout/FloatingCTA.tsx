"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

/**
 * Home-page-only floating pill.
 * Fades in after 30% page scroll, centered at the bottom of the viewport.
 * Hidden on lg+ screens behind MobileInquireBar breakpoint —
 * always shows on desktop (lg) since MobileInquireBar is lg:hidden.
 */
export default function FloatingCTA() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight);
      setVisible(pct > 0.3);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`
        fixed bottom-8 left-1/2 -translate-x-1/2 z-40
        transition-all duration-500
        ${visible ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-4 pointer-events-none"}
      `}
      aria-hidden={!visible}
    >
      <Link
        href="/contact"
        className="btn-sweep flex items-center gap-3 font-heading text-xs tracking-nav px-7 py-3.5 border border-sapling text-sapling hover:text-lunar transition-colors duration-300 shadow-lg backdrop-blur-sm bg-lunar/60"
        tabIndex={visible ? 0 : -1}
      >
        INQUIRE ABOUT A RESIDENCE
        <span aria-hidden="true" className="text-sapling/60">→</span>
      </Link>
    </div>
  );
}
