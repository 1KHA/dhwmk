import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { teamId } = await req.json();

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
