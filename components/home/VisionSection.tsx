import Image from "next/image";
import ScrollFade from "@/components/animations/ScrollFade";
import { BLUR_DATA_URL, encodeImagePath } from "@/lib/content";

/**
 * Two-column Vision/Story section.
 * Left: editorial pull quote in Quake display.
 * Right: architectural render.
 */
export default function VisionSection() {
  // Rendered Shot is the best available hero render until unit-specific assets arrive
  const heroImage = encodeImagePath("/images/gallery/Rendered Shot.jpg");

  return (
    <section className="bg-lunar py-24 lg:py-36 px-6 lg:px-12" aria-labelledby="vision-heading">
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

        {/* Left — editorial copy */}
        <ScrollFade>
          <p className="font-heading text-sapling/60 text-xs tracking-heading mb-6">
            THE VISION
          </p>
          <blockquote className="font-display text-sapling text-[clamp(2rem,4vw,3.5rem)] leading-tight mb-8">
            <span id="vision-heading">
              EIGHT RESIDENCES.<br />
              ONE BLOCK FROM<br />
              EVERYTHING.
            </span>
          </blockquote>
          <div className="gold-rule w-12 mb-8" />
          <p className="font-body text-white/70 text-lg leading-relaxed max-w-md">
            Casa Avenida reimagines the South Florida townhome — eight architecturally precise residences, each commanding four levels of private living, steps from the energy of Atlantic Avenue and the Atlantic Ocean beyond.
          </p>
          <p className="font-body text-white/50 text-base leading-relaxed max-w-md mt-4">
            Developed by Kastelo &amp; 4TRO. Designed by RWB-Linares Architecture. Interiors by Stef Leonel and Ava Gray. Completion Q2 2027.
          </p>
        </ScrollFade>

        {/* Right — render */}
        <ScrollFade delay={150}>
          <div className="relative aspect-[3/4] w-full overflow-hidden">
            <Image
              src={heroImage}
              alt="Casa Avenida — architectural render, Delray Beach"
              fill
              className="object-cover"
              placeholder="blur"
              blurDataURL={BLUR_DATA_URL}
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </ScrollFade>

      </div>
    </section>
  );
}
