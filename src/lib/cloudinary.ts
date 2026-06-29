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
