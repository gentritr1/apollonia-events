import { type CSSProperties } from "react";

import { cn } from "@/lib/utils";
import { getCloudinaryBlurUrl } from "@/lib/cloudinary-blur";
import { CloudinaryFillImage } from "@/components/cloudinary/cloudinary-image";

type CloudinaryGalleryTileVariant = "default" | "curated";
type CloudinaryGalleryTileElement = "figure" | "span";

export function CloudinaryGalleryTile({
  publicId,
  alt,
  caption,
  cloudName,
  className,
  priority = false,
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
  variant = "default",
  as = "figure",
  showCaption = true,
}: {
  publicId: string;
  alt: string;
  caption?: string | null;
  cloudName?: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
  variant?: CloudinaryGalleryTileVariant;
  as?: CloudinaryGalleryTileElement;
  showCaption?: boolean;
}) {
  const blurUrl = getCloudinaryBlurUrl({ publicId, cloudName });
  const blurStyle: CSSProperties | undefined = blurUrl
    ? {
        backgroundImage: `url("${blurUrl}")`,
        backgroundPosition: "center",
        backgroundSize: "cover",
      }
    : undefined;

  if (variant === "curated") {
    const content = (
      <>
        <CloudinaryFillImage
          src={publicId}
          alt={alt}
          cloudName={cloudName}
          sizes={sizes}
          priority={priority}
          className="object-cover motion-safe:transition-transform motion-safe:duration-[800ms] motion-safe:ease-out group-hover:scale-[1.03] group-focus-visible:scale-[1.03]"
        />
        <span
          className="absolute inset-0 bg-[radial-gradient(120%_80%_at_20%_0%,rgba(255,255,255,0.18),transparent_58%)]"
          aria-hidden="true"
        />
        <span
          className="absolute inset-2 rounded-[0.35rem] border border-gold/20"
          aria-hidden="true"
        />
        {caption && showCaption ? (
          <>
            <span
              className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-aegean-deep/75 via-aegean-deep/25 to-transparent opacity-0 motion-safe:transition-opacity motion-safe:duration-500 group-hover:opacity-100 group-focus-visible:opacity-100"
              aria-hidden="true"
            />
            {as === "figure" ? (
              <figcaption className="absolute inset-x-0 bottom-0 translate-y-2 p-4 pt-12 opacity-0 motion-safe:transition motion-safe:duration-500 motion-safe:ease-out group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
                <span className="font-sans text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-ivory">
                  {caption}
                </span>
              </figcaption>
            ) : (
              <span className="absolute inset-x-0 bottom-0 block translate-y-2 p-4 pt-12 opacity-0 motion-safe:transition motion-safe:duration-500 motion-safe:ease-out group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
                <span className="font-sans text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-ivory">
                  {caption}
                </span>
              </span>
            )}
          </>
        ) : null}
      </>
    );
    const rootClassName = cn(
      "group relative block overflow-hidden rounded-lg bg-marble shadow-sm ring-1 ring-gold/20",
      className
    );

    return as === "figure" ? (
      <figure className={rootClassName} style={blurStyle}>
        {content}
      </figure>
    ) : (
      <span className={rootClassName} style={blurStyle}>
        {content}
      </span>
    );
  }

  return (
    <figure
      className={cn(
        "group relative overflow-hidden rounded-2xl bg-marble shadow-sm ring-1 ring-gold/15",
        className
      )}
      style={blurStyle}
    >
      <CloudinaryFillImage
        src={publicId}
        alt={alt}
        cloudName={cloudName}
        sizes={sizes}
        priority={priority}
        className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
      />
      <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_20%_0%,rgba(255,255,255,0.2),transparent_55%)]" />
      <div className="absolute inset-3 rounded-xl border border-ivory/25" />
      {caption ? (
        <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-aegean-deep/65 to-transparent p-5 pt-10">
          <span className="font-serif text-lg text-ivory">{caption}</span>
        </figcaption>
      ) : null}
    </figure>
  );
}
