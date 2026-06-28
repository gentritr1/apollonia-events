import type { Metadata } from "next";

import { MeanderRule } from "@/components/public/meander-rule";
import { ReservationForm } from "@/components/public/reservation-form";

export const metadata: Metadata = {
  title: "Reserve a Date — Apollonia Events",
  description:
    "Request a date at Apollonia. Tell us about your occasion and we will hold the day while we plan it together.",
};

export default function ReservePage() {
  return (
    <>
      <section className="marble-wash">
        <div className="mx-auto w-full max-w-3xl px-6 pt-24 pb-12 text-center">
          <p className="overline mb-5">Reserve</p>
          <MeanderRule units={5} className="mx-auto mb-8 opacity-80" />
          <h1 className="text-balance text-5xl text-ink sm:text-6xl">
            Hold your date
          </h1>
          <p className="mx-auto mt-7 max-w-lg text-pretty text-lg leading-relaxed text-ink-soft">
            Share a few details about your occasion. We will hold the day while
            we confirm availability and begin planning together.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-2xl px-6 pb-28">
        <ReservationForm />
      </section>
    </>
  );
}
