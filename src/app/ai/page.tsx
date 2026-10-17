"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  AlertTriangle,
  ArrowLeftRight,
  Bot,
  CalendarDays,
  CheckCircle2,
  Clock3,
  ListTodo,
  Pin,
  RotateCcw,
  Send,
  Sparkles,
  User,
} from "lucide-react";

import { AppShell } from "@/components/layout/app-shell";
import { useCampusFlowStore } from "@/stores/campusflow-store";
import { getCampusAIResponse } from "@/lib/campus-ai";
import {
  formatDateKey,
  getDayName,
  getEffectiveClasses,
  getNextDayFirstClass,
} from "@/lib/schedule";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

const suggestions = [
  "Which lecture on Tuesday from 8 am to 10 am?",
  "What's my next class & room?",
  "What do I have today?",
  "Who teaches Machine Learning?",
  "What assignments are due?",
  "When are my practical labs?",
  "Create a study plan for me",
  "Are any day swaps active?",
];

function formatMessageContent(content: string) {
  const lines = content.split("\n");
  return lines.map((line, i) => {
    // Replace **bold** with <strong>
    const parts = line.split(/(\*\*.*?\*\*)/g);
    return (
      <span key={i} className={`block ${line.trim() === "" ? "h-2" : "min-h-[1.25rem]"}`}>
        {parts.map((part, j) => {
          if (part.startsWith("**") && part.endsWith("**")) {
            return (
              <strong key={j} className="font-bold text-foreground">
                {part.slice(2, -2)}
              </strong>
            );
          }
          return part;
        })}
      </span>
    );
  });
}

