import type { Metadata } from "next";
import { getGalleryImages } from "@/lib/content";
import GalleryGrid from "@/components/gallery/GalleryGrid";
import ScrollFade from "@/components/animations/ScrollFade";

export const metadata: Metadata = {
  title: "Gallery | Casa Avenida — Delray Beach",
  description:
    "Explore the Brisa and Noir interior collections at Casa Avenida — eight luxury townhome residences in Delray Beach, Florida. Interiors, kitchens, primary suites, terraces, and exterior views.",
  openGraph: {
    title: "Gallery | Casa Avenida",
    description: "Brisa and Noir interior collections — eight luxury townhomes in Delray Beach.",
  },
};

export default function GalleryPage() {
  const images = getGalleryImages();

  return (
    <>
      {/* Page header */}
      <section className="bg-lunar pt-32 pb-12 lg:pt-40 lg:pb-16 px-6 lg:px-12 border-b border-white/10">
        <div className="max-w-[1440px] mx-auto">
          <ScrollFade>
            <p className="font-heading text-sapling/60 text-xs tracking-heading mb-4">
              BRISA &amp; NOIR
            </p>
            <h1 className="font-display text-white text-[clamp(2.5rem,6vw,5rem)] leading-none mb-6">
              THE GALLERY
            </h1>
            <p className="font-body text-white/60 text-base lg:text-lg max-w-xl leading-relaxed">
              Two distinct finish packages — each a complete vision. Warm coastal Brisa or dramatic
              Noir. Choose the palette that speaks to you.
            </p>
          </ScrollFade>
        </div>
      </section>

      {/* Gallery grid */}
      <section className="bg-lunar py-12 lg:py-16 px-6 lg:px-12">
        <div className="max-w-[1440px] mx-auto">
          <GalleryGrid images={images} />
        </div>
      </section>

      {/* Disclaimer */}
      <div className="bg-lunar px-6 lg:px-12 pb-16 border-t border-white/10">
        <div className="max-w-[1440px] mx-auto pt-6">
          <p className="font-body text-white/25 text-xs leading-relaxed max-w-2xl">
            Renderings are artist&apos;s conceptual interpretations and are subject to change.
            Actual finishes, materials, and specifications may vary.
          </p>
        </div>
      </div>
    </>
  );
}
