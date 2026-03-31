import { NextRequest, NextResponse } from 'next/server';
import { justDialScraper } from '@/lib/scrapers/justdial';
import { supabaseClient } from '@/lib/supabase';

/**
 * Manual scraping endpoint for founder dashboard
 * Supports scraping 1 lead for testing or multiple leads for production
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));

    // Get parameters from request or use defaults
    const {
      source = 'justdial',
      city = 'Mumbai',
      type = 'clinic',
      limit = 1,  // Default to 1 for testing
      enrichEmails = false,  // Skip by default (slow)
      findSocial = false,    // Skip by default (slow)
    } = body;

    console.log(`🔍 Starting manual scraping...`);
    console.log(`   Source: ${source}`);
    console.log(`   City: ${city}`);
    console.log(`   Type: ${type}`);
    console.log(`   Limit: ${limit}`);
    console.log(`   Enrich Emails: ${enrichEmails}`);
    console.log(`   Find Social: ${findSocial}`);

    let totalScraped = 0;
    let totalSaved = 0;
    let totalDuplicates = 0;

    try {
      // Only JustDial scraping (no Google Maps - too expensive)
      const leads = await justDialScraper.scrape(
        city,
        type,
        limit,
        enrichEmails,  // Read from request
        findSocial     // Read from request
      );

      totalScraped = leads.length;
      console.log(`📊 Scraped ${totalScraped} leads`);

      // Save to database (with duplicate check by email, phone, and name)
      for (const lead of leads) {
        const exists = await supabaseClient.leadExists(lead.email, lead.phone, lead.name);
        if (!exists) {
          const saved = await supabaseClient.insertLead(lead);
          if (saved) {
            totalSaved++;
            console.log(`✅ Saved: ${lead.name} (${lead.email || lead.phone || 'no contact'})`);
          }
        } else {
          totalDuplicates++;
          console.log(`⏭️  Duplicate: ${lead.name} (already in database)`);
        }
      }
    } catch (error) {
      console.error(`❌ Error scraping:`, error);
      throw error;
    }

    console.log(`\n✅ Manual scraping complete!`);
    console.log(`   Scraped: ${totalScraped}`);
    console.log(`   Saved: ${totalSaved}`);
    console.log(`   Duplicates: ${totalDuplicates}`);

    return NextResponse.json({
      success: true,
      scraped: totalScraped,
      saved: totalSaved,
      duplicates: totalDuplicates,
      city,
      type,
    });
  } catch (error) {
    console.error('❌ Manual scraping error:', error);
    return NextResponse.json(
      { error: 'Failed to scrape leads', details: String(error) },
      { status: 500 }
    );
  }
}
