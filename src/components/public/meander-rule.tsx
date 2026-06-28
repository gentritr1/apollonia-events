import { cn } from "@/lib/utils";

/**
 * A short, tileable Greek-key (meander) ornament rendered as a thin gold band.
 * Used sparingly as a section accent — never as a background fill.
 */
export function MeanderRule({
  className,
  units = 6,
}: {
  className?: string;
  units?: number;
}) {
  const tile = 21;
  const width = tile * units;

  return (
    <svg
      role="presentation"
      aria-hidden="true"
      width={width}
      height={12}
      viewBox={`0 0 ${width} 12`}
      className={cn("text-gold/70", className)}
    >
      <defs>
        <pattern
          id="meander"
          width={tile}
          height={12}
          patternUnits="userSpaceOnUse"
        >
          {/* baseline keeps the band continuous across tiles */}
          <path
            d="M0 12 H21 M0 12 V3 H15 V9 H6 V6"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.2}
            strokeLinecap="square"
          />
        </pattern>
      </defs>
      <rect width={width} height={12} fill="url(#meander)" />
    </svg>
  );
}
