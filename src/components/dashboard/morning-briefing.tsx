import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Sparkles,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function MorningBriefing() {
  return (
    <section className="relative overflow-hidden rounded-[28px] border bg-card p-7 shadow-sm sm:p-9">
      <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute bottom-0 left-1/3 h-40 w-40 rounded-full bg-primary/5 blur-3xl" />

      <div className="relative">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-start">
          <div className="max-w-2xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border bg-muted/60 px-3 py-1.5 text-xs font-medium text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              Your morning briefing
            </div>

            <h1 className="text-3xl font-semibold tracking-[-0.03em] sm:text-4xl lg:text-[42px]">
              Good morning, Krupa 👋
            </h1>

            <p className="mt-4 max-w-xl text-base leading-7 text-muted-foreground">
              Here&apos;s everything you need to know before
              you start your college day.
            </p>
          </div>

          <Button
            variant="outline"
            size="lg"
            className="w-fit rounded-xl gap-2"
          >
            View full day
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="mt-9 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border bg-background p-5">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <CalendarDays className="h-4 w-4 text-primary" />
              First class
            </div>

            <p className="mt-4 text-xl font-semibold">
              FST Lab
            </p>

            <p className="mt-2 text-sm text-muted-foreground">
              9:00 AM · Lab 204
            </p>
          </div>

          <div className="rounded-2xl border bg-background p-5">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              Pending work
            </div>

            <p className="mt-4 text-xl font-semibold">
              2 assignments
            </p>

            <p className="mt-2 text-sm text-muted-foreground">
              One is due tomorrow
            </p>
          </div>

          <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5">
            <div className="flex items-center gap-2 text-sm font-medium text-amber-700 dark:text-amber-400">
              <Clock3 className="h-4 w-4" />
              Schedule change
            </div>

            <p className="mt-4 text-xl font-semibold">
              CN Lab changed
            </p>

            <p className="mt-2 text-sm text-muted-foreground">
              Tomorrow · 11:00 AM
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}