import {
  createApolloniaOgImage,
  OG_CONTENT_TYPE,
  OG_IMAGE_SIZE,
} from "@/lib/og-image";

export const alt = "Eventet — Apollonia Events";
export const size = OG_IMAGE_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return createApolloniaOgImage("Eventet");
}
