import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verify } from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function DELETE(
  request: Request,
  { params }: { params: { availabilityId: string } }
) {
  const cookieStore = cookies();
  const token = cookieStore.get('auth-token')?.value;

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const decoded = verify(token, JWT_SECRET) as { id: string };
    const mentorId = decoded.id;
    const { availabilityId } = params;

    const availability = await prisma.mentorAvailability.findUnique({
      where: { id: availabilityId },
    });

    if (!availability || availability.mentorId !== mentorId) {
      return NextResponse.json({ error: 'Availability not found or you do not have permission to delete it' }, { status: 404 });
    }

    await prisma.mentorAvailability.delete({
      where: { id: availabilityId },
    });

    return NextResponse.json({ message: 'Availability deleted successfully' });
  } catch (error) {
    if (error instanceof Error && error.name === 'JsonWebTokenError') {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
    console.error('Error deleting availability:', error);
    return NextResponse.json({ error: 'An internal server error occurred' }, { status: 500 });
  }
}
