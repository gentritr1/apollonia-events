import { useId } from "react";

import { cn } from "@/lib/utils";

export function WaveRule({
  className,
  repeats = 6,
}: {
  className?: string;
  repeats?: number;
}) {
  const gradientId = useId().replace(/:/g, "");
  const tile = 18;
  const width = tile * repeats;

  return (
    <svg
      role="presentation"
      aria-hidden="true"
      width={width}
      height={14}
      viewBox={`0 0 ${width} 14`}
      className={cn("wave-rule text-gold/70", className)}
    >
      <defs>
        <linearGradient id={gradientId} x1="0%" x2="100%" y1="0%" y2="0%">
          <stop stopColor="var(--color-gold-soft)" />
          <stop offset="50%" stopColor="var(--color-gold)" />
          <stop offset="100%" stopColor="var(--color-gold-soft)" />
        </linearGradient>
      </defs>
      <path
        d={Array.from({ length: repeats }, (_, index) => {
          const x = index * tile;
          return `M${x} 9 C${x + 4} 1 ${x + 10} 1 ${x + 14} 9 C${x + 16} 13 ${x + 18} 13 ${x + 18} 9`;
        }).join(" ")}
        fill="none"
        stroke={`url(#${gradientId})`}
        strokeLinecap="round"
        strokeWidth={1.1}
      />
    </svg>
  );
}
