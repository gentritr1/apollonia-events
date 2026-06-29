"use client";

import { CldImage } from "next-cloudinary";

export function CloudinaryFillImage({
  src,
  alt,
  sizes,
  className,
  cloudName,
  priority = false,
}: {
  src: string;
  alt: string;
  sizes: string;
  className?: string;
  cloudName?: string;
  priority?: boolean;
}) {
  return (
    <CldImage
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      crop="fill"
      gravity="auto"
      format="auto"
      quality="auto"
      config={cloudName ? { cloud: { cloudName } } : undefined}
      priority={priority}
      className={className}
    />
  );
}

export function CloudinaryFixedImage({
  src,
  alt,
  width,
  height,
  sizes,
  className,
  cloudName,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  sizes?: string;
  className?: string;
  cloudName?: string;
}) {
  return (
    <CldImage
      src={src}
      alt={alt}
      width={width}
      height={height}
      sizes={sizes}
      crop="fill"
      gravity="auto"
      format="auto"
      quality="auto"
      config={cloudName ? { cloud: { cloudName } } : undefined}
      className={className}
    />
  );
}
