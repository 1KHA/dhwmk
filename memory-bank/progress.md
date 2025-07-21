# Progress: Hackathon Registration Form

## 1. What Works
- **Frontend Form:** The registration form at `src/app/register-team/page.tsx` is fully functional. It correctly captures all required fields, including nested participant data.
- **`localStorage` Persistence:** The form's state is successfully saved to `localStorage`, preventing data loss on page reloads.
- **File Upload Mechanism:** The frontend correctly prepares a `FormData` object, and the backend API at `src/app/api/register-team/route.ts` successfully receives it.
- **File Saving:** The backend correctly parses the `multipart/form-data`, extracts the uploaded file, and saves it to the `public/uploads` directory.
- **Database Migrations:** The Prisma schema (`prisma/schema.prisma`) is up-to-date, and the migration commands (`prisma migrate reset` and `prisma generate`) have been executed successfully.

## 2. What's Left to Build
- At this stage, all development work required to fix the current issue is complete. There are no new features or code changes planned until the existing error is resolved.

## 3. Current Status
- **Blocked:** The project is currently blocked by a critical runtime error.
- **Error:** `PrismaClientKnownRequestError: The column main.Participant.firstName does not exist in the current database.`
- **Root Cause Analysis:** The error is not due to a code defect. The code and database schema are correct. The issue is caused by the Next.js development server using a cached, outdated version of the Prisma Client and database schema.

## 4. Known Issues & Evolution
- **Initial `JSON.parse` Error:** The project initially used a `Content-Type: application/json` header, which failed because `JSON.stringify` cannot serialize `File` objects. This was resolved by switching to `multipart/form-data`.
- **`formidable` Library Issues:** An early implementation with the `formidable` library caused compatibility problems. This was resolved by switching to the native `request.formData()` API.
- **`ENOENT` Error:** The backend would crash if the `public/uploads` directory didn't exist. This was fixed by adding code to create the directory programmatically.
- **The Caching Issue (Current):** The final remaining hurdle is the schema caching issue, which requires an environment restart rather than a code change.
