"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  HelpCircle,
  KeyRound,
  RefreshCw,
  Sparkles,
  Trash2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useCampusFlowStore } from "@/stores/campusflow-store";
import type { Assignment } from "@/types/campusflow";

export function SyncTeamsDialog() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [accessToken, setAccessToken] = useState("");
  const [activeTab, setActiveTab] = useState<"connect" | "token" | "guide">("connect");

  const assignments = useCampusFlowStore((state) => state.assignments);
  const syncAssignments = useCampusFlowStore((state) => state.syncAssignments);
  const deleteAssignment = useCampusFlowStore((state) => state.deleteAssignment);

  const teamsAssignments = assignments.filter((a) => a.source === "teams");

  // Check URL params for OAuth redirect feedback
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);

    if (params.get("teams_connected") === "true") {
      toast.success("Microsoft Teams connected! Fetching your live assignments...");
      // Clean URL
      window.history.replaceState({}, "", window.location.pathname);
      handleLiveSync();
    } else if (params.get("teams_error")) {
      const errorMsg = params.get("teams_error");
      toast.error(`Microsoft Teams Connection Error: ${errorMsg}`);
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, []);

  async function handleLiveSync(tokenOverride?: string) {
    try {
      setLoading(true);
      const token = (tokenOverride ?? accessToken).trim();

      const res = await fetch("/api/integrations/teams/sync", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          accessToken: token || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.error === "NOT_CONNECTED") {
          toast.warning("Microsoft Teams account not connected yet.", {
            description: "Please sign in with your school account or enter an access token below.",
          });
          setActiveTab("connect");
          return;
        }
        throw new Error(data.message || data.error || "Failed to fetch from Microsoft Teams");
      }

      if (data.assignments && Array.isArray(data.assignments)) {
        if (data.assignments.length === 0) {
          toast.info("Connected to Microsoft Teams! You currently have 0 active assignments.");
        } else {
          syncAssignments(data.assignments as Assignment[]);
          toast.success(
            `Successfully imported ${data.assignments.length} assignments directly from Microsoft Teams! 🎉`
          );
          setOpen(false);
        }
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to sync assignments");
    } finally {
      setLoading(false);
    }
  }

  function handleClearSyncedTeams() {
    const teamsIds = teamsAssignments.map((a) => a.id);
    if (teamsIds.length === 0) return;

    if (confirm(`Remove ${teamsIds.length} synced Microsoft Teams assignments?`)) {
      teamsIds.forEach((id) => deleteAssignment(id));
      toast.success("Removed synced Microsoft Teams assignments.");
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          className="pixel-button h-10 gap-2 border-2 border-foreground bg-[#5B5FC7] font-semibold text-white shadow-[3px_3px_0_var(--foreground)] transition-transform hover:-translate-y-0.5 hover:bg-[#4F52B2]"
        >
          {/* Microsoft Teams SVG Icon */}
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
            <path
              d="M17.5 7.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM21.5 12h-4a1 1 0 0 0-1 1v4.5a3.5 3.5 0 0 0 7 0V13a1 1 0 0 0-2-1Z"
              fill="currentColor"
              opacity="0.8"
            />
            <path
              d="M11 6a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM16 11H6a2 2 0 0 0-2 2v6a5 5 0 0 0 10 0v-6a2 2 0 0 0 2-2Z"
              fill="currentColor"
            />
          </svg>
          SYNC WITH TEAMS
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-xl border-2 border-foreground bg-card p-6 shadow-[6px_6px_0_var(--foreground)]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#5B5FC7] text-white shadow-[2px_2px_0_var(--foreground)]">
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none">
                <path
                  d="M17.5 7.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM21.5 12h-4a1 1 0 0 0-1 1v4.5a3.5 3.5 0 0 0 7 0V13a1 1 0 0 0-2-1Z"
                  fill="currentColor"
                  opacity="0.8"
                />
                <path
                  d="M11 6a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM16 11H6a2 2 0 0 0-2 2v6a5 5 0 0 0 10 0v-6a2 2 0 0 0 2-2Z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <div>
              <DialogTitle className="pixel-heading text-xl">
                CONNECT MICROSOFT TEAMS
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                Fetch and sync your real college coursework, lab deadlines, and assignments.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Navigation Tabs */}
        <div className="mt-4 flex border-b border-border">
          <button
            type="button"
            onClick={() => setActiveTab("connect")}
            className={`border-b-2 px-3.5 py-2 text-xs font-semibold transition-colors ${
              activeTab === "connect"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            1. School Sign-in (OAuth)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("token")}
            className={`border-b-2 px-3.5 py-2 text-xs font-semibold transition-colors ${
              activeTab === "token"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            2. Direct Token (Graph Explorer)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("guide")}
            className={`border-b-2 px-3.5 py-2 text-xs font-semibold transition-colors ${
              activeTab === "guide"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            3. Setup Guide
          </button>
        </div>

        {/* TAB 1: SCHOOL SIGN IN */}
        {activeTab === "connect" && (
          <div className="mt-4 space-y-4">
            <div className="rounded-xl border border-primary/30 bg-primary/5 p-4">
              <h4 className="pixel text-xs font-bold text-primary">
                SIGN IN WITH YOUR COLLEGE ACCOUNT
              </h4>
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                Click below to authorize CampusFlow to read your assignments from your college Microsoft 365 / Teams account.
              </p>

              <a
                href="/api/integrations/teams/login"
                className="pixel-button mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-foreground bg-[#5B5FC7] font-bold text-white shadow-[3px_3px_0_var(--foreground)] transition-transform hover:-translate-y-0.5 hover:bg-[#4F52B2]"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11 11H1V1h10v10zm12 0H13V1h10v10zM11 23H1V13h10v10zm12 0H13V13h10v10z" />
                </svg>
                SIGN IN WITH MICROSOFT SCHOOL ACCOUNT
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>

            <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-800 dark:text-amber-300">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold">Note on College Microsoft 365 Accounts:</span>
                  <p className="mt-0.5 text-[11px] leading-relaxed text-muted-foreground">
                    If your college IT tenant requires an Azure App registration, you can either configure <code>MICROSOFT_CLIENT_ID</code> in <code>.env</code> (see Tab 3), or connect immediately via Microsoft Graph Explorer in Tab 2.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: DIRECT TOKEN */}
        {activeTab === "token" && (
          <div className="mt-4 space-y-4">
            <div className="rounded-xl border border-border bg-muted/40 p-4">
              <h4 className="pixel text-xs font-bold text-foreground">
                CONNECT VIA MICROSOFT GRAPH EXPLORER (INSTANT)
              </h4>
              <p className="mt-1 text-xs text-muted-foreground">
                If you haven&apos;t set up Azure App credentials yet, you can test live with an access token from Microsoft:
              </p>

              <ol className="mt-2 list-decimal space-y-1 pl-4 text-xs text-muted-foreground">
                <li>
                  Open{" "}
                  <a
                    href="https://developer.microsoft.com/en-us/graph/graph-explorer"
                    target="_blank"
                    rel="noreferrer"
                    className="font-semibold text-primary underline inline-flex items-center gap-0.5"
                  >
                    Microsoft Graph Explorer <ExternalLink className="h-3 w-3" />
                  </a>
                </li>
                <li>Sign in with your college/school Microsoft email.</li>
                <li>Click the <strong>Access token</strong> tab and copy the long token.</li>
                <li>Paste it below and click <strong>Fetch Real Assignments</strong>.</li>
              </ol>

              <div className="mt-3">
                <label className="block text-[11px] font-medium text-muted-foreground">
                  Paste Access Token:
                </label>
                <textarea
                  value={accessToken}
                  onChange={(e) => setAccessToken(e.target.value)}
                  placeholder="eyJ0eXAiOiJKV1QiLCJub25jZSI..."
                  rows={3}
                  className="mt-1 w-full rounded border border-input bg-background p-2 text-xs font-mono outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <Button
                type="button"
                disabled={loading || !accessToken.trim()}
                onClick={() => handleLiveSync()}
                className="pixel-button mt-3 w-full gap-2 border border-foreground bg-primary font-bold text-white shadow-[3px_3px_0_var(--foreground)]"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                {loading ? "FETCHING FROM TEAMS..." : "FETCH REAL TEAMS ASSIGNMENTS"}
              </Button>
            </div>
          </div>
        )}

        {/* TAB 3: STEP-BY-STEP SETUP GUIDE */}
        {activeTab === "guide" && (
          <div className="mt-4 space-y-3 text-xs text-muted-foreground">
            <div className="rounded-xl border border-border bg-card p-4 space-y-2.5">
              <h4 className="pixel text-xs font-bold text-foreground">
                HOW TO CONFIGURE MICROSOFT TEAMS (FOR DEVELOPERS/ADMINS)
              </h4>

              <div className="space-y-2">
                <p>
                  <strong>Step 1:</strong> Go to the{" "}
                  <a
                    href="https://entra.microsoft.com/#view/Microsoft_AAD_RegisteredApps/ApplicationsListBlade"
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary underline inline-flex items-center gap-0.5"
                  >
                    Microsoft Entra Admin Center <ExternalLink className="h-3 w-3" />
                  </a>{" "}
                  and click <strong>New registration</strong>.
                </p>

                <p>
                  <strong>Step 2:</strong> Set Redirect URI (Web) to:
                  <code className="block mt-1 bg-muted p-1.5 rounded font-mono text-[11px] text-foreground">
                    http://localhost:3000/api/integrations/teams/callback
                  </code>
                </p>

                <p>
                  <strong>Step 3:</strong> Under <strong>API permissions</strong>, add Microsoft Graph Delegated permissions:
                  <code className="block mt-1 bg-muted p-1.5 rounded font-mono text-[11px] text-foreground">
                    EduAssignments.Read, EduRoster.Read, User.Read
                  </code>
                </p>

                <p>
                  <strong>Step 4:</strong> In <strong>Certificates & secrets</strong>, create a Client Secret and copy the value.
                </p>

                <p>
                  <strong>Step 5:</strong> Paste your credentials in your <code>.env</code> file:
                  <pre className="mt-1 bg-muted p-2 rounded font-mono text-[11px] text-foreground overflow-x-auto">
{`MICROSOFT_CLIENT_ID="your-client-id"
MICROSOFT_CLIENT_SECRET="your-client-secret"
MICROSOFT_TENANT_ID="common"`}
                  </pre>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Active Synced Assignments Count & Clean Option */}
        {teamsAssignments.length > 0 && (
          <div className="mt-2 flex items-center justify-between border-t border-border pt-3 text-xs">
            <span className="text-muted-foreground">
              Currently have <strong>{teamsAssignments.length}</strong> assignments with <code>MS TEAMS</code> tag.
            </span>
            <button
              type="button"
              onClick={handleClearSyncedTeams}
              className="inline-flex items-center gap-1 font-semibold text-destructive hover:underline"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Remove Synced Teams Items
            </button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
