import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { participantId } = await request.json();

    if (!participantId) {
      return NextResponse.json({ error: 'Participant ID is required' }, { status: 400 });
    }

    // First, delete the user associated with the participant
    // This assumes a cascading delete is set up in the schema or handled manually.
    // If not, you might need to delete the user record separately if it exists.
    // For this case, we assume the participant is the main record.
    
    await prisma.participant.delete({
      where: {
        id: participantId,
      },
    });

    // Optionally, you might want to delete the associated user account if it exists
    // and is not used for other roles.
    // Example:
    // const participant = await prisma.participant.findUnique({ where: { id: participantId } });
    // if (participant && participant.userId) {
    //   await prisma.user.delete({ where: { id: participant.userId } });
    // }


    return NextResponse.json({ message: 'Participant deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting participant:', error);
    return NextResponse.json(
      { error: 'Failed to delete participant' },
      { status: 500 }
    );
  }
}
