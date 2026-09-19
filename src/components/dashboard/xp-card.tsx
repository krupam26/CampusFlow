import { Flame, Trophy, Zap } from "lucide-react";

export function XPCard() {
  return (
    <section className="relative overflow-hidden rounded-2xl border-2 border-foreground bg-foreground p-5 text-background shadow-[5px_5px_0_rgba(102,87,232,0.35)]">
      <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-primary/20 blur-2xl" />

      <div className="relative">
        <div className="flex items-center justify-between">
          <div>
            <p className="pixel text-[9px] text-primary">
              ACADEMIC PROGRESS
            </p>

            <p className="pixel mt-2 text-2xl font-bold">
              LEVEL 12
            </p>

            <p className="mt-1 text-xs text-background/50">
              Academic Explorer
            </p>
          </div>

          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/20 text-primary">
            <Trophy className="h-5 w-5" />
          </div>
        </div>

        <div className="mt-6">
          <div className="mb-2 flex items-center justify-between">
            <span className="pixel text-[9px] text-background/50">
              XP
            </span>

            <span className="pixel text-[9px]">
              820 / 1000
            </span>
          </div>

          <div className="h-3 border-2 border-background/20 bg-background/10 p-[2px]">
            <div className="h-full w-[82%] bg-primary" />
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-2">
          <div className="rounded-lg bg-white/5 p-3">
            <div className="flex items-center gap-2">
              <Flame className="h-4 w-4 text-orange-400" />
              <span className="pixel text-[9px]">
                7 DAY STREAK
              </span>
            </div>
          </div>

          <div className="rounded-lg bg-white/5 p-3">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-yellow-400" />
              <span className="pixel text-[9px]">
                +100 XP TODAY
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}