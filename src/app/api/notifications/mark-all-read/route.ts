import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { markAllNotificationsAsRead } from '@/lib/notifications';

// Ensure this route is dynamic
export const dynamic = 'force-dynamic';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

interface JWTPayload {
  participantId?: string;
  mentorId?: string;
  adminId?: string;
  isLeader?: boolean;
}

export async function POST(request: NextRequest) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    
    // Determine user type and ID
    let recipientType: string;
    let recipientId: string;

    if (decoded.participantId) {
      recipientType = 'participant';
      recipientId = decoded.participantId;
    } else if (decoded.mentorId) {
      recipientType = 'mentor';
      recipientId = decoded.mentorId;
    } else if (decoded.adminId) {
      recipientType = 'admin';
      recipientId = decoded.adminId;
    } else {
      return NextResponse.json({ error: 'نوع المستخدم غير صحيح' }, { status: 400 });
    }

    await markAllNotificationsAsRead(recipientType, recipientId);

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 });
  }
}
