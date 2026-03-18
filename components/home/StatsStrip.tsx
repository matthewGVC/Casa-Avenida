import Counter from "@/components/animations/Counter";
import ScrollFade from "@/components/animations/ScrollFade";

const STATS = [
  { target: 8,    suffix: "",    label: "RESIDENCES" },
  { target: 3000, suffix: "+",   label: "SQ FT" },
  { target: 4,    suffix: "",    label: "LEVELS" },
  { target: 1,    suffix: "",    label: "BLOCK TO ATLANTIC AVE" },
];

/**
 * Animated counter strip — numbers count 0 → N when entering viewport.
 */
export default function StatsStrip() {
  return (
    <section
      className="bg-lunar-warm gold-edge-top py-20 lg:py-28 px-6 lg:px-12 border-b border-white/10"
      aria-label="Key figures"
    >
      <div className="max-w-[1440px] mx-auto grid grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-6">
        {STATS.map(({ target, suffix, label }, i) => (
          <ScrollFade key={label} delay={i * 100} className="flex flex-col items-center text-center gap-3">
            <Counter
              target={target}
              suffix={suffix}
              className="font-display text-sapling text-[clamp(3rem,5vw,5rem)] leading-none"
            />
            <span className="font-heading text-white/50 text-[10px] tracking-[0.2em]">
              {label}
            </span>
          </ScrollFade>
        ))}
      </div>
    </section>
  );
}
