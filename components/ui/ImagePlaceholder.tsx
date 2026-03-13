interface ImagePlaceholderProps {
  className?: string;
  label?: string;
}

/**
 * Renders a lunar-background placeholder with the Casa Avenida "A" monogram.
 * Used anywhere a real image is missing or pending.
 */
export default function ImagePlaceholder({
  className = "",
  label,
}: ImagePlaceholderProps) {
  return (
    <div
      className={`bg-lunar flex flex-col items-center justify-center gap-3 ${className}`}
      aria-hidden="true"
    >
      <span className="font-display text-sapling/40 text-4xl select-none">
        A
      </span>
      {label && (
        <span className="font-ui text-white/20 text-xs uppercase tracking-widest">
          {label}
        </span>
      )}
    </div>
  );
}
