"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronDown,
  ChevronUp,
  GripVertical,
  Home,
  Loader2,
  Landmark,
} from "lucide-react";
import type { GalleryImage } from "@prisma/client";

import {
  reorderGalleryImages,
  setGalleryFeature,
  updateGalleryImage,
} from "@/server/gallery";
import { CloudinaryGalleryTile } from "@/components/public/cloudinary-gallery-tile";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Layout = "STANDARD" | "WIDE" | "TALL";

/**
 * Shapes are offered as intent, not geometry. A free canvas has no correct
 * answer at 375px — whatever is arranged on a desktop has to reflow — so the
 * admin says how important a photo is and the grid stays responsive.
 *
 * These class names mirror layoutPresets in gallery-lightbox.tsx; the preview
 * renders the real tile component so what is shown is what ships.
 */
const SHAPES: {
  id: Layout;
  label: string;
  hint: string;
  tile: string;
}[] = [
  {
    id: "WIDE",
    label: "E gjerë",
    hint: "16:9",
    tile: "sm:col-span-6 lg:col-span-8 aspect-[16/9]",
  },
  {
    id: "TALL",
    label: "E lartë",
    hint: "3:4",
    tile: "sm:col-span-3 lg:col-span-4 aspect-[3/4]",
  },
  {
    id: "STANDARD",
    label: "Normale",
    hint: "4:3",
    tile: "sm:col-span-3 lg:col-span-4 aspect-[4/3]",
  },
];

const tileClassFor = (layout: Layout) =>
  SHAPES.find((s) => s.id === layout)?.tile ?? SHAPES[2]!.tile;

