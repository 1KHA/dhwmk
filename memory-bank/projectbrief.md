# Project Brief: Hackathon Registration & Management System

## 1. Overview
The primary objective of this project is to build a comprehensive system for a hackathon event. This includes a public-facing registration form, a full-featured admin dashboard, and a participant dashboard for team management. The system handles detailed information capture, data persistence, file uploads, administrative CRUD operations, and role-based participant actions.

## 2. Core Requirements
- **Public Registration Form:** A user-friendly interface to gather information about teams, participants, and their ideas.
- **Admin Dashboard:** A secure area for administrators to view, manage, and create registrations, with full CRUD capabilities.
- **Participant Dashboard:** A secure area for logged-in participants to:
  - View their own profile.
  - View detailed information about their team and its members.
  - (If team leader) Add, edit, and delete team members.
- **Backend API:** Robust Next.js API routes to handle public submissions, admin actions, and participant-specific requests.
- **Database Integration:** Use Prisma ORM with a SQLite database.

## 3. Key Technologies
- **Frontend:** Next.js (React), TypeScript, Tailwind CSS, shadcn/ui
- **Backend:** Next.js API Routes, JWT for authentication
- **Database:** Prisma, SQLite
- **File Handling:** Native `request.formData()` API
