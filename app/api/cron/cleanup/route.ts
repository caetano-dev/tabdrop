import { NextRequest, NextResponse } from 'next/server';
import { deleteOldCollections } from '@/lib/supabaseClient';
import { getNumberOfMonthsToKeep } from '@/lib/utils';

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  
  if (process.env.CRON_SECRET) {
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
  }

  try {
    const numberOfMonths = getNumberOfMonthsToKeep();
    const deletedCount = await deleteOldCollections(numberOfMonths);
    
    console.log(`Cleanup completed: ${deletedCount} collections deleted`);
    
    return NextResponse.json({
      success: true,
      deletedCount,
      message: `Successfully deleted ${deletedCount} collections older than ${numberOfMonths} months`,
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