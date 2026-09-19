"use client";

import {
  Bell,
  BookOpen,
  Bot,
  CalendarDays,
  CheckSquare2,
  ClipboardList,
  GraduationCap,
  LayoutDashboard,
  Settings,
  Sparkles,
  Trophy,
  X,
} from "lucide-react";

import { ThemeToggle } from "./theme-toggle";

type SidebarProps = {
  mobileOpen?: boolean;
  onClose?: () => void;
};

const mainNav = [
  {
    name: "Overview",
    icon: LayoutDashboard,
    active: true,
  },
  {
    name: "Timetable",
    icon: CalendarDays,
  },
  {
    name: "Assignments",
    icon: ClipboardList,
    count: 2,
  },
  {
    name: "Tasks",
    icon: CheckSquare2,
    count: 3,
  },
  {
    name: "Subjects",
    icon: BookOpen,
  },
];

export function Sidebar({
  mobileOpen = false,
  onClose,
}: SidebarProps) {
  return (
    <aside
      className={[
        "fixed inset-y-0 left-0 z-50 flex w-[270px] flex-col",
        "bg-sidebar text-sidebar-foreground",
        "border-r border-sidebar-border",
        "transition-transform duration-300",
        "lg:static lg:translate-x-0",
        mobileOpen
          ? "translate-x-0"
          : "-translate-x-full",
      ].join(" ")}
    >
      {/* Logo */}
      <div className="flex h-[78px] items-center justify-between border-b border-sidebar-border px-5">
        <div className="flex items-center gap-3">
          <div className="pixel-border flex h-10 w-10 items-center justify-center rounded-lg border-primary bg-primary text-primary-foreground">
            <GraduationCap className="h-5 w-5" />
          </div>

          <div>
            <h1 className="pixel text-[17px] font-bold">
              CAMPUSFLOW
            </h1>

            <p className="mt-0.5 text-[10px] text-sidebar-muted">
              YOUR ACADEMIC OS
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-sidebar-muted hover:bg-white/5 hover:text-white lg:hidden"
          aria-label="Close menu"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <p className="pixel mb-3 px-2 text-[10px] text-sidebar-muted">
          // MAIN
        </p>

        <nav className="space-y-1.5">
          {mainNav.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.name}
                className={[
                  "group flex w-full items-center gap-3 rounded-lg px-3 py-3",
                  "text-[13px] transition-all",
                  item.active
                    ? "border border-primary/40 bg-primary/15 text-white shadow-[3px_3px_0_rgba(102,87,232,0.25)]"
                    : "text-sidebar-muted hover:bg-white/5 hover:text-white",
                ].join(" ")}
              >
                <Icon
                  className={[
                    "h-[17px] w-[17px]",
                    item.active
                      ? "text-primary"
                      : "text-sidebar-muted",
                  ].join(" ")}
                />

                <span className="flex-1 text-left">
                  {item.name}
                </span>

                {item.count && (
                  <span className="pixel rounded bg-primary/15 px-1.5 py-0.5 text-[10px] text-primary">
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="my-7 border-t border-sidebar-border" />

        <p className="pixel mb-3 px-2 text-[10px] text-sidebar-muted">
          // TOOLS
        </p>

        <nav className="space-y-1.5">
          <button className="group flex w-full items-center gap-3 rounded-lg px-3 py-3 text-[13px] text-sidebar-muted hover:bg-white/5 hover:text-white">
            <Bell className="h-[17px] w-[17px]" />
            <span className="flex-1 text-left">
              Notifications
            </span>
            <span className="h-2 w-2 rounded-full bg-primary" />
          </button>

          <button className="group flex w-full items-center gap-3 rounded-lg px-3 py-3 text-[13px] text-sidebar-muted hover:bg-white/5 hover:text-white">
            <Bot className="h-[17px] w-[17px]" />
            <span className="flex-1 text-left">
              AI Assistant
            </span>
            <Sparkles className="h-3.5 w-3.5 text-primary" />
          </button>

          <button className="group flex w-full items-center gap-3 rounded-lg px-3 py-3 text-[13px] text-sidebar-muted hover:bg-white/5 hover:text-white">
            <Trophy className="h-[17px] w-[17px]" />
            <span className="flex-1 text-left">
              Achievements
            </span>
          </button>
        </nav>

        {/* AI card */}
        <div className="pixel-border-subtle mt-8 rounded-xl border-sidebar-border bg-white/[0.025] p-4 text-sidebar-foreground">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15 text-primary">
              <Bot className="h-4 w-4" />
            </div>

            <div>
              <p className="pixel text-[11px]">
                CAMPUS AI
              </p>

              <p className="text-[9px] text-sidebar-muted">
                ONLINE
              </p>
            </div>

            <span className="ml-auto h-2 w-2 rounded-full bg-emerald-400" />
          </div>

          <p className="mt-3 text-[11px] leading-5 text-sidebar-muted">
            Ask me what you have tomorrow, what&apos;s due,
            or what you should work on next.
          </p>

          <button className="pixel mt-3 text-[10px] text-primary hover:text-primary/80">
            [ ASK CAMPUS AI ]
          </button>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-sidebar-border p-4">
        <div className="mb-3 flex items-center justify-between">
          <button
            className="flex items-center gap-2 text-[11px] text-sidebar-muted hover:text-white"
            aria-label="Settings"
          >
            <Settings className="h-4 w-4" />
            Settings
          </button>

          <ThemeToggle />
        </div>

        <div className="flex items-center gap-3 rounded-xl border border-sidebar-border bg-white/[0.025] p-3">
          <div className="pixel flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-sm text-white">
            K
          </div>

          <div className="min-w-0">
            <p className="truncate text-[12px] font-semibold">
              Krupa Mehta
            </p>

            <p className="mt-0.5 text-[9px] text-sidebar-muted">
              AIML · LVL 12
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}