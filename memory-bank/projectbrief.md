# Project Brief: Hackathon Registration & Management System

## 1. Overview
The primary objective of this project is to build a comprehensive system for a hackathon event. This includes a public-facing registration form, a full-featured admin dashboard, participant and mentor dashboards, and event management capabilities. The system handles detailed information capture, data persistence, file uploads, administrative CRUD operations, role-based participant actions, event registration, mentor availability, and milestone tracking.

## 2. Core Requirements
- **Public Registration Form:** A user-friendly interface to gather information about teams, participants, and their ideas, with file upload capabilities.
- **Admin Dashboard:** A secure area for administrators to:
  - View, manage, and create team registrations, with full CRUD capabilities.
  - Manage events and view participant registrations.
  - Manage mentors and their availability.
  - Create and track project milestones.
  - Access and download files submitted by teams.
- **Participant Dashboard:** A secure area for logged-in participants to:
  - View their own profile.
  - View detailed information about their team and its members.
  - (If team leader) Add, edit, and delete team members.
  - Browse and register for events.
  - View and submit project milestones with file attachments.
- **Mentor Dashboard:** A secure area for mentors to:
  - Manage their profile information.
  - Set and manage their availability.
  - View their scheduled sessions.
- **Backend API:** Robust Next.js API routes to handle public submissions, admin actions, participant-specific requests, and mentor-specific requests.
- **Database Integration:** Use Prisma ORM with a SQLite database.
- **File Storage:** Secure cloud-based storage for team documents and milestone submissions.

## 3. Key Technologies
- **Frontend:** Next.js (React), TypeScript, Tailwind CSS, shadcn/ui
- **Backend:** Next.js API Routes, JWT for authentication
- **Database:** Prisma, SQLite
- **File Handling:** Native `request.formData()` API
- **File Storage:** Vercel Blob for cloud-based object storage
- **Date Handling:** date-fns for date formatting and manipulation
- **Calendar Interface:** react-big-calendar for mentor availability management
