import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { PrismaClient } from '@prisma/client'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { teamName, leader, members, idea } = body

    // Basic validation
    if (!leader || !leader.email) {
      return NextResponse.json({ error: 'Leader information is missing or invalid.' }, { status: 400 })
    }
    
    if (teamName && (!members || members.length < 2 || members.length > 5)) {
      return NextResponse.json({ error: 'A team must have between 2 and 5 members.' }, { status: 400 })
    }

    // Check if any email already exists
    const allEmails = [leader.email, ...(members?.map((m: any) => m.email) || [])].filter(Boolean)
    if (allEmails.length > 0) {
      const existingParticipants = await prisma.participant.findMany({
        where: { email: { in: allEmails } },
      })

      if (existingParticipants.length > 0) {
        return NextResponse.json(
          { error: 'One or more email addresses are already registered.' },
          { status: 400 }
        )
      }
    }

    const result = await prisma.$transaction(async (tx: Omit<PrismaClient, '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'>) => {
      // Step 1: Create the team.
      const team = await tx.team.create({
        data: {
          teamName,
          status: 'pending',
          challenge: idea.challenge,
          challengeReason: idea.challengeReason,
          ideaName: idea.ideaName,
          ideaDescription: idea.ideaDescription,
          ideaSolution: idea.ideaSolution,
          ideaResults: idea.ideaResults,
          ideaStage: idea.ideaStage,
          attachmentsLink: idea.attachmentsLink,
          hasParticipated: idea.hasParticipated,
          participationDetails: idea.participationDetails,
        },
      });
      const teamId = team.id;

      // Step 2: Create the leader and associate with the new team.
      await tx.participant.create({
        data: {
          ...leader,
          isLeader: true,
          teamId: teamId,
        },
      });

      // Step 3: Create team members if they exist.
      if (members && members.length > 0) {
        for (const member of members) {
          await tx.participant.create({
            data: {
              firstName: member.firstName,
              secondName: member.secondName,
              familyName: member.familyName,
              nationalId: member.nationalId,
              dob: member.dob,
              email: member.email,
              phoneNumber: member.phoneNumber,
              education: member.education,
              university: member.university,
              major: member.major,
              employmentStatus: member.employmentStatus,
              nationality: member.nationality,
              residence: member.residence,
              canAttend: member.canAttend,
              isLeader: false,
              teamId: teamId,
            },
          })
        }
      }

      return { teamId };
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Team registration submitted successfully',
        teamId: result.teamId,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error registering team:', error)
    return NextResponse.json(
      { error: 'Failed to register team' },
      { status: 500 }
    )
  }
}
