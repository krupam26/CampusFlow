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

export type DaySwap = {
  id: string;
  date: string; // YYYY-MM-DD
  sourceDay: DayOfWeek; // The day's timetable to follow (e.g., "Tuesday")
  note?: string;
};



export type TaskPriority = "Low" | "Medium" | "High";

export type TaskStatus =
  | "Pending"
  | "In Progress"
  | "Completed";

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate?: string;
  completed: boolean;
}
export type AssignmentStatus =
  | "Pending"
  | "In Progress"
  | "Completed";

export type AssignmentPriority =
  | "Low"
  | "Medium"
  | "High";

export interface Assignment {
  id: string;
  title: string;
  subject: string;
  code: string;
  dueDate: string;
  status: AssignmentStatus;
  priority: AssignmentPriority;
  completed?: boolean;
  description?: string;
  source?: "manual" | "teams";
  teamsWebUrl?: string;
}
