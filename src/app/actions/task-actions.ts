"use server";

import {
  taskSchema,
  type TaskFormValues,
} from "@/lib/validations/task";

type TaskActionResult =
  | {
      success: true;
      message: string;
      data: TaskFormValues;
    }
  | {
      success: false;
      message: string;
      errors?: Record<string, string[] | undefined>;
    };

export async function saveTask(
  values: TaskFormValues
): Promise<TaskActionResult> {
  const result = taskSchema.safeParse(values);

  if (!result.success) {
    const flattened = result.error.flatten();

    return {
      success: false,
      message: "Please fix the validation errors.",
      errors: flattened.fieldErrors,
    };
  }

  return {
    success: true,
    message: "Task validated successfully.",
    data: result.data,
  };
}