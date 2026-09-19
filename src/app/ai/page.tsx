"use client";

import { useMemo, useState } from "react";
import {
  ArrowRight,
  Bot,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Send,
  Sparkles,
  User,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { AppShell } from "@/components/layout/app-shell";
import { useCampusFlowStore } from "@/stores/campusflow-store";

type Message = {
  id: string;
  role: "user" | "assistant";
  text: string;
};

function getDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getDayName(date: Date) {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
  });
}

function getTomorrow() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  return tomorrow;
}

export default function CampusAIPage() {
  const timetable = useCampusFlowStore(
    (state) => state.timetable
  );

  const assignments = useCampusFlowStore(
    (state) => state.assignments
  );

  const tasks = useCampusFlowStore(
    (state) => state.tasks
  );

  const overrides = useCampusFlowStore(
    (state) => state.overrides
  );

  const [input, setInput] = useState("");

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      text: "Hi Krupa! I’m Campus AI. I can help you understand what’s coming up, what’s due, and what you should focus on next.",
    },
  ]);

  const tomorrow = useMemo(() => getTomorrow(), []);

  const tomorrowDate = getDateKey(tomorrow);
  const tomorrowDay = getDayName(tomorrow);

  const tomorrowClasses = useMemo(() => {
    return timetable
      .filter((item) => item.day === tomorrowDay)
      .sort((a, b) =>
        a.startTime.localeCompare(b.startTime)
      );
  }, [timetable, tomorrowDay]);

  const tomorrowAssignments = useMemo(() => {
    return assignments.filter(
      (assignment) =>
        !assignment.completed &&
        assignment.dueDate === tomorrowDate
    );
  }, [assignments, tomorrowDate]);

  const tomorrowTasks = useMemo(() => {
    return tasks.filter(
      (task) =>
        !task.completed &&
        task.dueDate === tomorrowDate
    );
  }, [tasks, tomorrowDate]);

  const pendingAssignments = assignments.filter(
    (assignment) => !assignment.completed
  );

  const pendingTasks = tasks.filter(
    (task) => !task.completed
  );

  function generateResponse(question: string) {
    const q = question.toLowerCase();

    /*
     * TOMORROW
     */
    if (
      q.includes("tomorrow") ||
      q.includes("next day")
    ) {
      const lines: string[] = [];

      if (tomorrowClasses.length > 0) {
        lines.push("**Tomorrow's schedule**");

        tomorrowClasses.forEach((item) => {
          lines.push(
            `${item.startTime} — ${item.subject} · ${item.room}`
          );
        });
      } else {
        lines.push(
          "You don't have any regular classes scheduled tomorrow."
        );
      }

      if (tomorrowAssignments.length > 0) {
        lines.push("");
        lines.push(
          `You also have ${tomorrowAssignments.length} assignment${
            tomorrowAssignments.length === 1 ? "" : "s"
          } due tomorrow.`
        );

        tomorrowAssignments.forEach((assignment) => {
          lines.push(
            `• ${assignment.title} — ${assignment.priority} priority`
          );
        });
      }

      if (tomorrowTasks.length > 0) {
        lines.push("");
        lines.push(
          `You have ${tomorrowTasks.length} task${
            tomorrowTasks.length === 1 ? "" : "s"
          } due tomorrow.`
        );
      }

      return lines.join("\n");
    }

    /*
     * ASSIGNMENTS
     */
    if (
      q.includes("assignment") ||
      q.includes("deadline") ||
      q.includes("due")
    ) {
      if (pendingAssignments.length === 0) {
        return "You have no pending assignments right now. You're all caught up.";
      }

      const sorted = [...pendingAssignments].sort(
        (a, b) =>
          new Date(a.dueDate).getTime() -
          new Date(b.dueDate).getTime()
      );

      const lines = [
        `You have ${sorted.length} pending assignment${
          sorted.length === 1 ? "" : "s"
        }.`,
        "",
        "**Upcoming deadlines**",
      ];

      sorted.slice(0, 5).forEach((assignment) => {
        lines.push(
          `• ${assignment.title} — ${assignment.dueDate} — ${assignment.priority} priority`
        );
      });

      return lines.join("\n");
    }

    /*
     * TASKS / WHAT SHOULD I WORK ON
     */
    if (
      q.includes("task") ||
      q.includes("todo") ||
      q.includes("to-do") ||
      q.includes("work on") ||
      q.includes("finish") ||
      q.includes("focus")
    ) {
      if (
        pendingTasks.length === 0 &&
        pendingAssignments.length === 0
      ) {
        return "You don't have any pending academic work recorded. You're all caught up.";
      }

      const priorityOrder = {
        High: 0,
        Medium: 1,
        Low: 2,
      };

      const sortedTasks = [...pendingTasks].sort(
        (a, b) =>
          priorityOrder[a.priority] -
          priorityOrder[b.priority]
      );

      const lines = ["**Your current priorities**", ""];

      sortedTasks.slice(0, 3).forEach((task, index) => {
        lines.push(
          `${index + 1}. ${task.title} — ${task.priority} priority`
        );
      });

      if (pendingAssignments.length > 0) {
        const highestAssignment =
          [...pendingAssignments].sort((a, b) => {
            return (
              priorityOrder[a.priority] -
              priorityOrder[b.priority]
            );
          })[0];

        lines.push("");
        lines.push(
          `Your next academic priority could be **${highestAssignment.title}**, due ${highestAssignment.dueDate}.`
        );
      }

      return lines.join("\n");
    }

    /*
     * SCHEDULE
     */
    if (
      q.includes("schedule") ||
      q.includes("class") ||
      q.includes("timetable")
    ) {
      if (tomorrowClasses.length === 0) {
        return "You don't have any regular classes scheduled tomorrow.";
      }

      return [
        "**Your next scheduled classes**",
        "",
        ...tomorrowClasses.map(
          (item) =>
            `${item.startTime} — ${item.subject} · ${item.code} · ${item.room}`
        ),
      ].join("\n");
    }

    /*
     * CHANGES
     */
    if (
      q.includes("change") ||
      q.includes("changed") ||
      q.includes("cancel") ||
      q.includes("override")
    ) {
      const tomorrowChanges = overrides.filter(
        (override) => override.date === tomorrowDate
      );

      if (tomorrowChanges.length === 0) {
        return "I don't see any schedule changes recorded for tomorrow. Your regular schedule is currently active.";
      }

      return [
        "**Schedule changes for tomorrow**",
        "",
        ...tomorrowChanges.map(
          (override) =>
            `• ${override.action.toUpperCase()} — ${override.subject} · ${override.startTime}–${override.endTime}`
        ),
      ].join("\n");
    }

    /*
     * OVERVIEW / HELP
     */
    if (
      q.includes("what can you do") ||
      q.includes("help") ||
      q.includes("hello") ||
      q.includes("hi")
    ) {
      return [
        "I can help you with your CampusFlow data.",
        "",
        "Try asking:",
        "• What do I have tomorrow?",
        "• What assignments are due?",
        "• What should I work on?",
        "• Did anything change tomorrow?",
        "• What classes do I have?",
      ].join("\n");
    }

    return [
      "I can help you navigate your academic workload.",
      "",
      "Try asking me about:",
      "• Tomorrow's classes",
      "• Upcoming assignments",
      "• Priority tasks",
      "• Schedule changes",
      "• What you should focus on",
    ].join("\n");
  }

  function sendMessage(text?: string) {
    const question = (text ?? input).trim();

    if (!question) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      text: question,
    };

    const response = generateResponse(question);

    const assistantMessage: Message = {
      id: crypto.randomUUID(),
      role: "assistant",
      text: response,
    };

    setMessages((current) => [
      ...current,
      userMessage,
      assistantMessage,
    ]);

    setInput("");
  }

  return (
    <AppShell>
      <main className="h-full min-h-0 overflow-hidden bg-background p-4 md:p-6 lg:p-8">
        <div className="mx-auto h-full max-w-7xl">
          <div className="grid h-full min-h-0 gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">

            {/* CHAT */}
            <section className="flex min-h-0 min-w-0 flex-col">

              {/* Header */}
              <div className="pixel-border shrink-0 bg-card p-5 md:p-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-primary/30 bg-primary/10">
                    <Bot className="h-6 w-6 text-primary" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="pixel text-xs text-primary">
                        CAMPUSFLOW // INTELLIGENCE
                      </p>

                      <span className="flex items-center gap-1 text-[10px] text-success">
                        <span className="h-1.5 w-1.5 rounded-full bg-success" />
                        ONLINE
                      </span>
                    </div>

                    <h1 className="pixel-heading mt-1 text-2xl md:text-3xl">
                      CAMPUS AI
                    </h1>

                    <p className="mt-1 text-xs text-muted-foreground">
                      YOUR ACADEMIC COPILOT
                    </p>
                  </div>
                </div>
              </div>

              {/* Chat area */}
              <div className="mt-4 flex min-h-0 flex-1 flex-col overflow-hidden pixel-border-subtle bg-card">

                <div className="min-h-0 flex-1 space-y-5 overflow-y-auto p-4 md:p-6">
                  {messages.map((message) => (
                    <ChatMessage
                      key={message.id}
                      message={message}
                    />
                  ))}
                </div>

                {/* Suggestions */}
                <div className="border-t border-border px-4 py-4 md:px-6">
                  <div className="mb-3 flex items-center gap-2">
                    <Sparkles className="h-3.5 w-3.5 text-primary" />

                    <span className="pixel text-[10px] text-muted-foreground">
                      SUGGESTED
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <SuggestionButton
                      text="What do I have tomorrow?"
                      onClick={() =>
                        sendMessage(
                          "What do I have tomorrow?"
                        )
                      }
                    />

                    <SuggestionButton
                      text="What is due next?"
                      onClick={() =>
                        sendMessage(
                          "What assignments are due?"
                        )
                      }
                    />

                    <SuggestionButton
                      text="What should I work on?"
                      onClick={() =>
                        sendMessage(
                          "What should I work on?"
                        )
                      }
                    />

                    <SuggestionButton
                      text="Did anything change?"
                      onClick={() =>
                        sendMessage(
                          "Did anything change tomorrow?"
                        )
                      }
                    />
                  </div>
                </div>

                {/* Input */}
                <div className="shrink-0 border-t border-border p-4 md:p-5">
                  <form
                    onSubmit={(event) => {
                      event.preventDefault();
                      sendMessage();
                    }}
                    className="flex gap-2"
                  >
                    <input
                      value={input}
                      onChange={(event) =>
                        setInput(event.target.value)
                      }
                      placeholder="Ask Campus AI..."
                      className="h-11 min-w-0 flex-1 border border-border bg-muted px-4 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary"
                    />

                    <button
                      type="submit"
                      className="pixel-button pixel-border flex h-11 w-11 shrink-0 items-center justify-center bg-primary text-primary-foreground"
                      aria-label="Send message"
                    >
                      <Send className="h-4 w-4" />
                    </button>
                  </form>

                  <p className="mt-2 text-[10px] text-muted-foreground">
                    Campus AI uses your CampusFlow academic
                    context to answer.
                  </p>
                </div>
              </div>
            </section>

            {/* CONTEXT PANEL */}
            <aside className="space-y-4">

              {/* Context */}
              <div className="pixel-border-subtle bg-card p-5">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />

                  <div>
                    <p className="pixel text-[10px] text-primary">
                      CONTEXT
                    </p>

                    <h2 className="pixel mt-1 text-sm">
                      CAMPUSFLOW DATA
                    </h2>
                  </div>
                </div>

                <div className="mt-5 space-y-3">
                  <ContextRow
                    icon={CalendarDays}
                    label="Classes"
                    value={timetable.length}
                  />

                  <ContextRow
                    icon={Clock3}
                    label="Pending assignments"
                    value={pendingAssignments.length}
                  />

                  <ContextRow
                    icon={CheckCircle2}
                    label="Pending tasks"
                    value={pendingTasks.length}
                  />
                </div>
              </div>

              {/* Tomorrow */}
              <div className="pixel-border-subtle bg-card p-5">
                <p className="pixel text-[10px] text-primary">
                  TOMORROW
                </p>

                <h2 className="pixel-heading mt-1 text-lg">
                  {tomorrow.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </h2>

                <div className="mt-4 space-y-2">
                  <MiniStat
                    label="Classes"
                    value={tomorrowClasses.length}
                  />

                  <MiniStat
                    label="Assignments due"
                    value={tomorrowAssignments.length}
                  />

                  <MiniStat
                    label="Tasks due"
                    value={tomorrowTasks.length}
                  />
                </div>
              </div>

              {/* Example questions */}
              <div className="pixel-border-subtle bg-card p-5">
                <p className="pixel text-[10px] text-muted-foreground">
                  ASK CAMPUS AI
                </p>

                <div className="mt-4 space-y-2">
                  <QuestionLink
                    text="What do I have tomorrow?"
                    onClick={() =>
                      sendMessage(
                        "What do I have tomorrow?"
                      )
                    }
                  />

                  <QuestionLink
                    text="What should I finish first?"
                    onClick={() =>
                      sendMessage(
                        "What should I finish first?"
                      )
                    }
                  />

                  <QuestionLink
                    text="Are there any schedule changes?"
                    onClick={() =>
                      sendMessage(
                        "Are there any schedule changes?"
                      )
                    }
                  />
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </AppShell>
  );
}

