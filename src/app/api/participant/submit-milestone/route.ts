import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { notifyAllAdmins, NotificationTemplates } from '@/lib/notifications';
import { uploadToStorage } from '@/lib/supabase-storage';
import { MAX_FILE_SIZE, MAX_FILE_SIZE_MB, ALLOWED_FILE_TYPES } from '@/lib/constants';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

interface JwtPayload {
  participantId: string;
  email: string;
  role: string;
  teamId?: string;
  isLeader?: boolean;
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
      console.warn(`File size too large: ${file.size} bytes (${file.size / 1024 / 1024} MB), max is ${MAX_FILE_SIZE_MB}MB`);
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
    const tokenCookie = cookieStore.get('token'); // Changed from 'auth-token' to 'token' to match login route

    if (!tokenCookie) {
      console.log('No token cookie found in request');
      return NextResponse.json(
        { error: "يرجى تسجيل الدخول للتسليم" },
        { status: 401 }
      );
    }

    const token = tokenCookie.value;
    let decoded: JwtPayload;

    try {
      decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
      console.log('Decoded token:', decoded);
    } catch (err) {
      console.error('Token verification failed:', err);
      return NextResponse.json(
        { error: "جلسة غير صالحة، يرجى تسجيل الدخول مرة أخرى" },
        { status: 401 }
      );
    }

    // Get participantId directly from the decoded token
    const participantId = decoded.participantId;

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

    // Check if the participant is a team leader
    if (!participant.isLeader) {
      console.log(`Participant ${participantId} is not a team leader. isLeader=${participant.isLeader}`);
      return NextResponse.json(
        { error: "فقط قائد الفريق يمكنه تسليم المشاريع" },
        { status: 403 }
      );
    }

    // Check if the milestone exists
    const milestone = await prisma.$queryRaw`
      SELECT * FROM "Milestone" WHERE id = ${milestoneId}
    `;
    if (!milestone || (Array.isArray(milestone) && milestone.length === 0)) {
      return NextResponse.json(
        { error: "لم يتم العثور على المرحلة" },
        { status: 404 }
      );
    }

    // Check if the participant has already submitted for this milestone
    const existingSubmission = await prisma.$queryRaw`
      SELECT * FROM "MilestoneSubmission" 
      WHERE "participantId" = ${participant.id} AND "milestoneId" = ${milestoneId}
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
    
    // Upload file to Supabase storage in 'milestones' folder
    let filePath;
    try {
      filePath = await uploadToStorage(file, fileName, 'milestones');
      console.log(`File uploaded successfully: ${fileName}, size: ${file.size / 1024 / 1024}MB, path: ${filePath}`);
    } catch (uploadError) {
      console.error('File upload error:', uploadError);
      return NextResponse.json(
        { error: "حدث خطأ أثناء رفع الملف، يرجى المحاولة مرة أخرى" },
        { status: 500 }
      );
    }

    // Create a new milestone submission in the database
    const submission = await prisma.$executeRaw`
      INSERT INTO "MilestoneSubmission" (id, "participantId", "milestoneId", "filePath", "fileName", "submittedAt")
      VALUES (${crypto.randomUUID()}, ${participant.id}, ${milestoneId}, ${filePath}, ${originalName}, ${new Date().toISOString()}::timestamp)
    `;

    // Update the milestone submission count
    await prisma.$executeRaw`
      UPDATE "Milestone"
      SET "submissionCount" = "submissionCount" + 1
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

    // Handle specific error types with more informative messages
    if (error instanceof Error) {
      // Check if it's a payload size error (413)
      if (error.message && (error.message.includes('413') || error.message.includes('too large') || error.message.includes('Request Entity Too Large'))) {
        console.error(`413 Payload Too Large Error detected: ${error.message}`);
        return NextResponse.json(
          { error: `حجم الملف كبير جدًا، الحد الأقصى هو ${MAX_FILE_SIZE_MB} ميجابايت` },
          { 
            status: 413,
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );
      }

      // More specific error message if available
      console.error(`General Error during submission: ${error.message}`);
      return NextResponse.json(
        { error: `حدث خطأ أثناء تسليم المشروع: ${error.message}` },
        { 
          status: 500,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }
    
    // Generic error message if unknown error type
    return NextResponse.json(
      { error: "حدث خطأ أثناء تسليم المشروع، يرجى المحاولة مرة أخرى" },
      { status: 500 }
    );
  }
}
