import { NextRequest, NextResponse } from 'next/server';
import { automationEngine } from '@/lib/automation';

// Protect cron route with secret
export async function POST(request: NextRequest) {
  try {
    // Verify cron secret
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      initialLimit = 100,
      followupLimit = 50,
      markNotInterested = true,
      dryRun = false,
    } = body;

    await automationEngine.runCompleteCampaign(
      initialLimit,
      followupLimit,
      markNotInterested,
      dryRun
    );

    return NextResponse.json({
      success: true,
      message: 'Campaign cycle completed',
    });
  } catch (error) {
    console.error('Campaign run error:', error);
    return NextResponse.json(
      { error: 'Failed to run campaign' },
      { status: 500 }
    );
  }
}

// For Vercel Cron
export async function GET(request: NextRequest) {
  // Verify Vercel Cron secret
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    // TESTING MODE: Send to only 10 leads (10 initial + 10 follow-ups)
    // For production: Change to (100, 50, true, false)
    await automationEngine.runCompleteCampaign(10, 10, true, false);

    return NextResponse.json({
      success: true,
      message: 'Campaign cycle completed',
    });
  } catch (error) {
    console.error('Campaign run error:', error);
    return NextResponse.json(
      { error: 'Failed to run campaign' },
      { status: 500 }
    );
  }
}
