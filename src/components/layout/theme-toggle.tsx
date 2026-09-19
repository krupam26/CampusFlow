"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const nextTheme = isDark ? "light" : "dark";

  return (
    <button
      onClick={() => setTheme(nextTheme)}
      className="pixel-button flex h-10 items-center justify-center gap-2 rounded-lg border border-sidebar-border px-2.5 text-sidebar-muted hover:bg-white/5 hover:text-white"
      aria-label={`Switch to ${nextTheme} mode`}
      title={`Switch to ${nextTheme} mode`}
    >
      {isDark ? (
        <Moon className="h-4 w-4" />
      ) : resolvedTheme === "light" ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Monitor className="h-4 w-4" />
      )}
      <span className="pixel text-[9px]">{isDark ? "LIGHT" : "DARK"}</span>
    </button>
  );
}