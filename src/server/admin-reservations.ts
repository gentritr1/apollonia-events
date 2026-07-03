"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { ReservationStatus } from "@prisma/client";

import { auth } from "@/auth";
import { RESERVATION_AVAILABILITY_TAG } from "@/lib/cache-tags";
import { db } from "@/lib/db";
import { emailCopy } from "@/lib/content";
import { sendEmail } from "@/lib/email/client";
import {
  guestReservationConfirmed,
  guestReservationDeclined,
} from "@/lib/email/templates";
import {
  manualReservationSchema,
  type ManualReservationInput,
} from "@/lib/validations/manual-reservation";

export type AdminReservationResult =
  | { ok: true }
  | { ok: false; error: string };

export async function updateReservationStatus(
  id: string,
  status: ReservationStatus
) {
  const session = await auth();

  if (session?.user?.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  if (!Object.values(ReservationStatus).includes(status)) {
    throw new Error("Invalid reservation status");
  }

  const currentReservation = await db.reservation.findUnique({ where: { id } });
  const reservation = await db.reservation.update({
    where: { id },
    data: { status },
  });

  if (currentReservation?.status !== status && status === "CONFIRMED") {
    try {
      await sendEmail({
        to: reservation.email,
        subject: emailCopy.confirmed.subject,
        html: guestReservationConfirmed(reservation),
      });
    } catch (err) {
      console.error("Failed to send reservation confirmation email:", err);
    }
  }

  if (currentReservation?.status !== status && status === "DECLINED") {
    try {
      await sendEmail({
        to: reservation.email,
        subject: emailCopy.declined.subject,
        html: guestReservationDeclined(reservation),
      });
    } catch (err) {
      console.error("Failed to send reservation decline email:", err);
    }
  }

  revalidatePath("/admin");
  revalidatePath("/admin/calendar");
  revalidatePath("/admin/reservations");
  revalidateTag(RESERVATION_AVAILABILITY_TAG, "max");
}

export async function createManualReservation(
  input: ManualReservationInput
): Promise<AdminReservationResult> {
  const session = await auth();

  if (session?.user?.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const parsed = manualReservationSchema.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false,
      error: "Some details need another look. Please review the form.",
    };
  }

  const data = parsed.data;

  try {
    await db.reservation.create({
      data: {
        date: new Date(`${data.date}T00:00:00Z`),
        time: data.time,
        eventType: data.eventType,
        guestCount: Number(data.guestCount),
        name: data.name,
        phone: data.phone,
        email: data.email,
        notes: data.notes || null,
        source: "MANUAL",
        status: data.status,
      },
    });

    revalidatePath("/admin");
    revalidatePath("/admin/calendar");
    revalidatePath("/admin/reservations");
    revalidateTag(RESERVATION_AVAILABILITY_TAG, "max");

    return { ok: true };
  } catch (err) {
    console.error("Failed to create manual reservation:", err);
    return {
      ok: false,
      error: "We could not create the reservation just now. Please try again.",
    };
  }
}
