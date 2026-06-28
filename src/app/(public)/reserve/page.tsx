import type { Metadata } from "next";

import { MeanderRule } from "@/components/public/meander-rule";

export const metadata: Metadata = {
  title: "Reserve a Date — Apollonia Events",
  description:
    "Request a date at Apollonia. Tell us about your occasion and we will hold the day while we plan it together.",
};

export default function ReservePage() {
  return (
    <section className="marble-wash min-h-[70vh]">
      <div className="mx-auto w-full max-w-2xl px-6 py-28 text-center">
        <p className="overline mb-5">Reserve</p>
        <MeanderRule units={5} className="mx-auto mb-8 opacity-80" />
        <h1 className="text-balance text-5xl text-ink sm:text-6xl">
          Hold your date
        </h1>
        <p className="mx-auto mt-7 max-w-lg text-pretty text-lg leading-relaxed text-ink-soft">
          The reservation request form is being prepared. In the meantime, write
          to us and we will gladly check availability for your occasion.
        </p>
        <a
          href="mailto:hello@apollonia.events"
          className="mt-10 inline-block rounded-full bg-aegean px-9 py-3.5 text-sm font-medium tracking-wide text-ivory transition-colors hover:bg-aegean-deep"
        >
          hello@apollonia.events
        </a>
      </div>
    </section>
  );
}
