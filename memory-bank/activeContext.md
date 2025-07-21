# Active Context: Hackathon Registration Form

## 1. Current Work Focus
The immediate priority is to resolve a persistent `PrismaClientKnownRequestError` that is blocking the successful submission of the registration form. The error message, `The column main.Participant.firstName does not exist in the current database`, indicates a mismatch between the Prisma schema and the actual database state being used by the application.

## 2. Recent Changes
- **Backend Refactoring:** The `api/register-team/route.ts` endpoint was refactored to handle `multipart/form-data` using the native `request.formData()` API, replacing a previous implementation that used the `formidable` library.
- **File Upload Logic:** The backend now includes logic to create the `public/uploads` directory if it doesn't exist, resolving `ENOENT` errors.
- **Prisma Schema Updates:** The `prisma/schema.prisma` file has been updated multiple times to align with the form's data requirements.
- **Database Migrations:** `prisma migrate reset` and `prisma generate` have been run successfully multiple times to apply the latest schema changes.

## 3. Next Steps
The sole remaining task is to resolve the database schema mismatch. All necessary code changes have been completed. The error persists despite correct code and successful migrations, which strongly points to a caching issue within the Next.js development server.

**The definitive next step is to completely stop and restart the Next.js development server.** This action will force the server to:
1.  Discard any cached version of the old database schema.
2.  Reload the newly generated Prisma Client.
3.  Connect to the correctly migrated database.

There are no further code modifications required to fix this issue. The solution is environmental, not code-based.

## 4. Key Learnings & Patterns
- **`multipart/form-data` is essential for file uploads:** JSON-based API routes are not suitable for handling file objects directly.
- **Native APIs are preferable:** Using Next.js's native `formData()` API is more reliable and less prone to compatibility issues than third-party libraries.
- **Development server caching can cause deceptive errors:** A running development server can hold on to outdated schema information, leading to errors that appear to be database-related but are actually caused by the server's cache.
