"use client";

import { useId } from "react";

import { cn } from "@/lib/utils";

/**
 * A short, tileable Greek-key (meander) ornament rendered as a thin gold band.
 * Used sparingly as a section accent — never as a background fill.
 *
 * Static (fully drawn) by default. When placed inside a `.reveal` container it
 * draws itself left-to-right on reveal via pure CSS keyed off the container's
 * `.reveal-ready.is-visible` state (see globals.css) — no JS observer here.
 */
export function MeanderRule({
  className,
  units = 6,
}: {
  className?: string;
  units?: number;
}) {
  const gradientId = useId().replace(/:/g, "");
  const tile = 21;
  const width = tile * units;

  return (
    <svg
      role="presentation"
      aria-hidden="true"
      width={width}
      height={12}
      viewBox={`0 0 ${width} 12`}
      className={cn("meander-rule text-gold/70", className)}
    >
      <defs>
        <linearGradient id={gradientId} x1="0%" x2="100%" y1="0%" y2="0%">
          <stop stopColor="var(--color-gold-soft)" />
          <stop offset="50%" stopColor="var(--color-gold)" />
          <stop offset="100%" stopColor="var(--color-gold-soft)" />
        </linearGradient>
      </defs>
      {Array.from({ length: units }, (_, index) => {
        const x = index * tile;

        return (
          <path
            key={index}
            className="meander-line"
            d={`M${x} 12 H${x + 21} M${x} 12 V3 H${x + 15} V9 H${x + 6} V6`}
            pathLength={1}
            fill="none"
            stroke={`url(#${gradientId})`}
            strokeWidth={1.2}
            strokeLinecap="square"
          />
        );
      })}
    </svg>
  );
}
