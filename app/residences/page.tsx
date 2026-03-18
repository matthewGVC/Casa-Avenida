import type { Metadata } from "next";
import { getUnits } from "@/lib/content";
import UnitCard from "@/components/units/UnitCard";
import BuildingKeyPlanPlaceholder from "@/components/units/BuildingKeyPlanPlaceholder";
import ScrollFade from "@/components/animations/ScrollFade";

export const metadata: Metadata = {
  title: "The Residences | Casa Avenida — Delray Beach",
  description:
    "Eight exclusive four-level townhome residences in the heart of Delray Beach. Each residence features a private elevator, cocktail pool, and rooftop terrace. Prices from the low $3M range.",
  openGraph: {
    title: "The Residences | Casa Avenida",
    description: "Eight exclusive townhome residences in Delray Beach, FL.",
  },
};

export default function ResidencesPage() {
  const units = getUnits();
  const available = units.filter((u) => u.status === "available").length;

  return (
    <>
      {/* Page header */}
      <section className="bg-lunar pt-32 pb-16 lg:pt-40 lg:pb-20 px-6 lg:px-12 border-b border-white/10">
        <div className="max-w-[1440px] mx-auto">
          <ScrollFade>
            <p className="font-heading text-sapling/60 text-xs tracking-heading mb-4">
              102 SE 5TH AVE · DELRAY BEACH, FL
            </p>
            <h1 className="font-display text-white text-[clamp(2.5rem,6vw,5rem)] leading-none mb-6">
              THE RESIDENCES
            </h1>
            <p className="font-body text-white/60 text-base lg:text-lg max-w-xl leading-relaxed">
              Eight four-level townhomes, each with a private elevator, cocktail pool, and
              rooftop terrace. {available === 8 ? "All residences" : `${available} of 8 residences`}{" "}
              available.
            </p>
          </ScrollFade>
        </div>
      </section>

      {/* Building Key Plan */}
      <section className="bg-lunar py-16 lg:py-24 px-6 lg:px-12" aria-labelledby="key-plan-heading">
        <div className="max-w-[1440px] mx-auto">
          <ScrollFade className="mb-8">
            <p className="font-heading text-sapling/60 text-xs tracking-heading mb-2" id="key-plan-heading">
              SITE PLAN
            </p>
            <p className="font-body text-white/40 text-sm">
              Select a residence on the building plan to explore its details.
            </p>
          </ScrollFade>
          <ScrollFade delay={100}>
            <BuildingKeyPlanPlaceholder />
          </ScrollFade>
        </div>
      </section>

      {/* Unit grid */}
      <section
        className="bg-lunar pb-24 lg:pb-32 px-6 lg:px-12 border-t border-white/10"
        aria-labelledby="residences-grid-heading"
      >
        <div className="max-w-[1440px] mx-auto">
          <ScrollFade className="pt-16 mb-10">
            <p
              className="font-heading text-sapling/60 text-xs tracking-heading"
              id="residences-grid-heading"
            >
              ALL RESIDENCES
            </p>
          </ScrollFade>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-px bg-white/10">
            {units.map((unit, i) => (
              <ScrollFade key={unit.id} delay={i * 60} className="bg-lunar">
                <UnitCard unit={unit} allUnits={units} />
              </ScrollFade>
            ))}
          </div>

          {/* Disclaimer */}
          <ScrollFade className="mt-10">
            <p className="font-body text-white/30 text-xs leading-relaxed max-w-2xl">
              Renderings are artist&apos;s conceptual interpretations and are subject to change.
              All square footages are approximate. Prices and availability subject to change
              without notice.
            </p>
          </ScrollFade>
        </div>
      </section>
    </>
  );
}
