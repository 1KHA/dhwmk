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

## 2. Development Setup
- **Node.js & npm:** Standard Node.js project with dependencies managed via npm.
- **`package.json`:** Defines project scripts (`dev`, `build`, `start`).
- **Prisma CLI:** Used for managing the database (`prisma migrate dev`, `prisma generate`).

## 3. Technical Constraints & Dependencies
- **Serverless Environment:** API routes are designed for a serverless environment.
- **`@prisma/client`:** The core dependency for database interaction.
- **`fs/promises`:** Native Node.js module for file system operations.
- **`cookies-next` or similar:** Would be needed for more advanced cookie management, but currently using Next.js's built-in `cookies()` helper.
