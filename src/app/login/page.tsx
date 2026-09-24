"use client";

import { authClient } from "@/lib/auth-client";

export default function LoginPage() {
  const handleGoogleLogin = async () => {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/",
    });
  };

  const handleGithubLogin = async () => {
    await authClient.signIn.social({
      provider: "github",
      callbackURL: "/",
    });
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-6 rounded-2xl border p-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Welcome to CampusFlow</h1>
          <p className="mt-2 text-muted-foreground">
            Sign in to continue to your student dashboard
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleGoogleLogin}
            className="w-full rounded-lg border px-4 py-3 font-medium transition hover:bg-muted"
          >
            Continue with Google
          </button>

          <button
            onClick={handleGithubLogin}
            className="w-full rounded-lg border px-4 py-3 font-medium transition hover:bg-muted"
          >
            Continue with GitHub
          </button>
        </div>
      </div>
    </main>
  );
}