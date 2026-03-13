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
  title: "Casa Avenida | Luxury Residences in Delray Beach",
  description:
    "8 boutique luxury townhome residences at 102 SE 5th Ave, Delray Beach, FL. From the low $3M. Expected completion Q2 2027.",
  openGraph: {
    title: "Casa Avenida | Luxury Residences in Delray Beach",
    description:
      "8 boutique luxury townhome residences at 102 SE 5th Ave, Delray Beach, FL. From the low $3M.",
    images: [{ url: "/images/logos/SOCIAL PREVIEW - IMAGE.png", width: 1200, height: 630 }],
  },
};

export default function HomePage() {
  const units      = getUnits();
  const gallery    = getGalleryPreview(6);
  const settings   = getSettings();
  // Filter out unfilled hero image placeholders
  const heroImages = getHeroImages().filter((s) => s && !s.includes("hero-0"));

  return (
    <>
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
      <FloatingCTA />
    </>
  );
}
