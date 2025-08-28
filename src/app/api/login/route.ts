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

    // Try to find a participant first
    const participant = await prisma.participant.findUnique({
      where: { email },
      include: {
        team: true,
      },
    });

    if (participant) {
      // Check if participant has a password (account is activated)
      if (!participant.passwordHash) {
        return NextResponse.json(
          { error: 'Account not activated. Please wait for admin approval.' },
          { status: 401 }
        );
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, participant.passwordHash);

      if (!isValidPassword) {
        return NextResponse.json(
          { error: 'Invalid credentials' },
          { status: 401 }
        );
      }

      // Check if team is approved
      if (!participant.team || participant.team.status !== 'approved') {
        return NextResponse.json(
          { error: 'Your team is not yet approved' },
          { status: 401 }
        )
      }

      // Generate JWT token for participant
      const token = jwt.sign(
        {
          id: participant.id,
          email: participant.email,
          teamId: participant.teamId,
          isLeader: participant.isLeader,
          role: 'participant',
        },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      const response = NextResponse.json({
        success: true,
        user: {
          id: participant.id,
          fullName: `${participant.firstName} ${participant.secondName} ${participant.familyName}`,
          email: participant.email,
          teamId: participant.teamId,
          teamName: participant.team.teamName,
          isLeader: participant.isLeader,
          role: 'participant',
        },
      });

      response.cookies.set('auth-token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });

      return response;
    }

    // If not a participant, check if it's a mentor
    const mentor = await prisma.mentor.findUnique({
      where: { email },
    });

    if (!mentor || !mentor.passwordHash) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, mentor.passwordHash);

    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Generate JWT token for mentor
    const token = jwt.sign(
      {
        id: mentor.id,
        email: mentor.email,
        role: 'mentor',
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Create response with cookie
    const response = NextResponse.json({
      success: true,
      user: {
        id: mentor.id,
        fullName: mentor.name,
        email: mentor.email,
        role: 'mentor',
      },
    });

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
