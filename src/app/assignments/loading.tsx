import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* HEADER */}
        <section className="pixel-border bg-card p-6 md:p-8">
          <Skeleton className="h-4 w-40" />

          <Skeleton className="mt-4 h-10 w-72" />

          <Skeleton className="mt-3 h-4 w-full max-w-xl" />
        </section>

        {/* SUMMARY */}
        <section className="grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="pixel-border-subtle bg-card p-5"
            >
              <Skeleton className="h-3 w-24" />
              <Skeleton className="mt-4 h-8 w-16" />
            </div>
          ))}
        </section>

        {/* ASSIGNMENTS */}
        <section className="space-y-3">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="pixel-border-subtle bg-card p-5"
            >
              <Skeleton className="h-4 w-64" />

              <Skeleton className="mt-3 h-3 w-40" />

              <Skeleton className="mt-4 h-3 w-full" />
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}