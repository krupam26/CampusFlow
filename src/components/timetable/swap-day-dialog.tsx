"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  ArrowLeftRight,
  Calendar,
  Check,
  Info,
  Trash2,
  X,
} from "lucide-react";

import { useCampusFlowStore } from "@/stores/campusflow-store";
import type { DayOfWeek, DaySwap } from "@/types/campusflow";
import { formatDateKey, getDayName } from "@/lib/schedule";

const days: DayOfWeek[] = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

type Props = {
  selectedDate?: string;
  onDateChange?: (date: string) => void;
  trigger?: React.ReactNode;
};

export function SwapDayDialog({
  selectedDate: initialDate,
  onDateChange,
  trigger,
}: Props) {
  const daySwaps = useCampusFlowStore((state) => state.daySwaps || []);
  const addDaySwap = useCampusFlowStore((state) => state.addDaySwap);
  const deleteDaySwap = useCampusFlowStore((state) => state.deleteDaySwap);
  const timetable = useCampusFlowStore((state) => state.timetable);

  const [open, setOpen] = useState(false);
  const [targetDate, setTargetDate] = useState(
    initialDate || formatDateKey(new Date())
  );
  const [sourceDay, setSourceDay] = useState<DayOfWeek>("Tuesday");
  const [note, setNote] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Keep targetDate in sync if parent selectedDate changes
  useEffect(() => {
    if (initialDate) {
      setTargetDate(initialDate);
    }
  }, [initialDate]);

  useEffect(() => {
    if (!open) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [open]);

  // Derived target date weekday
  const targetDayName = getDayName(new Date(`${targetDate}T12:00:00`));

  // Count how many classes are in source day
  const sourceDayClassCount = timetable.filter(
    (item) => item.day === sourceDay
  ).length;

  // Check if current target date already has a swap
  const existingSwapForDate = daySwaps.find(
    (swap) => swap.date === targetDate
  );

  function handleApplySwap(event: React.FormEvent) {
    event.preventDefault();
    if (!targetDate) return;

    const swap: DaySwap = {
      id: existingSwapForDate?.id || crypto.randomUUID(),
      date: targetDate,
      sourceDay,
      note: note.trim() || undefined,
    };

    addDaySwap(swap);
    setSuccessMessage(
      `Applied! ${targetDate} (${targetDayName}) will now follow ${sourceDay}'s schedule.`
    );

    if (onDateChange) {
      onDateChange(targetDate);
    }

    setTimeout(() => {
      setSuccessMessage("");
      setOpen(false);
    }, 1200);
  }

  function handleRemoveSwap(id: string) {
    deleteDaySwap(id);
  }

  const defaultButton = (
    <button
      type="button"
      onClick={() => setOpen(true)}
      className="pixel-border-subtle flex h-10 items-center justify-center gap-2 bg-card px-4 text-xs font-semibold transition-all hover:-translate-y-0.5 hover:bg-muted"
    >
      <ArrowLeftRight className="h-4 w-4 text-primary" />
      <span>SWAP DAY SCHEDULE</span>
    </button>
  );

  return (
    <>
      {trigger ? (
        <span onClick={() => setOpen(true)} className="contents cursor-pointer">
          {trigger}
        </span>
      ) : (
        defaultButton
      )}

      {open &&
        createPortal(
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) {
                setOpen(false);
              }
            }}
          >
            <div className="flex max-h-[92vh] w-full max-w-xl flex-col overflow-hidden pixel-border bg-background shadow-2xl">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-border bg-card px-5 py-4">
                <div>
                  <p className="pixel text-[11px] text-primary">
                    TIMETABLE // SCHEDULE SWAP
                  </p>
                  <h2 className="pixel-heading mt-1 text-xl">
                    SWAP DAY SCHEDULE
                  </h2>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Have lectures on a Saturday or following another day&apos;s
                    timetable? Apply that day&apos;s schedule for any specific date.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="flex h-9 w-9 items-center justify-center border border-border bg-muted transition-colors hover:bg-destructive/10 hover:text-destructive"
                  aria-label="Close swap dialog"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Form Content */}
              <div className="flex-1 overflow-y-auto p-5 space-y-6">
                <form onSubmit={handleApplySwap} className="space-y-4">
                  {/* Target Date Picker */}
                  <div>
                    <label className="block mb-1.5 text-[10px] font-semibold text-muted-foreground">
                      SELECT TARGET DATE
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        value={targetDate}
                        onChange={(e) => setTargetDate(e.target.value)}
                        required
                        className="h-10 w-full border border-input bg-background px-3 text-xs outline-none focus:border-primary focus:ring-1 focus:ring-primary/30"
                      />
                    </div>
                    <p className="mt-1 text-[11px] text-muted-foreground">
                      This date falls on a{" "}
                      <span className="font-semibold text-foreground">
                        {targetDayName}
                      </span>
                      .
                    </p>
                  </div>

                  {/* Which day's schedule to follow */}
                  <div>
                    <label className="block mb-1.5 text-[10px] font-semibold text-muted-foreground">
                      FOLLOW TIMETABLE OF
                    </label>
                    <select
                      value={sourceDay}
                      onChange={(e) =>
                        setSourceDay(e.target.value as DayOfWeek)
                      }
                      className="h-10 w-full border border-input bg-background px-3 text-xs outline-none focus:border-primary focus:ring-1 focus:ring-primary/30"
                    >
                      {days.map((day) => (
                        <option key={day} value={day}>
                          {day} ({timetable.filter((i) => i.day === day).length} classes configured)
                        </option>
                      ))}
                    </select>
                    <p className="mt-1 text-[11px] text-muted-foreground">
                      Classes configured for {sourceDay}:{" "}
                      <span className="font-semibold text-primary">
                        {sourceDayClassCount} classes
                      </span>
                    </p>
                  </div>

                  {/* Optional Note / Reason */}
                  <div>
                    <label className="block mb-1.5 text-[10px] font-semibold text-muted-foreground">
                      REASON / NOTE (OPTIONAL)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Compensatory schedule for Tuesday holiday"
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      className="h-10 w-full border border-input bg-background px-3 text-xs outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 placeholder:text-muted-foreground/60"
                    />
                  </div>

                  {existingSwapForDate && (
                    <div className="border border-warning/40 bg-warning/10 p-3 text-xs text-warning-foreground flex items-start gap-2">
                      <Info className="h-4 w-4 shrink-0 mt-0.5 text-warning" />
                      <div>
                        <span className="font-semibold">Notice:</span> A swap is
                        already set for this date (following{" "}
                        {existingSwapForDate.sourceDay}). Saving will update it
                        to {sourceDay}.
                      </div>
                    </div>
                  )}

                  {successMessage && (
                    <div className="border border-emerald-500/40 bg-emerald-500/10 p-3 text-xs text-emerald-400 flex items-center gap-2">
                      <Check className="h-4 w-4 shrink-0" />
                      <span>{successMessage}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="pixel-button pixel-border flex h-10 w-full items-center justify-center gap-2 bg-primary px-5 text-xs font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5"
                  >
                    <ArrowLeftRight className="h-4 w-4" />
                    APPLY DAY SCHEDULE
                  </button>
                </form>

                {/* List of active day swaps */}
                <div className="border-t border-border pt-4">
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="pixel text-xs font-semibold text-muted-foreground">
                      SCHEDULED DAY SWAPS ({daySwaps.length})
                    </h3>
                  </div>

                  {daySwaps.length === 0 ? (
                    <p className="text-[11px] text-muted-foreground">
                      No day swaps currently scheduled.
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {daySwaps.map((swap) => {
                        const originalDay = getDayName(
                          new Date(`${swap.date}T12:00:00`)
                        );
                        return (
                          <div
                            key={swap.id}
                            className="pixel-border-subtle flex items-center justify-between bg-card p-3 text-xs"
                          >
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <Calendar className="h-3.5 w-3.5 text-primary shrink-0" />
                                <span className="font-semibold">
                                  {swap.date} ({originalDay})
                                </span>
                                <span className="text-muted-foreground">→</span>
                                <span className="bg-primary/10 text-primary font-semibold px-2 py-0.5 text-[10px]">
                                  {swap.sourceDay} TIMETABLE
                                </span>
                              </div>
                              {swap.note && (
                                <p className="mt-1 text-[11px] text-muted-foreground truncate">
                                  {swap.note}
                                </p>
                              )}
                            </div>

                            <button
                              type="button"
                              onClick={() => handleRemoveSwap(swap.id)}
                              className="ml-3 flex h-7 w-7 shrink-0 items-center justify-center text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                              title="Remove day swap"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-end border-t border-border bg-card px-5 py-3">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="pixel-border-subtle h-9 bg-muted px-4 text-xs font-semibold transition-all hover:-translate-y-0.5"
                >
                  CLOSE
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
