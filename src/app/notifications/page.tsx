"use client";

import {
  AlertTriangle,
  Bell,
  CalendarDays,
  CheckCircle2,
  Clock3,
} from "lucide-react";

import { AppShell } from "@/components/layout/app-shell";
import { getNotificationIds } from "@/lib/notifications";
import { useCampusFlowStore } from "@/stores/campusflow-store";

type Notification = {
  id: string;
  type: "warning" | "schedule" | "task" | "success";
  title: string;
  description: string;
  meta: string;
};

function getDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export default function NotificationsPage() {
  const assignments = useCampusFlowStore(
    (state) => state.assignments
  );

  const tasks = useCampusFlowStore(
    (state) => state.tasks
  );

  const overrides = useCampusFlowStore(
    (state) => state.overrides
  );

  const readNotificationIds = useCampusFlowStore(
    (state) => state.readNotificationIds
  );

  const markNotificationRead = useCampusFlowStore(
    (state) => state.markNotificationRead
  );

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const tomorrowKey = getDateKey(tomorrow);
  const twoDays = new Date();
  twoDays.setDate(twoDays.getDate() + 2);
  const twoDaysKey = getDateKey(twoDays);

  const notifications: Notification[] = [];

  /* ASSIGNMENT NOTIFICATIONS */

  assignments
    .filter((assignment) => !assignment.completed)
    .forEach((assignment) => {
      if (assignment.dueDate === twoDaysKey) {
        notifications.push({
          id: `assignment-two-days-${assignment.id}`,
          type: "warning",
          title: `${assignment.title} is due in 2 days`,
          description: `${assignment.subject} · ${assignment.priority} priority`,
          meta: "DUE IN 2 DAYS",
        });
      }

      if (assignment.dueDate === tomorrowKey) {
        notifications.push({
          id: `assignment-tomorrow-${assignment.id}`,
          type: "warning",
          title: `${assignment.title} is due tomorrow`,
          description: `${assignment.subject} · ${assignment.priority} priority`,
          meta: "DUE TOMORROW",
        });
      }

      if (assignment.priority === "High") {
        notifications.push({
          id: `assignment-high-${assignment.id}`,
          type: "warning",
          title: assignment.title,
          description: `${assignment.subject} · Due ${assignment.dueDate}`,
          meta: "HIGH PRIORITY",
        });
      }
    });

  /* TASK NOTIFICATIONS */

  tasks
    .filter((task) => !task.completed)
    .forEach((task) => {
      if (task.dueDate === tomorrowKey) {
        notifications.push({
          id: `task-tomorrow-${task.id}`,
          type: "task",
          title: `${task.title} is due tomorrow`,
          description: `${task.priority} priority · ${
            task.status ?? "Pending"
          }`,
          meta: "TASK",
        });
      }
    });

  /* SCHEDULE CHANGES */

  overrides
    .filter((override) => override.date >= tomorrowKey)
    .forEach((override) => {
      notifications.push({
        id: `override-${override.id}`,
        type: "schedule",
        title: `${override.subject} schedule changed`,
        description: `${override.action.toUpperCase()} · ${override.startTime}–${override.endTime}`,
        meta: override.date,
      });
    });

  const sortedNotifications = notifications.slice(0, 20);
  const unreadNotificationCount = getNotificationIds(
    assignments,
    tasks,
    overrides
  ).filter((id) => !readNotificationIds.includes(id)).length;

  return (
    <AppShell>
      <main className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
        <div className="mx-auto max-w-5xl space-y-6">

          {/* HEADER */}

          <section className="pixel-border bg-card p-6 md:p-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center border border-primary/30 bg-primary/10">
                  <Bell className="h-6 w-6 text-primary" />
                </div>

                <div>
                  <p className="pixel text-xs text-primary">
                    CAMPUSFLOW // ALERTS
                  </p>

                  <h1 className="pixel-heading mt-1 text-3xl">
                    NOTIFICATIONS
                  </h1>

                  <p className="mt-2 text-sm text-muted-foreground">
                    Important updates about your academic workload.
                  </p>
                </div>
              </div>

              <div className="border border-border bg-muted px-4 py-3">
                <p className="pixel text-[10px] text-muted-foreground">
                  ACTIVE
                </p>

                <p className="pixel-heading mt-1 text-xl">
                  {unreadNotificationCount}
                </p>
              </div>
            </div>
          </section>

          {/* NOTIFICATIONS */}

          <section>
            <div className="mb-4">
              <p className="pixel text-xs text-primary">
                ATTENTION REQUIRED
              </p>

              <h2 className="pixel-heading mt-1 text-xl">
                RECENT UPDATES
              </h2>
            </div>

            {sortedNotifications.length === 0 ? (
              <EmptyNotifications />
            ) : (
              <div className="space-y-3">
                {sortedNotifications.map((notification) => (
                  <NotificationCard
                    key={notification.id}
                    notification={notification}
                    isRead={readNotificationIds.includes(notification.id)}
                    onRead={() => markNotificationRead(notification.id)}
                  />
                ))}
              </div>
            )}
          </section>

        </div>
      </main>
    </AppShell>
  );
}

function NotificationCard({
  notification,
  isRead,
  onRead,
}: {
  notification: Notification;
  isRead: boolean;
  onRead: () => void;
}) {
  const config = {
    warning: {
      icon: AlertTriangle,
      iconClass: "text-red-700",
      boxClass: "border-red-300 bg-red-100",
      metaClass: "border-red-300 bg-red-100 text-red-800",
    },
    schedule: {
      icon: CalendarDays,
      iconClass: "text-blue-700",
      boxClass: "border-blue-300 bg-blue-100",
      metaClass: "border-blue-300 bg-blue-100 text-blue-800",
    },
    task: {
      icon: Clock3,
      iconClass: "text-amber-700",
      boxClass: "border-amber-300 bg-amber-100",
      metaClass: "border-amber-300 bg-amber-100 text-amber-800",
    },
    success: {
      icon: CheckCircle2,
      iconClass: "text-emerald-700",
      boxClass: "border-emerald-300 bg-emerald-100",
      metaClass: "border-emerald-300 bg-emerald-100 text-emerald-800",
    },
  }[notification.type];

  const Icon = config.icon;

  return (
    <div
      className={`pixel-border-subtle flex gap-4 bg-card p-4 md:p-5 ${
        isRead ? "opacity-60" : ""
      }`}
    >
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center border ${config.boxClass}`}
      >
        <Icon className={`h-4 w-4 ${config.iconClass}`} />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="pixel text-sm">
            {notification.title}
          </p>

          <span className={`border px-2 py-0.5 text-[10px] font-semibold ${config.metaClass}`}>
            {notification.meta}
          </span>
        </div>

        <p className="mt-2 text-sm text-muted-foreground">
          {notification.description}
        </p>
      </div>

      {!isRead && (
        <button
          type="button"
          onClick={onRead}
          className="ml-auto shrink-0 self-start text-right text-xs font-semibold text-primary hover:text-primary/70"
        >
          MARK AS READ
        </button>
      )}
    </div>
  );
}

function EmptyNotifications() {
  return (
    <div className="pixel-border-subtle bg-card p-8 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center border border-success/20 bg-success/10">
        <CheckCircle2 className="h-6 w-6 text-success" />
      </div>

      <p className="pixel mt-4 text-sm">
        YOU&apos;RE ALL CAUGHT UP
      </p>

      <p className="mt-2 text-xs text-muted-foreground">
        No important academic notifications right now.
      </p>
    </div>
  );
}

