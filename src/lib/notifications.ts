import type {
  Assignment,
  ClassItem,
  DaySwap,
  ScheduleOverride,
  Task,
} from "@/types/campusflow";
import { formatDateKey, getEffectiveClasses, getMinutesUntil } from "./schedule";

function getDateKey(date: Date, daysAhead = 0) {
  const targetDate = new Date(date);
  targetDate.setDate(targetDate.getDate() + daysAhead);

  const year = targetDate.getFullYear();
  const month = String(targetDate.getMonth() + 1).padStart(2, "0");
  const day = String(targetDate.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function getNotificationIds(
  assignments: Assignment[],
  tasks: Task[],
  overrides: ScheduleOverride[],
  now = new Date(),
  timetable: ClassItem[] = [],
  daySwaps: DaySwap[] = []
) {
  const todayKey = formatDateKey(now);
  const tomorrowKey = getDateKey(now, 1);
  const twoDaysKey = getDateKey(now, 2);
  const ids: string[] = [];

  // Class alerts
  if (timetable.length > 0) {
    const todayClasses = getEffectiveClasses(timetable, overrides, now, daySwaps);
    
    // Check if a class is starting in <= 5 minutes
    const startingSoon = todayClasses.find((c) => {
      const mins = getMinutesUntil(c.startTime, now);
      return mins > 0 && mins <= 5;
    });

    if (startingSoon) {
      ids.push(`class-starting-soon-${startingSoon.id}`);
    }

    // Check if all classes for today are done
    if (todayClasses.length > 0) {
      const currentTimeStr = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
      const lastClass = todayClasses[todayClasses.length - 1];
      if (currentTimeStr >= lastClass.endTime) {
        ids.push(`classes-all-done-today-${todayKey}`);
      }
    }
  }

  assignments
    .filter((assignment) => !assignment.completed)
    .forEach((assignment) => {
      if (assignment.dueDate === twoDaysKey) {
        ids.push(`assignment-two-days-${assignment.id}`);
      }

      if (assignment.dueDate === tomorrowKey) {
        ids.push(`assignment-tomorrow-${assignment.id}`);
      }

      if (assignment.priority === "High") {
        ids.push(`assignment-high-${assignment.id}`);
      }
    });

  tasks
    .filter((task) => !task.completed)
    .forEach((task) => {
      if (task.dueDate === tomorrowKey) {
        ids.push(`task-tomorrow-${task.id}`);
      }
    });

  overrides
    .filter((override) => override.date >= tomorrowKey)
    .forEach((override) => {
      ids.push(`override-${override.id}`);
    });

  return ids.slice(0, 20);
}