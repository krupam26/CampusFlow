"use client";

import {
  CheckCircle2,
  Circle,
  Clock3,
  ListTodo,
  Trash2,
} from "lucide-react";

import { AppShell } from "@/components/layout/app-shell";
import { AddTaskDialog } from "@/components/tasks/add-task-dialog";
import { useCampusFlowStore } from "@/stores/campusflow-store";
import type { Task } from "@/types/campusflow";

export default function TasksPage() {
  const tasks = useCampusFlowStore(
    (state) => state.tasks
  );

  const deleteTask = useCampusFlowStore(
    (state) => state.deleteTask
  );

  const toggleTask = useCampusFlowStore(
    (state) => state.toggleTask
  );

  const completed = tasks.filter(
    (task) => task.completed
  ).length;

  const pending = tasks.filter(
    (task) => !task.completed
  ).length;

  const sortedTasks = [...tasks].sort((a, b) => {
    if (!a.dueDate) return 1;
    if (!b.dueDate) return -1;

    return (
      new Date(a.dueDate).getTime() -
      new Date(b.dueDate).getTime()
    );
  });

  return (
    <AppShell>
      <main className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl space-y-8">

          {/* HEADER */}
          <section className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="pixel text-xs text-primary">
                PERSONAL PRODUCTIVITY
              </p>

              <h1 className="pixel-heading mt-1 text-3xl md:text-4xl">
                TASKS
              </h1>

              <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                Keep track of everything you need to get done.
              </p>
            </div>

            <AddTaskDialog />
          </section>

          {/* SUMMARY */}
          <section className="grid gap-4 sm:grid-cols-3">
            <SummaryCard
              label="TOTAL"
              value={tasks.length}
              icon={ListTodo}
            />

            <SummaryCard
              label="PENDING"
              value={pending}
              icon={Clock3}
            />

            <SummaryCard
              label="COMPLETED"
              value={completed}
              icon={CheckCircle2}
            />
          </section>

          {/* LIST */}
          <section>
            <div className="mb-4">
              <p className="pixel text-xs text-primary">
                YOUR WORK
              </p>

              <h2 className="pixel-heading mt-1 text-xl">
                TO-DO LIST
              </h2>
            </div>

            {sortedTasks.length === 0 ? (
              <div className="pixel-border-subtle flex min-h-48 flex-col items-center justify-center bg-card text-center">
                <ListTodo className="mb-3 h-7 w-7 text-muted-foreground" />

                <p className="pixel text-sm">
                  NO TASKS YET
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  Add your first task to get started.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {sortedTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onToggle={() =>
                      toggleTask(task.id)
                    }
                    onDelete={() =>
                      deleteTask(task.id)
                    }
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </AppShell>
  );
}

function SummaryCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number;
  icon: React.ElementType;
}) {
  return (
    <div className="pixel-border-subtle bg-card p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="pixel text-[10px] text-muted-foreground">
            {label}
          </p>

          <p className="pixel-heading mt-2 text-3xl">
            {value}
          </p>
        </div>

        <div className="flex h-9 w-9 items-center justify-center border border-border bg-muted">
          <Icon className="h-4 w-4 text-primary" />
        </div>
      </div>
    </div>
  );
}

function TaskCard({
  task,
  onToggle,
  onDelete,
}: {
  task: Task;
  onToggle: () => void;
  onDelete: () => void;
}) {
  const statusClass =
    task.status === "Completed"
      ? "assignment-status-completed"
      : task.status === "In Progress"
        ? "assignment-status-progress"
        : "assignment-status-pending";

  const priorityClass =
    task.priority === "High"
      ? "assignment-priority-high"
      : task.priority === "Medium"
        ? "assignment-priority-medium"
        : "assignment-priority-low";

  return (
    <div
      className={`pixel-border-subtle bg-card p-5 transition-all ${
        task.completed ? "opacity-60" : ""
      }`}
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-center">

        {/* CHECK */}
        <button
          type="button"
          onClick={onToggle}
          className="shrink-0 self-start text-primary transition-transform hover:scale-110 md:self-center"
        >
          {task.completed ? (
            <CheckCircle2 className="h-6 w-6" />
          ) : (
            <Circle className="h-6 w-6" />
          )}
        </button>

        {/* CONTENT */}
        <div className="min-w-0 flex-1">
          <h3
            className={`pixel text-sm ${
              task.completed ? "line-through" : ""
            }`}
          >
            {task.title}
          </h3>

          {task.description && (
            <p className="mt-1 text-xs text-muted-foreground">
              {task.description}
            </p>
          )}

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span
              className={`border px-2 py-0.5 text-[10px] ${statusClass}`}
            >
              {(task.status ?? "Pending").toUpperCase()}
            </span>

            <span
              className={`px-2 py-0.5 text-[10px] ${priorityClass}`}
            >
              {task.priority.toUpperCase()} PRIORITY
            </span>

            {task.dueDate && (
              <span className="border border-border bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">
                DUE {task.dueDate}
              </span>
            )}
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex shrink-0 gap-2">
          <AddTaskDialog
            task={task}
            trigger={
              <>
                <span>EDIT</span>
              </>
            }
          />

          <button
            type="button"
            onClick={onDelete}
            className="pixel-border-subtle flex h-9 w-9 items-center justify-center bg-destructive/10 text-destructive transition-all hover:-translate-y-0.5 hover:bg-destructive/20"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}