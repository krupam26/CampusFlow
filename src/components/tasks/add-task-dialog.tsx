"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Pencil, Plus, X } from "lucide-react";

import { useCampusFlowStore } from "@/stores/campusflow-store";
import type {
  Task,
  TaskPriority,
  TaskStatus,
} from "@/types/campusflow";

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

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] =
    useState<TaskPriority>("Medium");
  const [status, setStatus] =
    useState<TaskStatus>("Pending");
  const [dueDate, setDueDate] = useState("");

  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;

    if (task) {
      setTitle(task.title);
      setDescription(task.description ?? "");
      setPriority(task.priority);
      setStatus(
        task.status ??
          (task.completed
            ? "Completed"
            : "Pending")
      );
      setDueDate(task.dueDate ?? "");
    } else {
      setTitle("");
      setDescription("");
      setPriority("Medium");
      setStatus("Pending");
      setDueDate("");
    }

    setError("");
  }, [open, task]);

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

  function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!title.trim()) {
      setError("Please enter a task title.");
      return;
    }

    const completed = status === "Completed";

    if (task) {
      updateTask(task.id, {
        title: title.trim(),
        description: description.trim(),
        priority,
        status,
        dueDate,
        completed,
      });
    } else {
      addTask({
        id: crypto.randomUUID(),
        title: title.trim(),
        description: description.trim(),
        priority,
        status,
        dueDate,
        completed,
      });
    }

    setOpen(false);
  }

  const button = (
    <button
      type="button"
      onClick={() => setOpen(true)}
      className={
        task
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
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 p-4"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) {
                setOpen(false);
              }
            }}
          >
            <div
              className="pixel-border flex w-full max-w-2xl flex-col overflow-hidden bg-card"
              style={{
                maxHeight: "calc(100vh - 32px)",
                boxShadow:
                  "6px 6px 0px hsl(var(--foreground))",
              }}
            >
              {/* HEADER */}
              <div className="flex shrink-0 items-start justify-between border-b border-border p-5">
                <div>
                  <p className="pixel text-xs text-primary">
                    PERSONAL PRODUCTIVITY
                  </p>

                  <h2 className="pixel-heading mt-1 text-xl">
                    {task ? "EDIT TASK" : "ADD TASK"}
                  </h2>

                  <p className="mt-1 text-xs text-muted-foreground">
                    {task
                      ? "Update your task details."
                      : "Add something you need to get done."}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="flex h-8 w-8 items-center justify-center border border-border bg-muted transition-all hover:-translate-y-0.5 hover:bg-primary hover:text-primary-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* FORM */}
              <form
                onSubmit={handleSubmit}
                className="min-h-0 overflow-y-auto p-5"
              >
                <div className="space-y-5">
                  {error && (
                    <div className="border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">
                      {error}
                    </div>
                  )}

                  <div className="grid gap-5 md:grid-cols-2">
                    <Field label="TASK TITLE">
                      <input
                        value={title}
                        onChange={(event) =>
                          setTitle(event.target.value)
                        }
                        placeholder="Complete FST assignment"
                        className="form-input"
                      />
                    </Field>

                    <Field label="DUE DATE">
                      <input
                        type="date"
                        value={dueDate}
                        onChange={(event) =>
                          setDueDate(event.target.value)
                        }
                        className="form-input"
                      />
                    </Field>

                    <Field label="PRIORITY">
                      <select
                        value={priority}
                        onChange={(event) =>
                          setPriority(
                            event.target
                              .value as TaskPriority
                          )
                        }
                        className="form-input"
                      >
                        <option value="Low">
                          Low
                        </option>
                        <option value="Medium">
                          Medium
                        </option>
                        <option value="High">
                          High
                        </option>
                      </select>
                    </Field>

                    <Field label="STATUS">
                      <select
                        value={status}
                        onChange={(event) =>
                          setStatus(
                            event.target
                              .value as TaskStatus
                          )
                        }
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
                    </Field>
                  </div>

                  <Field label="DESCRIPTION">
                    <textarea
                      value={description}
                      onChange={(event) =>
                        setDescription(
                          event.target.value
                        )
                      }
                      placeholder="Add notes or details..."
                      rows={4}
                      className="form-input resize-none"
                    />
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
                    className="pixel-button pixel-border bg-primary px-5 py-2 text-xs font-semibold text-primary-foreground"
                  >
                    {task
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