import ScrollFade from "@/components/animations/ScrollFade";

const PILLARS = [
  {
    label: "PRECISION",
    body: "Every dimension resolved in dialogue with the Delray Beach streetscape — setbacks, sight-lines, and shadow studies calibrated to the site at 102 SE 5th Avenue.",
  },
  {
    label: "MATERIAL",
    body: "Two curated finish collections — Brisa and Noir — each a complete material language from flooring to fixture, designed by South Florida's most respected interiors teams.",
  },
  {
    label: "VERTICAL LIVING",
    body: "Four distinct levels. Ground to sky. Each floor programmed with intention: arrival, living, sleeping, sky. The townhome reimagined for how life is actually lived.",
  },
];

/**
 * Full-bleed architecture philosophy section.
 * Dark Lunar background, Bahama Blue rule accents, three pillars.
 */
export default function ArchitectureFeature() {
  return (
    <section
      className="bg-lunar py-24 lg:py-36 px-6 lg:px-12 border-t border-white/10"
      aria-labelledby="architecture-heading"
    >
      <div className="max-w-[1440px] mx-auto">
        <ScrollFade className="mb-16 lg:mb-20 max-w-2xl">
          <p className="font-heading text-bahama text-xs tracking-heading mb-4">
            RWB-LINARES ARCHITECTURE
          </p>
          <h2
            id="architecture-heading"
            className="font-display text-white text-[clamp(2rem,4vw,3.5rem)] leading-tight"
          >
            ARCHITECTURE AS<br />A WAY OF LIVING
          </h2>
        </ScrollFade>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 border-t border-white/10">
          {PILLARS.map(({ label, body }, i) => (
            <ScrollFade
              key={label}
              delay={i * 100}
              className="py-10 lg:py-12 pr-0 lg:pr-12 border-b lg:border-b-0 lg:border-r border-white/10 last:border-0 last:lg:border-0"
            >
              <div className="flex items-start gap-4">
                <div className="w-0.5 h-8 bg-bahama shrink-0 mt-1" aria-hidden="true" />
                <div>
                  <h3 className="font-heading text-white text-xs tracking-heading mb-4">
                    {label}
                  </h3>
                  <p className="font-body text-white/50 text-sm leading-relaxed">
                    {body}
                  </p>
                </div>
              </div>
            </ScrollFade>
          ))}
        </div>
      </div>
    </section>
  );
}
