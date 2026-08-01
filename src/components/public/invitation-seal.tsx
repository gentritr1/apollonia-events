import { cn } from "@/lib/utils";

/**
 * An engraved, stroke-only seal ("vula") pressed onto a received invitation.
 * A sibling of temple-line.tsx in the same engraving family: thin strokes,
 * currentColor, no fills. The centre Α is drawn as three strokes, not typeset.
 */

const CENTER = 44;
const TICK_INNER = 33;
const TICK_OUTER = 40;
const TICK_COUNT = 12;

const ticks = Array.from({ length: TICK_COUNT }, (_, index) => {
  const angle = (index / TICK_COUNT) * Math.PI * 2 - Math.PI / 2;
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return {
    x1: (CENTER + TICK_INNER * cos).toFixed(2),
    y1: (CENTER + TICK_INNER * sin).toFixed(2),
    x2: (CENTER + TICK_OUTER * cos).toFixed(2),
    y2: (CENTER + TICK_OUTER * sin).toFixed(2),
  };
});

export function InvitationSeal({ className }: { className?: string }) {
  return (
    <svg
      role="presentation"
      aria-hidden="true"
      viewBox="0 0 88 88"
      className={cn("invitation-seal text-gold-soft", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.35}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Outer ring + inner ring form the engraved band. */}
      <circle cx={CENTER} cy={CENTER} r={TICK_OUTER} />
      <circle cx={CENTER} cy={CENTER} r={TICK_INNER} />

      {/* Sparse radial ticks around the band. */}
      {ticks.map((tick, index) => (
        <line key={index} x1={tick.x1} y1={tick.y1} x2={tick.x2} y2={tick.y2} />
      ))}

      {/* Greek Α — two legs + crossbar, drawn not typeset. */}
      <path d="M44 30 L36 56" />
      <path d="M44 30 L52 56" />
      <path d="M39.4 45 H48.6" />

      {/* Two tiny 4-point accents flanking the Α. */}
      <path d="M28 40.5 L31.5 44 L28 47.5 L24.5 44 Z" />
      <path d="M60 40.5 L63.5 44 L60 47.5 L56.5 44 Z" />
    </svg>
  );
}
