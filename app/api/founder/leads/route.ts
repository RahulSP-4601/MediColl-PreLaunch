import { NextResponse } from 'next/server';
import { supabaseClient } from '@/lib/supabase';

/**
 * Get all scraped leads for founder dashboard
 */
export async function GET() {
  try {
    const leads = await supabaseClient.getAllLeads();

    return NextResponse.json({
      success: true,
      leads,
      count: leads.length,
    });
  } catch (error) {
    console.error('Error fetching leads:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leads' },
      { status: 500 }
    );
  }
}
