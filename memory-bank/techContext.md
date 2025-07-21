# Tech Context: Hackathon Registration Form

## 1. Technologies Used
- **Next.js:** A React framework for building full-stack web applications. Used for both the frontend UI and the backend API.
- **React:** A JavaScript library for building user interfaces. Used for creating the form components.
- **TypeScript:** A typed superset of JavaScript that compiles to plain JavaScript. Used to ensure type safety across the application.
- **Tailwind CSS:** A utility-first CSS framework for rapidly building custom designs.
- **Prisma:** A next-generation ORM for Node.js and TypeScript. Used for database schema management, migrations, and querying.
- **SQLite:** A self-contained, serverless, zero-configuration, transactional SQL database engine. Used as the database for local development.

## 2. Development Setup
- **Node.js & npm:** The application is a standard Node.js project, with dependencies managed via npm.
- **`package.json`:** Defines project scripts, dependencies, and metadata. Key scripts include:
  - `dev`: Starts the Next.js development server.
  - `build`: Builds the application for production.
  - `start`: Starts the production server.
- **Prisma CLI:** Used for managing the database schema and client.
  - `prisma migrate dev`: Applies database migrations during development.
  - `prisma generate`: Generates the Prisma Client based on the schema.

## 3. Technical Constraints & Dependencies
- **Serverless Environment:** The API routes are designed to run in a serverless environment (like Vercel), which influences how file uploads and other stateful operations are handled.
- **`@prisma/client`:** The core dependency for interacting with the database via the Prisma Client.
- **`fs/promises`:** The native Node.js module used for asynchronous file system operations, specifically for writing the uploaded file to disk.
