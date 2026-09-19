# CAMPUSFLOW

### Contextual Academic Command Center

CampusFlow is a modern academic productivity dashboard designed to bring a student's **timetable, assignments, tasks, schedule changes, notifications, and AI assistance** into one unified workspace.

Instead of simply answering:

> "What class do I have?"

CampusFlow aims to answer:

> "What do I need to know and do based on my classes, deadlines, tasks, and schedule changes?"

---

## 🚀 Features

### 📊 Command Center Dashboard

The dashboard provides a contextual overview of the student's academic workload.

- Tomorrow View
- Upcoming classes
- Upcoming assignment deadlines
- Priority tasks
- Schedule changes
- Quick navigation actions
- Contextual academic briefing

---

### 📅 Timetable Management

CampusFlow provides a complete timetable management interface.

- Add classes
- Edit classes
- Delete classes
- Select specific dates
- View classes by day
- Class type support
- Faculty and room information
- Start and end times

Example class information:

```
Subject: Full Stack Development
Code: FST
Faculty: Prof. Mehta
Room: Lab 204
Time: 09:00 - 11:00
Type: Lab
```

---

### 🔄 Schedule Overrides

Temporary timetable changes can be managed without modifying the regular timetable.

Supported actions:

- Modified class
- Added class
- Cancelled class

Each override can contain:

- Date
- Subject
- Subject code
- Faculty
- Room
- Start time
- End time
- Class type

This allows CampusFlow to preserve the normal timetable while applying date-specific changes.

---

### 📝 Assignment Management

Students can manage academic assignments from a dedicated interface.

Each assignment supports:

- Title
- Subject
- Subject code
- Due date
- Priority
- Status
- Description

Supported statuses:

```
Pending
In Progress
Completed
```

Supported priorities:

```
High
Medium
Low
```

---

### ✅ Task Management

CampusFlow also provides a personal task manager for non-assignment academic work.

Features include:

- Create tasks
- Edit tasks
- Delete tasks
- Mark tasks as completed
- Due dates
- Priority levels
- Task status
- Task descriptions

---

### 🔔 Notifications

The notification center automatically derives useful academic alerts from CampusFlow data.

Examples include:

- Assignments due tomorrow
- High-priority assignments
- Tasks due tomorrow
- Upcoming schedule changes

Notifications also provide direct navigation to the relevant section.

---

### 🤖 Campus AI

Campus AI is a contextual academic chatbot that uses the student's CampusFlow data to answer questions.

Example queries:

```
What do I have tomorrow?

Did anything change tomorrow?

What assignments are due this week?

What should I finish today?

What are my priority tasks?

Am I forgetting something?

What did I miss?
```

The AI uses information from:

- Timetable
- Assignments
- Tasks
- Schedule overrides

This creates a contextual academic assistant instead of a generic chatbot.

---

## 🎨 Design System

CampusFlow follows a custom **pixel-inspired academic dashboard aesthetic**.

### Typography

- Geist
- Geist Mono
- Pixelify Sans

### Visual Style

- Pixel borders
- Hard pixel shadows
- Minimal rounded corners
- Subtle grid backgrounds
- Pixel-style headings
- Responsive cards
- Light/Dark theme support

### Color Palette

The application uses a warm academic palette with coral, mint, cream, and dark blue-gray tones.

Light mode:

```
Background   #F4F0E6
Foreground   #17232B
Card         #FFFDF6
Primary      #E85D4A
Accent       #CDEEE2
```

Dark mode:

```
Background   #101A20
Foreground   #F8F2E5
Card         #17252D
Primary      #FF7561
Accent       #17483F
```

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| Next.js | Application framework |
| React | UI development |
| TypeScript | Type safety |
| Tailwind CSS | Styling |
| shadcn/ui | UI components |
| Radix UI | Accessible primitives |
| Zustand | Persistent client state |
| React Hook Form | Form management |
| Zod | Schema validation |
| Sonner | Toast notifications |
| Lucide React | Icons |
| Next Themes | Light/Dark mode |

---

## 🏗️ Architecture

CampusFlow uses the **Next.js App Router** and follows a Server Component-first approach.

