# Tech Context: Hackathon Registration & Management

## 1. Technologies Used
- **Next.js:** A React framework for building full-stack web applications.
- **React:** A JavaScript library for building user interfaces.
- **TypeScript:** A typed superset of JavaScript for type safety.
- **Tailwind CSS:** A utility-first CSS framework.
- **shadcn/ui:** A collection of reusable UI components used across all dashboards.
- **Prisma:** A next-generation ORM for Node.js and TypeScript.
- **SQLite:** A self-contained, serverless SQL database engine.
- **Lucide React:** A library of icons.
- **JSONWebToken (jsonwebtoken):** Used to generate and verify JWTs for authentication.
- **bcryptjs:** Used for hashing participant passwords.
- **date-fns:** Used for date formatting and manipulation, particularly for event dates.
- **react-big-calendar:** Used for the mentor availability calendar interface.
- **@vercel/blob:** Vercel's object storage solution for file uploads and storage.

## 2. Development Setup
- **Node.js & npm:** Standard Node.js project with dependencies managed via npm.
- **`package.json`:** Defines project scripts (`dev`, `build`, `start`).
- **Prisma CLI:** Used for managing the database (`prisma migrate dev`, `prisma generate`).

## 3. Technical Constraints & Dependencies
- **Serverless Environment:** API routes are designed for a serverless environment.
- **`@prisma/client`:** The core dependency for database interaction.
- **`@vercel/blob`:** Required for object storage functionality.
- **`cookies-next` or similar:** Would be needed for more advanced cookie management, but currently using Next.js's built-in `cookies()` helper.
- **Vercel Environment:** The application is optimized for deployment on Vercel, with specific configurations in `vercel.json`.
- **BLOB_READ_WRITE_TOKEN:** Environment variable required for Vercel Blob storage authentication.

## 4. Database Schema
The application uses a relational database with the following key models:
- **Participant:** Stores user information for hackathon participants.
- **Team:** Represents a team in the hackathon, with a one-to-many relationship to Participant. Includes `attachmentPath` field to store URLs to files in Vercel Blob storage.
- **Mentor:** Stores information about mentors who provide guidance to participants.
- **MentorAvailability:** Tracks time slots when mentors are available for consultations.
- **MentorBooking:** Records appointments between participants and mentors.
- **Event:** Stores information about hackathon events (workshops, talks, etc.).
- **EventRegistration:** Tracks participant registrations for events, with relations to both Event and Participant.
- **Milestone:** Represents project milestones that teams need to complete.
- **MilestoneSubmission:** Tracks team submissions for each milestone. Includes `filePath` field to store URLs to files in Vercel Blob storage.

## 5. API Structure
The API is organized into logical groups:
- **/api/admin/**: Admin-only endpoints for managing all aspects of the hackathon.
  - `/api/admin/teams`: CRUD operations for teams.
  - `/api/admin/participants`: CRUD operations for participants.
  - `/api/admin/mentors`: CRUD operations for mentors.
  - `/api/admin/events`: CRUD operations for events.
  - `/api/admin/event-registrations/[eventId]`: Managing registrations for a specific event.
  - `/api/admin/milestones`: CRUD operations for milestones.
- **/api/participant/**: Participant-specific endpoints.
  - `/api/participant/me`: Get/update the logged-in participant's profile.
  - `/api/participant/team-details`: Get team details for the logged-in participant.
  - `/api/participant/add-member`: Add a member to the team (leader only).
  - `/api/participant/register-event`: Register for or cancel registration for an event.
  - `/api/participant/submit-milestone`: Submit files for project milestones.
- **/api/mentor/**: Mentor-specific endpoints.
  - `/api/mentor/me`: Get/update the logged-in mentor's profile.
  - `/api/mentor/availability`: Manage mentor availability slots.
- **/api/events/**: Public endpoints for retrieving event information.
- **/api/milestones/**: Public endpoints for retrieving milestone information.
- **/api/register-team/**: Public endpoint for team registration, including file uploads.

## 6. File Storage
The application uses Vercel Blob storage for file management:
- **Storage Organization:** Files are organized in folders:
  - `teams/`: Stores team registration attachments
  - `milestones/`: Stores milestone submission files
- **File Naming:** Files are stored with timestamp prefixes to ensure uniqueness
- **Access Control:** Files are stored with public access for direct linking
- **Implementation:** The `src/lib/blob-storage.ts` module provides three core functions:
  - `uploadToBlob()`: Uploads files to Vercel Blob storage
  - `listBlobFiles()`: Lists files from a specific folder
  - `deleteFromBlob()`: Removes files from storage
