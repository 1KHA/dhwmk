import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Ensure this route is dynamic
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Fetch individual participants (those without a team)
    const individualParticipants = await prisma.participant.findMany({
      where: {
        teamId: null // Individual participants don't have a team
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(individualParticipants)
  } catch (error) {
    console.error('Error fetching individual participants:', error)
    return NextResponse.json(
      { error: 'Failed to fetch individual participants' },
      { status: 500 }
    )
  }
}
