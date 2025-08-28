import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verify } from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET;

export async function GET() {
  console.log('GET /api/mentor/availability');
  const cookieStore = cookies();
  const token = cookieStore.get('auth-token')?.value;
  console.log('Auth token from cookie:', token);
  console.log('JWT_SECRET used:', process.env.JWT_SECRET ? 'Environment variable set' : 'Using default secret');


  if (!token) {
    console.log('No token found, returning 401');
    return NextResponse.json({ error: 'Unauthorized: No token provided' }, { status: 401 });
  }

  if (!JWT_SECRET) {
    console.error('JWT_SECRET is not set');
    return NextResponse.json({ error: 'Internal Server Error: JWT secret not configured' }, { status: 500 });
  }

  try {
    const decoded = verify(token, JWT_SECRET) as { id: string };
    console.log('Token decoded successfully:', decoded);
    const mentorId = decoded.id;

    const availabilities = await prisma.mentorAvailability.findMany({
      where: { mentorId },
      orderBy: { startTime: 'asc' },
    });

    return NextResponse.json(availabilities);
  } catch (error) {
    console.error('Error verifying token:', error);
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
}

export async function POST(request: Request) {
  const cookieStore = cookies();
  const token = cookieStore.get('auth-token')?.value;

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!JWT_SECRET) {
    console.error('JWT_SECRET is not set');
    return NextResponse.json({ error: 'Internal Server Error: JWT secret not configured' }, { status: 500 });
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
