import { NextResponse } from "next/server";
import { getCampusAIResponse } from "@/lib/campus-ai";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    let { messages = [], message, context = {}, apiKey: userApiKey } = body;

    if (message && (!messages || messages.length === 0)) {
      messages = [{ role: "user", content: message }];
    }

    const apiKey = process.env.GEMINI_API_KEY || userApiKey;
    const lastUserMessage = [...messages].reverse().find((m: any) => m.role === "user")?.content || "";

    if (!lastUserMessage) {
      return NextResponse.json({ error: "No message provided" }, { status: 400 });
    }

    // 1. If Gemini API Key is available, use Google Gemini
    if (apiKey && apiKey.trim() !== "") {
      const now = new Date();
      const currentDay = now.toLocaleDateString("en-US", { weekday: "long" });
      const currentDateStr = now.toISOString().split("T")[0];
      const currentTimeStr = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

      const systemPrompt = `You are Campus AI, an advanced, friendly, and ultra-smart academic assistant for Krupa at DJSCE using CampusFlow.

CURRENT DATE & TIME:
• Day: ${currentDay}
• Date: ${currentDateStr}
• Current Local Time: ${currentTimeStr}

KRUPA'S ACADEMIC CONTEXT:
1. TIMETABLE:
${JSON.stringify(context.timetable || [], null, 2)}

2. DAY SWAPS & SCHEDULE OVERRIDES:
Day Swaps: ${JSON.stringify(context.daySwaps || [], null, 2)}
Overrides: ${JSON.stringify(context.overrides || [], null, 2)}

3. ASSIGNMENTS:
${JSON.stringify(context.assignments || [], null, 2)}

4. TASKS:
${JSON.stringify(context.tasks || [], null, 2)}

CRITICAL BEHAVIOR GUIDELINES:
1. TIME-SPECIFIC QUESTIONS: When the user asks about a specific time or time range (e.g. "which lecture is there on tuesday from 8.00 am to 10.am" or "am I free at 2pm?"):
   - ONLY answer for that specific requested time interval!
   - DO NOT dump the full day schedule unless they asked for "all classes" or "full day".
   - State clearly which class is during that window (with time, subject, room, faculty), and state if any part of that window is free time.
2. GENERAL CONVERSATION & ASSISTANCE: Answer ANY question the user asks with warmth, wit, and intelligence. If they say "how r u", reply politely and warmly. If they ask to draft an email to a professor, explain a complex engineering/science concept, solve a problem, or give study advice, answer comprehensively and smartly.
3. ROOMS & PROFESSORS: Always use the exact room numbers and professor names from their timetable context.
4. TONE & FORMAT: Use clean Markdown with bullet points, bold headers, and suitable emojis. Keep answers clear, direct, and well-organized.`;

      // Infer any day mentioned in conversation history
      const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
      let lastMentionedDay: string | undefined;
      for (const m of [...messages].reverse()) {
        const found = daysOfWeek.find((d) => m.content?.toLowerCase().includes(d.toLowerCase()));
        if (found) {
          lastMentionedDay = found;
          break;
        }
      }
      if (lastMentionedDay && !context.lastMentionedDay) {
        context.lastMentionedDay = lastMentionedDay;
      }

      // Build Gemini contents history (must start with 'user' and have content)
      let formattedHistory = messages
        .filter((m: any) => m.content && m.content.trim())
        .slice(-10)
        .map((m: any) => ({
          role: m.role === "assistant" ? "model" : "user",
          parts: [{ text: m.content }],
        }));

      // In Gemini API, history cannot start with 'model'
      while (formattedHistory.length > 0 && formattedHistory[0].role === "model") {
        formattedHistory.shift();
      }

      if (formattedHistory.length === 0) {
        formattedHistory = [{ role: "user", parts: [{ text: lastUserMessage }] }];
      }

      // Try modern Gemini models: gemini-flash-latest -> gemini-3.8-flash -> gemini-flash-lite-latest
      const modelsToTry = [
        "gemini-flash-latest",
        "gemini-3.8-flash",
        "gemini-flash-lite-latest",
      ];

      for (const modelName of modelsToTry) {
        try {
          const geminiRes = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey.trim()}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                systemInstruction: {
                  parts: [{ text: systemPrompt }],
                },
                contents: formattedHistory,
                generationConfig: {
                  temperature: 0.6,
                  maxOutputTokens: 1200,
                },
              }),
            }
          );

          if (geminiRes.ok) {
            const geminiData = await geminiRes.json();
            const text =
              geminiData.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";

            if (text) {
              return NextResponse.json({
                success: true,
                response: text,
                provider: `gemini (${modelName})`,
              });
            }
          } else {
            const errTxt = await geminiRes.text();
            console.warn(`Model ${modelName} returned status ${geminiRes.status}:`, errTxt.slice(0, 150));
          }
        } catch (fetchErr: any) {
          console.warn(`Error connecting to ${modelName}:`, fetchErr?.message);
        }
      }
    }

    // 2. Local Intelligent Fallback
    const localResponse = getCampusAIResponse(lastUserMessage, context);

    return NextResponse.json({
      success: true,
      response: localResponse,
      provider: "local",
      hasGeminiKey: Boolean(apiKey && apiKey.trim() !== ""),
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
