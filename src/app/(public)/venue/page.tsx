import type { Metadata } from "next";
import Link from "next/link";

import { MeanderRule } from "@/components/public/meander-rule";
import { SectionHeading } from "@/components/public/section-heading";
import { GalleryTile } from "@/components/public/gallery-tile";
import { CloudinaryGalleryTile } from "@/components/public/cloudinary-gallery-tile";
import { Reveal } from "@/components/public/reveal";
import { venueCopy, venueFeatures } from "@/lib/content";
import { getPublicGalleryImages } from "@/server/gallery-read";

export const metadata: Metadata = venueCopy.metadata;

function AdriaticCoastline() {
  return (
    <svg
      className="adriatic-coastline h-auto w-full max-w-md text-gold"
      viewBox="0 0 360 260"
      role="img"
      aria-label="Vija bregdetare nga Vlora drejt Fierit, me Apoloninë të shënuar"
    >
      <path
        className="coastline-stroke"
        pathLength={1}
        d="M92 230C78 212 70 196 75 180C80 163 96 154 99 139C103 121 88 109 94 92C100 74 122 72 132 55C141 39 132 26 145 16"
      />
      <path
        className="coastline-stroke coastline-detail"
        pathLength={1}
        d="M136 58C158 66 179 82 196 104C215 128 228 154 244 174"
      />
      <path
        className="coastline-stroke coastline-detail"
        pathLength={1}
        d="M112 128C137 133 160 145 181 164"
      />
      <g className="coastline-dot">
        <circle cx="211" cy="142" r="4.5" />
        <path d="M196 142H204M218 142H226M211 127V135M211 149V157" />
      </g>
    </svg>
  );
}

function HeritageBand({
  image,
  cloudName,
}: {
  image?: { publicId: string; alt: string } | null;
  cloudName: string;
}) {
  return (
    <Reveal
      as="section"
      className="heritage-band border-y border-gold/15 bg-marble/25"
    >
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-12 px-6 py-20 lg:grid-cols-[0.82fr_1fr] lg:items-center lg:py-24">
        <div>
          <p className="overline mb-5">{venueCopy.heritage.title}</p>
          {image && cloudName ? (
            <CloudinaryGalleryTile
              publicId={image.publicId}
              alt={image.alt}
              cloudName={cloudName}
              className="aspect-[4/5] w-full max-w-md"
              sizes="(max-width: 1024px) 90vw, 34vw"
              variant="curated"
            />
          ) : (
            <AdriaticCoastline />
          )}
        </div>
        <div className="heritage-beats grid gap-8 sm:grid-cols-3 lg:grid-cols-1">
          {venueCopy.heritage.beats.map((beat) => (
            <div key={beat.overline} className="heritage-beat">
              <p className="overline mb-3 text-[0.66rem] tracking-[0.18em]">
                {beat.overline}
              </p>
              <p className="max-w-xl font-serif text-2xl leading-snug text-ink sm:text-3xl">
                {beat.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </Reveal>
  );
}

export default async function VenuePage() {
  // One photo per space plus one for the heritage band. Falls back to the
  // painted placeholders when the gallery is empty or Cloudinary is
  // unconfigured, so the page never renders holes.
  const images = await getPublicGalleryImages(venueCopy.spaces.length + 1);
  const cloudName =
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
    process.env.CLOUDINARY_CLOUD_NAME ||
    "";
  const heritageImage = cloudName ? images[0] : null;
  const spaceImages = cloudName ? images.slice(1) : [];

  return (
    <>
      {/* page header */}
      <section className="marble-wash">
        <div className="hero-sequence mx-auto w-full max-w-3xl px-6 py-24 text-center">
          <p className="overline mb-5">{venueCopy.header.overline}</p>
          <MeanderRule units={5} className="mx-auto mb-8 opacity-80" />
          <h1 className="text-balance text-5xl text-ink sm:text-6xl">
            {venueCopy.header.title}
          </h1>
          <p className="mx-auto mt-7 max-w-xl text-pretty text-lg leading-relaxed text-ink-soft">
            {venueCopy.header.description}
          </p>
        </div>
      </section>

      <HeritageBand image={heritageImage} cloudName={cloudName} />

      {/* spaces */}
      <Reveal as="section" className="mx-auto w-full max-w-6xl px-6 py-24">
        <SectionHeading
          marker="Α΄"
          overline={venueCopy.spacesHeading.overline}
          title={venueCopy.spacesHeading.title}
          description={venueCopy.spacesHeading.description}
        />
        <div className="mt-16 space-y-20">
          {venueCopy.spaces.map((space, i) => (
            <div
              key={space.name}
              className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16"
            >
              {spaceImages[i] ? (
                <CloudinaryGalleryTile
                  publicId={spaceImages[i]!.publicId}
                  alt={spaceImages[i]!.alt}
                  cloudName={cloudName}
                  className={`aspect-[4/3] ${i % 2 === 1 ? "lg:order-2" : ""}`}
                  sizes="(max-width: 1024px) 92vw, 46vw"
                  variant="curated"
                />
              ) : (
                <GalleryTile
                  tone={space.tone}
                  className={`aspect-[4/3] ${i % 2 === 1 ? "lg:order-2" : ""}`}
                />
              )}
              <div className={i % 2 === 1 ? "lg:order-1" : ""}>
                <h3 className="text-3xl text-ink">{space.name}</h3>
                <p className="mt-4 max-w-md text-pretty text-lg leading-relaxed text-ink-soft">
                  {space.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Reveal>

      {/* details */}
      <Reveal as="section" className="bg-marble/40 py-24" stagger>
        <div className="mx-auto w-full max-w-6xl px-6">
          <SectionHeading
            marker="Β΄"
            overline={venueCopy.detailsHeading.overline}
            title={venueCopy.detailsHeading.title}
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
            <Link href="/reserve" className="btn btn-primary">
              {venueCopy.cta}
            </Link>
          </div>
        </div>
      </Reveal>
    </>
  );
}
