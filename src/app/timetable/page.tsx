"use client";

import { useMemo, useState } from "react";
import {
  CalendarDays,
  Clock3,
  MapPin,
  Pencil,
  Trash2,
  AlertTriangle,
} from "lucide-react";

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

  const deleteClass = useCampusFlowStore(
    (state) => state.deleteClass
  );

  const [selectedDate, setSelectedDate] = useState(
    getToday()
  );

  const selectedDay = getDayName(
    new Date(`${selectedDate}T12:00:00`)
  );

  const normalClasses = useMemo(() => {
    if (!selectedDay) {
      return [];
    }

    return timetable
      .filter((item) => item.day === selectedDay)
      .sort((a, b) =>
        a.startTime.localeCompare(b.startTime)
      );
  }, [timetable, selectedDay]);

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

              <div className="flex flex-col gap-3 xl:flex-row xl:items-end">

                {/* DATE */}
                <div className="pixel-border-subtle rounded-lg bg-muted px-4 py-3">
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

                {/* COUNT */}
                <div className="pixel-border-subtle rounded-lg bg-muted px-4 py-3">
                  <p className="pixel text-xs text-muted-foreground">
                    THIS WEEK
                  </p>

                  <p className="mt-1 font-bold">
                    {timetable.length} CLASSES
                  </p>
                </div>

                <AddClassDialog />

              </div>
            </div>
          </section>

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
                  <p className="pixel text-xs">
                    {day.slice(0, 3).toUpperCase()}
                  </p>

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
                    NO CLASSES
                  </h3>

                  <p className="mt-2 text-sm text-muted-foreground">
                    Nothing is scheduled for{" "}
                    {formatDateKey(selectedDate)}.
                  </p>
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