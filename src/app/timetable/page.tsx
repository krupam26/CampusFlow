"use client";

import { UploadTimetableDialog } from "@/components/timetable/upload-timetable-dialog";
import { SwapDayDialog } from "@/components/timetable/swap-day-dialog";
import { useMemo, useState } from "react";
import {
  CalendarDays,
  Clock3,
  MapPin,
  Pencil,
  Plus,
  Trash2,
  AlertTriangle,
  ArrowLeftRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { AddClassDialog } from "@/components/timetable/add-class-dialog";
import { AddOverrideDialog } from "@/components/timetable/add-override-dialog";
import { AppShell } from "@/components/layout/app-shell";
import { useCampusFlowStore } from "@/stores/campusflow-store";

import type {
  ClassItem,
  DayOfWeek,
} from "@/types/campusflow";

const days: DayOfWeek[] = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

function getDayName(date: Date): DayOfWeek | null {
  const day = date.toLocaleDateString("en-US", {
    weekday: "long",
  });

  if (day === "Sunday") {
    return null;
  }

  return day as DayOfWeek;
}

function formatDateKey(date: Date | string) {
  const value =
    typeof date === "string" ? new Date(`${date}T12:00:00`) : date;

  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getToday() {
  const date = new Date();

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export default function TimetablePage() {
  const timetable = useCampusFlowStore(
    (state) => state.timetable
  );

  const overrides = useCampusFlowStore(
    (state) => state.overrides
  );

  const daySwaps = useCampusFlowStore(
    (state) => state.daySwaps || []
  );

  const deleteClass = useCampusFlowStore(
    (state) => state.deleteClass
  );

  const deleteDaySwap = useCampusFlowStore(
    (state) => state.deleteDaySwap
  );

  const [selectedDate, setSelectedDate] = useState(
    getToday()
  );

  const selectedDay = getDayName(
    new Date(`${selectedDate}T12:00:00`)
  );

  const activeSwap = daySwaps.find(
    (swap) => swap.date === selectedDate
  );

  const effectiveDay = activeSwap
    ? activeSwap.sourceDay
    : selectedDay;

  const normalClasses = useMemo(() => {
    if (!effectiveDay) {
      return [];
    }

    return timetable
      .filter((item) => item.day === effectiveDay)
      .sort((a, b) =>
        a.startTime.localeCompare(b.startTime)
      );
  }, [timetable, effectiveDay]);

  const dateOverrides = useMemo(() => {
    return overrides.filter(
      (override) => override.date === selectedDate
    );
  }, [overrides, selectedDate]);

  const effectiveClasses = useMemo(() => {
    if (!selectedDay) {
      return [];
    }

    const result: ClassItem[] = normalClasses.map(
      (classItem) => {
        const override = dateOverrides.find(
          (item) =>
            item.classId === classItem.id
        );

        if (!override) {
          return classItem;
        }

        if (override.action === "cancelled") {
          return {
            ...classItem,
            id: `${classItem.id}-cancelled`,
          };
        }

        return {
          ...classItem,
          subject: override.subject,
          code: override.code,
          faculty: override.faculty,
          room: override.room,
          startTime: override.startTime,
          endTime: override.endTime,
          type: override.type,
        };
      }
    );

    const addedClasses: ClassItem[] =
      dateOverrides
        .filter(
          (override) =>
            override.action === "added"
        )
        .map((override) => ({
          id: `override-${override.id}`,
          subject: override.subject,
          code: override.code,
          faculty: override.faculty,
          room: override.room,
          day: selectedDay,
          startTime: override.startTime,
          endTime: override.endTime,
          type: override.type,
        }));

    return [...result, ...addedClasses].sort(
      (a, b) =>
        a.startTime.localeCompare(b.startTime)
    );
  }, [
    normalClasses,
    dateOverrides,
    selectedDay,
  ]);

  return (
    <AppShell>
      <main className="min-h-screen p-5 md:p-8">
        <div className="mx-auto max-w-7xl space-y-6">

          {/* HEADER */}
          <section className="pixel-border rounded-xl bg-card p-6">
            <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">

              <div>
                <div className="mb-2 flex items-center gap-2 text-sm font-bold text-primary">
                  <CalendarDays className="h-4 w-4" />
                  ACADEMIC SCHEDULE
                </div>

                <h1 className="pixel-heading text-3xl md:text-4xl">
                  TIMETABLE
                </h1>

                <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                  Your weekly classes, labs and lectures in one place.
                </p>
              </div>

              <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-end">

                {/* LEFT: VIEW DATE & THIS WEEK BOXES */}
                <div className="flex items-center gap-3">
                  {/* VIEW DATE */}
                  <div className="pixel-border-subtle rounded-lg bg-muted px-4 py-2.5">
                    <label className="pixel mb-1 block text-[10px] text-muted-foreground">
                      VIEW DATE
                    </label>

                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(event) =>
                        setSelectedDate(
                          event.target.value
                        )
                      }
                      className="h-9 rounded-md border border-input bg-background px-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  {/* THIS WEEK COUNT */}
                  <div className="pixel-border-subtle rounded-lg bg-muted px-4 py-2.5 min-w-[110px]">
                    <p className="pixel text-xs text-muted-foreground">
                      THIS WEEK
                    </p>

                    <p className="mt-1 font-bold text-base">
                      {timetable.length} CLASSES
                    </p>
                  </div>
                </div>

                {/* RIGHT: ACTION BUTTONS (SWAP DAY & UPLOAD TIMETABLE ABOVE ADD CLASS) */}
                <div className="flex flex-col gap-2">
                  {/* Top row: Swap Day + Upload Timetable */}
                  <div className="flex flex-wrap items-center gap-2">
                    <SwapDayDialog
                      selectedDate={selectedDate}
                      onDateChange={setSelectedDate}
                    />
                    <UploadTimetableDialog
                      onImportSuccess={(firstDay) => {
                        const current = new Date(`${selectedDate}T12:00:00`);
                        const target = days.indexOf(firstDay);
                        const monday = new Date(current);
                        const currentDay = monday.getDay();
                        const diff = currentDay === 0 ? -6 : 1 - currentDay;
                        monday.setDate(monday.getDate() + diff);
                        monday.setDate(monday.getDate() + (target >= 0 ? target : 0));
                        setSelectedDate(formatDateKey(monday));
                      }}
                    />
                  </div>

                  {/* Below: Add Class button */}
                  <div className="w-full">
                    <AddClassDialog
                      trigger={
                        <Button className="pixel-button h-10 w-full gap-2 font-semibold">
                          <Plus className="h-4 w-4" />
                          ADD CLASS
                        </Button>
                      }
                    />
                  </div>
                </div>

              </div>
            </div>
          </section>

          {/* ACTIVE DAY SWAP BANNER */}
          {activeSwap && (
            <div className="pixel-border-subtle flex flex-col gap-3 rounded-lg border border-primary/40 bg-primary/10 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3 text-xs">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-primary text-primary-foreground">
                  <ArrowLeftRight className="h-4 w-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-primary">DAY SWAP ACTIVE</span>
                    <span className="rounded bg-primary/20 px-2 py-0.5 text-[10px] font-semibold text-primary">
                      FOLLOWING {activeSwap.sourceDay.toUpperCase()}
                    </span>
                  </div>
                  <p className="mt-0.5 text-foreground">
                    Showing <strong>{activeSwap.sourceDay}&apos;s</strong> timetable for this {selectedDay} ({selectedDate}).
                  </p>
                  {activeSwap.note && (
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      Note: {activeSwap.note}
                    </p>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={() => deleteDaySwap(activeSwap.id)}
                className="pixel-border-subtle shrink-0 rounded bg-card px-3 py-1.5 text-xs font-semibold text-destructive transition-all hover:bg-destructive/10"
              >
                RESTORE REGULAR SCHEDULE
              </button>
            </div>
          )}

          {/* DATE INFO */}
          <div className="flex flex-wrap items-center gap-3">

            {selectedDay ? (
              <span className="pixel rounded bg-primary px-3 py-1 text-xs text-primary-foreground">
                {selectedDay.toUpperCase()}
              </span>
            ) : (
              <span className="pixel rounded bg-muted px-3 py-1 text-xs text-muted-foreground">
                SUNDAY
              </span>
            )}

            <span className="text-sm text-muted-foreground">
              {formatDateKey(selectedDate)}
            </span>

            {activeSwap && (
              <span className="pixel-border-subtle flex items-center gap-1.5 rounded-full bg-primary/20 px-3 py-1 text-xs font-semibold text-primary">
                <ArrowLeftRight className="h-3 w-3" />
                SWAPPED TO {activeSwap.sourceDay.toUpperCase()}
              </span>
            )}

            {dateOverrides.length > 0 && (
              <span className="pixel-border-subtle flex items-center gap-2 rounded-full bg-warning/15 px-3 py-1 text-xs font-semibold text-warning-foreground">
                <AlertTriangle className="h-3.5 w-3.5" />

                {dateOverrides.length} SCHEDULE CHANGE
                {dateOverrides.length > 1 ? "S" : ""}
              </span>
            )}
          </div>

          {/* DAY SELECTOR */}
          <section className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-6">
            {days.map((day) => {
              const active = selectedDay === day;

              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => {
                    const current =
                      new Date(
                        `${selectedDate}T12:00:00`
                      );

                    const target =
                      days.indexOf(day);

                    const monday =
                      new Date(current);

                    const currentDay =
                      monday.getDay();

                    const diff =
                      currentDay === 0
                        ? -6
                        : 1 - currentDay;

                    monday.setDate(
                      monday.getDate() + diff
                    );

                    monday.setDate(
                      monday.getDate() + target
                    );

                    setSelectedDate(
                      formatDateKey(monday)
                    );
                  }}
                  className={[
                    "pixel-button pixel-border rounded-lg px-3 py-3 text-left",
                    "transition-all",
                    active
                      ? "bg-primary text-primary-foreground"
                      : "bg-card hover:bg-muted",
                  ].join(" ")}
                >
                  <div className="flex items-center justify-between">
                    <p className="pixel text-xs">
                      {day.slice(0, 3).toUpperCase()}
                    </p>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                        active
                          ? "bg-primary-foreground/20 text-primary-foreground"
                          : "bg-muted-foreground/15 text-muted-foreground"
                      }`}
                    >
                      {timetable.filter((c) => c.day === day).length}
                    </span>
                  </div>

                  <p className="mt-1 text-xs font-semibold">
                    {day}
                  </p>
                </button>
              );
            })}
          </section>

          {/* SUNDAY MESSAGE */}
          {!selectedDay && (
            <section className="pixel-border rounded-xl bg-card p-10 text-center">
              <CalendarDays className="mx-auto h-10 w-10 text-muted-foreground" />

              <h2 className="pixel-heading mt-4 text-lg">
                SUNDAY
              </h2>

              <p className="mt-2 text-sm text-muted-foreground">
                No regular timetable classes are scheduled for Sunday.
              </p>
            </section>
          )}

          {/* SCHEDULE CHANGES */}
          {dateOverrides.length > 0 && (
            <section className="pixel-border rounded-xl bg-primary/5 p-5">

              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15 text-primary">
                  <AlertTriangle className="h-4 w-4" />
                </div>

                <div>
                  <h2 className="pixel-heading text-lg">
                    SCHEDULE CHANGED
                  </h2>

                  <p className="text-xs text-muted-foreground">
                    These changes apply only to{" "}
                    {formatDateKey(selectedDate)}.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {dateOverrides.map((override) => (
                  <div
                    key={override.id}
                    className="pixel-border-subtle rounded-lg bg-card p-4"
                  >
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

                      <div>
                        <p className="font-bold">
                          {override.subject}
                        </p>

                        <p className="text-xs text-muted-foreground">
                          {override.code}
                        </p>
                      </div>

                      <span className="pixel rounded bg-primary/15 px-2 py-1 text-xs text-primary">
                        {override.action.toUpperCase()}
                      </span>
                    </div>

                    <div className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
                      <span>
                        <Clock3 className="mr-2 inline h-4 w-4 text-primary" />
                        {override.startTime} –{" "}
                        {override.endTime}
                      </span>

                      <span>
                        <MapPin className="mr-2 inline h-4 w-4 text-primary" />
                        {override.room}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* DAY HEADING */}
          {selectedDay && (
            <section className="space-y-4">

              <div className="flex items-end justify-between">
                <div>
                  <p className="pixel text-xs text-primary">
                    SCHEDULE FOR
                  </p>

                  <h2 className="pixel-heading mt-1 text-2xl">
                    {selectedDay.toUpperCase()}
                  </h2>
                </div>

                <span className="pixel-border-subtle rounded-full bg-accent px-3 py-1 text-xs font-bold">
                  {effectiveClasses.length} CLASSES
                </span>
              </div>

              {/* EMPTY */}
              {effectiveClasses.length === 0 && (
                <div className="pixel-border rounded-xl bg-card p-10 text-center">
                  <CalendarDays className="mx-auto h-10 w-10 text-muted-foreground" />

                  <h3 className="pixel-heading mt-4 text-lg">
                    NO CLASSES SCHEDULED
                  </h3>

                  <p className="mt-2 text-sm text-muted-foreground">
                    Nothing is scheduled for {selectedDay} ({formatDateKey(selectedDate)}).
                  </p>

                  {timetable.length > 0 && (
                    <div className="mt-6 border-t border-border pt-5">
                      <p className="text-xs font-semibold text-muted-foreground">
                        Your timetable has {timetable.length} classes scheduled on other days:
                      </p>
                      <div className="mt-3 flex flex-wrap justify-center gap-2">
                        {days
                          .filter((d) => timetable.some((c) => c.day === d))
                          .map((d) => {
                            const count = timetable.filter((c) => c.day === d).length;
                            return (
                              <button
                                key={d}
                                type="button"
                                onClick={() => {
                                  const current = new Date(`${selectedDate}T12:00:00`);
                                  const target = days.indexOf(d);
                                  const monday = new Date(current);
                                  const currentDay = monday.getDay();
                                  const diff = currentDay === 0 ? -6 : 1 - currentDay;
                                  monday.setDate(monday.getDate() + diff);
                                  monday.setDate(monday.getDate() + target);
                                  setSelectedDate(formatDateKey(monday));
                                }}
                                className="pixel-border-subtle rounded-lg bg-primary/10 px-3.5 py-2 text-xs font-semibold text-primary transition-all hover:-translate-y-0.5 hover:bg-primary hover:text-primary-foreground"
                              >
                                View {d} ({count} {count === 1 ? "class" : "classes"})
                              </button>
                            );
                          })}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* CLASSES */}
              {effectiveClasses.length > 0 && (
                <div className="grid gap-4 md:grid-cols-2">
                  {effectiveClasses.map(
                    (classItem) => {
                      const override =
                        dateOverrides.find(
                          (item) =>
                            item.classId ===
                            classItem.id
                        );

                      const cancelled =
                        override?.action ===
                        "cancelled";

                      return (
                        <article
                          key={classItem.id}
                          className={[
                            "pixel-border rounded-xl bg-card p-5",
                            "transition-transform hover:-translate-y-1",
                            cancelled
                              ? "opacity-60"
                              : "",
                          ].join(" ")}
                        >
                          <div className="flex items-start justify-between gap-4">

                            <div className="min-w-0">
                              <span className="pixel inline-flex rounded bg-primary px-2 py-1 text-xs text-primary-foreground">
                                {classItem.code}
                              </span>

                              <h3 className="mt-3 text-lg font-bold">
                                {classItem.subject}
                              </h3>

                              <p className="mt-1 text-sm text-muted-foreground">
                                {cancelled
                                  ? "CANCELLED"
                                  : classItem.type}
                              </p>
                            </div>

                            {!override && (
                              <div className="flex shrink-0 items-center gap-2">

                                <AddClassDialog
                                  classItem={classItem}
                                  trigger={
                                    <button
                                      type="button"
                                      className="pixel-border-subtle flex h-9 w-9 items-center justify-center rounded-lg bg-secondary text-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
                                      aria-label={`Edit ${classItem.subject}`}
                                    >
                                      <Pencil className="h-4 w-4" />
                                    </button>
                                  }
                                />

                                <button
                                  type="button"
                                  onClick={() => {
                                    const confirmed =
                                      window.confirm(
                                        `Delete ${classItem.subject} from your timetable?`
                                      );

                                    if (confirmed) {
                                      deleteClass(
                                        classItem.id
                                      );
                                    }
                                  }}
                                  className="pixel-border-subtle flex h-9 w-9 items-center justify-center rounded-lg bg-destructive/10 text-destructive transition-all hover:-translate-y-0.5 hover:bg-destructive/20 hover:text-destructive"
                                  aria-label={`Delete ${classItem.subject}`}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>

                              </div>
                            )}
                          </div>

                          <div className="mt-5 grid gap-3 border-t border-border pt-4 sm:grid-cols-2">

                            <div className="flex items-center gap-2 text-sm">
                              <Clock3 className="h-4 w-4 text-primary" />

                              <span>
                                {classItem.startTime} –{" "}
                                {classItem.endTime}
                              </span>
                            </div>

                            <div className="flex items-center gap-2 text-sm">
                              <MapPin className="h-4 w-4 text-primary" />

                              <span>
                                {classItem.room}
                              </span>
                            </div>

                          </div>

                          <div className="mt-3 text-xs text-muted-foreground">
                            Faculty · {classItem.faculty}
                          </div>

                          {!override && (
                            <div className="mt-4 border-t border-border pt-4">
                              <AddOverrideDialog
                                classId={classItem.id}
                              />
                            </div>
                          )}

                          {override && (
                            <div className="mt-4 border-t border-border pt-4">
                              <span className="pixel text-xs text-primary">
                                DATE-SPECIFIC OVERRIDE APPLIED
                              </span>
                            </div>
                          )}
                        </article>
                      );
                    }
                  )}
                </div>
              )}

            </section>
          )}

        </div>
      </main>
    </AppShell>
  );
}