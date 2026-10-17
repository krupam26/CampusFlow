"use client";

import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Sparkles,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

import { PixelMascot } from "./pixel-mascot";
import { useCampusFlowStore } from "@/stores/campusflow-store";
import { authClient } from "@/lib/auth-client";
import {
  formatDateKey,
  getDayName,
  getEffectiveClasses,
  getMinutesUntil,
  getNextDayFirstClass,
} from "@/lib/schedule";

function getInitialBriefing() {
  const hour = new Date().getHours();

  if (hour >= 12 && hour < 17) {
    return {
      greeting: "GOOD AFTERNOON",
      label: "AFTERNOON BRIEFING",
      message: "Keep your momentum going.",
    };
  } else if (hour >= 17 && hour < 22) {
    return {
      greeting: "GOOD EVENING",
      label: "EVENING BRIEFING",
      message: "Close out the day with a smart next move.",
    };
  } else if (hour >= 22 || hour < 5) {
    return {
      greeting: "UP LATE",
      label: "NIGHT BRIEFING",
      message: "Keep it focused, then get some rest.",
    };
  }

  return {
    greeting: "GOOD MORNING",
    label: "MORNING BRIEFING",
    message: "Your academic world is ready.",
  };
}

export function MorningBriefing() {
  const [briefing] = useState(getInitialBriefing);
  const { data: session } = authClient.useSession();

  const timetable = useCampusFlowStore((state) => state.timetable);
  const overrides = useCampusFlowStore((state) => state.overrides);
  const daySwaps = useCampusFlowStore((state) => state.daySwaps || []);
  const assignments = useCampusFlowStore((state) => state.assignments);
  const tasks = useCampusFlowStore((state) => state.tasks);

  const userName = session?.user?.name
    ? session.user.name.split(" ")[0].toUpperCase()
    : "KRUPA";

  // Live current time tracker (updates every 30 seconds)
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

  // Dynamic Today's Classes
  const todayClasses = useMemo(() => {
    return getEffectiveClasses(timetable, overrides, new Date(), daySwaps);
  }, [timetable, overrides, daySwaps]);

  // Current ongoing class
  const currentClass = todayClasses.find(
    (c) => currentTime >= c.startTime && currentTime < c.endTime
  );

  // Next upcoming class today
  const nextClass = todayClasses.find((c) => c.startTime > currentTime);

  // First & Last class today
  const hasClassesToday = todayClasses.length > 0;
  const firstClassToday = hasClassesToday ? todayClasses[0] : null;
  const lastClassToday = hasClassesToday ? todayClasses[todayClasses.length - 1] : null;

  const dayNotStarted = Boolean(firstClassToday && currentTime < firstClassToday.startTime);
  const allDoneToday = Boolean(lastClassToday && currentTime >= lastClassToday.endTime);

  // Look up next day's (or next college day's) first class
  const nextDayInfo = useMemo(() => {
    return getNextDayFirstClass(timetable, overrides, daySwaps, new Date());
  }, [timetable, overrides, daySwaps]);

  // 5-minute alert before starting next class (Web toast)
  const notifiedClassRef = useRef<string>("");
  useEffect(() => {
    const upcoming = nextClass || (dayNotStarted ? firstClassToday : null);
    if (!upcoming) return;

    const mins = getMinutesUntil(upcoming.startTime, new Date());
    if (mins > 0 && mins <= 5) {
      const toastKey = `${upcoming.id}-${upcoming.startTime}-${mins}`;
      if (notifiedClassRef.current !== toastKey) {
        notifiedClassRef.current = toastKey;
        toast.warning(
          `Class starting in ${mins} minute${mins === 1 ? "" : "s"}! ⏰`,
          {
            description: `${upcoming.code || upcoming.subject} at ${upcoming.startTime} in ${upcoming.room || "Room TBA"}`,
            duration: 8000,
          }
        );
      }
    }
  }, [nextClass, dayNotStarted, firstClassToday, currentTime]);

  // Dynamic Pending Work
  const pendingAssignments = assignments.filter((a) => !a.completed);
  const pendingTasks = tasks.filter((t) => !t.completed);

  const todayKey = formatDateKey(new Date());
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowKey = formatDateKey(tomorrow);

  const dueToday = pendingAssignments.filter((a) => a.dueDate === todayKey).length;
  const dueTomorrow = pendingAssignments.filter((a) => a.dueDate === tomorrowKey).length;

  // Dynamic Schedule Change or Swap
  const todaySwap = daySwaps.find((s) => s.date === todayKey);
  const todayOverrides = overrides.filter((o) => o.date === todayKey);
  const upcomingSwap = daySwaps.find((s) => s.date > todayKey);
  const upcomingOverride = overrides.find((o) => o.date > todayKey);

  // Compute Current/Next Class Card content
  let currentClassLabel = "CURRENT CLASS";
  let currentClassTitle = "NO ONGOING CLASS";
  let currentClassDesc = "No class in session right now";
  let currentClassAccent: "purple" | "green" | "yellow" = "purple";

  if (dayNotStarted && firstClassToday) {
    // 1. Day hasn't started yet -> Show today's first class
    const minsUntilFirst = getMinutesUntil(firstClassToday.startTime, new Date());
    if (minsUntilFirst > 0 && minsUntilFirst <= 5) {
      currentClassLabel = `STARTING IN ${minsUntilFirst} MIN ⏰`;
      currentClassAccent = "yellow";
    } else {
      currentClassLabel = "TODAY'S FIRST CLASS";
      currentClassAccent = "purple";
    }
    currentClassTitle = firstClassToday.code || firstClassToday.subject;
    currentClassDesc = `Starts at ${firstClassToday.startTime} · ${
      firstClassToday.room || "Room TBA"
    } (${firstClassToday.faculty || "Faculty TBA"})`;
  } else if (currentClass) {
    // 2. Class currently in session
    currentClassLabel = "CURRENT CLASS (NOW)";
    currentClassTitle = currentClass.code || currentClass.subject;
    currentClassDesc = `${currentClass.startTime} – ${currentClass.endTime} · ${
      currentClass.room || "Room TBA"
    }`;
    currentClassAccent = "purple";
  } else if (nextClass) {
    // 3. Between classes -> check if starting in <= 5 mins
    const minsUntilNext = getMinutesUntil(nextClass.startTime, new Date());
    if (minsUntilNext > 0 && minsUntilNext <= 5) {
      currentClassLabel = `STARTING IN ${minsUntilNext} MIN ⏰`;
      currentClassAccent = "yellow";
    } else {
      currentClassLabel = "NEXT CLASS TODAY";
      currentClassAccent = "purple";
    }
    currentClassTitle = nextClass.code || nextClass.subject;
    currentClassDesc = `Starts at ${nextClass.startTime} · ${
      nextClass.room || "Room TBA"
    } (${nextClass.faculty || "Faculty TBA"})`;
  } else if (allDoneToday) {
    // 4. Classes ended for today -> Show next day's first class
    currentClassAccent = "green";
    if (nextDayInfo) {
      currentClassLabel = nextDayInfo.isTomorrow
        ? "TOMORROW'S FIRST CLASS"
        : `NEXT CLASS (${nextDayInfo.dayName.toUpperCase()})`;
      currentClassTitle = nextDayInfo.firstClass.code || nextDayInfo.firstClass.subject;
      currentClassDesc = `${nextDayInfo.isTomorrow ? "Tomorrow" : nextDayInfo.dayName} at ${nextDayInfo.firstClass.startTime} · ${
        nextDayInfo.firstClass.room || "Room TBA"
      }`;
    } else {
      currentClassLabel = "ALL DONE TODAY 🎉";
      currentClassTitle = "CLASSES ENDED";
      currentClassDesc = "All classes for today have concluded!";
    }
  } else if (!hasClassesToday) {
    // 5. No classes scheduled today (weekend / holiday) -> Show upcoming first class
    if (nextDayInfo) {
      currentClassLabel = nextDayInfo.isTomorrow
        ? "TOMORROW'S FIRST CLASS"
        : `FIRST CLASS (${nextDayInfo.dayName.toUpperCase()})`;
      currentClassTitle = nextDayInfo.firstClass.code || nextDayInfo.firstClass.subject;
      currentClassDesc = `${nextDayInfo.isTomorrow ? "Tomorrow" : nextDayInfo.dayName} at ${nextDayInfo.firstClass.startTime} · ${
        nextDayInfo.firstClass.room || "Room TBA"
      }`;
      currentClassAccent = "purple";
    } else {
      currentClassLabel = "CURRENT CLASS";
      currentClassTitle = "NO CLASSES SCHEDULED";
      currentClassDesc = "Your schedule is clear for today";
      currentClassAccent = "purple";
    }
  }

  // Compute Pending Work Card content
  let pendingTitle = "ALL CAUGHT UP";
  let pendingDesc = "No pending assignments";
  if (pendingAssignments.length > 0) {
    pendingTitle = `${pendingAssignments.length} ${
      pendingAssignments.length === 1 ? "ASSIGNMENT" : "ASSIGNMENTS"
    }`;
    pendingDesc =
      dueToday > 0
        ? `${dueToday} due today`
        : dueTomorrow > 0
        ? `${dueTomorrow} deadline tomorrow`
        : `${pendingTasks.length} other tasks pending`;
  } else if (pendingTasks.length > 0) {
    pendingTitle = `${pendingTasks.length} ${
      pendingTasks.length === 1 ? "TASK" : "TASKS"
    }`;
    pendingDesc = "Tasks in progress";
  }

  // Compute Schedule Change Card content
  let changeLabel = "SCHEDULE STATUS";
  let changeTitle = "REGULAR SCHEDULE";
  let changeDesc = "No schedule overrides active";
  let changeAccent: "purple" | "green" | "yellow" = "purple";

  if (todaySwap) {
    changeLabel = "DAY SWAP ACTIVE";
    changeTitle = `FOLLOWING ${todaySwap.sourceDay.toUpperCase()}`;
    changeDesc = todaySwap.note || "Following alternative timetable today";
    changeAccent = "yellow";
  } else if (todayOverrides.length > 0) {
    const o = todayOverrides[0];
    changeLabel = "TODAY'S OVERRIDE";
    changeTitle = o.code || o.subject;
    changeDesc = `${o.startTime} · ${o.action.toUpperCase()}`;
    changeAccent = "yellow";
  } else if (upcomingSwap) {
    const dayName = getDayName(new Date(`${upcomingSwap.date}T12:00:00`));
    changeLabel = "UPCOMING SWAP";
    changeTitle = `${upcomingSwap.sourceDay.toUpperCase()} SWAP`;
    changeDesc = `${dayName} · ${upcomingSwap.date}`;
    changeAccent = "yellow";
  } else if (upcomingOverride) {
    changeLabel = "SCHEDULE CHANGE";
    changeTitle = upcomingOverride.code || upcomingOverride.subject;
    changeDesc = `${upcomingOverride.date} · ${upcomingOverride.startTime}`;
    changeAccent = "yellow";
  }

  return (
    <section className="pixel-grid relative overflow-hidden rounded-2xl border-2 border-foreground bg-card p-6 shadow-[6px_6px_0_rgba(102,87,232,0.22)] sm:p-8 lg:p-10">
      <div className="absolute right-0 top-0 h-32 w-32 opacity-50">
        <div className="pixel-dots h-full w-full" />
      </div>

      <div className="relative flex flex-col gap-8 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex items-center gap-5">
          <div className="hidden shrink-0 sm:block">
            <PixelMascot />
          </div>

          <div>
            <div className="pixel mb-4 inline-flex items-center gap-2 rounded-md border-2 border-primary bg-primary/10 px-3 py-1.5 text-[10px] text-primary">
              <Sparkles className="h-3 w-3" />
              {briefing.label}
            </div>

            <h1 className="pixel-heading text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
              {briefing.greeting},
              <br />
              <span className="text-primary">
                {userName}! 👋
              </span>
            </h1>

            <p className="mt-4 max-w-xl text-[15px] leading-7 text-muted-foreground">
              {briefing.message}
              <br className="hidden sm:block" />
              Here&apos;s what needs your attention today.
            </p>
          </div>
        </div>

        <Link
          href="/timetable"
          className="pixel-button flex h-11 w-fit items-center gap-2 rounded-lg border-2 border-foreground bg-primary px-5 text-sm font-bold text-white shadow-[4px_4px_0_var(--foreground)] transition-transform hover:-translate-y-0.5"
        >
          VIEW FULL DAY
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {allDoneToday && (
        <div className="relative mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border-2 border-emerald-500/30 bg-emerald-500/10 p-4 text-emerald-800 dark:text-emerald-300">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🎉</span>
            <div>
              <p className="pixel text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                All Done For Today!
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                All classes for today have ended. {nextDayInfo ? `Next class is ${nextDayInfo.firstClass.code || nextDayInfo.firstClass.subject} on ${nextDayInfo.isTomorrow ? "Tomorrow" : nextDayInfo.dayName} at ${nextDayInfo.firstClass.startTime}.` : "You're free for the rest of the day."}
              </p>
            </div>
          </div>
          {nextDayInfo && (
            <Link
              href="/timetable"
              className="pixel shrink-0 self-start sm:self-auto rounded-md border border-emerald-500/40 bg-emerald-500/15 px-3 py-1.5 text-[11px] font-bold text-emerald-800 dark:text-emerald-300 transition-colors hover:bg-emerald-500/25"
            >
              VIEW {nextDayInfo.isTomorrow ? "TOMORROW" : nextDayInfo.dayName.toUpperCase()} →
            </Link>
          )}
        </div>
      )}

      <div className="relative mt-8 grid gap-4 md:grid-cols-3">
        <SummaryCard
          icon={<CalendarDays className="h-5 w-5" />}
          label={currentClassLabel}
          title={currentClassTitle}
          description={currentClassDesc}
          accent={currentClassAccent}
        />

        <SummaryCard
          icon={<CheckCircle2 className="h-5 w-5" />}
          label="PENDING WORK"
          title={pendingTitle}
          description={pendingDesc}
          accent="green"
        />

        <SummaryCard
          icon={<Clock3 className="h-5 w-5" />}
          label={changeLabel}
          title={changeTitle}
          description={changeDesc}
          accent={changeAccent}
        />
      </div>
    </section>
  );
}

function SummaryCard({
  icon,
  label,
  title,
  description,
  accent = "purple",
}: {
  icon: React.ReactNode;
  label: string;
  title: string;
  description: string;
  accent?: "purple" | "green" | "yellow";
}) {
  const styles = {
    purple: "bg-primary/8 border-primary/20 text-primary",
    green: "bg-emerald-500/8 border-emerald-500/20 text-emerald-600",
    yellow: "bg-yellow-500/10 border-yellow-500/25 text-yellow-700",
  };

  return (
    <div
      className={`rounded-xl border-2 p-5 ${styles[accent]}`}
    >
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-background/70">
          {icon}
        </div>

        <span className="text-xs font-semibold tracking-[0.12em]">
          {label}
        </span>
      </div>

      <p className="mt-5 text-xl font-bold tracking-tight text-foreground">
        {title}
      </p>

      <p className="mt-2 text-sm text-muted-foreground">
        {description}
      </p>
    </div>
  );
}