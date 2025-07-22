import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-default-secret';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
    }

    const mentor = await prisma.mentor.findUnique({
      where: { email },
    });

    if (!mentor || !mentor.passwordHash) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    const isPasswordValid = await bcrypt.compare(password, mentor.passwordHash);

    if (!isPasswordValid) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    const token = jwt.sign(
      { id: mentor.id, email: mentor.email, role: 'mentor' },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    return NextResponse.json({ token, user: { id: mentor.id, name: mentor.name, email: mentor.email, role: 'mentor' } });
  } catch (error) {
    console.error('Mentor login error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
