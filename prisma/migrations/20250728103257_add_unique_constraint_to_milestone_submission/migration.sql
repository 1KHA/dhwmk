/*
  Warnings:

  - A unique constraint covering the columns `[participantId,milestoneId]` on the table `MilestoneSubmission` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "MilestoneSubmission_participantId_milestoneId_key" ON "MilestoneSubmission"("participantId", "milestoneId");
