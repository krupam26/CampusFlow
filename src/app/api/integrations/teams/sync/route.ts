import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import type { Assignment } from "@/types/campusflow";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const cookieStore = await cookies();
    const cookieToken = cookieStore.get("ms_teams_token")?.value;

    const authHeader = req.headers.get("authorization");
    const headerToken = authHeader?.startsWith("Bearer ")
      ? authHeader.slice(7).trim()
      : null;

    const accessToken = body.accessToken?.trim() || headerToken || cookieToken;
    const { useSampleData } = body;

    // Explicit sample data requested for demonstration purposes ONLY
    if (useSampleData) {
      const today = new Date();
      const inDays = (n: number) => {
        const d = new Date(today);
        d.setDate(d.getDate() + n);
        return d.toISOString().split("T")[0];
      };

      const sampleAssignments: Assignment[] = [
        {
          id: "teams-djsce-cn-lab-4",
          title: "Lab 4: Socket Programming in Python (TCP/UDP)",
          subject: "Computer Networks",
          code: "CSC502",
          dueDate: inDays(2),
          status: "Pending",
          priority: "High",
          completed: false,
          description: "Implement client-server socket communication for iterative and concurrent file transfer in Python.",
          source: "teams",
          teamsWebUrl: "https://teams.microsoft.com",
        },
        {
          id: "teams-djsce-ml-assn-2",
          title: "Assignment 2: Decision Trees & Random Forest",
          subject: "Machine Learning",
          code: "CSC501",
          dueDate: inDays(4),
          status: "Pending",
          priority: "Medium",
          completed: false,
          description: "Train Decision Tree model on dataset. Submit Jupyter Notebook.",
          source: "teams",
          teamsWebUrl: "https://teams.microsoft.com",
        },
      ];

      return NextResponse.json({
        success: true,
        count: sampleAssignments.length,
        assignments: sampleAssignments,
        isSample: true,
        message: "Loaded demo assignments for testing.",
      });
    }

    // Real Teams Sync Requires an Access Token
    if (!accessToken) {
      return NextResponse.json(
        {
          error: "NOT_CONNECTED",
          message:
            "Your Microsoft Teams school account is not connected yet. Please sign in with your school account or enter a Microsoft Graph access token.",
        },
        { status: 401 }
      );
    }

    // 1. Fetch real assignments from Microsoft Graph Education API
    let graphRes = await fetch(
      "https://graph.microsoft.com/v1.0/education/me/assignments?$top=50&$expand=submissions",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/json",
        },
      }
    );

    let rawItems: any[] = [];

    if (graphRes.ok) {
      const data = await graphRes.json();
      rawItems = Array.isArray(data.value) ? data.value : [];
    } else if (graphRes.status === 404 || graphRes.status === 400) {
      // Fallback: Fetch classes first, then assignments per class
      const classesRes = await fetch(
        "https://graph.microsoft.com/v1.0/education/classes?$select=id,displayName,course",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: "application/json",
          },
        }
      );

      if (classesRes.ok) {
        const classesData = await classesRes.json();
        const classesList = Array.isArray(classesData.value)
          ? classesData.value
          : [];

        for (const cls of classesList.slice(0, 10)) {
          const assnRes = await fetch(
            `https://graph.microsoft.com/v1.0/education/classes/${cls.id}/assignments?$top=20`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
                Accept: "application/json",
              },
            }
          );
          if (assnRes.ok) {
            const assnData = await assnRes.json();
            if (Array.isArray(assnData.value)) {
              rawItems.push(
                ...assnData.value.map((a: any) => ({
                  ...a,
                  classDisplayName: cls.displayName,
                  classCode: cls.course?.courseNumber || cls.displayName?.slice(0, 7),
                }))
              );
            }
          }
        }
      } else {
        const errText = await graphRes.text();
        return NextResponse.json(
          {
            error: `Microsoft Graph API error (${graphRes.status})`,
            details: errText,
          },
          { status: graphRes.status }
        );
      }
    } else {
      const errText = await graphRes.text();
      let errorMsg = `Microsoft Graph API error (${graphRes.status})`;
      try {
        const parsed = JSON.parse(errText);
        if (parsed.error?.message) {
          errorMsg = parsed.error.message;
        }
      } catch {}

      return NextResponse.json(
        {
          error: errorMsg,
          details: errText,
        },
        { status: graphRes.status }
      );
    }

    if (rawItems.length === 0) {
      return NextResponse.json({
        success: true,
        count: 0,
        assignments: [],
        message: "Successfully connected to Microsoft Teams! You currently have no assignments posted.",
      });
    }

    // 2. Map real Teams assignments to CampusFlow assignment model
    const assignments: Assignment[] = rawItems.map((item: any) => {
      let dueDateStr = new Date().toISOString().split("T")[0];
      if (item.dueDateTime) {
        dueDateStr = item.dueDateTime.split("T")[0];
      }

      const diffDays = Math.ceil(
        (new Date(dueDateStr).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
      );

      const priority =
        diffDays <= 2 ? "High" : diffDays <= 6 ? "Medium" : "Low";

      // Check if submitted by examining submissions array or status
      const isCompleted =
        item.status === "submitted" ||
        item.status === "completed" ||
        item.submissions?.some((s: any) => s.status === "submitted");

      return {
        id: `teams-${item.id}`,
        title: item.displayName || "Untitled Teams Assignment",
        subject: item.classDisplayName || item.classId || "Teams Course",
        code: item.classCode || "TEAMS",
        dueDate: dueDateStr,
        status: isCompleted ? "Completed" : "Pending",
        priority,
        completed: isCompleted,
        description: item.instructions?.content || "",
        source: "teams",
        teamsWebUrl: item.webUrl || "https://teams.microsoft.com",
      };
    });

    return NextResponse.json({
      success: true,
      count: assignments.length,
      assignments,
      message: `Successfully fetched ${assignments.length} assignments directly from your Microsoft Teams account!`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to sync Microsoft Teams assignments" },
      { status: 500 }
    );
  }
}
