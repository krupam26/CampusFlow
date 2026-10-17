import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");
  const origin = new URL(req.url).origin;

  if (error || !code) {
    const errorMsg = encodeURIComponent(
      errorDescription || error || "Failed to authenticate with Microsoft"
    );
    return NextResponse.redirect(`${origin}/assignments?teams_error=${errorMsg}`);
  }

  const clientId = process.env.MICROSOFT_CLIENT_ID;
  const clientSecret = process.env.MICROSOFT_CLIENT_SECRET;
  const tenant = process.env.MICROSOFT_TENANT_ID || "common";
  const redirectUri = `${origin}/api/integrations/teams/callback`;

  if (!clientId || !clientSecret) {
    return NextResponse.redirect(
      `${origin}/assignments?teams_error=${encodeURIComponent(
        "Missing MICROSOFT_CLIENT_ID or MICROSOFT_CLIENT_SECRET in .env"
      )}`
    );
  }

  try {
    const tokenRes = await fetch(
      `https://login.microsoftonline.com/${tenant}/oauth2/v2.0/token`,
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          client_id: clientId,
          client_secret: clientSecret,
          grant_type: "authorization_code",
          code,
          redirect_uri: redirectUri,
        }),
      }
    );

    const tokenData = await tokenRes.json();

    if (!tokenRes.ok || !tokenData.access_token) {
      return NextResponse.redirect(
        `${origin}/assignments?teams_error=${encodeURIComponent(
          tokenData.error_description || "Failed to exchange token with Microsoft"
        )}`
      );
    }

    const cookieStore = await cookies();
    cookieStore.set("ms_teams_token", tokenData.access_token, {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: tokenData.expires_in || 3600,
      sameSite: "lax",
    });

    return NextResponse.redirect(
      `${origin}/assignments?teams_connected=true`
    );
  } catch (err: any) {
    return NextResponse.redirect(
      `${origin}/assignments?teams_error=${encodeURIComponent(
        err.message || "Failed to connect Microsoft Teams"
      )}`
    );
  }
}
