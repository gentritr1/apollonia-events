import { format } from "date-fns";
import { sq } from "date-fns/locale";

import { MeanderRule } from "@/components/public/meander-rule";
import { reserveCopy } from "@/lib/content";
import { cn } from "@/lib/utils";

type ReservationInvitationPreviewProps = {
  date?: string;
  timeLabel?: string;
  occasion?: string;
  guestCount?: string;
  name?: string;
  phone?: string;
  email?: string;
  notes?: string;
  state?: "draft" | "received";
  className?: string;
};

function parseDateKey(dateKey: string | undefined) {
  const match = dateKey?.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(year, month - 1, day);

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }

  return date;
}

function formatInvitationDate(dateKey: string | undefined) {
  const date = parseDateKey(dateKey);
  if (!date) return null;

  return `e ${format(date, "EEEE, d MMMM yyyy", { locale: sq }).toLocaleLowerCase(
    "sq-AL"
  )}`;
}

function PreviewValue({
  value,
  fallback,
  className,
}: {
  value?: string;
  fallback: string;
  className?: string;
}) {
  const cleaned = value?.trim();

  if (!cleaned) {
    return <span className={cn("text-ink-soft/60", className)}>{fallback}</span>;
  }

  return <span className={className}>{cleaned}</span>;
}

export function ReservationInvitationPreview({
  date,
  timeLabel,
  occasion,
  guestCount,
  name,
  phone,
  email,
  notes,
  state = "draft",
  className,
}: ReservationInvitationPreviewProps) {
  const invitationDate = formatInvitationDate(date);
  const guestLine = guestCount?.trim()
    ? guestCount.trim() === "1"
      ? reserveCopy.invitation.singleGuest(guestCount.trim())
      : reserveCopy.invitation.manyInvitees(guestCount.trim())
    : undefined;
  const contactLine = [phone?.trim(), email?.trim()]
    .filter(Boolean)
    .join(" / ");
  const cleanedNotes = notes?.trim();

  return (
    <article
      aria-label={
        state === "received"
          ? reserveCopy.invitation.receivedAriaLabel
          : reserveCopy.invitation.draftAriaLabel
      }
      className={cn(
        "relative overflow-hidden rounded-t-[999px] rounded-b-xl border border-gold/35 bg-[#fbf9f3] px-7 pt-16 pb-8 text-center text-ink shadow-inner",
        className
      )}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-3 rounded-t-[999px] rounded-b-lg border border-marble-deep/70"
      />

      <div className="relative">
        <p className="overline mb-5">
          {state === "received"
            ? reserveCopy.invitation.receivedOverline
            : reserveCopy.invitation.draftOverline}
        </p>
        <MeanderRule units={4} className="mx-auto mb-7 opacity-75" />

        <h2 className="text-balance text-4xl text-ink sm:text-5xl">
          {state === "received"
            ? reserveCopy.invitation.receivedTitle
            : reserveCopy.invitation.draftTitle}
        </h2>

        <p className="mx-auto mt-5 max-w-xs text-sm leading-6 text-ink-soft">
          {state === "received"
            ? reserveCopy.invitation.receivedDescription
            : reserveCopy.invitation.draftDescription}
        </p>

        <div className="mt-9 border-y border-marble-deep/80 py-6">
          <p className="text-xs font-medium tracking-[0.22em] text-gold uppercase">
            {reserveCopy.invitation.requestedFor}
          </p>
          <p className="mt-3 text-balance font-serif text-3xl leading-tight text-aegean-deep">
            {invitationDate ? (
              invitationDate
            ) : (
              <span className="text-ink-soft/60">
                {reserveCopy.invitation.dateFallback}
              </span>
            )}
          </p>
        </div>

        <dl className="mt-7 grid grid-cols-1 gap-5 text-left sm:grid-cols-2 lg:grid-cols-1">
          <div>
            <dt className="text-xs font-medium tracking-[0.18em] text-gold uppercase">
              {reserveCopy.invitation.occasion}
            </dt>
            <dd className="mt-2 break-words font-serif text-2xl text-ink">
              <PreviewValue
                value={occasion}
                fallback={reserveCopy.invitation.occasionFallback}
              />
            </dd>
          </div>

          <div>
            <dt className="text-xs font-medium tracking-[0.18em] text-gold uppercase">
              {reserveCopy.invitation.hour}
            </dt>
            <dd className="mt-2 break-words text-sm leading-6 text-ink-soft">
              <PreviewValue
                value={timeLabel}
                fallback={reserveCopy.invitation.hourFallback}
              />
            </dd>
          </div>

          <div>
            <dt className="text-xs font-medium tracking-[0.18em] text-gold uppercase">
              {reserveCopy.invitation.guests}
            </dt>
            <dd className="mt-2 break-words text-sm leading-6 text-ink-soft">
              <PreviewValue
                value={guestLine}
                fallback={reserveCopy.invitation.guestsFallback}
              />
            </dd>
          </div>

          <div>
            <dt className="text-xs font-medium tracking-[0.18em] text-gold uppercase">
              {reserveCopy.invitation.requestedBy}
            </dt>
            <dd className="mt-2 break-words text-sm leading-6 text-ink-soft">
              <PreviewValue
                value={name}
                fallback={reserveCopy.invitation.nameFallback}
              />
            </dd>
          </div>
        </dl>

        <p className="mt-7 break-words border-t border-marble-deep/70 pt-5 text-sm leading-6 text-ink-soft">
          {contactLine || (
            <span className="text-ink-soft/60">
              {reserveCopy.invitation.contactFallback}
            </span>
          )}
        </p>

        {cleanedNotes ? (
          <div className="mt-6 text-left">
            <p className="text-xs font-medium tracking-[0.18em] text-gold uppercase">
              {reserveCopy.invitation.hostNote}
            </p>
            <p className="mt-2 line-clamp-4 break-words text-sm leading-6 text-ink-soft">
              {cleanedNotes}
            </p>
          </div>
        ) : null}

        <p className="mt-7 text-xs leading-5 text-ink-soft">
          {reserveCopy.invitation.bookingNotice}
        </p>
      </div>
    </article>
  );
}
