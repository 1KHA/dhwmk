# Tech Context: Hackathon Registration & Management

## 1. Technologies Used
- **Next.js:** A React framework for building full-stack web applications. Used for the frontend UI, backend API, and routing.
- **React:** A JavaScript library for building user interfaces. Used for creating components and managing state.
- **TypeScript:** A typed superset of JavaScript used to ensure type safety across the application.
- **Tailwind CSS:** A utility-first CSS framework for rapidly building custom designs.
- **shadcn/ui:** A collection of reusable UI components built on top of Radix UI and Tailwind CSS. Used extensively in the admin dashboard.
- **Prisma:** A next-generation ORM for Node.js and TypeScript. Used for database schema management, migrations, and querying.
- **SQLite:** A self-contained, serverless SQL database engine used for local development.
- **Lucide React:** A library of simply designed icons used throughout the admin dashboard.

## 2. Development Setup
- **Node.js & npm:** The application is a standard Node.js project with dependencies managed via npm.
- **`package.json`:** Defines project scripts (`dev`, `build`, `start`), dependencies, and metadata.
- **Prisma CLI:** Used for managing the database.
  - `prisma migrate dev`: Applies database migrations.
  - `prisma generate`: Generates the Prisma Client.

## 3. Technical Constraints & Dependencies
- **Serverless Environment:** The API routes are designed for a serverless environment (like Vercel).
- **`@prisma/client`:** The core dependency for database interaction.
- **`fs/promises`:** The native Node.js module used for file system operations (saving uploads).
