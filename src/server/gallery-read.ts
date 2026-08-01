import { db } from "@/lib/db";

/**
 * Reads gallery images for the public pages.
 *
 * Deliberately swallows database errors: Neon's free tier scales to zero, so a
 * cold start or a brief outage would otherwise take down the whole home page
 * through the error boundary — the pages already degrade to their placeholder
 * tiles when this returns empty. The failure is logged loudly rather than
 * silently, because "the gallery is empty" and "the database is unreachable"
 * look identical from the outside.
 */
export async function getPublicGalleryImages(take?: number) {
  try {
    return await db.galleryImage.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      ...(take ? { take } : {}),
    });
  } catch (error) {
    console.error("Failed to fetch gallery images:", error);
    return [];
  }
}
