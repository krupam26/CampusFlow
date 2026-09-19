import {
  ArrowUpRight,
  CalendarClock,
  CheckCircle2,
} from "lucide-react";

const assignments = [
  {
    title: "FST Assignment 5",
    subject: "Full Stack Development",
    due: "TOMORROW",
    priority: "HIGH",
    progress: 65,
  },
  {
    title: "CN Lab Report",
    subject: "Computer Networks",
    due: "FRIDAY",
    priority: "MEDIUM",
    progress: 30,
  },
  {
    title: "ML Research Summary",
    subject: "Machine Learning",
    due: "MONDAY",
    priority: "LOW",
    progress: 80,
  },
];

export function UpcomingAssignments() {
  return (
    <section className="rounded-2xl border-2 bg-card p-5 shadow-[4px_4px_0_rgba(24,24,31,0.06)] sm:p-6">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="pixel text-[10px] text-primary">
            // QUEST LOG
          </p>

          <h2 className="pixel mt-2 text-xl font-bold">
            UPCOMING WORK
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Your academic quests
          </p>
        </div>

        <button className="pixel text-[10px] text-primary hover:underline">
          VIEW ALL →
        </button>
      </div>

      <div className="space-y-3">
        {assignments.map((assignment) => (
          <div
            key={assignment.title}
            className="group rounded-xl border-2 p-4 transition-all hover:-translate-y-0.5 hover:shadow-[3px_3px_0_rgba(24,24,31,0.06)]"
          >
            <div className="flex gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <CheckCircle2 className="h-[18px] w-[18px]" />
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
                    DUE {assignment.due}
                  </span>

                  <span
                    className={[
                      "pixel text-[9px]",
                      assignment.priority === "HIGH"
                        ? "text-danger"
                        : assignment.priority === "MEDIUM"
                          ? "text-yellow-600"
                          : "text-muted-foreground",
                    ].join(" ")}
                  >
                    {assignment.priority}
                  </span>
                </div>

                <div className="mt-3">
                  <div className="mb-1.5 flex justify-between">
                    <span className="pixel text-[8px] text-muted-foreground">
                      PROGRESS
                    </span>

                    <span className="pixel text-[8px]">
                      {assignment.progress}%
                    </span>
                  </div>

                  <div className="h-2 border border-border bg-muted">
                    <div
                      className="h-full bg-primary"
                      style={{
                        width: `${assignment.progress}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}