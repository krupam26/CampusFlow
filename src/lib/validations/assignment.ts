import { z } from "zod";

export const assignmentSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Assignment title is required.")
    .max(100, "Title must be 100 characters or less."),

  subject: z
    .string()
    .trim()
    .min(1, "Subject is required.")
    .max(80, "Subject must be 80 characters or less."),

  code: z
    .string()
    .trim()
    .max(20, "Code must be 20 characters or less."),

  dueDate: z
    .string()
    .min(1, "Due date is required."),

  priority: z.enum(["High", "Medium", "Low"]),

  status: z.enum(["Pending", "In Progress", "Completed"]),

  description: z
    .string()
    .trim()
    .max(500, "Description must be 500 characters or less."),
});

export type AssignmentFormValues = z.infer<
  typeof assignmentSchema
>;