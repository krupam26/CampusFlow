import {
  ArrowRight,
  Circle,
  Flag,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const tasks = [
  {
    title: "Finish FST Assignment 5",
    time: "45 min",
    priority: "High",
  },
  {
    title: "Prepare CN lab notes",
    time: "30 min",
    priority: "Medium",
  },
  {
    title: "Review ML lecture",
    time: "20 min",
    priority: "Low",
  },
];

export function PriorityTasks() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base">
              Priority tasks
            </CardTitle>

            <p className="mt-1 text-xs text-muted-foreground">
              What deserves your attention next
            </p>
          </div>

          <Flag className="h-4 w-4 text-muted-foreground" />
        </div>
      </CardHeader>

      <CardContent className="space-y-2">
        {tasks.map((task) => (
          <div
            key={task.title}
            className="flex items-center gap-3 rounded-xl p-3 hover:bg-muted/40"
          >
            <button
              className="text-muted-foreground hover:text-primary"
              aria-label={`Complete ${task.title}`}
            >
              <Circle className="h-5 w-5" />
            </button>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">
                {task.title}
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                {task.time}
              </p>
            </div>

            <span
              className={`text-[10px] font-medium uppercase tracking-wide ${
                task.priority === "High"
                  ? "text-destructive"
                  : task.priority === "Medium"
                    ? "text-amber-600"
                    : "text-muted-foreground"
              }`}
            >
              {task.priority}
            </span>
          </div>
        ))}

        <button className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed p-3 text-xs font-medium text-muted-foreground hover:bg-muted/30 hover:text-foreground">
          View all tasks
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </CardContent>
    </Card>
  );
}