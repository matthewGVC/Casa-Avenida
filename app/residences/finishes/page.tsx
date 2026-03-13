import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getFinishesPackages, BLUR_DATA_URL, encodeImagePath } from "@/lib/content";
import ImagePlaceholder from "@/components/ui/ImagePlaceholder";
import ScrollFade from "@/components/animations/ScrollFade";

export const metadata: Metadata = {
  title: "Finish Collections | Casa Avenida — Delray Beach",
  description:
    "Two distinct finish packages for Casa Avenida — Brisa, the warm coastal collection, and Noir, the dark dramatic collection. Each a complete vision of luxury living.",
  openGraph: {
    title: "Finish Collections | Casa Avenida",
    description: "Brisa and Noir — two complete visions of luxury living in Delray Beach.",
  },
};

export default function FinishesPage() {
  const packages = getFinishesPackages();

  return (
    <>
      {/* Header */}
      <section className="bg-lunar pt-32 pb-16 lg:pt-40 lg:pb-20 px-6 lg:px-12 border-b border-white/10">
        <div className="max-w-[1440px] mx-auto">
          <ScrollFade>
            <p className="font-heading text-sapling/60 text-xs tracking-heading mb-4">
              YOUR CHOICE
            </p>
            <h1 className="font-display text-white text-[clamp(2.5rem,6vw,5rem)] leading-none mb-6">
              FINISH COLLECTIONS
            </h1>
            <p className="font-body text-white/60 text-base lg:text-lg max-w-xl leading-relaxed">
              Casa Avenida offers two complete finish packages — each developed to the same
              uncompromising standard. The difference is philosophical.
            </p>
          </ScrollFade>
        </div>
      </section>

      {/* Full finishes PDF */}
      <div className="bg-lunar px-6 lg:px-12 py-6 border-b border-white/10">
        <div className="max-w-[1440px] mx-auto">
          <a
            href="/pdfs/finishes/Full Finishes Collection.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 font-heading text-[10px] tracking-heading text-sapling hover:text-sapling/80 transition-colors duration-200"
          >
            <svg width="14" height="16" viewBox="0 0 14 16" fill="none" aria-hidden="true">
              <path d="M1.5 1.5H9L12.5 5V14.5H1.5V1.5Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
              <path d="M9 1.5V5H12.5" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
              <path d="M4.5 8.5H9.5M7 6.5V10.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
            DOWNLOAD FULL FINISHES COLLECTION
          </a>
        </div>
      </div>

      {/* Package sections */}
      {packages.map((pkg, i) => (
        <section
          key={pkg.id}
          className={`bg-lunar px-6 lg:px-12 py-16 lg:py-24 ${i < packages.length - 1 ? "border-b border-white/10" : ""}`}
        >
          <div className="max-w-[1440px] mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
              {/* Image */}
              <ScrollFade className={i % 2 === 1 ? "lg:order-2" : ""}>
                <div className="relative aspect-[4/3]">
                  {pkg.heroImage ? (
                    <Image
                      src={encodeImagePath(pkg.heroImage)}
                      alt={`${pkg.name} finish collection`}
                      fill
                      className="object-cover"
                      placeholder="blur"
                      blurDataURL={BLUR_DATA_URL}
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                  ) : (
                    <ImagePlaceholder label={pkg.name} className="absolute inset-0" />
                  )}
                </div>
              </ScrollFade>

              {/* Details */}
              <ScrollFade delay={100} className={i % 2 === 1 ? "lg:order-1" : ""}>
                <div className="flex flex-col justify-center h-full space-y-6">
                  <div>
                    <p className="font-heading text-sapling/60 text-xs tracking-heading mb-2">
                      {pkg.name.toUpperCase()} COLLECTION
                    </p>
                    <h2 className="font-display text-white text-[clamp(1.5rem,3.5vw,2.5rem)] leading-tight mb-4">
                      {pkg.tagline.toUpperCase()}
                    </h2>
                    <p className="font-body text-white/60 text-base leading-relaxed">
                      {pkg.description}
                    </p>
                  </div>

                  {/* Swatch summary */}
                  <div className="space-y-3 border-t border-white/10 pt-6">
                    {pkg.swatches.map((cat) => (
                      <div key={cat.category} className="grid grid-cols-3 gap-2 items-start">
                        <p className="font-heading text-white/30 text-[9px] tracking-heading pt-0.5">
                          {cat.category.toUpperCase()}
                        </p>
                        <div className="col-span-2">
                          {cat.items.map((item) => (
                            <p key={item.name} className="font-body text-white/60 text-sm">{item.name}</p>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Downloads */}
                  <div className="flex flex-wrap gap-3 pt-2">
                    {pkg.pdf && (
                      <a
                        href={pkg.pdf}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 btn-sweep font-heading text-[10px] tracking-heading text-sapling border border-sapling/40 hover:border-sapling px-5 py-2.5 transition-colors duration-200"
                      >
                        DOWNLOAD {pkg.name.toUpperCase()} TEAR SHEET
                      </a>
                    )}
                    <Link
                      href="/gallery"
                      className="inline-flex items-center gap-2 font-heading text-[10px] tracking-heading text-white/50 border border-white/20 hover:border-white/40 hover:text-white/70 px-5 py-2.5 transition-colors duration-200"
                    >
                      VIEW GALLERY
                    </Link>
                  </div>
                </div>
              </ScrollFade>
            </div>
          </div>
        </section>
      ))}
    </>
  );
}
