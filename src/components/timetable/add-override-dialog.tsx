"use client";

import { useState } from "react";
import { CalendarClock, Plus } from "lucide-react";

import { useCampusFlowStore } from "@/stores/campusflow-store";
import type { ClassType, ScheduleOverride } from "@/types/campusflow";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type AddOverrideDialogProps = {
  classId?: string;
};

export function AddOverrideDialog({
  classId,
}: AddOverrideDialogProps) {
  const addOverride = useCampusFlowStore(
    (state) => state.addOverride
  );

  const timetable = useCampusFlowStore(
    (state) => state.timetable
  );

  const [open, setOpen] = useState(false);

  const selectedClass = timetable.find(
    (item) => item.id === classId
  );

  const [form, setForm] = useState({
    date: "",
    subject: selectedClass?.subject ?? "",
    code: selectedClass?.code ?? "",
    faculty: selectedClass?.faculty ?? "",
    room: selectedClass?.room ?? "",
    startTime: selectedClass?.startTime ?? "",
    endTime: selectedClass?.endTime ?? "",
    type: (selectedClass?.type ?? "Lecture") as ClassType,
    action: "modified" as ScheduleOverride["action"],
  });

  function updateField(
    field: keyof typeof form,
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

    if (!form.date) return;

    if (!form.subject.trim()) return;

    if (!form.startTime || !form.endTime) return;

    if (form.startTime >= form.endTime) return;

    const override: ScheduleOverride = {
      id: crypto.randomUUID(),
      date: form.date,
      classId,
      subject: form.subject.trim(),
      code: form.code.trim().toUpperCase(),
      faculty: form.faculty.trim() || "Faculty TBA",
      room: form.room.trim() || "Room TBA",
      startTime: form.startTime,
      endTime: form.endTime,
      type: form.type,
      action: form.action,
    };

    addOverride(override);

    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="gap-2"
        >
          <CalendarClock className="h-4 w-4" />
          CHANGE DATE
        </Button>
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
        "
      >
        <DialogHeader>
          <DialogTitle className="pixel-heading text-2xl">
            SCHEDULE OVERRIDE
          </DialogTitle>

          <p className="text-sm text-muted-foreground">
            Change this class for one specific date without
            changing your normal timetable.
          </p>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          {/* DATE */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold">
              Date
            </label>

            <Input
              type="date"
              value={form.date}
              onChange={(event) =>
                updateField(
                  "date",
                  event.target.value
                )
              }
              className="h-11"
            />
          </div>

          {/* ACTION */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold">
              Change Type
            </label>

            <select
              value={form.action}
              onChange={(event) =>
                updateField(
                  "action",
                  event.target.value
                )
              }
              className="
                flex h-11 w-full rounded-md
                border border-input
                bg-background px-3
                text-sm
                outline-none
                focus:ring-2
                focus:ring-primary
              "
            >
              <option value="modified">
                Modified Class
              </option>

              <option value="added">
                Added Class
              </option>

              <option value="cancelled">
                Cancelled Class
              </option>
            </select>
          </div>

          {/* SUBJECT + CODE */}
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
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold">
                Code
              </label>

              <Input
                value={form.code}
                onChange={(event) =>
                  updateField(
                    "code",
                    event.target.value
                  )
                }
                className="h-11"
              />
            </div>
          </div>

          {/* FACULTY */}
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
              className="h-11"
            />
          </div>

          {/* ROOM */}
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
              placeholder="Lab 302"
              className="h-11"
            />
          </div>

          {/* TIME */}
          <div>
            <label className="mb-2 block text-sm font-semibold">
              New Timing
            </label>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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

          {/* TYPE */}
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
              className="
                flex h-11 w-full rounded-md
                border border-input
                bg-background px-3
                text-sm
                outline-none
                focus:ring-2
                focus:ring-primary
              "
            >
              <option value="Lecture">Lecture</option>
              <option value="Lab">Lab</option>
              <option value="Tutorial">Tutorial</option>
            </select>
          </div>

          <div className="border-t border-border" />

          <Button
            type="submit"
            className="pixel-button h-11 w-full"
          >
            <Plus className="mr-2 h-4 w-4" />
            SAVE OVERRIDE
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}