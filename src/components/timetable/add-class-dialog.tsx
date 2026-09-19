"use client";

import { useEffect, useState } from "react";
import { Pencil, Plus } from "lucide-react";

import { useCampusFlowStore } from "@/stores/campusflow-store";
import type {
  ClassItem,
  ClassType,
  DayOfWeek,
} from "@/types/campusflow";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const days: DayOfWeek[] = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

type ClassForm = {
  subject: string;
  code: string;
  faculty: string;
  room: string;
  day: DayOfWeek;
  startTime: string;
  endTime: string;
  type: ClassType;
};

const emptyForm: ClassForm = {
  subject: "",
  code: "",
  faculty: "",
  room: "",
  day: "Monday",
  startTime: "",
  endTime: "",
  type: "Lecture",
};

type AddClassDialogProps = {
  classItem?: ClassItem;
  trigger?: React.ReactNode;
};

export function AddClassDialog({
  classItem,
  trigger,
}: AddClassDialogProps) {
  const addClass = useCampusFlowStore(
    (state) => state.addClass
  );

  const updateClass = useCampusFlowStore(
    (state) => state.updateClass
  );

  const isEditing = Boolean(classItem);

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<ClassForm>(emptyForm);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open && classItem) {
      setForm({
        subject: classItem.subject,
        code: classItem.code,
        faculty: classItem.faculty,
        room: classItem.room,
        day: classItem.day,
        startTime: classItem.startTime,
        endTime: classItem.endTime,
        type: classItem.type,
      });
    }

    if (open && !classItem) {
      setForm(emptyForm);
    }

    setError("");
  }, [open, classItem]);

  function updateField(
    field: keyof ClassForm,
    value: string
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");

    if (!form.subject.trim()) {
      setError("Please enter a subject name.");
      return;
    }

    if (!form.code.trim()) {
      setError("Please enter a subject code.");
      return;
    }

    if (!form.room.trim()) {
      setError("Please enter a room or location.");
      return;
    }

    if (!form.startTime) {
      setError("Please select a start time.");
      return;
    }

    if (!form.endTime) {
      setError("Please select an end time.");
      return;
    }

    if (form.startTime >= form.endTime) {
      setError("End time must be later than start time.");
      return;
    }

    if (isEditing && classItem) {
      updateClass(classItem.id, {
        subject: form.subject.trim(),
        code: form.code.trim().toUpperCase(),
        faculty: form.faculty.trim() || "Faculty TBA",
        room: form.room.trim(),
        day: form.day,
        startTime: form.startTime,
        endTime: form.endTime,
        type: form.type,
      });
    } else {
      addClass({
        id: crypto.randomUUID(),
        subject: form.subject.trim(),
        code: form.code.trim().toUpperCase(),
        faculty: form.faculty.trim() || "Faculty TBA",
        room: form.room.trim(),
        day: form.day,
        startTime: form.startTime,
        endTime: form.endTime,
        type: form.type,
      });
    }

    setOpen(false);
    setError("");
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button className="pixel-button gap-2">
            <Plus className="h-4 w-4" />
            ADD CLASS
          </Button>
        )}
      </DialogTrigger>

      <DialogContent
        className="
          pixel-border
          w-[calc(100vw-2rem)]
          max-w-2xl
          max-h-[90vh]
          overflow-y-auto
          rounded-xl
          bg-card
          p-6
          shadow-[8px_8px_0_rgba(23,35,43,0.25)]
        "
      >
        <DialogHeader>
          <DialogTitle className="pixel-heading text-2xl">
            {isEditing ? "EDIT CLASS" : "ADD CLASS"}
          </DialogTitle>

          <p className="text-sm text-muted-foreground">
            {isEditing
              ? "Update this class in your academic schedule."
              : "Add a class to your weekly academic schedule."}
          </p>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="block text-sm font-semibold">
                Subject
              </label>

              <Input
                value={form.subject}
                onChange={(event) =>
                  updateField(
                    "subject",
                    event.target.value
                  )
                }
                placeholder="Full Stack Development"
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold">
                Subject Code
              </label>

              <Input
                value={form.code}
                onChange={(event) =>
                  updateField(
                    "code",
                    event.target.value
                  )
                }
                placeholder="FST"
                className="h-11"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold">
              Faculty
            </label>

            <Input
              value={form.faculty}
              onChange={(event) =>
                updateField(
                  "faculty",
                  event.target.value
                )
              }
              placeholder="Prof. Mehta"
              className="h-11"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="block text-sm font-semibold">
                Day
              </label>

              <select
                value={form.day}
                onChange={(event) =>
                  updateField(
                    "day",
                    event.target.value
                  )
                }
                className="flex h-11 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary"
              >
                {days.map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold">
                Room / Location
              </label>

              <Input
                value={form.room}
                onChange={(event) =>
                  updateField(
                    "room",
                    event.target.value
                  )
                }
                placeholder="Lab 204"
                className="h-11"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold">
              Class Timing
            </label>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">
                  START TIME
                </p>

                <Input
                  type="time"
                  value={form.startTime}
                  onChange={(event) =>
                    updateField(
                      "startTime",
                      event.target.value
                    )
                  }
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">
                  END TIME
                </p>

                <Input
                  type="time"
                  value={form.endTime}
                  onChange={(event) =>
                    updateField(
                      "endTime",
                      event.target.value
                    )
                  }
                  className="h-11"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold">
              Class Type
            </label>

            <select
              value={form.type}
              onChange={(event) =>
                updateField(
                  "type",
                  event.target.value
                )
              }
              className="flex h-11 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="Lecture">Lecture</option>
              <option value="Lab">Lab</option>
              <option value="Tutorial">Tutorial</option>
            </select>
          </div>

          {error && (
            <div className="pixel-border-subtle rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="border-t border-border" />

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="h-11"
            >
              CANCEL
            </Button>

            <Button
              type="submit"
              className="pixel-button h-11 px-6"
            >
              {isEditing ? (
                <>
                  <Pencil className="mr-2 h-4 w-4" />
                  SAVE CHANGES
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  SAVE CLASS
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}