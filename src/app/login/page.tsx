"use client";

import { ArrowRight, Code2, Globe2, GraduationCap, Loader2 } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { ThemeToggle } from "@/components/layout/theme-toggle";

export default function LoginPage() {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const [signingInWith, setSigningInWith] = useState<"google" | "github" | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (session) {
      router.replace("/dashboard");
    }
  }, [router, session]);

  const handleGoogleLogin = async () => {
    await signIn("google");
  };

  const handleGithubLogin = async () => {
    await signIn("github");
  };

  const signIn = async (provider: "google" | "github") => {
    setSigningInWith(provider);
    setError(null);

    try {
      await authClient.signIn.social({
        provider,
        callbackURL: "/dashboard",
      });
    } catch {
      setError("We couldn't start sign-in. Please try again.");
      setSigningInWith(null);
    }
  };

  if (session) {
    return null;
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-5 py-8 sm:px-8">
      <div className="absolute right-5 top-5 z-10 sm:right-8 sm:top-8">
        <ThemeToggle />
      </div>

      <div className="grid w-full max-w-5xl overflow-hidden border-2 border-foreground bg-card shadow-[8px_8px_0_rgba(23,35,43,0.18)] lg:grid-cols-[0.9fr_1.1fr]">
        <section className="relative flex min-h-[360px] flex-col justify-between overflow-hidden bg-sidebar p-7 text-sidebar-foreground sm:p-10 lg:min-h-[600px] lg:p-12">
          <div className="absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] [background-size:24px_24px]" />

          <div className="relative">
            <div className="mb-10 flex items-center gap-3">
              <div className="pixel-border flex h-11 w-11 items-center justify-center border-primary bg-primary text-primary-foreground">
                <GraduationCap className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[17px] font-bold tracking-wide">CAMPUSFLOW</p>
                <p className="pixel text-[9px] text-sidebar-muted">YOUR ACADEMIC OS</p>
              </div>
            </div>

            <p className="pixel mb-4 text-[10px] text-primary">{"// YOUR NEXT CHAPTER"}</p>
            <h1 className="max-w-sm text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl">
              Make room for what matters.
            </h1>
          </div>

          <div className="relative mt-12 flex items-end justify-between gap-6">
            <p className="max-w-[230px] text-sm leading-relaxed text-sidebar-muted">
              One calm place for classes, tasks, deadlines, and the small wins in between.
            </p>
            <div className="pixel hidden h-16 w-16 shrink-0 items-center justify-center border-2 border-primary bg-primary/15 text-3xl text-primary sm:flex">
              +XP
            </div>
          </div>
        </section>

        <section className="flex items-center bg-background p-7 sm:p-12 lg:p-16">
          <div className="w-full max-w-md">
            <div className="mb-9">
              <p className="pixel mb-3 text-[10px] text-primary">WELCOME BACK, STUDENT</p>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Let&apos;s get you in.</h2>
              <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
                Pick up where you left off and keep your academic world moving.
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleGoogleLogin}
                disabled={signingInWith !== null}
                className="pixel-button flex h-14 w-full items-center gap-3 border-2 border-foreground bg-card px-4 text-left font-semibold shadow-[3px_3px_0_var(--foreground)] transition hover:bg-muted disabled:cursor-wait disabled:opacity-60"
              >
                {signingInWith === "google" ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <svg className="h-5 w-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                )}
                <div className="flex-1">
                  <span className="block leading-tight">Continue with Gmail</span>
                  <span className="text-[10px] text-muted-foreground font-normal">Google OAuth 2.0</span>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </button>

              <button
                onClick={handleGithubLogin}
                disabled={signingInWith !== null}
                className="pixel-button flex h-14 w-full items-center gap-3 border-2 border-foreground bg-card px-4 text-left font-semibold shadow-[3px_3px_0_var(--foreground)] transition hover:bg-muted disabled:cursor-wait disabled:opacity-60"
              >
                {signingInWith === "github" ? <Loader2 className="h-5 w-5 animate-spin" /> : <Code2 className="h-5 w-5" />}
                <div className="flex-1">
                  <span className="block leading-tight">Continue with GitHub</span>
                  <span className="text-[10px] text-muted-foreground font-normal">Developer Account</span>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>

            <div className="mt-8 border-t border-dashed pt-5">
              <p className="text-xs leading-relaxed text-muted-foreground">
                By continuing, you agree to use CampusFlow for your own academic planning.
              </p>
              {error && <p className="mt-3 text-xs font-semibold text-danger" role="alert">{error}</p>}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
