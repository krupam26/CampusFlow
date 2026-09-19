# CampusFlow — Technical Architecture

## 1. Project Overview

CampusFlow is a contextual academic command center designed to bring together a student's timetable, assignments, tasks, schedule changes, notifications, and AI-assisted academic planning in one interface.

The application is built using the Next.js App Router and follows a hybrid Server Component and Client Component architecture.

The primary design principle is:

> Keep components server-rendered by default and introduce client-side JavaScript only where interactivity, browser APIs, or persistent client state are required.

---

## 2. Technology Stack

| Technology | Purpose |
|---|---|
| Next.js | Full-stack React framework and App Router |
| React | Component-based UI |
| TypeScript | Type safety |
| Tailwind CSS | Utility-first styling |
| shadcn/ui / Radix | Accessible UI primitives |
| Zustand | Persistent client-side application state |
| React Hook Form | Form state and submission handling |
| Zod | Shared form validation |
| Server Actions | Server-side mutation/validation boundary |
| Sonner | Toast notifications |
| Lucide React | Interface icons |

---

## 3. App Router Architecture

CampusFlow uses the Next.js App Router.

The main application routes are:

```text
/
├── /timetable
├── /assignments
├── /tasks
├── /notifications
└── /ai
```

The application shell provides shared navigation and layout components.

The major structure is:

```text
AppShell
│
├── Sidebar
│   ├── Overview
│   ├── Timetable
│   ├── Assignments
│   ├── Tasks
│   ├── Campus AI
│   └── Notifications
│
├── Topbar
│
└── Page Content
```

This allows the main navigation and visual language to remain consistent throughout the application.

---

## 4. Server Components vs Client Components

Next.js Server Components are used by default.

A component is converted to a Client Component only when it requires browser-side functionality such as:

- React state
- event handlers
- Zustand
- browser APIs
- localStorage
- interactive dialogs
- theme switching
- client-side form interaction

### Client Components

The following parts of CampusFlow require client-side execution:

**Zustand Store**
`src/stores/campusflow-store.ts`

The Zustand store uses:

```
"use client";
```

because it maintains persistent browser-side state.

**Theme Provider**

The theme provider is a Client Component because it manages the active light/dark theme and browser persistence.

**Theme Toggle**

The theme toggle requires client-side interaction to change the active theme.

**Sidebar**

The Sidebar uses client-side routing information and interactive mobile navigation.

**Assignment Dialog**

The assignment dialog requires:

- React state
- form interaction
- client-side validation
- optimistic updates
- toast feedback

Therefore it is a Client Component.

**Task Dialog**

The task dialog has the same requirements as the assignment dialog.

**AI Interface**

The Campus AI page uses client-side state to maintain the conversation and access the current CampusFlow context.

---

## 5. Server Components

Components that do not require browser state or event handlers can remain Server Components.

The following are intentionally kept server-side where possible:

- loading UI
- server actions
- static page structure
- server-side validation logic
- static content

The project avoids adding `"use client"` globally to pages or components unnecessarily.

This reduces the amount of JavaScript that needs to be sent to the browser.

---

## 6. React Server Component Boundary

The general component tree follows this principle:

```text
Server Component
│
├── Static UI
│
├── Server-side logic
│
└── Client Component
    │
    ├── Zustand state
    ├── Event handlers
    ├── Forms
    ├── Dialogs
    └── Browser APIs
```

Props crossing the Server Component → Client Component boundary should be serializable.

Functions, class instances, and browser-only objects are not passed across this boundary.

This keeps the RSC boundary predictable and avoids unnecessary client-side rendering.

---

## 7. Zustand Client State

CampusFlow uses Zustand for persistent client-side application state.

The central store contains:

- timetable
- overrides
- assignments
- tasks
- selectedDay

The store also provides actions such as:

```
addClass()
updateClass()
deleteClass()

addOverride()
updateOverride()
deleteOverride()

addAssignment()
updateAssignment()
deleteAssignment()
toggleAssignment()

addTask()
updateTask()
deleteTask()
toggleTask()
```

The store is persisted using Zustand's `persist` middleware.

```text
Browser
   │
   ▼
Zustand Store
   │
   ├── Timetable
   ├── Assignments
   ├── Tasks
   └── Schedule Overrides
```

This allows the application to retain the user's local academic data between page refreshes.

---

## 8. Server State vs Client State

The distinction between server state and client state is important.

### Client State

Zustand currently manages local application state:

- timetable entries
- assignments
- tasks
- schedule overrides
- selected day

These values are persisted in the browser.

### Server State

Server Actions provide the server-side boundary for validation and future persistence.

Currently, the Server Actions validate submitted data using the shared Zod schemas.

Future database-backed functionality can replace the local persistence layer with Prisma/PostgreSQL without changing the overall form architecture.

---

## 9. Form Architecture

CampusFlow uses:

```
React Hook Form
        +
      Zod
        +
   Server Action
```

For example:

```text
Assignment Form
      │
      ▼
React Hook Form
      │
      ▼
Zod Validation
      │
      ▼
Optimistic UI Update
      │
      ▼
Server Action
      │
      ▼
Server-side Zod Validation
```

The same validation schema is used on both the client and server.

Assignment validation is defined in:
`src/lib/validations/assignment.ts`

