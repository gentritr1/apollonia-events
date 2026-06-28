import { MeanderRule } from "@/components/public/meander-rule";
import { cn } from "@/lib/utils";

/** Consistent overline + serif heading used to open each section. */
export function SectionHeading({
  overline,
  title,
  description,
  align = "left",
  meander = false,
  className,
}: {
  overline?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  meander?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      {overline && <p className="overline mb-4">{overline}</p>}
      {meander && (
        <MeanderRule
          units={4}
          className={cn("mb-6 opacity-75", align === "center" && "mx-auto")}
        />
      )}
      <h2 className="text-balance text-4xl text-ink sm:text-5xl">{title}</h2>
      {description && (
        <p
          className={cn(
            "mt-5 text-pretty text-lg leading-relaxed text-ink-soft",
            align === "center" && "mx-auto max-w-xl"
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
