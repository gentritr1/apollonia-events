import Link from "next/link";

import { availabilityCopy, type UpcomingFreeDate } from "@/lib/content";

function DateLink({ date }: { date: UpcomingFreeDate }) {
  return (
    <Link
      href={`/reserve?date=${date.iso}`}
      className="font-serif text-xl leading-none text-aegean-deep transition-colors hover:text-aegean"
    >
      {date.label}
    </Link>
  );
}

export function UpcomingFreeDatesStrip({
  dates,
}: {
  dates: UpcomingFreeDate[];
}) {
  if (dates.length === 0) {
    return null;
  }

  return (
    <section
      aria-label={availabilityCopy.overline}
      className="border-y border-gold/20 bg-ivory"
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-6 py-4 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
        <p className="overline text-[0.66rem] tracking-[0.18em]">
          {availabilityCopy.overline}
        </p>
        <p className="text-sm leading-7 text-ink-soft">
          <span className="text-ink">{availabilityCopy.homePrefix}</span>
          <span className="mx-2 hidden text-gold sm:inline">—</span>
          <span className="mt-1 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 sm:mt-0 sm:inline-flex sm:justify-start">
            {dates.map((date, index) => (
              <span key={date.iso} className="inline-flex items-baseline gap-2">
                {index > 0 ? (
                  <span className="text-gold" aria-hidden="true">
                    ·
                  </span>
                ) : null}
                <DateLink date={date} />
              </span>
            ))}
          </span>
        </p>
      </div>
    </section>
  );
}

export function UpcomingFreeDateChips({
  dates,
}: {
  dates: UpcomingFreeDate[];
}) {
  if (dates.length === 0) {
    return null;
  }

  return (
    <div
      className="mb-7 scroll-mt-24"
      aria-label={availabilityCopy.reservePrompt}
    >
      <p className="overline mb-4 text-[0.66rem] tracking-[0.18em]">
        {availabilityCopy.reservePrompt}
      </p>
      <div className="flex flex-wrap gap-3">
        {dates.map((date) => (
          <Link
            key={date.iso}
            href={`/reserve?date=${date.iso}`}
            className="btn btn-quiet btn-sm date-chip font-serif text-lg"
          >
            {date.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
