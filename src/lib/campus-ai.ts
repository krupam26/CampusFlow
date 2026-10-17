import type {
  Assignment,
  ClassItem,
  DayOfWeek,
  DaySwap,
  ScheduleOverride,
  Task,
} from "@/types/campusflow";
import {
  formatDateKey,
  getDayName,
  getEffectiveClasses,
  getMinutesUntil,
  getNextDayFirstClass,
} from "./schedule";

export type CampusAIContext = {
  timetable: ClassItem[];
  assignments: Assignment[];
  tasks: Task[];
  overrides: ScheduleOverride[];
  daySwaps?: DaySwap[];
  currentDate?: Date;
  currentTime?: string;
  lastMentionedDay?: string;
};

const ALL_DAYS: DayOfWeek[] = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

function parseTimeRange(
  text: string
): { startMins: number; endMins: number; label: string } | null {
  const clean = text.toLowerCase().replace(/\s+/g, " ");

  // Matches "from 8.00 am to 10.am" or "from 8:00 to 10:00" or "8 am to 10 am" or "between 8 and 10"
  const rangeMatch = clean.match(
    /(?:from|between)?\s*(\d{1,2}(?:[:.]\d{2})?)\s*(am|pm)?\s*(?:to|and|-)\s*(\d{1,2}(?:[:.]\d{2})?)\s*(am|pm)?/i
  );

  if (rangeMatch) {
    const rawStart = rangeMatch[1];
    let startMer = rangeMatch[2];
    const rawEnd = rangeMatch[3];
    let endMer = rangeMatch[4];

    if (!startMer && endMer) {
      startMer = endMer;
    }

    const toMins = (tStr: string, mer?: string) => {
      const parts = tStr.replace(".", ":").split(":");
      let h = parseInt(parts[0], 10);
      const m = parts[1] ? parseInt(parts[1], 10) : 0;
      if (mer === "pm" && h < 12) h += 12;
      if (mer === "am" && h === 12) h = 0;
      return h * 60 + m;
    };

    const startMins = toMins(rawStart, startMer);
    const endMins = toMins(rawEnd, endMer);

    if (startMins < endMins) {
      const formatTime = (mins: number) => {
        const h = Math.floor(mins / 60);
        const m = mins % 60;
        return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
      };

      return {
        startMins,
        endMins,
        label: `${formatTime(startMins)} – ${formatTime(endMins)}`,
      };
    }
  }

  // Matches single time: "at 9 am" or "at 09:00" or "at 9.00"
  const singleMatch = clean.match(
    /(?:at|around)\s*(\d{1,2}(?:[:.]\d{2})?)\s*(am|pm)?/i
  );
  if (singleMatch) {
    const raw = singleMatch[1];
    const mer = singleMatch[2];
    const parts = raw.replace(".", ":").split(":");
    let h = parseInt(parts[0], 10);
    const m = parts[1] ? parseInt(parts[1], 10) : 0;
    if (mer === "pm" && h < 12) h += 12;
    if (mer === "am" && h === 12) h = 0;
    const startMins = h * 60 + m;

    const formatTime = (mins: number) => {
      const hr = Math.floor(mins / 60);
      const mn = mins % 60;
      return `${String(hr).padStart(2, "0")}:${String(mn).padStart(2, "0")}`;
    };

    return {
      startMins,
      endMins: startMins + 60,
      label: `around ${formatTime(startMins)}`,
    };
  }

  return null;
}

