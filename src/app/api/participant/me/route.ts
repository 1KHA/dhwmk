import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Get JWT token from cookies (consistent with other endpoints)
    const token = request.cookies.get('token')?.value;
    
    if (!token) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }

    // Verify JWT token (consistent with other endpoints)
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { participantId: string };
    
    const participant = await prisma.participant.findUnique({
      where: { id: decoded.participantId },
    });

    if (!participant) {
      return NextResponse.json({ error: 'المشارك غير موجود' }, { status: 404 });
    }

    // Add a computed fullName to the participant
    const participantWithFullName = {
      ...participant,
      fullName: participant.fullName || `${participant.firstName} ${participant.secondName} ${participant.familyName}`.trim(),
    };

    return NextResponse.json(participantWithFullName);

  } catch (error) {
    console.error('Error fetching participant details:', error);
    return NextResponse.json({ error: 'فشل في جلب بيانات المشارك' }, { status: 500 });
  }
}
