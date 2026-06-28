"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { ReservationSource, ReservationStatus } from "@prisma/client";

import { ReservationActions } from "@/components/admin/reservation-actions";
import { ReservationStatusBadge } from "@/components/admin/reservation-status-badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export type CalendarReservationDetails = {
  id: string;
  dateLabel: string;
  time: string;
  eventType: string;
  guestCount: number;
  name: string;
  phone: string;
  email: string;
  notes: string | null;
  status: ReservationStatus;
  source: ReservationSource;
  createdAtLabel: string;
};

export function CalendarReservationDetailsDialog({
  reservation,
  returnHref,
}: {
  reservation: CalendarReservationDetails;
  returnHref: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(true);

  function changeOpen(nextOpen: boolean) {
    setOpen(nextOpen);

    if (!nextOpen) {
      router.replace(returnHref);
    }
  }

  return (
    <Dialog open={open} onOpenChange={changeOpen}>
      <DialogContent className="border border-marble-deep bg-[#fbf9f3] sm:max-w-lg">
        <DialogHeader>
          <div className="flex flex-col gap-3 pr-10 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <DialogTitle className="font-serif text-2xl font-medium text-ink">
                {reservation.name}
              </DialogTitle>
              <DialogDescription>
                {reservation.eventType} · {reservation.dateLabel} at{" "}
                {reservation.time}
              </DialogDescription>
            </div>
            <ReservationStatusBadge status={reservation.status} />
          </div>
        </DialogHeader>

        <dl className="grid gap-4 text-sm sm:grid-cols-2">
          <Detail label="Guests" value={String(reservation.guestCount)} />
          <Detail label="Source" value={reservation.source.toLowerCase()} />
          <Detail label="Email" value={reservation.email} />
          <Detail label="Phone" value={reservation.phone} />
          <Detail label="Created" value={reservation.createdAtLabel} />
        </dl>

        {reservation.notes ? (
          <div className="rounded-lg border border-marble-deep bg-ivory p-3">
            <p className="text-xs font-medium text-ink-soft">Notes</p>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-ink">
              {reservation.notes}
            </p>
          </div>
        ) : null}

        <div className="flex items-center justify-between rounded-lg border border-marble-deep bg-marble/40 px-3 py-2">
          <p className="text-sm font-medium text-ink-soft">Status</p>
          <ReservationActions
            id={reservation.id}
            currentStatus={reservation.status}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-medium text-ink-soft">{label}</dt>
      <dd className="mt-1 break-words text-ink">{value}</dd>
    </div>
  );
}
