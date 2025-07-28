import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { writeFile } from "fs/promises";
import { join } from "path";
import { mkdir } from "fs/promises";
import crypto from "crypto";

// Maximum file size (10MB)
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes

// Allowed file types
const ALLOWED_FILE_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/zip",
  "application/x-zip-compressed",
  "application/vnd.rar",
  "image/jpeg",
  "image/png",
];

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
        { error: "حجم الملف يجب أن يكون أقل من 10 ميجابايت" },
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

    // Get the participant ID from the session (assuming authentication is implemented)
    // For now, we'll use a placeholder to get the first participant
    const participant = await prisma.participant.findFirst();
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

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), "public", "uploads");
    await mkdir(uploadsDir, { recursive: true });

    // Generate a unique filename
    const timestamp = Date.now();
    const originalName = file.name;
    const fileName = `${timestamp}_${originalName}`;
    const filePath = join(uploadsDir, fileName);

    // Convert the file to a Buffer and write it to the filesystem
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    await writeFile(filePath, fileBuffer);

    // Create a new milestone submission in the database
    const submission = await prisma.$executeRaw`
      INSERT INTO MilestoneSubmission (id, participantId, milestoneId, filePath, fileName, submittedAt)
      VALUES (${crypto.randomUUID()}, ${participant.id}, ${milestoneId}, ${`/uploads/${fileName}`}, ${originalName}, ${new Date().toISOString()})
    `;

    // Update the milestone submission count
    await prisma.$executeRaw`
      UPDATE Milestone
      SET submissionCount = submissionCount + 1
      WHERE id = ${milestoneId}
    `;

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
