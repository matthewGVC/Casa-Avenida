"use client";

import Link from "next/link";
import { useEffect } from "react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Branded 500 / error boundary.
 * Never exposes stack traces or env info.
 */
export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log to error monitoring service if added in future
    console.error("Application error:", error.digest ?? "unknown");
  }, [error]);

  return (
    <section className="bg-lunar min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <div className="max-w-lg mx-auto space-y-6">
        {/* Monogram */}
        <div className="w-16 h-16 rounded-full border border-sapling/30 flex items-center justify-center mx-auto">
          <span className="font-display text-sapling text-2xl">A</span>
        </div>

        <div>
          <p className="font-heading text-white/20 text-[10px] tracking-heading mb-3">
            SOMETHING WENT WRONG
          </p>
          <h1 className="font-display text-white text-4xl lg:text-5xl leading-tight mb-4">
            WE&apos;RE SORRY
          </h1>
          <p className="font-body text-white/50 text-base leading-relaxed">
            An unexpected error occurred. Please try again — or contact our team directly.
          </p>
        </div>

        <div className="flex flex-wrap gap-4 justify-center pt-4">
          <button
            onClick={reset}
            className="btn-sweep font-heading text-[10px] tracking-heading px-8 py-3.5 border border-sapling text-sapling hover:text-lunar transition-colors duration-300"
          >
            TRY AGAIN
          </button>
          <Link
            href="/"
            className="font-heading text-[10px] tracking-heading px-8 py-3.5 border border-white/20 text-white/60 hover:border-white/40 hover:text-white/80 transition-colors duration-200"
          >
            RETURN HOME
          </Link>
        </div>

        {/* Contact fallback */}
        <p className="font-body text-white/30 text-sm">
          Need immediate assistance?{" "}
          <a
            href="mailto:casaavenida@elliman.com"
            className="text-sapling/60 hover:text-sapling transition-colors duration-200"
          >
            casaavenida@elliman.com
          </a>
        </p>
      </div>
    </section>
  );
}
