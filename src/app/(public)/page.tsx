import Link from "next/link";

import { MeanderRule } from "@/components/public/meander-rule";
import { SectionHeading } from "@/components/public/section-heading";
import { EventCard } from "@/components/public/event-card";
import { GalleryTile } from "@/components/public/gallery-tile";
import { eventTypes, galleryItems, venueFeatures } from "@/lib/content";

export default function Home() {
  return (
    <>
      {/* hero */}
      <section className="marble-wash">
        <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-x-16 gap-y-16 px-6 py-20 lg:grid-cols-[1.05fr_0.95fr] lg:py-28">
          <div className="max-w-xl text-center lg:text-left">
            <p className="overline mb-6">Private Events · Est. by the Aegean</p>
            <MeanderRule units={5} className="mx-auto mb-9 opacity-80 lg:mx-0" />
            <h1 className="text-balance text-5xl leading-[1.04] text-ink sm:text-6xl lg:text-7xl">
              Where gatherings become
              <span className="text-aegean"> occasions</span>.
            </h1>
            <p className="mx-auto mt-8 max-w-md text-pretty text-lg leading-relaxed text-ink-soft lg:mx-0">
              A calm, handcrafted setting for weddings, private dinners, and
              celebrations — reserved by the day, attended to by hand.
            </p>
            <div className="mt-12 flex flex-col items-center gap-4 sm:flex-row lg:items-start">
              <Link
                href="/reserve"
                className="rounded-full bg-aegean px-8 py-3.5 text-sm font-medium tracking-wide text-ivory shadow-sm transition-all hover:bg-aegean-deep hover:shadow-md"
              >
                Reserve a date
              </Link>
              <Link
                href="/gallery"
                className="rounded-full border border-marble-deep px-8 py-3.5 text-sm font-medium tracking-wide text-ink transition-colors hover:border-gold hover:text-aegean"
              >
                Explore the venue
              </Link>
            </div>
          </div>

          <div className="flex justify-center lg:justify-end">
            <figure
              aria-label="Apollonia venue"
              className="relative aspect-[3/4] w-full max-w-sm overflow-hidden rounded-[9999px_9999px_1.5rem_1.5rem] bg-gradient-to-b from-marble via-aegean-bright/35 to-aegean-deep shadow-xl ring-1 ring-gold/30"
            >
              <div className="absolute inset-0 bg-[radial-gradient(120%_70%_at_50%_0%,rgba(255,255,255,0.6),transparent_55%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(100%_100%_at_50%_120%,rgba(28,61,71,0.55),transparent_60%)]" />
              <div className="absolute inset-3 rounded-[9999px_9999px_1rem_1rem] border border-gold-soft/30" />
              <MeanderRule
                units={6}
                className="absolute bottom-7 left-1/2 -translate-x-1/2 text-gold-soft"
              />
            </figure>
          </div>
        </div>
      </section>

      {/* venue intro */}
      <section className="mx-auto w-full max-w-6xl px-6 py-24">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:items-center">
          <SectionHeading
            overline="The Venue"
            title="A house built for gathering"
            description="Apollonia is a single venue given to one occasion at a time. Marble interiors open onto an olive-shaded terrace; the light moves from morning calm to golden dusk. Nothing is rushed, and nothing is shared — the day is wholly yours."
            meander
          />
          <dl className="grid grid-cols-1 gap-x-10 gap-y-8 sm:grid-cols-2">
            {venueFeatures.map((f) => (
              <div key={f.title}>
                <dt className="font-serif text-xl text-ink">{f.title}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-ink-soft">
                  {f.detail}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* occasions */}
      <section className="bg-marble/40 py-24">
        <div className="mx-auto w-full max-w-6xl px-6">
          <SectionHeading
            overline="Occasions"
            title="Every kind of gathering"
            description="From vows to milestones to quiet dinners, each occasion is arranged with the same considered hand."
            align="center"
          />
          <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {eventTypes.map((e) => (
              <EventCard
                key={e.slug}
                title={e.title}
                description={e.description}
                tone={e.tone}
              />
            ))}
          </div>
        </div>
      </section>

      {/* gallery preview */}
      <section className="mx-auto w-full max-w-6xl px-6 py-24">
        <div className="flex flex-col items-end justify-between gap-6 sm:flex-row">
          <SectionHeading
            overline="Gallery"
            title="A glimpse of the setting"
            className="max-w-md"
          />
          <Link
            href="/gallery"
            className="text-sm tracking-wide text-aegean transition-colors hover:text-aegean-deep"
          >
            View the full gallery →
          </Link>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {galleryItems.slice(0, 3).map((item) => (
            <GalleryTile
              key={item.caption}
              caption={item.caption}
              tone={item.tone}
              className="aspect-[4/5]"
            />
          ))}
        </div>
      </section>

      {/* cta */}
      <section className="bg-aegean-deep">
        <div className="mx-auto w-full max-w-4xl px-6 py-24 text-center">
          <MeanderRule units={5} className="mx-auto mb-8 text-gold-soft" />
          <h2 className="text-balance text-4xl text-ivory sm:text-5xl">
            Reserve your date at Apollonia
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-pretty leading-relaxed text-ivory/70">
            Tell us a little about your occasion and we will hold the day while
            we plan it together.
          </p>
          <Link
            href="/reserve"
            className="mt-10 inline-block rounded-full bg-gold px-9 py-3.5 text-sm font-medium tracking-wide text-aegean-deep transition-colors hover:bg-gold-soft"
          >
            Begin a reservation
          </Link>
        </div>
      </section>
    </>
  );
}
