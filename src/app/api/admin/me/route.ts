import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

export async function GET(request: NextRequest) {
  try {
    // Get the token from the cookies
    const token = request.cookies.get('auth-token')?.value

    if (!token) {
      return NextResponse.json(
        { error: 'غير مصرح. يرجى تسجيل الدخول.' },
        { status: 401 }
      )
    }

    // Verify the token
    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: string
      username: string
      role: string
    }

    // Check if the user is an admin
    if (decoded.role !== 'admin') {
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
      return NextResponse.json(
        { error: 'غير مصرح. المستخدم غير موجود.' },
        { status: 401 }
      )
    }

    // Return the admin user data (excluding sensitive information)
    return NextResponse.json({
      success: true,
      user: {
        id: admin.id,
        username: decoded.username, // Use the username from the token
        role: 'admin',
      },
    })
  } catch (error) {
    console.error('Error verifying admin token:', error)
    return NextResponse.json(
      { error: 'غير مصرح. يرجى تسجيل الدخول مرة أخرى.' },
      { status: 401 }
    )
  }
}
