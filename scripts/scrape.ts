#!/usr/bin/env ts-node
/**
 * CLI script to scrape leads
 * Usage: npm run scrape
 */

import 'dotenv/config';
import { justDialScraper } from '../lib/scrapers/justdial';
import { googleMapsScraper } from '../lib/scrapers/google-maps';
import { supabaseClient } from '../lib/supabase';

async function main() {
  const args = process.argv.slice(2);

  // Parse arguments
  let source = 'justdial';
  let city = 'Mumbai';
  let type: 'clinic' | 'hospital' = 'clinic';
  let limit = 100;
  let enrichEmails = true;
  let findSocial = true;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--source' && args[i + 1]) source = args[i + 1];
    if (args[i] === '--city' && args[i + 1]) city = args[i + 1];
    if (args[i] === '--type' && args[i + 1]) type = args[i + 1] as 'clinic' | 'hospital';
    if (args[i] === '--limit' && args[i + 1]) limit = parseInt(args[i + 1]);
    if (args[i] === '--no-enrich-emails') enrichEmails = false;
    if (args[i] === '--no-find-social') findSocial = false;
  }

  console.log(`\n🚀 MediColl24-Sales Scraper`);
  console.log(`==================================================`);
  console.log(`Source: ${source}`);
  console.log(`City: ${city}`);
  console.log(`Type: ${type}`);
  console.log(`Limit: ${limit}`);
  console.log(`Enrich Emails: ${enrichEmails}`);
  console.log(`Find Social: ${findSocial}`);
  console.log(`==================================================\n`);

  // Scrape leads
  let leads;
  if (source === 'google_maps') {
    if (!googleMapsScraper.isConfigured()) {
      console.error('❌ Google Maps API key not configured');
      process.exit(1);
    }
    leads = await googleMapsScraper.scrape(city, type, limit, enrichEmails, findSocial);
  } else {
    leads = await justDialScraper.scrape(city, type, limit, enrichEmails, findSocial);
  }

  // Save to Supabase
  console.log(`\n💾 Saving to Supabase...`);
  let savedCount = 0;
  let duplicateCount = 0;

  for (const lead of leads) {
    const exists = await supabaseClient.leadExists(lead.email, lead.phone);
    if (!exists) {
      const saved = await supabaseClient.insertLead(lead);
      if (saved) {
        savedCount++;
        console.log(`✅ Saved: ${lead.name}`);
      }
    } else {
      duplicateCount++;
      console.log(`⚠️  Duplicate: ${lead.name}`);
    }
  }

  console.log(`\n✅ Scraping complete!`);
  console.log(`==================================================`);
  console.log(`Scraped: ${leads.length}`);
  console.log(`Saved: ${savedCount}`);
  console.log(`Duplicates: ${duplicateCount}`);
  console.log(`==================================================\n`);
}

main().catch(console.error);
