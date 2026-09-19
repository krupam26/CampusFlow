"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Pencil, Plus, X } from "lucide-react";

import { useCampusFlowStore } from "@/stores/campusflow-store";
import type {
  Assignment,
  AssignmentPriority,
  AssignmentStatus,
} from "@/types/campusflow";

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

  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [code, setCode] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] =
    useState<AssignmentPriority>("Medium");
  const [status, setStatus] =
    useState<AssignmentStatus>("Pending");
  const [description, setDescription] = useState("");

  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;

    if (assignment) {
      setTitle(assignment.title);
      setSubject(assignment.subject);
      setCode(assignment.code);
      setDueDate(assignment.dueDate);
      setPriority(assignment.priority);
      setStatus(assignment.status);
      setDescription(assignment.description ?? "");
    } else {
      setTitle("");
      setSubject("");
      setCode("");
      setDueDate("");
      setPriority("Medium");
      setStatus("Pending");
      setDescription("");
    }

    setError("");
  }, [open, assignment]);

  useEffect(() => {
    if (!open) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);

    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener(
        "keydown",
        handleEscape
      );

      document.body.style.overflow = "";
    };
  }, [open]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!title.trim()) {
      setError("Please enter an assignment title.");
      return;
    }

    if (!subject.trim()) {
      setError("Please enter a subject.");
      return;
    }

    if (!dueDate) {
      setError("Please select a due date.");
      return;
    }

    if (assignment) {
      updateAssignment(assignment.id, {
        title: title.trim(),
        subject: subject.trim(),
        code: code.trim(),
        dueDate,
        priority,
        status,
        description: description.trim(),
      });
    } else {
      addAssignment({
        id: crypto.randomUUID(),
        title: title.trim(),
        subject: subject.trim(),
        code: code.trim(),
        dueDate,
        priority,
        status,
        description: description.trim(),
        completed: status === "Completed",
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
                onSubmit={handleSubmit}
                className="min-h-0 overflow-y-auto p-5"
              >
                <div className="space-y-5">
                  {error && (
                    <div className="border border-red-600/30 bg-red-600/10 p-3 text-xs text-red-600">
                      {error}
                    </div>
                  )}

                  {/* DETAILS */}
                  <div className="grid gap-5 md:grid-cols-2">
                    <Field label="TITLE">
                      <input
                        value={title}
                        onChange={(e) =>
                          setTitle(e.target.value)
                        }
                        placeholder="FST Assignment 2"
                        className="form-input"
                      />
                    </Field>

                    <Field label="SUBJECT">
                      <input
                        value={subject}
                        onChange={(e) =>
                          setSubject(e.target.value)
                        }
                        placeholder="Full Stack Development"
                        className="form-input"
                      />
                    </Field>

                    <Field label="CODE">
                      <input
                        value={code}
                        onChange={(e) =>
                          setCode(e.target.value)
                        }
                        placeholder="FST"
                        className="form-input"
                      />
                    </Field>

                    <Field label="DUE DATE">
                      <input
                        type="date"
                        value={dueDate}
                        onChange={(e) =>
                          setDueDate(e.target.value)
                        }
                        className="form-input"
                      />
                    </Field>

                    <Field label="PRIORITY">
                      <select
                        value={priority}
                        onChange={(e) =>
                          setPriority(
                            e.target
                              .value as AssignmentPriority
                          )
                        }
                        className={`form-input font-semibold ${
                          priority === "High"
                            ? "text-red-600"
                            : priority === "Medium"
                              ? "text-amber-600"
                              : "text-emerald-600"
                        }`}
                      >
                        <option value="Low" className="text-emerald-600">
                          Low
                        </option>

                        <option value="Medium" className="text-amber-600">
                          Medium
                        </option>

                        <option value="High" className="text-red-600">
                          High
                        </option>
                      </select>
                    </Field>

                    <Field label="STATUS">
                      <select
                        value={status}
                        onChange={(e) =>
                          setStatus(
                            e.target
                              .value as AssignmentStatus
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

                  {/* DESCRIPTION */}
                  <Field label="DESCRIPTION">
                    <textarea
                      value={description}
                      onChange={(e) =>
                        setDescription(e.target.value)
                      }
                      placeholder="Add instructions, notes or submission details..."
                      rows={4}
                      className="form-input placeholder-field resize-none"
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
                    {assignment
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