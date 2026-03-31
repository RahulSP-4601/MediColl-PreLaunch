#!/usr/bin/env ts-node
/**
 * CLI script to send follow-up emails
 * Usage: npm run send-followup
 */

import 'dotenv/config';
import { automationEngine } from '../lib/automation';

async function main() {
  const args = process.argv.slice(2);

  let limit = 100;
  let dryRun = false;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--limit' && args[i + 1]) limit = parseInt(args[i + 1]);
    if (args[i] === '--dry-run') dryRun = true;
  }

  console.log(`\n🚀 MediColl24-Sales - Send Follow-up Emails`);
  console.log(`==================================================`);
  console.log(`Limit: ${limit}`);
  console.log(`Dry Run: ${dryRun}`);
  console.log(`==================================================\n`);

  await automationEngine.sendFollowUpEmails(limit, dryRun);

  console.log(`\n✅ Done!\n`);
}

main().catch(console.error);
