import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    // Ensure we're in a runtime environment, not build time
    if (!process.env.DATABASE_URL && process.env.NODE_ENV === 'production') {
      return NextResponse.json({ error: 'Database not available' }, { status: 503 });
    }

    const { teamId } = await request.json();

    if (!teamId) {
      return NextResponse.json({ error: 'Team ID is required' }, { status: 400 });
    }

    // First, delete participants associated with the team
    await prisma.participant.deleteMany({
      where: {
        teamId: teamId,
      },
    });

    // Then, delete the team
    await prisma.team.delete({
      where: {
        id: teamId,
      },
    });

    return NextResponse.json({ message: 'Team deleted successfully' });
  } catch (error) {
    console.error('Error deleting team:', error);
    return NextResponse.json({ error: 'Failed to delete team' }, { status: 500 });
  }
}

// Ensure this route is dynamic
export const dynamic = 'force-dynamic';
