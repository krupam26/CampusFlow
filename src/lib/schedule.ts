import type {
  ClassItem,
  DaySwap,
  ScheduleOverride,
} from "@/types/campusflow";

export function formatDateKey(date: Date | string): string {
  const value =
    typeof date === "string" ? new Date(`${date}T12:00:00`) : date;

  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

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
  date: Date,
  daySwaps?: DaySwap[]
): ClassItem[] {
  const dateString = formatDateKey(date);
  const dayName = getDayName(date);

  const activeSwap = daySwaps?.find((s) => s.date === dateString);
  const effectiveDayName = activeSwap ? activeSwap.sourceDay : dayName;

  const normalClasses = timetable.filter(
    (item) => item.day === effectiveDayName
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

export type NextDayFirstClassResult = {
  date: Date;
  dayName: string;
  isTomorrow: boolean;
  firstClass: ClassItem;
};

export function getNextDayFirstClass(
  timetable: ClassItem[],
  overrides: ScheduleOverride[],
  daySwaps: DaySwap[] = [],
  fromDate: Date = new Date()
): NextDayFirstClassResult | null {
  for (let i = 1; i <= 7; i++) {
    const nextDate = new Date(fromDate);
    nextDate.setDate(nextDate.getDate() + i);
    const classesOnNextDate = getEffectiveClasses(
      timetable,
      overrides,
      nextDate,
      daySwaps
    );
    if (classesOnNextDate.length > 0) {
      const dayName = getDayName(nextDate);
      const isTomorrow = i === 1;
      return {
        date: nextDate,
        dayName,
        isTomorrow,
        firstClass: classesOnNextDate[0],
      };
    }
  }
  return null;
}

export function getMinutesUntil(timeStr: string, fromDate: Date = new Date()): number {
  const [h, m] = timeStr.split(":").map(Number);
  const target = new Date(fromDate);
  target.setHours(h, m, 0, 0);
  return Math.round((target.getTime() - fromDate.getTime()) / 60000);
}