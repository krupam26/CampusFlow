import type {
  Assignment,
  ScheduleOverride,
  Task,
} from "@/types/campusflow";

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
  now = new Date()
) {
  const tomorrowKey = getDateKey(now, 1);
  const twoDaysKey = getDateKey(now, 2);
  const ids: string[] = [];

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