export function GalleryArranger({
  images,
  cloudName,
}: {
  images: GalleryImage[];
  cloudName: string;
}) {
  const router = useRouter();
  const [order, setOrder] = useState(images);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dirty, setDirty] = useState(false);
  const [pending, startTransition] = useTransition();

  // Server data wins whenever it changes underneath us (an upload, a delete,
  // another tab) — but never while there are unsaved local moves to lose.
  //
  // Adjusted during render rather than in an effect: syncing props into state
  // from useEffect renders once with stale rows and again with fresh ones, and
  // the React Compiler rejects it. Compared by signature, not array identity,
  // so an unrelated parent re-render cannot silently discard a drag.
  const serverSignature = images
    .map((image) => `${image.id}:${image.layout}:${image.sortOrder}`)
    .join("|");
  const [syncedSignature, setSyncedSignature] = useState(serverSignature);

  if (!dirty && serverSignature !== syncedSignature) {
    setSyncedSignature(serverSignature);
    setOrder(images);
  }

  function move(from: number, to: number) {
    if (to < 0 || to >= order.length || from === to) {
      return;
    }

    setOrder((current) => {
      const next = [...current];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved!);
      return next;
    });
    setDirty(true);
  }

  function setLayout(id: string, layout: Layout) {
    setOrder((current) =>
      current.map((image) => (image.id === id ? { ...image, layout } : image)),
    );

    // Shape saves immediately: it is a single independent field, so there is
    // nothing to batch and nothing to lose if the page is closed.
    startTransition(async () => {
      await updateGalleryImage(id, { layout });
      router.refresh();
    });
  }

  function pickFeature(id: string, placement: "home" | "venue") {
    setOrder((current) =>
      current.map((image) => ({
        ...image,
        featuredHome:
          placement === "home" ? image.id === id : image.featuredHome,
        featuredVenue:
          placement === "venue" ? image.id === id : image.featuredVenue,
      })),
    );

    startTransition(async () => {
      await setGalleryFeature(id, placement);
      router.refresh();
    });
  }

  function saveOrder() {
    startTransition(async () => {
      await reorderGalleryImages(order.map((image) => image.id));
      setDirty(false);
      router.refresh();
    });
  }

  if (order.length === 0) {
    return null;
  }

  return (
    <section className="rounded-lg border border-marble-deep bg-[#fbf9f3]">
      <div className="flex flex-col gap-3 border-b border-marble-deep px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-serif text-2xl text-ink">Rendi dhe forma</h2>
          <p className="mt-1 text-sm text-ink-soft">
            Tërhiqni për të ndryshuar rendin. Shënoni cila foto shfaqet te
            Ballina dhe te Vendi.
          </p>
        </div>
        {dirty ? (
          <Button onClick={saveOrder} disabled={pending}>
            {pending ? <Loader2 className="mr-2 size-4 animate-spin" /> : null}
            Ruaj rendin
          </Button>
        ) : (
          <span className="text-sm text-ink-soft">Të gjitha të ruajtura</span>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 p-5 lg:grid-cols-2">
        <ol className="flex flex-col gap-2">
          {order.map((image, index) => (
            <li
              key={image.id}
              draggable
              onDragStart={() => setDragIndex(index)}
              onDragOver={(event) => event.preventDefault()}
              onDrop={() => {
                if (dragIndex !== null) {
                  move(dragIndex, index);
                }
                setDragIndex(null);
              }}
              onDragEnd={() => setDragIndex(null)}
              className={cn(
                "flex items-center gap-3 rounded-lg border border-marble-deep bg-ivory px-3 py-2",
                dragIndex === index && "opacity-50",
              )}
            >
              <GripVertical
                className="size-4 shrink-0 cursor-grab text-ink-soft"
                aria-hidden="true"
              />
              <span className="w-5 shrink-0 text-xs text-ink-soft">
                {index + 1}
              </span>
              <span className="min-w-0 flex-1 truncate text-sm text-ink">
                {image.alt}
              </span>

              {/* Which screens this photo appears on. Position used to decide
                  this silently, so moving a photo changed the homepage without
                  saying so. */}
              <div className="flex shrink-0 gap-1">
                {(
                  [
                    { key: "home", label: "Ballina", Icon: Home },
                    { key: "venue", label: "Vendi", Icon: Landmark },
                  ] as const
                ).map(({ key, label, Icon }) => {
                  const on =
                    key === "home" ? image.featuredHome : image.featuredVenue;

                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => pickFeature(image.id, key)}
                      aria-pressed={on}
                      title={
                        on
                          ? `Kjo foto shfaqet te ${label}`
                          : `Bëje këtë foton e ${label}`
                      }
                      className={cn(
                        "inline-flex items-center gap-1 rounded-md border px-2 py-1 text-[0.7rem] transition-colors",
                        on
                          ? "border-gold bg-gold/15 text-gold-deep"
                          : "border-marble-deep text-ink-soft hover:border-gold",
                      )}
                    >
                      <Icon className="size-3" aria-hidden="true" />
                      {label}
                    </button>
                  );
                })}
              </div>

              <div className="flex shrink-0 gap-1">
                {SHAPES.map((shape) => (
                  <button
                    key={shape.id}
                    type="button"
                    onClick={() => setLayout(image.id, shape.id)}
                    aria-pressed={image.layout === shape.id}
                    title={`${shape.label} — ${shape.hint}`}
                    className={cn(
                      "rounded-md border px-2 py-1 text-[0.7rem] transition-colors",
                      image.layout === shape.id
                        ? "border-aegean bg-aegean text-ivory"
                        : "border-marble-deep text-ink-soft hover:border-gold",
                    )}
                  >
                    {shape.label}
                  </button>
                ))}
              </div>

              {/* Keyboard and touch route: native drag has neither. */}
              <div className="flex shrink-0 flex-col">
                <button
                  type="button"
                  onClick={() => move(index, index - 1)}
                  disabled={index === 0}
                  aria-label={`Zhvendos lart: ${image.alt}`}
                  className="text-ink-soft disabled:opacity-30"
                >
                  <ChevronUp className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={() => move(index, index + 1)}
                  disabled={index === order.length - 1}
                  aria-label={`Zhvendos poshtë: ${image.alt}`}
                  className="text-ink-soft disabled:opacity-30"
                >
                  <ChevronDown className="size-4" />
                </button>
              </div>
            </li>
          ))}
        </ol>

        <div>
          <p className="mb-3 text-sm text-ink-soft">
            Kështu do të duket faqja publike
          </p>
          <div className="grid grid-cols-1 gap-3 rounded-lg bg-marble/40 p-3 sm:grid-cols-6 lg:grid-cols-12">
            {order.map((image) => (
              <div
                key={image.id}
                className={tileClassFor(image.layout as Layout)}
              >
                <CloudinaryGalleryTile
                  publicId={image.publicId}
                  alt={image.alt}
                  cloudName={cloudName}
                  className="h-full w-full"
                  sizes="(max-width: 1024px) 45vw, 22vw"
                  variant="curated"
                  as="span"
                  showCaption={false}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
