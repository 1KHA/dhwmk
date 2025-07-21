# System Patterns: Hackathon Registration & Management

## 1. System Architecture
The application follows a standard client-server architecture built on the Next.js framework.
- **Client (Frontend):** A single-page application (SPA) built with React and TypeScript.
  - **Public Area:** The registration form at `src/app/register-team/page.tsx`.
  - **Admin Dashboard:** A protected area under `src/app/admin-hackton-dashboard/` for managing data. It uses a table-based layout with modals for CRUD operations.
- **Server (Backend):** A set of serverless API routes within the same Next.js application.
  - **Public Endpoint:** `src/app/api/register-team/route.ts` handles new team registrations.
  - **Admin Endpoints:** Routes under `src/app/api/admin/` handle data fetching, updates, deletions, and status changes (approve/reject).
- **Database:** A SQLite database managed by the Prisma ORM.

## 2. Key Technical Decisions & Patterns
- **Monorepo Approach:** Frontend and backend are part of the same Next.js project, simplifying development.
- **`multipart/form-data` for Submissions:** The public form uses this to support file uploads.
- **Dynamic API Routes for Admin Actions:** The admin backend uses dynamic, single-purpose API routes (e.g., `delete-team`, `update-participant`) for clear separation of concerns.
- **Client-Side Data Fetching:** The admin dashboard uses `useEffect` hooks to fetch data from the admin API routes and manages state with `useState`. This provides a dynamic, responsive user experience.
- **Modal-Based UI for CRUD:** Instead of navigating to separate pages for every action, the admin dashboard uses dialogs/modals for viewing details, editing, and confirming deletions, which is a common pattern for modern admin panels.
- **Component Reusability:** UI components from `shadcn/ui` (e.g., Card, Button, Dialog, Table) are used extensively to build the UI quickly and consistently.

## 3. Component Relationships
- **Public Registration:**
  - `register-team/page.tsx` manages form state, persists to `localStorage`, and sends `FormData` to `/api/register-team`.
  - `api/register-team/route.ts` processes the `FormData`, saves the file, and creates `Team` and `Participant` records in the database.
- **Admin Dashboard:**
  - `admin-hackton-dashboard/teams/page.tsx` and `participants/page.tsx` fetch data from `/api/admin/teams`.
  - User actions (click delete, edit, etc.) trigger handler functions within the component.
  - These handlers send requests (`POST`, `PATCH`) to the appropriate admin API routes (e.g., `/api/admin/delete-team`).
  - The API routes perform the requested database operation via Prisma and return a confirmation.
  - The frontend component then re-fetches the data or updates its state to reflect the change.
