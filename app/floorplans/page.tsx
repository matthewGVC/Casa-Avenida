import type { Metadata } from "next";
import { getUnits } from "@/lib/content";
import FloorplansViewer from "@/components/floorplans/FloorplansViewer";
import ScrollFade from "@/components/animations/ScrollFade";

export const metadata: Metadata = {
  title: "Floorplans | Casa Avenida — Delray Beach",
  description:
    "Explore all eight floorplans at Casa Avenida — four-level luxury townhomes ranging from 3,000+ SF at 102 SE 5th Ave, Delray Beach. Download individual or combined PDF floorplans.",
  alternates: {
    canonical: "https://casaavenidadelray.com/floorplans",
  },
  openGraph: {
    title: "Floorplans | Casa Avenida",
    description:
      "Eight four-level luxury townhome floorplans. Private elevator, rooftop terrace, cocktail pool. Delray Beach, FL.",
  },
};

export default function FloorplansPage() {
  const units = getUnits();

  return (
    <>
      {/* Page header */}
      <section className="bg-lunar pt-32 pb-16 lg:pt-40 lg:pb-20 px-6 lg:px-12 border-b border-white/10">
        <div className="max-w-[1440px] mx-auto">
          <ScrollFade>
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
              <div>
                <p className="font-heading text-sapling/60 text-xs tracking-heading mb-4">
                  102 SE 5TH AVE · DELRAY BEACH
                </p>
                <h1 className="font-display text-white text-[clamp(2.5rem,6vw,5rem)] leading-none mb-4">
                  THE FLOORPLANS
                </h1>
                <p className="font-body text-white/50 text-sm lg:text-base max-w-lg leading-relaxed">
                  Eight four-level residences, each with private elevator, rooftop terrace, and
                  cocktail pool. Select a residence below to explore its layout.
                </p>
              </div>

              {/* Download all CTA */}
              <a
                href="/pdfs/floorplans/Floorplans.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-heading text-[10px] tracking-heading text-sapling border border-sapling/40 hover:border-sapling px-5 py-3 transition-colors duration-200 shrink-0 self-start sm:self-auto"
              >
                <svg width="11" height="13" viewBox="0 0 12 14" fill="none" aria-hidden="true">
                  <path d="M1 1H8L11 4V13H1V1Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
                  <path d="M8 1V4H11" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
                  <path d="M3.5 7.5H8.5M6 5.5V9.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                </svg>
                DOWNLOAD ALL FLOORPLANS
              </a>
            </div>
          </ScrollFade>
        </div>
      </section>

      {/* Viewer */}
      <section className="bg-lunar py-16 lg:py-24 px-6 lg:px-12">
        <div className="max-w-[1440px] mx-auto">
          <FloorplansViewer units={units} />
        </div>
      </section>
    </>
  );
}
