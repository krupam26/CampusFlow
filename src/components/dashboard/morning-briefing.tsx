import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Sparkles,
} from "lucide-react";

import { PixelMascot } from "./pixel-mascot";

export function MorningBriefing() {
  return (
    <section className="pixel-grid relative overflow-hidden rounded-2xl border-2 border-foreground bg-card p-6 shadow-[6px_6px_0_rgba(102,87,232,0.22)] sm:p-8 lg:p-10">
      <div className="absolute right-0 top-0 h-32 w-32 opacity-50">
        <div className="pixel-dots h-full w-full" />
      </div>

      <div className="relative flex flex-col gap-8 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex items-center gap-5">
          <div className="hidden shrink-0 sm:block">
            <PixelMascot />
          </div>

          <div>
            <div className="pixel mb-4 inline-flex items-center gap-2 rounded-md border-2 border-primary bg-primary/10 px-3 py-1.5 text-[10px] text-primary">
              <Sparkles className="h-3 w-3" />
              MORNING BRIEFING
            </div>

            <h1 className="pixel-heading text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
              GOOD MORNING,
              <br />
              <span className="text-primary">
                KRUPA! 👋
              </span>
            </h1>

            <p className="mt-4 max-w-xl text-[15px] leading-7 text-muted-foreground">
              Your academic world is ready.
              <br className="hidden sm:block" />
              Here&apos;s what needs your attention today.
            </p>
          </div>
        </div>

        <button className="pixel-button flex h-11 w-fit items-center gap-2 rounded-lg border-2 border-foreground bg-primary px-5 text-sm font-bold text-white shadow-[4px_4px_0_var(--foreground)]">
          VIEW FULL DAY
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      <div className="relative mt-8 grid gap-4 md:grid-cols-3">
        <SummaryCard
          icon={<CalendarDays className="h-5 w-5" />}
          label="FIRST CLASS"
          title="FST LAB"
          description="09:00 AM · LAB 204"
        />

        <SummaryCard
          icon={<CheckCircle2 className="h-5 w-5" />}
          label="PENDING WORK"
          title="2 ASSIGNMENTS"
          description="1 deadline tomorrow"
          accent="green"
        />

        <SummaryCard
          icon={<Clock3 className="h-5 w-5" />}
          label="SCHEDULE CHANGE"
          title="CN LAB"
          description="Tomorrow · 11:00 AM"
          accent="yellow"
        />
      </div>
    </section>
  );
}

function SummaryCard({
  icon,
  label,
  title,
  description,
  accent = "purple",
}: {
  icon: React.ReactNode;
  label: string;
  title: string;
  description: string;
  accent?: "purple" | "green" | "yellow";
}) {
  const styles = {
    purple: "bg-primary/8 border-primary/20 text-primary",
    green: "bg-emerald-500/8 border-emerald-500/20 text-emerald-600",
    yellow: "bg-yellow-500/10 border-yellow-500/25 text-yellow-700",
  };

  return (
    <div
      className={`rounded-xl border-2 p-5 ${styles[accent]}`}
    >
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-background/70">
          {icon}
        </div>

        <span className="pixel text-[10px]">
          {label}
        </span>
      </div>

      <p className="pixel mt-5 text-[17px] font-bold text-foreground">
        {title}
      </p>

      <p className="mt-2 text-xs text-muted-foreground">
        {description}
      </p>
    </div>
  );
}