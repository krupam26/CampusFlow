"use client";

import {
  CalendarPlus,
  FilePlus2,
  ListPlus,
  MessageCircle,
} from "lucide-react";
import { useState } from "react";

const actions = [
  {
    title: "ADD ASSIGNMENT",
    description: "Track a new deadline",
    icon: FilePlus2,
  },
  {
    title: "ADD QUEST",
    description: "Create a new task",
    icon: ListPlus,
  },
  {
    title: "SCHEDULE CHANGE",
    description: "Override a class",
    icon: CalendarPlus,
  },
  {
    title: "ASK CAMPUS AI",
    description: "Plan your next move",
    icon: MessageCircle,
  },
];

export function QuickActions() {
  const [selectedAction, setSelectedAction] = useState<string | null>(null);

  return (
    <section className="rounded-2xl border-2 bg-card p-5 shadow-[4px_4px_0_rgba(24,24,31,0.06)] sm:p-6">
      <div className="mb-5">
        <p className="pixel text-[10px] text-primary">
          // ACTIONS
        </p>

        <h2 className="mt-2 text-xl font-bold tracking-tight">
          QUICK ACTIONS
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          What do you want to add?
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <button
              key={action.title}
              onClick={() => setSelectedAction(action.title)}
              className={`pixel-button flex items-center gap-3 rounded-xl border-2 bg-background p-4 text-left ${selectedAction === action.title ? "border-primary bg-primary/10" : ""}`}
              aria-pressed={selectedAction === action.title}
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon className="h-4 w-4" />
              </div>

              <div>
                <p className="pixel text-[9px]">
                  {action.title}
                </p>

                <p className="mt-1 text-[11px] text-muted-foreground">
                  {action.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex items-center gap-2 border-t-2 border-dashed pt-4 text-[10px] text-muted-foreground">
        <span className="h-2 w-2 animate-pulse bg-success" />
        {selectedAction ? `${selectedAction} READY TO OPEN` : "SELECT AN ACTION TO BEGIN"}
      </div>
    </section>
  );
}