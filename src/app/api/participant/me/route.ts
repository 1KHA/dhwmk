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
      include: {
        team: {
          select: {
            id: true,
            teamName: true,
            status: true
          }
        }
      }
    });

    if (!participant) {
      return NextResponse.json({ error: 'المشارك غير موجود' }, { status: 404 });
    }

    // Handle different data formats and provide fallbacks
    const safeParticipant = {
      id: participant.id,
      email: participant.email || '',
      status: (participant as any).status || 'pending',
      teamId: participant.teamId,
      isLeader: participant.isLeader || false,
      passwordHash: participant.passwordHash,
      createdAt: participant.createdAt,
      updatedAt: participant.updatedAt,
      
      // Handle name fields with fallbacks
      firstName: participant.firstName || '',
      secondName: participant.secondName || '',
      familyName: participant.familyName || '',
      fullName: participant.fullName || 
                `${participant.firstName || ''} ${participant.secondName || ''} ${participant.familyName || ''}`.trim() || 
                'غير متوفر',
      
      // Handle contact information
      phoneNumber: participant.phoneNumber || participant.contactNumber || '',
      contactNumber: participant.contactNumber || participant.phoneNumber || '',
      
      // Handle personal information
      nationalId: participant.nationalId || '',
      dob: participant.dob || '',
      gender: participant.gender || '',
      nationality: participant.nationality || '',
      residence: participant.residence || participant.city || '',
      city: participant.city || participant.residence || '',
      
      // Handle education information
      education: participant.education || '',
      university: participant.university || '',
      major: participant.major || participant.universityMajor || '',
      universityMajor: participant.universityMajor || participant.major || '',
      employmentStatus: participant.employmentStatus || participant.professionalField || '',
      professionalField: participant.professionalField || participant.employmentStatus || '',
      
      // Handle boolean fields
      canAttend: participant.canAttend !== null ? participant.canAttend : 
                 (participant.canAttendHackathon !== null ? participant.canAttendHackathon : true),
      canAttendHackathon: participant.canAttendHackathon !== null ? participant.canAttendHackathon : 
                          (participant.canAttend !== null ? participant.canAttend : true),
      isUniversityStudent: participant.isUniversityStudent !== null ? participant.isUniversityStudent : null,
      
      // Team information
      team: participant.team
    };

    return NextResponse.json(safeParticipant);

  } catch (error) {
    console.error('Error fetching participant details:', error);
    return NextResponse.json({ error: 'فشل في جلب بيانات المشارك' }, { status: 500 });
  }
}
