"use client";

import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

import { eventTypes } from "@/lib/content";
import {
  manualReservationSchema,
  manualReservationStatusValues,
  type ManualReservationInput,
} from "@/lib/validations/manual-reservation";
import { timeSlots } from "@/lib/validations/reservation";
import { statusLabels } from "@/lib/admin/reservations";
import { createManualReservation } from "@/server/admin-reservations";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

function defaults(defaultDate?: string): ManualReservationInput {
  return {
    date: defaultDate ?? "",
    time: "" as ManualReservationInput["time"],
    eventType: "" as ManualReservationInput["eventType"],
    guestCount: "",
    name: "",
    phone: "",
    email: "",
    notes: "",
    status: "CONFIRMED",
  };
}

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
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  );
}

export function ManualReservationDialog({
  defaultDate,
  initialOpen = false,
  returnHref,
  triggerLabel = "New reservation",
  triggerClassName,
  showTrigger = true,
}: {
  defaultDate?: string;
  initialOpen?: boolean;
  returnHref?: string;
  triggerLabel?: string;
  triggerClassName?: string;
  showTrigger?: boolean;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(initialOpen);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ManualReservationInput>({
    resolver: zodResolver(manualReservationSchema),
    defaultValues: defaults(defaultDate),
  });

  useEffect(() => {
    setOpen(initialOpen);
  }, [initialOpen]);

  useEffect(() => {
    if (open) {
      setServerError(null);
      reset(defaults(defaultDate));
    }
  }, [defaultDate, open, reset]);

  function changeOpen(nextOpen: boolean) {
    setOpen(nextOpen);

    if (!nextOpen && returnHref) {
      router.replace(returnHref);
    }
  }

  async function onSubmit(values: ManualReservationInput) {
    setServerError(null);
    const result = await createManualReservation(values);

    if (result.ok) {
      reset(defaults(defaultDate));
      setOpen(false);

      if (returnHref) {
        router.replace(returnHref);
      }

      router.refresh();
      return;
    }

    setServerError(result.error);
  }

  return (
    <Dialog open={open} onOpenChange={changeOpen}>
      {showTrigger ? (
        <DialogTrigger asChild>
          <Button className={triggerClassName}>
            <Plus className="size-4" />
            {triggerLabel}
          </Button>
        </DialogTrigger>
      ) : null}
      <DialogContent className="max-h-[min(92vh,760px)] overflow-y-auto border border-marble-deep bg-[#fbf9f3] sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl font-medium text-ink">
            New reservation
          </DialogTitle>
          <DialogDescription>
            Add an admin-managed booking directly to the calendar.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Date" htmlFor="manual-date" error={errors.date?.message}>
              <Input id="manual-date" type="date" {...register("date")} />
            </Field>

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
                      {eventTypes.map((eventType) => (
                        <SelectItem key={eventType.slug} value={eventType.title}>
                          {eventType.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </Field>

            <Field
              label="Guests"
              htmlFor="manual-guest-count"
              error={errors.guestCount?.message}
            >
              <Input
                id="manual-guest-count"
                type="number"
                min={1}
                max={120}
                placeholder="Number of guests"
                {...register("guestCount")}
              />
            </Field>

            <Field label="Status" error={errors.status?.message}>
              <Controller
                control={control}
                name="status"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Choose a status" />
                    </SelectTrigger>
                    <SelectContent>
                      {manualReservationStatusValues.map((status) => (
                        <SelectItem key={status} value={status}>
                          {statusLabels[status]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </Field>
          </div>

          <div className="hairline" />

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Full name" htmlFor="manual-name" error={errors.name?.message}>
              <Input id="manual-name" placeholder="Guest name" {...register("name")} />
            </Field>
            <Field label="Phone" htmlFor="manual-phone" error={errors.phone?.message}>
              <Input
                id="manual-phone"
                type="tel"
                placeholder="Contact number"
                {...register("phone")}
              />
            </Field>
          </div>

          <Field label="Email" htmlFor="manual-email" error={errors.email?.message}>
            <Input
              id="manual-email"
              type="email"
              placeholder="guest@email.com"
              {...register("email")}
            />
          </Field>

          <Field label="Notes" htmlFor="manual-notes" error={errors.notes?.message}>
            <Textarea
              id="manual-notes"
              rows={4}
              placeholder="Internal notes or planning details."
              {...register("notes")}
            />
          </Field>

          {serverError ? (
            <p className="rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
              {serverError}
            </p>
          ) : null}

          <DialogFooter className="bg-marble/40">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create reservation"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
