#!/usr/bin/env ts-node
/**
 * CLI script to run complete campaign
 * Usage: npm run run-campaign
 */

import 'dotenv/config';
import { automationEngine } from '../lib/automation';

async function main() {
  const args = process.argv.slice(2);

  let initialLimit = 100;
  let followupLimit = 50;
  let markNotInterested = true;
  let dryRun = false;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--initial' && args[i + 1]) initialLimit = parseInt(args[i + 1]);
    if (args[i] === '--followup' && args[i + 1]) followupLimit = parseInt(args[i + 1]);
    if (args[i] === '--no-mark-not-interested') markNotInterested = false;
    if (args[i] === '--dry-run') dryRun = true;
  }

  console.log(`\n🚀 MediColl24-Sales - Complete Campaign`);
  console.log(`==================================================`);
  console.log(`Initial Limit: ${initialLimit}`);
  console.log(`Follow-up Limit: ${followupLimit}`);
  console.log(`Mark Not Interested: ${markNotInterested}`);
  console.log(`Dry Run: ${dryRun}`);
  console.log(`==================================================\n`);

  await automationEngine.runCompleteCampaign(
    initialLimit,
    followupLimit,
    markNotInterested,
    dryRun
  );

  console.log(`\n✅ Campaign complete!\n`);
}

main().catch(console.error);
