-- CreateTable
CREATE TABLE "MentorBooking" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "participantId" TEXT NOT NULL,
    "availabilityId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'booked',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "MentorBooking_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "Participant" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "MentorBooking_availabilityId_fkey" FOREIGN KEY ("availabilityId") REFERENCES "MentorAvailability" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
