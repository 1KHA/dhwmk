# System Patterns: Hackathon Registration & Management

## 1. System Architecture
The application follows a standard client-server architecture built on the Next.js framework.
- **Client (Frontend):** A single-page application (SPA) built with React and TypeScript.
  - **Public Area:** The registration form at `src/app/register-team/page.tsx`.
  - **Admin Dashboard:** A protected area under `src/app/admin-hackton-dashboard/` for managing data.
  - **Participant Dashboard:** A protected area under `src/app/participant-dashboard/` with a profile page and a team management page.
- **Server (Backend):** A set of serverless API routes within the same Next.js application.
  - **Public Endpoint:** `/api/register-team` handles new team registrations.
  - **Admin Endpoints:** Routes under `/api/admin/` handle global data management.
  - **Participant Endpoints:** Secure routes under `/api/participant/` handle actions for the logged-in user, such as fetching their data or managing their team.
- **Database:** A SQLite database managed by the Prisma ORM.

## 2. Key Technical Decisions & Patterns
- **JWT-Based Authentication:** Participant login is handled via a JWT stored in an `httpOnly` cookie. API routes for participants verify this token to authorize requests.
- **Role-Based Access Control (RBAC):** The participant dashboard implements UI and API-level checks to differentiate between a team leader and a regular member. For example, the `isLeader` flag in the JWT payload is checked on the `/api/participant/add-member` route to grant or deny access.
- **Client-Side Data Fetching:** All dashboards use `useEffect` hooks to fetch data from their respective API routes and manage state with `useState`.
- **Modal-Based UI for CRUD:** The admin and participant dashboards use dialogs/modals for adding, editing, and confirming deletions.
- **Component Reusability:** UI components from `shadcn/ui` are used across all parts of the application for a consistent look and feel.

## 3. Component Relationships
- **Public Registration:** `register-team/page.tsx` sends `FormData` to `/api/register-team`.
- **Admin Dashboard:** Admin pages fetch data from `/api/admin/teams` and send modification requests to specific admin API routes (e.g., `/api/admin/delete-team`).
- **Participant Dashboard:**
  - `participant-dashboard/page.tsx` (Profile) fetches data from the secure `/api/participant/me` route.
  - `participant-dashboard/team/page.tsx` (Team Management) fetches data from the secure `/api/participant/team-details` route.
  - User actions trigger handlers that send requests to the appropriate API routes (e.g., `/api/participant/add-member` or the shared `/api/admin/update-participant`).
