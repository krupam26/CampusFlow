"use client";

import { useEffect, useState } from "react";
import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        className="flex h-10 w-10 items-center justify-center rounded-lg border border-sidebar-border text-sidebar-muted"
        aria-label="Change theme"
      >
        <Monitor className="h-4 w-4" />
      </button>
    );
  }

  const nextTheme =
    theme === "light"
      ? "dark"
      : theme === "dark"
        ? "system"
        : "light";

  return (
    <button
      onClick={() => setTheme(nextTheme)}
      className="pixel-button flex h-10 w-10 items-center justify-center rounded-lg border border-sidebar-border text-sidebar-muted hover:bg-white/5 hover:text-white"
      aria-label={`Switch to ${nextTheme} theme`}
    >
      {theme === "dark" ? (
        <Moon className="h-4 w-4" />
      ) : theme === "light" ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Monitor className="h-4 w-4" />
      )}
    </button>
  );
}