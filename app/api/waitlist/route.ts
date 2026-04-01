import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

/**
 * GET: Fetch all waitlist signups (for founder dashboard)
 */
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('waitlist')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching waitlist:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch waitlist' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      leads: data || [],
      count: data?.length || 0,
    });
  } catch (error) {
    console.error('Exception fetching waitlist:', error);
    return NextResponse.json(
      { success: false, error: 'Server error' },
      { status: 500 }
    );
  }
}

/**
 * POST: Add to waitlist (from website signup form)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, country, state, clinicName, city } = body;

    if (!name || !email || !phone) {
      return NextResponse.json(
        { error: 'Name, email, and phone are required' },
        { status: 400 }
      );
    }

    // Check if already in waitlist
    const { data: existing } = await supabase
      .from('waitlist')
      .select('id')
      .eq('email', email)
      .limit(1);

    if (existing && existing.length > 0) {
      return NextResponse.json({
        success: true,
        message: 'You are already on the waitlist!',
        alreadyExists: true,
      });
    }

    // Add to waitlist table
    const { data, error } = await supabase
      .from('waitlist')
      .insert({
        name,
        email,
        phone,
        country,
        state,
        clinic_name: clinicName,
        city,
      })
      .select()
      .single();

    if (error) {
      console.error('[WAITLIST] Error:', error);
      return NextResponse.json(
        { error: 'Failed to add to waitlist' },
        { status: 500 }
      );
    }

    console.log('[WAITLIST] ✅ Added:', email);

    return NextResponse.json({
      success: true,
      message: 'Successfully joined the waitlist!',
      waitlist: data,
    });
  } catch (error) {
    console.error('Waitlist error:', error);
    return NextResponse.json(
      { error: 'Failed to process waitlist signup' },
      { status: 500 }
    );
  }
}
