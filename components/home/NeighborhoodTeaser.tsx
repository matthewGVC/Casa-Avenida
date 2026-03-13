import Link from "next/link";
import ScrollFade from "@/components/animations/ScrollFade";

const DISTANCE_CALLOUTS = [
  "1 block to Atlantic Ave",
  "5 min to the beach",
  "2 min to dining",
  "25 min to Palm Beach Airport",
];

/**
 * Neighborhood teaser: editorial paragraph + distance callouts + CTA.
 * Static — interactive map lives on /neighborhood.
 */
export default function NeighborhoodTeaser() {
  return (
    <section
      className="bg-lunar py-24 lg:py-32 px-6 lg:px-12 border-t border-white/10"
      aria-labelledby="neighborhood-heading"
    >
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

        {/* Left — copy */}
        <ScrollFade>
          <p className="font-heading text-sapling/60 text-xs tracking-heading mb-6">
            THE NEIGHBORHOOD
          </p>
          <h2
            id="neighborhood-heading"
            className="font-display text-white text-[clamp(2rem,4vw,3rem)] leading-tight mb-8"
          >
            ONE BLOCK FROM<br />ATLANTIC AVENUE
          </h2>
          <div className="gold-rule w-12 mb-8" />
          <p className="font-body text-white/60 text-base leading-relaxed max-w-md mb-10">
            Delray Beach has emerged as South Florida&apos;s most coveted address — a walkable, world-class destination where acclaimed restaurants, boutique hotels, wellness studios, and a Blue Wave beach converge within minutes. Casa Avenida places you at the center of it all.
          </p>

          {/* Distance callouts */}
          <ul className="space-y-3 mb-10" role="list">
            {DISTANCE_CALLOUTS.map((callout) => (
              <li key={callout} className="flex items-center gap-3">
                <div className="w-1 h-1 rounded-full bg-sapling shrink-0" aria-hidden="true" />
                <span className="font-body text-white/60 text-sm">{callout}</span>
              </li>
            ))}
          </ul>

          <Link
            href="/neighborhood"
            className="btn-sweep font-heading text-xs tracking-nav px-7 py-3.5 border border-sapling text-sapling hover:text-lunar transition-colors duration-300 inline-flex"
          >
            EXPLORE THE NEIGHBORHOOD
          </Link>
        </ScrollFade>

        {/* Right — map placeholder */}
        <ScrollFade delay={150}>
          <div className="relative aspect-square w-full bg-lunar border border-white/10 overflow-hidden flex flex-col items-center justify-center gap-4">
            <div className="text-center px-8">
              <div className="font-display text-sapling/30 text-5xl mb-4">A</div>
              <p className="font-heading text-white/20 text-[10px] tracking-heading">
                102 SE 5TH AVE · DELRAY BEACH
              </p>
              <p className="font-ui text-white/15 text-[9px] mt-2">
                Interactive map on Neighborhood page
              </p>
            </div>
          </div>
        </ScrollFade>

      </div>
    </section>
  );
}
