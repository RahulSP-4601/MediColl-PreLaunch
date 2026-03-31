import { NextRequest, NextResponse } from 'next/server';
import { automationEngine } from '@/lib/automation';

/**
 * Manual campaign endpoint for founder dashboard
 * Sends emails and follow-ups manually for testing
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      initialLimit = 100,
      followupLimit = 50,
      markNotInterested = true,
      dryRun = false,
    } = body;

    console.log('📧 Starting manual campaign...');
    console.log(`Initial limit: ${initialLimit}`);
    console.log(`Follow-up limit: ${followupLimit}`);
    console.log(`Mark not interested: ${markNotInterested}`);
    console.log(`Dry run: ${dryRun}`);

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
    console.error('Manual campaign error:', error);
    return NextResponse.json(
      { error: 'Failed to run campaign', details: String(error) },
      { status: 500 }
    );
  }
}