```
                    CAMPUSFLOW
                        │
              ┌─────────┴─────────┐
              │                   │
          Next.js App         Client State
              │                   │
       ┌──────┴──────┐       Zustand Store
       │             │            │
   Server        Client          │
 Components    Components         │
       │             │            │
       │       ┌─────┴─────┐      │
       │       │           │      │
       │     Forms       AI UI    │
       │       │           │      │
       │   RHF + Zod       │      │
       │       │           │      │
       └───────┴───────────┴──────┘
                       │
                Server Actions
                       │
                  Validation
```

---

## 📁 Project Structure

```
campusflow/
│
├── src/
│   │
│   ├── app/
│   │   ├── actions/
│   │   │   ├── assignment-actions.ts
│   │   │   └── task-actions.ts
│   │   │
│   │   ├── ai/
│   │   │   └── page.tsx
│   │   │
│   │   ├── assignments/
│   │   │   ├── loading.tsx
│   │   │   └── page.tsx
│   │   │
│   │   ├── notifications/
│   │   │   └── page.tsx
│   │   │
│   │   ├── tasks/
│   │   │   ├── loading.tsx
│   │   │   └── page.tsx
│   │   │
│   │   ├── timetable/
│   │   │   └── page.tsx
│   │   │
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   │
│   ├── components/
│   │   ├── assignments/
│   │   ├── tasks/
│   │   ├── timetable/
│   │   ├── dashboard/
│   │   ├── ai/
│   │   └── ui/
│   │
│   ├── lib/
│   │   ├── campus-ai.ts
│   │   └── validations/
│   │       ├── assignment.ts
│   │       └── task.ts
│   │
│   ├── stores/
│   │   └── campusflow-store.ts
│   │
│   └── types/
│       └── campusflow.ts
│
├── public/
│
├── ARCHITECTURE.md
├── package.json
├── tsconfig.json
└── README.md
```

---

## ⚡ Getting Started

### 1. Clone the repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
```

Navigate into the project:

```bash
cd campusflow
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the development server

```bash
npm run dev
```

Open:

```
http://localhost:3000
```

---

## 🧪 Production Build

To create a production build:

```bash
npm run build
```

To start the production server:

```bash
npm start
```

If port `3000` is already occupied, another port can be used.

PowerShell:

```powershell
$env:PORT=3001
npm start
```

Then open:

```
http://localhost:3001
```

---

## 🧠 State Management

CampusFlow uses **Zustand** for centralized client-side state.

The persistent store manages:

```
Timetable
Schedule Overrides
Assignments
Tasks
Selected Day
```

The store uses Zustand's `persist` middleware:

```ts
persist(
  (set) => ({
    // ...state and actions
  }),
  {
    name: "campusflow-store",
  }
)
```

This allows the student's data to persist across page refreshes.

---

## 📝 Form Validation

CampusFlow uses:

```
React Hook Form
        +
Zod
```

The same Zod schemas are used for client-side and server-side validation.

Example:

```ts
export const assignmentSchema = z.object({
  title: z.string().trim().min(1),
  subject: z.string().trim().min(1),
  code: z.string().trim(),
  dueDate: z.string().min(1),
  priority: z.enum(["High", "Medium", "Low"]),
  status: z.enum([
    "Pending",
    "In Progress",
    "Completed",
  ]),
  description: z.string().trim(),
});
```

This provides consistent validation and type-safe form values.

---

## ⚙️ Server Actions

Next.js Server Actions are used for server-side validation.

Example:

```ts
"use server";

export async function saveAssignment(
  values: AssignmentFormValues
) {
  const result = assignmentSchema.safeParse(values);

  if (!result.success) {
    return {
      success: false,
      message: "Please fix the validation errors.",
      errors: result.error.flatten().fieldErrors,
    };
  }

  return {
    success: true,
    message: "Assignment validated successfully.",
    data: result.data,
  };
}
```

The current Assignment 1 implementation uses Server Actions primarily for validation.

Database persistence is planned for Assignment 2 using Prisma and PostgreSQL/MySQL.

---

## ⚡ Optimistic UI

CampusFlow applies an optimistic UI pattern for assignment and task mutations.

The interface updates immediately while the Server Action is processed.

Conceptually:

```
User submits form
       │
       ▼
Update UI immediately
       │
       ▼
Call Server Action
       │
   ┌───┴───┐
   │       │
Success   Error
   │       │
Keep     Rollback
update   changes
```

