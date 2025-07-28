import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST /api/admin/milestones/[milestoneId]/submissions/[submissionId]/review
// Updates the review status and comment for a submission
export async function POST(
  request: NextRequest,
  { params }: { params: { milestoneId: string; submissionId: string } }
) {
  try {
    // Check if admin is authenticated (this would be implemented with proper auth)
    // For now, we'll skip this check for development purposes

    const { milestoneId, submissionId } = params;

    if (!milestoneId || !submissionId) {
      return NextResponse.json(
        { error: "معرف المرحلة ومعرف التسليم مطلوبان" },
        { status: 400 }
      );
    }

    // Get the review data from the request body
    const data = await request.json();
    const { reviewStatus, reviewComment } = data;

    if (!reviewStatus) {
      return NextResponse.json(
        { error: "حالة المراجعة مطلوبة" },
        { status: 400 }
      );
    }

    // Check if the submission exists
    const submission = await prisma.$queryRaw`
      SELECT * FROM MilestoneSubmission 
      WHERE id = ${submissionId} AND milestoneId = ${milestoneId}
    `;

    if (!submission || (Array.isArray(submission) && submission.length === 0)) {
      return NextResponse.json(
        { error: "لم يتم العثور على التسليم" },
        { status: 404 }
      );
    }

    // Update the submission with the review
    await prisma.$executeRaw`
      UPDATE MilestoneSubmission
      SET 
        reviewStatus = ${reviewStatus},
        reviewComment = ${reviewComment || null},
        reviewedAt = ${new Date().toISOString()}
      WHERE id = ${submissionId}
    `;

    return NextResponse.json({
      success: true,
      message: "تم تحديث المراجعة بنجاح",
    });
  } catch (error) {
    console.error("Error updating submission review:", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء تحديث المراجعة" },
      { status: 500 }
    );
  }
}
