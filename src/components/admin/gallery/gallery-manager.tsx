"use client";

import { useState, useTransition } from "react";
import { CldUploadWidget } from "next-cloudinary";
import { ImagePlus, Loader2, Save, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import type { GalleryImage } from "@prisma/client";

import {
  addGalleryImage,
  deleteGalleryImage,
  updateGalleryImage,
} from "@/server/gallery";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CloudinaryFillImage } from "@/components/cloudinary/cloudinary-image";

type UploadedInfo = {
  public_id?: unknown;
  secure_url?: unknown;
  width?: unknown;
  height?: unknown;
  original_filename?: unknown;
};

function getUploadInfo(info: unknown) {
  if (!info || typeof info !== "object") {
    return null;
  }

  const uploadInfo = info as UploadedInfo;

  if (
    typeof uploadInfo.public_id !== "string" ||
    typeof uploadInfo.secure_url !== "string" ||
    typeof uploadInfo.width !== "number" ||
    typeof uploadInfo.height !== "number"
  ) {
    return null;
  }

  return {
    publicId: uploadInfo.public_id,
    url: uploadInfo.secure_url,
    width: uploadInfo.width,
    height: uploadInfo.height,
    alt:
      typeof uploadInfo.original_filename === "string"
        ? uploadInfo.original_filename.replace(/[-_]+/g, " ")
        : "Apollonia gallery image",
  };
}

function getUploadErrorMessage(uploadError: unknown) {
  if (typeof uploadError === "string") {
    return uploadError;
  }

  if (
    uploadError &&
    typeof uploadError === "object" &&
    "statusText" in uploadError &&
    typeof uploadError.statusText === "string"
  ) {
    return uploadError.statusText;
  }

  return "Cloudinary upload failed.";
}

export function GalleryManager({
  images,
  cloudName,
  apiKey,
  uploadFolder,
}: {
  images: GalleryImage[];
  cloudName: string;
  apiKey: string;
  uploadFolder: string;
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const canUpload = Boolean(cloudName && apiKey);

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-marble-deep bg-[#fbf9f3] p-4 sm:p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-serif text-2xl text-ink">Upload images</h2>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-ink-soft">
              Upload directly to Cloudinary, then save the image metadata to the
              gallery.
            </p>
          </div>

          {canUpload ? (
            <CldUploadWidget
              signatureEndpoint="/api/admin/cloudinary-sign"
              config={{ cloud: { cloudName, apiKey } }}
              options={{
                folder: uploadFolder,
                multiple: false,
                maxFiles: 1,
                resourceType: "image",
                sources: ["local", "url"],
                clientAllowedFormats: ["jpg", "jpeg", "png", "webp", "avif"],
              }}
              onSuccess={(result) => {
                const uploadInfo = getUploadInfo(result.info);

                if (!uploadInfo) {
                  setError("Cloudinary returned an unexpected upload result.");
                  return;
                }

                setError(null);
                startTransition(async () => {
                  try {
                    await addGalleryImage(uploadInfo);
                    router.refresh();
                  } catch (err) {
                    setError(
                      err instanceof Error
                        ? err.message
                        : "Could not save the uploaded image."
                    );
                  }
                });
              }}
              onError={(uploadError) => {
                setError(getUploadErrorMessage(uploadError));
              }}
            >
              {({ open, isLoading }) => (
                <Button
                  type="button"
                  onClick={() => open()}
                  disabled={isPending || isLoading}
                  className="w-full sm:w-auto"
                >
                  {isPending || isLoading ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <ImagePlus className="size-4" />
                  )}
                  Upload image
                </Button>
              )}
            </CldUploadWidget>
          ) : (
            <p className="rounded-lg border border-marble-deep bg-marble/50 px-3 py-2 text-sm text-ink-soft">
              Add Cloudinary cloud name and API key to enable uploads.
            </p>
          )}
        </div>

        {error ? <p className="mt-4 text-sm text-destructive">{error}</p> : null}
      </section>

      <section className="rounded-lg border border-marble-deep bg-[#fbf9f3]">
        {images.length > 0 ? (
          <div className="divide-y divide-marble-deep">
            {images.map((image) => (
              <GalleryImageRow
                key={image.id}
                image={image}
                cloudName={cloudName}
              />
            ))}
          </div>
        ) : (
          <div className="px-5 py-14 text-center">
            <h2 className="font-serif text-2xl text-ink">No gallery images yet</h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-ink-soft">
              Upload the first venue image to replace the public placeholder
              mosaic.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}

function GalleryImageRow({
  image,
  cloudName,
}: {
  image: GalleryImage;
  cloudName: string;
}) {
  const router = useRouter();
  const [alt, setAlt] = useState(image.alt);
  const [caption, setCaption] = useState(image.caption ?? "");
  const [sortOrder, setSortOrder] = useState(String(image.sortOrder));
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function save() {
    setError(null);
    startTransition(async () => {
      try {
        await updateGalleryImage(image.id, {
          alt,
          caption: caption.trim() || null,
          sortOrder: Number(sortOrder),
        });
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Could not save changes.");
      }
    });
  }

  function remove() {
    setError(null);
    startTransition(async () => {
      try {
        await deleteGalleryImage(image.id);
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Could not delete image.");
      }
    });
  }

  return (
    <article className="grid gap-4 p-4 md:grid-cols-[180px_1fr] md:items-start">
      <figure className="relative aspect-[4/3] overflow-hidden rounded-lg bg-marble ring-1 ring-marble-deep">
        <CloudinaryFillImage
          src={image.publicId}
          alt={image.alt}
          cloudName={cloudName}
          sizes="180px"
          className="object-cover"
        />
      </figure>

      <div className="grid gap-4 lg:grid-cols-[1fr_120px_auto] lg:items-end">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor={`${image.id}-alt`} className="text-ink-soft">
              Alt text
            </Label>
            <Input
              id={`${image.id}-alt`}
              value={alt}
              onChange={(event) => setAlt(event.target.value)}
              disabled={isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`${image.id}-caption`} className="text-ink-soft">
              Caption
            </Label>
            <Textarea
              id={`${image.id}-caption`}
              value={caption}
              onChange={(event) => setCaption(event.target.value)}
              disabled={isPending}
              className="min-h-10"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor={`${image.id}-sort`} className="text-ink-soft">
            Order
          </Label>
          <Input
            id={`${image.id}-sort`}
            type="number"
            min={0}
            value={sortOrder}
            onChange={(event) => setSortOrder(event.target.value)}
            disabled={isPending}
          />
        </div>

        <div className="flex gap-2 lg:justify-end">
          <Button type="button" onClick={save} disabled={isPending}>
            {isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Save className="size-4" />
            )}
            Save
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={remove}
            disabled={isPending}
            aria-label={`Delete ${image.alt}`}
          >
            <Trash2 className="size-4" />
          </Button>
        </div>

        {error ? (
          <p className="text-sm text-destructive lg:col-span-3">{error}</p>
        ) : null}
      </div>
    </article>
  );
}
