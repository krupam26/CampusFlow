"use client";

import { useState } from "react";
import {
  CheckCircle2,
  Clock3,
  FileText,
  Trash2,
} from "lucide-react";

import { AppShell } from "@/components/layout/app-shell";
import { AddAssignmentDialog } from "@/components/assignments/add-assignment-dialog";
import { useCampusFlowStore } from "@/stores/campusflow-store";
import type { Assignment } from "@/types/campusflow";

type AssignmentSort =
  | "dueDate"
  | "priority"
  | "status"
  | "title";

export default function AssignmentsPage() {
  const [sortBy, setSortBy] =
    useState<AssignmentSort>("dueDate");

  const assignments = useCampusFlowStore(
    (state) => state.assignments
  );

  const deleteAssignment = useCampusFlowStore(
    (state) => state.deleteAssignment
  );

  const toggleAssignment = useCampusFlowStore(
    (state) => state.toggleAssignment
  );

  const completed = assignments.filter(
    (assignment) =>
      assignment.completed || assignment.status === "Completed"
  ).length;

  const pending = assignments.filter(
    (assignment) =>
      !assignment.completed && assignment.status !== "Completed"
  ).length;

  const sortedAssignments = [...assignments].sort((a, b) => {
    if (sortBy === "title") {
      return a.title.localeCompare(b.title);
    }

    if (sortBy === "priority") {
      const priorityRank = { High: 0, Medium: 1, Low: 2 };
      return priorityRank[a.priority] - priorityRank[b.priority];
    }

    if (sortBy === "status") {
      const statusRank = {
        Pending: 0,
        "In Progress": 1,
        Completed: 2,
      };
      return statusRank[a.status] - statusRank[b.status];
    }

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
                ACADEMIC WORK
              </p>

              <h1 className="pixel-heading mt-1 text-3xl md:text-4xl">
                ASSIGNMENTS
              </h1>

              <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                Track deadlines, priorities and academic submissions.
              </p>
            </div>

            <AddAssignmentDialog />
          </section>

          {/* SUMMARY */}
          <section className="grid gap-4 sm:grid-cols-3">
            <SummaryCard
              label="TOTAL"
              value={assignments.length}
              icon={FileText}
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

          {/* ASSIGNMENT LIST */}
          <section>
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="pixel text-xs text-primary">
                  ACADEMIC WORKLOAD
                </p>

                <h2 className="pixel-heading mt-1 text-xl">
                  YOUR ASSIGNMENTS
                </h2>
              </div>

              <label className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>Sort by</span>
                <select
                  value={sortBy}
                  onChange={(event) =>
                    setSortBy(
                      event.target.value as AssignmentSort
                    )
                  }
                  className="form-input h-11 w-auto min-w-36 py-1 text-xs"
                >
                  <option value="dueDate">Due date</option>
                  <option value="priority">Priority</option>
                  <option value="status">Status</option>
                  <option value="title">Title</option>
                </select>
              </label>
            </div>

            {sortedAssignments.length === 0 ? (
              <div className="pixel-border-subtle flex min-h-48 flex-col items-center justify-center bg-card text-center">
                <FileText className="mb-3 h-7 w-7 text-muted-foreground" />

                <p className="pixel text-sm">
                  NO ASSIGNMENTS YET
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  Add your first assignment to get started.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {sortedAssignments.map((assignment) => (
                  <AssignmentCard
                    key={assignment.id}
                    assignment={assignment}
                    onToggle={() =>
                      toggleAssignment(assignment.id)
                    }
                    onDelete={() =>
                      deleteAssignment(assignment.id)
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

function AssignmentCard({
  assignment,
  onToggle,
  onDelete,
}: {
  assignment: Assignment;
  onToggle: () => void;
  onDelete: () => void;
}) {
  const status = assignment.completed
    ? "Completed"
    : assignment.status ?? "Pending";
  const isCompleted =
    assignment.completed ?? status === "Completed";

  const statusClass =
    status === "Completed"
      ? "assignment-status-completed"
      : status === "In Progress"
        ? "assignment-status-progress"
        : "assignment-status-pending";

  const priorityClass =
    assignment.priority === "High"
      ? "assignment-priority-high"
      : assignment.priority === "Medium"
        ? "assignment-priority-medium"
        : "assignment-priority-low";

  const statusStyle =
    status === "Completed"
      ? { backgroundColor: "#dcfce7", color: "#166534" }
      : status === "In Progress"
        ? { backgroundColor: "#e0f2fe", color: "#075985" }
        : { backgroundColor: "#fef3c7", color: "#92400e" };

  const priorityStyle =
    assignment.priority === "High"
      ? { backgroundColor: "#fee2e2", color: "#991b1b" }
      : assignment.priority === "Medium"
        ? { backgroundColor: "#fef3c7", color: "#92400e" }
        : { backgroundColor: "#e0f2fe", color: "#075985" };

  return (
    <div
      className={`pixel-border-subtle bg-card p-5 transition-all ${
        isCompleted ? "opacity-60" : ""
      }`}
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-center">

        {/* CHECK */}
        <button
          type="button"
          onClick={onToggle}
          className="shrink-0 self-start text-primary transition-transform hover:scale-110 md:self-center"
          aria-label={
            isCompleted
              ? "Mark assignment incomplete"
              : "Mark assignment complete"
          }
        >
          {isCompleted ? (
            <CheckCircle2 className="h-6 w-6" />
          ) : (
            <span className="block h-6 w-6 rounded-full border-2 border-current" />
          )}
        </button>

        {/* CONTENT */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3
              className={`pixel text-sm ${
                isCompleted ? "line-through" : ""
              }`}
            >
              {assignment.title}
            </h3>

            {assignment.code && (
              <span className="border border-border bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">
                {assignment.code}
              </span>
            )}
          </div>

          <p className="mt-1 text-xs text-muted-foreground">
            {assignment.subject}
          </p>

          {assignment.description && (
            <p className="mt-2 text-xs text-muted-foreground">
              {assignment.description}
            </p>
          )}

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span
              className={`border px-2 py-0.5 text-[10px] ${statusClass}`}
              style={statusStyle}
            >
              {status.toUpperCase()}
            </span>

            <span
              className={`px-2 py-0.5 text-[10px] ${priorityClass}`}
              style={priorityStyle}
            >
              {assignment.priority.toUpperCase()} PRIORITY
            </span>

            <span className="border border-border bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">
              DUE {assignment.dueDate}
            </span>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex shrink-0 gap-2">
          <AddAssignmentDialog
            assignment={assignment}
            trigger={<span>EDIT</span>}
          />

          <button
            type="button"
            onClick={onDelete}
            className="pixel-border-subtle flex h-9 w-9 items-center justify-center bg-destructive/10 text-destructive transition-all hover:-translate-y-0.5 hover:bg-destructive/20"
            aria-label="Delete assignment"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}