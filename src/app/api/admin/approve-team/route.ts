import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { PrismaClient } from '@prisma/client'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { teamId } = body

    if (!teamId) {
      return NextResponse.json(
        { error: 'Team ID is required' },
        { status: 400 }
      )
    }

    // Get team with participants
    const team = await prisma.team.findUnique({
      where: { id: teamId },
      include: { participants: true }
    })

    if (!team) {
      return NextResponse.json(
        { error: 'Team not found' },
        { status: 404 }
      )
    }

    if (team.status !== 'pending') {
      return NextResponse.json(
        { error: 'Team is not in pending status' },
        { status: 400 }
      )
    }

    // Update team status and create passwords for participants
    await prisma.$transaction(async (tx: Omit<PrismaClient, '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'>) => {
      // Update team status to approved
      await tx.team.update({
        where: { id: teamId },
        data: { status: 'approved' }
      })

      // Create passwords for all participants
      for (const participant of team.participants) {
        // Get last 4 digits of phone number
        const lastFourDigits = participant.phoneNumber.slice(-4)
        const hashedPassword = await bcrypt.hash(lastFourDigits, 10)

        // Update participant with password
        await tx.participant.update({
          where: { id: participant.id },
          data: { passwordHash: hashedPassword }
        })
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Team approved and accounts created successfully'
    })
  } catch (error) {
    console.error('Error approving team:', error)
    return NextResponse.json(
      { error: 'Failed to approve team' },
      { status: 500 }
    )
  }
}
