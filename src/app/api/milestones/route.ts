import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Define the Milestone type
type MilestoneFromDB = {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  status: string;
  requirements: string; // JSON string in the database
  submissionCount: number;
  submissionLink?: string | null;
  createdAt: Date;
  updatedAt: Date;
};

// GET /api/milestones - Get all milestones
export async function GET() {
  try {
    // Check if the Milestone model exists in the Prisma client
    const milestones = await prisma.$queryRaw`SELECT * FROM Milestone ORDER BY dueDate ASC`;

    // Get the current participant (assuming authentication is implemented)
    // For now, we'll use a placeholder to get the first participant
    const participant = await prisma.participant.findFirst();
    
    // If no participant is found, return milestones without hasSubmitted
    if (!participant) {
      // Parse the requirements JSON string for each milestone
      const formattedMilestones = (milestones as MilestoneFromDB[]).map((milestone) => ({
        ...milestone,
        requirements: JSON.parse(milestone.requirements),
        hasSubmitted: false,
      }));

      return NextResponse.json(formattedMilestones);
    }

    // Get all submissions for the current participant
    const submissions = await prisma.$queryRaw`
      SELECT milestoneId FROM MilestoneSubmission 
      WHERE participantId = ${participant.id}
    `;

    // Create a set of milestone IDs that the participant has submitted
    const submittedMilestoneIds = new Set(
      Array.isArray(submissions) 
        ? submissions.map((sub: any) => sub.milestoneId) 
        : []
    );

    // Parse the requirements JSON string for each milestone and add hasSubmitted
    const formattedMilestones = (milestones as MilestoneFromDB[]).map((milestone) => ({
      ...milestone,
      requirements: JSON.parse(milestone.requirements),
      hasSubmitted: submittedMilestoneIds.has(milestone.id),
    }));

    return NextResponse.json(formattedMilestones);
  } catch (error) {
    console.error("Error fetching milestones:", error);
    return NextResponse.json(
      { error: "Failed to fetch milestones" },
      { status: 500 }
    );
  }
}
