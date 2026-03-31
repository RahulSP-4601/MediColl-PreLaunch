import { NextRequest, NextResponse } from 'next/server';
import { supabaseClient } from '@/lib/supabase';

/**
 * Webhook endpoint for QuickBook24 waitlist signups
 * This integrates with the main QuickBook24 product
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Mark lead as waitlisted
    const success = await supabaseClient.markAsWaitlisted(email);

    if (success) {
      console.log(`✅ Marked ${email} as waitlisted via webhook`);
      return NextResponse.json({
        success: true,
        message: `Marked ${email} as waitlisted`,
      });
    } else {
      console.log(`ℹ️  Lead ${email} not found in sales pipeline, but waitlist signup recorded`);
      return NextResponse.json({
        success: true,
        message: 'Waitlist signup recorded',
      });
    }
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Failed to process webhook' },
      { status: 500 }
    );
  }
}
