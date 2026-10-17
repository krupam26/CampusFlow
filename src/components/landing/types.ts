export interface ClassSession {
  id: string;
  courseCode: string;
  courseName: string;
  time: string;
  room: string;
  instructor: string;
  type: 'Lecture' | 'Lab' | 'Discussion' | 'Seminar';
  hasChangeAlert?: boolean;
  alertNote?: string;
}

export interface DaySchedule {
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';
  short: string;
  sessions: ClassSession[];
}

export interface Assignment {
  id: string;
  title: string;
  course: string;
  dueDate: string;
  daysRemaining: number;
  priority: 'Urgent' | 'High' | 'Medium' | 'Low';
  completed: boolean;
  type: 'Problem Set' | 'Project' | 'Paper' | 'Reading' | 'Exam Prep';
}

export interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  category: 'Academic' | 'Personal' | 'Campus';
  priority?: 'High' | 'Normal';
}

export interface ReminderNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'schedule_change' | 'deadline' | 'lab';
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  quickActions?: string[];
}
