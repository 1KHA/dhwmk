import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

// GET /api/admin/submissions
// Fetches all submissions across all milestones
export async function GET(request: NextRequest) {
  try {
    // Check if admin is authenticated (this would be implemented with proper auth)
    // For now, we'll skip this check for development purposes

    // Fetch all submissions with participant, team, and milestone info using Prisma
    const submissions = await prisma.milestoneSubmission.findMany({
      include: {
        participant: {
          include: {
            team: true
          }
        },
        milestone: true
      },
      orderBy: {
        submittedAt: 'desc'
      }
    });

    // Transform the data to match the expected format
    const formattedSubmissions = submissions.map(sub => ({
      id: sub.id,
      participantId: sub.participantId,
      milestoneId: sub.milestoneId,
      filePath: sub.filePath,
      fileName: sub.fileName,
      submittedAt: sub.submittedAt.toISOString(),
      reviewStatus: sub.reviewStatus,
      reviewComment: sub.reviewComment,
      reviewedAt: sub.reviewedAt ? sub.reviewedAt.toISOString() : null,
      participant: {
        id: sub.participant.id,
        firstName: sub.participant.firstName || '',
        secondName: sub.participant.secondName || '',
        familyName: sub.participant.familyName || '',
        email: sub.participant.email,
        teamId: sub.participant.teamId || '',
        team: {
          id: sub.participant.team?.id || '',
          teamName: sub.participant.team?.teamName || 'لا يوجد فريق'
        }
      },
      milestone: {
        id: sub.milestone.id,
        title: sub.milestone.title,
        dueDate: sub.milestone.dueDate.toISOString()
      }
    }));

    return NextResponse.json(formattedSubmissions);
  } catch (error) {
    console.error("Error fetching all submissions:", error);
    console.error("Error details:", error instanceof Error ? error.message : 'Unknown error');
    return NextResponse.json(
      { error: "حدث خطأ أثناء جلب التسليمات" },
      { status: 500 }
    );
  }
}
