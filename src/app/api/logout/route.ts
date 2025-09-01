import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    // Create response
    const response = NextResponse.json({ success: true, message: 'Logged out successfully' });
    
    // Clear the authentication cookie
    response.cookies.set('token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0, // Expire immediately
      path: '/',
    });

    console.log('🚪 User logged out successfully');
    return response;
  } catch (error) {
    console.error('❌ Error during logout:', error);
    return NextResponse.json(
      { error: 'Failed to logout' },
      { status: 500 }
    );
  }
}
