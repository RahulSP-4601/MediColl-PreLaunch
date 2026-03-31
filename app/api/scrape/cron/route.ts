import { NextRequest, NextResponse } from 'next/server';
import { justDialScraper } from '@/lib/scrapers/justdial';
import { supabaseClient } from '@/lib/supabase';
import { getRandomCities, getCitiesByTier } from '@/lib/cities';

/**
 * Automated cron scraping endpoint
 * Runs daily at 2 AM to scrape new leads across India
 * Only scrapes leads that don't already exist in database
 */
export async function GET(request: NextRequest) {
  try {
    // Verify Vercel Cron secret
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      console.error('❌ Unauthorized cron request');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log('🔍 [CRON] Starting automated scraping...');
    console.log(`🕐 Started at: ${new Date().toISOString()}`);

    // TESTING MODE: Scrape 10 leads total (5 clinics + 5 hospitals from 1 city)
    // For production: Change to getRandomCities(15) and increase limits
    const citiesToScrape = getRandomCities(1); // Just 1 city for testing
    const types: ('clinic' | 'hospital')[] = ['clinic', 'hospital'];

    let totalScraped = 0;
    let totalSaved = 0;
    let totalDuplicates = 0;

    for (const city of citiesToScrape) {
      for (const type of types) {
        console.log(`\n📍 [CRON] Scraping ${type}s in ${city}...`);

        try {
          // TESTING MODE: Scrape only 5 leads per type (5 clinics + 5 hospitals = 10 total)
          // For production: Change limit to 30 or higher
          const leads = await justDialScraper.scrape(
            city,
            type,
            5, // ← TESTING: Only 5 leads per type
            true, // enrichEmails
            true  // findSocial
          );

          totalScraped += leads.length;

          // Save to database with duplicate prevention
          for (const lead of leads) {
            // Check if lead already exists (by email or phone)
            const exists = await supabaseClient.leadExists(lead.email, lead.phone);

            if (!exists) {
              const saved = await supabaseClient.insertLead(lead);
              if (saved) {
                totalSaved++;
                console.log(`✅ [CRON] Saved new lead: ${lead.name}`);
              }
            } else {
              totalDuplicates++;
              console.log(`⏭️  [CRON] Skipped duplicate: ${lead.name}`);
            }
          }

          // Small delay between scrapes to avoid rate limiting
          await new Promise(resolve => setTimeout(resolve, 2000));
        } catch (error) {
          console.error(`❌ [CRON] Error scraping ${type}s in ${city}:`, error);
          // Continue with next city even if one fails
        }
      }
    }

    console.log(`\n✅ [CRON] Automated scraping complete!`);
    console.log(`🕐 Finished at: ${new Date().toISOString()}`);
    console.log(`📊 Stats:`);
    console.log(`   - Total scraped: ${totalScraped}`);
    console.log(`   - New leads saved: ${totalSaved}`);
    console.log(`   - Duplicates skipped: ${totalDuplicates}`);
    console.log(`   - Cities covered: ${citiesToScrape.join(', ')}`);

    return NextResponse.json({
      success: true,
      scraped: totalScraped,
      saved: totalSaved,
      duplicates: totalDuplicates,
      cities: citiesToScrape,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('❌ [CRON] Scraping error:', error);
    return NextResponse.json(
      { error: 'Failed to scrape leads', details: String(error) },
      { status: 500 }
    );
  }
}
