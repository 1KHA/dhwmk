# Product Context: Hackathon Registration & Management

## 1. Problem Solved
Hackathon organizers need an efficient way to collect and manage registrations, while participants need a way to manage their own data, team composition, and event participation after registering. This project solves these issues by providing a centralized, automated system for the entire hackathon management lifecycle, including team registration, event management, and mentor coordination.

## 2. Desired User Experience
- **For Participants:**
  - **Seamless Registration:** An intuitive, reliable form for initial registration with file upload capabilities (when registration is open).
  - **Registration Status:** Clear messaging when registration is closed with "انتهى التسجيل" displayed.
  - **Self-Service:** A personal dashboard to view their own data.
  - **Team Management:** A dedicated team page to view all member details.
  - **Event Participation:** The ability to browse, register for, and manage event registrations.
  - **Milestone Tracking:** Access to view and submit project milestones with file attachments.
- **For Team Leaders:**
  - **Full Control:** The ability to add, edit, and remove team members after registration, providing flexibility as the team evolves.
  - **Document Management:** The ability to upload and manage team documents during registration.
- **For Mentors:**
  - **Profile Management:** The ability to update their profile information.
  - **Availability Management:** A calendar interface to set and manage their available time slots.
  - **Session Tracking:** The ability to view and manage their booked sessions with participants.
- **For Administrators:**
  - **Centralized View:** A single dashboard to see all registered teams, participants, mentors, and events.
  - **Enhanced Search:** Powerful search capabilities across multiple fields (names, emails, universities, etc.) for both participants and teams.
  - **Efficient Workflow:** Full CRUD control over all data to manage the hackathon effectively.
  - **Event Management:** The ability to create, edit, and manage events, including tracking registrations.
  - **Milestone Management:** The ability to create, track, and review project milestone submissions with file downloads.
  - **Document Access:** The ability to view and download files submitted by teams during registration and milestone submissions.

## 3. How It Should Work
1.  **Participant Registration:** 
    - When registration is open: A user registers their team via the public `/register-team` page, with the option to upload supporting documents. The submission is saved with a "pending" status, and files are stored in Vercel Blob storage.
    - When registration is closed: The `/register-team` page displays "انتهى التسجيل" and hides the registration forms.
2.  **Admin Management:** An admin approves the team via the `/admin-hackton-dashboard`. This activates the team members' accounts. Admins can view and download any files submitted during registration.
3.  **Participant Profile:** A logged-in participant can go to `/participant-dashboard` to view their own complete profile.
4.  **Participant Team Management:**
    - A participant navigates to `/participant-dashboard/team`.
    - They can see full details for their team and a table with complete details for all members.
    - If the participant is the team leader (`isLeader: true`), they will see buttons to add, edit, or delete members. Regular members will not see these controls.
5.  **Admin Search Functionality:**
    - Administrators can search for participants across multiple fields (name, email, university, etc.) in the participants page.
    - Administrators can search for teams by team name, idea name, or any team member's name or email in the teams page.
    - Search is case-insensitive and works across multiple fields for better results.
    - Results are sorted with newest entries first for better visibility.
5.  **Event Registration:**
    - An admin creates events via the `/admin-hackton-dashboard/events` page.
    - Participants can view available events on the `/participant-dashboard/events` page.
    - Participants can register for events, view their registration status, and cancel registrations if needed.
    - Admins can view and manage registrations for each event, including marking attendance and exporting participant lists.
6.  **Mentor Management:**
    - Mentors can manage their profiles and availability through the mentor dashboard.
    - Admins can view and manage mentors, including their availability and bookings.
7.  **Milestone Tracking:**
    - Admins create milestones for teams to complete.
    - Teams can view and submit their work for each milestone, including uploading files (up to 25MB) in various formats.
    - Files are securely stored in Vercel Blob storage and organized in appropriate folders.
    - Admins can review submissions, download files, and provide feedback on milestone submissions.
