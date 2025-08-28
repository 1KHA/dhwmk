import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Ensure this route is dynamic
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const teams = await prisma.team.findMany({
      include: {
        participants: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(teams)
  } catch (error) {
    console.error('Error fetching teams:', error)
    return NextResponse.json(
      { error: 'Failed to fetch teams' },
      { status: 500 }
    )
  }
}
