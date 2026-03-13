type BadgeVariant = "available" | "under-contract" | "sold" | "neutral";

interface BadgeProps {
  variant: BadgeVariant;
  label?: string;
  className?: string;
}

const VARIANT_CONFIG: Record<
  BadgeVariant,
  { color: string; defaultLabel: string }
> = {
  available:      { color: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30", defaultLabel: "Available" },
  "under-contract": { color: "bg-amber-500/20 text-amber-300 border-amber-500/30",   defaultLabel: "Under Contract" },
  sold:           { color: "bg-red-500/20 text-red-300 border-red-500/30",            defaultLabel: "Sold" },
  neutral:        { color: "bg-white/10 text-white/60 border-white/20",               defaultLabel: "" },
};

/**
 * Status badge for unit availability.
 * Usage: <Badge variant="available" /> or <Badge variant="under-contract" label="UNDER CONTRACT" />
 */
export default function Badge({ variant, label, className = "" }: BadgeProps) {
  const { color, defaultLabel } = VARIANT_CONFIG[variant];
  const text = label ?? defaultLabel;

  if (!text) return null;

  return (
    <span
      className={`inline-flex items-center font-ui text-[10px] tracking-widest uppercase px-2.5 py-1 border ${color} ${className}`}
    >
      {text}
    </span>
  );
}
