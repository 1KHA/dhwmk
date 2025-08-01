# Active Context: Global Event Export Enhancement

## 1. Current Work Focus
The current focus is on enhancing the event management system, specifically adding a global export feature that allows administrators to export all events and all participants to a single UTF-8 Excel-compatible CSV file.

## 2. Recent Changes
- **Global Export Functionality:** 
  - Implemented a new `handleExportAllEvents` function in the admin events page that:
    - Fetches all events and their registrations
    - Combines the data into a comprehensive CSV with 18 columns covering all event and participant details
    - Adds UTF-8 BOM (`\uFEFF`) for proper Arabic text display in Excel
    - Properly escapes cells containing commas, quotes, or newlines
    - Downloads the file as "جميع-الفعاليات-والمشاركين.csv"
- **Admin Events Page Updates:**
  - Added a new button labeled "تصدير جميع الفعاليات والمشاركين (Excel)" in the main actions area
  - Implemented loading state for the export button that shows "جاري التصدير..." with a spinner
  - Added tooltip explaining the purpose of the button
- **CSV Structure and Content:**
  - Included comprehensive event details: name, type, description, date, start/end times, location, status, plan, facilitator, capacity
  - Included complete participant details: name, email, phone, team ID, leader status, registration status, registration date
  - For events with no participants, included a row with just event details
  - For events with participants, included a row for each participant with both event and participant details
  - Ensured all statuses are properly localized (including the "absent" status)

## 3. Next Steps
All requested features for the global event export are now complete. The system is stable. Future work could involve:
- Adding email notifications for registration status changes
- Implementing a waitlist feature for events that reach capacity
- Adding a bulk registration management feature for admins
- Enhancing the export feature to include filtering options (by date range, event type, etc.)
- Adding the ability to export in different formats (e.g., Excel XLSX)

## 4. Key Learnings & Patterns
- **Raw SQL vs. Prisma Client:** When working with the event registrations API, we encountered TypeScript issues with the Prisma client not recognizing the model names. We resolved this by using Prisma's raw SQL query methods (`$queryRaw` and `$executeRaw`) instead of the model methods. This approach provided more flexibility but required careful handling of the returned data types.
- **Dialog-Based UI for Complex Operations:** The registrations management dialog demonstrates an effective pattern for handling complex operations in a modal context. It includes search, filtering, and action capabilities all within a single dialog, providing a focused interface for managing registrations.
- **Dynamic Data Fetching:** The admin events page now fetches registration counts for each event after loading the events list. This two-step data fetching pattern allows us to display additional information without modifying the existing API endpoints.
- **Batch Processing for Global Export:** The global export feature demonstrates an effective pattern for batch processing data from multiple API endpoints. It fetches all events first, then iteratively fetches registrations for each event, combining the data into a single comprehensive export. This approach is scalable and can handle large datasets efficiently.
- **CSV Generation with Special Character Handling:** The implementation includes proper handling of special characters in CSV generation, including escaping cells with commas, quotes, or newlines. This ensures the exported data is correctly formatted and can be opened in Excel without issues.
