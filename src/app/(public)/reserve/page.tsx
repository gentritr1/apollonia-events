import type { Metadata } from "next";

import { MeanderRule } from "@/components/public/meander-rule";
import { ReservationForm } from "@/components/public/reservation-form";
import { UpcomingFreeDateChips } from "@/components/public/upcoming-free-dates";
import { reserveCopy } from "@/lib/content";
import {
  getConfirmedReservationDates,
  getUpcomingFreeDates,
} from "@/server/reservations";

export const metadata: Metadata = reserveCopy.metadata;

function getDateParam(params: { date?: string | string[] }) {
  return typeof params.date === "string" ? params.date : undefined;
}

function ReserveFaq() {
  return (
    <section className="mx-auto w-full max-w-4xl px-6 pb-28">
      <h2 className="text-4xl text-ink">{reserveCopy.faq.title}</h2>
      <div className="mt-8 divide-y divide-marble-deep border-y border-marble-deep">
        {reserveCopy.faq.items.map((item) => (
          <details key={item.question} className="faq-disclosure group">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 font-serif text-2xl text-ink transition-colors hover:text-aegean">
              <span>{item.question}</span>
              <span
                className="faq-chevron shrink-0 text-lg text-gold"
                aria-hidden="true"
              >
                ⌄
              </span>
            </summary>
            <p className="max-w-2xl pb-6 leading-relaxed text-ink-soft">
              {item.answer}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}

export default async function PublicReservationPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string | string[] }>;
}) {
  const [confirmedDates, upcomingFreeDates, params] = await Promise.all([
    getConfirmedReservationDates(),
    getUpcomingFreeDates(),
    searchParams,
  ]);
  const requestedDate = getDateParam(params);

  return (
    <>
      <section className="marble-wash">
        <div className="mx-auto w-full max-w-4xl px-6 pt-24 pb-12 text-center">
          <p className="overline mb-5">{reserveCopy.header.overline}</p>
          <MeanderRule units={5} className="mx-auto mb-8 opacity-80" />
          <h1 className="text-balance text-5xl text-ink sm:text-6xl">
            {reserveCopy.header.title}
          </h1>
          <p className="mx-auto mt-7 max-w-2xl text-pretty text-lg leading-relaxed text-ink-soft">
            {reserveCopy.header.description}
          </p>
        </div>
      </section>

      <section
        id="reservation-form"
        className="mx-auto w-full max-w-6xl scroll-mt-24 px-6 pt-4 pb-20"
      >
        <UpcomingFreeDateChips dates={upcomingFreeDates} />
        <ReservationForm
          confirmedDates={confirmedDates}
          requestedDate={requestedDate}
        />
      </section>
      <ReserveFaq />
    </>
  );
}