This improves perceived responsiveness and provides a better user experience.

---

## ⏳ Loading States

Next.js route-level loading states are implemented for major pages.

Examples:

```
/assignments/loading.tsx
/tasks/loading.tsx
```

These provide skeleton interfaces while content is loading.

The skeletons use lightweight CSS animation rather than introducing unnecessary dependencies.

---

## 🌓 Theme Support

CampusFlow supports:

- Light mode
- Dark mode
- System theme preference

Theme state is handled through `next-themes`.

The application avoids hydration issues by keeping theme-dependent UI inside appropriate client components.

---

## 📱 Responsive Design

The interface is designed to work across:

- Desktop
- Laptop
- Tablet
- Mobile

The sidebar, cards, forms, dashboard sections, and timetable layouts adapt using responsive Tailwind CSS utilities.

---

## 📊 Lighthouse Results

The application was tested using **Google Lighthouse**.

### Desktop Audit

| Category | Score |
|---|---:|
| Performance | **100** |
| Accessibility | **96** |
| Best Practices | **100** |
| SEO | **100** |

### Performance Metrics

| Metric | Result |
|---|---:|
| First Contentful Paint | **0.3 s** |
| Largest Contentful Paint | **0.7 s** |
| Total Blocking Time | **0 ms** |
| Cumulative Layout Shift | **0** |

The Lighthouse audit was performed using:

```
Lighthouse 13.4.1
Chromium 152
Desktop emulation
Custom throttling
```

---

## 🧩 Assignment 1 Requirements Covered

CampusFlow demonstrates the major concepts required for the FST Assignment 1.

### Part A — Next.js & UI

- Next.js App Router
- Tailwind CSS
- shadcn/ui
- Radix primitives
- Theme switching
- Server/Client Component separation
- Responsive UI

### Part B — State Management

- Centralized Zustand store
- Persistent state
- Timetable state
- Assignment state
- Task state
- Schedule override state
- Reduced unnecessary prop drilling

### Part C — Forms & Mutations

- React Hook Form
- Zod
- Shared validation schemas
- Next.js Server Actions
- Validation responses
- Optimistic UI
- Toast notifications
- Loading skeletons

---

## 🔮 Future Scope

CampusFlow is designed to evolve into a complete academic productivity platform.

### Database & Authentication

Planned:

- Prisma ORM
- PostgreSQL/MySQL
- User authentication
- Role-based access control
- Audit logs

### Microsoft Teams Integration

A future authorized Microsoft Graph integration can provide:

- Teams assignments
- Course information
- Announcements
- Due dates

The integration will use authorized Microsoft APIs rather than scraping Teams.

### Timetable Import

Future timetable onboarding can support:

```
PDF / Image
     ↓
Preview
     ↓
OCR Extraction
     ↓
Manual Correction
     ↓
Save Timetable
```

### Email & Webhooks

Future versions can integrate:

- React Email
- Resend
- Assignment reminders
- Notification emails
- Delivery tracking
- Bounce handling

### Advanced AI

Future Campus AI capabilities could include:

- Personalized study planning
- Deadline risk detection
- Workload analysis
- Schedule conflict detection
- Study recommendations
- Automated morning briefings

---

## 🎯 Core Product Idea

CampusFlow connects information that normally exists in separate applications.

```
             ┌───────────────┐
             │   TIMETABLE   │
             └───────┬───────┘
                     │
                     ▼
┌─────────────┐  CAMPUSFLOW  ┌──────────────┐
│ ASSIGNMENTS │ ──────────── │    TASKS     │
└─────────────┘              └──────────────┘
                     │
                     ▼
             ┌───────────────┐
             │    AI /       │
             │  NOTIFICATIONS│
             └───────────────┘
```

The goal is to transform scattered academic information into **one contextual academic command center**.

---

## 👩‍💻 Author

**Krupa Mehta**

Engineering Student — Artificial Intelligence & Machine Learning

---

## 📄 Academic Project

This project was developed as part of the **Full Stack Development (FST)** coursework.

- **Project:** CampusFlow
- **Assignment:** FST Assignment 1
- **Framework:** Next.js
- **Language:** TypeScript
- **Architecture:** Next.js App Router + React Server/Client Components
- **State Management:** Zustand
- **Validation:** Zod + React Hook Form