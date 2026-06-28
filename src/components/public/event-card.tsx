import type { Tone } from "@/lib/content";
import { cn } from "@/lib/utils";

const toneBar: Record<Tone, string> = {
  aegean: "bg-aegean",
  olive: "bg-olive",
  gold: "bg-gold",
  marble: "bg-marble-deep",
};

/** A single event type, presented as a calm bordered card. */
export function EventCard({
  title,
  description,
  tone = "marble",
  className,
}: {
  title: string;
  description: string;
  tone?: Tone;
  className?: string;
}) {
  return (
    <article
      className={cn(
        "group relative flex flex-col rounded-2xl border border-marble-deep/50 bg-card p-8 transition-colors hover:border-gold/50",
        className
      )}
    >
      <span
        className={cn("mb-6 h-px w-10 transition-all group-hover:w-16", toneBar[tone])}
      />
      <h3 className="text-2xl text-ink">{title}</h3>
      <p className="mt-3 text-pretty leading-relaxed text-ink-soft">
        {description}
      </p>
    </article>
  );
}
