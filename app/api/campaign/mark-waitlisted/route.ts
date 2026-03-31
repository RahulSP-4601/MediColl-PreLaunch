import { NextRequest, NextResponse } from 'next/server';
import { supabaseClient } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const success = await supabaseClient.markAsWaitlisted(email);

    if (success) {
      return NextResponse.json({
        success: true,
        message: `Marked ${email} as waitlisted`,
      });
    } else {
      return NextResponse.json(
        { error: 'Failed to update lead' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Mark waitlisted error:', error);
    return NextResponse.json(
      { error: 'Failed to mark as waitlisted' },
      { status: 500 }
    );
  }
}
