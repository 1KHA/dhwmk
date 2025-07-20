import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Find participant by email
    const participant = await prisma.participant.findUnique({
      where: { email },
      include: {
        team: true
      }
    })

    if (!participant) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Check if participant has a password (account is activated)
    if (!participant.passwordHash) {
      return NextResponse.json(
        { error: 'Account not activated. Please wait for admin approval.' },
        { status: 401 }
      )
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, participant.passwordHash)

    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Check if team is approved
    if (participant.team.status !== 'approved') {
      return NextResponse.json(
        { error: 'Your team is not yet approved' },
        { status: 401 }
      )
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: participant.id,
        email: participant.email,
        teamId: participant.teamId,
        isLeader: participant.isLeader
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    // Create response with cookie
    const response = NextResponse.json({
      success: true,
      user: {
        id: participant.id,
        fullName: participant.fullName,
        email: participant.email,
        teamId: participant.teamId,
        teamName: participant.team.teamName,
        isLeader: participant.isLeader
      }
    })

    // Set HTTP-only cookie
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    })

    return response
  } catch (error) {
    console.error('Error during login:', error)
    return NextResponse.json(
      { error: 'Failed to login' },
      { status: 500 }
    )
  }
}