Task validation is defined in:
`src/lib/validations/task.ts`

This prevents the client and server from having different validation rules.

---

## 10. Server Actions

CampusFlow uses native Next.js Server Actions.

Examples:

```
src/app/actions/assignment-actions.ts
src/app/actions/task-actions.ts
```

Server Actions are marked using:

```
"use server";
```

They validate incoming data again using Zod.

Example flow:

```text
Client
  │
  │ form submission
  ▼
React Hook Form
  │
  │ Zod validation
  ▼
Server Action
  │
  │ safeParse()
  ▼
Structured Response
```

The server returns a structured response containing:

- success
- message
- data
- errors

This allows the client to display appropriate success and error feedback.

At the current stage of Assignment 1, the Server Actions perform validation and return validated data.

Actual database persistence is planned for the database/RBAC stage of the project.

---

## 11. Optimistic UI

Assignment and task creation/editing use an optimistic UI pattern.

The interface is updated immediately rather than waiting for the server response.

Example:

```text
User submits form
      │
      ▼
Update Zustand immediately
      │
      ▼
UI reflects change
      │
      ▼
Server Action executes
      │
      ├── Success → keep change
      │
      └── Failure → rollback change
```

For new records, a temporary client-generated ID is created using:

```
crypto.randomUUID()
```

If the Server Action fails, the optimistic record is removed.

For edits, the previous record is retained so that it can be restored if validation fails.

This provides a more responsive user experience.

---

## 12. Loading States

Next.js route-level loading files are used for asynchronous navigation.

Examples:

```
src/app/assignments/loading.tsx
src/app/tasks/loading.tsx
```

These files display skeleton-style placeholders while the corresponding route is loading.

The loading UI follows the CampusFlow visual system and avoids displaying a blank screen during navigation.

---

## 13. Toast Feedback

Sonner is used for user feedback.

Examples include:

- Assignment created successfully.
- Assignment updated successfully.
- Task created successfully.
- Task updated successfully.

Validation failures are presented using error toasts and inline form errors where appropriate.

This gives the user immediate feedback after mutations.

---

## 14. Accessibility

CampusFlow uses accessible HTML and UI patterns including:

- semantic `<main>` elements
- buttons for interactive controls
- links for navigation
- labels for form controls
- `aria-label` for icon-only buttons
- keyboard-accessible controls
- visible focus styles
- Radix/shadcn accessible primitives

Lighthouse testing produced:

```
Performance:     100
Accessibility:    96
Best Practices:  100
SEO:             100
```

The remaining automated accessibility issue identified by Lighthouse is a color-contrast warning.

The Lighthouse audit also provided several additional manual accessibility checks, including keyboard focus, logical tab order, focus management, landmarks, and custom control labeling.

---

## 15. Performance Evaluation

A Lighthouse audit was performed on the CampusFlow application.

Recorded metrics:

| Metric | Result |
|---|---|
| Performance | 100 |
| Accessibility | 96 |
| Best Practices | 100 |
| SEO | 100 |
| First Contentful Paint | 0.3 s |
| Largest Contentful Paint | 0.7 s |
| Total Blocking Time | 0 ms |
| Cumulative Layout Shift | 0 |
| INP | Not reported in the navigation audit |

The LCP value of 0.7 seconds indicates that the main page content was rendered quickly during the audit.

The CLS value of 0 indicates that the page did not experience measurable unexpected layout shifts during loading.

INP was not reported by this Lighthouse navigation audit, therefore no value was inferred or estimated.

---

## 16. Design System

CampusFlow uses a custom pixel-inspired academic dashboard design.

The visual system includes:

- Pixelify Sans headings
- Geist body typography
- warm light theme
- dark theme
- coral primary color
- mint and teal secondary colors
- pixel borders
- hard pixel shadows
- subtle grid backgrounds
- reduced border radius
- animated interaction feedback

The design tokens are centralized in:

`src/app/globals.css`

This allows the visual system to remain consistent across all application routes.

---

## 17. Future Architecture

The current architecture is designed to support future database-backed functionality.

The planned evolution is:

**Current**

```text
Next.js
   │
   ├── Zustand
   ├── RHF + Zod
   └── Server Actions
```

**Future**

```text
Next.js
   │
   ├── Prisma
   │     │
   │     └── PostgreSQL
   │
   ├── Authentication
   ├── RBAC
   ├── Server Actions
   ├── API Route Handlers
   └── Email / Notifications
```

The application can therefore evolve from a client-persistent prototype into a multi-user database-backed academic platform without replacing the core UI architecture.

---

## 18. Architectural Summary

CampusFlow follows a hybrid architecture:

```text
                    CAMPUSFLOW
                         │
          ┌──────────────┴──────────────┐
          │                             │
    Server Architecture          Client Architecture
          │                             │
    Server Actions                 Zustand
    Zod Validation                 React State
    App Router                     RHF
    Loading UI                     Dialogs
                                   Theme
                                   AI UI
          │                             │
          └──────────────┬──────────────┘
                         │
                    CampusFlow UI
```

The architecture prioritizes:

- Server Components by default
- Minimal Client Component boundaries
- Centralized client state
- Shared validation schemas
- Native Server Actions
- Optimistic user interactions
- Accessible UI primitives
- Responsive performance
- Reusable design tokens
- Future database scalability