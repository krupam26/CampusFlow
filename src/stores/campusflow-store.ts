"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  Assignment,
  ClassItem,
  DaySwap,
  ScheduleOverride,
  Task,
} from "@/types/campusflow";

type CampusFlowState = {
  timetable: ClassItem[];
  overrides: ScheduleOverride[];
  daySwaps: DaySwap[];
  assignments: Assignment[];
  tasks: Task[];
  readNotificationIds: string[];

  selectedDay: string;
  hasCompletedOnboarding: boolean;

  addClass: (classItem: ClassItem) => void;
  addClasses: (classes: ClassItem[]) => void;
  setTimetable: (classes: ClassItem[]) => void;
  updateClass: (id: string, classItem: Partial<ClassItem>) => void;
  deleteClass: (id: string) => void;

  addOverride: (override: ScheduleOverride) => void;
  updateOverride: (
    id: string,
    override: Partial<ScheduleOverride>
  ) => void;
  deleteOverride: (id: string) => void;

  addDaySwap: (swap: DaySwap) => void;
  deleteDaySwap: (id: string) => void;

  addAssignment: (assignment: Assignment) => void;
  syncAssignments: (incoming: Assignment[]) => void;
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
  markNotificationRead: (id: string) => void;

  setSelectedDay: (day: string) => void;
  setHasCompletedOnboarding: (val: boolean) => void;

  resetStore: () => void;
};

const initialTimetable: ClassItem[] = [];

const initialState = {
  timetable: initialTimetable,
  overrides: [],
  daySwaps: [],
  assignments: [],
  tasks: [],
  readNotificationIds: [],
  selectedDay: "Monday",
  hasCompletedOnboarding: false,
};

export const useCampusFlowStore = create<CampusFlowState>()(
  persist(
    (set) => ({
      ...initialState,

      addClass: (classItem) =>
        set((state) => ({
          timetable: [...state.timetable, classItem],
        })),

      addClasses: (classes) =>
        set((state) => ({
          timetable: [...state.timetable, ...classes],
        })),

      setTimetable: (classes) =>
        set(() => ({
          timetable: classes,
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

      addDaySwap: (swap) =>
        set((state) => ({
          daySwaps: [
            ...(state.daySwaps || []).filter((s) => s.date !== swap.date),
            swap,
          ],
        })),

      deleteDaySwap: (id) =>
        set((state) => ({
          daySwaps: (state.daySwaps || []).filter((s) => s.id !== id),
        })),

      addAssignment: (assignment) =>
        set((state) => ({
          assignments: [...state.assignments, assignment],
        })),

      syncAssignments: (incoming) =>
        set((state) => {
          const current = [...state.assignments];
          for (const item of incoming) {
            const existingIndex = current.findIndex(
              (a) => a.id === item.id || (a.title.toLowerCase() === item.title.toLowerCase() && a.dueDate === item.dueDate)
            );
            if (existingIndex >= 0) {
              current[existingIndex] = { ...current[existingIndex], ...item };
            } else {
              current.push(item);
            }
          }
          return { assignments: current };
        }),

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
          assignments: state.assignments.map((item) => {
            if (item.id !== id) return item;

            const completed = !item.completed;

            return {
              ...item,
              completed,
              status: completed ? "Completed" : "Pending",
            };
          }),
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
    tasks: state.tasks.map((item) => {
      if (item.id !== id) return item;

      const completed = !item.completed;

      return {
        ...item,
        completed,
        status: completed
          ? "Completed"
          : "Pending",
      };
    }),
  })),

      markNotificationRead: (id) =>
        set((state) => ({
          readNotificationIds: state.readNotificationIds.includes(id)
            ? state.readNotificationIds
            : [...state.readNotificationIds, id],
        })),

      setSelectedDay: (day) =>
        set({
          selectedDay: day,
        }),

      setHasCompletedOnboarding: (val) =>
        set({
          hasCompletedOnboarding: val,
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