import type { Reservation } from "@prisma/client";

import { dateFormatter } from "@/lib/admin/reservations";

type ReservationEmailData = Pick<
  Reservation,
  | "date"
  | "time"
  | "eventType"
  | "guestCount"
  | "name"
  | "phone"
  | "email"
  | "notes"
  | "status"
  | "source"
>;

const colors = {
  ivory: "#f6f2e9",
  marble: "#ece6d9",
  ink: "#1e2a30",
  inkSoft: "#475158",
  aegean: "#2c5c6b",
  aegeanDeep: "#1c3d47",
  gold: "#a8854e",
};

function escapeHtml(value: string | number | null | undefined) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function detailRows(
  rows: Array<[label: string, value: string | number | null | undefined]>
) {
  return rows
    .filter(([, value]) => value !== null && value !== undefined && value !== "")
    .map(
      ([label, value]) => `
        <tr>
          <td style="padding: 9px 0; color: ${colors.inkSoft}; font-size: 14px; width: 34%;">${escapeHtml(label)}</td>
          <td style="padding: 9px 0; color: ${colors.ink}; font-size: 14px; font-weight: 600;">${escapeHtml(value)}</td>
        </tr>`
    )
    .join("");
}

function reservationDetails(reservation: ReservationEmailData) {
  return `
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse: collapse; margin-top: 22px;">
      <tbody>
        ${detailRows([
          ["Date", dateFormatter.format(reservation.date)],
          ["Time", reservation.time],
          ["Occasion", reservation.eventType],
          ["Guests", reservation.guestCount],
        ])}
      </tbody>
    </table>`;
}

function adminDetails(reservation: ReservationEmailData) {
  return `
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse: collapse; margin-top: 22px;">
      <tbody>
        ${detailRows([
          ["Date", dateFormatter.format(reservation.date)],
          ["Time", reservation.time],
          ["Occasion", reservation.eventType],
          ["Guests", reservation.guestCount],
          ["Status", reservation.status],
          ["Source", reservation.source],
          ["Name", reservation.name],
          ["Email", reservation.email],
          ["Phone", reservation.phone],
          ["Notes", reservation.notes || "None"],
        ])}
      </tbody>
    </table>`;
}

function heading(title: string) {
  return `<h1 style="margin: 0; color: ${colors.ink}; font-family: Georgia, serif; font-size: 30px; line-height: 1.2; font-weight: 400;">${escapeHtml(title)}</h1>`;
}

function paragraph(text: string) {
  return `<p style="margin: 18px 0 0; color: ${colors.inkSoft}; font-size: 15px; line-height: 1.7;">${escapeHtml(text)}</p>`;
}

export function emailLayout(bodyHtml: string, preheader: string) {
  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Apollonia Events</title>
  </head>
  <body style="margin: 0; padding: 0; background: ${colors.ivory}; color: ${colors.ink}; font-family: Arial, sans-serif;">
    <div style="display: none; max-height: 0; overflow: hidden; opacity: 0;">${escapeHtml(preheader)}</div>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background: ${colors.ivory}; padding: 32px 14px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; background: #fbf9f3; border: 1px solid ${colors.marble}; border-radius: 8px; overflow: hidden;">
            <tr>
              <td style="padding: 34px 32px 30px;">
                <p style="margin: 0 0 18px; color: ${colors.aegeanDeep}; font-size: 12px; letter-spacing: 0.08em; text-transform: uppercase;">Apollonia Events</p>
                ${bodyHtml}
                <div style="height: 1px; background: ${colors.gold}; margin: 30px 0 18px;"></div>
                <p style="margin: 0; color: ${colors.inkSoft}; font-size: 12px; line-height: 1.6;">Apollonia Events &middot; By reservation only</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export function guestRequestReceived(reservation: ReservationEmailData) {
  return emailLayout(
    `${heading("We've received your request")}
    ${paragraph("Thank you for reaching out. Our team will review the details and confirm availability shortly.")}
    ${reservationDetails(reservation)}`,
    "We've received your Apollonia Events reservation request."
  );
}

export function guestReservationConfirmed(reservation: ReservationEmailData) {
  return emailLayout(
    `${heading("Your reservation is confirmed")}
    ${paragraph("We are pleased to confirm your reservation. We look forward to welcoming you.")}
    ${reservationDetails(reservation)}`,
    "Your Apollonia Events reservation is confirmed."
  );
}

export function guestUpcomingReminder(reservation: ReservationEmailData) {
  return emailLayout(
    `${heading("Your reservation is tomorrow")}
    ${paragraph("This is a brief reminder for your upcoming confirmed reservation.")}
    ${reservationDetails(reservation)}`,
    "A reminder for your upcoming Apollonia Events reservation."
  );
}

export function guestReservationDeclined(reservation: ReservationEmailData) {
  return emailLayout(
    `${heading("About your reservation request")}
    ${paragraph("Thank you for considering Apollonia Events. We are sorry that we cannot accommodate this date, and we would be glad to help with another option.")}
    ${reservationDetails(reservation)}`,
    "We cannot accommodate this Apollonia Events reservation date."
  );
}

export function adminNewRequest(reservation: ReservationEmailData) {
  return emailLayout(
    `${heading("New reservation request")}
    ${paragraph("A new reservation request was submitted through the website.")}
    ${adminDetails(reservation)}`,
    "A new Apollonia Events reservation request was submitted."
  );
}

export function adminUpcomingReminder(reservations: ReservationEmailData[]) {
  const list = reservations
    .map(
      (reservation) => `
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid ${colors.marble};">
            <div style="color: ${colors.ink}; font-size: 14px; font-weight: 700;">${escapeHtml(reservation.name)}</div>
            <div style="margin-top: 4px; color: ${colors.inkSoft}; font-size: 13px; line-height: 1.6;">
              ${escapeHtml(dateFormatter.format(reservation.date))} at ${escapeHtml(reservation.time)}
              <br>${escapeHtml(reservation.eventType)} for ${escapeHtml(reservation.guestCount)} guests
              <br>${escapeHtml(reservation.email)} &middot; ${escapeHtml(reservation.phone)}
            </div>
          </td>
        </tr>`
    )
    .join("");

  return emailLayout(
    `${heading("Upcoming reservations")}
    ${paragraph("Confirmed reservations are coming up in the next two days.")}
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse: collapse; margin-top: 22px;">
      <tbody>${list}</tbody>
    </table>`,
    "Upcoming confirmed Apollonia Events reservations."
  );
}
