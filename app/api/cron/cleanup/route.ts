import { NextRequest, NextResponse } from 'next/server';
import { deleteOldCollections } from '@/lib/supabaseClient';

export async function GET(request: NextRequest) {
  // Verify the request is from Vercel Cron
  const authHeader = request.headers.get('authorization');
  
  // Check if CRON_SECRET is set and matches
  if (process.env.CRON_SECRET) {
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
  }

  try {
    const deletedCount = await deleteOldCollections(2);
    
    console.log(`Cleanup completed: ${deletedCount} collections deleted`);
    
    return NextResponse.json({
      success: true,
      deletedCount,
      message: `Successfully deleted ${deletedCount} collections older than 2 months`,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Cleanup failed:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}