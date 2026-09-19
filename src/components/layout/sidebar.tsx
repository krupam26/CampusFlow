"use client";

import {
  Bell,
  Bot,
  CalendarDays,
  CheckSquare,
  ClipboardList,
  GraduationCap,
  LayoutDashboard,
  Settings,
  BookOpen,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

type SidebarProps = {
  mobileOpen?: boolean;
  onClose?: () => void;
};

const mainNavigation = [
  {
    label: "Overview",
    icon: LayoutDashboard,
    active: true,
  },
  {
    label: "Timetable",
    icon: CalendarDays,
  },
  {
    label: "Assignments",
    icon: ClipboardList,
  },
  {
    label: "Tasks",
    icon: CheckSquare,
  },
  {
    label: "Subjects",
    icon: BookOpen,
  },
];

export function Sidebar({
  mobileOpen = false,
  onClose,
}: SidebarProps) {
  return (
    <aside
      className={`
        fixed inset-y-0 left-0 z-50 flex w-[270px] flex-col
        border-r bg-background
        transition-transform duration-200
        lg:static lg:translate-x-0
        ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
      `}
    >
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <GraduationCap className="h-5 w-5" />
          </div>

          <div>
            <p className="text-[15px] font-semibold tracking-tight">
              CampusFlow
            </p>
            <p className="text-[11px] text-muted-foreground">
              Your college, in one flow.
            </p>
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={onClose}
          aria-label="Close navigation"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      <Separator />

      <nav className="flex-1 space-y-1 px-3 py-5">
        <p className="mb-3 px-3 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          Workspace
        </p>

        {mainNavigation.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.label}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-[15px] transition-colors ${
                item.active
                  ? "bg-primary/10 font-medium text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Icon className="h-4.5 w-4.5" />
              {item.label}
            </button>
          );
        })}

        <div className="pt-5">
          <p className="mb-3 px-3 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            Stay on top
          </p>

          <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-[15px] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
            <Bell className="h-4.5 w-4.5" />
            Notifications
          </button>

          <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-[15px] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
            <Bot className="h-4.5 w-4.5" />
            AI Assistant
          </button>
        </div>
      </nav>

      <div className="border-t p-3">
        <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-[15px] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
          <Settings className="h-4.5 w-4.5" />
          Settings
        </button>

        <div className="mt-2 flex items-center gap-3 rounded-xl bg-muted/60 p-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
            K
          </div>

          <div className="min-w-0">
            <p className="truncate text-[15px] font-medium">
              Krupa
            </p>
            <p className="truncate text-xs text-muted-foreground">
              Student
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}