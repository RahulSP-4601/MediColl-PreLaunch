import { NextRequest, NextResponse } from 'next/server';
import { justDialScraper } from '@/lib/scrapers/justdial';
import { googleMapsScraper } from '@/lib/scrapers/google-maps';
import { supabaseClient } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      source = 'justdial',
      city = 'Mumbai',
      type = 'clinic',
      limit = 100,
      enrichEmails = true,
      findSocial = true,
    } = body;

    // Validate inputs
    if (!['justdial', 'google_maps'].includes(source)) {
      return NextResponse.json(
        { error: 'Invalid source. Use "justdial" or "google_maps"' },
        { status: 400 }
      );
    }

    if (!['clinic', 'hospital'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid type. Use "clinic" or "hospital"' },
        { status: 400 }
      );
    }

    // Scrape leads
    let leads;
    if (source === 'justdial') {
      leads = await justDialScraper.scrape(city, type, limit, enrichEmails, findSocial);
    } else {
      leads = await googleMapsScraper.scrape(city, type, limit, enrichEmails, findSocial);
    }

    // Save to Supabase
    let savedCount = 0;
    let duplicateCount = 0;

    for (const lead of leads) {
      const exists = await supabaseClient.leadExists(lead.email, lead.phone);
      if (!exists) {
        const saved = await supabaseClient.insertLead(lead);
        if (saved) savedCount++;
      } else {
        duplicateCount++;
      }
    }

    return NextResponse.json({
      success: true,
      scraped: leads.length,
      saved: savedCount,
      duplicates: duplicateCount,
      source,
      city,
      type,
    });
  } catch (error) {
    console.error('Scraping error:', error);
    return NextResponse.json(
      { error: 'Failed to scrape leads' },
      { status: 500 }
    );
  }
}
