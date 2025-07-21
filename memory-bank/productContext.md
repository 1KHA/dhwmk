# Product Context: Hackathon Registration & Management

## 1. Problem Solved
Hackathon organizers need an efficient and reliable way to collect and manage registrations. Manual processes are time-consuming, error-prone, and create a poor experience for both participants and administrators. This project solves that by providing a centralized, automated system for the entire registration lifecycle.

## 2. Desired User Experience
- **For Participants:**
  - **Seamless & Intuitive:** The registration process should be smooth and easy to follow.
  - **Reliable:** Participants should trust that their data is saved securely and that they won't lose progress.
  - **Efficient:** The form should be quick to complete.
- **For Administrators:**
  - **Centralized View:** Admins need a single dashboard to see all registered teams and participants.
  - **Full Control:** Admins must be able to perform all necessary management tasks (view details, approve, reject, edit, delete) directly from the dashboard.
  - **Efficient Workflow:** The dashboard should provide clear, actionable information and intuitive controls to streamline the management process.

## 3. How It Should Work
1.  **Participant Registration:**
    - A user navigates to `/register-team`.
    - They fill out the form, with data persisting in `localStorage`.
    - They submit the form, including any file uploads.
    - The backend validates and saves the registration with a "pending" status.
    - The user receives a confirmation.
2.  **Admin Management:**
    - An admin navigates to the `/admin-hackton-dashboard`.
    - They can view lists of all teams and participants.
    - They can click to view the full details of any team or participant in a modal.
    - They can approve or reject pending teams, which may trigger other actions like account creation.
    - They can edit or delete existing teams and participants.
    - They can use a dedicated, admin-only page to create new teams manually.
