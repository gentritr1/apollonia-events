import Link from "next/link";
import { ReservationStatus } from "@prisma/client";

import { ReservationActions } from "@/components/admin/reservation-actions";
import { ReservationStatusBadge } from "@/components/admin/reservation-status-badge";
import { dateFormatter, statusLabels } from "@/lib/admin/reservations";
import { db } from "@/lib/db";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const statusOptions = [
  ReservationStatus.PENDING,
  ReservationStatus.CONFIRMED,
  ReservationStatus.DECLINED,
  ReservationStatus.CANCELLED,
];

function getStatusParam(value: string | string[] | undefined) {
  const status = Array.isArray(value) ? value[0] : value;

  if (statusOptions.includes(status as ReservationStatus)) {
    return status as ReservationStatus;
  }

  return undefined;
}

function formatCount(count: number, label: string) {
  return `${count} ${label}${count === 1 ? "" : "s"}`;
}

export default async function AdminReservationsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string | string[] }>;
}) {
  const params = await searchParams;
  const activeStatus = getStatusParam(params.status);
  const reservations = await db.reservation.findMany({
    orderBy: [{ date: "asc" }, { createdAt: "desc" }],
  });

  const visibleReservations = activeStatus
    ? reservations.filter((reservation) => reservation.status === activeStatus)
    : reservations;

  const counts = reservations.reduce(
    (acc, reservation) => {
      acc[reservation.status] += 1;
      return acc;
    },
    {
      PENDING: 0,
      CONFIRMED: 0,
      DECLINED: 0,
      CANCELLED: 0,
    } satisfies Record<ReservationStatus, number>
  );

  return (
    <div className="mx-auto w-full max-w-7xl">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-medium text-gold">Admin</p>
          <h1 className="mt-2 font-serif text-4xl text-ink">Reservations</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-ink-soft">
            Review incoming requests and keep each booking status current.
          </p>
        </div>

        <div className="rounded-lg border border-marble-deep bg-ivory px-4 py-3 text-sm text-ink-soft">
          <span className="font-medium text-ink">
            {formatCount(reservations.length, "request")}
          </span>
          <span className="mx-2 text-marble-deep">/</span>
          <span>{formatCount(counts.PENDING, "pending")}</span>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap gap-2">
        <StatusFilterLink
          href="/admin/reservations"
          active={!activeStatus}
          label="All"
          count={reservations.length}
        />
        {statusOptions.map((status) => (
          <StatusFilterLink
            key={status}
            href={`/admin/reservations?status=${status}`}
            active={activeStatus === status}
            label={statusLabels[status]}
            count={counts[status]}
          />
        ))}
      </div>

      <section className="mt-5 overflow-hidden rounded-lg border border-marble-deep bg-[#fbf9f3]">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Date</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Occasion</TableHead>
              <TableHead>Guests</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visibleReservations.length > 0 ? (
              visibleReservations.map((reservation) => (
                <TableRow key={reservation.id}>
                  <TableCell className="font-medium text-ink">
                    {dateFormatter.format(reservation.date)}
                  </TableCell>
                  <TableCell>{reservation.time}</TableCell>
                  <TableCell>{reservation.eventType}</TableCell>
                  <TableCell>{reservation.guestCount}</TableCell>
                  <TableCell className="font-medium text-ink">
                    {reservation.name}
                  </TableCell>
                  <TableCell className="min-w-52 whitespace-normal text-ink-soft">
                    <span className="block text-ink">{reservation.email}</span>
                    <span className="block">{reservation.phone}</span>
                  </TableCell>
                  <TableCell>
                    <ReservationStatusBadge status={reservation.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <ReservationActions
                      id={reservation.id}
                      currentStatus={reservation.status}
                    />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="h-28 text-center text-ink-soft"
                >
                  No reservations match this filter.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </section>
    </div>
  );
}

function StatusFilterLink({
  href,
  active,
  label,
  count,
}: {
  href: string;
  active: boolean;
  label: string;
  count: number;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "inline-flex h-8 items-center gap-2 rounded-lg border px-3 text-sm font-medium transition-colors",
        active
          ? "border-aegean bg-aegean text-ivory"
          : "border-marble-deep bg-ivory text-ink-soft hover:border-aegean/40 hover:text-aegean"
      )}
    >
      {label}
      <span
        className={cn(
          "rounded-md px-1.5 py-0.5 text-xs",
          active ? "bg-ivory/15 text-ivory" : "bg-marble text-ink-soft"
        )}
      >
        {count}
      </span>
    </Link>
  );
}
