import Link from "next/link";

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
  headingLevel: Heading = "h3",
  description,
  tone = "marble",
  href,
  cta,
  className,
}: {
  title: string;
  /** h3 under a section heading; h2 where the cards follow the page h1 directly. */
  headingLevel?: "h2" | "h3";
  description: string;
  tone?: Tone;
  href?: string;
  cta?: string;
  className?: string;
}) {
  return (
    <article
      className={cn(
        "group relative flex flex-col rounded-2xl border border-marble-deep/50 bg-card p-8 transition-colors hover:border-gold/50",
        className,
      )}
    >
      <span
        className={cn(
          "mb-6 h-px w-10 transition-all group-hover:w-16",
          toneBar[tone],
        )}
      />
      <Heading className="text-2xl text-ink">{title}</Heading>
      <p className="mt-3 text-pretty leading-relaxed text-ink-soft">
        {description}
      </p>
      {href && cta ? (
        <Link
          href={href}
          className="link-arrow mt-6 text-sm tracking-wide text-aegean transition-colors group-hover:text-aegean-deep before:absolute before:inset-0 before:content-['']"
        >
          {cta}
        </Link>
      ) : null}
    </article>
  );
}
