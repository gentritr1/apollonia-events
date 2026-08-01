import type { Metadata } from "next";
import Link from "next/link";
import { type CSSProperties } from "react";

import { MeanderRule } from "@/components/public/meander-rule";
import { SectionHeading } from "@/components/public/section-heading";
import { EventCard } from "@/components/public/event-card";
import { GalleryTile } from "@/components/public/gallery-tile";
import { CloudinaryGalleryTile } from "@/components/public/cloudinary-gallery-tile";
import { EpigraphTestimonials } from "@/components/public/epigraph-testimonials";
import { Reveal } from "@/components/public/reveal";
import { HeroArch } from "@/components/public/hero-arch";
import { DayTimelineGnomon } from "@/components/public/day-timeline-gnomon";
import { UpcomingFreeDatesStrip } from "@/components/public/upcoming-free-dates";
import {
  eventCardCopy,
  eventTypes,
  galleryItems,
  homeCopy,
  venueFeatures,
} from "@/lib/content";
import { db } from "@/lib/db";
import { getUpcomingFreeDates } from "@/server/reservations";

export const metadata: Metadata = homeCopy.metadata;

export default async function Home() {
  const [galleryImages, upcomingFreeDates] = await Promise.all([
    db.galleryImage.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      take: 3,
    }),
    getUpcomingFreeDates(),
  ]);
  const cloudName =
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
    process.env.CLOUDINARY_CLOUD_NAME ||
    "";
  const hasGalleryImages = galleryImages.length > 0 && Boolean(cloudName);

  return (
    <>
      {/* hero */}
      <section className="marble-wash">
        <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-x-16 gap-y-12 px-6 py-14 sm:gap-y-16 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:py-28">
          <div className="hero-sequence mx-auto max-w-xl text-center lg:mx-0 lg:text-left">
            <p className="overline mx-auto mb-6 max-w-xs text-[0.68rem] tracking-[0.2em] sm:max-w-none sm:text-xs sm:tracking-[var(--tracking-overline)] lg:mx-0">
              {homeCopy.hero.overline}
            </p>
            <MeanderRule
              units={5}
              className="mx-auto mb-6 opacity-80 sm:mb-9 lg:mx-0"
            />
            <h1 className="mx-auto text-balance text-4xl leading-[1.04] text-ink sm:text-6xl lg:mx-0 lg:text-7xl">
              {homeCopy.hero.titleLead}
              <span className="text-aegean"> {homeCopy.hero.titleAccent}</span>.
            </h1>
            <p className="mx-auto mt-6 max-w-md text-pretty text-lg leading-relaxed text-ink-soft sm:mt-8 lg:mx-0">
              {homeCopy.hero.description}
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:mt-12 sm:flex-row lg:items-start lg:justify-start">
              <Link href="/reserve" className="btn btn-primary">
                {homeCopy.hero.primaryCta}
              </Link>
              <Link href="/gallery" className="btn btn-quiet link-arrow">
                {homeCopy.hero.secondaryCta}
              </Link>
            </div>
          </div>

          <div className="flex justify-center lg:justify-end">
            <HeroArch ariaLabel={homeCopy.hero.venueAriaLabel} />
          </div>
        </div>
      </section>

      <UpcomingFreeDatesStrip dates={upcomingFreeDates} />

      {/* venue intro */}
      <Reveal as="section" className="mx-auto w-full max-w-6xl px-6 py-24">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:items-center">
          <SectionHeading
            marker="Α΄"
            overline={homeCopy.venueIntro.overline}
            title={homeCopy.venueIntro.title}
            description={homeCopy.venueIntro.description}
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
      </Reveal>

      {/* day timeline */}
      <Reveal as="section" className="day-timeline py-24" stagger>
        <div className="mx-auto w-full max-w-6xl px-6">
          <SectionHeading
            marker="Β΄"
            overline={homeCopy.day.overline}
            title={homeCopy.day.title}
            description={homeCopy.day.description}
            className="max-w-xl"
          />
          <ol className="relative mt-16 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
            <span className="timeline-line absolute left-0 right-0 top-[1.15rem] hidden h-px bg-gradient-to-r from-gold/35 via-gold to-ivory/60 lg:block" />
            <DayTimelineGnomon />
            {homeCopy.day.timeline.map((item, index) => (
              <li
                key={item.time}
                className="timeline-item relative"
                style={
                  {
                    "--timeline-delay": `${index * 260 + 220}ms`,
                  } as CSSProperties
                }
              >
                <span className="timeline-dot relative z-10 block size-3 rounded-full bg-gold" />
                <p
                  className={`mt-7 font-serif text-3xl leading-none italic text-gold-soft ${
                    // The two evening items sit on the dark teal end of the lg
                    // gradient; plain gold-soft fails contrast there, so lift the
                    // numeral to an ivory-mixed gold at lg only (light sides keep
                    // gold-soft). See globals.css .day-timeline.
                    index >= 2 ? "lg:text-[#efe4c4]" : ""
                  }`}
                >
                  {item.time}
                </p>
                <h3 className={`mt-4 text-2xl ${item.tone}`}>{item.title}</h3>
                <p className={`mt-3 text-sm leading-relaxed ${item.muted}`}>
                  {item.detail}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </Reveal>

      {/* occasions */}
      <Reveal as="section" className="bg-marble/40 py-24" stagger>
        <div className="mx-auto w-full max-w-6xl px-6">
          <SectionHeading
            marker="Γ΄"
            overline={homeCopy.occasions.overline}
            title={homeCopy.occasions.title}
            description={homeCopy.occasions.description}
            align="center"
          />
          <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {eventTypes.map((e) => (
              <EventCard
                key={e.slug}
                title={e.title}
                description={e.description}
                tone={e.tone}
                href={`/reserve?occasion=${e.slug}`}
                cta={eventCardCopy.cta}
              />
            ))}
          </div>
        </div>
      </Reveal>

      {/* testimonials */}
      <Reveal as="section" className="px-6 py-24">
        <EpigraphTestimonials />
      </Reveal>

      {/* gallery preview */}
      <Reveal
        as="section"
        className="mx-auto w-full max-w-6xl px-6 py-24"
        stagger
      >
        <div className="flex flex-col items-end justify-between gap-6 sm:flex-row">
          <SectionHeading
            marker="Δ΄"
            overline={homeCopy.galleryPreview.overline}
            title={homeCopy.galleryPreview.title}
            className="max-w-md"
          />
          <Link
            href="/gallery"
            className="link-arrow text-sm tracking-wide text-aegean transition-colors hover:text-aegean-deep"
          >
            {homeCopy.galleryPreview.link}
          </Link>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {hasGalleryImages
            ? galleryImages.map((image, index) => (
                <CloudinaryGalleryTile
                  key={image.id}
                  publicId={image.publicId}
                  alt={image.alt}
                  caption={image.caption}
                  cloudName={cloudName}
                  className="aspect-[4/5]"
                  priority={index === 0}
                />
              ))
            : galleryItems
                .slice(0, 3)
                .map((item) => (
                  <GalleryTile
                    key={item.caption}
                    caption={item.caption}
                    tone={item.tone}
                    className="aspect-[4/5]"
                  />
                ))}
        </div>
      </Reveal>

      {/* cta */}
      <section className="textured-dark dusk-stars bg-aegean-deep">
        <div className="mx-auto w-full max-w-4xl px-6 py-24 text-center">
          <MeanderRule units={5} className="mx-auto mb-8 text-gold-soft" />
          <h2 className="text-balance text-4xl text-ivory sm:text-5xl">
            {homeCopy.cta.title}
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-pretty leading-relaxed text-ivory/70">
            {homeCopy.cta.description}
          </p>
          <Link href="/reserve" className="btn btn-gold mt-10">
            {homeCopy.cta.link}
          </Link>
        </div>
      </section>
    </>
  );
}
