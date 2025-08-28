-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Participant" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "fullName" TEXT,
    "contactNumber" TEXT,
    "gender" TEXT,
    "isUniversityStudent" BOOLEAN,
    "universityMajor" TEXT,
    "professionalField" TEXT,
    "city" TEXT,
    "canAttendHackathon" BOOLEAN,
    "email" TEXT NOT NULL,
    "university" TEXT,
    "isLeader" BOOLEAN NOT NULL DEFAULT false,
    "passwordHash" TEXT,
    "teamId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "firstName" TEXT,
    "secondName" TEXT,
    "familyName" TEXT,
    "nationalId" TEXT,
    "dob" TEXT,
    "phoneNumber" TEXT,
    "education" TEXT,
    "major" TEXT,
    "employmentStatus" TEXT,
    "nationality" TEXT,
    "residence" TEXT,
    "canAttend" BOOLEAN,
    CONSTRAINT "Participant_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Participant" ("canAttend", "createdAt", "dob", "education", "email", "employmentStatus", "familyName", "firstName", "id", "isLeader", "major", "nationalId", "nationality", "passwordHash", "phoneNumber", "residence", "secondName", "teamId", "university", "updatedAt") SELECT "canAttend", "createdAt", "dob", "education", "email", "employmentStatus", "familyName", "firstName", "id", "isLeader", "major", "nationalId", "nationality", "passwordHash", "phoneNumber", "residence", "secondName", "teamId", "university", "updatedAt" FROM "Participant";
DROP TABLE "Participant";
ALTER TABLE "new_Participant" RENAME TO "Participant";
CREATE UNIQUE INDEX "Participant_email_key" ON "Participant"("email");
CREATE TABLE "new_Team" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "teamName" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "hackathonTrack" TEXT,
    "ideaDescription" TEXT,
    "hearAboutUs" TEXT,
    "isTeamRegistration" BOOLEAN NOT NULL DEFAULT true,
    "attachmentPath" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "challenge" TEXT,
    "challengeReason" TEXT,
    "ideaName" TEXT,
    "ideaSolution" TEXT,
    "ideaResults" TEXT,
    "ideaStage" TEXT,
    "attachmentsLink" TEXT,
    "hasParticipated" BOOLEAN,
    "participationDetails" TEXT
);
INSERT INTO "new_Team" ("attachmentPath", "attachmentsLink", "challenge", "challengeReason", "createdAt", "hasParticipated", "id", "ideaDescription", "ideaName", "ideaResults", "ideaSolution", "ideaStage", "participationDetails", "status", "teamName", "updatedAt") SELECT "attachmentPath", "attachmentsLink", "challenge", "challengeReason", "createdAt", "hasParticipated", "id", "ideaDescription", "ideaName", "ideaResults", "ideaSolution", "ideaStage", "participationDetails", "status", "teamName", "updatedAt" FROM "Team";
DROP TABLE "Team";
ALTER TABLE "new_Team" RENAME TO "Team";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
