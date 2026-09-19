import {
  ArrowUpRight,
  CalendarClock,
  CircleCheck,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const assignments = [
  {
    title: "FST Assignment 5",
    subject: "Full Stack Development",
    due: "Tomorrow",
    priority: "High",
    progress: 65,
  },
  {
    title: "CN Lab Report",
    subject: "Computer Networks",
    due: "Friday",
    priority: "Medium",
    progress: 30,
  },
  {
    title: "ML Research Summary",
    subject: "Machine Learning",
    due: "Monday",
    priority: "Low",
    progress: 80,
  },
];

export function UpcomingAssignments() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base">
              Upcoming assignments
            </CardTitle>

            <p className="mt-1 text-xs text-muted-foreground">
              Keep your deadlines under control
            </p>
          </div>

          <button className="text-xs font-medium text-primary hover:underline">
            View all
          </button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {assignments.map((assignment) => (
          <div
            key={assignment.title}
            className="group rounded-xl border p-4 transition-colors hover:bg-muted/30"
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5 rounded-lg bg-primary/10 p-2 text-primary">
                <CircleCheck className="h-4 w-4" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium">
                      {assignment.title}
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      {assignment.subject}
                    </p>
                  </div>

                  <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <CalendarClock className="h-3.5 w-3.5" />
                    Due {assignment.due}
                  </span>

                  <span className="text-xs font-medium">
                    {assignment.progress}%
                  </span>
                </div>

                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{
                      width: `${assignment.progress}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}