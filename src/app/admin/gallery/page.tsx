import { GalleryManager } from "@/components/admin/gallery/gallery-manager";
import { getCloudinaryUploadFolder } from "@/lib/cloudinary";
import { db } from "@/lib/db";

export default async function AdminGalleryPage() {
  const images = await db.galleryImage.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });
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
          <span className="ml-2">{images.length === 1 ? "image" : "images"}</span>
        </div>
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
