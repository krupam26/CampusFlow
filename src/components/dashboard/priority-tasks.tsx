"use client";

import { useMemo } from "react";
import {
  Circle,
  Flag,
  Timer,
} from "lucide-react";
import { AddTaskDialog } from "@/components/tasks/add-task-dialog";
import { useCampusFlowStore } from "@/stores/campusflow-store";

export function PriorityTasks() {
  const allTasks = useCampusFlowStore((state) => state.tasks);
  const tasks = useMemo(
    () =>
      [...allTasks]
      .filter((task) => !task.completed)
      .sort((a, b) => {
        const priorityRank = { High: 0, Medium: 1, Low: 2 };
        return priorityRank[a.priority] - priorityRank[b.priority];
      })
      .slice(0, 3),
    [allTasks]
  );
  const toggleTask = useCampusFlowStore((state) => state.toggleTask);

  return (
    <section className="rounded-2xl border-2 bg-card p-5 shadow-[4px_4px_0_rgba(24,24,31,0.06)] sm:p-6">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="pixel text-[10px] text-primary">
              {"// TODAY"}
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
            key={task.id}
            className="flex items-center gap-3 rounded-xl border-2 p-3.5 transition-all hover:bg-muted/50"
          >
            <span className="pixel flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-muted text-[10px]">
              0{index + 1}
            </span>

            <button
              onClick={() => toggleTask(task.id)}
              className="shrink-0 text-muted-foreground hover:text-primary"
              aria-label={`Complete ${task.title}`}
              aria-pressed={false}
            >
              <Circle className="h-5 w-5" />
            </button>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold">
                {task.title}
              </p>

              <div className="mt-1 flex items-center gap-2 text-[10px] text-muted-foreground">
                <Timer className="h-3 w-3" />
                {task.dueDate ? `DUE ${task.dueDate}` : "NO DUE DATE"}
              </div>
            </div>

            <div className="hidden text-right sm:block">
              <p className="pixel text-[8px] text-primary">
                {task.priority}
              </p>

              <p className="pixel mt-1 text-[8px] text-muted-foreground">
                PENDING
              </p>
            </div>
          </div>
        ))}
      </div>

      <AddTaskDialog
        trigger={
          <span className="pixel mt-4 flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-primary/40 bg-primary/5 py-3 text-xs font-semibold text-primary transition-colors hover:bg-primary/10">
            <span className="text-base leading-none">+</span>
            ADD NEW QUEST
          </span>
        }
      />
    </section>
  );
}