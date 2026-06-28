import type { ReservationStatus } from "@prisma/client";

export const statusLabels: Record<ReservationStatus, string> = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  DECLINED: "Declined",
  CANCELLED: "Cancelled",
};

export const statusBadgeClasses: Record<ReservationStatus, string> = {
  PENDING: "border-gold/35 bg-gold/15 text-gold",
  CONFIRMED: "border-aegean/35 bg-aegean/15 text-aegean-deep",
  DECLINED: "border-marble-deep bg-marble text-ink-soft",
  CANCELLED: "border-marble-deep bg-marble text-ink-soft line-through",
};

export const statusDotClasses: Record<ReservationStatus, string> = {
  PENDING: "bg-gold",
  CONFIRMED: "bg-aegean",
  DECLINED: "bg-ink-soft",
  CANCELLED: "bg-marble-deep",
};

export const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

export const compactDateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  timeZone: "UTC",
});

export function startOfTodayUtc() {
  const now = new Date();
  return new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
  );
}

export function toDateKey(date: Date) {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function fromDateKey(date: string) {
  return new Date(`${date}T00:00:00Z`);
}
