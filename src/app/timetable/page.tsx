"use client";
import {
  CalendarDays,
  Clock3,
  MapPin,
  Pencil,
  Trash2,
} from "lucide-react";
import { useMemo } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { AddClassDialog } from "@/components/timetable/add-class-dialog";


import { useCampusFlowStore } from "@/stores/campusflow-store";
import type { DayOfWeek } from "@/types/campusflow";

const days: DayOfWeek[] = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export default function TimetablePage() {
  const timetable = useCampusFlowStore(
    (state) => state.timetable
  );
  const deleteClass = useCampusFlowStore(
  (state) => state.deleteClass
);

  const selectedDay = useCampusFlowStore(
    (state) => state.selectedDay
  );

  const setSelectedDay = useCampusFlowStore(
    (state) => state.setSelectedDay
  );

  const classes = useMemo(() => {
    return timetable
      .filter((item) => item.day === selectedDay)
      .sort((a, b) =>
        a.startTime.localeCompare(b.startTime)
      );
  }, [timetable, selectedDay]);

  return (
    <AppShell>
    <main className="min-h-screen p-5 md:p-8">
      <div className="mx-auto max-w-7xl space-y-6">

        {/* HEADER */}
        <section className="pixel-border rounded-xl bg-card p-6">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">

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
        </section>

        {/* DAY SELECTOR */}
        <section className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-6">
          {days.map((day) => {
            const active = selectedDay === day;

            return (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
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

        {/* SELECTED DAY */}
        <section className="space-y-4">

          <div className="flex items-end justify-between">
            <div>
              <p className="pixel text-xs text-primary">
                SELECTED DAY
              </p>

              <h2 className="pixel-heading mt-1 text-2xl">
                {selectedDay.toUpperCase()}
              </h2>
            </div>

            <span className="pixel-border-subtle rounded-full bg-accent px-3 py-1 text-xs font-bold">
              {classes.length} CLASSES
            </span>
          </div>

          {/* EMPTY STATE */}
          {classes.length === 0 && (
            <div className="pixel-border rounded-xl bg-card p-10 text-center">
              <CalendarDays className="mx-auto h-10 w-10 text-muted-foreground" />

              <h3 className="pixel-heading mt-4 text-lg">
                NO CLASSES
              </h3>

              <p className="mt-2 text-sm text-muted-foreground">
                Nothing is scheduled for {selectedDay}.
              </p>
            </div>
          )}

          {/* CLASS CARDS */}
          {classes.length > 0 && (
            <div className="grid gap-4 md:grid-cols-2">
              {classes.map((classItem) => (
                <article
  key={classItem.id}
  className="pixel-border rounded-xl bg-card p-5 transition-transform hover:-translate-y-1"
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
        {classItem.type}
      </p>
    </div>

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
          const confirmed = window.confirm(
            `Delete ${classItem.subject} from your timetable?`
          );

          if (confirmed) {
            deleteClass(classItem.id);
          }
        }}
        className="pixel-border-subtle flex h-9 w-9 items-center justify-center rounded-lg bg-destructive/10 text-destructive transition-colors hover:bg-red-100 hover:text-red-500"
        aria-label={`Delete ${classItem.subject}`}
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  </div>

  <div className="mt-5 grid gap-3 border-t border-border pt-4 sm:grid-cols-2">
    <div className="flex items-center gap-2 text-sm">
      <Clock3 className="h-4 w-4 text-primary" />

      <span>
        {classItem.startTime} – {classItem.endTime}
      </span>
    </div>

    <div className="flex items-center gap-2 text-sm">
      <MapPin className="h-4 w-4 text-primary" />

      <span>{classItem.room}</span>
    </div>
  </div>

  <div className="mt-3 text-xs text-muted-foreground">
    Faculty · {classItem.faculty}
  </div>
</article>
              ))}
            </div>
          )}

        </section>
      </div>
      
    </main>
    </AppShell>
  );
}