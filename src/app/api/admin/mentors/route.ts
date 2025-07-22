import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const mentors = await prisma.mentor.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    return NextResponse.json(mentors);
  } catch (error) {
    console.error('Error fetching mentors:', error);
    return NextResponse.json({ message: 'Failed to fetch mentors' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, specialty, phone } = body;

    if (!name || !email || !specialty || !phone) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const newMentor = await prisma.mentor.create({
      data: {
        name,
        email,
        specialty,
        phone,
      },
    });

    return NextResponse.json(newMentor, { status: 201 });
  } catch (error) {
    console.error('Error creating mentor:', error);
    // Check for unique constraint violation
    if ((error as any).code === 'P2002' && (error as any).meta?.target?.includes('email')) {
      return NextResponse.json({ message: 'Email already exists' }, { status: 409 });
    }
    return NextResponse.json({ message: 'Failed to create mentor' }, { status: 500 });
  }
}
