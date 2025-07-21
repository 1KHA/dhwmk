# Project Brief: Hackathon Registration & Management System

## 1. Overview
The primary objective of this project is to build a comprehensive system for a hackathon event. This includes a public-facing, multi-step registration form and a full-featured admin dashboard for managing teams and participants. The system handles detailed information capture, data persistence, file uploads, and administrative CRUD (Create, Read, Update, Delete) operations.

## 2. Core Requirements
- **Public Registration Form:** A user-friendly interface to gather information about teams, participants, and their ideas.
- **Data Persistence:** Public form data is saved to `localStorage` to prevent data loss on page refresh.
- **File Uploads:** Allow users to upload project-related files during registration.
- **Backend API:** Robust Next.js API routes to handle form submissions and administrative actions.
- **Database Integration:** Use Prisma ORM with a SQLite database to store all data.
- **Admin Dashboard:** A secure area for administrators to view, manage, and create registrations. This includes functionalities to approve, reject, edit, and delete teams and participants.

## 3. Key Technologies
- **Frontend:** Next.js (React), TypeScript, Tailwind CSS, shadcn/ui
- **Backend:** Next.js API Routes
- **Database:** Prisma, SQLite
- **File Handling:** Native `request.formData()` API
