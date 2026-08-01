/**
 * Builds the tiny blurred placeholder URL shown behind a gallery image while it
 * loads.
 *
 * This is a pure string builder and deliberately lives outside both
 * `cloudinary-image.tsx` (which is `"use client"`) and `lib/cloudinary.ts`
 * (which pulls in the server-only Cloudinary SDK). Server components render
 * gallery tiles directly — the home page does — so calling this from a client
 * module throws "Attempted to call getCloudinaryBlurUrl() from the server".
 */
export function getCloudinaryBlurUrl({
  publicId,
  cloudName,
}: {
  publicId: string;
  cloudName?: string;
}) {
  if (!cloudName) {
    return null;
  }

  const encodedPublicId = publicId.split("/").map(encodeURIComponent).join("/");

  return `https://res.cloudinary.com/${cloudName}/image/upload/e_blur:2000,q_1,w_32/${encodedPublicId}`;
}
