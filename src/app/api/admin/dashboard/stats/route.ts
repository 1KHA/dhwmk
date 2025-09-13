import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Get total participants count
    const totalParticipants = await prisma.participant.count();

    // Get total teams count
    const totalTeams = await prisma.team.count();

    // Get individual participants count (those without a team)
    const individualParticipants = await prisma.participant.count({
      where: {
        teamId: null
      }
    });

    // Get total mentors count
    const totalMentors = await prisma.mentor.count();

    // Get events statistics
    const totalEvents = await prisma.event.count();
    
    const completedEvents = await prisma.event.count({
      where: {
        status: "completed"
      }
    });
    
    const upcomingEvents = await prisma.event.count({
      where: {
        status: "upcoming"
      }
    });

    // Get event registrations count
    const totalEventRegistrations = await prisma.eventRegistration.count();

    // Get submissions statistics
    const totalSubmissions = await prisma.milestoneSubmission.count();
    
    const pendingSubmissions = await prisma.milestoneSubmission.count({
      where: {
        reviewStatus: "pending"
      }
    });
    
    const acceptedSubmissions = await prisma.milestoneSubmission.count({
      where: {
        reviewStatus: "accepted"
      }
    });

    // Get mentor bookings statistics
    const totalMentorBookings = await prisma.mentorBooking.count();
    
    const completedMentorBookings = await prisma.mentorBooking.count({
      where: {
        status: "completed"
      }
    });

    // Get team distribution by track
    const teamsByTrack = await prisma.team.groupBy({
      by: ['hackathonTrack'],
      _count: {
        id: true
      }
    });

    // Format team distribution for chart
    const teamDistribution = teamsByTrack.map(track => ({
      name: track.hackathonTrack || 'غير محدد',
      count: track._count.id
    }));

    // Get milestone completion statistics
    const milestones = await prisma.milestone.findMany({
      select: {
        id: true,
        title: true,
        submissionCount: true
      }
    });

    // Return all statistics
    return NextResponse.json({
      totalParticipants,
      totalTeams,
      individualParticipants,
      totalMentors,
      totalEvents,
      completedEvents,
      upcomingEvents,
      totalEventRegistrations,
      totalSubmissions,
      pendingSubmissions,
      acceptedSubmissions,
      totalMentorBookings,
      completedMentorBookings,
      teamDistribution,
      milestones
    });
  } catch (error) {
    console.error("Error fetching dashboard statistics:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard statistics" },
      { status: 500 }
    );
  }
}