export function getCampusAIResponse(
  question: string,
  context: CampusAIContext
): string {
  const q = question.toLowerCase().trim();
  const now = context.currentDate || new Date();
  const currentHours = String(now.getHours()).padStart(2, "0");
  const currentMinutes = String(now.getMinutes()).padStart(2, "0");
  const currentTime = context.currentTime || `${currentHours}:${currentMinutes}`;

  const {
    timetable = [],
    assignments = [],
    tasks = [],
    overrides = [],
    daySwaps = [],
  } = context;

  // -------------------------------------------------------------
  // 1. GENERAL CONVERSATION & GREETINGS ("how r u", "hello", "who are you")
  // -------------------------------------------------------------
  if (
    q.includes("how r u") ||
    q.includes("how are you") ||
    q.includes("how r you") ||
    q.includes("how are u") ||
    q.includes("how's it going") ||
    q.includes("how do you do")
  ) {
    return "I'm doing great, Krupa! 😊 Thanks for asking.\n\nI'm ready to help you navigate your timetable, track upcoming assignments, or check your schedule. What's on your mind today?";
  }

  if (
    q.includes("who are you") ||
    q.includes("what are you") ||
    q.includes("what is your name")
  ) {
    return "I'm **Campus AI**, your personalized academic copilot for CampusFlow at DJSCE! 🎓\n\nI know your complete timetable, professors, room numbers, deadlines, and schedule swaps. You can ask me specific questions like:\n• *\"Which lecture is there on Tuesday from 8 am to 10 am?\"*\n• *\"Who teaches Machine Learning?\"*\n• *\"Where is room CR 42?\"*\n• *\"What assignments are due this week?\"*";
  }

  if (
    q === "thanks" ||
    q === "thank you" ||
    q.includes("thank you so much") ||
    q.includes("thanks a lot")
  ) {
    return "You're very welcome, Krupa! 🌟 Always here to help you stay ahead in college. Let me know whenever you need anything else.";
  }

  if (
    q === "hi" ||
    q === "hello" ||
    q === "hey" ||
    q === "yo" ||
    q === "sup" ||
    q.startsWith("hello ") ||
    q.startsWith("hey ") ||
    q.includes("good morning") ||
    q.includes("good afternoon") ||
    q.includes("good evening")
  ) {
    const todayClasses = getEffectiveClasses(timetable, overrides, now, daySwaps);
    const pendingCount = assignments.filter((a) => !a.completed).length;
    return `👋 Hey Krupa! I'm your CampusFlow AI Copilot. 

Right now you have:
• **${todayClasses.length}** class${todayClasses.length === 1 ? "" : "es"} scheduled for today
• **${pendingCount}** pending assignment${pendingCount === 1 ? "" : "s"}

Ask me anything about your timetable, room numbers, professors, assignments, day swaps, or study planning!`;
  }

  // -------------------------------------------------------------
  // 2. CURRENT & NEXT CLASS ("Where do I go?", "What's next?", "Current class")
  // -------------------------------------------------------------
  if (
    q.includes("current class") ||
    q.includes("right now") ||
    q.includes("what class do i have now") ||
    q.includes("class now") ||
    q.includes("next class") ||
    q.includes("what's next") ||
    q.includes("where do i go") ||
    q.includes("where is my next") ||
    q.includes("what is next")
  ) {
    const todayClasses = getEffectiveClasses(timetable, overrides, now, daySwaps);

    if (todayClasses.length === 0) {
      const nextDay = getNextDayFirstClass(timetable, overrides, daySwaps, now);
      if (nextDay) {
        return `You don't have any classes today! Your next lecture is:
📍 **${nextDay.firstClass.subject} (${nextDay.firstClass.code})**
⏰ **${nextDay.isTomorrow ? "Tomorrow" : nextDay.dayName} at ${nextDay.firstClass.startTime}**
🏛️ **Room ${nextDay.firstClass.room}** · ${nextDay.firstClass.faculty}`;
      }
      return "You don't have any classes scheduled for today or upcoming days.";
    }

    const currentOngoing = todayClasses.find(
      (c) => currentTime >= c.startTime && currentTime < c.endTime
    );

    const upcomingNext = todayClasses.find((c) => c.startTime > currentTime);

    if (currentOngoing) {
      let resp = `🏫 **Current Class In Session:**
• **${currentOngoing.subject} (${currentOngoing.code})**
• **Time:** ${currentOngoing.startTime} – ${currentOngoing.endTime}
• **Room:** ${currentOngoing.room}
• **Faculty:** ${currentOngoing.faculty} (${currentOngoing.type})`;

      if (upcomingNext) {
        const mins = getMinutesUntil(upcomingNext.startTime, now);
        resp += `\n\n⏭️ **Next Up:** ${upcomingNext.subject} (${upcomingNext.code}) in room **${upcomingNext.room}** at **${upcomingNext.startTime}** (${mins > 0 ? `in ${mins} mins` : "soon"}).`;
      } else {
        resp += `\n\n🎉 This is your last class for today! You're free afterwards.`;
      }
      return resp;
    }

    if (upcomingNext) {
      const mins = getMinutesUntil(upcomingNext.startTime, now);
      return `⏭️ **Your Next Class Today:**
• **Subject:** ${upcomingNext.subject} (${upcomingNext.code})
• **Starts at:** ${upcomingNext.startTime} (${mins > 0 ? `in ~${mins} minutes` : "starting soon"})
• **Room:** ${upcomingNext.room}
• **Faculty:** ${upcomingNext.faculty} (${upcomingNext.type})`;
    }

    // Classes for today ended
    const nextDay = getNextDayFirstClass(timetable, overrides, daySwaps, now);
    let resp = `🎉 **All your classes for today have ended!**`;
    if (nextDay) {
      resp += `\n\n📅 **Next Class:** ${nextDay.firstClass.subject} (${nextDay.firstClass.code})
⏰ **${nextDay.isTomorrow ? "Tomorrow" : nextDay.dayName} at ${nextDay.firstClass.startTime}** in **Room ${nextDay.firstClass.room}**.`;
    }
    return resp;
  }

  // -------------------------------------------------------------
  // 3. TODAY'S SCHEDULE
  // -------------------------------------------------------------
  if (
    q === "today" ||
    q.includes("today's schedule") ||
    q.includes("schedule today") ||
    q.includes("classes today") ||
    q.includes("what do i have today") ||
    q.includes("what's today") ||
    q.includes("schedule for today")
  ) {
    const todayName = getDayName(now);
    const todayKey = formatDateKey(now);
    const todaySwap = daySwaps.find((s) => s.date === todayKey);
    const todayClasses = getEffectiveClasses(timetable, overrides, now, daySwaps);

    let header = `📅 **Today's Schedule (${todayName}, ${formatDateKey(now)}):**`;
    if (todaySwap) {
      header += `\n🔄 *(Day Swap Active: Following ${todaySwap.sourceDay}'s Timetable)*`;
    }

    if (todayClasses.length === 0) {
      const nextDay = getNextDayFirstClass(timetable, overrides, daySwaps, now);
      let msg = `${header}\n\nNo classes scheduled for today! Enjoy your free day.`;
      if (nextDay) {
        msg += `\n\nNext lecture is **${nextDay.firstClass.subject}** on **${nextDay.isTomorrow ? "Tomorrow" : nextDay.dayName} at ${nextDay.firstClass.startTime} (${nextDay.firstClass.room})**.`;
      }
      return msg;
    }

    const items = todayClasses.map(
      (c, i) =>
        `${i + 1}. **${c.startTime} – ${c.endTime}** : ${c.subject} (${c.code})\n   🏛️ Room ${c.room} · 👨‍🏫 ${c.faculty} · 🏷️ ${c.type}`
    );

    return `${header}\n\n${items.join("\n\n")}\n\n✨ Total: **${todayClasses.length}** class${todayClasses.length === 1 ? "" : "es"}. First class starts at **${todayClasses[0].startTime}**, and day finishes at **${todayClasses[todayClasses.length - 1].endTime}**.`;
  }

  // -------------------------------------------------------------
  // 4. TOMORROW'S SCHEDULE
  // -------------------------------------------------------------
  if (
    q.includes("tomorrow") &&
    !q.includes("assignment") &&
    !q.includes("due") &&
    !q.includes("task")
  ) {
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowDay = getDayName(tomorrow);
    const tomorrowKey = formatDateKey(tomorrow);
    const tomorrowSwap = daySwaps.find((s) => s.date === tomorrowKey);
    const tomorrowClasses = getEffectiveClasses(timetable, overrides, tomorrow, daySwaps);

    let header = `📅 **Tomorrow's Schedule (${tomorrowDay}, ${tomorrowKey}):**`;
    if (tomorrowSwap) {
      header += `\n🔄 *(Day Swap Active: Following ${tomorrowSwap.sourceDay}'s Timetable)*`;
    }

    if (tomorrowClasses.length === 0) {
      return `${header}\n\nNo classes scheduled for tomorrow! Clear calendar.`;
    }

    const items = tomorrowClasses.map(
      (c, i) =>
        `${i + 1}. **${c.startTime} – ${c.endTime}** : ${c.subject} (${c.code})\n   🏛️ Room ${c.room} · 👨‍🏫 ${c.faculty} · 🏷️ ${c.type}`
    );

    return `${header}\n\n${items.join("\n\n")}\n\nTotal: **${tomorrowClasses.length}** classes. Starts at **${tomorrowClasses[0].startTime}** in **Room ${tomorrowClasses[0].room}**.`;
  }

  // -------------------------------------------------------------
  // 5. SPECIFIC DAY OF THE WEEK (Monday, Tuesday, Wednesday...)
  // -------------------------------------------------------------
  for (const day of ALL_DAYS) {
    if (q.includes(day.toLowerCase())) {
      const dayClasses = timetable
        .filter((c) => c.day === day)
        .sort((a, b) => a.startTime.localeCompare(b.startTime));

      if (dayClasses.length === 0) {
        return `You don't have any regular classes scheduled on **${day}**.`;
      }

      // Check if user asked for a specific TIME or TIME RANGE!
      const timeRange = parseTimeRange(q);

      if (timeRange) {
        const overlapping = dayClasses.filter((c) => {
          const [sh, sm] = c.startTime.split(":").map(Number);
          const [eh, em] = c.endTime.split(":").map(Number);
          const classStartMins = sh * 60 + sm;
          const classEndMins = eh * 60 + em;

          return classStartMins < timeRange.endMins && classEndMins > timeRange.startMins;
        });

        if (overlapping.length === 0) {
          return `You have **no classes** scheduled on **${day}** between **${timeRange.label}**! 🎉 You are completely free during this time.`;
        }

        const items = overlapping.map((c) => {
          const codeStr = c.code || (c as any).subjectCode ? ` (${c.code || (c as any).subjectCode})` : "";
          return `• **${c.startTime} – ${c.endTime}** : **${c.subject}**${codeStr}\n  🏛️ Room: **${c.room}** · 👨‍🏫 **${c.faculty}** · 🏷️ ${c.type}`;
        });

        let note = "";
        const [firstStartH, firstStartM] = overlapping[0].startTime.split(":").map(Number);
        const firstMins = firstStartH * 60 + firstStartM;
        if (firstMins > timeRange.startMins) {
          const freeStartH = String(Math.floor(timeRange.startMins / 60)).padStart(2, "0");
          const freeStartM = String(timeRange.startMins % 60).padStart(2, "0");
          note = `\n\n*(Note: You are free before this from ${freeStartH}:${freeStartM} to ${overlapping[0].startTime})*`;
        }

        return `On **${day}** between **${timeRange.label}**, you have:\n\n${items.join("\n\n")}${note}`;
      }

      const items = dayClasses.map((c, i) => {
        const codeStr = c.code || (c as any).subjectCode ? ` (${c.code || (c as any).subjectCode})` : "";
        return `${i + 1}. **${c.startTime} – ${c.endTime}** : **${c.subject}**${codeStr}\n   🏛️ Room: ${c.room} · 👨‍🏫 ${c.faculty} · 🏷️ ${c.type}`;
      });

      return `📅 **${day.toUpperCase()} SCHEDULE (${dayClasses.length} classes):**\n\n${items.join(
        "\n\n"
      )}\n\n• First class: **${dayClasses[0].startTime}** (${dayClasses[0].subject})\n• Last class ends: **${dayClasses[dayClasses.length - 1].endTime}**`;
    }
  }

  // -------------------------------------------------------------
  // 5b. TIME RANGE QUERY WITHOUT EXPLICIT DAY (Follow-up or today)
  // E.g. "dont have anything from 8 to 9?", "free between 11 and 12?"
  // -------------------------------------------------------------
  const genericTimeRange = parseTimeRange(q);
  if (genericTimeRange) {
    const targetDay = (context.lastMentionedDay as DayOfWeek) || (getDayName(now) as DayOfWeek);
    const dayClasses = timetable
      .filter((c) => c.day === targetDay)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));

    const overlapping = dayClasses.filter((c) => {
      const [sh, sm] = c.startTime.split(":").map(Number);
      const [eh, em] = c.endTime.split(":").map(Number);
      const classStartMins = sh * 60 + sm;
      const classEndMins = eh * 60 + em;
      return classStartMins < genericTimeRange.endMins && classEndMins > genericTimeRange.startMins;
    });

    if (overlapping.length === 0) {
      const nextClass = dayClasses.find((c) => {
        const [sh, sm] = c.startTime.split(":").map(Number);
        return sh * 60 + sm >= genericTimeRange.endMins;
      });

      let nextClassMsg = "";
      if (nextClass) {
        const codeStr = nextClass.code || (nextClass as any).subjectCode ? ` (${nextClass.code || (nextClass as any).subjectCode})` : "";
        nextClassMsg = ` Your next lecture starts at **${nextClass.startTime}** with **${nextClass.subject}**${codeStr} in **Room ${nextClass.room}**.`;
      }

      return `No, you don't have anything scheduled on **${targetDay}** between **${genericTimeRange.label}**! 🎉 You are completely free during this time.${nextClassMsg}`;
    }

    const items = overlapping.map((c) => {
      const codeStr = c.code || (c as any).subjectCode ? ` (${c.code || (c as any).subjectCode})` : "";
      return `• **${c.startTime} – ${c.endTime}** : **${c.subject}**${codeStr}\n  🏛️ Room: **${c.room}** · 👨‍🏫 **${c.faculty}** · 🏷️ ${c.type}`;
    });

    return `On **${targetDay}** between **${genericTimeRange.label}**, you have:\n\n${items.join("\n\n")}`;
  }

  // -------------------------------------------------------------
  // 6. PROFESSOR / FACULTY LOOKUP ("Who teaches...", "Faculty for...")
  // -------------------------------------------------------------
  if (
    q.includes("who teaches") ||
    q.includes("faculty") ||
    q.includes("professor") ||
    q.includes("teacher") ||
    q.includes("instructor")
  ) {
    // Find subject mentioned
    const matchedClass = timetable.find((c) => {
      const subLower = c.subject.toLowerCase();
      const codeLower = c.code.toLowerCase();
      return (
        q.includes(subLower) ||
        q.includes(codeLower) ||
        subLower.split(" ").some((word) => word.length > 3 && q.includes(word))
      );
    });

    if (matchedClass) {
      const sessions = timetable.filter(
        (c) => c.code.toLowerCase() === matchedClass.code.toLowerCase()
      );
      const daysStr = Array.from(new Set(sessions.map((s) => s.day))).join(", ");

      return `👨‍🏫 **Faculty for ${matchedClass.subject} (${matchedClass.code}):**
• **Instructor:** **${matchedClass.faculty}**
• **Type:** ${matchedClass.type}
• **Room:** ${matchedClass.room}
• **Days:** ${daysStr}`;
    }

    // List all faculty
    const facultyMap: Record<string, string[]> = {};
    timetable.forEach((c) => {
      if (!facultyMap[c.faculty]) facultyMap[c.faculty] = [];
      const label = `${c.subject} (${c.code})`;
      if (!facultyMap[c.faculty].includes(label)) {
        facultyMap[c.faculty].push(label);
      }
    });

    const entries = Object.entries(facultyMap).map(
      ([fac, subs]) => `• **${fac}** → ${subs.join(", ")}`
    );

    return `Here are the faculty members mapped in your timetable:\n\n${entries.join("\n")}`;
  }

  // -------------------------------------------------------------
  // 7. ROOM / LOCATION LOOKUP ("Where is...", "Room 401", "Where does...")
  // -------------------------------------------------------------
  if (
    q.includes("where is") ||
    q.includes("which room") ||
    q.includes("room number") ||
    q.includes("classroom") ||
    q.includes("lab room") ||
    q.includes("room")
  ) {
    // Match specific subject
    const matchedClass = timetable.find((c) => {
      const subLower = c.subject.toLowerCase();
      const codeLower = c.code.toLowerCase();
      return (
        q.includes(subLower) ||
        q.includes(codeLower) ||
        subLower.split(" ").some((word) => word.length > 3 && q.includes(word))
      );
    });

    if (matchedClass) {
      return `🏛️ **${matchedClass.subject} (${matchedClass.code})** is conducted in:
📍 **Room ${matchedClass.room}**
⏰ Time: ${matchedClass.startTime} – ${matchedClass.endTime} (${matchedClass.day})
👨‍🏫 Faculty: ${matchedClass.faculty}`;
    }

    // Match specific room number
    const roomMatch = q.match(/\b\d{3,4}\b/);
    if (roomMatch) {
      const targetRoom = roomMatch[0];
      const classesInRoom = timetable.filter((c) => c.room.includes(targetRoom));
      if (classesInRoom.length > 0) {
        const list = classesInRoom.map(
          (c) => `• **${c.day} ${c.startTime}–${c.endTime}**: ${c.subject} (${c.faculty})`
        );
        return `Classes held in **Room ${targetRoom}**:\n\n${list.join("\n")}`;
      }
    }
  }

  // -------------------------------------------------------------
  // 8. LABS & PRACTICAL SESSIONS
  // -------------------------------------------------------------
  if (
    q.includes("lab") ||
    q.includes("labs") ||
    q.includes("practical") ||
    q.includes("practicals")
  ) {
    const labClasses = timetable
      .filter((c) => c.type === "Lab")
      .sort((a, b) => a.day.localeCompare(b.day) || a.startTime.localeCompare(b.startTime));

    if (labClasses.length === 0) {
      return "You don't have any practical lab sessions scheduled in your timetable.";
    }

    const items = labClasses.map(
      (c) =>
        `• **${c.day} ${c.startTime}–${c.endTime}**: **${c.subject}** (${c.code}) in **Room ${c.room}** (${c.faculty})`
    );

    return `🧪 **Your Lab / Practical Sessions (${labClasses.length} sessions):**\n\n${items.join(
      "\n"
    )}`;
  }

  // -------------------------------------------------------------
  // 9. DAY SWAPS & SCHEDULE OVERRIDES
  // -------------------------------------------------------------
  if (
    q.includes("swap") ||
    q.includes("swapped") ||
    q.includes("override") ||
    q.includes("schedule change") ||
    q.includes("changes") ||
    q.includes("cancel")
  ) {
    const responses: string[] = [];

    if (daySwaps.length > 0) {
      const swapList = daySwaps.map(
        (s) =>
          `• **Date ${s.date}**: Swapped to follow **${s.sourceDay.toUpperCase()}** timetable${s.note ? ` (${s.note})` : ""}`
      );
      responses.push(`🔄 **Active Day Swaps:**\n${swapList.join("\n")}`);
    }

    if (overrides.length > 0) {
      const overrideList = overrides.map(
        (o) =>
          `• **${o.date}**: ${o.subject} (${o.startTime}–${o.endTime}) → **${o.action.toUpperCase()}**`
      );
      responses.push(`⚠️ **Schedule Overrides:**\n${overrideList.join("\n")}`);
    }

    if (responses.length > 0) {
      return responses.join("\n\n");
    }

    return "✅ There are no schedule overrides or day swaps active right now. You are following your regular standard timetable.";
  }

  // -------------------------------------------------------------
  // 10. ASSIGNMENTS & HOMEWORK (Deep Search, Teams, Due Dates)
  // -------------------------------------------------------------
  if (
    q.includes("assignment") ||
    q.includes("assignments") ||
    q.includes("homework") ||
    q.includes("due") ||
    q.includes("deadline") ||
    q.includes("submission") ||
    q.includes("teams assignment")
  ) {
    const pending = assignments.filter((a) => !a.completed);
    const completed = assignments.filter((a) => a.completed);

    if (q.includes("teams")) {
      const teamsItems = assignments.filter((a) => a.source === "teams");
      if (teamsItems.length === 0) {
        return "You haven't synced any assignments from Microsoft Teams yet. Click the **'SYNC WITH TEAMS'** button on the Assignments page to import them!";
      }
      const list = teamsItems.map(
        (a) =>
          `• **${a.title}** (${a.subject})\n  Due: **${a.dueDate}** · Status: ${a.status} · Priority: ${a.priority}`
      );
      return `📌 **Assignments Synced from Microsoft Teams (${teamsItems.length}):**\n\n${list.join(
        "\n\n"
      )}`;
    }

    if (q.includes("completed") || q.includes("done")) {
      if (completed.length === 0) {
        return "You haven't marked any assignments as completed yet.";
      }
      const list = completed.map((a) => `• ~~${a.title}~~ (${a.subject})`);
      return `✅ **Completed Assignments (${completed.length}):**\n\n${list.join("\n")}`;
    }

    if (q.includes("high") || q.includes("urgent")) {
      const high = pending.filter((a) => a.priority === "High");
      if (high.length === 0) {
        return "🎉 Great news! You don't have any High-priority assignments due right now.";
      }
      const list = high.map(
        (a) =>
          `🚨 **${a.title}**\n   Subject: ${a.subject} · Due: **${a.dueDate}**`
      );
      return `⚠️ **High Priority / Urgent Assignments (${high.length}):**\n\n${list.join(
        "\n\n"
      )}`;
    }

    if (pending.length === 0) {
      return "🎉 You have no pending assignments! You're completely caught up.";
    }

    const sorted = [...pending].sort(
      (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    );

    const items = sorted.map(
      (a, i) =>
        `${i + 1}. **${a.title}**\n   📚 ${a.subject} · ⏰ Due: **${a.dueDate}** · 🏷️ Priority: **${a.priority}**${a.source === "teams" ? " · 🟣 MS Teams" : ""}`
    );

    return `📝 **Your Pending Assignments (${pending.length}):**\n\n${items.join(
      "\n\n"
    )}\n\n💡 Tip: Complete high-priority items first to stay ahead of upcoming college deadlines.`;
  }

  // -------------------------------------------------------------
  // 11. TASKS & TO-DO LIST
  // -------------------------------------------------------------
  if (
    q.includes("task") ||
    q.includes("tasks") ||
    q.includes("todo") ||
    q.includes("to-do")
  ) {
    const pendingTasks = tasks.filter((t) => !t.completed);

    if (pendingTasks.length === 0) {
      return "✅ You don't have any pending tasks right now. Your to-do list is clear!";
    }

    const list = pendingTasks.map(
      (t, i) =>
        `${i + 1}. **${t.title}** — Priority: **${t.priority}** (${t.status ?? "Pending"})${t.dueDate ? ` · Due: ${t.dueDate}` : ""}`
    );

    return `📋 **Active Tasks (${pendingTasks.length}):**\n\n${list.join("\n")}`;
  }

  // -------------------------------------------------------------
  // 12. HEAVIEST / BUSIEST VS LIGHTEST DAYS
  // -------------------------------------------------------------
  if (
    q.includes("busiest") ||
    q.includes("heaviest") ||
    q.includes("most classes") ||
    q.includes("lightest") ||
    q.includes("least classes")
  ) {
    const counts: Record<DayOfWeek, number> = {
      Monday: 0,
      Tuesday: 0,
      Wednesday: 0,
      Thursday: 0,
      Friday: 0,
      Saturday: 0,
    };

    timetable.forEach((c) => {
      if (counts[c.day] !== undefined) counts[c.day]++;
    });

    const sortedDays = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    const busiest = sortedDays[0];
    const lightest = sortedDays.filter((d) => d[1] > 0).slice(-1)[0] || sortedDays[sortedDays.length - 1];

    return `📊 **Weekly Class Breakdown:**
• **Busiest Day:** **${busiest[0]}** with **${busiest[1]} classes**.
• **Lightest Day:** **${lightest[0]}** with **${lightest[1]} class${lightest[1] === 1 ? "" : "es"}**.

**Full Week Counts:**
${sortedDays.map(([d, c]) => `• ${d}: ${c} classes`).join("\n")}`;
  }

  // -------------------------------------------------------------
  // 13. STUDY PLAN & ADVISING ("What should I do?", "Plan my day")
  // -------------------------------------------------------------
  if (
    q.includes("what should i do") ||
    q.includes("study plan") ||
    q.includes("plan my") ||
    q.includes("what next") ||
    q.includes("recommend") ||
    q.includes("priority")
  ) {
    const highAssn = assignments.filter((a) => !a.completed && a.priority === "High");
    const otherAssn = assignments.filter((a) => !a.completed && a.priority !== "High");
    const highTasks = tasks.filter((t) => !t.completed && t.priority === "High");

    const plan: string[] = [];

    if (highAssn.length > 0) {
      plan.push(`🎯 **1. Immediate Focus (High Priority Deadlines):**\n` +
        highAssn.map((a) => `   • **${a.title}** (${a.subject}) — Due: ${a.dueDate}`).join("\n"));
    }

    if (highTasks.length > 0) {
      plan.push(`⚡ **2. Critical Tasks:**\n` +
        highTasks.map((t) => `   • **${t.title}**`).join("\n"));
    }

    if (otherAssn.length > 0) {
      plan.push(`📖 **3. Next in Queue:**\n` +
        otherAssn.slice(0, 3).map((a) => `   • ${a.title} (${a.dueDate})`).join("\n"));
    }

    if (plan.length === 0) {
      return "✨ All caught up! You have no high-priority deadlines or tasks pending. Consider reviewing upcoming lectures or resting.";
    }

    return `🧠 **Here is your Recommended Smart Study Plan:**\n\n${plan.join("\n\n")}`;
  }

  // -------------------------------------------------------------
  // 14. LIST OF ALL SUBJECTS
  // -------------------------------------------------------------
  if (
    q.includes("all subjects") ||
    q.includes("list subjects") ||
    q.includes("my courses") ||
    q.includes("what subjects")
  ) {
    const subjectMap: Record<string, { code: string; faculty: string; count: number }> = {};
    timetable.forEach((c) => {
      if (!subjectMap[c.subject]) {
        subjectMap[c.subject] = { code: c.code, faculty: c.faculty, count: 0 };
      }
      subjectMap[c.subject].count++;
    });

    const entries = Object.entries(subjectMap).map(
      ([sub, info]) => `• **${sub}** (${info.code}) — Faculty: ${info.faculty} (${info.count} sessions/week)`
    );

    return `📚 **Your Enrolled Courses (${entries.length}):**\n\n${entries.join("\n")}`;
  }

  // -------------------------------------------------------------
  // 15. COMPREHENSIVE INTELLIGENT FALLBACK
  // -------------------------------------------------------------
  // If the query didn't match a fixed pattern, search across ALL entities (Timetable, Assignments, Tasks)
  const matchingClasses = timetable.filter(
    (c) =>
      c.subject.toLowerCase().includes(q) ||
      c.code.toLowerCase().includes(q) ||
      c.faculty.toLowerCase().includes(q) ||
      c.room.toLowerCase().includes(q)
  );

  const matchingAssignments = assignments.filter(
    (a) =>
      a.title.toLowerCase().includes(q) ||
      a.subject.toLowerCase().includes(q) ||
      a.code.toLowerCase().includes(q)
  );

  const matchingTasks = tasks.filter((t) => t.title.toLowerCase().includes(q));

  if (
    matchingClasses.length > 0 ||
    matchingAssignments.length > 0 ||
    matchingTasks.length > 0
  ) {
    const findings: string[] = [];

    if (matchingClasses.length > 0) {
      findings.push(
        `🏛️ **Classes Matching "${question}":**\n` +
          matchingClasses
            .map((c) => `• ${c.day} ${c.startTime}–${c.endTime}: ${c.subject} (${c.code}) in ${c.room} (${c.faculty})`)
            .join("\n")
      );
    }

    if (matchingAssignments.length > 0) {
      findings.push(
        `📝 **Assignments Matching "${question}":**\n` +
          matchingAssignments
            .map((a) => `• ${a.title} (${a.subject}) — Due: ${a.dueDate} [${a.status}]`)
            .join("\n")
      );
    }

    if (matchingTasks.length > 0) {
      findings.push(
        `📋 **Tasks Matching "${question}":**\n` +
          matchingTasks.map((t) => `• ${t.title} [${t.priority} priority]`).join("\n")
      );
    }

    return findings.join("\n\n");
  }

  return `I searched your timetable, assignments, and schedule for **"${question}"**, but couldn't find a direct match.

Here are some things you can ask me:
• *"What do I have today?"* or *"What do I have tomorrow?"*
• *"What's my next class and room number?"*
• *"What's my schedule on Monday?"*
• *"Who teaches Machine Learning?"*
• *"When are my practical labs?"*
• *"What assignments are due soon?"*
• *"Show high-priority assignments"*
• *"Are any day swaps active?"*
• *"Create a study plan for me"*`;
}