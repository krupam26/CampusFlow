import type {
  Assignment,
  ClassItem,
  ScheduleOverride,
  Task,
} from "@/types/campusflow";

type CampusAIContext = {
  timetable: ClassItem[];
  assignments: Assignment[];
  tasks: Task[];
  overrides: ScheduleOverride[];
};

function formatDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getDayName(date: Date) {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
  });
}

function formatDate(date: Date) {
  return date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
  });
}

function getTomorrowData(context: CampusAIContext) {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const day = getDayName(tomorrow);
  const date = formatDateKey(tomorrow);

  const classes = context.timetable
    .filter((item) => item.day === day)
    .sort((a, b) =>
      a.startTime.localeCompare(b.startTime)
    );

  const changes = context.overrides.filter(
    (override) => override.date === date
  );

  return {
    tomorrow,
    day,
    date,
    classes,
    changes,
  };
}

export function getCampusAIResponse(
  question: string,
  context: CampusAIContext
): string {
  const q = question.toLowerCase().trim();

  const {
    tomorrow,
    classes,
    changes,
  } = getTomorrowData(context);

  // ---------------------------------------------
  // TOMORROW
  // ---------------------------------------------

  if (
    q.includes("tomorrow") &&
    (q.includes("have") ||
      q.includes("class") ||
      q.includes("schedule") ||
      q.includes("today"))
  ) {
    if (classes.length === 0) {
      return `You have no regular classes tomorrow (${formatDate(
        tomorrow
      )}).`;
    }

    const classList = classes
      .map(
        (item) =>
          `• ${item.startTime}–${item.endTime} — ${item.subject} (${item.code}) · ${item.room}`
      )
      .join("\n");

    return `Here’s your schedule for tomorrow (${formatDate(
      tomorrow
    )}):\n\n${classList}`;
  }

  // ---------------------------------------------
  // SCHEDULE CHANGES
  // ---------------------------------------------

  if (
    q.includes("change") ||
    q.includes("changed") ||
    q.includes("override") ||
    q.includes("cancel")
  ) {
    if (changes.length === 0) {
      return "There are no recorded schedule changes for tomorrow.";
    }

    const changeList = changes
      .map(
        (item) =>
          `• ${item.action.toUpperCase()} — ${item.subject} (${item.startTime}–${item.endTime})`
      )
      .join("\n");

    return `I found these schedule changes for tomorrow:\n\n${changeList}`;
  }

  // ---------------------------------------------
  // ASSIGNMENTS
  // ---------------------------------------------

  if (
    q.includes("assignment") ||
    q.includes("assignments") ||
    q.includes("due")
  ) {
    const pending = context.assignments
      .filter((assignment) => !assignment.completed)
      .sort(
        (a, b) =>
          new Date(a.dueDate).getTime() -
          new Date(b.dueDate).getTime()
      )
      .slice(0, 6);

    if (pending.length === 0) {
      return "You don't have any pending assignments.";
    }

    const list = pending
      .map(
        (assignment) =>
          `• ${assignment.title} — ${assignment.subject} · due ${assignment.dueDate} · ${assignment.priority} priority`
      )
      .join("\n");

    return `Here are your pending assignments:\n\n${list}`;
  }

  // ---------------------------------------------
  // TASKS
  // ---------------------------------------------

  if (
    q.includes("task") ||
    q.includes("tasks") ||
    q.includes("todo") ||
    q.includes("to-do")
  ) {
    const pending = context.tasks
      .filter((task) => !task.completed)
      .sort((a, b) => {
        const priorityOrder = {
          High: 0,
          Medium: 1,
          Low: 2,
        };

        return (
          priorityOrder[a.priority] -
          priorityOrder[b.priority]
        );
      })
      .slice(0, 6);

    if (pending.length === 0) {
      return "You don't have any pending tasks.";
    }

    const list = pending
      .map(
        (task) =>
          `• ${task.title} — ${task.priority} priority · ${
            task.status ?? "Pending"
          }`
      )
      .join("\n");

    return `Here are the tasks currently needing attention:\n\n${list}`;
  }

  // ---------------------------------------------
  // WHAT SHOULD I DO?
  // ---------------------------------------------

  if (
    q.includes("what should") ||
    q.includes("work on") ||
    q.includes("next") ||
    q.includes("finish")
  ) {
    const highAssignments = context.assignments.filter(
      (assignment) =>
        !assignment.completed &&
        assignment.priority === "High"
    );

    const highTasks = context.tasks.filter(
      (task) =>
        !task.completed &&
        task.priority === "High"
    );

    if (
      highAssignments.length === 0 &&
      highTasks.length === 0
    ) {
      return "You don't have any high-priority items right now. Check your upcoming assignments and tasks to decide what to tackle next.";
    }

    const recommendations: string[] = [];

    highAssignments.slice(0, 3).forEach((assignment) => {
      recommendations.push(
        `• Assignment: ${assignment.title} — due ${assignment.dueDate}`
      );
    });

    highTasks.slice(0, 3).forEach((task) => {
      recommendations.push(
        `• Task: ${task.title} — ${task.status ?? "Pending"}`
      );
    });

    return `I'd start with these high-priority items:\n\n${recommendations.join(
      "\n"
    )}`;
  }

  // ---------------------------------------------
  // OVERVIEW
  // ---------------------------------------------

  if (
    q.includes("overview") ||
    q.includes("summary") ||
    q.includes("briefing") ||
    q.includes("status")
  ) {
    const pendingAssignments =
      context.assignments.filter(
        (assignment) => !assignment.completed
      ).length;

    const pendingTasks = context.tasks.filter(
      (task) => !task.completed
    ).length;

    return `Here's your current CampusFlow summary:\n\n• ${classes.length} class${
      classes.length === 1 ? "" : "es"
    } tomorrow\n• ${pendingAssignments} pending assignment${
      pendingAssignments === 1 ? "" : "s"
    }\n• ${pendingTasks} pending task${
      pendingTasks === 1 ? "" : "s"
    }\n• ${
      changes.length
    } schedule change${
      changes.length === 1 ? "" : "s"
    } tomorrow`;
  }

  // ---------------------------------------------
  // HELP
  // ---------------------------------------------

  if (
    q.includes("help") ||
    q.includes("what can you") ||
    q.includes("what can i ask")
  ) {
    return `You can ask me things like:\n\n• What do I have tomorrow?\n• Did anything change tomorrow?\n• What assignments are due?\n• What tasks do I have?\n• What should I work on next?\n• Give me a summary\n\nI'll answer using the academic data currently stored in CampusFlow.`;
  }

  // ---------------------------------------------
  // FALLBACK
  // ---------------------------------------------

  return `I can help you with your CampusFlow schedule, assignments, tasks, and schedule changes.\n\nTry asking:\n\n• "What do I have tomorrow?"\n• "What's due?"\n• "What tasks do I have?"\n• "Did anything change tomorrow?"\n• "What should I work on next?"`;
}