import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

interface DecodedToken {
  id: string;
  role: string;
  iat: number;
  exp: number;
}

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json({ message: 'Authentication token not found' }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;

    if (!decoded || decoded.role !== 'mentor') {
      return NextResponse.json({ message: 'Invalid token or role' }, { status: 403 });
    }

    const mentor = await prisma.mentor.findUnique({
      where: { id: decoded.id },
    });

    if (!mentor) {
      return NextResponse.json({ message: 'Mentor not found' }, { status: 404 });
    }

    return NextResponse.json(mentor);
  } catch (error) {
    console.error('Failed to get mentor profile:', error);
    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
