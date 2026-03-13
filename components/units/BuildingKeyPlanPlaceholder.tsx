/**
 * Placeholder for the interactive Building Key Plan SVG.
 * Deferred: waiting on site plan images from team.
 * Displays a "Coming Soon" state with unit count callout.
 */
export default function BuildingKeyPlanPlaceholder() {
  return (
    <div className="relative bg-white/5 border border-white/10 flex flex-col items-center justify-center min-h-[340px] lg:min-h-[480px]">
      {/* Corner rule */}
      <div className="absolute top-0 left-0 w-12 h-px bg-sapling/40" />
      <div className="absolute top-0 left-0 w-px h-12 bg-sapling/40" />
      <div className="absolute bottom-0 right-0 w-12 h-px bg-sapling/40" />
      <div className="absolute bottom-0 right-0 w-px h-12 bg-sapling/40" />

      <div className="text-center px-8">
        {/* Icon */}
        <svg
          width="48"
          height="48"
          viewBox="0 0 48 48"
          fill="none"
          aria-hidden="true"
          className="mx-auto mb-6 text-sapling/30"
        >
          <rect x="6" y="8" width="36" height="32" stroke="currentColor" strokeWidth="1.5" />
          <line x1="6" y1="24" x2="42" y2="24" stroke="currentColor" strokeWidth="1" />
          <line x1="24" y1="8" x2="24" y2="40" stroke="currentColor" strokeWidth="1" />
          <line x1="6" y1="16" x2="24" y2="16" stroke="currentColor" strokeWidth="0.75" />
          <line x1="24" y1="32" x2="42" y2="32" stroke="currentColor" strokeWidth="0.75" />
        </svg>

        <p className="font-heading text-sapling/50 text-[10px] tracking-heading mb-3">
          BUILDING KEY PLAN
        </p>
        <p className="font-body text-white/40 text-sm max-w-[240px] leading-relaxed">
          Interactive site plan arriving soon — 8 exclusive residences
        </p>
      </div>
    </div>
  );
}
