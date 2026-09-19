"use client";
import { toast } from "sonner";

import { saveTask } from "@/app/actions/task-actions";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Pencil, Plus, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useCampusFlowStore } from "@/stores/campusflow-store";

import type {
  Task,
  TaskPriority,
  TaskStatus,
} from "@/types/campusflow";

import {
  taskSchema,
  type TaskFormValues,
} from "@/lib/validations/task";

type Props = {
  task?: Task;
  trigger?: React.ReactNode;
};

export function AddTaskDialog({
  task,
  trigger,
}: Props) {
  const addTask = useCampusFlowStore(
    (state) => state.addTask
  );

  const updateTask = useCampusFlowStore(
    (state) => state.updateTask
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
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),

    defaultValues: {
      title: "",
      dueDate: "",
      priority: "Medium",
      status: "Pending",
      description: "",
    },
  });

  useEffect(() => {
    if (!open) return;

    if (task) {
      reset({
        title: task.title,
        dueDate: task.dueDate,
        priority: task.priority,
        status: task.status ?? "Pending",
        description: task.description ?? "",
      });
    } else {
      reset({
        title: "",
        dueDate: "",
        priority: "Medium",
        status: "Pending",
        description: "",
      });
    }
  }, [open, task, reset]);

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
  const deleteTask = useCampusFlowStore(
  (state) => state.deleteTask
);

  async function onSubmit(
  data: TaskFormValues
) {
  const optimisticId =
    task?.id ?? crypto.randomUUID();

  const previousTask = task
    ? { ...task }
    : null;

  const completed =
    data.status === "Completed";

  // Optimistic update
  if (task) {
    updateTask(task.id, {
      title: data.title,
      dueDate: data.dueDate,
      priority:
        data.priority as TaskPriority,
      status:
        data.status as TaskStatus,
      description: data.description,
      completed,
    });
  } else {
    addTask({
      id: optimisticId,
      title: data.title,
      dueDate: data.dueDate,
      priority:
        data.priority as TaskPriority,
      status:
        data.status as TaskStatus,
      description: data.description,
      completed,
    });
  }

  const result = await saveTask(data);

  if (!result.success) {
    if (task && previousTask) {
      updateTask(
        task.id,
        previousTask
      );
    } else {
      deleteTask(optimisticId);
    }

    toast.error(result.message);
    return;
  }

  toast.success(
    task
      ? "Task updated successfully."
      : "Task created successfully."
  );

  setOpen(false);
}

  const button = (
    <button
      type="button"
      onClick={() => setOpen(true)}
      className={
        trigger
          ? "block w-full p-0 text-left"
          : task
          ? "pixel-border-subtle flex h-9 items-center gap-2 bg-muted px-3 text-xs transition-all hover:-translate-y-0.5"
          : "pixel-button pixel-border inline-flex h-10 items-center justify-center gap-2 bg-primary px-4 text-xs font-semibold text-primary-foreground"
      }
    >
      {trigger ? (
        trigger
      ) : task ? (
        <>
          <Pencil className="h-3.5 w-3.5" />
          EDIT
        </>
      ) : (
        <>
          <Plus className="h-4 w-4" />
          ADD TASK
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
            className="fixed inset-0 z-9999 flex items-center justify-center bg-black/70 p-4"
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
                    PERSONAL WORKFLOW
                  </p>

                  <h2 className="pixel-heading mt-1 text-xl">
                    {task
                      ? "EDIT TASK"
                      : "ADD TASK"}
                  </h2>

                  <p className="mt-1 text-xs text-muted-foreground">
                    {task
                      ? "Update the details of this task."
                      : "Add a task to your personal workload."}
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
                    <Field label="TASK TITLE">
                      <input
                        {...register("title")}
                        placeholder="e.g. Complete FST documentation"
                        className="form-input"
                      />

                      {errors.title && (
                        <ErrorMessage>
                          {errors.title.message}
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
                      placeholder="Add notes or details..."
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
                      : task
                        ? "SAVE CHANGES"
                        : "SAVE TASK"}
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