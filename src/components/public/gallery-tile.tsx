import type { Tone } from "@/lib/content";
import { cn } from "@/lib/utils";

// Full static class strings per tone so Tailwind keeps them at build time.
const toneGradient: Record<Tone, string> = {
  aegean: "from-marble via-aegean-bright/40 to-aegean-deep",
  olive: "from-marble via-olive/45 to-[#3f4326]",
  gold: "from-marble via-gold-soft/55 to-gold",
  marble: "from-[#fbf9f3] via-marble to-marble-deep",
};

/**
 * A placeholder venue image: a soft tonal gradient with a fine gold frame and
 * an optional caption. Drop a real <Image> behind the overlays later.
 */
export function GalleryTile({
  caption,
  tone = "marble",
  className,
}: {
  caption?: string;
  tone?: Tone;
  className?: string;
}) {
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
