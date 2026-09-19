import type {
  ClassItem,
  ScheduleOverride,
} from "@/types/campusflow";

export function getDayName(date: Date) {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  return days[date.getDay()];
}

export function getEffectiveClasses(
  timetable: ClassItem[],
  overrides: ScheduleOverride[],
  date: Date
): ClassItem[] {
  const dateString = date.toISOString().split("T")[0];
  const dayName = getDayName(date);

  const normalClasses = timetable.filter(
    (item) => item.day === dayName
  );

  const dateOverrides = overrides.filter(
    (item) => item.date === dateString
  );

  const classes: ClassItem[] = [];

  for (const classItem of normalClasses) {
    const override = dateOverrides.find(
      (item) => item.classId === classItem.id
    );

    if (!override) {
      classes.push(classItem);
      continue;
    }

    if (override.action === "cancelled") {
      continue;
    }

    classes.push({
      ...classItem,
      subject: override.subject || classItem.subject,
      code: override.code || classItem.code,
      faculty: override.faculty || classItem.faculty,
      room: override.room || classItem.room,
      startTime: override.startTime || classItem.startTime,
      endTime: override.endTime || classItem.endTime,
      type: override.type || classItem.type,
    });
  }

  for (const override of dateOverrides) {
    if (override.action === "added") {
      classes.push({
        id: override.id,
        subject: override.subject,
        code: override.code,
        faculty: override.faculty,
        room: override.room,
        day: dayName as ClassItem["day"],
        startTime: override.startTime,
        endTime: override.endTime,
        type: override.type,
      });
    }
  }

  return classes.sort((a, b) =>
    a.startTime.localeCompare(b.startTime)
  );
}