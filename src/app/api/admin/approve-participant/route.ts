import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createNotification } from '@/lib/notifications'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const { participantId } = await request.json()

    if (!participantId) {
      return NextResponse.json(
        { error: 'Participant ID is required' },
        { status: 400 }
      )
    }

    // Find the participant
    const participant = await prisma.participant.findUnique({
      where: { id: participantId }
    })

    if (!participant) {
      return NextResponse.json(
        { error: 'Participant not found' },
        { status: 404 }
      )
    }

    // Check if participant is individual (no team)
    if (participant.teamId) {
      return NextResponse.json(
        { error: 'This participant is part of a team. Use team approval instead.' },
        { status: 400 }
      )
    }

    // Generate password if not exists
    let passwordHash = participant.passwordHash
    let generatedPassword = null

    if (!passwordHash) {
      // Generate a password based on email prefix
      const emailPrefix = participant.email.split('@')[0]
      generatedPassword = `${emailPrefix}123`
      passwordHash = await bcrypt.hash(generatedPassword, 10)
    }

    // Update participant status to approved and set password
    const updatedParticipant = await prisma.participant.update({
      where: { id: participantId },
      data: {
        status: 'approved',
        passwordHash: passwordHash
      }
    })

    // Create notification for the participant
    await createNotification({
      title: 'تم قبول طلبك!',
      message: `تم قبول طلب مشاركتك في الهاكاثون. يمكنك الآن تسجيل الدخول إلى حسابك.`,
      type: 'success',
      recipientType: 'participant',
      recipientId: participantId,
      relatedEntityType: 'participant',
      relatedEntityId: participantId,
      actionUrl: '/participant-dashboard'
    })

    return NextResponse.json({
      message: 'Participant approved successfully',
      participant: updatedParticipant,
      generatedPassword: generatedPassword
    })

  } catch (error) {
    console.error('Error approving participant:', error)
    return NextResponse.json(
      { error: 'Failed to approve participant' },
      { status: 500 }
    )
  }
}
