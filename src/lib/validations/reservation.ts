import { z } from "zod";

import { eventTypes, reserveCopy } from "@/lib/content";

/** Time slots offered on the reservation form. */
export const timeSlots = reserveCopy.timeSlots;

const eventTypeTitles = eventTypes.map((e) => e.title) as [string, ...string[]];
const timeValues = timeSlots.map((t) => t.value) as [string, ...string[]];

export const reservationSchema = z.object({
  // Accept an ISO date string (yyyy-mm-dd) and ensure it is today or later.
  date: z
    .string()
    .min(1, reserveCopy.validation.dateRequired)
    .refine(
      (v) => !Number.isNaN(Date.parse(v)),
      reserveCopy.validation.dateInvalid
    )
    .refine((v) => {
      const d = new Date(`${v}T00:00:00`);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return d >= today;
    }, reserveCopy.validation.dateFuture),
  time: z.enum(timeValues, { message: reserveCopy.validation.timeRequired }),
  eventType: z.enum(eventTypeTitles, {
    message: reserveCopy.validation.eventRequired,
  }),
  // Kept as a numeric string so the form's input and output types stay identical
  // (no coercion divergence). The server action converts it to a number.
  guestCount: z
    .string()
    .trim()
    .min(1, reserveCopy.validation.guestRequired)
    .regex(/^\d+$/, reserveCopy.validation.guestWhole)
    .refine((v) => {
      const n = Number(v);
      return n >= 1 && n <= 120;
    }, reserveCopy.validation.guestRange),
  name: z.string().trim().min(2, reserveCopy.validation.nameRequired).max(120),
  phone: z.string().trim().min(6, reserveCopy.validation.phoneRequired).max(40),
  email: z.string().trim().email(reserveCopy.validation.emailInvalid),
  notes: z
    .string()
    .trim()
    .max(2000, reserveCopy.validation.notesMax)
    .optional(),
});

export type ReservationInput = z.infer<typeof reservationSchema>;
