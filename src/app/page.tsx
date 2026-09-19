import { AppShell } from "@/components/layout/app-shell";
import { MorningBriefing } from "@/components/dashboard/morning-briefing";
import { TodaysClasses } from "@/components/dashboard/todays-classes";
import { UpcomingAssignments } from "@/components/dashboard/upcoming-assignments";
import { PriorityTasks } from "@/components/dashboard/priority-tasks";

export default function Home() {
  return (
    <AppShell>
      <div className="mx-auto w-full max-w-[1600px] space-y-6 p-4 sm:p-6 lg:p-8">
        <MorningBriefing />

        <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <TodaysClasses />
          <UpcomingAssignments />
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <PriorityTasks />

          <div className="rounded-2xl border bg-card p-6">
            <p className="text-sm font-semibold">
              Coming next
            </p>

            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Tomorrow&apos;s schedule, deadlines and
              temporary timetable changes will appear here.
            </p>
          </div>
        </div>
      </div>
    </AppShell>
  );
}