#!/usr/bin/env ts-node
/**
 * CLI script to show campaign statistics
 * Usage: npm run stats
 */

import 'dotenv/config';
import { supabaseClient } from '../lib/supabase';

async function main() {
  console.log(`\n📊 MediColl24-Sales Campaign Statistics`);
  console.log(`==================================================`);

  const stats = await supabaseClient.getCampaignStats();

  if (stats) {
    console.log(`Total Leads:          ${stats.total_leads}`);
    console.log(`  - New:              ${stats.new_leads}`);
    console.log(`  - Email Sent:       ${stats.email_sent}`);
    console.log(`  - Follow-up Sent:   ${stats.follow_up_sent}`);
    console.log(`  - Not Interested:   ${stats.not_interested}`);
    console.log(`  - Waitlisted:       ${stats.waitlisted} ✓✓✓`);
    console.log(``);
    console.log(`Conversion Rate:      ${stats.conversion_rate.toFixed(2)}%`);
  } else {
    console.log(`No statistics available`);
  }

  console.log(`==================================================\n`);
}

main().catch(console.error);
