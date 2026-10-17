"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeftRight,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  MapPin,
  Sparkles,
} from "lucide-react";
import { useCampusFlowStore } from "@/stores/campusflow-store";
import type { ClassItem } from "@/types/campusflow";
import {
  formatDateKey,
  getEffectiveClasses,
  getMinutesUntil,
  getNextDayFirstClass,
} from "@/lib/schedule";

export function TodaysClasses() {
  const timetable = useCampusFlowStore((state) => state.timetable);
  const overrides = useCampusFlowStore((state) => state.overrides);
  const daySwaps = useCampusFlowStore((state) => state.daySwaps || []);

  const [currentTime, setCurrentTime] = useState(() => {
    const d = new Date();
    return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const d = new Date();
      setCurrentTime(
        `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`
      );
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const todayKey = formatDateKey(new Date());
  const todaySwap = daySwaps?.find((s) => s.date === todayKey);

  const classes = useMemo(() => {
    return getEffectiveClasses(
      timetable,
      overrides,
      new Date(),
      daySwaps
    );
  }, [timetable, overrides, daySwaps]);

  const hasClasses = classes.length > 0;
  const firstClass = hasClasses ? classes[0] : null;
  const lastClass = hasClasses ? classes[classes.length - 1] : null;

  const dayNotStarted = Boolean(firstClass && currentTime < firstClass.startTime);
  const allDoneToday = Boolean(lastClass && currentTime >= lastClass.endTime);

  const nextDayInfo = useMemo(() => {
    return getNextDayFirstClass(timetable, overrides, daySwaps, new Date());
  }, [timetable, overrides, daySwaps]);

  return (
    <section className="pixel-border-subtle bg-card p-5">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="pixel text-xs text-primary">TODAY</p>

          <h2 className="pixel-heading mt-1 text-xl">
            TODAY&apos;S CLASSES
          </h2>
        </div>

        <div className="flex h-9 w-9 items-center justify-center border border-border bg-muted">
          <CalendarDays className="h-4 w-4 text-primary" />
        </div>
      </div>

      {todaySwap && (
        <div className="mb-4 flex items-center gap-2 border border-primary/30 bg-primary/10 px-3 py-2 text-xs">
          <ArrowLeftRight className="h-3.5 w-3.5 text-primary shrink-0" />
          <div className="min-w-0">
            <span className="font-semibold text-primary">DAY SWAP ACTIVE:</span>{" "}
            <span className="text-foreground">
              Following {todaySwap.sourceDay}&apos;s timetable
            </span>
            {todaySwap.note && (
              <span className="text-muted-foreground block text-[11px] mt-0.5">
                Note: {todaySwap.note}
              </span>
            )}
          </div>
        </div>
      )}

      {/* College Not Started Banner */}
      {dayNotStarted && firstClass && (
        <div className="mb-4 flex items-center justify-between border border-primary/30 bg-primary/5 p-3 text-xs">
          <div className="flex items-center gap-2">
            <Clock3 className="h-4 w-4 text-primary shrink-0" />
            <div>
              <span className="font-semibold text-primary">DAY HAS NOT STARTED:</span>{" "}
              <span className="text-foreground">
                First class is {firstClass.code || firstClass.subject} at {firstClass.startTime} ({firstClass.room || "Room TBA"})
              </span>
            </div>
          </div>
        </div>
      )}

      {/* All Done Banner */}
      {allDoneToday && (
        <div className="mb-4 border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-xs text-emerald-800 dark:text-emerald-300">
          <div className="flex items-center gap-2 font-semibold">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>ALL CLASSES CONCLUDED FOR TODAY! 🎉</span>
          </div>
          <p className="mt-1 text-[11px] text-muted-foreground">
            {nextDayInfo
              ? `Next class: ${nextDayInfo.firstClass.code || nextDayInfo.firstClass.subject} on ${nextDayInfo.isTomorrow ? "Tomorrow" : nextDayInfo.dayName} at ${nextDayInfo.firstClass.startTime} (${nextDayInfo.firstClass.room || "Room TBA"}).`
              : "All classes have ended. Great job today!"}
          </p>
        </div>
      )}

      {classes.length === 0 ? (
        <div className="pixel-border-subtle flex min-h-36 flex-col items-center justify-center bg-muted/30 p-6 text-center">
          <CalendarDays className="mb-2 h-7 w-7 text-muted-foreground" />

          <p className="pixel text-sm text-foreground">
            NO CLASSES TODAY
          </p>

          <p className="mt-1 text-xs text-muted-foreground max-w-sm">
            {nextDayInfo ? (
              <>
                Schedule clear today. Next class is{" "}
                <span className="font-semibold text-foreground">
                  {nextDayInfo.firstClass.code || nextDayInfo.firstClass.subject}
                </span>{" "}
                on {nextDayInfo.isTomorrow ? "Tomorrow" : nextDayInfo.dayName} at{" "}
                <span className="font-semibold text-foreground">
                  {nextDayInfo.firstClass.startTime}
                </span>{" "}
                in {nextDayInfo.firstClass.room || "Room TBA"}.
              </>
            ) : (
              "Your schedule is clear for today."
            )}
          </p>

          {nextDayInfo && (
            <Link
              href="/timetable"
              className="pixel-button mt-4 inline-flex items-center gap-1.5 rounded border border-primary bg-primary px-3 py-1.5 text-[10px] font-bold text-white shadow-[2px_2px_0_var(--foreground)]"
            >
              VIEW {nextDayInfo.isTomorrow ? "TOMORROW" : nextDayInfo.dayName.toUpperCase()}&apos;S SCHEDULE
              <ArrowRight className="h-3 w-3" />
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {classes.map((item: ClassItem) => {
            const isLive = currentTime >= item.startTime && currentTime < item.endTime;
            const isEnded = currentTime >= item.endTime;
            const minsUntil = getMinutesUntil(item.startTime, new Date());
            const isSoon = minsUntil > 0 && minsUntil <= 5;

            return (
              <div
                key={item.id}
                className={`pixel-border-subtle p-4 transition-all ${
                  isLive
                    ? "bg-primary/5 border-primary shadow-[3px_3px_0px_hsl(var(--primary))]"
                    : isSoon
                    ? "bg-yellow-500/10 border-yellow-500/40"
                    : isEnded
                    ? "bg-background/60 opacity-60"
                    : "bg-background hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_hsl(var(--primary))]"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="pixel text-[10px] text-primary">
                        {item.code}
                      </span>

                      <span className="border border-border bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">
                        {item.type}
                      </span>

                      {/* Live Status Badges */}
                      {isLive && (
                        <span className="inline-flex items-center gap-1 rounded bg-primary px-2 py-0.5 text-[9px] font-bold text-white animate-pulse">
                          ● LIVE NOW
                        </span>
                      )}
                      {isSoon && (
                        <span className="inline-flex items-center gap-1 rounded border border-yellow-600/40 bg-yellow-500/20 px-2 py-0.5 text-[9px] font-bold text-yellow-800 dark:text-yellow-300">
                          ⏰ STARTS IN {minsUntil}M
                        </span>
                      )}
                      {isEnded && (
                        <span className="border border-border bg-muted px-1.5 py-0.5 text-[9px] font-semibold text-muted-foreground">
                          ENDED
                        </span>
                      )}
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

                <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-primary" />
                    {item.room}
                  </div>

                  {item === firstClass && dayNotStarted && (
                    <span className="pixel text-[10px] text-primary">
                      FIRST CLASS TODAY
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}