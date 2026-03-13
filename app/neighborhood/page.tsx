import type { Metadata } from "next";
import { getPOIs } from "@/lib/content";
import NeighborhoodMap from "@/components/map/NeighborhoodMap";
import ScrollFade from "@/components/animations/ScrollFade";

export const metadata: Metadata = {
  title: "The Neighborhood | Casa Avenida — Delray Beach",
  description:
    "Casa Avenida sits one block from Atlantic Avenue in the heart of downtown Delray Beach — steps from award-winning dining, the beach, fitness studios, and the best of South Florida living.",
  openGraph: {
    title: "The Neighborhood | Casa Avenida",
    description: "One block from Atlantic Avenue — the best of Delray Beach at your door.",
  },
};

const LIFESTYLE_CARDS = [
  {
    icon: "🍽",
    label: "DINING",
    headline: "Atlantic Avenue",
    body: "Lionfish, Deck 84, Le Jardin — acclaimed restaurants one block from your front door.",
  },
  {
    icon: "🏖",
    label: "BEACH",
    headline: "5 Minutes on Foot",
    body: "One of Florida's finest Blue Wave beaches. Sand, surf, and sunsets without a car.",
  },
  {
    icon: "🏊",
    label: "WELLNESS",
    headline: "SOUL Cycle & Beyond",
    body: "World-class fitness studios, spas, and wellness destinations on your doorstep.",
  },
  {
    icon: "🎨",
    label: "CULTURE",
    headline: "Arts & Entertainment",
    body: "Galleries, boutiques, rooftop bars, and the vibrant energy of downtown Delray Beach.",
  },
];

export default function NeighborhoodPage() {
  const pois = getPOIs();

  return (
    <>
      {/* Page header */}
      <section className="bg-lunar pt-32 pb-16 lg:pt-40 lg:pb-20 px-6 lg:px-12 border-b border-white/10">
        <div className="max-w-[1440px] mx-auto">
          <ScrollFade>
            <p className="font-heading text-sapling/60 text-xs tracking-heading mb-4">
              DELRAY BEACH, FL
            </p>
            <h1 className="font-display text-white text-[clamp(2.5rem,6vw,5rem)] leading-none mb-6">
              THE NEIGHBORHOOD
            </h1>
            <p className="font-body text-white/60 text-base lg:text-lg max-w-xl leading-relaxed">
              Casa Avenida sits one block from Atlantic Avenue — the heart of one of Florida&apos;s
              most celebrated coastal communities. Everything that defines the Delray Beach lifestyle
              begins at your front door.
            </p>
          </ScrollFade>
        </div>
      </section>

      {/* Lifestyle grid */}
      <section className="bg-lunar py-16 lg:py-24 px-6 lg:px-12 border-b border-white/10">
        <div className="max-w-[1440px] mx-auto">
          <ScrollFade className="mb-10">
            <p className="font-heading text-sapling/60 text-xs tracking-heading">THE LIFESTYLE</p>
          </ScrollFade>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-px bg-white/10">
            {LIFESTYLE_CARDS.map((card, i) => (
              <ScrollFade key={card.label} delay={i * 80} className="bg-lunar p-6 lg:p-8 space-y-4">
                <div className="text-3xl" aria-hidden="true">{card.icon}</div>
                <div>
                  <p className="font-heading text-sapling/60 text-[10px] tracking-heading mb-1">
                    {card.label}
                  </p>
                  <p className="font-heading text-white text-sm tracking-heading mb-2">
                    {card.headline.toUpperCase()}
                  </p>
                  <p className="font-body text-white/50 text-sm leading-relaxed">{card.body}</p>
                </div>
              </ScrollFade>
            ))}
          </div>
        </div>
      </section>

      {/* Map + POI section */}
      <section
        className="bg-lunar py-16 lg:py-24 px-6 lg:px-12"
        aria-labelledby="poi-heading"
      >
        <div className="max-w-[1440px] mx-auto">
          <ScrollFade className="mb-10">
            <p
              className="font-heading text-sapling/60 text-xs tracking-heading mb-3"
              id="poi-heading"
            >
              POINTS OF INTEREST
            </p>
            <p className="font-body text-white/50 text-sm max-w-lg leading-relaxed">
              Casa Avenida at 102 SE 5th Ave — select a category to explore what&apos;s nearby.
            </p>
          </ScrollFade>
          <ScrollFade delay={100}>
            <NeighborhoodMap pois={pois} />
          </ScrollFade>
        </div>
      </section>

      {/* Distance callouts strip */}
      <section className="bg-saddle/20 border-t border-white/10 py-10 px-6 lg:px-12">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex flex-wrap gap-8 lg:gap-16 items-center justify-center">
            {[
              { label: "ATLANTIC AVE", dist: "1 BLOCK" },
              { label: "BEACH ACCESS", dist: "5 MIN WALK" },
              { label: "BOCA RESORT", dist: "15 MIN" },
              { label: "PBI AIRPORT", dist: "25 MIN" },
            ].map((item) => (
              <div key={item.label} className="text-center">
                <p className="font-heading text-sapling text-lg tracking-heading">{item.dist}</p>
                <p className="font-heading text-white/40 text-[9px] tracking-heading mt-1">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
