# Product Context: Hackathon Registration Form

## 1. Problem Solved
Hackathon organizers need an efficient and reliable way to collect and manage registrations. Manual processes are time-consuming, error-prone, and create a poor experience for participants. This project solves that by providing a centralized, automated registration system.

## 2. Desired User Experience
- **Seamless & Intuitive:** The registration process should be smooth and easy to follow, guiding users through each step without confusion.
- **Reliable:** Participants should trust that their data is saved securely and that they won't lose progress if they close the browser.
- **Efficient:** The form should only ask for necessary information, making the process quick to complete.

## 3. How It Should Work
1.  **User Lands on Registration Page:** The user navigates to the `/register-team` page.
2.  **Fills Out Form:** The user completes the form, which includes fields for team details, participant information, and the core idea.
3.  **Uploads Files:** The user attaches any required documents for their submission.
4.  **Data Persists:** As the user fills out the form, the data is automatically saved to `localStorage`.
5.  **Submits Form:** Upon submission, the form data and files are sent to the backend API.
6.  **Backend Processing:** The API validates the data, saves the registration to the database, and stores the uploaded file in the `public/uploads` directory.
7.  **Confirmation:** The user receives a confirmation that their registration was successful.
