# Product Context: Hackathon Registration & Management

## 1. Problem Solved
Hackathon organizers need an efficient way to collect and manage registrations, while participants need a way to manage their own data and team composition after registering. This project solves these issues by providing a centralized, automated system for the entire registration and team management lifecycle.

## 2. Desired User Experience
- **For Participants:**
  - **Seamless Registration:** An intuitive, reliable form for initial registration.
  - **Self-Service:** A personal dashboard to view their own data.
  - **Team Management:** A dedicated team page to view all member details.
- **For Team Leaders:**
  - **Full Control:** The ability to add, edit, and remove team members after registration, providing flexibility as the team evolves.
- **For Administrators:**
  - **Centralized View:** A single dashboard to see all registered teams and participants.
  - **Efficient Workflow:** Full CRUD control over all data to manage the event effectively.

## 3. How It Should Work
1.  **Participant Registration:** A user registers their team via the public `/register-team` page. The submission is saved with a "pending" status.
2.  **Admin Management:** An admin approves the team via the `/admin-hackton-dashboard`. This activates the team members' accounts.
3.  **Participant Profile:** A logged-in participant can go to `/participant-dashboard` to view their own complete profile.
4.  **Participant Team Management:**
    - A participant navigates to `/participant-dashboard/team`.
    - They can see full details for their team and a table with complete details for all members.
    - If the participant is the team leader (`isLeader: true`), they will see buttons to add, edit, or delete members. Regular members will not see these controls.
