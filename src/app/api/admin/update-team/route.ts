import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { teamId, teamName, ideaName } = await req.json();

    if (!teamId) {
      return NextResponse.json({ error: 'Team ID is required' }, { status: 400 });
    }

    const dataToUpdate: { teamName?: string; ideaName?: string } = {};
    if (teamName) dataToUpdate.teamName = teamName;
    if (ideaName) dataToUpdate.ideaName = ideaName;


    const updatedTeam = await prisma.team.update({
      where: { id: teamId },
      data: dataToUpdate,
    });

    return NextResponse.json(updatedTeam);
  } catch (error) {
    console.error('Error updating team:', error);
    return NextResponse.json({ error: 'Failed to update team' }, { status: 500 });
  }
}
