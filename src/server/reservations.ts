"use server";

import { db } from "@/lib/db";
import { getAdminNotifyEmail, sendEmail } from "@/lib/email/client";
import { adminNewRequest, guestRequestReceived } from "@/lib/email/templates";
import { reservationSchema } from "@/lib/validations/reservation";

export type ReservationResult =
  | { ok: true }
  | { ok: false; error: string };

/**
 * Create a public reservation request. Validates input server-side and stores
 * it as a PENDING row for an admin to confirm later.
 */
export async function createReservation(
  input: unknown
): Promise<ReservationResult> {
  const parsed = reservationSchema.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false,
      error: "Some details need another look. Please review the form.",
    };
  }

  const data = parsed.data;

  try {
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
        subject: "We've received your Apollonia request",
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
      error: "We could not submit your request just now. Please try again.",
    };
  }
}
