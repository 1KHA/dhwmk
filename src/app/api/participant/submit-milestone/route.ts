import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { notifyAllAdmins, NotificationTemplates } from '@/lib/notifications';
import { uploadToBlob } from '@/lib/blob-storage';
import { MAX_FILE_SIZE, MAX_FILE_SIZE_MB, ALLOWED_FILE_TYPES } from '@/lib/constants';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

interface JwtPayload {
  id: string;
  email: string;
  teamId: string;
  isLeader: boolean;
}


export async function POST(request: NextRequest) {
  try {
    // Check if the request is multipart/form-data
    const contentType = request.headers.get("content-type") || "";
    if (!contentType.includes("multipart/form-data")) {
      return NextResponse.json(
        { error: "يجب أن يكون الطلب من نوع multipart/form-data" },
        { status: 400 }
      );
    }

    // Get the form data
    const formData = await request.formData();
    const milestoneId = formData.get("milestoneId") as string;
    const file = formData.get("file") as File;

    // Validate inputs
    if (!milestoneId) {
      return NextResponse.json(
        { error: "معرف المرحلة مطلوب" },
        { status: 400 }
      );
    }

    if (!file) {
      return NextResponse.json(
        { error: "الملف مطلوب" },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `حجم الملف يجب أن يكون أقل من ${MAX_FILE_SIZE_MB} ميجابايت` },
        { status: 400 }
      );
    }

    // Validate file type
    if (!ALLOWED_FILE_TYPES.includes(file.type) && file.type !== "") {
      return NextResponse.json(
        { error: "نوع الملف غير مدعوم" },
        { status: 400 }
      );
    }

    // Get the participant ID from the JWT token
    const cookieStore = cookies();
    const tokenCookie = cookieStore.get('auth-token');

    if (!tokenCookie) {
      return NextResponse.json(
        { error: "يرجى تسجيل الدخول للتسليم" },
        { status: 401 }
      );
    }

    const token = tokenCookie.value;
    let decoded: JwtPayload;

    try {
      decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    } catch (err) {
      return NextResponse.json(
        { error: "جلسة غير صالحة، يرجى تسجيل الدخول مرة أخرى" },
        { status: 401 }
      );
    }

    const { id: participantId } = decoded;

    // Get the participant with team information
    const participant = await prisma.participant.findUnique({
      where: { id: participantId },
      include: { team: true },
    });
    
    if (!participant) {
      return NextResponse.json(
        { error: "لم يتم العثور على المشارك" },
        { status: 404 }
      );
    }

    // Check if the milestone exists
    const milestone = await prisma.$queryRaw`
      SELECT * FROM Milestone WHERE id = ${milestoneId}
    `;
    if (!milestone || (Array.isArray(milestone) && milestone.length === 0)) {
      return NextResponse.json(
        { error: "لم يتم العثور على المرحلة" },
        { status: 404 }
      );
    }

    // Check if the participant has already submitted for this milestone
    const existingSubmission = await prisma.$queryRaw`
      SELECT * FROM MilestoneSubmission 
      WHERE participantId = ${participant.id} AND milestoneId = ${milestoneId}
    `;
    
    if (existingSubmission && Array.isArray(existingSubmission) && existingSubmission.length > 0) {
      return NextResponse.json(
        { error: "لقد قمت بتسليم هذا المشروع بالفعل ولا يمكنك التسليم مرة أخرى" },
        { status: 400 }
      );
    }

    // Generate a unique filename
    const timestamp = Date.now();
    const originalName = file.name;
    const fileName = `${timestamp}_${originalName}`;
    
    // Upload file to blob storage in 'milestones' folder
    const filePath = await uploadToBlob(file, fileName, 'milestones');

    // Create a new milestone submission in the database
    const submission = await prisma.$executeRaw`
      INSERT INTO MilestoneSubmission (id, participantId, milestoneId, filePath, fileName, submittedAt)
      VALUES (${crypto.randomUUID()}, ${participant.id}, ${milestoneId}, ${filePath}, ${originalName}, ${new Date().toISOString()})
    `;

    // Update the milestone submission count
    await prisma.$executeRaw`
      UPDATE Milestone
      SET submissionCount = submissionCount + 1
      WHERE id = ${milestoneId}
    `;

    // Create notification for admins about new milestone submission
    try {
      const milestoneData = Array.isArray(milestone) ? milestone[0] : milestone;
      const template = NotificationTemplates.newMilestoneSubmission(
        participant.team?.teamName || 'فريق غير محدد',
        milestoneData?.title || 'مرحلة غير محددة'
      );
      await notifyAllAdmins(
        template.title,
        template.message,
        template.type,
        {
          relatedEntityType: 'milestone',
          relatedEntityId: milestoneId,
          actionUrl: template.actionUrl,
        }
      );
    } catch (notificationError) {
      console.error('Error creating milestone submission notification:', notificationError);
      // Don't fail the submission if notification fails
    }

    return NextResponse.json({
      success: true,
      message: "تم تسليم المشروع بنجاح",
      submission,
    });
  } catch (error) {
    console.error("Error submitting milestone:", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء تسليم المشروع" },
      { status: 500 }
    );
  }
}
