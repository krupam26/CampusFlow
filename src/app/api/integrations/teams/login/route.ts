import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const clientId = process.env.MICROSOFT_CLIENT_ID;
  const tenant = process.env.MICROSOFT_TENANT_ID || "common";

  if (!clientId) {
    return NextResponse.json(
      {
        error: "MICROSOFT_CONFIG_MISSING",
        message:
          "MICROSOFT_CLIENT_ID is not configured in your .env file. Follow the setup guide in the dialog or connect via Microsoft Graph Token.",
      },
      { status: 400 }
    );
  }

  const { searchParams } = new URL(req.url);
  const origin = new URL(req.url).origin;
  const redirectUri = `${origin}/api/integrations/teams/callback`;

  const scopes = [
    "openid",
    "profile",
    "email",
    "offline_access",
    "https://graph.microsoft.com/EduAssignments.Read",
    "https://graph.microsoft.com/EduRoster.Read",
    "https://graph.microsoft.com/User.Read",
  ].join(" ");

  const authUrl = new URL(
    `https://login.microsoftonline.com/${tenant}/oauth2/v2.0/authorize`
  );

  authUrl.searchParams.set("client_id", clientId);
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("redirect_uri", redirectUri);
  authUrl.searchParams.set("response_mode", "query");
  authUrl.searchParams.set("scope", scopes);
  authUrl.searchParams.set("state", "campusflow_teams_sync");
  authUrl.searchParams.set("prompt", "select_account");

  return NextResponse.redirect(authUrl.toString());
}
