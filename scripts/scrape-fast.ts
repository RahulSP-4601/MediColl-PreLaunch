#!/usr/bin/env ts-node

/**
 * Fast Multi-Source Scraping Script
 * Target: 10+ clients/hour
 *
 * Usage:
 * npm run scrape-fast -- --city Mumbai --type clinic --count 50
 * npm run scrape-fast -- --bulk  # Scrape multiple cities
 */

import { multiSourceScraper } from '../lib/scrapers/multi-source';
import { supabaseClient } from '../lib/supabase';

async function main() {
  const args = process.argv.slice(2);

  // Parse arguments
  const cityIndex = args.indexOf('--city');
  const typeIndex = args.indexOf('--type');
  const countIndex = args.indexOf('--count');
  const isBulk = args.includes('--bulk');

  if (isBulk) {
    // BULK MODE: Scrape multiple cities
    console.log('🔥 BULK SCRAPING MODE');
    console.log('Target: 100+ leads/hour\n');

    const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Pune', 'Hyderabad'];
    const type = typeIndex >= 0 ? args[typeIndex + 1] as 'clinic' | 'hospital' : 'clinic';

    const leads = await multiSourceScraper.scrapeBulk(cities, type, 10);

    // Save to database
    console.log('\n💾 Saving to database...');
    let saved = 0;
    for (const lead of leads) {
      const exists = await supabaseClient.leadExists(lead.email, lead.phone);
      if (!exists) {
        await supabaseClient.insertLead(lead);
        saved++;
      }
    }

    console.log(`✅ Saved ${saved} new leads to database`);

  } else {
    // NORMAL MODE: Single city, multiple sources
    const city = cityIndex >= 0 ? args[cityIndex + 1] : 'Mumbai';
    const type = typeIndex >= 0 ? args[typeIndex + 1] as 'clinic' | 'hospital' : 'clinic';
    const count = countIndex >= 0 ? parseInt(args[countIndex + 1]) : 20;

    console.log('🚀 MULTI-SOURCE SCRAPING');
    console.log(`City: ${city}`);
    console.log(`Type: ${type}`);
    console.log(`Target per source: ${count}\n`);

    const leads = await multiSourceScraper.scrapeParallel(city, type, count);

    // Save to database
    console.log('\n💾 Saving to database...');
    let saved = 0;
    for (const lead of leads) {
      const exists = await supabaseClient.leadExists(lead.email, lead.phone);
      if (!exists) {
        await supabaseClient.insertLead(lead);
        saved++;
      }
    }

    console.log(`✅ Saved ${saved} new leads to database`);
  }

  process.exit(0);
}

main().catch((error) => {
  console.error('Error:', error);
  process.exit(1);
});
