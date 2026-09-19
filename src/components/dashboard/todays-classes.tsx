import { Clock3, MapPin } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const classes = [
  {
    time: "09:00",
    period: "AM",
    subject: "FST",
    title: "Full Stack Development",
    room: "Lab 204",
    type: "Lab",
    active: true,
  },
  {
    time: "11:00",
    period: "AM",
    subject: "CN",
    title: "Computer Networks",
    room: "Room 302",
    type: "Lecture",
  },
  {
    time: "02:00",
    period: "PM",
    subject: "ML",
    title: "Machine Learning",
    room: "Room 401",
    type: "Lecture",
  },
];

export function TodaysClasses() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base">
              Today&apos;s classes
            </CardTitle>

            <p className="mt-1 text-xs text-muted-foreground">
              Wednesday, September 19
            </p>
          </div>

          <Badge variant="secondary">
            3 classes
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {classes.map((item) => (
          <div
            key={`${item.time}-${item.subject}`}
            className={`flex items-center gap-4 rounded-xl border p-3 transition-colors ${
              item.active
                ? "border-primary/20 bg-primary/5"
                : "bg-muted/20"
            }`}
          >
            <div className="w-14 text-center">
              <p className="text-sm font-semibold">
                {item.time}
              </p>

              <p className="text-[10px] text-muted-foreground">
                {item.period}
              </p>
            </div>

            <div className="h-10 w-px bg-border" />

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-xs font-bold text-primary">
              {item.subject}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">
                {item.title}
              </p>

              <div className="mt-1 flex flex-wrap gap-3 text-xs text-muted-foreground">
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
              <Badge className="hidden sm:flex">
                Next
              </Badge>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}