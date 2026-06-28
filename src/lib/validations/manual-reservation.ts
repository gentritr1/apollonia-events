import { z } from "zod";

import { reservationSchema } from "@/lib/validations/reservation";

export const manualReservationStatusValues = [
  "PENDING",
  "CONFIRMED",
  "DECLINED",
  "CANCELLED",
] as const;

export const manualReservationSchema = reservationSchema.extend({
  status: z.enum(manualReservationStatusValues, {
    message: "Please choose a status.",
  }),
});

export type ManualReservationInput = z.infer<typeof manualReservationSchema>;
