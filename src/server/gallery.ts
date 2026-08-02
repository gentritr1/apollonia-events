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
  // /venue shows the featured venue photo, so it goes stale too.
  revalidatePath("/venue");
}

function assertGalleryPublicId(publicId: string) {
  const folder = getCloudinaryUploadFolder();

  if (!publicId.startsWith(`${folder}/`)) {
    throw new Error("Uploaded image is outside the configured gallery folder.");
  }
}

/**
 * Shape given to a newly uploaded photo, by position.
 *
 * Every photo defaulting to STANDARD turned the wall into uniform rows of
 * three — a grid, not a mosaic. This cycle is chosen so each row still fills
 * all twelve columns: TALL(4)+WIDE(8), then STANDARD(4)x3. The admin can
 * override any of it in the arranger; this only decides how a fresh batch
 * lands.
 */
const LAYOUT_CYCLE = [
  "TALL",
  "WIDE",
  "STANDARD",
  "STANDARD",
  "STANDARD",
] as const;

const layoutForPosition = (sortOrder: number) =>
  LAYOUT_CYCLE[sortOrder % LAYOUT_CYCLE.length]!;

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
      layout: layoutForPosition((maxSortOrder._max.sortOrder ?? -1) + 1),
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
        create: {
          ...image,
          layout: layoutForPosition(nextSortOrder),
          sortOrder: nextSortOrder++,
        },
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

/**
 * Marks one photo as the homepage hero or the venue feature.
 *
 * Clears the flag from every other row in the same transaction, so the "exactly
 * one" rule cannot drift — a second featured photo would otherwise silently win
 * or lose depending on sort order.
 */
export async function setGalleryFeature(
  id: string,
  placement: "home" | "venue",
) {
  await requireAdmin();

  const field = placement === "home" ? "featuredHome" : "featuredVenue";

  await db.$transaction([
    db.galleryImage.updateMany({
      where: { [field]: true },
      data: { [field]: false },
    }),
    db.galleryImage.update({ where: { id }, data: { [field]: true } }),
  ]);

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
