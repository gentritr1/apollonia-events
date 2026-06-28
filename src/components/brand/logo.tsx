import { cn } from "@/lib/utils";

/**
 * The Apollonia wordmark: "apolloniaevents" set in the serif face, with the
 * "i" rendered as a slender fluted temple column. One column, used as a single
 * letterform — an earned accent, never decoration.
 */
export function Logo({
  className,
  columnClassName,
}: {
  className?: string;
  columnClassName?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex select-none items-baseline font-serif lowercase leading-none tracking-tight text-ink",
        className
      )}
    >
      apollon
      <ColumnGlyph className={cn("text-aegean", columnClassName)} />
      a<span className="text-ink-soft">events</span>
    </span>
  );
}

/** The fluted column that stands in for the letter "i". Scales with font size. */
function ColumnGlyph({ className }: { className?: string }) {
  return (
    <svg
      role="presentation"
      aria-hidden="true"
      viewBox="0 0 16 34"
      // ~0.82em tall, sat on the text baseline via the translate below
      className={cn(
        "mx-[0.03em] inline-block h-[0.9em] w-auto translate-y-[0.08em] self-baseline",
        className
      )}
      fill="currentColor"
    >
      {/* capital — abacus slab + echinus flare */}
      <rect x="1.5" y="2" width="13" height="2.4" rx="0.4" />
      <path d="M3 4.4 H13 L12 6.6 H4 Z" />
      {/* shaft with a subtle entasis (outward taper toward the base) */}
      <path d="M4.4 6.6 H11.6 L12.2 27 H3.8 Z" />
      {/* fluting */}
      <g stroke="var(--color-ivory)" strokeWidth="0.7" opacity="0.5">
        <line x1="6.4" y1="7.6" x2="6.2" y2="26" />
        <line x1="8" y1="7.6" x2="8" y2="26" />
        <line x1="9.6" y1="7.6" x2="9.8" y2="26" />
      </g>
      {/* base — torus + plinth */}
      <path d="M3.2 27 H12.8 L13 29 H3 Z" />
      <rect x="1.5" y="29" width="13" height="3" rx="0.4" />
    </svg>
  );
}
