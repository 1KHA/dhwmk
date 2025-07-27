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

    // Parse the requirements JSON string for each milestone
    const formattedMilestones = (milestones as MilestoneFromDB[]).map((milestone) => ({
      ...milestone,
      requirements: JSON.parse(milestone.requirements),
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
