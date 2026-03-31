import { NextRequest, NextResponse } from 'next/server';
import { supabaseClient } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    console.log('📊 [API] Fetching campaign stats...');
    const stats = await supabaseClient.getCampaignStats();
    console.log('📊 [API] Stats result:', stats);

    if (stats) {
      console.log('✅ [API] Returning stats:', stats);
      return NextResponse.json(stats);
    } else {
      // Return empty stats if no data
      console.log('⚠️ [API] No stats found, returning zeros');
      return NextResponse.json({
        total_leads: 0,
        new_leads: 0,
        email_sent: 0,
        follow_up_sent: 0,
        waitlisted: 0,
        not_interested: 0,
        conversion_rate: 0,
      });
    }
  } catch (error) {
    console.error('❌ [API] Stats error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats', details: String(error) },
      { status: 500 }
    );
  }
}
