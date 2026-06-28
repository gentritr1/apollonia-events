import Link from "next/link";
import { format } from "date-fns";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";

import {
  CalendarReservationDetailsDialog,
  type CalendarReservationDetails,
} from "@/components/admin/calendar-reservation-details-dialog";
import { ManualReservationDialog } from "@/components/admin/manual-reservation-dialog";
import {
  compactDateFormatter,
  dateFormatter,
  startOfTodayUtc,
  statusDotClasses,
  toDateKey,
} from "@/lib/admin/reservations";
import { db } from "@/lib/db";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function getStringParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function currentMonthStartUtc() {
  const today = startOfTodayUtc();
  return new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), 1));
}

function parseMonth(value: string | undefined) {
  if (!value) return currentMonthStartUtc();

  const match = value.match(/^(\d{4})-(\d{2})$/);
  if (!match) return currentMonthStartUtc();

  const year = Number(match[1]);
  const month = Number(match[2]);

  if (month < 1 || month > 12) return currentMonthStartUtc();

  return new Date(Date.UTC(year, month - 1, 1));
}

function addUtcMonths(date: Date, amount: number) {
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + amount, 1)
  );
}

function monthKey(date: Date) {
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(
    2,
    "0"
  )}`;
}

function calendarHref(month: Date, params?: Record<string, string>) {
  const searchParams = new URLSearchParams({ month: monthKey(month) });

  for (const [key, value] of Object.entries(params ?? {})) {
    searchParams.set(key, value);
  }

  return `/admin/calendar?${searchParams.toString()}`;
}

function getDateParam(value: string | undefined) {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return undefined;

  const parsed = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime())) return undefined;

  return value;
}

function getCalendarDays(monthStart: Date) {
  const firstDayOffset = monthStart.getUTCDay();
  const gridStart = new Date(monthStart);
  gridStart.setUTCDate(gridStart.getUTCDate() - firstDayOffset);

  const lastOfMonth = new Date(
    Date.UTC(monthStart.getUTCFullYear(), monthStart.getUTCMonth() + 1, 0)
  );
  const lastDayOffset = 6 - lastOfMonth.getUTCDay();
  const gridEnd = new Date(lastOfMonth);
  gridEnd.setUTCDate(gridEnd.getUTCDate() + lastDayOffset);

  const days: Date[] = [];
  const cursor = new Date(gridStart);

  while (cursor <= gridEnd) {
    days.push(new Date(cursor));
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }

  return days;
}

function isSameUtcDay(a: Date, b: Date) {
  return toDateKey(a) === toDateKey(b);
}

export default async function AdminCalendarPage({
  searchParams,
}: {
  searchParams: Promise<{
    month?: string | string[];
    reservation?: string | string[];
    new?: string | string[];
  }>;
}) {
  const params = await searchParams;
  const monthStart = parseMonth(getStringParam(params.month));
  const nextMonthStart = addUtcMonths(monthStart, 1);
  const today = startOfTodayUtc();
  const days = getCalendarDays(monthStart);
  const returnHref = calendarHref(monthStart);
  const selectedReservationId = getStringParam(params.reservation);
  const newReservationDate = getDateParam(getStringParam(params.new));

  const reservations = await db.reservation.findMany({
    where: {
      date: {
        gte: monthStart,
        lt: nextMonthStart,
      },
    },
    orderBy: [{ date: "asc" }, { time: "asc" }],
  });

  const reservationsByDate = new Map<string, typeof reservations>();

  for (const reservation of reservations) {
    const key = toDateKey(reservation.date);
    reservationsByDate.set(key, [
      ...(reservationsByDate.get(key) ?? []),
      reservation,
    ]);
  }

  const selectedReservation = reservations.find(
    (reservation) => reservation.id === selectedReservationId
  );

  const selectedDetails: CalendarReservationDetails | undefined =
    selectedReservation
      ? {
          id: selectedReservation.id,
          dateLabel: dateFormatter.format(selectedReservation.date),
          time: selectedReservation.time,
          eventType: selectedReservation.eventType,
          guestCount: selectedReservation.guestCount,
          name: selectedReservation.name,
          phone: selectedReservation.phone,
          email: selectedReservation.email,
          notes: selectedReservation.notes,
          status: selectedReservation.status,
          source: selectedReservation.source,
          createdAtLabel: dateFormatter.format(selectedReservation.createdAt),
        }
      : undefined;

  return (
    <div className="mx-auto w-full max-w-7xl">
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-medium text-gold">Admin</p>
          <h1 className="mt-2 font-serif text-4xl text-ink">Calendar</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-ink-soft">
            Month view for confirmed bookings, incoming requests, and manual
            holds.
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <ManualReservationDialog triggerClassName="w-full sm:w-auto" />
          <Button asChild variant="outline">
            <Link href={calendarHref(currentMonthStartUtc())}>Today</Link>
          </Button>
        </div>
      </div>

      <section className="mt-8 overflow-hidden rounded-lg border border-marble-deep bg-[#fbf9f3]">
        <div className="flex flex-col gap-4 border-b border-marble-deep bg-ivory px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-serif text-3xl text-ink">
              {format(monthStart, "MMMM yyyy")}
            </h2>
            <p className="mt-1 text-sm text-ink-soft">
              {reservations.length} reservation
              {reservations.length === 1 ? "" : "s"} this month
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button asChild variant="outline" size="icon" aria-label="Previous month">
              <Link href={calendarHref(addUtcMonths(monthStart, -1))}>
                <ChevronLeft className="size-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="icon" aria-label="Next month">
              <Link href={calendarHref(addUtcMonths(monthStart, 1))}>
                <ChevronRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-[760px]">
            <div className="grid grid-cols-7 border-b border-marble-deep bg-marble/50 text-xs font-medium text-ink-soft">
              {weekDays.map((day) => (
                <div key={day} className="px-2 py-2 text-center">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7">
              {days.map((day) => {
                const key = toDateKey(day);
                const inMonth = day.getUTCMonth() === monthStart.getUTCMonth();
                const dayReservations = reservationsByDate.get(key) ?? [];
                const visible = dayReservations.slice(0, 3);
                const hiddenCount = Math.max(
                  dayReservations.length - visible.length,
                  0
                );

                return (
                  <div
                    key={key}
                    className={cn(
                      "min-h-36 border-r border-b border-marble-deep/70 p-2",
                      !inMonth && "bg-marble/30 text-ink-soft"
                    )}
                  >
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <span
                        className={cn(
                          "flex size-7 items-center justify-center rounded-full text-sm font-medium",
                          isSameUtcDay(day, today)
                            ? "bg-aegean text-ivory"
                            : inMonth
                              ? "text-ink"
                              : "text-ink-soft/60"
                        )}
                      >
                        {day.getUTCDate()}
                      </span>
                      {inMonth ? (
                        <Link
                          href={calendarHref(monthStart, { new: key })}
                          aria-label={`New reservation for ${compactDateFormatter.format(day)}`}
                          className="flex size-7 items-center justify-center rounded-md text-ink-soft transition-colors hover:bg-marble hover:text-aegean"
                        >
                          <Plus className="size-4" />
                        </Link>
                      ) : null}
                    </div>

                    <div className="space-y-1">
                      {visible.map((reservation) => (
                        <Link
                          key={reservation.id}
                          href={calendarHref(monthStart, {
                            reservation: reservation.id,
                          })}
                          className="flex min-w-0 items-center gap-1.5 rounded-md border border-marble-deep/60 bg-ivory px-2 py-1 text-left text-xs text-ink transition-colors hover:border-aegean/40 hover:text-aegean"
                        >
                          <span
                            className={cn(
                              "size-2 shrink-0 rounded-full",
                              statusDotClasses[reservation.status]
                            )}
                          />
                          <span className="shrink-0 text-ink-soft">
                            {reservation.time}
                          </span>
                          <span className="truncate">{reservation.name}</span>
                        </Link>
                      ))}
                      {hiddenCount > 0 ? (
                        <p className="px-2 py-1 text-xs text-ink-soft">
                          +{hiddenCount} more
                        </p>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {selectedDetails ? (
        <CalendarReservationDetailsDialog
          reservation={selectedDetails}
          returnHref={returnHref}
        />
      ) : null}

      {newReservationDate ? (
        <ManualReservationDialog
          defaultDate={newReservationDate}
          initialOpen
          returnHref={returnHref}
          showTrigger={false}
        />
      ) : null}
    </div>
  );
}
