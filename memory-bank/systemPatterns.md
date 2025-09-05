# System Patterns: Hackathon Registration & Management

## 1. System Architecture
The application follows a standard client-server architecture built on the Next.js framework.
- **Client (Frontend):** A single-page application (SPA) built with React and TypeScript.
  - **Public Area:** The registration form at `src/app/register-team/page.tsx`.
  - **Admin Dashboard:** A protected area under `src/app/admin-hackton-dashboard/` for managing data.
  - **Participant Dashboard:** A protected area under `src/app/participant-dashboard/` with a profile page, team management page, and events page.
  - **Mentor Dashboard:** A protected area under `src/app/mentor-dashboard/` with a profile page and availability management page.
- **Server (Backend):** A set of serverless API routes within the same Next.js application.
  - **Public Endpoint:** `/api/register-team` handles new team registrations.
  - **Admin Endpoints:** Routes under `/api/admin/` handle global data management.
  - **Participant Endpoints:** Secure routes under `/api/participant/` handle actions for the logged-in user, such as fetching their data, managing their team, or registering for events.
  - **Mentor Endpoints:** Secure routes under `/api/mentor/` handle actions for mentors, such as managing their availability.
- **Database:** Dual database configuration:
  - **Development:** SQLite database for local development
  - **Production:** PostgreSQL database (via Supabase) for production
  - Both managed by the Prisma ORM with environment-based configuration

## 2. Key Technical Decisions & Patterns

### Dual Database Configuration
- **Environment-Based Database Selection:** The system uses environment variables to dynamically select the database provider:
  - `DATABASE_TYPE=sqlite` for local development
  - `DATABASE_TYPE=postgresql` for production
- **Prisma Schema Management:** Separate schema files for each database type:
  - `schema.sqlite.prisma` for SQLite
  - `schema.production.prisma` for PostgreSQL
- **Database Switching Script:** The `scripts/switch-db.js` script automates switching between database types
- **Environment Files:** Different environment files for different configurations:
  - `.env.local` for SQLite configuration
  - `.env.production` for PostgreSQL configuration
- **Prisma Client Configuration:** Enhanced Prisma client in `src/lib/prisma.ts` with dynamic database selection based on environment variables

- **JWT-Based Authentication:** All user types (admin, participant, mentor) use JWT tokens stored in `httpOnly` cookies. API routes verify these tokens to authorize requests.
- **Role-Based Access Control (RBAC):** The system implements comprehensive role-based access control:
  - **Admin Dashboard:** Protected by AdminRouteGuard component that verifies admin role
  - **Mentor Dashboard:** Protected by MentorRouteGuard component that verifies mentor role  
  - **Participant Dashboard:** Implements UI and API-level checks to differentiate between team leaders and regular members
  - **API Endpoints:** All secured endpoints verify JWT tokens and user roles before processing requests
- **Standardized Authentication Responses:** All `/me` endpoints return consistent response format with `success`, `role`, and user data fields
- **Client-Side Data Fetching:** All dashboards use `useEffect` hooks to fetch data from their respective API routes and manage state with `useState`.
- **Modal-Based UI for CRUD:** The admin and participant dashboards use dialogs/modals for adding, editing, and confirming deletions.
- **Component Reusability:** UI components from `shadcn/ui` are used across all parts of the application for a consistent look and feel.
- **Cloud-Based File Storage:** The application uses Vercel Blob storage for file uploads, with a folder-based organization system and unique filename generation to prevent collisions.
- **File Upload Security:** File uploads implement file type validation and size limits (25MB) to prevent abuse.

## 3. Component Relationships
- **Public Registration:** `register-team/page.tsx` sends `FormData` to `/api/register-team`, which handles both text data and file uploads using Vercel Blob storage.
- **Admin Dashboard:** Admin pages fetch data from `/api/admin/teams` and send modification requests to specific admin API routes (e.g., `/api/admin/delete-team`).
- **Participant Dashboard:**
  - `participant-dashboard/page.tsx` (Profile) fetches data from the secure `/api/participant/me` route.
  - `participant-dashboard/team/page.tsx` (Team Management) fetches data from the secure `/api/participant/team-details` route.
  - `participant-dashboard/events/page.tsx` (Events) fetches data from `/api/events` and sends registration requests to `/api/participant/register-event`.
  - `participant-dashboard/milestones/page.tsx` (Milestones) fetches data from `/api/milestones` and submits files to `/api/participant/submit-milestone` using Vercel Blob storage.
  - User actions trigger handlers that send requests to the appropriate API routes (e.g., `/api/participant/add-member` or the shared `/api/admin/update-participant`).
- **Mentor Dashboard:**
  - `mentor-dashboard/profile/page.tsx` (Profile) fetches data from the secure `/api/mentor/me` route.
  - `mentor-dashboard/availability/page.tsx` (Availability) fetches and manages data through `/api/mentor/availability`.
- **Event Registration System:**
  - Admin event management is handled through `/api/admin/events` for CRUD operations on events.
  - Admin registration management is handled through `/api/admin/event-registrations/[eventId]` for viewing and managing registrations.
  - Participant event registration is handled through `/api/participant/register-event` for registering, checking status, and canceling.
  - Global export functionality in the admin events page fetches all events and their registrations to generate a comprehensive CSV file with UTF-8 encoding for Excel compatibility.
  - Excel export functionality in the admin teams page uses the xlsx library to generate Excel files with multiple worksheets containing all teams and participants data.
- **File Storage System:**
  - The `src/lib/blob-storage.ts` module provides core functionality for file operations.
  - Team registration attachments are uploaded through `/api/register-team` and stored in the 'teams' folder.
  - Milestone submissions are uploaded through `/api/participant/submit-milestone` and stored in the 'milestones' folder.
  - File URLs are stored in the database and displayed in the admin dashboard for viewing.
