"use client";

import { useEffect, useId, useRef } from "react";

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
  const ref = useRef<SVGSVGElement | null>(null);
  const gradientId = useId().replace(/:/g, "");
  const tile = 21;
  const width = tile * units;

  useEffect(() => {
    const element = ref.current;
    if (!element) {
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      element.classList.add("draw-ready");
    });

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          element.classList.add("is-drawn");
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );

    observer.observe(element);

    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, []);

  return (
    <svg
      ref={ref}
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
