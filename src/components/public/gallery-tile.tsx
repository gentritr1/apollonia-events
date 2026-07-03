import type { Tone } from "@/lib/content";
import { cn } from "@/lib/utils";

// Full static class strings per tone so Tailwind keeps them at build time.
const toneGradient: Record<Tone, string> = {
  aegean: "from-marble via-aegean-bright/40 to-aegean-deep",
  olive: "from-marble via-olive/45 to-[#3f4326]",
  gold: "from-marble via-gold-soft/55 to-gold",
  marble: "from-[#fbf9f3] via-marble to-marble-deep",
};

type GalleryTileVariant = "default" | "curated";
type GalleryTileElement = "figure" | "span";

/**
 * A placeholder venue image: a soft tonal gradient with a fine gold frame and
 * an optional caption. Drop a real <Image> behind the overlays later.
 */
export function GalleryTile({
  caption,
  tone = "marble",
  className,
  variant = "default",
  as = "figure",
  showCaption = true,
  enableHover = true,
}: {
  caption?: string;
  tone?: Tone;
  className?: string;
  variant?: GalleryTileVariant;
  as?: GalleryTileElement;
  showCaption?: boolean;
  enableHover?: boolean;
}) {
  if (variant === "curated") {
    const content = (
      <>
        <span
          className={cn(
            "absolute inset-0 bg-gradient-to-br",
            toneGradient[tone],
            enableHover &&
              "motion-safe:transition-transform motion-safe:duration-[800ms] motion-safe:ease-out group-hover:scale-[1.03] group-focus-visible:scale-[1.03]"
          )}
          aria-hidden="true"
        />
        <span
          className="absolute inset-0 bg-[radial-gradient(120%_80%_at_20%_0%,rgba(255,255,255,0.45),transparent_58%)]"
          aria-hidden="true"
        />
        <span
          className="absolute inset-0 opacity-[0.2] mix-blend-multiply [background-image:radial-gradient(circle_at_1px_1px,rgba(168,133,78,0.38)_1px,transparent_0)] [background-size:18px_18px]"
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
      <figure className={rootClassName}>{content}</figure>
    ) : (
      <span className={rootClassName}>{content}</span>
    );
  }

  return (
    <figure
      className={cn(
        "group relative overflow-hidden rounded-2xl bg-gradient-to-br shadow-sm ring-1 ring-gold/15",
        toneGradient[tone],
        className
      )}
    >
      {/* marble sheen */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_20%_0%,rgba(255,255,255,0.5),transparent_55%)]" />
      {/* fine inset frame */}
      <div className="absolute inset-3 rounded-xl border border-ivory/20" />
      {caption && (
        <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-aegean-deep/55 to-transparent p-5 pt-10">
          <span className="font-serif text-lg text-ivory">{caption}</span>
        </figcaption>
      )}
    </figure>
  );
}
