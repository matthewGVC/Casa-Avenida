import type { Metadata } from "next";
import ScrollFade from "@/components/animations/ScrollFade";

export const metadata: Metadata = {
  title: "Virtual Tour | Casa Avenida — Delray Beach",
  description:
    "Experience Casa Avenida from anywhere — an immersive virtual tour of the Brisa and Noir finish collections.",
};

const TOUR_URL = process.env.NEXT_PUBLIC_VIRTUAL_TOUR_URL ?? "";

export default function VirtualTourPage() {
  return (
    <>
      {/* Minimal header — nav auto-hides on this page via scroll */}
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

      {/* Tour embed */}
      <div className="bg-black relative" style={{ minHeight: "80vh" }}>
        {TOUR_URL ? (
          <iframe
            src={TOUR_URL}
            title="Casa Avenida Virtual Tour"
            className="w-full border-0"
            style={{ minHeight: "80vh", height: "80vh" }}
            allow="fullscreen; xr-spatial-tracking; gyroscope; accelerometer"
            loading="lazy"
          />
        ) : (
          /* Placeholder until team provides URL */
          <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-6">
            {/* Pulsing "A" loading indicator per spec */}
            <div className="relative mb-8">
              <div className="w-20 h-20 rounded-full border border-sapling/20 flex items-center justify-center animate-pulse">
                <span className="font-display text-sapling text-3xl">A</span>
              </div>
              <div className="absolute inset-0 rounded-full border border-sapling/10 animate-ping" />
            </div>
            <p className="font-heading text-sapling/60 text-xs tracking-heading mb-3">
              VIRTUAL TOUR
            </p>
            <p className="font-body text-white/40 text-sm max-w-sm leading-relaxed">
              The immersive tour experience is being prepared. Check back soon — or{" "}
              <a href="/contact" className="text-sapling/70 hover:text-sapling transition-colors underline">
                contact us
              </a>{" "}
              to schedule a private in-person preview.
            </p>
          </div>
        )}
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
