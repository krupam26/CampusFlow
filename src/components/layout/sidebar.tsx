"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  Bot,
  CalendarDays,
  CheckSquare2,
  ClipboardList,
  GraduationCap,
  LayoutDashboard,
  Settings,
  X,
} from "lucide-react";

import { getNotificationIds } from "@/lib/notifications";
import { useCampusFlowStore } from "@/stores/campusflow-store";

type SidebarProps = {
  mobileOpen?: boolean;
  onClose?: () => void;
};

const mainNav = [
  {
    name: "Overview",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    name: "Timetable",
    href: "/timetable",
    icon: CalendarDays,
  },
  {
    name: "Assignments",
    href: "/assignments",
    icon: ClipboardList,
  },
  {
    name: "Tasks",
    href: "/tasks",
    icon: CheckSquare2,
  },
  {
    name: "AI Assistant",
    href: "/ai",
    icon: Bot,
  },
];

export function Sidebar({
  mobileOpen = false,
  onClose,
}: SidebarProps) {
  const pathname = usePathname();
  const assignments = useCampusFlowStore(
    (state) => state.assignments
  );
  const tasks = useCampusFlowStore((state) => state.tasks);
  const overrides = useCampusFlowStore(
    (state) => state.overrides
  );
  const readNotificationIds = useCampusFlowStore(
    (state) => state.readNotificationIds
  );
  const hasUnreadNotifications = getNotificationIds(
    assignments,
    tasks,
    overrides
  ).some((id) => !readNotificationIds.includes(id));
  const pendingAssignmentCount = assignments.filter(
    (assignment) => !assignment.completed && assignment.status !== "Completed"
  ).length;
  const pendingTaskCount = tasks.filter(
    (task) => !task.completed && task.status !== "Completed"
  ).length;

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
            <h1 className="text-[17px] font-bold">
              CAMPUSFLOW
            </h1>

            <p className="mt-0.5 text-[10px] text-sidebar-muted">
              YOUR ACADEMIC OS
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-sidebar-muted hover:bg-primary/10 hover:text-primary lg:hidden"
          aria-label="Close menu"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <p className="mb-3 px-2 text-[10px] text-sidebar-muted">
          // MAIN
        </p>

        <nav className="space-y-1.5">
          {mainNav.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            const count =
              item.name === "Assignments"
                ? pendingAssignmentCount
                : item.name === "Tasks"
                  ? pendingTaskCount
                  : undefined;

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onClose}
                className={[
                  "group flex w-full items-center gap-3 rounded-lg px-3 py-3",
                  "text-[13px] transition-all",
                  isActive
                    ? "border border-primary/40 bg-primary/15 text-primary shadow-[3px_3px_0_rgba(232,93,74,0.25)]"
                    : "text-sidebar-muted hover:bg-primary/10 hover:text-primary",
                ].join(" ")}
              >
                <Icon
                  className={[
                    "h-[17px] w-[17px]",
                    isActive
                      ? "text-primary"
                      : "text-sidebar-muted",
                  ].join(" ")}
                />

                <span className="flex-1 text-left">
                  {item.name}
                </span>

                {count !== undefined && count > 0 && (
                  <span className="rounded bg-primary/15 px-1.5 py-0.5 text-[10px] text-primary">
                    {count}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="my-7 border-t border-sidebar-border" />

        <p className="mb-3 px-2 text-[10px] text-sidebar-muted">
          // TOOLS
        </p>

        <nav className="space-y-1.5">
          <Link
  href="/notifications"
  onClick={onClose}
  className="group flex w-full items-center gap-3 rounded-lg px-3 py-3 text-[13px] text-sidebar-muted hover:bg-primary/10 hover:text-primary"
>
  <Bell className="h-[17px] w-[17px]" />

  <span className="flex-1 text-left">
    Notifications
  </span>

  {hasUnreadNotifications && (
    <span className="h-2 w-2 rounded-full bg-primary" />
  )}
</Link>

        </nav>

        {/* AI card */}
        <div className="pixel-border-subtle mt-8 rounded-xl border-sidebar-border bg-white/[0.025] p-4 text-sidebar-foreground">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15 text-primary">
              <Bot className="h-4 w-4" />
            </div>

            <div>
              <p className="text-[11px]">
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

          <Link
            href="/ai"
            onClick={onClose}
            className="mt-3 inline-block text-[10px] text-primary hover:text-primary/80"
          >
            [ ASK CAMPUS AI ]
          </Link>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-sidebar-border p-4">
        <button
          className="mb-3 flex items-center gap-2 text-[11px] text-sidebar-muted hover:text-primary"
          aria-label="Settings"
        >
          <Settings className="h-4 w-4" />
          Settings
        </button>

        <div className="flex items-center gap-3 rounded-xl border border-sidebar-border bg-white/[0.025] p-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-sm text-white">
            K
          </div>

          <div className="min-w-0">
            <p className="truncate text-[12px] font-semibold">
              Krupa Mehta
            </p>

            <p className="mt-0.5 text-[9px] text-sidebar-muted">
              AIML
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}