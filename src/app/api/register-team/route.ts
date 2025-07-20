import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { PrismaClient } from '@prisma/client'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { teamName, teamIdea, leader, members } = body

    // Validate input
    if (!teamName || !teamIdea || !leader || !members || members.length < 2 || members.length > 5) {
      return NextResponse.json(
        { error: 'Invalid input data' },
        { status: 400 }
      )
    }

    // Check if any email already exists
    const allEmails = [leader.email, ...members.map((m: any) => m.email)]
    const existingParticipants = await prisma.participant.findMany({
      where: {
        email: {
          in: allEmails
        }
      }
    })

    if (existingParticipants.length > 0) {
      return NextResponse.json(
        { error: 'One or more email addresses are already registered' },
        { status: 400 }
      )
    }

    // Create team and participants in a transaction
    const result = await prisma.$transaction(async (tx: Omit<PrismaClient, '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'>) => {
      // Create team
      const team = await tx.team.create({
        data: {
          teamName,
          teamIdea,
          status: 'pending'
        }
      })

      // Create team leader
      await tx.participant.create({
        data: {
          fullName: leader.fullName,
          email: leader.email,
          phoneNumber: leader.phoneNumber,
          specialty: leader.specialty,
          isLeader: true,
          teamId: team.id
        }
      })

      // Create team members
      for (const member of members) {
        await tx.participant.create({
          data: {
            fullName: member.fullName,
            email: member.email,
            phoneNumber: member.phoneNumber,
            specialty: member.specialty,
            isLeader: false,
            teamId: team.id
          }
        })
      }

      return team
    })

    return NextResponse.json(
      { 
        success: true, 
        message: 'Team registration submitted successfully',
        teamId: result.id 
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
