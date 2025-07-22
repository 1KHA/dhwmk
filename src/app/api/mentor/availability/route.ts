import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verify } from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function GET() {
  const cookieStore = cookies();
  const token = cookieStore.get('auth-token')?.value;

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const decoded = verify(token, JWT_SECRET) as { id: string };
    const mentorId = decoded.id;

    const availabilities = await prisma.mentorAvailability.findMany({
      where: { mentorId },
      orderBy: { startTime: 'asc' },
    });

    return NextResponse.json(availabilities);
  } catch (error) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
}

export async function POST(request: Request) {
  const cookieStore = cookies();
  const token = cookieStore.get('auth-token')?.value;

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const decoded = verify(token, JWT_SECRET) as { id: string };
    const mentorId = decoded.id;

    const { startTime, endTime } = await request.json();

    if (!startTime || !endTime) {
      return NextResponse.json({ error: 'Start time and end time are required' }, { status: 400 });
    }

    const newAvailability = await prisma.mentorAvailability.create({
      data: {
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        mentorId,
      },
    });

    return NextResponse.json(newAvailability, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.name === 'JsonWebTokenError') {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
    console.error('Error creating availability:', error);
    return NextResponse.json({ error: 'An internal server error occurred' }, { status: 500 });
  }
}