export default function AIPage() {
  const timetable = useCampusFlowStore((state) => state.timetable);
  const assignments = useCampusFlowStore((state) => state.assignments);
  const tasks = useCampusFlowStore((state) => state.tasks);
  const overrides = useCampusFlowStore((state) => state.overrides);
  const daySwaps = useCampusFlowStore((state) => state.daySwaps || []);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Live real-time clock (updates every 30 seconds)
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

  const now = new Date();
  const todayKey = formatDateKey(now);
  const todayDayName = getDayName(now);

  const todayClasses = useMemo(
    () => getEffectiveClasses(timetable, overrides, now, daySwaps),
    [timetable, overrides, daySwaps]
  );

  const currentOngoing = todayClasses.find(
    (c) => currentTime >= c.startTime && currentTime < c.endTime
  );
  const upcomingNext = todayClasses.find((c) => c.startTime > currentTime);
  const todaySwap = daySwaps.find((s) => s.date === todayKey);

  // Tomorrow calculations
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowKey = formatDateKey(tomorrow);
  const tomorrowDayName = getDayName(tomorrow);
  const tomorrowSwap = daySwaps.find((s) => s.date === tomorrowKey);
  const tomorrowClasses = useMemo(
    () => getEffectiveClasses(timetable, overrides, tomorrow, daySwaps),
    [timetable, overrides, daySwaps]
  );
  const tomorrowOverrides = overrides.filter((o) => o.date === tomorrowKey);

  // Next academic day if tomorrow is free (e.g. weekend)
  const nextAcademicDay = useMemo(() => {
    return getNextDayFirstClass(timetable, overrides, daySwaps, now);
  }, [timetable, overrides, daySwaps]);

  // Workload calculations
  const pendingAssignments = assignments.filter((a) => !a.completed);
  const dueTodayAssn = pendingAssignments.filter((a) => a.dueDate === todayKey).length;
  const dueTomorrowAssn = pendingAssignments.filter((a) => a.dueDate === tomorrowKey).length;
  const highPriorityAssn = pendingAssignments.filter((a) => a.priority === "High").length;

  const pendingTasks = tasks.filter((t) => !t.completed);
  const dueTodayTasks = pendingTasks.filter((t) => t.dueDate === todayKey).length;
  const dueTomorrowTasks = pendingTasks.filter((t) => t.dueDate === tomorrowKey).length;
  const highPriorityTasks = pendingTasks.filter((t) => t.priority === "High").length;

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "👋 Hi Krupa! I'm your CampusFlow AI Copilot.\n\nI can answer **anything** you ask:\n• **Timetable & Time Slots:** E.g. *\"Which lecture is on Tuesday from 8 am to 10 am?\"*\n• **Faculty & Classrooms:** Room numbers, professors, lab timings\n• **Assignments & Teams:** Due dates, high-priority work, MS Teams tasks\n• **General Questions:** Ask me \"how r u\", request study plans, or draft emails!\n\nWhat would you like to know?",
    },
  ]);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, loading]);

  async function sendMessage(text?: string) {
    const question = (text ?? input).trim();
    if (!question || loading) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: question,
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages,
          context: {
            timetable,
            assignments,
            tasks,
            overrides,
            daySwaps,
            currentTime,
            currentDate: new Date(),
          },
        }),
      });

      const data = await res.json();
      const reply =
        data.response ||
        getCampusAIResponse(question, {
          timetable,
          assignments,
          tasks,
          overrides,
          daySwaps,
          currentTime,
        });

      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: reply,
        },
      ]);
    } catch {
      const fallbackReply = getCampusAIResponse(question, {
        timetable,
        assignments,
        tasks,
        overrides,
        daySwaps,
        currentTime,
      });

      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: fallbackReply,
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleClearChat() {
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content:
          "Chat reset! Ask me anything about your timetable, assignments, professors, or schedule.",
      },
    ]);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    sendMessage();
  }

  return (
    <AppShell>
      <div className="h-[calc(100dvh-78px)] overflow-hidden bg-background p-4 md:p-5 lg:p-6">
        <div className="mx-auto h-full max-w-7xl">

          <div className="grid h-full min-h-0 grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">

            {/* CHAT */}
            <section className="flex min-h-0 min-w-0 flex-col">

              {/* HEADER */}
              <div className="flex shrink-0 items-center justify-between">
                <div>
                  <p className="pixel text-xs text-primary">
                    CAMPUSFLOW // INTELLIGENCE
                  </p>

                  <h1 className="pixel-heading mt-1 text-2xl md:text-3xl">
                    CAMPUS AI
                  </h1>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleClearChat}
                    className="pixel-border-subtle inline-flex items-center gap-1.5 rounded-lg bg-card px-3 py-1.5 text-xs font-semibold text-muted-foreground transition-all hover:-translate-y-0.5 hover:bg-muted hover:text-foreground"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    CLEAR CHAT
                  </button>
                </div>
              </div>

              <div className="mt-3 flex min-h-0 flex-1 flex-col pixel-border-subtle bg-card">

                {/* MESSAGES */}
                <div
                  ref={messagesContainerRef}
                  className="min-h-0 flex-1 overflow-y-auto p-4 md:p-5"
                >
                  <div className="space-y-5">

                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={[
                          "flex gap-3",
                          message.role === "user"
                            ? "justify-end"
                            : "justify-start",
                        ].join(" ")}
                      >
                        {message.role === "assistant" && (
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center border border-primary/30 bg-primary/10 text-primary">
                            <Bot className="h-4 w-4" />
                          </div>
                        )}

                        <div
                          className={[
                            "max-w-[85%] border p-3.5 text-sm leading-relaxed",
                            message.role === "user"
                              ? "border-primary/40 bg-primary/10 text-foreground"
                              : "border-border bg-muted/50 text-foreground",
                          ].join(" ")}
                        >
                          {formatMessageContent(message.content)}
                        </div>

                        {message.role === "user" && (
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center border border-border bg-muted">
                            <User className="h-4 w-4" />
                          </div>
                        )}
                      </div>
                    ))}

                    {loading && (
                      <div className="flex gap-3 justify-start">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center border border-primary/30 bg-primary/10 text-primary">
                          <Bot className="h-4 w-4 animate-pulse" />
                        </div>
                        <div className="border border-border bg-muted/40 p-3.5 text-xs text-muted-foreground flex items-center gap-2">
                          <span className="inline-block h-2 w-2 rounded-full bg-primary animate-ping" />
                          <span>Campus AI is thinking...</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* SUGGESTIONS */}
                <div className="shrink-0 border-t border-border px-4 py-3">
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {suggestions.map((suggestion) => (
                      <button
                        key={suggestion}
                        onClick={() => sendMessage(suggestion)}
                        className="pixel-border-subtle shrink-0 bg-card px-3 py-2 text-xs text-muted-foreground transition-all hover:-translate-y-0.5 hover:bg-muted hover:text-primary"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>

                {/* INPUT */}
                <div className="shrink-0 border-t border-border p-3 md:p-4">
                  <form
                    onSubmit={handleSubmit}
                    className="flex gap-2"
                  >
                    <input
                      value={input}
                      onChange={(event) =>
                        setInput(event.target.value)
                      }
                      placeholder="Ask Campus AI anything about your schedule, assignments, rooms..."
                      className="min-w-0 flex-1 border border-border bg-muted px-4 py-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary"
                    />

                    <button
                      type="submit"
                      aria-label="Send message"
                      className="pixel-button flex h-11 w-11 shrink-0 items-center justify-center bg-primary text-primary-foreground"
                    >
                      <Send className="h-4 w-4" />
                    </button>
                  </form>

                  <p className="mt-2 text-[9px] text-muted-foreground">
                    Campus AI connects live with your timetable, rooms, assignments & day swaps.
                  </p>
                </div>
              </div>
            </section>

            {/* CONTEXT PANEL (100% REAL-TIME & DYNAMIC) */}
            <aside className="hidden min-h-0 space-y-4 overflow-y-auto pr-1 lg:block">
              {/* CURRENT / TODAY'S CONTEXT */}
              <div className="relative pixel-border-subtle bg-card p-5">
                <Pin className="absolute right-3 top-3 h-4 w-4 rotate-12 fill-primary text-primary" aria-hidden="true" />
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <div>
                    <p className="pixel text-xs text-primary">LIVE CONTEXT</p>
                    <h2 className="pixel mt-0.5 text-xs font-bold text-foreground">
                      {todayDayName.toUpperCase()} · {currentTime}
                    </h2>
                  </div>
                </div>

                <div className="mt-4 space-y-2.5">
                  <ContextCard
                    href="/timetable"
                    icon={CalendarDays}
                    title="TODAY'S CLASSES"
                    description={
                      currentOngoing
                        ? `Live: ${currentOngoing.code} in Room ${currentOngoing.room}`
                        : upcomingNext
                        ? `Next: ${upcomingNext.code} at ${upcomingNext.startTime} (${upcomingNext.room})`
                        : todayClasses.length > 0
                        ? `All ${todayClasses.length} classes completed 🎉`
                        : `No classes today (Free day)`
                    }
                    badge={
                      currentOngoing
                        ? "LIVE NOW"
                        : upcomingNext
                        ? "UPCOMING"
                        : todayClasses.length > 0
                        ? "CONCLUDED"
                        : "FREE"
                    }
                    badgeColor={
                      currentOngoing
                        ? "bg-primary text-white animate-pulse"
                        : upcomingNext
                        ? "bg-amber-500/20 text-amber-700 dark:text-amber-300"
                        : undefined
                    }
                  />

                  <ContextCard
                    href="/assignments"
                    icon={Clock3}
                    title="ASSIGNMENTS"
                    description={
                      dueTodayAssn > 0
                        ? `🚨 ${dueTodayAssn} due today! (${pendingAssignments.length} total)`
                        : dueTomorrowAssn > 0
                        ? `${dueTomorrowAssn} due tomorrow (${pendingAssignments.length} total)`
                        : `${pendingAssignments.length} pending (${highPriorityAssn} high priority)`
                    }
                    badge={
                      dueTodayAssn > 0
                        ? "DUE TODAY"
                        : dueTomorrowAssn > 0
                        ? "TOMORROW"
                        : `${pendingAssignments.length} PENDING`
                    }
                    badgeColor={
                      dueTodayAssn > 0
                        ? "bg-red-500/20 text-red-700 dark:text-red-300 font-bold"
                        : undefined
                    }
                  />

                  <ContextCard
                    href="/tasks"
                    icon={CheckCircle2}
                    title="TASKS"
                    description={`${pendingTasks.length} pending (${highPriorityTasks} high priority)`}
                    badge={`${pendingTasks.length} PENDING`}
                  />

                  {todaySwap && (
                    <ContextCard
                      href="/timetable"
                      icon={ArrowLeftRight}
                      title="DAY SWAP ACTIVE"
                      description={`Following ${todaySwap.sourceDay}'s schedule today`}
                      badge="SWAPPED"
                      badgeColor="bg-primary/20 text-primary"
                    />
                  )}
                </div>
              </div>

              {/* NEXT ACADEMIC DAY / TOMORROW */}
              <div className="relative pixel-border-subtle bg-card p-5">
                <Pin className="absolute right-3 top-3 h-4 w-4 -rotate-12 fill-primary text-primary" aria-hidden="true" />
                <p className="pixel text-xs text-primary">
                  {tomorrowClasses.length > 0
                    ? `TOMORROW (${tomorrowDayName.toUpperCase()})`
                    : nextAcademicDay
                    ? `NEXT COLLEGE DAY (${nextAcademicDay.dayName.toUpperCase()})`
                    : "NEXT ACADEMIC DAY"}
                </p>
                <h2 className="pixel-heading mt-1 text-sm font-bold">
                  {tomorrowClasses.length > 0
                    ? `${tomorrowClasses.length} Classes Scheduled`
                    : nextAcademicDay
                    ? `${nextAcademicDay.isTomorrow ? "Tomorrow" : nextAcademicDay.dayName} at ${nextAcademicDay.firstClass.startTime}`
                    : "Schedule Clear"}
                </h2>

                <div className="mt-4 space-y-2.5">
                  <ContextCard
                    href="/timetable"
                    icon={CalendarDays}
                    title="UPCOMING SCHEDULE"
                    description={
                      tomorrowClasses.length > 0
                        ? tomorrowSwap
                          ? `Following ${tomorrowSwap.sourceDay} timetable (${tomorrowClasses.length} classes)`
                          : tomorrowOverrides.length > 0
                          ? `${tomorrowClasses.length} classes (${tomorrowOverrides.length} changes)`
                          : `${tomorrowClasses.length} classes · Starts at ${tomorrowClasses[0].startTime}`
                        : nextAcademicDay
                        ? `Next: ${nextAcademicDay.firstClass.code || nextAcademicDay.firstClass.subject} in Room ${nextAcademicDay.firstClass.room}`
                        : "No upcoming classes scheduled"
                    }
                    badge={
                      tomorrowSwap
                        ? "SWAP"
                        : tomorrowClasses.length > 0
                        ? `${tomorrowClasses.length} CLASSES`
                        : "WEEKEND"
                    }
                  />

                  <ContextCard
                    href="/assignments"
                    icon={ListTodo}
                    title="UPCOMING WORKLOAD"
                    description={
                      dueTomorrowAssn + dueTomorrowTasks > 0
                        ? `${dueTomorrowAssn + dueTomorrowTasks} items due tomorrow (${dueTomorrowAssn} assn, ${dueTomorrowTasks} tasks)`
                        : dueTodayAssn + dueTodayTasks > 0
                        ? `${dueTodayAssn + dueTodayTasks} items due today`
                        : `${pendingAssignments.length + pendingTasks.length} total pending academic items`
                    }
                    badge={
                      dueTomorrowAssn + dueTomorrowTasks > 0
                        ? "DUE TOMORROW"
                        : undefined
                    }
                  />
                </div>
              </div>

            </aside>

          </div>
        </div>
      </div>
    </AppShell>
  );
}

function ContextCard({
  href,
  icon: Icon,
  title,
  description,
  badge,
  badgeColor,
}: {
  href?: string;
  icon: any;
  title: string;
  description: string;
  badge?: string;
  badgeColor?: string;
}) {
  const content = (
    <div className="flex items-start justify-between gap-2">
      <div className="flex items-start gap-3 min-w-0">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center border border-primary/20 bg-primary/10 text-primary rounded">
          <Icon className="h-4 w-4" />
        </div>

        <div className="min-w-0">
          <p className="pixel text-[11px] truncate">
            {title}
          </p>

          <p className="mt-0.5 text-xs text-muted-foreground leading-snug break-words">
            {description}
          </p>
        </div>
      </div>

      {badge && (
        <span
          className={`shrink-0 rounded px-1.5 py-0.5 text-[9px] font-bold ${
            badgeColor || "border border-border bg-muted text-muted-foreground"
          }`}
        >
          {badge}
        </span>
      )}
    </div>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="pixel-border-subtle block rounded-lg bg-card p-3 transition-all hover:border-primary hover:bg-primary/5"
      >
        {content}
      </Link>
    );
  }

  return (
    <div className="pixel-border-subtle rounded-lg bg-card p-3">
      {content}
    </div>
  );
}