-- CreateTable
CREATE TABLE "Team" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "teamName" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "challenge" TEXT NOT NULL,
    "challengeReason" TEXT NOT NULL,
    "ideaName" TEXT NOT NULL,
    "ideaDescription" TEXT NOT NULL,
    "ideaSolution" TEXT NOT NULL,
    "ideaResults" TEXT NOT NULL,
    "ideaStage" TEXT NOT NULL,
    "attachmentsLink" TEXT,
    "hasParticipated" BOOLEAN NOT NULL,
    "participationDetails" TEXT,
    "attachmentPath" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Participant" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "firstName" TEXT NOT NULL,
    "secondName" TEXT NOT NULL,
    "familyName" TEXT NOT NULL,
    "nationalId" TEXT NOT NULL,
    "dob" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "education" TEXT NOT NULL,
    "university" TEXT NOT NULL,
    "major" TEXT NOT NULL,
    "employmentStatus" TEXT NOT NULL,
    "nationality" TEXT NOT NULL,
    "residence" TEXT NOT NULL,
    "canAttend" BOOLEAN NOT NULL,
    "isLeader" BOOLEAN NOT NULL DEFAULT false,
    "passwordHash" TEXT,
    "teamId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Participant_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Admin" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Participant_email_key" ON "Participant"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");
