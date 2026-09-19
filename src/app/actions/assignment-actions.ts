"use server";

import {
  assignmentSchema,
  type AssignmentFormValues,
} from "@/lib/validations/assignment";

type AssignmentActionResult =
  | {
      success: true;
      message: string;
      data: AssignmentFormValues;
    }
  | {
      success: false;
      message: string;
      errors?: Record<string, string[] | undefined>;
    };

export async function saveAssignment(
  values: AssignmentFormValues
): Promise<AssignmentActionResult> {
  const result = assignmentSchema.safeParse(values);

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
    message: "Assignment validated successfully.",
    data: result.data,
  };
}