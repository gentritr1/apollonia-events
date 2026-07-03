"use client";

import { useEffect, useRef } from "react";

import { MeanderRule } from "@/components/public/meander-rule";
import { cn } from "@/lib/utils";

export function HeroArch({
  ariaLabel,
  className,
}: {
  ariaLabel: string;
  className?: string;
}) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const element = ref.current;
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!element || mediaQuery.matches) {
      return;
    }

    let frame = 0;

    const update = () => {
      frame = 0;
      const rect = element.getBoundingClientRect();
      const viewportHeight = window.innerHeight || 1;
      const midpoint = rect.top + rect.height / 2;
      const progress = (midpoint - viewportHeight / 2) / viewportHeight;
      const shift = Math.max(-8, Math.min(8, progress * -16));
      element.style.setProperty("--arch-shift", `${shift.toFixed(2)}px`);
    };

    const schedule = () => {
      if (frame) {
        return;
      }
      frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);

    return () => {
      if (frame) {
        window.cancelAnimationFrame(frame);
      }
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  return (
    <figure
      ref={ref}
      aria-label={ariaLabel}
      className={cn(
        "aegean-arch relative aspect-[3/4] w-full max-w-sm overflow-hidden rounded-[9999px_9999px_1.5rem_1.5rem] shadow-xl ring-1 ring-gold/30",
        className
      )}
    >
      <div className="absolute inset-3 rounded-[9999px_9999px_1rem_1rem] border border-gold-soft/30" />
      <div className="absolute inset-x-10 top-12 h-px bg-gradient-to-r from-transparent via-ivory/70 to-transparent" />
      <MeanderRule
        units={6}
        className="absolute bottom-7 left-1/2 -translate-x-1/2 text-gold-soft"
      />
    </figure>
  );
}
