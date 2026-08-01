"use client";

import { type CSSProperties, useEffect, useId, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

import { CloudinaryFillImage } from "@/components/cloudinary/cloudinary-image";
import { CloudinaryGalleryTile } from "@/components/public/cloudinary-gallery-tile";
import { GalleryTile } from "@/components/public/gallery-tile";
import { TempleLine } from "@/components/public/temple-line";
import { galleryCopy, type Tone } from "@/lib/content";
import { cn } from "@/lib/utils";

export type GalleryLightboxItem =
  | {
      kind: "cloudinary";
      id: string;
      publicId: string;
      alt: string;
      caption?: string | null;
      layout?: string | null;
    }
  | {
      kind: "placeholder";
      id: string;
      caption: string;
      tone: Tone;
    };

/**
 * Shape presets, chosen per photo in the admin rather than derived from
 * position. Each preset owns its grid span, its tile aspect and its lightbox
 * frame, so a photo keeps the same shape no matter what is inserted above it.
 *
 * Lightbox frames carry explicit widths — `w-full` inside the shrink-to-fit
 * flex column collapses to 0 — and are bounded by dvh so the caption stays on
 * screen.
 */
const layoutPresets = {
  WIDE: {
    tileClassName: "sm:col-span-6 lg:col-span-8 aspect-[16/9]",
    lightboxClassName: "aspect-[16/9] w-[min(64rem,calc(100vw-3.5rem),92dvh)]",
    sizes: "(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 66vw",
  },
  TALL: {
    tileClassName: "sm:col-span-3 lg:col-span-4 aspect-[3/4]",
    lightboxClassName: "aspect-[3/4] w-[min(44dvh,calc(100vw-3.5rem))]",
    sizes: "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
  },
  STANDARD: {
    tileClassName: "sm:col-span-3 lg:col-span-4 aspect-[4/3]",
    lightboxClassName: "aspect-[4/3] w-[min(58dvh,calc(100vw-3.5rem))]",
    sizes: "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
  },
} as const;

export type GalleryLayoutKey = keyof typeof layoutPresets;

function presetFor(layout?: string | null) {
  return (
    layoutPresets[(layout as GalleryLayoutKey) ?? "STANDARD"] ??
    layoutPresets.STANDARD
  );
}

const galleryTransitionName = "gallery-active-image";

type ViewTransitionDocument = Document & {
  startViewTransition?: (callback: () => void) => { finished: Promise<void> };
};

function itemTitle(item: GalleryLightboxItem, index: number) {
  if (item.kind === "placeholder") {
    return item.caption;
  }

  return item.caption || item.alt || galleryCopy.lightbox.fallbackTitle(index);
}

function selectedState(items: GalleryLightboxItem[], index: number) {
  const item = items[index];

  if (!item) {
    return null;
  }

  return { index, imageReady: item.kind !== "cloudinary" };
}

export function GalleryLightbox({
  items,
  cloudName,
}: {
  items: GalleryLightboxItem[];
  cloudName?: string;
}) {
  const [selected, setSelected] = useState<{
    index: number;
    imageReady: boolean;
  } | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const selectedIndex = selected?.index ?? null;
  const selectedItem =
    selectedIndex === null ? null : (items[selectedIndex] ?? null);
  const selectedLayout = presetFor(
    selectedItem && selectedItem.kind === "cloudinary"
      ? selectedItem.layout
      : null,
  );

  function showPrevious() {
    setSelected((current) => {
      if (!current || items.length === 0) {
        return current;
      }

      return selectedState(
        items,
        (current.index - 1 + items.length) % items.length,
      );
    });
  }

  function showNext() {
    setSelected((current) => {
      if (!current || items.length === 0) {
        return current;
      }

      return selectedState(items, (current.index + 1) % items.length);
    });
  }

  function openItem(index: number, tile: HTMLElement) {
    const nextSelected = selectedState(items, index);
    const transitionDocument = document as ViewTransitionDocument;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (!transitionDocument.startViewTransition || prefersReducedMotion) {
      setSelected(nextSelected);
      return;
    }

    tile.style.setProperty("view-transition-name", galleryTransitionName);

    try {
      const transition = transitionDocument.startViewTransition(() => {
        setSelected(nextSelected);
      });

      void transition.finished.finally(() => {
        tile.style.removeProperty("view-transition-name");
      });
    } catch {
      tile.style.removeProperty("view-transition-name");
      setSelected(nextSelected);
    }
  }

  useEffect(() => {
    if (selectedIndex === null) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setSelected(null);
        return;
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        setSelected((current) => {
          if (!current || items.length === 0) {
            return current;
          }

          return selectedState(
            items,
            (current.index - 1 + items.length) % items.length,
          );
        });
        return;
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        setSelected((current) => {
          if (!current || items.length === 0) {
            return current;
          }

          return selectedState(items, (current.index + 1) % items.length);
        });
      }
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [items, selectedIndex]);

  if (items.length === 0) {
    return null;
  }

  return (
    <>
      <ul className="grid grid-cols-1 gap-5 sm:grid-cols-6 lg:grid-cols-12">
        {items.map((item, index) => {
          const layout = presetFor(
            item.kind === "cloudinary" ? item.layout : null,
          );
          const title = itemTitle(item, index);

          return (
            <li key={item.id} className={layout.tileClassName}>
              <button
                type="button"
                className="group block h-full w-full rounded-lg text-left outline-none ring-offset-4 ring-offset-ivory transition-[box-shadow] focus-visible:ring-2 focus-visible:ring-gold/60"
                onClick={(event) => openItem(index, event.currentTarget)}
                aria-label={galleryCopy.lightbox.openLabel(title)}
              >
                {item.kind === "cloudinary" ? (
                  <CloudinaryGalleryTile
                    publicId={item.publicId}
                    alt={item.alt}
                    caption={item.caption}
                    cloudName={cloudName}
                    className="h-full w-full"
                    sizes={layout.sizes}
                    variant="curated"
                    as="span"
                    // Only one image should emit a preload link; a second
                    // preload that the browser does not use inside a few
                    // seconds is what produced the "preloaded but not used"
                    // console warning. The wide 16:9 second tile still must
                    // not lazy-load -- it is the largest thing above the fold
                    // and gets picked as LCP -- so it loads eagerly instead.
                    priority={index === 0}
                    loading={index === 1 ? "eager" : undefined}
                  />
                ) : (
                  <GalleryTile
                    caption={item.caption}
                    tone={item.tone}
                    className="h-full w-full"
                    variant="curated"
                    as="span"
                  />
                )}
              </button>
            </li>
          );
        })}
      </ul>

      {selectedItem ? (
        <div
          className="fixed inset-0 z-50 overflow-y-auto bg-ivory/95 text-ink backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelected(null);
            }
          }}
        >
          <button
            ref={closeButtonRef}
            type="button"
            className="fixed right-4 top-4 z-10 inline-flex size-11 items-center justify-center rounded-full border border-gold/30 bg-[#fbf9f3] text-aegean-deep shadow-sm transition-colors hover:border-gold/60 hover:bg-marble focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60"
            onClick={() => setSelected(null)}
            aria-label={galleryCopy.lightbox.close}
          >
            <X className="size-5" aria-hidden="true" />
          </button>

          {items.length > 1 ? (
            <>
              <button
                type="button"
                className="fixed left-4 top-1/2 z-10 hidden size-11 -translate-y-1/2 items-center justify-center rounded-full border border-gold/30 bg-[#fbf9f3] text-aegean-deep shadow-sm transition-colors hover:border-gold/60 hover:bg-marble focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60 sm:inline-flex"
                onClick={showPrevious}
                aria-label={galleryCopy.lightbox.previous}
              >
                <ChevronLeft className="size-5" aria-hidden="true" />
              </button>
              <button
                type="button"
                className="fixed right-4 top-1/2 z-10 hidden size-11 -translate-y-1/2 items-center justify-center rounded-full border border-gold/30 bg-[#fbf9f3] text-aegean-deep shadow-sm transition-colors hover:border-gold/60 hover:bg-marble focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60 sm:inline-flex"
                onClick={showNext}
                aria-label={galleryCopy.lightbox.next}
              >
                <ChevronRight className="size-5" aria-hidden="true" />
              </button>
            </>
          ) : null}

          <figure className="mx-auto flex min-h-dvh w-full max-w-6xl flex-col items-center justify-center px-5 py-16 sm:px-16">
            <div className="relative rounded-lg border border-gold/45 bg-[#fbf9f3] p-2 shadow-sm">
              <div
                style={
                  {
                    viewTransitionName: galleryTransitionName,
                  } as CSSProperties
                }
                className={cn(
                  "relative overflow-hidden rounded-[0.35rem] bg-marble",
                  selectedLayout.lightboxClassName,
                )}
              >
                {selectedItem.kind === "cloudinary" ? (
                  <>
                    {!selected?.imageReady ? (
                      <div className="absolute inset-0 z-10 grid place-items-center bg-ivory">
                        <TempleLine
                          animate="draw"
                          loop
                          className="h-12 w-24 text-gold"
                        />
                      </div>
                    ) : null}
                    <CloudinaryFillImage
                      src={selectedItem.publicId}
                      alt={selectedItem.alt}
                      cloudName={cloudName}
                      sizes="(max-width: 1024px) 92vw, 1100px"
                      className={cn(
                        "object-cover",
                        !selected?.imageReady && "opacity-0",
                      )}
                      onLoad={() => {
                        setSelected((current) =>
                          current && current.index === selectedIndex
                            ? { ...current, imageReady: true }
                            : current,
                        );
                      }}
                    />
                  </>
                ) : (
                  <GalleryTile
                    caption={selectedItem.caption}
                    tone={selectedItem.tone}
                    className="h-full w-full rounded-[0.35rem]"
                    variant="curated"
                    as="span"
                    showCaption={false}
                    enableHover={false}
                  />
                )}
              </div>
            </div>

            <figcaption className="mt-5 max-w-2xl text-center">
              <p
                id={titleId}
                className="font-serif text-2xl text-ink sm:text-3xl"
              >
                {itemTitle(selectedItem, selectedIndex ?? 0)}
              </p>
              <p className="mt-2 text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-gold">
                {galleryCopy.lightbox.count(
                  selectedIndex === null ? 1 : selectedIndex + 1,
                  items.length,
                )}
              </p>
            </figcaption>

            {items.length > 1 ? (
              <div className="mt-5 flex items-center justify-center gap-3 sm:hidden">
                <button
                  type="button"
                  className="inline-flex size-11 items-center justify-center rounded-full border border-gold/30 bg-[#fbf9f3] text-aegean-deep shadow-sm transition-colors hover:border-gold/60 hover:bg-marble focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60"
                  onClick={showPrevious}
                  aria-label={galleryCopy.lightbox.previous}
                >
                  <ChevronLeft className="size-5" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  className="inline-flex size-11 items-center justify-center rounded-full border border-gold/30 bg-[#fbf9f3] text-aegean-deep shadow-sm transition-colors hover:border-gold/60 hover:bg-marble focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60"
                  onClick={showNext}
                  aria-label={galleryCopy.lightbox.next}
                >
                  <ChevronRight className="size-5" aria-hidden="true" />
                </button>
              </div>
            ) : null}
          </figure>
        </div>
      ) : null}
    </>
  );
}
