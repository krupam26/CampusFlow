export default function Loading() {
  return (
    <main className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* HEADER */}
        <section className="pixel-border bg-card p-6 md:p-8">
          <div className="h-4 w-40 animate-pulse bg-muted" />

          <div className="mt-4 h-10 w-64 animate-pulse bg-muted" />

          <div className="mt-3 h-4 w-full max-w-xl animate-pulse bg-muted" />
        </section>

        {/* TASKS */}
        <section className="space-y-3">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="pixel-border-subtle bg-card p-5"
            >
              <div className="flex items-center gap-4">
                <div className="h-5 w-5 animate-pulse bg-muted" />

                <div className="flex-1">
                  <div className="h-4 w-56 animate-pulse bg-muted" />

                  <div className="mt-3 h-3 w-32 animate-pulse bg-muted" />
                </div>

                <div className="h-5 w-16 animate-pulse bg-muted" />
              </div>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}