/* -------------------------------- */
/* CHAT MESSAGE */
/* -------------------------------- */

function ChatMessage({
  message,
}: {
  message: Message;
}) {
  const isUser = message.role === "user";

  return (
    <div
      className={`flex gap-3 ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      {!isUser && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center border border-primary/30 bg-primary/10">
          <Bot className="h-4 w-4 text-primary" />
        </div>
      )}

      <div
        className={`max-w-[85%] border p-4 md:max-w-[75%] ${
          isUser
            ? "border-primary/30 bg-primary/10"
            : "border-border bg-muted"
        }`}
      >
        {!isUser && (
          <p className="pixel mb-2 text-[9px] text-primary">
            CAMPUS AI
          </p>
        )}

        <p className="whitespace-pre-line text-sm leading-6">
          {message.text}
        </p>
      </div>

      {isUser && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center border border-border bg-muted">
          <User className="h-4 w-4" />
        </div>
      )}
    </div>
  );
}

/* -------------------------------- */
/* SUGGESTION BUTTON */
/* -------------------------------- */

function SuggestionButton({
  text,
  onClick,
}: {
  text: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="pixel-border-subtle bg-card px-3 py-2 text-[11px] transition-all hover:-translate-y-0.5 hover:bg-muted"
    >
      {text}
    </button>
  );
}

/* -------------------------------- */
/* CONTEXT ROW */
/* -------------------------------- */

function ContextRow({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: number;
}) {
  return (
    <div className="flex items-center gap-3 border border-border bg-muted p-3">
      <Icon className="h-4 w-4 text-primary" />

      <span className="flex-1 text-xs text-muted-foreground">
        {label}
      </span>

      <span className="pixel text-xs">
        {value}
      </span>
    </div>
  );
}

/* -------------------------------- */
/* MINI STAT */
/* -------------------------------- */

function MiniStat({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="flex items-center justify-between border border-border bg-muted px-3 py-2">
      <span className="text-xs text-muted-foreground">
        {label}
      </span>

      <span className="pixel text-xs text-primary">
        {value}
      </span>
    </div>
  );
}

/* -------------------------------- */
/* QUESTION LINK */
/* -------------------------------- */

function QuestionLink({
  text,
  onClick,
}: {
  text: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex w-full items-center gap-2 border border-border bg-muted p-3 text-left transition-all hover:border-primary/40 hover:bg-primary/5"
    >
      <span className="flex-1 text-xs">
        {text}
      </span>

      <ArrowRight className="h-3.5 w-3.5 text-primary transition-transform group-hover:translate-x-1" />
    </button>
  );
}