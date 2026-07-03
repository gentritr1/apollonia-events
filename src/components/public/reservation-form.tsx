"use client";

import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import {
  Controller,
  useForm,
  useWatch,
  type FieldErrors,
  type FieldPath,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, startOfToday } from "date-fns";
import { sq } from "date-fns/locale";
import { ArrowLeft, ArrowRight, Calendar as CalendarIcon } from "lucide-react";

import {
  reservationSchema,
  timeSlots,
  type ReservationInput,
} from "@/lib/validations/reservation";
import { contactCopy, eventTypes, reserveCopy } from "@/lib/content";
import { createReservation } from "@/server/reservations";
import { cn } from "@/lib/utils";

import { ReservationInvitationPreview } from "@/components/public/reservation-invitation-preview";
import { TempleLine } from "@/components/public/temple-line";
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

type ReservationStep = "day" | "contact";

const dayDetailFields = [
  "date",
  "time",
  "eventType",
  "guestCount",
] satisfies Array<FieldPath<ReservationInput>>;

const stepLabels: Record<ReservationStep, string> = {
  day: reserveCopy.form.steps.day,
  contact: reserveCopy.form.steps.contact,
};

const isoDatePattern = /^\d{4}-\d{2}-\d{2}$/;

function isAllowedRequestedDate(date: string, confirmedDates: string[]) {
  if (!isoDatePattern.test(date) || confirmedDates.includes(date)) {
    return false;
  }

  const parsedDate = new Date(`${date}T00:00:00`);

  if (Number.isNaN(parsedDate.getTime())) {
    return false;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return parsedDate >= today;
}

function Field({
  label,
  htmlFor,
  error,
  children,
  className,
}: {
  label: string;
  htmlFor?: string;
  error?: string;
  children: ReactNode;
  className?: string;
}) {
  const errorId = htmlFor ? `${htmlFor}-error` : undefined;

  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={htmlFor} className="text-sm font-medium text-ink">
        {label}
      </Label>
      {children}
      {error && (
        <p id={errorId} role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}

function StepProgress({ step }: { step: ReservationStep }) {
  const activeIndex = step === "day" ? 0 : 1;
  const steps: Array<{ id: ReservationStep; marker: string }> = [
    { id: "day", marker: "Α΄" },
    { id: "contact", marker: "Β΄" },
  ];

  return (
    <ol
      aria-label={reserveCopy.form.progressLabel}
      className="relative mb-9 grid grid-cols-2 gap-4 before:absolute before:top-4 before:right-0 before:left-0 before:h-px before:bg-marble-deep"
    >
      {steps.map((item, index) => {
        const isActive = step === item.id;
        const isComplete = index < activeIndex;

        return (
          <li
            key={item.id}
            aria-current={isActive ? "step" : undefined}
            className={cn(
              "relative flex flex-col gap-2",
              index === 1 && "items-end text-right"
            )}
          >
            <span
              className={cn(
                "z-10 flex size-8 items-center justify-center rounded-full border bg-card font-serif text-lg transition-colors",
                isActive
                  ? "border-aegean bg-aegean text-ivory"
                  : isComplete
                    ? "border-gold bg-gold text-aegean-deep"
                    : "border-marble-deep text-ink-soft"
              )}
            >
              {item.marker}
            </span>
            <span
              className={cn(
                "text-xs font-medium tracking-[0.16em] uppercase",
                isActive ? "text-aegean-deep" : "text-ink-soft"
              )}
            >
              {stepLabels[item.id]}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

function dateButtonLabel(value: string | undefined) {
  if (!value) return reserveCopy.form.dateFallback;
  return `e ${format(new Date(`${value}T00:00:00`), "EEEE, d MMMM yyyy", {
    locale: sq,
  }).toLocaleLowerCase("sq-AL")}`;
}

export function ReservationForm({
  confirmedDates = [],
  requestedDate,
}: {
  confirmedDates?: string[];
  requestedDate?: string;
}) {
  const [step, setStep] = useState<ReservationStep>("day");
  const formRef = useRef<HTMLFormElement>(null);
  const appliedRequestedDate = useRef<string | null>(null);

  const disabledDates = [
    { before: startOfToday() },
    ...confirmedDates.map((dateStr) => new Date(`${dateStr}T00:00:00`)),
  ];

  const [submittedValues, setSubmittedValues] =
    useState<ReservationInput | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    trigger,
    clearErrors,
    setValue,
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

  const values = useWatch({ control });
  const selectedTimeLabel = timeSlots.find(
    (slot) => slot.value === values.time
  )?.label;

  useEffect(() => {
    if (
      !requestedDate ||
      appliedRequestedDate.current === requestedDate ||
      !isAllowedRequestedDate(requestedDate, confirmedDates)
    ) {
      return;
    }

    appliedRequestedDate.current = requestedDate;
    setValue("date", requestedDate, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
    clearErrors("date");
    setStep("day");

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    formRef.current?.scrollIntoView({
      block: "start",
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  }, [clearErrors, confirmedDates, requestedDate, setValue]);

  async function onSubmit(values: ReservationInput) {
    setServerError(null);
    const result = await createReservation(values);

    if (result.ok) {
      setSubmittedValues(values);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setServerError(result.error);
    }
  }

  async function goToContactStep() {
    setServerError(null);
    const valid = await trigger(dayDetailFields, { shouldFocus: true });

    if (valid) {
      clearErrors(["name", "phone", "email", "notes"]);
      setStep("contact");
    }
  }

  function handleInvalidSubmit(formErrors: FieldErrors<ReservationInput>) {
    const hasDayError = dayDetailFields.some((field) => formErrors[field]);

    if (hasDayError) {
      setStep("day");
    }
  }

  function handleFormSubmit(event: FormEvent<HTMLFormElement>) {
    if (step === "day") {
      event.preventDefault();
      void goToContactStep();
      return;
    }

    void handleSubmit(onSubmit, handleInvalidSubmit)(event);
  }

  if (submittedValues) {
    const submittedTimeLabel = timeSlots.find(
      (slot) => slot.value === submittedValues.time
    )?.label;

    return (
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_24rem] lg:items-start">
        <div className="rounded-xl border border-marble-deep bg-card p-7 sm:p-10">
          <p className="overline mb-5">{reserveCopy.form.successOverline}</p>
          <h2 className="text-balance text-4xl text-ink sm:text-5xl">
            {reserveCopy.form.successTitle}
          </h2>
          <p className="mt-6 max-w-xl text-pretty leading-relaxed text-ink-soft">
            {reserveCopy.form.successDescription}
          </p>
          <p className="mt-6 text-sm leading-6 text-ink-soft">
            {reserveCopy.form.successNotice}
          </p>
          <a
            href={contactCopy.whatsappHref}
            className="link-arrow mt-7 text-sm tracking-wide text-aegean transition-colors hover:text-aegean-deep"
            target="_blank"
            rel="noreferrer"
          >
            {contactCopy.whatsappLabel}
          </a>
        </div>

        <ReservationInvitationPreview
          state="received"
          date={submittedValues.date}
          timeLabel={submittedTimeLabel}
          occasion={submittedValues.eventType}
          guestCount={submittedValues.guestCount}
          name={submittedValues.name}
          phone={submittedValues.phone}
          email={submittedValues.email}
          notes={submittedValues.notes}
        />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_24rem] lg:items-start">
      <form
        ref={formRef}
        onSubmit={handleFormSubmit}
        className="rounded-xl border border-marble-deep bg-card p-5 sm:p-8"
        noValidate
      >
        <StepProgress step={step} />

        {step === "day" ? (
          <fieldset className="space-y-7">
            <legend className="sr-only">{reserveCopy.form.dayLegend}</legend>

            <div>
              <h2 className="text-3xl text-ink">{reserveCopy.form.dayTitle}</h2>
              <p className="mt-3 max-w-xl text-sm leading-6 text-ink-soft">
                {reserveCopy.form.dayDescription}
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field
                label={reserveCopy.form.labels.date}
                htmlFor="date"
                error={errors.date?.message}
              >
                <Controller
                  control={control}
                  name="date"
                  render={({ field }) => (
                    <Popover>
                      <PopoverTrigger asChild>
                        <button
                          id="date"
                          type="button"
                          aria-describedby={errors.date ? "date-error" : undefined}
                          className={cn(
                            "flex h-11 w-full items-center justify-between rounded-lg border border-input bg-ivory/60 px-3 py-2 text-left text-sm transition-colors hover:border-gold/60 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          <span className="truncate">
                            {dateButtonLabel(field.value)}
                          </span>
                          <CalendarIcon className="ml-3 size-4 shrink-0 text-ink-soft" />
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 overflow-hidden" align="start">
                        <Calendar
                          mode="single"
                          locale={sq}
                          selected={
                            field.value
                              ? new Date(`${field.value}T00:00:00`)
                              : undefined
                          }
                          onSelect={(date) =>
                            field.onChange(date ? format(date, "yyyy-MM-dd") : "")
                          }
                          disabled={disabledDates}
                          autoFocus
                        />
                        <div className="border-t border-marble-deep bg-marble/20 px-4 py-2.5 text-center">
                          <p className="text-[0.68rem] font-semibold tracking-[0.16em] text-ink-soft uppercase">
                            {reserveCopy.form.reservedDates}
                          </p>
                        </div>
                      </PopoverContent>
                    </Popover>
                  )}
                />
              </Field>

              <Field
                label={reserveCopy.form.labels.time}
                htmlFor="time"
                error={errors.time?.message}
              >
                <Controller
                  control={control}
                  name="time"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger
                        id="time"
                        aria-invalid={Boolean(errors.time)}
                        aria-describedby={errors.time ? "time-error" : undefined}
                        className="h-11 w-full bg-ivory/60 px-3"
                      >
                        <SelectValue placeholder={reserveCopy.form.timeFallback} />
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
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field
                label={reserveCopy.form.labels.occasion}
                htmlFor="eventType"
                error={errors.eventType?.message}
              >
                <Controller
                  control={control}
                  name="eventType"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger
                        id="eventType"
                        aria-invalid={Boolean(errors.eventType)}
                        aria-describedby={
                          errors.eventType ? "eventType-error" : undefined
                        }
                        className="h-11 w-full bg-ivory/60 px-3"
                      >
                        <SelectValue placeholder={reserveCopy.form.eventFallback} />
                      </SelectTrigger>
                      <SelectContent>
                        {eventTypes.map((event) => (
                          <SelectItem key={event.slug} value={event.title}>
                            {event.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </Field>

              <Field
                label={reserveCopy.form.labels.guests}
                htmlFor="guestCount"
                error={errors.guestCount?.message}
              >
                <Input
                  id="guestCount"
                  type="number"
                  min={1}
                  max={120}
                  placeholder={reserveCopy.form.guestFallback}
                  aria-invalid={Boolean(errors.guestCount)}
                  aria-describedby={
                    errors.guestCount ? "guestCount-error" : undefined
                  }
                  className="h-11 bg-ivory/60 px-3"
                  {...register("guestCount")}
                />
              </Field>
            </div>
          </fieldset>
        ) : (
          <fieldset className="space-y-7">
            <legend className="sr-only">{reserveCopy.form.contactLegend}</legend>

            <div>
              <h2 className="text-3xl text-ink">{reserveCopy.form.contactTitle}</h2>
              <p className="mt-3 max-w-xl text-sm leading-6 text-ink-soft">
                {reserveCopy.form.contactDescription}
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field
                label={reserveCopy.form.labels.name}
                htmlFor="name"
                error={errors.name?.message}
              >
                <Input
                  id="name"
                  placeholder={reserveCopy.form.placeholders.name}
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={errors.name ? "name-error" : undefined}
                  className="h-11 bg-ivory/60 px-3"
                  {...register("name")}
                />
              </Field>

              <Field
                label={reserveCopy.form.labels.phone}
                htmlFor="phone"
                error={errors.phone?.message}
              >
                <Input
                  id="phone"
                  type="tel"
                  placeholder={reserveCopy.form.placeholders.phone}
                  aria-invalid={Boolean(errors.phone)}
                  aria-describedby={errors.phone ? "phone-error" : undefined}
                  className="h-11 bg-ivory/60 px-3"
                  {...register("phone")}
                />
              </Field>
            </div>

            <Field
              label={reserveCopy.form.labels.email}
              htmlFor="email"
              error={errors.email?.message}
            >
              <Input
                id="email"
                type="email"
                placeholder={reserveCopy.form.placeholders.email}
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? "email-error" : undefined}
                className="h-11 bg-ivory/60 px-3"
                {...register("email")}
              />
            </Field>

            <Field
              label={reserveCopy.form.labels.notes}
              htmlFor="notes"
              error={errors.notes?.message}
            >
              <Textarea
                id="notes"
                rows={5}
                placeholder={reserveCopy.form.placeholders.notes}
                aria-invalid={Boolean(errors.notes)}
                aria-describedby={errors.notes ? "notes-error" : undefined}
                className="min-h-32 bg-ivory/60 px-3 py-3"
                {...register("notes")}
              />
            </Field>
          </fieldset>
        )}

        {serverError && (
          <p className="mt-7 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
            {serverError}
          </p>
        )}

        <div className="mt-8 flex flex-col gap-4 border-t border-marble-deep pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs leading-5 text-ink-soft">
            {reserveCopy.form.requestNotice}
          </p>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center">
            {step === "contact" ? (
              <button
                type="button"
                onClick={() => {
                  setServerError(null);
                  setStep("day");
                }}
                disabled={isSubmitting}
                className="btn btn-quiet btn-sm"
              >
                <ArrowLeft className="size-4" />
                {reserveCopy.form.back}
              </button>
            ) : null}

            {step === "day" ? (
              <button
                type="button"
                onClick={() => void goToContactStep()}
                disabled={isSubmitting}
                className="btn btn-primary btn-sm"
              >
                {reserveCopy.form.continue}
                <ArrowRight className="size-4" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary btn-sm"
              >
                {isSubmitting ? (
                  <>
                    <TempleLine
                      animate="draw"
                      loop
                      className="h-10 w-16 text-gold-soft"
                    />
                    {reserveCopy.form.sending}
                  </>
                ) : (
                  reserveCopy.form.submit
                )}
              </button>
            )}
          </div>
        </div>
      </form>

      <ReservationInvitationPreview
        date={values.date}
        timeLabel={selectedTimeLabel}
        occasion={values.eventType}
        guestCount={values.guestCount}
        name={values.name}
        phone={values.phone}
        email={values.email}
        notes={values.notes}
        className="lg:sticky lg:top-24"
      />
    </div>
  );
}
