"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import {
  getCloudinaryUploadFolder,
  getConfiguredCloudinary,
} from "@/lib/cloudinary";

const addGalleryImageSchema = z.object({
  publicId: z.string().trim().min(1),
  url: z.string().trim().url(),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  alt: z.string().trim().min(1).optional(),
});

const updateGalleryImageSchema = z.object({
  alt: z.string().trim().min(1).optional(),
  caption: z.string().trim().nullable().optional(),
  sortOrder: z.number().int().min(0).optional(),
  layout: z.enum(["STANDARD", "WIDE", "TALL"]).optional(),
});

type AddGalleryImageInput = z.infer<typeof addGalleryImageSchema>;
type UpdateGalleryImageInput = z.infer<typeof updateGalleryImageSchema>;

async function requireAdmin() {
  const session = await auth();

  if (session?.user?.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }
}

function revalidateGalleryPaths() {
  revalidatePath("/admin/gallery");
  revalidatePath("/gallery");
  revalidatePath("/");
}

function assertGalleryPublicId(publicId: string) {
  const folder = getCloudinaryUploadFolder();

  if (!publicId.startsWith(`${folder}/`)) {
    throw new Error("Uploaded image is outside the configured gallery folder.");
  }
}

function getDefaultAlt(publicId: string) {
  const filename = publicId.split("/").at(-1) || "gallery image";
  return filename.replace(/[-_]+/g, " ").replace(/\s+/g, " ").trim();
}

export async function addGalleryImage(input: AddGalleryImageInput) {
  await requireAdmin();

  const parsed = addGalleryImageSchema.parse(input);
  assertGalleryPublicId(parsed.publicId);

  const resource = await getConfiguredCloudinary().api.resource(
    parsed.publicId,
    {
      resource_type: "image",
    },
  );

  const maxSortOrder = await db.galleryImage.aggregate({
    _max: { sortOrder: true },
  });

  await db.galleryImage.upsert({
    where: { publicId: parsed.publicId },
    update: {
      url: resource.secure_url || parsed.url,
      width: Number(resource.width) || parsed.width,
      height: Number(resource.height) || parsed.height,
      alt: parsed.alt || getDefaultAlt(parsed.publicId),
    },
    create: {
      publicId: parsed.publicId,
      url: resource.secure_url || parsed.url,
      width: Number(resource.width) || parsed.width,
      height: Number(resource.height) || parsed.height,
      alt: parsed.alt || getDefaultAlt(parsed.publicId),
      sortOrder: (maxSortOrder._max.sortOrder ?? -1) + 1,
    },
  });

  revalidateGalleryPaths();
}

/**
 * Saves a whole upload batch in one pass.
 *
 * Not a loop over addGalleryImage: that reads max(sortOrder) and adds one, so
 * ten concurrent uploads all read the same max and land on the same position.
 * Here the order is assigned once, from a single read, and written in one
 * transaction — and the gallery is revalidated once rather than ten times.
 *
 * Cloudinary metadata is fetched before the transaction opens: those are
 * network calls, and holding a database transaction across them would keep it
 * open for as long as the slowest lookup.
 */
export async function addGalleryImages(inputs: AddGalleryImageInput[]) {
  await requireAdmin();

  const parsed = z.array(addGalleryImageSchema).min(1).max(30).parse(inputs);
  parsed.forEach((input) => assertGalleryPublicId(input.publicId));

  const cloudinary = getConfiguredCloudinary();
  const resolved = await Promise.all(
    parsed.map(async (input) => {
      const resource = await cloudinary.api
        .resource(input.publicId, { resource_type: "image" })
        .catch(() => null);

      return {
        publicId: input.publicId,
        url: resource?.secure_url || input.url,
        width: Number(resource?.width) || input.width,
        height: Number(resource?.height) || input.height,
        alt: input.alt || getDefaultAlt(input.publicId),
      };
    }),
  );

  const maxSortOrder = await db.galleryImage.aggregate({
    _max: { sortOrder: true },
  });
  let nextSortOrder = (maxSortOrder._max.sortOrder ?? -1) + 1;

  await db.$transaction(
    resolved.map((image) =>
      db.galleryImage.upsert({
        where: { publicId: image.publicId },
        update: {
          url: image.url,
          width: image.width,
          height: image.height,
          alt: image.alt,
        },
        create: { ...image, sortOrder: nextSortOrder++ },
      }),
    ),
  );

  revalidateGalleryPaths();
}

export async function updateGalleryImage(
  id: string,
  input: UpdateGalleryImageInput,
) {
  await requireAdmin();

  const parsed = updateGalleryImageSchema.parse(input);

  await db.galleryImage.update({
    where: { id },
    data: {
      ...("alt" in parsed ? { alt: parsed.alt } : {}),
      ...("caption" in parsed ? { caption: parsed.caption || null } : {}),
      ...("sortOrder" in parsed ? { sortOrder: parsed.sortOrder } : {}),
    },
  });

  revalidateGalleryPaths();
}

/**
 * Persists a whole drag-and-drop reorder in one transaction.
 *
 * Rewrites every position rather than patching the moved row: sortOrder values
 * drift into duplicates and gaps once rows are inserted and deleted, and a
 * partial rewrite leaves the gallery in an order nobody chose. All or nothing.
 */
export async function reorderGalleryImages(ids: string[]) {
  await requireAdmin();

  const parsed = z.array(z.string().min(1)).min(1).parse(ids);

  await db.$transaction(
    parsed.map((id, index) =>
      db.galleryImage.update({ where: { id }, data: { sortOrder: index } }),
    ),
  );

  revalidateGalleryPaths();
}

export async function deleteGalleryImage(id: string) {
  await requireAdmin();

  const image = await db.galleryImage.findUnique({ where: { id } });

  if (!image) {
    throw new Error("Gallery image not found.");
  }

  const result = await getConfiguredCloudinary().uploader.destroy(
    image.publicId,
    {
      resource_type: "image",
    },
  );

  if (result.result !== "ok" && result.result !== "not found") {
    throw new Error(`Cloudinary delete failed: ${result.result || "unknown"}`);
  }

  await db.galleryImage.delete({ where: { id } });

  revalidateGalleryPaths();
}
