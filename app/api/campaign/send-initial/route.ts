import { NextRequest, NextResponse } from 'next/server';
import { automationEngine } from '@/lib/automation';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { limit = 100, dryRun = false } = body;

    const sentCount = await automationEngine.sendInitialEmails(limit, dryRun);

    return NextResponse.json({
      success: true,
      sent: sentCount,
      limit,
      dryRun,
    });
  } catch (error) {
    console.error('Send initial error:', error);
    return NextResponse.json(
      { error: 'Failed to send initial emails' },
      { status: 500 }
    );
  }
}
