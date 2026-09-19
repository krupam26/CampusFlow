"use client";

import {
  Bell,
  Command,
  LogOut,
  Menu,
  Search,
} from "lucide-react";

import { ThemeToggle } from "./theme-toggle";

type TopbarProps = {
  onMenuClick?: () => void;
};

export function Topbar({ onMenuClick }: TopbarProps) {
  return (
    <header className="flex h-[78px] items-center justify-between border-b bg-background px-5 sm:px-7 lg:px-9">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="flex h-10 w-10 items-center justify-center rounded-lg border bg-card lg:hidden"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <button className="hidden h-10 w-[330px] items-center gap-3 rounded-lg border bg-card px-3 text-left text-sm text-muted-foreground sm:flex">
          <Search className="h-4 w-4" />

          <span className="flex-1">
            Search your academic world...
          </span>

          <span className="flex items-center gap-1 rounded border bg-muted px-1.5 py-1 text-[9px]">
            <Command className="h-3 w-3" />
            K
          </span>
        </button>

        <button
          className="flex h-10 w-10 items-center justify-center rounded-lg border bg-card sm:hidden"
          aria-label="Search"
        >
          <Search className="h-4 w-4" />
        </button>
      </div>

      <div className="flex items-center gap-2">
        <button
          className="relative flex h-10 w-10 items-center justify-center rounded-lg border bg-card"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />

          <span className="absolute right-2.5 top-2 h-1.5 w-1.5 rounded-full bg-primary" />
        </button>

        <div className="pixel hidden text-[10px] text-muted-foreground md:block">
          WED · SEP 19
        </div>

        <div className="ml-2 hidden h-10 items-center gap-2 border-l-2 border-dashed pl-3 sm:flex">
          <div className="pixel flex h-8 w-8 items-center justify-center bg-primary text-sm text-primary-foreground shadow-[2px_2px_0_var(--foreground)]">
            K
          </div>

          <div className="hidden text-left lg:block">
            <p className="text-[11px] font-bold leading-none">KRUPA MEHTA</p>
            <p className="pixel mt-1 text-[8px] text-muted-foreground">AIML · LVL 12</p>
          </div>

          <button className="ml-1 hidden text-muted-foreground hover:text-primary lg:block" aria-label="Open profile menu">
            <LogOut className="h-3.5 w-3.5 rotate-180" />
          </button>
        </div>

        <ThemeToggle />
      </div>
    </header>
  );
}