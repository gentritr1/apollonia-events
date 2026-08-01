import { GalleryManager } from "@/components/admin/gallery/gallery-manager";
import { GalleryArranger } from "@/components/admin/gallery/gallery-arranger";
import {
  getCloudinaryUploadFolder,
  getCloudinaryUsage,
} from "@/lib/cloudinary";
import { db } from "@/lib/db";

export default async function AdminGalleryPage() {
  const [images, usage] = await Promise.all([
    db.galleryImage.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    }),
    getCloudinaryUsage(),
  ]);
  const cloudName =
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
    process.env.CLOUDINARY_CLOUD_NAME ||
    "";
  const apiKey = process.env.CLOUDINARY_API_KEY || "";

  return (
    <div className="mx-auto w-full max-w-7xl">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-medium text-gold">Admin</p>
          <h1 className="mt-2 font-serif text-4xl text-ink">Gallery</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-ink-soft">
            Upload, caption, order, and remove Cloudinary images shown on the
            public gallery.
          </p>
        </div>

        <div className="rounded-lg border border-marble-deep bg-ivory px-4 py-3 text-sm text-ink-soft">
          <span className="font-medium text-ink">{images.length}</span>
          <span className="ml-2">
            {images.length === 1 ? "image" : "images"}
          </span>
        </div>
      </div>

      {usage ? (
        <dl className="mt-8 grid grid-cols-2 gap-3 rounded-lg border border-marble-deep bg-[#fbf9f3] p-4 sm:grid-cols-4">
          {[
            {
              label: "Kredite",
              value: `${usage.creditsUsed.toFixed(2)} / ${usage.creditsLimit}`,
              hint: `${usage.percentUsed.toFixed(1)}% e përdorur`,
            },
            {
              label: "Hapësira",
              value: `${(usage.storageBytes / 1048576).toFixed(1)} MB`,
              hint: `${usage.assets} skedarë`,
            },
            {
              label: "Trafiku",
              value: `${(usage.bandwidthBytes / 1048576).toFixed(1)} MB`,
              hint: "këtë muaj",
            },
            {
              label: "Transformime",
              value: usage.transformations.toLocaleString("sq-AL"),
              hint: "këtë muaj",
            },
          ].map((stat) => (
            <div key={stat.label}>
              <dt className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-gold-text">
                {stat.label}
              </dt>
              <dd className="mt-1 font-serif text-2xl text-ink">
                {stat.value}
              </dd>
              <dd className="text-xs text-ink-soft">{stat.hint}</dd>
            </div>
          ))}
        </dl>
      ) : null}

      <div className="mt-8">
        <GalleryArranger images={images} cloudName={cloudName} />
      </div>

      <div className="mt-8">
        <GalleryManager
          images={images}
          cloudName={cloudName}
          apiKey={apiKey}
          uploadFolder={getCloudinaryUploadFolder()}
        />
      </div>
    </div>
  );
}
