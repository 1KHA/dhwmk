import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    console.log('🚪 Logout request received');
    
    // Create response
    const response = NextResponse.json({ success: true, message: 'Logged out successfully' })
    
    // Clear the auth token cookie with multiple approaches for thorough cleanup
    response.cookies.set('token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0, // Expire immediately
      path: '/',
      expires: new Date(0), // Set expiration to past date
    })

    // Also clear any potential legacy cookies
    response.cookies.set('auth-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
      path: '/',
      expires: new Date(0),
    })

    console.log('🍪 Cookies cleared successfully');
    console.log('✅ Logout completed');

    return response
  } catch (error) {
    console.error('❌ Logout error:', error)
    return NextResponse.json(
      { error: 'Failed to logout' },
      { status: 500 }
    )
  }
}
