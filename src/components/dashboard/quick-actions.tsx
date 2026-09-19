"use client";

import { useState } from "react";
import {
  CalendarPlus,
  FilePlus2,
  ListPlus,
  MessageCircle,
} from "lucide-react";
import Link from "next/link";

import { AddAssignmentDialog } from "@/components/assignments/add-assignment-dialog";
import { AddTaskDialog } from "@/components/tasks/add-task-dialog";

export function QuickActions() {
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const actions = [
    {
      title: "ADD ASSIGNMENT",
      content: (
        <AddAssignmentDialog
          trigger={<ActionContent icon={FilePlus2} title="ADD ASSIGNMENT" description="Track a new deadline" />}
        />
      ),
    },
    {
      title: "ADD QUEST",
      content: (
        <AddTaskDialog
          trigger={<ActionContent icon={ListPlus} title="ADD QUEST" description="Create a new task" />}
        />
      ),
    },
    {
      title: "SCHEDULE CHANGE",
      content: (
        <Link href="/timetable">
          <ActionContent icon={CalendarPlus} title="SCHEDULE CHANGE" description="Override a class" />
        </Link>
      ),
    },
    {
      title: "ASK CAMPUS AI",
      content: (
        <Link href="/ai">
          <ActionContent icon={MessageCircle} title="ASK CAMPUS AI" description="Plan your next move" />
        </Link>
      ),
    },
  ];

  return (
    <section className="rounded-2xl border-2 border-foreground/15 bg-card p-5 shadow-[4px_4px_0_rgba(24,24,31,0.06)] sm:p-6">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <p className="pixel text-[10px] text-primary">
          {"// ACTIONS"}
          </p>

          <h2 className="mt-2 text-xl font-bold tracking-tight">
            QUICK ACTIONS
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            What do you want to add?
          </p>
        </div>

        <span className="hidden border border-primary/30 bg-primary/10 px-2 py-1 text-[10px] font-semibold text-primary sm:inline-block">
          READY
        </span>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {actions.map((action) => (
          <div
            key={action.title}
            onClick={() => setSelectedAction(action.title)}
          >
            {action.content}
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center gap-2 border-t-2 border-dashed pt-4 text-[10px] text-muted-foreground">
        <span className="h-2 w-2 animate-pulse bg-success" />
        {selectedAction
          ? `${selectedAction} READY TO OPEN`
          : "SELECT AN ACTION TO BEGIN"}
      </div>
    </section>
  );
}

function ActionContent({
  asButton = false,
  icon: Icon,
  title,
  description,
}: {
  asButton?: boolean;
  icon: typeof FilePlus2;
  title: string;
  description: string;
}) {
  const Component = asButton ? "button" : "span";

  return (
    <Component
      type={asButton ? "button" : undefined}
      className="pixel-button group flex w-full items-center gap-3 rounded-xl border-2 border-border bg-background p-4 text-left transition-colors hover:border-primary hover:bg-primary/5"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
        <Icon className="h-4 w-4" />
      </span>
      <span className="min-w-0">
        <span className="pixel block text-[10px]">{title}</span>
        <span className="mt-1 block text-xs text-muted-foreground">
          {description}
        </span>
      </span>
    </Component>
  );
}
