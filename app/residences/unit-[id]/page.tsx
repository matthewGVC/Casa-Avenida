import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { getUnit, getUnits, getFinishesPackages, formatSF } from "@/lib/content";
import Badge from "@/components/ui/Badge";
import UnitDetailTabs from "@/components/units/UnitDetailTabs";

interface Props {
  params: { id: string };
}

export async function generateStaticParams() {
  const units = getUnits();
  return units.map((u) => ({ id: u.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const unit = getUnit(params.id);
  if (!unit) return { title: "Residence Not Found | Casa Avenida" };

  return {
    title: `${unit.name} | Casa Avenida — Delray Beach`,
    description: unit.description,
    openGraph: {
      title: `${unit.name} | Casa Avenida`,
      description: unit.tagline,
    },
  };
}

export default function UnitDetailPage({ params }: Props) {
  const unit = getUnit(params.id);
  if (!unit) notFound();

  const finishes = getFinishesPackages();

  const listingSchema = {
    "@context": "https://schema.org",
    "@type": "Apartment",
    name: `Casa Avenida — ${unit.name}`,
    description: unit.description,
    url: `https://casaavenidadelray.com/residences/${unit.id}`,
    numberOfRooms: unit.bedrooms,
    numberOfBathroomsTotal: unit.bathrooms,
    floorSize: {
      "@type": "QuantitativeValue",
      value: unit.underAirSF,
      unitCode: "FTK",
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: "102 SE 5th Ave",
      addressLocality: "Delray Beach",
      addressRegion: "FL",
      postalCode: "33483",
      addressCountry: "US",
    },
  };

  return (
    <>
      {/* Schema.org structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(listingSchema) }}
      />
      {/* Breadcrumb + unit header */}
      <header className="bg-lunar pt-28 pb-0 lg:pt-32 px-6 lg:px-12 border-b border-white/10">
        <div className="max-w-[1440px] mx-auto">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center gap-2 font-heading text-[10px] tracking-heading text-white/30">
              <li>
                <Link href="/residences" className="hover:text-sapling transition-colors duration-200">
                  THE RESIDENCES
                </Link>
              </li>
              <li aria-hidden="true">·</li>
              <li className="text-white/60">{unit.name.toUpperCase()}</li>
            </ol>
          </nav>

          {/* Unit header */}
          <div className="flex items-start justify-between gap-6 pb-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <h1 className="font-display text-white text-[clamp(2rem,5vw,4rem)] leading-none">
                  {unit.name.toUpperCase()}
                </h1>
                <Badge variant={unit.status} />
              </div>
              <p className="font-body text-white/50 text-base lg:text-lg max-w-lg">
                {unit.tagline}
              </p>
            </div>
            <div className="hidden lg:block text-right shrink-0">
              <p className="font-heading text-white/30 text-[10px] tracking-heading mb-1">PRICING</p>
              <p className="font-heading text-sapling text-sm tracking-nav">{unit.priceDisplay}</p>
            </div>
          </div>

          {/* Quick specs strip */}
          <div className="flex flex-wrap gap-6 py-5 border-t border-white/10">
            <QuickSpec label="BED" value={unit.bedrooms} />
            <QuickSpec label="BATH" value={unit.bathrooms} />
            <QuickSpec label="UNDER AIR" value={`${formatSF(unit.underAirSF)} SF`} />
            <QuickSpec label="TOTAL GSF" value={`${formatSF(unit.gsf)} SF`} />
            <QuickSpec label="LEVELS" value={unit.levels} />
            <div className="lg:hidden ml-auto">
              <QuickSpec label="PRICING" value={unit.priceDisplay} />
            </div>
          </div>
        </div>
      </header>

      {/* Tab UI — client component */}
      <div className="bg-lunar min-h-screen">
        <UnitDetailTabs unit={unit} finishes={finishes} />
      </div>

      {/* Pre-construction disclaimer */}
      <div className="bg-lunar px-6 lg:px-12 pb-16 border-t border-white/10">
        <div className="max-w-[1440px] mx-auto pt-6">
          <p className="font-body text-white/25 text-xs leading-relaxed max-w-2xl">
            Renderings are artist&apos;s conceptual interpretations and are subject to change.
            All square footages are approximate. Prices, availability, and specifications subject to
            change without notice. This is not an offer to sell real property.
          </p>
        </div>
      </div>
    </>
  );
}

function QuickSpec({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="font-heading text-white/30 text-[9px] tracking-heading">{label}</span>
      <span className="font-body text-white text-sm font-medium">{value}</span>
    </div>
  );
}
