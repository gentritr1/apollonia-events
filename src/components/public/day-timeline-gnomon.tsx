"use client";

import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

/**
 * A small gold "gnomon" dot that travels along the day-timeline line as the
 * section crosses the viewport — a sun crossing a sundial. Desktop-only and
 * disabled under reduced motion (see .day-timeline-gnomon in globals.css).
 */
export function DayTimelineGnomon({ className }: { className?: string }) {
  const ref = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const element = ref.current;
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!element || mediaQuery.matches) {
      return;
    }

    const section = element.closest("section") ?? element.parentElement;
    if (!section) {
      return;
    }

    let frame = 0;

    const update = () => {
      frame = 0;
      const rect = section.getBoundingClientRect();
      const viewportHeight = window.innerHeight || 1;
      // p = 0 when the section top reaches 85% of the viewport height,
      // p = 1 when the section bottom reaches 35% of the viewport height.
      const startTop = 0.85 * viewportHeight;
      const endTop = 0.35 * viewportHeight - rect.height;
      const raw = (startTop - rect.top) / (startTop - endTop);
      const progress = Math.max(0, Math.min(1, raw));
      // Set on the section, not the dot: the travelling sunlight in
      // .day-timeline::after reads the same variable, so the glow and the sun
      // stay locked together instead of drifting apart.
      section.style.setProperty("--gnomon-progress", progress.toFixed(4));
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
    <span
      ref={ref}
      aria-hidden="true"
      className={cn(
        "day-timeline-gnomon pointer-events-none absolute inset-x-0 top-[1.15rem] hidden h-0 lg:block",
        className,
      )}
    >
      <span
        className="day-timeline-sun absolute z-10 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ left: "calc(var(--gnomon-progress, 0) * 100%)" }}
      />
    </span>
  );
}
