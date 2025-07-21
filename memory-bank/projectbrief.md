# Project Brief: Hackathon Registration Form

## 1. Overview
The primary objective of this project is to build a comprehensive, multi-step registration form for a hackathon event. The form will capture detailed information about participants and their ideas, persist data across sessions using `localStorage`, and handle file uploads for project submissions.

## 2. Core Requirements
- **Multi-Step Form:** A user-friendly interface to gather information in logical sections.
- **Data Persistence:** Form data must be saved to `localStorage` to prevent data loss on page refresh.
- **File Uploads:** Allow users to upload project-related files (e.g., presentations, code archives).
- **Backend API:** A robust Next.js API route to handle form submission, including `multipart/form-data`.
- **Database Integration:** Use Prisma ORM with a SQLite database to store registration data.
- **Admin Dashboard:** (Future goal) A dashboard for administrators to view and manage registrations.

## 3. Key Technologies
- **Frontend:** Next.js (React), TypeScript, Tailwind CSS
- **Backend:** Next.js API Routes
- **Database:** Prisma, SQLite
- **File Handling:** Native `request.formData()` API
