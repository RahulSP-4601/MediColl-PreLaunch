import { NextRequest, NextResponse } from 'next/server';
import { supabaseClient } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    console.log('👥 [API] Fetching waitlisted leads...');
    const leads = await supabaseClient.getWaitlistedLeads();
    console.log('👥 [API] Found leads:', leads.length);
    console.log('👥 [API] Leads data:', leads);

    return NextResponse.json({
      success: true,
      leads,
      count: leads.length,
    });
  } catch (error) {
    console.error('❌ [API] Error fetching waitlisted leads:', error);
    return NextResponse.json(
      { error: 'Failed to fetch waitlisted leads', details: String(error) },
      { status: 500 }
    );
  }
}
