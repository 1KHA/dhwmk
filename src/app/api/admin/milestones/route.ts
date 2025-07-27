import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { randomUUID } from "crypto";

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

// POST /api/admin/milestones - Create a new milestone
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, dueDate, status, requirements } = body;

    // Validate required fields
    if (!title || !description || !dueDate || !requirements) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Convert requirements array to JSON string for storage
    const requirementsJson = JSON.stringify(requirements);
    const id = randomUUID();
    const now = new Date().toISOString();
    const statusValue = status || "upcoming";
    const formattedDueDate = new Date(dueDate).toISOString();

    // Create the new milestone using raw SQL
    await prisma.$executeRaw`
      INSERT INTO Milestone (id, title, description, dueDate, status, requirements, submissionCount, createdAt, updatedAt)
      VALUES (${id}, ${title}, ${description}, ${formattedDueDate}, ${statusValue}, ${requirementsJson}, 0, ${now}, ${now})
    `;

    // Fetch the created milestone
    const newMilestone = await prisma.$queryRaw<MilestoneFromDB[]>`
      SELECT * FROM Milestone WHERE id = ${id}
    `;

    return NextResponse.json(
      {
        ...newMilestone[0],
        requirements: JSON.parse(newMilestone[0].requirements),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating milestone:", error);
    return NextResponse.json(
      { error: "Failed to create milestone" },
      { status: 500 }
    );
  }
}

// PUT /api/admin/milestones - Update a milestone
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, title, description, dueDate, status, requirements } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Milestone ID is required" },
        { status: 400 }
      );
    }

    // Get the current milestone
    const currentMilestone = await prisma.$queryRaw<MilestoneFromDB[]>`
      SELECT * FROM Milestone WHERE id = ${id}
    `;

    if (currentMilestone.length === 0) {
      return NextResponse.json(
        { error: "Milestone not found" },
        { status: 404 }
      );
    }

    // Prepare update values
    const updatedTitle = title !== undefined ? title : currentMilestone[0].title;
    const updatedDescription = description !== undefined ? description : currentMilestone[0].description;
    const updatedDueDate = dueDate !== undefined ? new Date(dueDate).toISOString() : currentMilestone[0].dueDate.toISOString();
    const updatedStatus = status !== undefined ? status : currentMilestone[0].status;
    const updatedRequirements = requirements !== undefined 
      ? JSON.stringify(requirements) 
      : currentMilestone[0].requirements;
    const now = new Date().toISOString();

    // Update the milestone
    await prisma.$executeRaw`
      UPDATE Milestone
      SET title = ${updatedTitle},
          description = ${updatedDescription},
          dueDate = ${updatedDueDate},
          status = ${updatedStatus},
          requirements = ${updatedRequirements},
          updatedAt = ${now}
      WHERE id = ${id}
    `;

    // Fetch the updated milestone
    const updatedMilestone = await prisma.$queryRaw<MilestoneFromDB[]>`
      SELECT * FROM Milestone WHERE id = ${id}
    `;

    return NextResponse.json({
      ...updatedMilestone[0],
      requirements: JSON.parse(updatedMilestone[0].requirements),
    });
  } catch (error) {
    console.error("Error updating milestone:", error);
    return NextResponse.json(
      { error: "Failed to update milestone" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/milestones - Delete a milestone
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Milestone ID is required" },
        { status: 400 }
      );
    }

    // Check if milestone exists
    const milestone = await prisma.$queryRaw<MilestoneFromDB[]>`
      SELECT * FROM Milestone WHERE id = ${id}
    `;

    if (milestone.length === 0) {
      return NextResponse.json(
        { error: "Milestone not found" },
        { status: 404 }
      );
    }

    // Delete the milestone
    await prisma.$executeRaw`
      DELETE FROM Milestone WHERE id = ${id}
    `;

    return NextResponse.json(
      { message: "Milestone deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting milestone:", error);
    return NextResponse.json(
      { error: "Failed to delete milestone" },
      { status: 500 }
    );
  }
}
