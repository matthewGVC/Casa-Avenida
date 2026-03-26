import type { Metadata } from "next";
import Image from "next/image";
import { getPOIs } from "@/lib/content";
import NeighborhoodMap from "@/components/map/NeighborhoodMap";
import ScrollFade from "@/components/animations/ScrollFade";

export const metadata: Metadata = {
  title: "The Neighborhood | Casa Avenida",
  description: "Casa Avenida sits one block from Atlantic Avenue in Delray Beach.",
};

const BLUR_DATA = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAAAAAA6fptVAAAACklEQVQI12NgAAAAAgAB4iG8MwAAAABJRU5ErkJggg==";

const LIFESTYLE_CARDS = [
  {
    label: "DINING",
    headline: "Atlantic Avenue",
    body: "Lionfish. Deck 84. Dada. Le Jardin. Some of Florida&apos;s most acclaimed restaurants begin at your front door.",
    image: "/images/gallery/Rendered%20Shot.jpg",
    imageAlt: "Casa Avenida on Atlantic Avenue, Delray Beach",
    pois: ["Lionfish", "Deck 84", "Le Jardin"],
  },
  {
    label: "BEACH",
    headline: "5 Minutes on Foot",
    body: "One of Florida&apos;s finest Blue Wave beaches is a five-minute walk from your door.",
    image: "/images/gallery/Exterior%201%20Expanded.jpg",
    imageAlt: "Delray Beach, Florida",
    pois: ["Delray Beach", "Colony Hotel"],
  },
  {
    label: "WELLNESS",
    headline: "World-Class Studios",
    body: "SoulCycle, Equinox, tennis at the ATP-grade Delray Beach Tennis Center — world-class wellness within minutes.",
    image: "/images/gallery/Brisa%20Finishes/Bonus%20Lounge%201.jpg",
    imageAlt: "Luxury lounge interior",
    pois: ["SoulCycle Delray", "Delray Beach Tennis Center"],
  },
  {
    label: "CULTURE",
    headline: "Arts and Community",
    body: "Old School Square, galleries along Swinton Avenue, and the authentic character that sets Delray apart.",
    image: "/images/gallery/Exterior%202.jpg",
    imageAlt: "Delray Beach streetscape",
    pois: ["Old School Square", "Atlantic Avenue"],
  },
];

const DISTANCE_STRIP = [
  { label: "ATLANTIC AVE", dist: "1 BLOCK" },
  { label: "BEACH ACCESS", dist: "5 MIN WALK" },
  { label: "BOCA RESORT", dist: "15 MIN" },
  { label: "PBI AIRPORT", dist: "25 MIN" },
];

export default function NeighborhoodPage() {
  const pois = getPOIs();

  return (
    <>
      <section className="bg-lunar pt-32 pb-16 lg:pt-40 lg:pb-20 px-6 lg:px-12 border-b border-white/10">
        <div className="max-w-[1440px] mx-auto">
          <ScrollFade>
            <p className="font-heading text-sapling/60 text-xs tracking-heading mb-4">DELRAY BEACH, FL</p>
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

      <section className="bg-lunar border-b border-white/10 py-10 px-6 lg:px-12">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex flex-wrap gap-8 lg:gap-0 lg:divide-x lg:divide-white/10">
            {DISTANCE_STRIP.map((item) => (
              <div key={item.label} className="text-center lg:flex-1 lg:py-2">
                <p className="font-heading text-sapling text-xl lg:text-2xl tracking-heading">{item.dist}</p>
                <p className="font-heading text-white/40 text-[9px] tracking-heading mt-1">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-lunar py-20 lg:py-28 px-6 lg:px-12 border-b border-white/10" aria-label="Lifestyle highlights">
        <div className="max-w-[1440px] mx-auto">
          <ScrollFade className="mb-12">
            <p className="font-heading text-sapling/60 text-xs tracking-heading mb-3">THE LIFESTYLE</p>
            <h2 className="font-display text-white text-[clamp(1.5rem,3vw,2.5rem)] leading-tight">
              A LIFE WITHOUT COMPROMISE
            </h2>
          </ScrollFade>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-white/10">
            {LIFESTYLE_CARDS.map((card, i) => (
              <ScrollFade key={card.label} delay={i * 80}>
                <div className="relative overflow-hidden group" style={{ aspectRatio: "4/3" }}>
                  <Image
                    src={card.image}
                    alt={card.imageAlt}
                    fill
                    sizes="(max-width: 640px) 100vw, 50vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    placeholder="blur"
                    blurDataURL={BLUR_DATA}
                  />
                  <div
                    className="absolute inset-0"
                    style={{ background: "linear-gradient(to top, rgba(20,17,10,0.92) 0%, rgba(20,17,10,0.45) 55%, rgba(20,17,10,0.15) 100%)" }}
                  />
                  <div className="absolute inset-0 flex flex-col justify-end p-6 lg:p-8">
                    <p className="font-heading text-sapling/70 text-[10px] tracking-heading mb-2">{card.label}</p>
                    <h3 className="font-display text-white text-xl lg:text-2xl leading-tight mb-3">
                      {card.headline.toUpperCase()}
                    </h3>
                    <p
                      className="font-body text-white/55 text-sm leading-relaxed mb-4 max-w-xs"
                      dangerouslySetInnerHTML={{ __html: card.body }}
                    />
                    <div className="flex flex-wrap gap-2">
                      {card.pois.map((poi) => (
                        <span
                          key={poi}
                          className="font-heading text-white/30 text-[9px] tracking-heading border border-white/15 px-2 py-1"
                        >
                          {poi.toUpperCase()}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </ScrollFade>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-lunar py-16 lg:py-24 px-6 lg:px-12" aria-labelledby="poi-heading">
        <div className="max-w-[1440px] mx-auto">
          <ScrollFade className="mb-10">
            <p className="font-heading text-sapling/60 text-xs tracking-heading mb-3" id="poi-heading">
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
    </>
  );
}
