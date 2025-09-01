import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'

export const dynamic = 'force-dynamic';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 /api/admin/me - Starting request');
    console.log('🌐 Request URL:', request.url);
    console.log('🔗 Request headers:', Object.fromEntries(request.headers.entries()));

    // Get all cookies for debugging
    const allCookies = request.cookies.getAll();
    console.log('🍪 All cookies received:', allCookies.map(c => ({ name: c.name, value: c.value.substring(0, 20) + '...' })));

    // Get the token from the cookies (using consistent 'token' name)
    const token = request.cookies.get('token')?.value;

    console.log(`🍪 Token cookie: ${token ? 'Present (' + token.length + ' chars)' : 'Missing'}`);

    if (!token) {
      console.log('❌ No token found in cookies');
      return NextResponse.json(
        { error: 'غير مصرح. يرجى تسجيل الدخول.' },
        { status: 401 }
      )
    }

    console.log('🔑 Attempting JWT verification...');
    console.log(`🔐 JWT_SECRET exists: ${!!JWT_SECRET}`);
    console.log(`🔐 JWT_SECRET length: ${JWT_SECRET.length}`);

    // Verify the token
    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: string
      username: string
      role: string
    }

    console.log('✅ JWT verified successfully');
    console.log('🔑 Decoded token:', {
      id: decoded.id,
      username: decoded.username,
      role: decoded.role,
      exp: (decoded as any).exp,
      iat: (decoded as any).iat
    });

    // Check if the user is an admin
    if (decoded.role !== 'admin') {
      console.log(`❌ Invalid role: ${decoded.role} (expected: admin)`);
      return NextResponse.json(
        { error: 'غير مصرح. هذه الخدمة متاحة للمسؤولين فقط.' },
        { status: 403 }
      )
    }

    // Find the admin in the database
    const admin = await prisma.admin.findUnique({
      where: { id: decoded.id },
    })

    if (!admin) {
      console.log(`❌ Admin not found in database: ${decoded.id}`);
      return NextResponse.json(
        { error: 'غير مصرح. المستخدم غير موجود.' },
        { status: 401 }
      )
    }

    console.log('✅ Admin found:', {
      id: admin.id,
      username: admin.username
    });

    // Return the admin user data (excluding sensitive information)
    return NextResponse.json({
      success: true,
      id: admin.id,
      username: admin.username,
      email: admin.username, // For compatibility with auth context
      name: admin.username,
      role: 'admin',
    })
  } catch (error) {
    console.error('❌ Error verifying admin token:', error)
    return NextResponse.json(
      { error: 'غير مصرح. يرجى تسجيل الدخول مرة أخرى.' },
      { status: 401 }
    )
  }
}
