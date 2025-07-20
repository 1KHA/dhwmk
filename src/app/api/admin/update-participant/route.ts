import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(req: Request) {
  try {
    const { id, fullName, email, phoneNumber, specialty } = await req.json();

    if (!id) {
      return NextResponse.json({ error: 'Participant ID is required' }, { status: 400 });
    }

    const updatedParticipant = await prisma.participant.update({
      where: { id: id },
      data: {
        fullName,
        email,
        phoneNumber,
        specialty,
      },
    });

    return NextResponse.json(updatedParticipant);
  } catch (error) {
    console.error('Error updating participant:', error);
    return NextResponse.json({ error: 'Failed to update participant' }, { status: 500 });
  }
}
