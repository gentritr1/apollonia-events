"use client";

import { useEffect, useState } from "react";

import { testimonialsCopy } from "@/lib/content";

export function EpigraphTestimonials() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    // A single entry (e.g. the inaugural-event epigraph) never rotates.
    if (testimonialsCopy.length <= 1) {
      return;
    }

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches) {
      return;
    }

    const interval = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % testimonialsCopy.length);
    }, 6200);

    return () => window.clearInterval(interval);
  }, []);

  const active = testimonialsCopy[activeIndex];

  return (
    <figure className="mx-auto max-w-4xl px-6 text-center">
      <div className="hairline mb-10" />
      <blockquote
        key={active.quote}
        className="epigraph-quote text-balance font-serif text-3xl leading-snug text-ink/80 sm:text-4xl"
      >
        &ldquo;{active.quote}&rdquo;
      </blockquote>
      <figcaption className="overline mt-8">{active.attribution}</figcaption>
      <div className="hairline mt-10" />
    </figure>
  );
}
