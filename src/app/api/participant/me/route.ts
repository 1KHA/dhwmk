import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

interface JwtPayload {
  id: string;
  email: string;
  teamId: string;
  isLeader: boolean;
}

export async function GET(request: NextRequest) {
  try {
    const cookieStore = cookies();
    const tokenCookie = cookieStore.get('auth-token');

    if (!tokenCookie) {
      return NextResponse.json({ error: 'Authentication token not found.' }, { status: 401 });
    }

    const token = tokenCookie.value;
    let decoded: JwtPayload;

    try {
      decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    } catch (err) {
      return NextResponse.json({ error: 'Invalid or expired token.' }, { status: 401 });
    }

    const { id: currentUserId } = decoded;

    const participant = await prisma.participant.findUnique({
      where: { id: currentUserId },
    });

    if (!participant) {
      return NextResponse.json({ error: 'Participant not found.' }, { status: 404 });
    }

    // Add a computed fullName to the participant
    const participantWithFullName = {
      ...participant,
      fullName: `${participant.firstName} ${participant.secondName} ${participant.familyName}`,
    };

    return NextResponse.json(participantWithFullName);

  } catch (error) {
    console.error('Error fetching participant details:', error);
    return NextResponse.json({ error: 'Failed to fetch participant details' }, { status: 500 });
  }
}
