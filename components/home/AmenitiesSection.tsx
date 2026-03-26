import ScrollFade from "@/components/animations/ScrollFade";

const AMENITIES = [
  {
    number: "01",
    label: "PRIVATE ELEVATOR",
    body: "Each residence commands a private in-unit elevator spanning all four levels. No shared lobbies, no shared corridors — complete vertical privacy.",
    detail: "4 LEVELS · IN-UNIT",
  },
  {
    number: "02",
    label: "COCKTAIL POOL + GARDEN",
    body: "A ground-level private pool framed by a curated garden. An outdoor sanctuary that makes Casa Avenida unlike any other Delray Beach address.",
    detail: "PRIVATE · GROUND LEVEL",
  },
  {
    number: "03",
    label: "ROOFTOP TERRACE",
    body: "The fourth level opens entirely to sky — a private rooftop terrace with summer kitchen and unobstructed views above the Delray Beach roofline.",
    detail: "SUMMER KITCHEN · FOURTH LEVEL",
  },
  {
    number: "04",
    label: "PRIVATE GARAGE + EV",
    body: "A private two-car garage with dedicated EV charging. Direct-entry access into your residence — no valet, no waiting, no compromises.",
    detail: "2-CAR · EV CHARGING",
  },
];

export default function AmenitiesSection() {
  return (
    <section
      className="bg-lunar py-24 lg:py-36 px-6 lg:px-12"
      aria-labelledby="amenities-heading"
    >
      <div className="max-w-[1440px] mx-auto">

        {/* Header */}
        <ScrollFade className="mb-20 lg:mb-28">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div>
              <p className="font-heading text-sapling/50 text-xs tracking-heading mb-4">
                INCLUDED IN EVERY RESIDENCE
              </p>
              <h2
                id="amenities-heading"
                className="font-display text-white text-[clamp(2.2rem,5vw,4rem)] leading-none"
              >
                CRAFTED FOR<br />EXCEPTIONAL LIVING
              </h2>
            </div>
            <p className="font-body text-white/40 text-sm max-w-xs leading-relaxed lg:text-right">
              Every detail considered. Every standard elevated. From ground to sky, each residence delivers four levels of uncompromised luxury.
            </p>
          </div>
        </ScrollFade>

        {/* Amenity rows */}
        <div className="space-y-0">
          {AMENITIES.map(({ number, label, body, detail }, i) => (
            <ScrollFade key={label} delay={i * 60}>
              <div className="group grid grid-cols-1 lg:grid-cols-[80px_1fr_1fr_200px] items-start gap-6 lg:gap-12 py-8 lg:py-10 border-t border-white/8 hover:border-sapling/20 transition-colors duration-500">

                {/* Number */}
                <div className="hidden lg:block">
                  <span className="font-display text-sapling/20 text-4xl leading-none group-hover:text-sapling/35 transition-colors duration-500">
                    {number}
                  </span>
                </div>

                {/* Title */}
                <div>
                  <span className="font-heading text-white text-sm tracking-heading leading-relaxed group-hover:text-sapling transition-colors duration-300">
                    {label}
                  </span>
                </div>

                {/* Body */}
                <p className="font-body text-white/50 text-sm leading-relaxed group-hover:text-white/70 transition-colors duration-300">
                  {body}
                </p>

                {/* Detail tag */}
                <div className="hidden lg:flex lg:justify-end">
                  <span className="font-heading text-[9px] tracking-[0.14em] text-sapling/30 border border-sapling/15 px-3 py-1.5 group-hover:border-sapling/30 group-hover:text-sapling/50 transition-all duration-300">
                    {detail}
                  </span>
                </div>
              </div>
            </ScrollFade>
          ))}

          {/* Bottom rule */}
          <div className="border-t border-white/8" />
        </div>

        {/* Footer note */}
        <ScrollFade delay={300} className="mt-12">
          <p className="font-heading text-white/20 text-[10px] tracking-heading text-center">
            FEATURES INCLUDED ACROSS ALL 8 RESIDENCES · COMPLETION Q2 2027
          </p>
        </ScrollFade>
      </div>
    </section>
  );
}
