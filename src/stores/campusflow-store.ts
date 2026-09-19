"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  Assignment,
  ClassItem,
  ScheduleOverride,
  Task,
} from "@/types/campusflow";

type CampusFlowState = {
  timetable: ClassItem[];
  overrides: ScheduleOverride[];
  assignments: Assignment[];
  tasks: Task[];

  selectedDay: string;

  addClass: (classItem: ClassItem) => void;
  updateClass: (id: string, classItem: Partial<ClassItem>) => void;
  deleteClass: (id: string) => void;

  addOverride: (override: ScheduleOverride) => void;
  updateOverride: (
    id: string,
    override: Partial<ScheduleOverride>
  ) => void;
  deleteOverride: (id: string) => void;

  addAssignment: (assignment: Assignment) => void;
  updateAssignment: (
    id: string,
    assignment: Partial<Assignment>
  ) => void;
  deleteAssignment: (id: string) => void;
  toggleAssignment: (id: string) => void;

  addTask: (task: Task) => void;
  updateTask: (id: string, task: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTask: (id: string) => void;

  setSelectedDay: (day: string) => void;

  resetStore: () => void;
};

const initialTimetable: ClassItem[] = [
  {
    id: "fst-1",
    subject: "Full Stack Development",
    code: "FST",
    faculty: "Prof. Mehta",
    room: "Lab 204",
    day: "Monday",
    startTime: "09:00",
    endTime: "11:00",
    type: "Lab",
  },
  {
    id: "dsa-1",
    subject: "Advanced Data Structures",
    code: "ADSA",
    faculty: "Prof. Shah",
    room: "Room 302",
    day: "Monday",
    startTime: "11:15",
    endTime: "12:15",
    type: "Lecture",
  },
  {
    id: "dbms-1",
    subject: "Database Management Systems",
    code: "DBMS",
    faculty: "Prof. Patil",
    room: "Room 401",
    day: "Tuesday",
    startTime: "09:00",
    endTime: "10:00",
    type: "Lecture",
  },
  {
    id: "aiml-1",
    subject: "Artificial Intelligence",
    code: "AI",
    faculty: "Prof. Kulkarni",
    room: "Room 205",
    day: "Tuesday",
    startTime: "10:15",
    endTime: "11:15",
    type: "Lecture",
  },
  {
    id: "os-1",
    subject: "Operating Systems",
    code: "OS",
    faculty: "Prof. Joshi",
    room: "Room 301",
    day: "Wednesday",
    startTime: "09:00",
    endTime: "10:00",
    type: "Lecture",
  },
  {
    id: "maths-1",
    subject: "Engineering Mathematics",
    code: "MATHS",
    faculty: "Prof. Desai",
    room: "Room 202",
    day: "Wednesday",
    startTime: "11:00",
    endTime: "12:00",
    type: "Lecture",
  },
  {
    id: "fst-2",
    subject: "Full Stack Development",
    code: "FST",
    faculty: "Prof. Mehta",
    room: "Lab 204",
    day: "Thursday",
    startTime: "11:00",
    endTime: "13:00",
    type: "Lab",
  },
  {
    id: "dsa-2",
    subject: "Advanced Data Structures",
    code: "ADSA",
    faculty: "Prof. Shah",
    room: "Room 302",
    day: "Thursday",
    startTime: "14:00",
    endTime: "15:00",
    type: "Lecture",
  },
  {
    id: "ai-2",
    subject: "Artificial Intelligence",
    code: "AI",
    faculty: "Prof. Kulkarni",
    room: "Room 205",
    day: "Friday",
    startTime: "09:00",
    endTime: "10:00",
    type: "Lecture",
  },
  {
    id: "dbms-2",
    subject: "Database Management Systems",
    code: "DBMS",
    faculty: "Prof. Patil",
    room: "Room 401",
    day: "Friday",
    startTime: "11:00",
    endTime: "12:00",
    type: "Lecture",
  },
];

const initialState = {
  timetable: initialTimetable,
  overrides: [],
  assignments: [],
  tasks: [],
  selectedDay: "Monday",
};

export const useCampusFlowStore = create<CampusFlowState>()(
  persist(
    (set) => ({
      ...initialState,

      addClass: (classItem) =>
        set((state) => ({
          timetable: [...state.timetable, classItem],
        })),

      updateClass: (id, classItem) =>
        set((state) => ({
          timetable: state.timetable.map((item) =>
            item.id === id ? { ...item, ...classItem } : item
          ),
        })),

      deleteClass: (id) =>
        set((state) => ({
          timetable: state.timetable.filter((item) => item.id !== id),
        })),

      addOverride: (override) =>
        set((state) => ({
          overrides: [...state.overrides, override],
        })),

      updateOverride: (id, override) =>
        set((state) => ({
          overrides: state.overrides.map((item) =>
            item.id === id ? { ...item, ...override } : item
          ),
        })),

      deleteOverride: (id) =>
        set((state) => ({
          overrides: state.overrides.filter((item) => item.id !== id),
        })),

      addAssignment: (assignment) =>
        set((state) => ({
          assignments: [...state.assignments, assignment],
        })),

      updateAssignment: (id, assignment) =>
        set((state) => ({
          assignments: state.assignments.map((item) =>
            item.id === id ? { ...item, ...assignment } : item
          ),
        })),

      deleteAssignment: (id) =>
        set((state) => ({
          assignments: state.assignments.filter(
            (item) => item.id !== id
          ),
        })),

      toggleAssignment: (id) =>
        set((state) => ({
          assignments: state.assignments.map((item) =>
            item.id === id
              ? { ...item, completed: !item.completed }
              : item
          ),
        })),

      addTask: (task) =>
        set((state) => ({
          tasks: [...state.tasks, task],
        })),

      updateTask: (id, task) =>
        set((state) => ({
          tasks: state.tasks.map((item) =>
            item.id === id ? { ...item, ...task } : item
          ),
        })),

      deleteTask: (id) =>
        set((state) => ({
          tasks: state.tasks.filter((item) => item.id !== id),
        })),

      toggleTask: (id) =>
        set((state) => ({
          tasks: state.tasks.map((item) =>
            item.id === id
              ? { ...item, completed: !item.completed }
              : item
          ),
        })),

      setSelectedDay: (day) =>
        set({
          selectedDay: day,
        }),

      resetStore: () =>
        set({
          ...initialState,
        }),
    }),
    {
      name: "campusflow-store",
    }
  )
);