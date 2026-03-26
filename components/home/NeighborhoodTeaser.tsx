import Link from "next/link";
import ScrollFade from "@/components/animations/ScrollFade";
import MapTeaser from "@/components/map/MapTeaser";
import { getPOIs } from "@/lib/content";

const DISTANCE_CALLOUTS = [
  { label: "Atlantic Ave", dist: "1 block" },
  { label: "Beach access", dist: "5 min walk" },
  { label: "Award-winning dining", dist: "2 min walk" },
  { label: "Palm Beach Intl Airport", dist: "25 min" },
];

export default function NeighborhoodTeaser() {
  const pois = getPOIs();

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
            Delray Beach has emerged as South Florida&apos;s most coveted address — a walkable,
            world-class destination where acclaimed restaurants, boutique hotels, wellness studios,
            and a Blue Wave beach converge within minutes. Casa Avenida places you at the center of
            it all.
          </p>

          <ul className="space-y-3 mb-10" role="list">
            {DISTANCE_CALLOUTS.map((item) => (
              <li key={item.label} className="flex items-center gap-4">
                <span className="font-heading text-sapling text-xs tracking-heading shrink-0">
                  {item.dist.toUpperCase()}
                </span>
                <span className="w-px h-3 bg-white/20 shrink-0" aria-hidden="true" />
                <span className="font-body text-white/50 text-sm">{item.label}</span>
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

        {/* Right — live interactive map */}
        <ScrollFade delay={150}>
          <div
            className="relative w-full overflow-hidden border border-white/10"
            style={{ aspectRatio: "4/5" }}
          >
            <MapTeaser pois={pois} />
            {/* Bottom fade into section */}
            <div
              className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none z-[400]"
              style={{ background: "linear-gradient(to top, rgba(55,58,54,0.5) 0%, transparent 100%)" }}
              aria-hidden="true"
            />
          </div>
          <p className="font-heading text-white/25 text-[9px] tracking-heading mt-3 text-center">
            CLICK ANY PIN TO EXPLORE NEARBY
          </p>
        </ScrollFade>

      </div>
    </section>
  );
}
