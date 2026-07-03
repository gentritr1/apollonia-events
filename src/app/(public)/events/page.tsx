import type { Metadata } from "next";
import Link from "next/link";

import { MeanderRule } from "@/components/public/meander-rule";
import { SectionHeading } from "@/components/public/section-heading";
import { EventCard } from "@/components/public/event-card";
import { Reveal } from "@/components/public/reveal";
import { eventTypes, eventsCopy } from "@/lib/content";

export const metadata: Metadata = eventsCopy.metadata;

export default function EventsPage() {
  return (
    <>
      <section className="marble-wash">
        <div className="hero-sequence mx-auto w-full max-w-3xl px-6 py-24 text-center">
          <p className="overline mb-5">{eventsCopy.header.overline}</p>
          <MeanderRule units={5} className="mx-auto mb-8 opacity-80" />
          <h1 className="text-balance text-5xl text-ink sm:text-6xl">
            {eventsCopy.header.title}
          </h1>
          <p className="mx-auto mt-7 max-w-xl text-pretty text-lg leading-relaxed text-ink-soft">
            {eventsCopy.header.description}
          </p>
        </div>
      </section>

      <Reveal as="section" className="mx-auto w-full max-w-6xl px-6 py-24" stagger>
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
      </Reveal>

      <Reveal as="section" className="bg-marble/40 py-24" stagger>
        <div className="mx-auto w-full max-w-6xl px-6">
          <SectionHeading
            marker="Α΄"
            overline={eventsCopy.processHeading.overline}
            title={eventsCopy.processHeading.title}
            align="center"
          />
          <ol className="mt-16 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {eventsCopy.process.map((p) => (
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
              className="btn btn-primary"
            >
              {eventsCopy.cta}
            </Link>
          </div>
        </div>
      </Reveal>
    </>
  );
}
