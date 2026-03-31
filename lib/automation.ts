import { supabaseClient, Lead } from './supabase';
import { emailSender } from './email';
import { whatsappSender } from './whatsapp';

export class AutomationEngine {
  private followUpDelayHours: number = 48; // 48 hours for follow-up
  private notInterestedDelayHours: number = 48; // 48 hours after follow-up

  /**
   * Send initial emails to new leads
   */
  async sendInitialEmails(limit: number = 100, dryRun: boolean = false): Promise<number> {
    console.log(`\n📧 Sending initial emails (limit: ${limit}, dry run: ${dryRun})...`);

    const leads = await supabaseClient.getLeadsByStatus('new', limit);
    console.log(`Found ${leads.length} new leads with email`);

    let sentCount = 0;

    for (const lead of leads) {
      if (!lead.email) continue;

      try {
        if (!dryRun) {
          const success = await emailSender.sendInitialEmail(lead.email, {
            name: lead.name,
            clinicName: lead.name,
            city: lead.city || undefined,
          });

          if (success) {
            // Update status
            await supabaseClient.updateLeadStatus(
              lead.email,
              'email_sent',
              'email_sent_at'
            );
            sentCount++;
          }
        } else {
          console.log(`[DRY RUN] Would send to: ${lead.email}`);
          sentCount++;
        }
      } catch (error) {
        console.error(`Error sending email to ${lead.email}:`, error);
      }
    }

    console.log(`✅ Sent ${sentCount} initial emails`);
    return sentCount;
  }

  /**
   * Send initial WhatsApp messages to new leads
   */
  async sendInitialWhatsApp(limit: number = 100, dryRun: boolean = false): Promise<number> {
    console.log(`\n💬 Sending initial WhatsApp messages (limit: ${limit}, dry run: ${dryRun})...`);

    const leads = await supabaseClient.getLeadsByStatus('new', limit);
    console.log(`Found ${leads.length} new leads`);

    let sentCount = 0;

    for (const lead of leads) {
      if (!lead.phone) continue;

      try {
        if (!dryRun) {
          const success = await whatsappSender.sendInitialMessage(lead.phone, {
            name: lead.name,
            clinicName: lead.name,
          });

          if (success) {
            // Update status (use phone instead of email for lookup)
            if (lead.email) {
              await supabaseClient.updateLeadStatus(
                lead.email,
                'whatsapp_sent',
                'email_sent_at' // Reuse this field for tracking
              );
            }
            sentCount++;
          }
        } else {
          console.log(`[DRY RUN] Would send WhatsApp to: ${lead.phone}`);
          sentCount++;
        }
      } catch (error) {
        console.error(`Error sending WhatsApp to ${lead.phone}:`, error);
      }
    }

    console.log(`✅ Sent ${sentCount} WhatsApp messages`);
    return sentCount;
  }

  /**
   * Send follow-up emails (48 hours after initial)
   */
  async sendFollowUpEmails(limit: number = 100, dryRun: boolean = false): Promise<number> {
    console.log(`\n📧 Sending follow-up emails (limit: ${limit}, dry run: ${dryRun})...`);

    const leads = await supabaseClient.getLeadsForFollowUp(limit);
    console.log(`Found ${leads.length} leads ready for follow-up (48+ hours since initial)`);

    let sentCount = 0;

    for (const lead of leads) {
      if (!lead.email) continue;

      try {
        if (!dryRun) {
          const success = await emailSender.sendFollowUpEmail(lead.email, {
            name: lead.name,
            clinicName: lead.name,
          });

          if (success) {
            // Update status
            await supabaseClient.updateLeadStatus(
              lead.email,
              'follow_up_sent',
              'follow_up_sent_at'
            );
            sentCount++;
          }
        } else {
          console.log(`[DRY RUN] Would send follow-up to: ${lead.email}`);
          sentCount++;
        }
      } catch (error) {
        console.error(`Error sending follow-up to ${lead.email}:`, error);
      }
    }

    console.log(`✅ Sent ${sentCount} follow-up emails`);
    return sentCount;
  }

