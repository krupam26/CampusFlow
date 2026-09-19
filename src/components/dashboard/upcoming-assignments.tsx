"use client";

import { useMemo } from "react";
import {
  ArrowUpRight,
  CalendarClock,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";

import { useCampusFlowStore } from "@/stores/campusflow-store";

export function UpcomingAssignments() {
  const allAssignments = useCampusFlowStore(
    (state) => state.assignments
  );
  const assignments = useMemo(
    () =>
      [...allAssignments]
      .filter((assignment) => !assignment.completed && assignment.status !== "Completed")
      .sort(
        (a, b) =>
          new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
      )
      .slice(0, 3),
    [allAssignments]
  );

  return (
    <section className="rounded-2xl border-2 bg-card p-5 shadow-[4px_4px_0_rgba(24,24,31,0.06)] sm:p-6">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="pixel text-[10px] text-primary">
              {"// QUEST LOG"}
          </p>

          <h2 className="mt-2 text-xl font-bold tracking-tight">
            UPCOMING WORK
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Your academic quests
          </p>
        </div>

        <Link href="/assignments" className="pixel text-[10px] text-primary hover:underline">
          VIEW ALL →
        </Link>
      </div>

      <div className="space-y-3">
        {assignments.map((assignment) => (
          <div
            key={assignment.title}
            className="group rounded-xl border-2 p-4 transition-all hover:-translate-y-0.5 hover:shadow-[3px_3px_0_rgba(24,24,31,0.06)]"
          >
            <div className="flex gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <CheckCircle2 className="h-4.5 w-4.5" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-bold">
                      {assignment.title}
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      {assignment.subject}
                    </p>
                  </div>

                  <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100" />
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                    <CalendarClock className="h-3.5 w-3.5" />
                    DUE {assignment.dueDate}
                  </span>

                  <span
                    className={[
                      "pixel text-[9px]",
                      assignment.priority === "High"
                        ? "text-danger"
                        : assignment.priority === "Medium"
                          ? "text-yellow-600"
                          : "text-muted-foreground",
                    ].join(" ")}
                  >
                    {assignment.priority.toUpperCase()}
                  </span>
                </div>

              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}