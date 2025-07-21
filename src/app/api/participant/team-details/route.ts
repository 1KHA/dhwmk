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

    const { teamId, id: currentUserId, isLeader } = decoded;

    if (!teamId) {
      return NextResponse.json({ error: 'Team ID not found in token.' }, { status: 400 });
    }

    const team = await prisma.team.findUnique({
      where: { id: teamId },
      include: {
        participants: {
          orderBy: {
            isLeader: 'desc', // Show leader first
          },
        },
      },
    });

    if (!team) {
      return NextResponse.json({ error: 'Team not found.' }, { status: 404 });
    }

    // Add a computed fullName to each participant
    const participantsWithFullName = team.participants.map(p => ({
      ...p,
      fullName: `${p.firstName} ${p.secondName} ${p.familyName}`,
    }));

    return NextResponse.json({
      ...team,
      participants: participantsWithFullName,
      currentUser: {
        id: currentUserId,
        isLeader: isLeader,
      },
    });

  } catch (error) {
    console.error('Error fetching team details:', error);
    return NextResponse.json({ error: 'Failed to fetch team details' }, { status: 500 });
  }
}
