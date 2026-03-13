import Link from "next/link";

/**
 * Full-width Lunar bg inquiry call-to-action strip at the bottom of the home page.
 * Inline email field that submits to /contact.
 */
export default function InquiryCTA() {
  return (
    <section
      className="bg-lunar border-t border-sapling/20 py-24 lg:py-32 px-6 lg:px-12"
      aria-labelledby="inquiry-cta-heading"
    >
      <div className="max-w-[860px] mx-auto text-center">
        <p className="font-heading text-sapling/60 text-xs tracking-heading mb-5">
          FROM THE LOW $3M
        </p>
        <h2
          id="inquiry-cta-heading"
          className="font-display text-sapling text-[clamp(2.5rem,5vw,5rem)] leading-tight mb-6"
        >
          INQUIRE ABOUT<br />A RESIDENCE
        </h2>
        <p className="font-body text-white/50 text-base leading-relaxed mb-10 max-w-lg mx-auto">
          Eight residences. Limited availability. Reach TJ Verdiglione or Nicole Melveney at Douglas Elliman for pricing and availability.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/contact"
            className="btn-sweep font-heading text-xs tracking-nav px-10 py-4 border border-sapling text-sapling hover:text-lunar transition-colors duration-300"
          >
            SCHEDULE A CONVERSATION
          </Link>
          <Link
            href="/residences"
            className="font-heading text-xs tracking-nav text-white/40 hover:text-sapling transition-colors duration-200"
          >
            VIEW FLOORPLANS →
          </Link>
        </div>
      </div>
    </section>
  );
}
