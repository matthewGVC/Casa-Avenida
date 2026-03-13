"use client";

import Link from "next/link";

/**
 * Thin gold bar pinned at the bottom of the screen on mobile only.
 * Present on all pages. Links to /contact.
 */
export default function MobileInquireBar() {
  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 safe-area-bottom">
      <Link
        href="/contact"
        className="flex items-center justify-center w-full h-11 bg-sapling text-lunar font-heading text-xs tracking-nav hover:bg-sapling/90 transition-colors duration-200"
        aria-label="Inquire about a residence"
      >
        INQUIRE
      </Link>
    </div>
  );
}
