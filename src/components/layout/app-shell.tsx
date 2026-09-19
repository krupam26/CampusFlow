"use client";

import { useState } from "react";

import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";

export function AppShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-muted/20">
      <div className="flex min-h-screen">
        {mobileSidebarOpen && (
          <button
            className="fixed inset-0 z-40 bg-black/40 lg:hidden"
            onClick={() => setMobileSidebarOpen(false)}
            aria-label="Close navigation overlay"
          />
        )}

        <Sidebar
          mobileOpen={mobileSidebarOpen}
          onClose={() => setMobileSidebarOpen(false)}
        />

        <div className="flex min-w-0 flex-1 flex-col">
          <Topbar
            onMenuClick={() => setMobileSidebarOpen(true)}
          />

          <main className="flex-1">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}