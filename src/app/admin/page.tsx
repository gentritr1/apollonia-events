import Link from "next/link";
import { CalendarDays, TableProperties } from "lucide-react";
import { ReservationStatus } from "@prisma/client";

import { ManualReservationDialog } from "@/components/admin/manual-reservation-dialog";
import { ReservationStatusBadge } from "@/components/admin/reservation-status-badge";
import {
  compactDateFormatter,
  startOfTodayUtc,
} from "@/lib/admin/reservations";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";

const statCards = [
  { key: "total", label: "Total requests" },
  { key: "pending", label: "Pending" },
  { key: "confirmed", label: "Confirmed" },
  { key: "upcoming", label: "Upcoming" },
] as const;

function pluralize(count: number, label: string) {
  return `${count} ${label}${count === 1 ? "" : "s"}`;
}

export default async function AdminDashboardPage() {
  const today = startOfTodayUtc();

  const [
    total,
    pending,
    confirmed,
    upcoming,
    nextUp,
    recentRequests,
  ] = await Promise.all([
    db.reservation.count(),
    db.reservation.count({ where: { status: ReservationStatus.PENDING } }),
    db.reservation.count({ where: { status: ReservationStatus.CONFIRMED } }),
    db.reservation.count({ where: { date: { gte: today } } }),
    db.reservation.findMany({
      where: { date: { gte: today } },
      orderBy: [{ date: "asc" }, { createdAt: "desc" }],
      take: 5,
    }),
    db.reservation.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);

  const stats = {
    total,
    pending,
    confirmed,
    upcoming,
  };

  return (
    <div className="mx-auto w-full max-w-7xl">
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-medium text-gold">Admin</p>
          <h1 className="mt-2 font-serif text-4xl text-ink">Dashboard</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-ink-soft">
            A quick read on requests, upcoming bookings, and the latest activity.
          </p>
        </div>

        <ManualReservationDialog triggerClassName="w-full sm:w-auto" />
      </div>

      <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card) => (
          <div
            key={card.key}
            className="rounded-lg border border-marble-deep bg-ivory p-5"
          >
            <p className="text-sm font-medium text-ink-soft">{card.label}</p>
            <p className="mt-3 font-serif text-4xl text-ink">
              {stats[card.key]}
            </p>
          </div>
        ))}
      </section>

      <section className="mt-8 grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <DashboardPanel
          title="Next up"
          description={pluralize(nextUp.length, "upcoming reservation")}
          empty="No upcoming reservations."
        >
          {nextUp.map((reservation) => (
            <ReservationListItem
              key={reservation.id}
              reservation={reservation}
              href="/admin/calendar"
            />
          ))}
        </DashboardPanel>

        <DashboardPanel
          title="Recent requests"
          description={pluralize(recentRequests.length, "recent request")}
          empty="No reservation requests yet."
        >
          {recentRequests.map((reservation) => (
            <ReservationListItem
              key={reservation.id}
              reservation={reservation}
              href="/admin/reservations"
            />
          ))}
        </DashboardPanel>
      </section>

      <section className="mt-6 flex flex-col gap-3 rounded-lg border border-marble-deep bg-[#fbf9f3] p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-serif text-2xl text-ink">Manage the schedule</h2>
          <p className="mt-1 text-sm text-ink-soft">
            Review every request in the table or inspect the month view.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button asChild variant="outline">
            <Link href="/admin/reservations">
              <TableProperties className="size-4" />
              Reservations
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/admin/calendar">
              <CalendarDays className="size-4" />
              Calendar
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}

function DashboardPanel({
  title,
  description,
  empty,
  children,
}: {
  title: string;
  description: string;
  empty: string;
  children: React.ReactNode[];
}) {
  return (
    <section className="rounded-lg border border-marble-deep bg-[#fbf9f3] p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl text-ink">{title}</h2>
          <p className="mt-1 text-sm text-ink-soft">{description}</p>
        </div>
      </div>

      <div className="mt-5 divide-y divide-marble-deep/70">
        {children.length > 0 ? (
          children
        ) : (
          <p className="py-8 text-sm text-ink-soft">{empty}</p>
        )}
      </div>
    </section>
  );
}

function ReservationListItem({
  reservation,
  href,
}: {
  reservation: {
    id: string;
    date: Date;
    time: string;
    name: string;
    eventType: string;
    status: ReservationStatus;
  };
  href: string;
}) {
  return (
    <Link
      href={href}
      className="flex flex-col gap-3 py-3 transition-colors hover:text-aegean sm:flex-row sm:items-center sm:justify-between"
    >
      <div className="min-w-0">
        <p className="text-sm font-medium text-ink">
          {compactDateFormatter.format(reservation.date)} · {reservation.time}
        </p>
        <p className="mt-1 truncate text-sm text-ink-soft">
          {reservation.name} · {reservation.eventType}
        </p>
      </div>
      <ReservationStatusBadge status={reservation.status} />
    </Link>
  );
}
