"use client";

import {
  Bell,
  Menu,
  Search,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./theme-toggle";

type TopbarProps = {
  onMenuClick?: () => void;
};

export function Topbar({ onMenuClick }: TopbarProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-md lg:px-6">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={onMenuClick}
          aria-label="Open navigation"
        >
          <Menu className="h-5 w-5" />
        </Button>

        <div className="hidden items-center gap-2 rounded-xl border bg-muted/40 px-3 py-2 text-sm text-muted-foreground sm:flex">
          <Search className="h-4 w-4" />
          <span>Search anything...</span>
          <kbd className="ml-8 rounded-md border bg-background px-1.5 py-0.5 text-[10px]">
            ⌘ K
          </kbd>
        </div>

        <Button
          variant="outline"
          size="icon"
          className="sm:hidden"
          aria-label="Search"
        >
          <Search className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />

          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-destructive" />
        </Button>

        <ThemeToggle />

        <div className="ml-2 flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
          K
        </div>
      </div>
    </header>
  );
}