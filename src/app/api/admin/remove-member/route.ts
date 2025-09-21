import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    // Get the auth token from cookies
    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value || cookieStore.get("auth-token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized: No token provided" }, { status: 401 });
    }

    // Verify the token and check if it's an admin
    let decodedToken;
    try {
      decodedToken = jwt.verify(token, process.env.JWT_SECRET!) as { adminId?: string };
    } catch (error) {
      return NextResponse.json({ error: "Unauthorized: Invalid token" }, { status: 401 });
    }

    if (!decodedToken || !decodedToken.adminId) {
      return NextResponse.json({ error: "Unauthorized: Admin access required" }, { status: 401 });
    }

    // Get the request body
    const body = await request.json();
    const { participantId } = body;

    if (!participantId) {
      return NextResponse.json({ error: "Participant ID is required" }, { status: 400 });
    }

    // Get the participant to remove
    const participant = await prisma.participant.findUnique({
      where: { id: participantId },
      include: { team: { include: { participants: true } } },
    });

    if (!participant) {
      return NextResponse.json({ error: "Participant not found" }, { status: 404 });
    }

    if (!participant.teamId) {
      return NextResponse.json({ error: "Participant is not part of a team" }, { status: 400 });
    }

    const teamId = participant.teamId;
    const isLeader = participant.isLeader;
    const teamParticipants = participant.team?.participants || [];

    // If removing a leader, check if there are other members
    if (isLeader && teamParticipants.length > 1) {
      // Find another member to make leader
      const newLeader = teamParticipants.find((p: { id: string }) => p.id !== participantId);
      
      if (newLeader) {
        // Make another member the leader
        await prisma.participant.update({
          where: { id: newLeader.id },
          data: { isLeader: true },
        });
      }
    }

    // Remove the participant from the team
    const updatedParticipant = await prisma.participant.update({
      where: { id: participantId },
      data: { 
        teamId: null,
        isLeader: false // Ensure they're not marked as a leader
      },
    });

    // Get the updated team data
    const updatedTeam = await prisma.team.findUnique({
      where: { id: teamId },
      include: { participants: true },
    });

    return NextResponse.json({
      message: "Member removed successfully",
      participant: updatedParticipant,
      team: updatedTeam,
    });
  } catch (error) {
    console.error("Error removing team member:", error);
    return NextResponse.json({ error: "Failed to remove team member" }, { status: 500 });
  }
}
