"use client";

import { useEffect, useRef, useState } from "react";
import { Bell, X } from "lucide-react";

import { getNotificationIds } from "@/lib/notifications";
import { useCampusFlowStore } from "@/stores/campusflow-store";

export function NotificationToast() {
  const assignments = useCampusFlowStore(
    (state) => state.assignments
  );
  const tasks = useCampusFlowStore((state) => state.tasks);
  const overrides = useCampusFlowStore(
    (state) => state.overrides
  );
  const [visible, setVisible] = useState(false);
  const previousIds = useRef<string[] | null>(null);

  const notificationIds = getNotificationIds(
    assignments,
    tasks,
    overrides
  );
  const notificationKey = notificationIds.join("|");

  useEffect(() => {
    const currentIds = notificationKey
      ? notificationKey.split("|")
      : [];

    if (previousIds.current === null) {
      previousIds.current = currentIds;
      return;
    }

    const hasNewNotification = currentIds.some(
      (id) => !previousIds.current?.includes(id)
    );

    previousIds.current = currentIds;

    if (!hasNewNotification) return;

    const showTimer = window.setTimeout(() => {
      setVisible(true);
    }, 0);
    const hideTimer = window.setTimeout(() => {
      setVisible(false);
    }, 5000);

    return () => {
      window.clearTimeout(showTimer);
      window.clearTimeout(hideTimer);
    };
  }, [notificationKey]);

  if (!visible) return null;

  return (
    <div className="fixed bottom-5 right-5 z-100 flex w-[min(360px,calc(100vw-2rem))] items-start gap-3 border-2 border-primary bg-card p-4 shadow-[4px_4px_0_var(--foreground)]">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center bg-primary/15 text-primary">
        <Bell className="h-4 w-4" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="pixel text-xs text-primary">
          NEW NOTIFICATION
        </p>
        <p className="mt-1 text-sm text-foreground">
          You have a new CampusFlow update.
        </p>
      </div>

      <button
        type="button"
        onClick={() => setVisible(false)}
        className="text-muted-foreground hover:text-foreground"
        aria-label="Dismiss notification"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}