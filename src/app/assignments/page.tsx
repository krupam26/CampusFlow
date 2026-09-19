"use client";

import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  Plus,
} from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";

const assignments = [
  {
    id: 1,
    title: "FST Assignment 2",
    subject: "Full Stack Development",
    code: "FST",
    due: "Sep 22",
    status: "Pending",
    priority: "High",
  },
  {
    id: 2,
    title: "ADSA Lab Assignment",
    subject: "Advanced Data Structures",
    code: "ADSA",
    due: "Sep 24",
    status: "Pending",
    priority: "Medium",
  },
  {
    id: 3,
    title: "AIML Mini Project",
    subject: "Artificial Intelligence & ML",
    code: "AIML",
    due: "Sep 28",
    status: "In Progress",
    priority: "High",
  },
];

export default function AssignmentsPage() {
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
                Keep track of upcoming submissions, deadlines and
                coursework in one place.
              </p>
            </div>

            <button className="pixel-button pixel-border inline-flex h-10 items-center justify-center gap-2 bg-primary px-4 text-xs font-semibold text-primary-foreground">
              <Plus className="h-4 w-4" />
              ADD ASSIGNMENT
            </button>
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
              value={
                assignments.filter(
                  (item) => item.status !== "Completed"
                ).length
              }
              icon={Clock3}
            />

            <SummaryCard
              label="COMPLETED"
              value={
                assignments.filter(
                  (item) => item.status === "Completed"
                ).length
              }
              icon={CheckCircle2}
            />
          </section>

          {/* ASSIGNMENT LIST */}
          <section>
            <div className="mb-4">
              <p className="pixel text-xs text-primary">
                YOUR WORK
              </p>

              <h2 className="pixel-heading mt-1 text-xl">
                UPCOMING ASSIGNMENTS
              </h2>
            </div>

            <div className="space-y-3">
              {assignments.map((assignment) => (
                <AssignmentCard
                  key={assignment.id}
                  assignment={assignment}
                />
              ))}
            </div>
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
}: {
  assignment: {
    id: number;
    title: string;
    subject: string;
    code: string;
    due: string;
    status: string;
    priority: string;
  };
}) {
  const priorityClass =
    assignment.priority === "High"
      ? "border-destructive/30 bg-destructive/10 text-destructive"
      : "border-warning/30 bg-warning/10 text-warning";

  return (
    <div className="pixel-border-subtle bg-card p-5 transition-all hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_hsl(var(--primary))]">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="pixel text-[10px] text-primary">
              {assignment.code}
            </span>

            <span
              className={`border px-2 py-0.5 text-[10px] ${priorityClass}`}
            >
              {assignment.priority} PRIORITY
            </span>
          </div>

          <h3 className="pixel mt-2 text-base">
            {assignment.title}
          </h3>

          <p className="mt-1 text-xs text-muted-foreground">
            {assignment.subject}
          </p>
        </div>

        <div className="flex items-center gap-5">
          <div>
            <p className="pixel text-[10px] text-muted-foreground">
              DUE
            </p>

            <p className="mt-1 flex items-center gap-1.5 text-sm">
              <CalendarDays className="h-3.5 w-3.5 text-primary" />
              {assignment.due}
            </p>
          </div>

          <span className="border border-border bg-muted px-3 py-1.5 text-[10px]">
            {assignment.status.toUpperCase()}
          </span>
        </div>

      </div>
    </div>
  );
}