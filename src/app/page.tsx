import { AppShell } from "@/components/layout/app-shell";

import { MorningBriefing } from "@/components/dashboard/morning-briefing";
import { TodaysClasses } from "@/components/dashboard/todays-classes";
import { UpcomingAssignments } from "@/components/dashboard/upcoming-assignments";
import { PriorityTasks } from "@/components/dashboard/priority-tasks";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { XPCard } from "@/components/dashboard/xp-card";


export default function Home() {
  return (
    <AppShell>
      <div className="pixel-canvas min-h-full">
        <div className="mx-auto w-full max-w-[1500px] space-y-6 p-5 sm:p-7 lg:p-9">

          {/* HERO */}
          <MorningBriefing />

          {/* MAIN */}
          <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <TodaysClasses />

            <UpcomingAssignments />
          </div>

          {/* PRODUCTIVITY */}
          <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
            <PriorityTasks />

            <QuickActions />
          </div>

          {/* PROGRESS */}
          <XPCard />

          {/* AI */}
          <section className="relative overflow-hidden rounded-2xl border-2 border-primary/35 bg-primary/[0.055] p-6 sm:p-7">
            <div className="absolute right-0 top-0 h-32 w-32 pixel-dots opacity-60" />

            <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-4">
                <div className="pixel flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border-2 border-primary bg-primary text-sm text-primary-foreground shadow-[3px_3px_0_var(--foreground)]">
                  AI!
                </div>

                <div>
                  <p className="pixel text-sm">
                    CAMPUSFLOW AI
                  </p>

                  <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
                    Your academic copilot knows your timetable,
                    assignments, tasks and schedule changes.
                    Ask it what you should do next.
                  </p>
                </div>
              </div>

              <button className="pixel-button w-fit rounded-lg border-2 border-primary bg-primary px-5 py-3 text-[10px] font-bold text-white shadow-[4px_4px_0_var(--foreground)]">
                OPEN AI ASSISTANT →
              </button>
            </div>
          </section>

        </div>
      </div>
    </AppShell>
  );
}