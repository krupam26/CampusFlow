import { z } from "zod";

export const taskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Please enter a task title.")
    .max(100, "Title must be 100 characters or less."),

  dueDate: z
    .string()
    .min(1, "Please select a due date."),

  priority: z.enum(["High", "Medium", "Low"]),

  status: z.enum([
    "Pending",
    "In Progress",
    "Completed",
  ]),

  description: z
    .string()
    .trim()
    .max(
      500,
      "Description must be 500 characters or less."
    ),
});

export type TaskFormValues = z.infer<typeof taskSchema>;