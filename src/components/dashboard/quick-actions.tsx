import {
  CalendarPlus,
  FilePlus2,
  ListPlus,
  MessageCircle,
} from "lucide-react";

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
  return (
    <section className="rounded-2xl border-2 bg-card p-5 shadow-[4px_4px_0_rgba(24,24,31,0.06)] sm:p-6">
      <div className="mb-5">
        <p className="pixel text-[10px] text-primary">
          // ACTIONS
        </p>

        <h2 className="pixel mt-2 text-xl font-bold">
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
              className="pixel-button flex items-center gap-3 rounded-xl border-2 bg-background p-4 text-left"
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
    </section>
  );
}