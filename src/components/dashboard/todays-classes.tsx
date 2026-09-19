import {
  ArrowRight,
  Clock3,
  MapPin,
} from "lucide-react";

const classes = [
  {
    time: "09:00",
    period: "AM",
    subject: "FST",
    title: "Full Stack Development",
    room: "Lab 204",
    type: "LAB",
    active: true,
  },
  {
    time: "11:00",
    period: "AM",
    subject: "CN",
    title: "Computer Networks",
    room: "Room 302",
    type: "LECTURE",
  },
  {
    time: "02:00",
    period: "PM",
    subject: "ML",
    title: "Machine Learning",
    room: "Room 401",
    type: "LECTURE",
  },
];

export function TodaysClasses() {
  return (
    <section className="rounded-2xl border-2 bg-card p-5 shadow-[4px_4px_0_rgba(24,24,31,0.06)] sm:p-6">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="pixel text-[10px] text-primary">
            // SCHEDULE
          </p>

          <h2 className="mt-2 text-xl font-bold tracking-tight">
            TODAY&apos;S CLASSES
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Wednesday · September 19
          </p>
        </div>

        <span className="pixel rounded-md border-2 bg-muted px-2.5 py-1.5 text-[10px]">
          03 CLASSES
        </span>
      </div>

      <div className="space-y-3">
        {classes.map((item) => (
          <div
            key={item.subject}
            className={[
              "group flex items-center gap-4 rounded-xl border-2 p-4 transition-all",
              item.active
                ? "border-primary/35 bg-primary/[0.035] shadow-[3px_3px_0_rgba(102,87,232,0.12)]"
                : "border-border hover:-translate-y-0.5 hover:shadow-[3px_3px_0_rgba(24,24,31,0.06)]",
            ].join(" ")}
          >
            <div className="w-14 shrink-0 text-center">
              <p className="pixel text-sm font-bold">
                {item.time}
              </p>

              <p className="pixel mt-1 text-[8px] text-muted-foreground">
                {item.period}
              </p>
            </div>

            <div className="h-11 w-0.5 bg-border" />

            <div className="pixel flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-[11px] font-bold text-primary">
              {item.subject}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold">
                {item.title}
              </p>

              <div className="mt-1.5 flex flex-wrap gap-3 text-[11px] text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {item.room}
                </span>

                <span className="flex items-center gap-1">
                  <Clock3 className="h-3 w-3" />
                  {item.type}
                </span>
              </div>
            </div>

            {item.active && (
              <span className="pixel hidden rounded border border-primary/30 bg-primary/10 px-2 py-1 text-[9px] text-primary sm:block">
                NEXT
              </span>
            )}
          </div>
        ))}
      </div>

      <button className="pixel mt-5 flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed py-3 text-[10px] text-muted-foreground hover:bg-muted hover:text-foreground">
        VIEW COMPLETE TIMETABLE
        <ArrowRight className="h-3.5 w-3.5" />
      </button>
    </section>
  );
}