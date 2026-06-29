import type { Metadata } from "next";
import Link from "next/link";

import { MeanderRule } from "@/components/public/meander-rule";
import { GalleryTile } from "@/components/public/gallery-tile";
import { CloudinaryGalleryTile } from "@/components/public/cloudinary-gallery-tile";
import { galleryItems } from "@/lib/content";
import { db } from "@/lib/db";

export const metadata: Metadata = {
  title: "Gallery — Apollonia Events",
  description:
    "A glimpse of Apollonia — marble halls, the olive terrace, and golden-hour gatherings.",
};

// A gentle, varied mosaic. Larger tiles break the grid's rhythm.
const spans = [
  "sm:col-span-2 aspect-[16/10]",
  "aspect-[4/5]",
  "aspect-[4/5]",
  "aspect-[4/5]",
  "aspect-[4/5]",
  "sm:col-span-2 aspect-[16/10]",
];

export default async function GalleryPage() {
  const images = await db.galleryImage.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });
  const cloudName =
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
    process.env.CLOUDINARY_CLOUD_NAME ||
    "";
  const hasImages = images.length > 0 && Boolean(cloudName);

  return (
    <>
      <section className="marble-wash">
        <div className="mx-auto w-full max-w-3xl px-6 py-24 text-center">
          <p className="overline mb-5">Gallery</p>
          <MeanderRule units={5} className="mx-auto mb-8 opacity-80" />
          <h1 className="text-balance text-5xl text-ink sm:text-6xl">
            A glimpse of the setting
          </h1>
          <p className="mx-auto mt-7 max-w-xl text-pretty text-lg leading-relaxed text-ink-soft">
            A few moments from the venue and the occasions it has held. The full
            story is best seen in person.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 py-20">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {hasImages
            ? images.map((image, i) => (
                <CloudinaryGalleryTile
                  key={image.id}
                  publicId={image.publicId}
                  alt={image.alt}
                  caption={image.caption}
                  cloudName={cloudName}
                  className={spans[i % spans.length]}
                  priority={i === 0}
                />
              ))
            : galleryItems.map((item, i) => (
                <GalleryTile
                  key={item.caption}
                  caption={item.caption}
                  tone={item.tone}
                  className={spans[i % spans.length]}
                />
              ))}
        </div>

        <div className="mt-20 text-center">
          <p className="mx-auto max-w-md text-pretty leading-relaxed text-ink-soft">
            {hasImages
              ? "A rotating look at Apollonia's rooms, terrace, and gatherings."
              : "Photography is a placeholder for now — real imagery will live here."}
          </p>
          <Link
            href="/reserve"
            className="mt-8 inline-block rounded-full bg-aegean px-8 py-3.5 text-sm font-medium tracking-wide text-ivory transition-colors hover:bg-aegean-deep"
          >
            Arrange a visit
          </Link>
        </div>
      </section>
    </>
  );
}
