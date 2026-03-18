import type { Metadata } from "next";
import {
  getUnits,
  getGalleryPreview,
  getSettings,
  getHeroImages,
} from "@/lib/content";

import HeroSection            from "@/components/hero/HeroSection";
import MarqueeStrip           from "@/components/home/MarqueeStrip";
import VisionSection          from "@/components/home/VisionSection";
import CredibilityStrip       from "@/components/home/CredibilityStrip";
import StatsStrip             from "@/components/home/StatsStrip";
import AmenitiesSection       from "@/components/home/AmenitiesSection";
import ResidenceTeaser        from "@/components/home/ResidenceTeaser";
import ArchitectureFeature    from "@/components/home/ArchitectureFeature";
import ConstructionTimeline   from "@/components/home/ConstructionTimeline";
import GalleryTeaser          from "@/components/home/GalleryTeaser";
import NeighborhoodTeaser     from "@/components/home/NeighborhoodTeaser";
import InquiryCTA             from "@/components/home/InquiryCTA";
import FloatingCTA            from "@/components/layout/FloatingCTA";

export const metadata: Metadata = {
  title: "Casa Avenida | Luxury Residences in Delray Beach, FL",
  description:
    "Eight boutique luxury townhome residences at 102 SE 5th Ave, Delray Beach, FL. Prices from the low $3M. Private elevator, cocktail pool, rooftop terrace. Completion Q2 2027.",
  alternates: {
    canonical: "https://casaavenidadelray.com",
  },
  openGraph: {
    title: "Casa Avenida | Luxury Residences in Delray Beach, FL",
    description:
      "Eight boutique luxury townhomes at 102 SE 5th Ave, Delray Beach — one block from Atlantic Avenue.",
    images: [{ url: "/og-default.png", width: 1200, height: 630 }],
  },
};

// Schema.org: LocalBusiness + RealEstateListing
const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": ["RealEstateAgent", "LocalBusiness"],
  name: "Casa Avenida",
  description:
    "Eight boutique luxury townhome residences at 102 SE 5th Ave, Delray Beach, FL.",
  url: "https://casaavenidadelray.com",
  telephone: "+15617993000",
  email: "casaavenida@elliman.com",
  address: {
    "@type": "PostalAddress",
    streetAddress: "102 SE 5th Ave",
    addressLocality: "Delray Beach",
    addressRegion: "FL",
    postalCode: "33483",
    addressCountry: "US",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 26.4616,
    longitude: -80.0731,
  },
  priceRange: "$$$",
};

export default function HomePage() {
  const units      = getUnits();
  const gallery    = getGalleryPreview(6);
  const settings   = getSettings();
  // Filter out unfilled hero image placeholders
  const heroImages = getHeroImages().filter((s) => s && !s.includes("hero-0"));

  return (
    <>
      {/* Schema.org structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <HeroSection images={heroImages} />
      <MarqueeStrip enabled />
      <VisionSection />
      <CredibilityStrip />
      <StatsStrip />
      <AmenitiesSection />
      <ResidenceTeaser units={units} />
      <ArchitectureFeature />
      <ConstructionTimeline data={settings.constructionTimeline} />
      <GalleryTeaser images={gallery} />
      <NeighborhoodTeaser />
      <InquiryCTA />

      {/* Home-page-only floating CTA — client component */}
      <FloatingCTA units={units} />
    </>
  );
}
