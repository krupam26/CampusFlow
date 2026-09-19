"use client";

import { CalendarDays, Clock3, MapPin } from "lucide-react";
import { useCampusFlowStore } from "@/stores/campusflow-store";
import type { ClassItem } from "@/types/campusflow";
import { getEffectiveClasses } from "@/lib/schedule";

function getTodayName() {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  return days[new Date().getDay()];
}

function timeToMinutes(time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

export function TodaysClasses() {
  const timetable = useCampusFlowStore((state) => state.timetable);
const overrides = useCampusFlowStore((state) => state.overrides);

 

  const classes = getEffectiveClasses(
  timetable,
  overrides,
  new Date()
);

  return (
    <section className="pixel-border-subtle bg-card p-5">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="pixel text-xs text-primary">TODAY</p>

          <h2 className="pixel-heading mt-1 text-xl">
            TODAY'S CLASSES
          </h2>
        </div>

        <div className="flex h-9 w-9 items-center justify-center border border-border bg-muted">
          <CalendarDays className="h-4 w-4 text-primary" />
        </div>
      </div>

      {classes.length === 0 ? (
        <div className="pixel-border-subtle flex min-h-32 flex-col items-center justify-center bg-muted/30 text-center">
          <CalendarDays className="mb-2 h-6 w-6 text-muted-foreground" />

          <p className="pixel text-sm text-muted-foreground">
            NO CLASSES TODAY
          </p>

          <p className="mt-1 text-xs text-muted-foreground">
            Your schedule is clear.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {classes.map((item: ClassItem) => (
            <div
              key={item.id}
              className="pixel-border-subtle bg-background p-4 transition-all hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_hsl(var(--primary))]"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="pixel text-[10px] text-primary">
                      {item.code}
                    </span>

                    <span className="border border-border bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">
                      {item.type}
                    </span>
                  </div>

                  <h3 className="pixel mt-2 text-sm">
                    {item.subject}
                  </h3>

                  <p className="mt-1 text-xs text-muted-foreground">
                    {item.faculty}
                  </p>
                </div>

                <div className="shrink-0 text-right">
                  <div className="flex items-center justify-end gap-1 text-xs font-medium">
                    <Clock3 className="h-3.5 w-3.5 text-primary" />
                    {item.startTime}
                  </div>

                  <p className="mt-1 text-[11px] text-muted-foreground">
                    {item.endTime}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-1.5 border-t border-border pt-3 text-xs text-muted-foreground">
                <MapPin className="h-3.5 w-3.5 text-primary" />
                {item.room}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}