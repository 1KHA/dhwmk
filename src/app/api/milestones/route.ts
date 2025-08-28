import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

// Ensure this route is dynamic
export const dynamic = 'force-dynamic';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

interface JwtPayload {
  id: string;
  email: string;
  teamId: string;
  isLeader: boolean;
}

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

    // Get the participant ID from the JWT token
    const cookieStore = cookies();
    const tokenCookie = cookieStore.get('auth-token');
    
    // If no token is found, return milestones without hasSubmitted
    if (!tokenCookie) {
      // Parse the requirements JSON string for each milestone
      const formattedMilestones = (milestones as MilestoneFromDB[]).map((milestone) => ({
        ...milestone,
        requirements: JSON.parse(milestone.requirements),
        hasSubmitted: false,
      }));

      return NextResponse.json(formattedMilestones);
    }
    
    // Verify the token
    let decoded: JwtPayload;
    try {
      decoded = jwt.verify(tokenCookie.value, JWT_SECRET) as JwtPayload;
    } catch (err) {
      // If token is invalid, return milestones without hasSubmitted
      const formattedMilestones = (milestones as MilestoneFromDB[]).map((milestone) => ({
        ...milestone,
        requirements: JSON.parse(milestone.requirements),
        hasSubmitted: false,
      }));

      return NextResponse.json(formattedMilestones);
    }
    
    const { id: participantId } = decoded;
    
    // Get the participant from the database
    const participant = await prisma.participant.findUnique({
      where: { id: participantId },
    });
    
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
