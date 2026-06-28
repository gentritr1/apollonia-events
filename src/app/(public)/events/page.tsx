import type { Metadata } from "next";
import Link from "next/link";

import { MeanderRule } from "@/components/public/meander-rule";
import { SectionHeading } from "@/components/public/section-heading";
import { EventCard } from "@/components/public/event-card";
import { eventTypes } from "@/lib/content";

export const metadata: Metadata = {
  title: "Events — Apollonia Events",
  description:
    "Weddings, private dinners, celebrations, and corporate gatherings, each arranged with a considered hand.",
};

const process = [
  {
    step: "01",
    title: "Enquire",
    detail: "Share your date, occasion, and guest count through a brief request.",
  },
  {
    step: "02",
    title: "We hold the day",
    detail: "We confirm availability and provisionally reserve your date.",
  },
  {
    step: "03",
    title: "Plan together",
    detail: "A dedicated host shapes the menu, flow, and details with you.",
  },
  {
    step: "04",
    title: "The occasion",
    detail: "Arrive to a venue that is wholly, quietly yours.",
  },
];

export default function EventsPage() {
  return (
    <>
      <section className="marble-wash">
        <div className="mx-auto w-full max-w-3xl px-6 py-24 text-center">
          <p className="overline mb-5">Events</p>
          <MeanderRule units={5} className="mx-auto mb-8 opacity-80" />
          <h1 className="text-balance text-5xl text-ink sm:text-6xl">
            Occasions worth the setting
          </h1>
          <p className="mx-auto mt-7 max-w-xl text-pretty text-lg leading-relaxed text-ink-soft">
            Whatever the gathering, Apollonia hosts one at a time — with the
            attention that only an undivided day allows.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 py-24">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {eventTypes.map((e) => (
            <EventCard
              key={e.slug}
              title={e.title}
              description={e.description}
              tone={e.tone}
            />
          ))}
        </div>
      </section>

      <section className="bg-marble/40 py-24">
        <div className="mx-auto w-full max-w-6xl px-6">
          <SectionHeading
            overline="The Process"
            title="From enquiry to occasion"
            align="center"
          />
          <ol className="mt-16 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {process.map((p) => (
              <li key={p.step}>
                <span className="font-serif text-4xl text-gold">{p.step}</span>
                <div className="hairline my-5" />
                <h3 className="text-xl text-ink">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                  {p.detail}
                </p>
              </li>
            ))}
          </ol>
          <div className="mt-16 text-center">
            <Link
              href="/reserve"
              className="inline-block rounded-full bg-aegean px-8 py-3.5 text-sm font-medium tracking-wide text-ivory transition-colors hover:bg-aegean-deep"
            >
              Begin a reservation
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
