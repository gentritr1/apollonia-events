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

  const resource = await getConfiguredCloudinary().api.resource(parsed.publicId, {
    resource_type: "image",
  });

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

export async function updateGalleryImage(
  id: string,
  input: UpdateGalleryImageInput
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

export async function deleteGalleryImage(id: string) {
  await requireAdmin();

  const image = await db.galleryImage.findUnique({ where: { id } });

  if (!image) {
    throw new Error("Gallery image not found.");
  }

  const result = await getConfiguredCloudinary().uploader.destroy(image.publicId, {
    resource_type: "image",
  });

  if (result.result !== "ok" && result.result !== "not found") {
    throw new Error(`Cloudinary delete failed: ${result.result || "unknown"}`);
  }

  await db.galleryImage.delete({ where: { id } });

  revalidateGalleryPaths();
}
