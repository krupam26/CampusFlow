"use client";

import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  Pencil,
  Trash2,
} from "lucide-react";

import { AppShell } from "@/components/layout/app-shell";
import { AddAssignmentDialog } from "@/components/assignments/add-assignment-dialog";
import { useCampusFlowStore } from "@/stores/campusflow-store";
import type { Assignment } from "@/types/campusflow";

export default function AssignmentsPage() {
  const assignments = useCampusFlowStore(
    (state) => state.assignments
  );

  const deleteAssignment = useCampusFlowStore(
    (state) => state.deleteAssignment
  );

  const sortedAssignments = [...assignments].sort(
    (a, b) =>
      new Date(a.dueDate).getTime() -
      new Date(b.dueDate).getTime()
  );

  const pending = assignments.filter(
    (item) => item.status !== "Completed"
  ).length;

  const completed = assignments.filter(
    (item) => item.status === "Completed"
  ).length;

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
                Keep track of submissions, deadlines and coursework.
              </p>
            </div>

            <AddAssignmentDialog />
          </section>

          {/* SUMMARY */}
          <section className="grid gap-4 sm:grid-cols-3">
            <SummaryCard
              label="TOTAL"
              value={assignments.length}
              icon={CalendarDays}
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
                UPCOMING ASSIGNMENTS
              </h2>
            </div>

            {sortedAssignments.length === 0 ? (
              <div className="pixel-border-subtle flex min-h-48 flex-col items-center justify-center bg-card text-center">
                <CalendarDays className="mb-3 h-7 w-7 text-muted-foreground" />

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
  onDelete,
}: {
  assignment: Assignment;
  onDelete: () => void;
}) {
  const priorityClass =
    assignment.priority === "High"
      ? "border-destructive/30 bg-destructive/10 text-destructive"
      : assignment.priority === "Medium"
        ? "border-warning/30 bg-warning/10 text-warning"
        : "border-success/30 bg-success/10 text-success";

  return (
    <div className="pixel-border-subtle bg-card p-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="pixel text-[10px] text-primary">
              {assignment.code || "ACADEMIC"}
            </span>

            <span
              className={`border px-2 py-0.5 text-[10px] ${priorityClass}`}
            >
              {assignment.priority.toUpperCase()} PRIORITY
            </span>
          </div>

          <h3 className="pixel mt-2 text-base">
            {assignment.title}
          </h3>

          <p className="mt-1 text-xs text-muted-foreground">
            {assignment.subject}
          </p>

          {assignment.description && (
            <p className="mt-2 text-xs text-muted-foreground">
              {assignment.description}
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div>
            <p className="pixel text-[10px] text-muted-foreground">
              DUE
            </p>

            <p className="mt-1 flex items-center gap-1.5 text-sm">
              <CalendarDays className="h-3.5 w-3.5 text-primary" />
              {assignment.dueDate}
            </p>
          </div>

          <span className="border border-border bg-muted px-3 py-1.5 text-[10px]">
            {assignment.status.toUpperCase()}
          </span>

          <AddAssignmentDialog
            assignment={assignment}
            trigger={
              <>
                <Pencil className="h-3.5 w-3.5" />
                EDIT
              </>
            }
          />

          <button
            type="button"
            onClick={onDelete}
            className="pixel-border-subtle flex h-9 items-center gap-2 bg-destructive/10 px-3 text-xs text-destructive transition-all hover:-translate-y-0.5 hover:bg-destructive/20"
          >
            <Trash2 className="h-3.5 w-3.5" />
            DELETE
          </button>
        </div>
      </div>
    </div>
  );
}