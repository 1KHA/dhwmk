import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

// Helper to check admin auth
async function isAdmin(request: NextRequest) {
  const cookieStore = cookies();
  const token = cookieStore.get('auth-token')?.value;
  if (!token) return false;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string, role: string };
    return decoded.role === 'admin';
  } catch {
    return false;
  }
}

// PATCH: Update booking (status, availabilityId)
export async function PATCH(request: NextRequest, { params }: { params: { bookingId: string } }) {
  if (!(await isAdmin(request))) {
    return NextResponse.json({ error: 'غير مصرح. هذه الخدمة متاحة للمسؤولين فقط.' }, { status: 403 });
  }

  const { bookingId } = params;
  if (!bookingId) {
    return NextResponse.json({ error: 'يجب توفير معرف الحجز.' }, { status: 400 });
  }

  try {
    const body = await request.json();
    const dataToUpdate: { status?: string; availabilityId?: string } = {};
    if (body.status) dataToUpdate.status = body.status;
    if (body.availabilityId) dataToUpdate.availabilityId = body.availabilityId;

    const updated = await prisma.mentorBooking.update({
      where: { id: bookingId },
      data: dataToUpdate,
      include: {
        participant: {
          select: {
            id: true,
            firstName: true,
            secondName: true,
            familyName: true,
            email: true,
            phoneNumber: true,
          },
        },
        availability: {
          include: {
            mentor: {
              select: {
                id: true,
                name: true,
                email: true,
                specialty: true,
              },
            },
          },
        },
      },
    });

    // Format response
    return NextResponse.json({
      id: updated.id,
      status: updated.status,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
      mentor: {
        id: updated.availability.mentor.id,
        name: updated.availability.mentor.name,
        email: updated.availability.mentor.email,
        specialty: updated.availability.mentor.specialty,
      },
      participant: {
        id: updated.participant.id,
        name: `${updated.participant.firstName} ${updated.participant.secondName} ${updated.participant.familyName}`,
        email: updated.participant.email,
        phoneNumber: updated.participant.phoneNumber,
      },
      availability: {
        id: updated.availability.id,
        startTime: updated.availability.startTime,
        endTime: updated.availability.endTime,
      },
    });
  } catch (error) {
    console.error('Error updating mentor booking:', error);
    return NextResponse.json({ error: 'حدث خطأ أثناء تحديث الحجز.' }, { status: 500 });
  }
}

// DELETE: Delete booking
export async function DELETE(request: NextRequest, { params }: { params: { bookingId: string } }) {
  if (!(await isAdmin(request))) {
    return NextResponse.json({ error: 'غير مصرح. هذه الخدمة متاحة للمسؤولين فقط.' }, { status: 403 });
  }

  const { bookingId } = params;
  if (!bookingId) {
    return NextResponse.json({ error: 'يجب توفير معرف الحجز.' }, { status: 400 });
  }

  try {
    await prisma.mentorBooking.delete({
      where: { id: bookingId },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting mentor booking:', error);
    return NextResponse.json({ error: 'حدث خطأ أثناء حذف الحجز.' }, { status: 500 });
  }
}
