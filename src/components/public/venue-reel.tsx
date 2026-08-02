"use client";

import { useEffect, useRef, useState } from "react";

import { MeanderRule } from "@/components/public/meander-rule";
import { cn } from "@/lib/utils";

/**
 * Fixed brand assets, not admin-managed content — see apollonia/reel in
 * Cloudinary. The version prefixes are deliberate: Cloudinary's CDN kept
 * serving a stale copy for minutes after re-upload even with invalidation, so
 * a re-encode would silently not reach anyone. Versioned URLs are immutable,
 * so a new encode means a new URL and the change is immediate.
 */
const REEL_MP4 = "v1785670725/apollonia/reel/venue-reel.mp4";
const REEL_WEBM = "v1785670728/apollonia/reel/venue-reel-vp9.webm";
const POSTER_PUBLIC_ID = "apollonia/gallery/u3dt0xmhzhfxck1xgael";

/**
 * A five-second drift across the hall, sitting between the written page and the
 * gallery grid.
 *
 * Deliberately frugal: the sources are only attached once the band scrolls into
 * view, so a visitor who never reaches it downloads nothing but the poster, and
 * the whole clip is 214KB served from Cloudinary rather than Vercel bandwidth.
 * `prefers-reduced-motion` keeps the poster and never loads the video at all —
 * a looping push-in is exactly the kind of motion that setting exists to stop.
 */
export function VenueReel({
  cloudName,
  className,
}: {
  cloudName?: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) {
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setActive(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  if (!cloudName) {
    return null;
  }

  const poster = `https://res.cloudinary.com/${cloudName}/image/upload/f_auto,q_auto,w_1280/${POSTER_PUBLIC_ID}`;
  const video = (ext: "webm" | "mp4") =>
    `https://res.cloudinary.com/${cloudName}/video/upload/${
      ext === "webm" ? REEL_WEBM : REEL_MP4
    }`;

  return (
    <div
      ref={ref}
      className={cn(
        "relative isolate w-full overflow-hidden border-y border-gold/20 bg-ink",
        className,
      )}
    >
      <div className="relative aspect-[16/10] w-full sm:aspect-[2/1] lg:aspect-[21/9]">
        <video
          key={active ? "playing" : "poster"}
          poster={poster}
          muted
          loop
          playsInline
          autoPlay={active}
          preload="none"
          aria-hidden="true"
          tabIndex={-1}
          className="absolute inset-0 size-full object-cover"
        >
          {active ? (
            <>
              <source src={video("webm")} type="video/webm" />
              <source src={video("mp4")} type="video/mp4" />
            </>
          ) : null}
        </video>

        {/* Only the meander sits on the footage, so the scrim is bottom-weighted:
            a full overlay just milks an already-bright room. */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-ink/50" />
        <MeanderRule
          units={7}
          className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 text-gold-soft/90"
        />
      </div>
    </div>
  );
}
