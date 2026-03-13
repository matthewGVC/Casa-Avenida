import Image from "next/image";
import Link from "next/link";
import type { GalleryImage } from "@/lib/types";

import ScrollFade from "@/components/animations/ScrollFade";
import { BLUR_DATA_URL } from "@/lib/content";

interface GalleryTeaserProps {
  images: GalleryImage[];
}

/**
 * 3-column masonry preview of the gallery.
 * Each image shows a permanent caption bar at bottom.
 */
export default function GalleryTeaser({ images }: GalleryTeaserProps) {
  // Ensure we show 6 images in a 3-col grid (2 rows)
  const preview = images.slice(0, 6);

  return (
    <section
      className="bg-lunar py-24 lg:py-32 px-6 lg:px-12"
      aria-labelledby="gallery-teaser-heading"
    >
      <div className="max-w-[1440px] mx-auto">
        <ScrollFade className="mb-10 flex items-end justify-between gap-4">
          <div>
            <p className="font-heading text-sapling/60 text-xs tracking-heading mb-3">
              THE GALLERY
            </p>
            <h2
              id="gallery-teaser-heading"
              className="font-display text-white text-[clamp(2rem,4vw,3rem)] leading-tight"
            >
              BRISA &amp; NOIR
            </h2>
          </div>
          <Link
            href="/gallery"
            className="font-heading text-xs tracking-nav text-sapling border-b border-sapling/40 hover:border-sapling pb-0.5 transition-colors duration-200 shrink-0"
          >
            VIEW FULL GALLERY
          </Link>
        </ScrollFade>

        {/* 3-col masonry grid */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
          {preview.map((img, i) => (
            <ScrollFade key={img.id} delay={i * 60} className="break-inside-avoid">
              <Link
                href="/gallery"
                className="relative block overflow-hidden group"
                aria-label={`View gallery — ${img.title}`}
              >
                <div className="relative w-full aspect-[4/3]">
                  <Image
                    src={`/images/gallery/${encodeURIComponent(img.filename)}`}
                    alt={img.alt}
                    fill
                    className="object-cover group-hover:scale-[1.03] transition-transform duration-700"
                    placeholder="blur"
                    blurDataURL={BLUR_DATA_URL}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
                {/* Permanent caption bar — always visible, not hover-only */}
                <div className="absolute bottom-0 left-0 right-0 bg-lunar/75 backdrop-blur-sm px-4 py-2.5">
                  <p className="font-body text-white text-xs leading-snug truncate">
                    {img.title}
                  </p>
                </div>
              </Link>
            </ScrollFade>
          ))}
        </div>

        {/* CTA */}
        <ScrollFade className="mt-12 flex justify-center">
          <Link
            href="/gallery"
            className="btn-sweep font-heading text-xs tracking-nav px-8 py-4 border border-sapling text-sapling hover:text-lunar transition-colors duration-300"
          >
            VIEW FULL GALLERY
          </Link>
        </ScrollFade>
      </div>
    </section>
  );
}
