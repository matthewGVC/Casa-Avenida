import ScrollFade from "@/components/animations/ScrollFade";

const PARTNERS = [
  "RWB-LINARES ARCHITECTURE",
  "KASTELO DEVELOPMENT",
  "4TRO CAPITAL",
  "DOUGLAS ELLIMAN",
];

/**
 * Single thin credibility row with partner names in Raleway.
 * Text only — no logos until brand permissions confirmed.
 */
export default function CredibilityStrip() {
  return (
    <ScrollFade>
      <div className="bg-lunar border-y border-white/10 py-5 px-6 lg:px-12 overflow-x-auto">
        <div className="max-w-[1440px] mx-auto flex flex-wrap items-center justify-center gap-x-10 gap-y-2">
          {PARTNERS.map((name, i) => (
            <span key={name} className="flex items-center gap-10">
              <span className="font-heading text-sapling/70 text-[10px] tracking-[0.2em] whitespace-nowrap">
                {name}
              </span>
              {i < PARTNERS.length - 1 && (
                <span className="text-sapling/20 text-xs select-none" aria-hidden="true">·</span>
              )}
            </span>
          ))}
        </div>
      </div>
    </ScrollFade>
  );
}
