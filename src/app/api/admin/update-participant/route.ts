import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { id, ...dataToUpdate } = body;

    if (!id) {
      return NextResponse.json({ error: 'Participant ID is required' }, { status: 400 });
    }

    // Remove any computed fields that shouldn't be saved to the DB
    delete dataToUpdate.fullName; 

    const updatedParticipant = await prisma.participant.update({
      where: { id: id },
      data: dataToUpdate,
    });

    return NextResponse.json(updatedParticipant);
  } catch (error) {
    console.error('Error updating participant:', error);
    return NextResponse.json({ error: 'Failed to update participant' }, { status: 500 });
  }
}
// Also allow PATCH requests for compatibility, though we'll use POST
export async function PATCH(req: Request) {
  return POST(req);
}