  /**
   * Send follow-up WhatsApp messages (48 hours after initial)
   */
  async sendFollowUpWhatsApp(limit: number = 100, dryRun: boolean = false): Promise<number> {
    console.log(`\n💬 Sending follow-up WhatsApp (limit: ${limit}, dry run: ${dryRun})...`);

    const leads = await supabaseClient.getLeadsForFollowUp(limit);
    console.log(`Found ${leads.length} leads ready for follow-up`);

    let sentCount = 0;

    for (const lead of leads) {
      if (!lead.phone) continue;

      try {
        if (!dryRun) {
          const success = await whatsappSender.sendFollowUpMessage(lead.phone, {
            name: lead.name,
          });

          if (success) {
            // Update status
            if (lead.email) {
              await supabaseClient.updateLeadStatus(
                lead.email,
                'follow_up_sent',
                'follow_up_sent_at'
              );
            }
            sentCount++;
          }
        } else {
          console.log(`[DRY RUN] Would send WhatsApp follow-up to: ${lead.phone}`);
          sentCount++;
        }
      } catch (error) {
        console.error(`Error sending WhatsApp follow-up to ${lead.phone}:`, error);
      }
    }

    console.log(`✅ Sent ${sentCount} WhatsApp follow-ups`);
    return sentCount;
  }

  /**
   * Mark leads as not interested (48 hours after follow-up)
   * NOTE: Waitlist link stays active!
   */
  async markAsNotInterested(limit: number = 100, dryRun: boolean = false): Promise<number> {
    console.log(`\n🔄 Marking leads as not interested (limit: ${limit}, dry run: ${dryRun})...`);

    const leads = await supabaseClient.getLeadsToMarkNotInterested(limit);
    console.log(`Found ${leads.length} leads to mark as not interested (48+ hours since follow-up)`);

    let markedCount = 0;

    for (const lead of leads) {
      if (!lead.email) continue;

      try {
        if (!dryRun) {
          const success = await supabaseClient.markAsNotInterested(lead.email);
          if (success) {
            markedCount++;
          }
        } else {
          console.log(`[DRY RUN] Would mark as not interested: ${lead.email}`);
          markedCount++;
        }
      } catch (error) {
        console.error(`Error marking ${lead.email} as not interested:`, error);
      }
    }

    console.log(`✅ Marked ${markedCount} leads as not interested`);
    console.log(`📌 Note: Waitlist link stays active for all leads!`);
    return markedCount;
  }

  /**
   * Run complete campaign cycle
   */
  async runCompleteCampaign(
    initialLimit: number = 100,
    followupLimit: number = 50,
    markNotInterested: boolean = true,
    dryRun: boolean = false
  ): Promise<void> {
    console.log(`\n🚀 Running complete campaign cycle...`);
    console.log(`Initial limit: ${initialLimit}`);
    console.log(`Follow-up limit: ${followupLimit}`);
    console.log(`Mark not interested: ${markNotInterested}`);
    console.log(`Dry run: ${dryRun}\n`);

    // Step 1: Send initial emails
    const initialEmailsSent = await this.sendInitialEmails(initialLimit, dryRun);

    // Step 2: Send initial WhatsApp (if enabled)
    if (process.env.ENABLE_WHATSAPP === 'true') {
      await this.sendInitialWhatsApp(initialLimit, dryRun);
    }

    // Step 3: Send follow-ups
    const followupsSent = await this.sendFollowUpEmails(followupLimit, dryRun);

    // Step 4: Send WhatsApp follow-ups (if enabled)
    if (process.env.ENABLE_WHATSAPP === 'true') {
      await this.sendFollowUpWhatsApp(followupLimit, dryRun);
    }

    // Step 5: Mark non-responders as not interested (if enabled)
    if (markNotInterested) {
      await this.markAsNotInterested(100, dryRun);
    }

    // Step 6: Show stats
    const stats = await supabaseClient.getCampaignStats();
    if (stats) {
      console.log(`\n📊 Campaign Statistics:`);
      console.log(`==================================================`);
      console.log(`Total Leads:          ${stats.total_leads}`);
      console.log(`  - New:              ${stats.new_leads}`);
      console.log(`  - Email Sent:       ${stats.email_sent}`);
      console.log(`  - Follow-up Sent:   ${stats.follow_up_sent}`);
      console.log(`  - Waitlisted:       ${stats.waitlisted} ✓✓✓`);
      console.log(`  - Not Interested:   ${stats.not_interested}`);
      console.log(`Conversion Rate:      ${stats.conversion_rate.toFixed(2)}%`);
      console.log(`==================================================\n`);
    }

    console.log(`✅ Campaign cycle complete!`);
  }
}

// Export singleton instance
export const automationEngine = new AutomationEngine();
