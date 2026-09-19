export function PixelMascot() {
  return (
    <div className="relative flex h-32 w-32 items-center justify-center">
      <div className="absolute bottom-1 h-5 w-24 rounded-full bg-black/10 blur-sm" />

      <div className="relative">
        {/* antenna */}
        <div className="absolute -top-7 left-1/2 h-7 w-1 -translate-x-1/2 bg-foreground" />

        <div className="absolute -top-9 left-1/2 h-3 w-3 -translate-x-1/2 bg-primary shadow-[2px_2px_0_rgba(24,24,31,0.25)]" />

        {/* head */}
        <div className="relative h-20 w-24 border-2 border-foreground bg-card shadow-[5px_5px_0_var(--primary)]">
          {/* ears */}
          <div className="absolute -left-3 top-6 h-8 w-3 bg-foreground" />
          <div className="absolute -right-3 top-6 h-8 w-3 bg-foreground" />

          {/* eyes */}
          <div className="absolute left-5 top-7 h-4 w-4 bg-primary" />
          <div className="absolute right-5 top-7 h-4 w-4 bg-primary" />

          {/* mouth */}
          <div className="absolute bottom-5 left-1/2 h-2 w-8 -translate-x-1/2 bg-foreground" />
        </div>

        {/* body */}
        <div className="mx-auto mt-1 h-7 w-16 border-2 border-foreground bg-primary" />
      </div>
    </div>
  );
}