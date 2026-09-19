"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Bot,
  CalendarDays,
  CheckCircle2,
  Clock3,
  ListTodo,
  Pin,
  Send,
  Sparkles,
  User,
} from "lucide-react";

import { AppShell } from "@/components/layout/app-shell";
import { useCampusFlowStore } from "@/stores/campusflow-store";
import { getCampusAIResponse } from "@/lib/campus-ai";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

const suggestions = [
  "What do I have tomorrow?",
  "What's due?",
  "What tasks do I have?",
  "Did anything change tomorrow?",
];

export default function AIPage() {
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
      content:
        "Hi Krupa. I'm Campus AI. I can help you understand your timetable, assignments, tasks, and schedule changes. What do you want to know?",
    },
  ]);

  function sendMessage(text?: string) {
    const question = (text ?? input).trim();

    if (!question) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: question,
    };

    const response = getCampusAIResponse(question, {
      timetable,
      assignments,
      tasks,
      overrides,
    });

    const assistantMessage: Message = {
      id: crypto.randomUUID(),
      role: "assistant",
      content: response,
    };

    setMessages((current) => [
      ...current,
      userMessage,
      assistantMessage,
    ]);

    setInput("");
  }

  function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    sendMessage();
  }

  return (
    <AppShell>
      <main className="h-[calc(100dvh-60px)] overflow-hidden bg-background p-4 md:p-5 lg:p-6">
        <div className="mx-auto h-full max-w-7xl">

          <div className="grid h-full min-h-0 grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_300px]">

            {/* CHAT */}
            <section className="flex min-h-0 min-w-0 flex-col">

              {/* HEADER */}
              <div className="shrink-0">
                <p className="pixel text-xs text-primary">
                  CAMPUSFLOW // INTELLIGENCE
                </p>

                <h1 className="pixel-heading mt-1 text-2xl md:text-3xl">
                  CAMPUS AI
                </h1>
              </div>

              <div className="mt-3 flex min-h-0 flex-1 flex-col pixel-border-subtle bg-card">

                {/* MESSAGES */}
                <div className="min-h-0 flex-1 overflow-y-auto p-4 md:p-5">
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
                            "max-w-[85%] whitespace-pre-line border p-3 text-sm leading-6",
                            message.role === "user"
                              ? "border-primary/30 bg-primary/10"
                              : "border-border bg-muted",
                          ].join(" ")}
                        >
                          {message.content}
                        </div>

                        {message.role === "user" && (
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center border border-border bg-muted">
                            <User className="h-4 w-4" />
                          </div>
                        )}
                      </div>
                    ))}

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
                      placeholder="Ask Campus AI..."
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
                    Campus AI uses your CampusFlow academic context.
                  </p>
                </div>
              </div>
            </section>

            {/* CONTEXT PANEL */}
            <aside className="hidden min-h-0 space-y-4 overflow-y-auto pr-1 lg:block">
              <div className="relative pixel-border-subtle bg-card p-5">
                <Pin className="absolute right-3 top-3 h-4 w-4 rotate-12 fill-primary text-primary" aria-hidden="true" />
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <div>
                    <p className="pixel text-xs text-primary">CONTEXT</p>
                    <h2 className="pixel mt-1 text-sm">CAMPUSFLOW DATA</h2>
                  </div>
                </div>
                <div className="mt-5 space-y-3">
                  <ContextCard icon={CalendarDays} title="CLASSES" description={`${timetable.length} scheduled`} />
                  <ContextCard
                    href="/assignments"
                    icon={Clock3}
                    title="ASSIGNMENTS"
                    description={`${assignments.filter((item) => !item.completed).length} pending`}
                  />
                  <ContextCard
                    href="/tasks"
                    icon={CheckCircle2}
                    title="TASKS"
                    description={`${tasks.filter((item) => !item.completed).length} pending`}
                  />
                </div>
              </div>

              <div className="relative pixel-border-subtle bg-card p-5">
                <Pin className="absolute right-3 top-3 h-4 w-4 -rotate-12 fill-primary text-primary" aria-hidden="true" />
                <p className="pixel text-xs text-primary">TOMORROW</p>
                <h2 className="pixel-heading mt-1 text-lg">YOUR NEXT ACADEMIC DAY</h2>
                <div className="mt-4 space-y-2">
                  <ContextCard icon={CalendarDays} title="SCHEDULE" description={`${overrides.length} recorded changes`} />
                  <ContextCard
                    icon={ListTodo}
                    title="WORKLOAD"
                    description={`${assignments.filter((item) => !item.completed).length + tasks.filter((item) => !item.completed).length} pending items`}
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

function ContextCard({
  href,
  icon: Icon,
  title,
  description,
}: {
  href?: string;
  icon: typeof Bot;
  title: string;
  description: string;
}) {
  const content = (
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center border border-primary/20 bg-primary/10 text-primary">
          <Icon className="h-4 w-4" />
        </div>

        <div>
          <p className="pixel text-xs">
            {title}
          </p>

          <p className="mt-1 text-xs text-muted-foreground">
            {description}
          </p>
        </div>
      </div>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="pixel-border-subtle block bg-card p-4 transition-colors hover:border-primary hover:bg-primary/5"
      >
        {content}
      </Link>
    );
  }

  return (
    <div className="pixel-border-subtle bg-card p-4">
      {content}
    </div>
  );
}