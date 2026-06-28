import type { Metadata } from "next";
import Link from "next/link";

import { MeanderRule } from "@/components/public/meander-rule";
import { SectionHeading } from "@/components/public/section-heading";
import { GalleryTile } from "@/components/public/gallery-tile";
import { venueFeatures } from "@/lib/content";

export const metadata: Metadata = {
  title: "The Venue — Apollonia Events",
  description:
    "Marble interiors and an olive-shaded terrace by the Aegean. One venue, one occasion at a time.",
};

const spaces = [
  {
    name: "The Marble Hall",
    description:
      "A serene interior of stone and soft light, set for ceremonies and seated dinners alike.",
    tone: "marble" as const,
  },
  {
    name: "The Olive Terrace",
    description:
      "An open-air terrace shaded by olive trees — for receptions, toasts, and long evenings.",
    tone: "olive" as const,
  },
  {
    name: "The Courtyard",
    description:
      "A quiet threshold of water and stone where guests arrive and the day begins.",
    tone: "aegean" as const,
  },
];

export default function VenuePage() {
  return (
    <>
      {/* page header */}
      <section className="marble-wash">
        <div className="mx-auto w-full max-w-3xl px-6 py-24 text-center">
          <p className="overline mb-5">The Venue</p>
          <MeanderRule units={5} className="mx-auto mb-8 opacity-80" />
          <h1 className="text-balance text-5xl text-ink sm:text-6xl">
            One house, given to one occasion
          </h1>
          <p className="mx-auto mt-7 max-w-xl text-pretty text-lg leading-relaxed text-ink-soft">
            Apollonia is never double-booked. From morning preparations to the
            last unhurried hour, the venue belongs entirely to your day.
          </p>
        </div>
      </section>

      {/* spaces */}
      <section className="mx-auto w-full max-w-6xl px-6 py-24">
        <SectionHeading
          overline="The Spaces"
          title="Three settings, one continuous day"
          description="Move from courtyard to hall to terrace as the occasion unfolds — each space considered, each transition calm."
        />
        <div className="mt-16 space-y-20">
          {spaces.map((space, i) => (
            <div
              key={space.name}
              className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16"
            >
              <GalleryTile
                tone={space.tone}
                className={`aspect-[4/3] ${i % 2 === 1 ? "lg:order-2" : ""}`}
              />
              <div className={i % 2 === 1 ? "lg:order-1" : ""}>
                <h3 className="text-3xl text-ink">{space.name}</h3>
                <p className="mt-4 max-w-md text-pretty text-lg leading-relaxed text-ink-soft">
                  {space.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* details */}
      <section className="bg-marble/40 py-24">
        <div className="mx-auto w-full max-w-6xl px-6">
          <SectionHeading
            overline="The Details"
            title="Everything attended to"
            align="center"
          />
          <dl className="mx-auto mt-16 grid max-w-4xl grid-cols-1 gap-x-10 gap-y-10 sm:grid-cols-2">
            {venueFeatures.map((f) => (
              <div key={f.title} className="flex gap-5">
                <span className="mt-2 h-px w-8 shrink-0 bg-gold" />
                <div>
                  <dt className="font-serif text-xl text-ink">{f.title}</dt>
                  <dd className="mt-2 leading-relaxed text-ink-soft">
                    {f.detail}
                  </dd>
                </div>
              </div>
            ))}
          </dl>
          <div className="mt-16 text-center">
            <Link
              href="/reserve"
              className="inline-block rounded-full bg-aegean px-8 py-3.5 text-sm font-medium tracking-wide text-ivory transition-colors hover:bg-aegean-deep"
            >
              Check a date
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
