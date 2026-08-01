import { v2 as cloudinary } from "cloudinary";

export const DEFAULT_GALLERY_FOLDER = "apollonia/gallery";

export function getCloudinaryUploadFolder() {
  return process.env.CLOUDINARY_UPLOAD_FOLDER || DEFAULT_GALLERY_FOLDER;
}

export function getCloudinaryConfig() {
  const cloudName =
    process.env.CLOUDINARY_CLOUD_NAME ||
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error("Cloudinary server credentials are not configured.");
  }

  return { cloudName, apiKey, apiSecret };
}

export function getConfiguredCloudinary() {
  const { cloudName, apiKey, apiSecret } = getCloudinaryConfig();

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });

  return cloudinary;
}

export type CloudinaryUsage = {
  creditsUsed: number;
  creditsLimit: number;
  percentUsed: number;
  storageBytes: number;
  bandwidthBytes: number;
  transformations: number;
  assets: number;
};

/**
 * Plan usage, so the admin can see how much room is left before uploading a
 * batch rather than discovering the ceiling mid-upload.
 *
 * Returns null on failure instead of throwing: this is a nice-to-have panel on
 * a page whose real job is managing photos, and Cloudinary being briefly
 * unreachable must not take that page down.
 */
export async function getCloudinaryUsage(): Promise<CloudinaryUsage | null> {
  try {
    const usage = await getConfiguredCloudinary().api.usage();

    return {
      creditsUsed: Number(usage.credits?.usage ?? 0),
      creditsLimit: Number(usage.credits?.limit ?? 0),
      percentUsed: Number(usage.credits?.used_percent ?? 0),
      storageBytes: Number(usage.storage?.usage ?? 0),
      bandwidthBytes: Number(usage.bandwidth?.usage ?? 0),
      transformations: Number(usage.transformations?.usage ?? 0),
      assets: Number(usage.resources ?? 0),
    };
  } catch (error) {
    console.error("Failed to fetch Cloudinary usage:", error);
    return null;
  }
}
