import type { Metadata } from "next";
import Link from "next/link";

import { MeanderRule } from "@/components/public/meander-rule";
import {
  GalleryLightbox,
  type GalleryLightboxItem,
} from "@/components/public/gallery-lightbox";
import { galleryCopy, galleryItems } from "@/lib/content";
import { getPublicGalleryImages } from "@/server/gallery-read";

export const metadata: Metadata = galleryCopy.metadata;

export default async function GalleryPage() {
  const images = await getPublicGalleryImages();
  const cloudName =
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
    process.env.CLOUDINARY_CLOUD_NAME ||
    "";
  const hasImages = images.length > 0 && Boolean(cloudName);
  const wallItems: GalleryLightboxItem[] = hasImages
    ? images.map((image) => ({
        kind: "cloudinary",
        id: image.id,
        publicId: image.publicId,
        alt: image.alt,
        caption: image.caption,
        layout: image.layout,
      }))
    : galleryItems.map((item) => ({
        kind: "placeholder",
        id: item.caption,
        caption: item.caption,
        tone: item.tone,
      }));

  return (
    <>
      <section className="marble-wash">
        <div className="mx-auto w-full max-w-3xl px-6 py-24 text-center">
          <p className="overline mb-5">{galleryCopy.header.overline}</p>
          <MeanderRule units={5} className="mx-auto mb-8 opacity-80" />
          <h1 className="text-balance text-5xl text-ink sm:text-6xl">
            {galleryCopy.header.title}
          </h1>
          <p className="mx-auto mt-7 max-w-xl text-pretty text-lg leading-relaxed text-ink-soft">
            {galleryCopy.header.description}
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-6 py-24">
        <div className="mb-10 flex flex-col justify-between gap-5 border-y border-gold/20 py-5 sm:flex-row sm:items-center">
          <p className="max-w-2xl text-pretty leading-relaxed text-ink-soft">
            {galleryCopy.wall.description}
          </p>
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-gold">
            {wallItems.length} {galleryCopy.wall.countLabel}
          </p>
        </div>
        <GalleryLightbox items={wallItems} cloudName={cloudName} />

        <div className="mt-20 text-center">
          <p className="mx-auto max-w-md text-pretty leading-relaxed text-ink-soft">
            {hasImages
              ? galleryCopy.wall.withImages
              : galleryCopy.wall.withoutImages}
          </p>
          <Link href="/reserve" className="btn btn-primary mt-8">
            {galleryCopy.wall.cta}
          </Link>
        </div>
      </section>
    </>
  );
}
