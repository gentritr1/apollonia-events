import { cn } from "@/lib/utils";
import { CloudinaryFillImage } from "@/components/cloudinary/cloudinary-image";

export function CloudinaryGalleryTile({
  publicId,
  alt,
  caption,
  cloudName,
  className,
  priority = false,
}: {
  publicId: string;
  alt: string;
  caption?: string | null;
  cloudName?: string;
  className?: string;
  priority?: boolean;
}) {
  return (
    <figure
      className={cn(
        "group relative overflow-hidden rounded-2xl bg-marble shadow-sm ring-1 ring-gold/15",
        className
      )}
    >
      <CloudinaryFillImage
        src={publicId}
        alt={alt}
        cloudName={cloudName}
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
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
