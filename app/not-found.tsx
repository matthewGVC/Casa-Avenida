import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Not Found | Casa Avenida",
};

/**
 * Branded 404 — no stack traces, no env info.
 */
export default function NotFound() {
  return (
    <section className="bg-lunar min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <div className="max-w-lg mx-auto space-y-6">
        {/* Monogram */}
        <div className="w-16 h-16 rounded-full border border-sapling/30 flex items-center justify-center mx-auto">
          <span className="font-display text-sapling text-2xl">A</span>
        </div>

        <div>
          <p className="font-heading text-white/20 text-[10px] tracking-heading mb-3">404</p>
          <h1 className="font-display text-white text-4xl lg:text-5xl leading-tight mb-4">
            PAGE NOT FOUND
          </h1>
          <p className="font-body text-white/50 text-base leading-relaxed">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
        </div>

        <div className="flex flex-wrap gap-4 justify-center pt-4">
          <Link
            href="/"
            className="btn-sweep font-heading text-[10px] tracking-heading px-8 py-3.5 border border-sapling text-sapling hover:text-lunar transition-colors duration-300"
          >
            RETURN HOME
          </Link>
          <Link
            href="/residences"
            className="font-heading text-[10px] tracking-heading px-8 py-3.5 border border-white/20 text-white/60 hover:border-white/40 hover:text-white/80 transition-colors duration-200"
          >
            VIEW RESIDENCES
          </Link>
        </div>
      </div>
    </section>
  );
}
