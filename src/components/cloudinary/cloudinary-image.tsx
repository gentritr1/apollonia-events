"use client";

import { type ReactEventHandler } from "react";
import { CldImage } from "next-cloudinary";

const APOLLONIA_IMAGE_GRADE = {
  saturation: "-14",
  tint: "8:2c5c6b",
} as const;

export function CloudinaryFillImage({
  src,
  alt,
  sizes,
  className,
  cloudName,
  priority = false,
  onLoad,
}: {
  src: string;
  alt: string;
  sizes: string;
  className?: string;
  cloudName?: string;
  priority?: boolean;
  onLoad?: ReactEventHandler<HTMLImageElement>;
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
      {...APOLLONIA_IMAGE_GRADE}
      config={cloudName ? { cloud: { cloudName } } : undefined}
      priority={priority}
      className={className}
      onLoad={onLoad}
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
      {...APOLLONIA_IMAGE_GRADE}
      config={cloudName ? { cloud: { cloudName } } : undefined}
      className={className}
    />
  );
}
