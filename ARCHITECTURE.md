# CampusFlow Architecture

## 1. Application Architecture

CampusFlow uses the Next.js App Router with a hybrid
Server Component and Client Component architecture.

The application follows the principle that components
remain Server Components by default and are converted
to Client Components only when browser-side interactivity
or client state is required.

---

## 2. Server / Client Boundary

```text
                    CAMPUSFLOW
                        │
          ┌─────────────┴─────────────┐
          │                           │
       SERVER                       CLIENT
          │                           │
          │                           │
   Server Components          Interactive Components
   Server Actions             Zustand Store
   Zod Validation             Forms
                              Theme
                              Sidebar
                              AI Chat
                              Dialogs
          │                           │
          └─────────────┬─────────────┘
                        │
                    User Interface