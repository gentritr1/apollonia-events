import { z } from "zod";

export const manualEventTypes = [
  { slug: "weddings", title: "Weddings" },
  { slug: "private-dinners", title: "Private Dinners" },
  { slug: "celebrations", title: "Celebrations" },
  { slug: "corporate", title: "Corporate & Cultural" },
] as const;

// Half-hour start times 10:00–22:00 inclusive (25 options), matching the public
// reservation form. Labels are the plain "HH:MM" value.
function buildManualTimeSlots(): { value: string; label: string }[] {
  const slots: { value: string; label: string }[] = [];
  for (let minutes = 10 * 60; minutes <= 22 * 60; minutes += 30) {
    const value = `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(
      minutes % 60,
    ).padStart(2, "0")}`;
    slots.push({ value, label: value });
  }
  return slots;
}

export const manualTimeSlots = buildManualTimeSlots();

export const manualReservationStatusValues = [
  "PENDING",
  "CONFIRMED",
  "DECLINED",
  "CANCELLED",
] as const;

const manualEventTypeTitles = manualEventTypes.map((e) => e.title) as [
  string,
  ...string[],
];
const manualTimeValues = manualTimeSlots.map((t) => t.value) as [
  string,
  ...string[],
];

export const manualReservationSchema = z.object({
  date: z
    .string()
    .min(1, "Please choose a date.")
    .refine((v) => !Number.isNaN(Date.parse(v)), "Please choose a valid date.")
    .refine((v) => {
      const d = new Date(`${v}T00:00:00`);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return d >= today;
    }, "Please choose a date that is today or later."),
  time: z.enum(manualTimeValues, { message: "Please choose a time." }),
  eventType: z.enum(manualEventTypeTitles, {
    message: "Please choose an occasion.",
  }),
  guestCount: z
    .string()
    .trim()
    .min(1, "Please enter a guest count.")
    .regex(/^\d+$/, "Use a whole number.")
    .refine((v) => {
      const n = Number(v);
      return n >= 1 && n <= 60;
    }, "Between 1 and 60 guests."),
  name: z.string().trim().min(2, "Please share your name.").max(120),
  phone: z.string().trim().min(6, "Please share a contact number.").max(40),
  email: z.string().trim().email("Please enter a valid email."),
  notes: z
    .string()
    .trim()
    .max(2000, "Please keep notes under 2000 characters.")
    .optional(),
  status: z.enum(manualReservationStatusValues, {
    message: "Please choose a status.",
  }),
});

export type ManualReservationInput = z.infer<typeof manualReservationSchema>;
