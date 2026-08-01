"use server";

import { unstable_cache } from "next/cache";

import { RESERVATION_AVAILABILITY_TAG } from "@/lib/cache-tags";
import { db } from "@/lib/db";
import { getAdminNotifyEmail, sendEmail } from "@/lib/email/client";
import { adminNewRequest, guestRequestReceived } from "@/lib/email/templates";
import { emailCopy, reserveCopy, type UpcomingFreeDate } from "@/lib/content";
import { reservationSchema } from "@/lib/validations/reservation";

export type ReservationResult = { ok: true } | { ok: false; error: string };

function toIsoDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

function dateFromIso(iso: string) {
  return new Date(`${iso}T00:00:00Z`);
}

function addUtcDays(date: Date, days: number) {
  const next = new Date(date);
  next.setUTCDate(next.getUTCDate() + days);
  return next;
}

function getTodayInVenueTime() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Tirane",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const year = parts.find((part) => part.type === "year")?.value;
  const month = parts.find((part) => part.type === "month")?.value;
  const day = parts.find((part) => part.type === "day")?.value;

  if (!year || !month || !day) {
    const now = new Date();
    return new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
    );
  }

  return dateFromIso(`${year}-${month}-${day}`);
}

function nextSaturdayOnOrAfter(date: Date) {
  const daysUntilSaturday = (6 - date.getUTCDay() + 7) % 7;
  return addUtcDays(date, daysUntilSaturday);
}

function formatFreeDateLabel(date: Date) {
  return new Intl.DateTimeFormat("sq-AL", {
    timeZone: "UTC",
    day: "numeric",
    month: "long",
  }).format(date);
}

async function isConfirmedDate(isoDate: string) {
  const reservation = await db.reservation.findFirst({
    where: {
      status: "CONFIRMED",
      date: dateFromIso(isoDate),
    },
    select: { id: true },
  });

  return Boolean(reservation);
}

const getCachedUpcomingFreeDates = unstable_cache(
  async (): Promise<UpcomingFreeDate[]> => {
    const today = getTodayInVenueTime();
    const confirmedReservations = await db.reservation.findMany({
      where: {
        status: "CONFIRMED",
        date: { gte: today },
      },
      select: { date: true },
      orderBy: { date: "asc" },
    });
    const confirmedDates = new Set(
      confirmedReservations.map((reservation) => toIsoDate(reservation.date)),
    );
    const dates: UpcomingFreeDate[] = [];
    // Suggestions need realistic lead time: same-day events can't be planned,
    // so the strip starts looking from tomorrow.
    let candidate = nextSaturdayOnOrAfter(addUtcDays(today, 1));

    while (dates.length < 3) {
      const iso = toIsoDate(candidate);

      if (!confirmedDates.has(iso)) {
        dates.push({ iso, label: formatFreeDateLabel(candidate) });
      }

      candidate = addUtcDays(candidate, 7);
    }

    return dates;
  },
  ["upcoming-free-saturdays"],
  { revalidate: 3600, tags: [RESERVATION_AVAILABILITY_TAG] },
);

/**
 * Create a public reservation request. Validates input server-side and stores
 * it as a PENDING row for an admin to confirm later.
 */
export async function createReservation(
  input: unknown,
): Promise<ReservationResult> {
  const parsed = reservationSchema.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false,
      error: reserveCopy.serverErrors.invalid,
    };
  }

  const data = parsed.data;

  try {
    if (await isConfirmedDate(data.date)) {
      return {
        ok: false,
        error: reserveCopy.serverErrors.unavailable,
      };
    }

    const reservation = await db.reservation.create({
      data: {
        date: new Date(`${data.date}T00:00:00Z`),
        time: data.time,
        eventType: data.eventType,
        guestCount: Number(data.guestCount),
        name: data.name,
        phone: data.phone,
        email: data.email,
        notes: data.notes || null,
        // status PENDING and source WEBSITE come from schema defaults.
      },
    });

    try {
      await sendEmail({
        to: reservation.email,
        subject: emailCopy.requestReceived.subject,
        html: guestRequestReceived(reservation),
        replyTo: getAdminNotifyEmail(),
      });
    } catch (err) {
      console.error("Failed to send guest reservation request email:", err);
    }

    try {
      await sendEmail({
        to: getAdminNotifyEmail(),
        subject: "New Apollonia reservation request",
        html: adminNewRequest(reservation),
        replyTo: reservation.email,
      });
    } catch (err) {
      console.error("Failed to send admin reservation request email:", err);
    }

    return { ok: true };
  } catch (err) {
    console.error("Failed to create reservation:", err);
    return {
      ok: false,
      error: reserveCopy.serverErrors.submit,
    };
  }
}

/**
 * Fetch all confirmed reservation dates to disable them in the public calendar.
 */
export async function getConfirmedReservationDates(): Promise<string[]> {
  try {
    const now = new Date();
    const today = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
    );
    const reservations = await db.reservation.findMany({
      where: {
        status: "CONFIRMED",
        date: { gte: today },
      },
      select: { date: true },
      orderBy: { date: "asc" },
    });

    return Array.from(
      new Set(
        reservations.map((reservation) =>
          reservation.date.toISOString().slice(0, 10),
        ),
      ),
    );
  } catch (error) {
    console.error("Failed to fetch confirmed reservation dates:", error);
    return [];
  }
}

/**
 * Times already spoken for on a given date, so the picker can grey them out
 * instead of letting someone request a slot that is gone.
 *
 * Includes PENDING as well as CONFIRMED. A confirmed date is already blocked
 * wholesale in the calendar, so in practice what this surfaces is other
 * people's outstanding requests — which is exactly the collision worth
 * preventing, since two requests for one slot means declining someone later.
 */
export async function getTakenTimesForDate(isoDate: string): Promise<string[]> {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(isoDate)) {
    return [];
  }

  try {
    const reservations = await db.reservation.findMany({
      where: {
        date: new Date(`${isoDate}T00:00:00.000Z`),
        status: { in: ["CONFIRMED", "PENDING"] },
      },
      select: { time: true },
    });

    return Array.from(new Set(reservations.map((r) => r.time)));
  } catch (error) {
    console.error("Failed to fetch taken times:", error);
    return [];
  }
}

/**
 * Fetch the next three Saturdays without a confirmed reservation.
 */
export async function getUpcomingFreeDates(): Promise<UpcomingFreeDate[]> {
  try {
    return await getCachedUpcomingFreeDates();
  } catch (error) {
    console.error("Failed to fetch upcoming free dates:", error);
    return [];
  }
}
