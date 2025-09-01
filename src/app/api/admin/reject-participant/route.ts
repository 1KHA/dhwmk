import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createNotification } from '@/lib/notifications'

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
        { error: 'This participant is part of a team. Use team rejection instead.' },
        { status: 400 }
      )
    }

    // Update participant status to rejected
    const updatedParticipant = await prisma.participant.update({
      where: { id: participantId },
      data: {
        status: 'rejected'
      }
    })

    // Create notification for the participant
    await createNotification({
      title: 'تم رفض طلبك',
      message: 'نأسف لإبلاغك أنه تم رفض طلب مشاركتك في الهاكاثون. يمكنك التواصل معنا للمزيد من المعلومات.',
      type: 'error',
      recipientType: 'participant',
      recipientId: participantId,
      relatedEntityType: 'participant',
      relatedEntityId: participantId
    })

    return NextResponse.json({
      message: 'Participant rejected successfully',
      participant: updatedParticipant
    })

  } catch (error) {
    console.error('Error rejecting participant:', error)
    return NextResponse.json(
      { error: 'Failed to reject participant' },
      { status: 500 }
    )
  }
}
