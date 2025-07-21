# System Patterns: Hackathon Registration Form

## 1. System Architecture
The application follows a standard client-server architecture built on the Next.js framework.
- **Client (Frontend):** A single-page application (SPA) built with React and TypeScript, responsible for rendering the UI and managing user interactions. It is located at `src/app/register-team/page.tsx`.
- **Server (Backend):** A set of serverless API routes within the same Next.js application, responsible for business logic, data processing, and database interactions. The primary endpoint is `src/app/api/register-team/route.ts`.
- **Database:** A SQLite database managed by the Prisma ORM.

## 2. Key Technical Decisions
- **Monorepo Approach:** The frontend and backend are part of the same Next.js project, simplifying development and deployment.
- **`multipart/form-data` for Submissions:** To support file uploads, the form is submitted as `multipart/form-data`. This decision was made after encountering serialization issues with JSON when handling file objects.
- **Native `formData()` API:** The backend uses the native `request.formData()` API provided by Next.js to parse `multipart/form-data`. This avoids external dependencies like `formidable` and ensures better compatibility with the Vercel/Next.js environment.
- **Programmatic Directory Creation:** The file upload handler in the API route programmatically checks for and creates the `public/uploads` directory to prevent `ENOENT` (No such file or directory) errors.
- **Prisma for Database Management:** Prisma is used for schema definition, migrations, and type-safe database access, ensuring that the application code and database schema are always synchronized.

## 3. Component Relationships
- **`register-team/page.tsx` (Frontend):**
  - Manages form state using `useState`.
  - Persists form state to `localStorage` using `useEffect`.
  - Constructs a `FormData` object on submit.
  - Sends the `FormData` to the `/api/register-team` endpoint.
- **`api/register-team/route.ts` (Backend):**
  - Receives the `POST` request.
  - Parses the `FormData` using `request.formData()`.
  - Extracts text fields and the uploaded file.
  - Writes the file to the server's file system (`public/uploads`).
  - Creates a new `Team` and associated `Participant` records in the database using Prisma Client.
