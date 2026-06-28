"use server";

import { revalidatePath } from "next/cache";
import { ReservationStatus } from "@prisma/client";

import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function updateReservationStatus(
  id: string,
  status: ReservationStatus
) {
  const session = await auth();

  if (!session) {
    throw new Error("Unauthorized");
  }

  if (!Object.values(ReservationStatus).includes(status)) {
    throw new Error("Invalid reservation status");
  }

  await db.reservation.update({ where: { id }, data: { status } });
  revalidatePath("/admin/reservations");
}
