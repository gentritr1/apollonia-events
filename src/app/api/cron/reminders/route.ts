import { Prisma, ReminderType, ReservationStatus } from "@prisma/client";

import { db } from "@/lib/db";
import { getAdminNotifyEmail, sendEmail } from "@/lib/email/client";
import {
  adminUpcomingReminder,
  guestUpcomingReminder,
} from "@/lib/email/templates";
import { startOfTodayUtc } from "@/lib/admin/reservations";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function addUtcDays(date: Date, days: number) {
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + days)
  );
}

function isAuthorized(request: Request) {
  const secret = process.env.CRON_SECRET;

  if (!secret) {
    console.warn("Reminder cron rejected: CRON_SECRET is not configured.");
    return false;
  }

  return request.headers.get("authorization") === `Bearer ${secret}`;
}

function isUniqueConstraintError(error: unknown) {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002"
  );
}

async function logReminder(reservationId: string, type: ReminderType) {
  try {
    await db.reminderLog.create({
      data: {
        reservationId,
        type,
      },
    });

    return true;
  } catch (error) {
    if (!isUniqueConstraintError(error)) {
      console.error("Failed to create reminder log:", error);
    }

    return false;
  }
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const today = startOfTodayUtc();
  const tomorrow = addUtcDays(today, 1);
  const adminWindowEnd = addUtcDays(today, 3);
  let guestSent = 0;
  let adminSent = 0;

  const guestReservations = await db.reservation.findMany({
    where: {
      status: ReservationStatus.CONFIRMED,
      date: tomorrow,
      reminderLogs: {
        none: { type: ReminderType.GUEST_REMINDER },
      },
    },
    orderBy: [{ date: "asc" }, { time: "asc" }],
  });

  for (const reservation of guestReservations) {
    const result = await sendEmail({
      to: reservation.email,
      subject: "Reminder: your Apollonia reservation is tomorrow",
      html: guestUpcomingReminder(reservation),
    });

    if (!result.skipped && result.ok) {
      const logged = await logReminder(
        reservation.id,
        ReminderType.GUEST_REMINDER
      );

      if (logged) {
        guestSent += 1;
      }
    }
  }

  const adminReservations = await db.reservation.findMany({
    where: {
      status: ReservationStatus.CONFIRMED,
      date: {
        gte: tomorrow,
        lt: adminWindowEnd,
      },
      reminderLogs: {
        none: { type: ReminderType.ADMIN_UPCOMING },
      },
    },
    orderBy: [{ date: "asc" }, { time: "asc" }],
  });

  if (adminReservations.length > 0) {
    const result = await sendEmail({
      to: getAdminNotifyEmail(),
      subject: "Upcoming Apollonia reservations",
      html: adminUpcomingReminder(adminReservations),
    });

    if (!result.skipped && result.ok) {
      await db.reminderLog.createMany({
        data: adminReservations.map((reservation) => ({
          reservationId: reservation.id,
          type: ReminderType.ADMIN_UPCOMING,
        })),
        skipDuplicates: true,
      });
      adminSent = 1;
    }
  }

  return Response.json({ guestSent, adminSent });
}
