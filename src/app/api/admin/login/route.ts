import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { username, password } = body

    if (!username || !password) {
      return NextResponse.json(
        { error: 'اسم المستخدم وكلمة المرور مطلوبان' },
        { status: 400 }
      )
    }

    // Find admin by username
    const admin = await prisma.admin.findUnique({
      where: { username },
    });

    if (!admin) {
      return NextResponse.json(
        { error: 'بيانات الاعتماد غير صالحة' },
        { status: 401 }
      );
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, admin.passwordHash);

    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'بيانات الاعتماد غير صالحة' },
        { status: 401 }
      );
    }

    // Generate JWT token for admin
    const token = jwt.sign(
      {
        id: admin.id,
        username: admin.username,
        role: 'admin',
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Create response with cookie
    const response = NextResponse.json({
      success: true,
      user: {
        id: admin.id,
        username: admin.username,
        role: 'admin',
      },
    });

    // Set HTTP-only cookie
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });

    return response;
  } catch (error) {
    console.error('Error during admin login:', error)
    return NextResponse.json(
      { error: 'فشل تسجيل الدخول' },
      { status: 500 }
    )
  }
}
