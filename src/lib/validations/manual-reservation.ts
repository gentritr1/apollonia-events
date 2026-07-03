import { z } from "zod";

export const manualEventTypes = [
  { slug: "weddings", title: "Weddings" },
  { slug: "private-dinners", title: "Private Dinners" },
  { slug: "celebrations", title: "Celebrations" },
  { slug: "corporate", title: "Corporate & Cultural" },
] as const;

export const manualTimeSlots = [
  { value: "11:00", label: "Late morning · 11:00" },
  { value: "13:00", label: "Luncheon · 13:00" },
  { value: "16:00", label: "Afternoon · 16:00" },
  { value: "18:30", label: "Evening · 18:30" },
  { value: "20:00", label: "Dinner · 20:00" },
] as const;

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
      return n >= 1 && n <= 120;
    }, "Between 1 and 120 guests."),
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
