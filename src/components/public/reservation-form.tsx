"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, startOfToday } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import {
  reservationSchema,
  timeSlots,
  type ReservationInput,
} from "@/lib/validations/reservation";
import { eventTypes } from "@/lib/content";
import { createReservation } from "@/server/reservations";
import { cn } from "@/lib/utils";

import { MeanderRule } from "@/components/public/meander-rule";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function Field({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string;
  htmlFor?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={htmlFor} className="text-ink-soft">
        {label}
      </Label>
      {children}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}

export function ReservationForm() {
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ReservationInput>({
    resolver: zodResolver(reservationSchema),
    defaultValues: {
      date: "",
      time: "" as ReservationInput["time"],
      eventType: "" as ReservationInput["eventType"],
      guestCount: "",
      name: "",
      phone: "",
      email: "",
      notes: "",
    },
  });

  async function onSubmit(values: ReservationInput) {
    setServerError(null);
    const result = await createReservation(values);
    if (result.ok) {
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setServerError(result.error);
    }
  }

  if (submitted) {
    return (
      <div className="rounded-2xl border border-marble-deep/50 bg-card p-10 text-center sm:p-14">
        <MeanderRule units={5} className="mx-auto mb-7 opacity-80" />
        <h2 className="text-3xl text-ink sm:text-4xl">Your request is received</h2>
        <p className="mx-auto mt-5 max-w-md text-pretty leading-relaxed text-ink-soft">
          Thank you. We have noted your date and will be in touch shortly to
          confirm availability and begin planning your occasion.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8" noValidate>
      <div className="grid gap-6 sm:grid-cols-2">
        {/* date */}
        <Field label="Date" error={errors.date?.message}>
          <Controller
            control={control}
            name="date"
            render={({ field }) => (
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className={cn(
                      "flex h-10 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-colors hover:border-gold/60",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    {field.value
                      ? format(new Date(`${field.value}T00:00:00`), "EEEE, d MMMM yyyy")
                      : "Choose a date"}
                    <CalendarIcon className="size-4 text-ink-soft" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={
                      field.value ? new Date(`${field.value}T00:00:00`) : undefined
                    }
                    onSelect={(d) =>
                      field.onChange(d ? format(d, "yyyy-MM-dd") : "")
                    }
                    disabled={{ before: startOfToday() }}
                    autoFocus
                  />
                </PopoverContent>
              </Popover>
            )}
          />
        </Field>

        {/* time */}
        <Field label="Time" error={errors.time?.message}>
          <Controller
            control={control}
            name="time"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose a time" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((slot) => (
                    <SelectItem key={slot.value} value={slot.value}>
                      {slot.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </Field>

        {/* occasion */}
        <Field label="Occasion" error={errors.eventType?.message}>
          <Controller
            control={control}
            name="eventType"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select an occasion" />
                </SelectTrigger>
                <SelectContent>
                  {eventTypes.map((e) => (
                    <SelectItem key={e.slug} value={e.title}>
                      {e.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </Field>

        {/* guests */}
        <Field label="Guests" htmlFor="guestCount" error={errors.guestCount?.message}>
          <Input
            id="guestCount"
            type="number"
            min={1}
            max={120}
            placeholder="Number of guests"
            {...register("guestCount")}
          />
        </Field>
      </div>

      <div className="hairline" />

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Full name" htmlFor="name" error={errors.name?.message}>
          <Input id="name" placeholder="Your name" {...register("name")} />
        </Field>
        <Field label="Phone" htmlFor="phone" error={errors.phone?.message}>
          <Input id="phone" type="tel" placeholder="Contact number" {...register("phone")} />
        </Field>
      </div>

      <Field label="Email" htmlFor="email" error={errors.email?.message}>
        <Input id="email" type="email" placeholder="you@email.com" {...register("email")} />
      </Field>

      <Field label="Notes" htmlFor="notes" error={errors.notes?.message}>
        <Textarea
          id="notes"
          rows={4}
          placeholder="Anything you would like us to know about your occasion."
          {...register("notes")}
        />
      </Field>

      {serverError && (
        <p className="rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {serverError}
        </p>
      )}

      <div className="flex flex-col items-center gap-4 pt-2 sm:flex-row sm:justify-between">
        <p className="text-xs text-ink-soft">
          A request, not a booking — we will confirm your date personally.
        </p>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-full bg-aegean px-9 py-3.5 text-sm font-medium tracking-wide text-ivory transition-colors hover:bg-aegean-deep disabled:opacity-60 sm:w-auto"
        >
          {isSubmitting ? "Sending…" : "Send reservation request"}
        </button>
      </div>
    </form>
  );
}
