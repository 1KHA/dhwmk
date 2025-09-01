import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    // Get JWT token from cookies
    const token = request.cookies.get('token')?.value;
    
    if (!token) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { participantId: string };
    
    // Get request body
    const updateData = await request.json();

    // Remove fields that shouldn't be updated by participants
    const {
      id,
      passwordHash,
      status,
      teamId,
      isLeader,
      createdAt,
      updatedAt,
      team,
      ...allowedUpdates
    } = updateData;

    // Update participant
    const updatedParticipant = await prisma.participant.update({
      where: { id: decoded.participantId },
      data: {
        ...allowedUpdates,
        updatedAt: new Date()
      }
    });

    return NextResponse.json({
      message: 'تم تحديث الملف الشخصي بنجاح',
      participant: updatedParticipant
    });

  } catch (error) {
    console.error('Error updating participant profile:', error);
    return NextResponse.json(
      { error: 'فشل في تحديث الملف الشخصي' },
      { status: 500 }
    );
  }
}
