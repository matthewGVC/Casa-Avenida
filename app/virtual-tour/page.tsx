import type { Metadata } from "next";
import ScrollFade from "@/components/animations/ScrollFade";

export const metadata: Metadata = {
  title: "Virtual Tour | Casa Avenida — Delray Beach",
  description:
    "Experience Casa Avenida from anywhere — an immersive virtual tour of the Brisa and Noir finish collections.",
};

// Kuula embed — collection tour for Casa Avenida Unit 8
const TOUR_URL =
  process.env.NEXT_PUBLIC_VIRTUAL_TOUR_URL ??
  "https://kuula.co/share/collection/7HylB?logo=1&info=0&logosize=136&fs=1&vr=1&zoom=1&autorotate=0.08&autop=10&autopalt=1&thumbs=2&margin=6&alpha=0.81&inst=0";

export default function VirtualTourPage() {
  return (
    <>
      {/* Minimal header */}
      <div className="bg-lunar pt-20 pb-4 px-6 lg:px-12">
        <div className="max-w-[1440px] mx-auto">
          <ScrollFade>
            <p className="font-heading text-sapling/60 text-xs tracking-heading mb-1">
              IMMERSIVE EXPERIENCE
            </p>
            <h1 className="font-display text-white text-2xl lg:text-3xl leading-tight">
              VIRTUAL TOUR
            </h1>
          </ScrollFade>
        </div>
      </div>

      {/* Tour embed — Kuula 360° viewer */}
      <div className="bg-black relative" style={{ height: "85vh" }}>
        <iframe
          src={TOUR_URL}
          title="Casa Avenida Virtual Tour"
          name="Casa Avenida Virtual Tour"
          frameBorder={0}
          width="100%"
          className="w-full border-0 block"
          style={{ height: "85vh" }}
          scrolling="no"
          allow="vr; xr; accelerometer; gyroscope; autoplay; fullscreen"
          allowFullScreen
          loading="eager"
        />
      </div>

      {/* Disclaimer */}
      <div className="bg-lunar px-6 lg:px-12 py-6 border-t border-white/10">
        <div className="max-w-[1440px] mx-auto">
          <p className="font-body text-white/25 text-xs leading-relaxed max-w-2xl">
            Virtual tour represents artist&apos;s conceptual interpretations of the finished
            residences. Actual finishes, materials, and specifications may vary.
          </p>
        </div>
      </div>
    </>
  );
}
