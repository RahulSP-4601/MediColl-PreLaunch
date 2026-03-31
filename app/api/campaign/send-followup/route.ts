import { NextRequest, NextResponse } from 'next/server';
import { automationEngine } from '@/lib/automation';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { limit = 100, dryRun = false } = body;

    const sentCount = await automationEngine.sendFollowUpEmails(limit, dryRun);

    return NextResponse.json({
      success: true,
      sent: sentCount,
      limit,
      dryRun,
    });
  } catch (error) {
    console.error('Send follow-up error:', error);
    return NextResponse.json(
      { error: 'Failed to send follow-up emails' },
      { status: 500 }
    );
  }
}
