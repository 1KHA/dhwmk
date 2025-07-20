import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

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

    // Get team
    const team = await prisma.team.findUnique({
      where: { id: teamId }
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

    // Update team status to rejected
    await prisma.team.update({
      where: { id: teamId },
      data: { status: 'rejected' }
    })

    return NextResponse.json({
      success: true,
      message: 'Team rejected successfully'
    })
  } catch (error) {
    console.error('Error rejecting team:', error)
    return NextResponse.json(
      { error: 'Failed to reject team' },
      { status: 500 }
    )
  }
}
