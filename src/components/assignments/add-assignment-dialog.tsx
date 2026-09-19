"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Pencil, Plus, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { saveAssignment } from "@/app/actions/assignment-actions";
import { useCampusFlowStore } from "@/stores/campusflow-store";

import type {
  Assignment,
  AssignmentPriority,
  AssignmentStatus,
} from "@/types/campusflow";

import {
  assignmentSchema,
  type AssignmentFormValues,
} from "@/lib/validations/assignment";

type Props = {
  assignment?: Assignment;
  trigger?: React.ReactNode;
};

export function AddAssignmentDialog({
  assignment,
  trigger,
}: Props) {
  const addAssignment = useCampusFlowStore(
    (state) => state.addAssignment
  );

  const updateAssignment = useCampusFlowStore(
    (state) => state.updateAssignment
  );

  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<AssignmentFormValues>({
    resolver: zodResolver(assignmentSchema),

    defaultValues: {
      title: "",
      subject: "",
      code: "",
      dueDate: "",
      priority: "Medium",
      status: "Pending",
      description: "",
    },
  });

  useEffect(() => {
    if (!open) return;

    if (assignment) {
      reset({
        title: assignment.title,
        subject: assignment.subject,
        code: assignment.code,
        dueDate: assignment.dueDate,
        priority: assignment.priority,
        status: assignment.status,
        description: assignment.description ?? "",
      });
    } else {
      reset({
        title: "",
        subject: "",
        code: "",
        dueDate: "",
        priority: "Medium",
        status: "Pending",
        description: "",
      });
    }
  }, [open, assignment, reset]);

  useEffect(() => {
    if (!open) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener(
      "keydown",
      handleEscape
    );

    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener(
        "keydown",
        handleEscape
      );

      document.body.style.overflow = "";
    };
  }, [open]);

  function onSubmit(data: AssignmentFormValues) {
    if (assignment) {
      updateAssignment(assignment.id, {
        title: data.title,
        subject: data.subject,
        code: data.code,
        dueDate: data.dueDate,
        priority:
          data.priority as AssignmentPriority,
        status:
          data.status as AssignmentStatus,
        description: data.description,
        completed: data.status === "Completed",
      });
    } else {
      addAssignment({
        id: crypto.randomUUID(),
        title: data.title,
        subject: data.subject,
        code: data.code,
        dueDate: data.dueDate,
        priority:
          data.priority as AssignmentPriority,
        status:
          data.status as AssignmentStatus,
        description: data.description,
        completed: data.status === "Completed",
      });
    }

    setOpen(false);
  }

  const button = (
    <button
      type="button"
      onClick={() => setOpen(true)}
      className={
        assignment
          ? "pixel-border-subtle flex h-9 items-center gap-2 bg-muted px-3 text-xs transition-all hover:-translate-y-0.5"
          : "pixel-button pixel-border inline-flex h-10 items-center justify-center gap-2 bg-primary px-4 text-xs font-semibold text-primary-foreground"
      }
    >
      {trigger ? (
        trigger
      ) : assignment ? (
        <>
          <Pencil className="h-3.5 w-3.5" />
          EDIT
        </>
      ) : (
        <>
          <Plus className="h-4 w-4" />
          ADD ASSIGNMENT
        </>
      )}
    </button>
  );

  if (!open) {
    return button;
  }

  return (
    <>
      {button}

      {typeof document !== "undefined" &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 p-4"
            onMouseDown={(event) => {
              if (
                event.target ===
                event.currentTarget
              ) {
                setOpen(false);
              }
            }}
          >
            <div
              className="pixel-border flex w-full max-w-2xl flex-col overflow-hidden bg-card"
              style={{
                maxHeight:
                  "calc(100vh - 32px)",
                boxShadow:
                  "6px 6px 0px hsl(var(--foreground))",
              }}
            >
              {/* HEADER */}
              <div className="flex shrink-0 items-start justify-between border-b border-border bg-card p-5">
                <div>
                  <p className="pixel text-xs text-primary">
                    ACADEMIC WORK
                  </p>

                  <h2 className="pixel-heading mt-1 text-xl">
                    {assignment
                      ? "EDIT ASSIGNMENT"
                      : "ADD ASSIGNMENT"}
                  </h2>

                  <p className="mt-1 text-xs text-muted-foreground">
                    {assignment
                      ? "Update the details of this assignment."
                      : "Add a new assignment to your academic workload."}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="flex h-8 w-8 items-center justify-center border border-border bg-muted transition-all hover:-translate-y-0.5 hover:bg-primary hover:text-primary-foreground"
                  aria-label="Close"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* FORM */}
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="min-h-0 overflow-y-auto p-5"
              >
                <div className="space-y-5">

                  {/* DETAILS */}
                  <div className="grid gap-5 md:grid-cols-2">

                    {/* TITLE */}
                    <Field label="TITLE">
                      <input
                        {...register("title")}
                        placeholder="FST Assignment 2"
                        className="form-input"
                      />

                      {errors.title && (
                        <ErrorMessage>
                          {errors.title.message}
                        </ErrorMessage>
                      )}
                    </Field>

                    {/* SUBJECT */}
                    <Field label="SUBJECT">
                      <input
                        {...register("subject")}
                        placeholder="Full Stack Development"
                        className="form-input"
                      />

                      {errors.subject && (
                        <ErrorMessage>
                          {errors.subject.message}
                        </ErrorMessage>
                      )}
                    </Field>

                    {/* CODE */}
                    <Field label="CODE">
                      <input
                        {...register("code")}
                        placeholder="FST"
                        className="form-input"
                      />

                      {errors.code && (
                        <ErrorMessage>
                          {errors.code.message}
                        </ErrorMessage>
                      )}
                    </Field>

                    {/* DUE DATE */}
                    <Field label="DUE DATE">
                      <input
                        type="date"
                        {...register("dueDate")}
                        className="form-input"
                      />

                      {errors.dueDate && (
                        <ErrorMessage>
                          {errors.dueDate.message}
                        </ErrorMessage>
                      )}
                    </Field>

                    {/* PRIORITY */}
                    <Field label="PRIORITY">
                      <select
                        {...register("priority")}
                        className="form-input font-semibold"
                      >
                        <option
                          value="Low"
                          className="text-emerald-600"
                        >
                          Low
                        </option>

                        <option
                          value="Medium"
                          className="text-amber-600"
                        >
                          Medium
                        </option>

                        <option
                          value="High"
                          className="text-red-600"
                        >
                          High
                        </option>
                      </select>

                      {errors.priority && (
                        <ErrorMessage>
                          {errors.priority.message}
                        </ErrorMessage>
                      )}
                    </Field>

                    {/* STATUS */}
                    <Field label="STATUS">
                      <select
                        {...register("status")}
                        className="form-input"
                      >
                        <option value="Pending">
                          Pending
                        </option>

                        <option value="In Progress">
                          In Progress
                        </option>

                        <option value="Completed">
                          Completed
                        </option>
                      </select>

                      {errors.status && (
                        <ErrorMessage>
                          {errors.status.message}
                        </ErrorMessage>
                      )}
                    </Field>
                  </div>

                  {/* DESCRIPTION */}
                  <Field label="DESCRIPTION">
                    <textarea
                      {...register("description")}
                      placeholder="Add instructions, notes or submission details..."
                      rows={4}
                      className="form-input placeholder-field resize-none"
                    />

                    {errors.description && (
                      <ErrorMessage>
                        {errors.description.message}
                      </ErrorMessage>
                    )}
                  </Field>
                </div>

                {/* FOOTER */}
                <div className="mt-6 flex justify-end gap-3 border-t border-border pt-5">
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="pixel-border-subtle bg-muted px-4 py-2 text-xs transition-all hover:-translate-y-0.5"
                  >
                    CANCEL
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="pixel-button pixel-border bg-primary px-5 py-2 text-xs font-semibold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isSubmitting
                      ? "SAVING..."
                      : assignment
                        ? "SAVE CHANGES"
                        : "SAVE ASSIGNMENT"}
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-2">
      <span className="pixel text-[10px] text-muted-foreground">
        {label}
      </span>

      {children}
    </label>
  );
}

function ErrorMessage({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <p className="text-[10px] text-destructive">
      {children}
    </p>
  );
}