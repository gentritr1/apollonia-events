"use client";

import { cn } from "@/lib/utils";
import { reserveCopy } from "@/lib/content";

const { timeGroups, timePicker, timeSlots } = reserveCopy;

/**
 * Replaces a 25-item scrolling dropdown with every slot visible at once,
 * grouped into the three movements of the day the home page already tells.
 *
 * Slots already spoken for on the chosen date are disabled rather than hidden:
 * a gap in a grid reads as a rendering bug, whereas a struck-through chip says
 * "taken" — and the user learns the venue is busy that day, which a missing
 * item never communicates.
 */
export function TimeSlotPicker({
  value,
  onChange,
  taken = [],
  disabled = false,
  loading = false,
  hasDate = true,
  invalid = false,
  describedBy,
}: {
  value?: string;
  onChange: (value: string) => void;
  taken?: string[];
  disabled?: boolean;
  loading?: boolean;
  hasDate?: boolean;
  invalid?: boolean;
  describedBy?: string;
}) {
  const takenSet = new Set(taken);

  return (
    <div
      role="radiogroup"
      aria-label={timePicker.legend}
      aria-invalid={invalid || undefined}
      aria-describedby={describedBy}
      aria-busy={loading || undefined}
      className={cn("space-y-5", disabled && "pointer-events-none opacity-60")}
    >
      {!hasDate ? (
        <p className="text-xs leading-relaxed text-ink-soft">
          {timePicker.pickDateFirst}
        </p>
      ) : loading ? (
        <p className="text-xs leading-relaxed text-ink-soft">
          {timePicker.loading}
        </p>
      ) : null}

      {timeGroups.map((group) => {
        // "HH:MM" sorts lexicographically, so a plain range filter is correct
        // and needs no date parsing.
        const groupSlots = timeSlots.filter(
          (slot) => slot.value >= group.from && slot.value <= group.to,
        );

        if (groupSlots.length === 0) {
          return null;
        }

        return (
          <fieldset key={group.id} className="border-0 p-0">
            <legend className="mb-2 flex w-full items-baseline justify-between gap-3">
              <span className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-gold-text">
                {group.label}
              </span>
              <span className="text-[0.68rem] text-ink-soft">
                {group.from} – {group.to}
              </span>
            </legend>

            <div className="flex flex-wrap gap-2">
              {groupSlots.map((slot) => {
                const isTaken = takenSet.has(slot.value);
                const isSelected = value === slot.value;

                return (
                  <button
                    key={slot.value}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    disabled={isTaken || disabled}
                    // Screen readers get the reason, not just a dead control.
                    aria-label={
                      isTaken
                        ? `${slot.label} — ${timePicker.taken}`
                        : slot.label
                    }
                    title={isTaken ? timePicker.takenHint : undefined}
                    onClick={() => onChange(slot.value)}
                    className={cn(
                      "inline-flex h-11 min-w-[4.25rem] items-center justify-center rounded-full px-4",
                      "font-serif text-base tabular-nums transition-colors duration-200",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60",
                      isSelected
                        ? "bg-aegean text-ivory ring-1 ring-aegean-deep"
                        : isTaken
                          ? "cursor-not-allowed bg-marble/60 text-ink-soft/55 line-through ring-1 ring-marble-deep/70"
                          : "bg-ivory/70 text-ink ring-1 ring-marble-deep hover:ring-gold",
                    )}
                  >
                    {slot.label}
                  </button>
                );
              })}
            </div>
          </fieldset>
        );
      })}
    </div>
  );
}
