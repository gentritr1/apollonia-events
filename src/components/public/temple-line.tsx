import { type CSSProperties } from "react";

import { cn } from "@/lib/utils";

type TempleLineVariant = "whole" | "ruin";
type TempleLineAnimation = "draw";

type Stroke = {
  d: string;
};

const wholeStrokes: Stroke[] = [
  { d: "M10 54 H110" },
  { d: "M18 48 H102" },
  { d: "M24 43 H96" },
  { d: "M28 43 V22" },
  { d: "M24 22 H32" },
  { d: "M42 43 V22" },
  { d: "M38 22 H46" },
  { d: "M58 43 V22" },
  { d: "M54 22 H62" },
  { d: "M74 43 V22" },
  { d: "M70 22 H78" },
  { d: "M90 43 V22" },
  { d: "M86 22 H94" },
  { d: "M20 18 H100" },
  { d: "M18 18 L60 4" },
  { d: "M60 4 L102 18" },
];

const ruinStrokes: Stroke[] = [
  { d: "M10 54 H110" },
  { d: "M18 48 H102" },
  { d: "M24 43 H66" },
  { d: "M28 43 V22" },
  { d: "M24 22 H32" },
  { d: "M42 43 V22" },
  { d: "M38 22 H46" },
  { d: "M58 43 V22" },
  { d: "M54 22 H62" },
  { d: "M20 18 H64" },
  { d: "M18 18 L60 4" },
  { d: "M72 52 H88" },
  { d: "M88 56 H106" },
];

export function TempleLine({
  variant = "whole",
  animate,
  loop = false,
  className,
}: {
  variant?: TempleLineVariant;
  animate?: TempleLineAnimation;
  loop?: boolean;
  className?: string;
}) {
  const strokes = variant === "ruin" ? ruinStrokes : wholeStrokes;

  return (
    <svg
      role="presentation"
      aria-hidden="true"
      viewBox="0 0 120 60"
      className={cn(
        "temple-line text-gold",
        animate === "draw" && (loop ? "temple-line-loop" : "temple-line-draw"),
        className
      )}
      fill="none"
    >
      {strokes.map((stroke, index) => (
        <path
          key={`${variant}-${index}`}
          className="temple-stroke"
          d={stroke.d}
          pathLength={1}
          stroke="currentColor"
          strokeWidth={1.2}
          strokeLinecap="square"
          style={
            { "--temple-delay": `${index * 32}ms` } as CSSProperties
          }
        />
      ))}
    </svg>
  );
}
