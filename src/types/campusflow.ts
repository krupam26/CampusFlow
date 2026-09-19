export type DayOfWeek =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday";

export type ClassType = "Lecture" | "Lab" | "Tutorial";

export type ClassItem = {
  id: string;
  subject: string;
  code: string;
  faculty: string;
  room: string;
  day: DayOfWeek;
  startTime: string;
  endTime: string;
  type: ClassType;
};

export type ScheduleOverride = {
  id: string;
  date: string;
  classId?: string;
  subject: string;
  code: string;
  faculty: string;
  room: string;
  startTime: string;
  endTime: string;
  type: ClassType;
  action: "added" | "modified" | "cancelled";
};

export type Assignment = {
  id: string;
  title: string;
  subject: string;
  dueDate: string;
  priority: "Low" | "Medium" | "High";
  completed: boolean;
};

export type Task = {
  id: string;
  title: string;
  dueDate?: string;
  priority: "Low" | "Medium" | "High";
  completed: boolean;
};