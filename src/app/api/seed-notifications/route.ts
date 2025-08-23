import { NextResponse } from 'next/server';
import { seedNotifications } from '@/lib/seed-notifications';

export async function POST() {
  try {
    const result = await seedNotifications();
    
    if (result.success) {
      return NextResponse.json({
        success: true,
        message: `Successfully created ${result.count} sample notifications`,
        count: result.count,
      });
    } else {
      return NextResponse.json({
        success: false,
        error: 'Failed to seed notifications',
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Error in seed notifications API:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
    }, { status: 500 });
  }
}
