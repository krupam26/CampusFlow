"use client";

import {
  Circle,
  Flag,
  Timer,
} from "lucide-react";
import { useState } from "react";

const tasks = [
  {
    title: "Finish FST Assignment 5",
    time: "45 MIN",
    priority: "HIGH",
    xp: "+50 XP",
  },
  {
    title: "Prepare CN lab notes",
    time: "30 MIN",
    priority: "MEDIUM",
    xp: "+30 XP",
  },
  {
    title: "Review ML lecture",
    time: "20 MIN",
    priority: "LOW",
    xp: "+20 XP",
  },
];

export function PriorityTasks() {
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);

  const toggleTask = (title: string) => {
    setCompletedTasks((current) =>
      current.includes(title)
        ? current.filter((task) => task !== title)
        : [...current, title],
    );
  };

  return (
    <section className="rounded-2xl border-2 bg-card p-5 shadow-[4px_4px_0_rgba(24,24,31,0.06)] sm:p-6">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="pixel text-[10px] text-primary">
            // TODAY
          </p>

          <h2 className="mt-2 text-xl font-bold tracking-tight">
            PRIORITY QUESTS
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Complete these to keep your streak alive
          </p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Flag className="h-4 w-4" />
        </div>
      </div>

      <div className="space-y-2">
        {tasks.map((task, index) => (
          <div
            key={task.title}
            className={`flex items-center gap-3 rounded-xl border-2 p-3.5 transition-all hover:bg-muted/50 ${completedTasks.includes(task.title) ? "border-success/50 bg-success/10" : ""}`}
          >
            <span className="pixel flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-muted text-[10px]">
              0{index + 1}
            </span>

            <button
              onClick={() => toggleTask(task.title)}
              className={`shrink-0 ${completedTasks.includes(task.title) ? "text-success" : "text-muted-foreground hover:text-primary"}`}
              aria-label={`Complete ${task.title}`}
              aria-pressed={completedTasks.includes(task.title)}
            >
              <Circle className={`h-5 w-5 ${completedTasks.includes(task.title) ? "fill-success/20" : ""}`} />
            </button>

            <div className="min-w-0 flex-1">
              <p className={`truncate text-sm font-bold ${completedTasks.includes(task.title) ? "text-muted-foreground line-through" : ""}`}>
                {task.title}
              </p>

              <div className="mt-1 flex items-center gap-2 text-[10px] text-muted-foreground">
                <Timer className="h-3 w-3" />
                {task.time}
              </div>
            </div>

            <div className="hidden text-right sm:block">
              <p className="pixel text-[8px] text-primary">
                {task.xp}
              </p>

              <p className="pixel mt-1 text-[8px] text-muted-foreground">
                {task.priority}
              </p>
            </div>
          </div>
        ))}
      </div>

      <button className="pixel mt-4 w-full rounded-lg border-2 border-dashed py-3 text-[10px] text-muted-foreground hover:bg-muted">
        + ADD NEW QUEST
      </button>
    </section>
  );
}