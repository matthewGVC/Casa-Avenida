/**
 * Slow infinite ticker strip.
 * Built as a toggleable component — remove by passing enabled={false}.
 * Pause-on-hover handled via CSS class toggle on the track.
 */
interface MarqueeStripProps {
  enabled?: boolean;
}

const TEXT =
  "CASA AVENIDA \u00b7 DELRAY BEACH \u00b7 8 EXCLUSIVE RESIDENCES \u00b7 COMPLETION Q2 2027 \u00b7 \u2726 \u00a0\u00a0\u00a0";

export default function MarqueeStrip({ enabled = true }: MarqueeStripProps) {
  if (!enabled) return null;

  return (
    <div
      data-marquee-enabled="true"
      className="bg-lunar border-y border-white/10 overflow-hidden py-3"
      aria-hidden="true"
    >
      {/* Two identical spans — first drives the animation, second is the seamless repeat */}
      <div className="marquee-track select-none">
        <span className="font-heading text-white/50 text-[10px] tracking-[0.2em] whitespace-nowrap">
          {TEXT}
        </span>
        <span className="font-heading text-white/50 text-[10px] tracking-[0.2em] whitespace-nowrap">
          {TEXT}
        </span>
        <span className="font-heading text-white/50 text-[10px] tracking-[0.2em] whitespace-nowrap">
          {TEXT}
        </span>
        <span className="font-heading text-white/50 text-[10px] tracking-[0.2em] whitespace-nowrap">
          {TEXT}
        </span>
      </div>
    </div>
  );
}
