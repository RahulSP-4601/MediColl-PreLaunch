import { createClient } from '@supabase/supabase-js';

// Supabase client - uses same credentials as QuickBook24 product
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Types
export interface Lead {
  id?: number;
  name: string;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  type?: string | null;
  specialty?: string | null;
  website?: string | null;
  source?: string | null;
  status?: string;
  instagram?: string | null;
  facebook?: string | null;
  linkedin_profile?: string | null;
  linkedin_company?: string | null;
  email_sent_at?: string | null;
  follow_up_sent_at?: string | null;
  waitlisted_at?: string | null;
  not_interested_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface CampaignStats {
  total_leads: number;
  new_leads: number;
  email_sent: number;
  follow_up_sent: number;
  waitlisted: number;
  not_interested: number;
  conversion_rate: number;
}

// Database operations
export class SupabaseClient {
  /**
   * Insert a new lead
   */
  async insertLead(leadData: Lead): Promise<Lead | null> {
    try {
      const { data, error } = await supabase
        .from('leads')
        .insert(leadData)
        .select()
        .single();

      if (error) {
        console.error('Error inserting lead:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Exception inserting lead:', error);
      return null;
    }
  }

  /**
   * Insert multiple leads
   */
  async insertLeads(leads: Lead[]): Promise<Lead[]> {
    try {
      const { data, error } = await supabase
        .from('leads')
        .insert(leads)
        .select();

      if (error) {
        console.error('Error inserting leads:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Exception inserting leads:', error);
      return [];
    }
  }

  /**
   * Get all leads (for founder dashboard)
   */
  async getAllLeads(limit: number = 1000): Promise<Lead[]> {
    try {
      console.log('🔍 [getAllLeads] Fetching all leads from database...');

      // Simplified query - remove ORDER BY to test
      const { data, error} = await supabase
        .from('leads')
        .select('*');

      if (error) {
        console.error('❌ [getAllLeads] Error:', error);
        console.error('❌ [getAllLeads] Error details:', JSON.stringify(error, null, 2));
        return [];
      }

      console.log(`✅ [getAllLeads] Retrieved ${data?.length || 0} leads from database`);
      console.log('📋 [getAllLeads] First 3 leads:', data?.slice(0, 3).map(l => ({
        id: l.id,
        name: l.name,
        status: l.status,
        created_at: l.created_at
      })));

      return data || [];
    } catch (error) {
      console.error('❌ [getAllLeads] Exception:', error);
      return [];
    }
  }

  /**
   * Get leads by status
   */
  async getLeadsByStatus(status: string, limit: number = 100): Promise<Lead[]> {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('status', status)
        .limit(limit);

      if (error) {
        console.error('Error fetching leads:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Exception fetching leads:', error);
      return [];
    }
  }

  /**
   * Get leads for follow-up (48 hours after initial email)
   */
  async getLeadsForFollowUp(limit: number = 100): Promise<Lead[]> {
    try {
      const fortyEightHoursAgo = new Date();
      fortyEightHoursAgo.setHours(fortyEightHoursAgo.getHours() - 48);

      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('status', 'email_sent')
        .lte('email_sent_at', fortyEightHoursAgo.toISOString())
        .limit(limit);

      if (error) {
        console.error('Error fetching follow-up leads:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Exception fetching follow-up leads:', error);
      return [];
    }
  }

  /**
   * Get leads to mark as not interested (48 hours after follow-up)
   */
  async getLeadsToMarkNotInterested(limit: number = 100): Promise<Lead[]> {
    try {
      const fortyEightHoursAgo = new Date();
      fortyEightHoursAgo.setHours(fortyEightHoursAgo.getHours() - 48);

      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('status', 'follow_up_sent')
        .lte('follow_up_sent_at', fortyEightHoursAgo.toISOString())
        .limit(limit);

      if (error) {
        console.error('Error fetching not interested leads:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Exception fetching not interested leads:', error);
      return [];
    }
  }

  /**
   * Update lead status
   */
  async updateLeadStatus(
    email: string,
    status: string,
    timestampField?: string
  ): Promise<boolean> {
    try {
      const updateData: any = { status };

      if (timestampField) {
        updateData[timestampField] = new Date().toISOString();
      }

      const { error } = await supabase
        .from('leads')
        .update(updateData)
        .eq('email', email);

      if (error) {
        console.error('Error updating lead status:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Exception updating lead status:', error);
      return false;
    }
  }

  /**
   * Mark lead as waitlisted
   */
  async markAsWaitlisted(email: string): Promise<boolean> {
    return this.updateLeadStatus(email, 'waitlisted', 'waitlisted_at');
  }

  /**
   * Mark lead as not interested
   */
  async markAsNotInterested(email: string): Promise<boolean> {
    return this.updateLeadStatus(email, 'not_interested', 'not_interested_at');
  }

  /**
   * Get campaign statistics (counts from BOTH leads and waitlist tables)
   */
  async getCampaignStats(): Promise<CampaignStats | null> {
    try {
      console.log('🔍 [Supabase] Getting campaign stats (direct count)...');

      // ALWAYS use manual count (bypass potentially stale view)
      return await this.getManualCampaignStats();
    } catch (error) {
      console.error('❌ [Supabase] Exception fetching campaign stats:', error);
      return {
        total_leads: 0,
        new_leads: 0,
        email_sent: 0,
        follow_up_sent: 0,
        waitlisted: 0,
        not_interested: 0,
        conversion_rate: 0,
      };
    }
  }

  /**
   * Manually calculate campaign stats (fallback)
   */
  private async getManualCampaignStats(): Promise<CampaignStats> {
    try {
      // Get ALL stats using deduplicated methods
      const allLeads = await this.getAllLeads(1000);
      const waitlistedLeads = await this.getWaitlistedLeads(1000);

      // Count by status from actual leads (not database counts)
      const totalLeads = allLeads.length;
      const newLeads = allLeads.filter(l => l.status === 'new').length;
      const emailSent = allLeads.filter(l => l.status === 'email_sent').length;
      const followUpSent = allLeads.filter(l => l.status === 'follow_up_sent').length;
      const notInterested = allLeads.filter(l => l.status === 'not_interested').length;
      const totalWaitlisted = waitlistedLeads.length; // Deduplicated count

      const conversionRate = totalLeads > 0
        ? Number(((totalWaitlisted / totalLeads) * 100).toFixed(2))
        : 0;

      console.log('📊 [Stats Calculation]:', {
        totalLeads,
        newLeads,
        emailSent,
        followUpSent,
        totalWaitlisted,
        notInterested,
      });

      return {
        total_leads: totalLeads,
        new_leads: newLeads,
        email_sent: emailSent,
        follow_up_sent: followUpSent,
        waitlisted: totalWaitlisted, // This is now deduplicated!
        not_interested: notInterested,
        conversion_rate: conversionRate,
      };
    } catch (error) {
      console.error('❌ Error in manual stats calculation:', error);
      return {
        total_leads: 0,
        new_leads: 0,
        email_sent: 0,
        follow_up_sent: 0,
        waitlisted: 0,
        not_interested: 0,
        conversion_rate: 0,
      };
    }
  }

  /**
   * Check if lead already exists (by email, phone, or name)
   */
  async leadExists(email?: string, phone?: string, name?: string): Promise<boolean> {
    try {
      // Check by email first (most reliable)
      if (email) {
        const { data } = await supabase
          .from('leads')
          .select('id')
          .eq('email', email)
          .limit(1);
        if (data && data.length > 0) return true;
      }

      // Check by phone (reliable)
      if (phone) {
        const { data } = await supabase
          .from('leads')
          .select('id')
          .eq('phone', phone)
          .limit(1);
        if (data && data.length > 0) return true;
      }

      // Check by name (fallback - prevents scraping same clinic twice)
      if (name) {
        const { data } = await supabase
          .from('leads')
          .select('id')
          .ilike('name', name) // Case-insensitive match
          .limit(1);
        if (data && data.length > 0) return true;
      }

      return false;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get all waitlisted leads from BOTH leads table AND waitlist table
   */
  async getWaitlistedLeads(limit: number = 1000): Promise<Lead[]> {
    try {
      console.log('🔍 [Supabase] Querying waitlisted leads from BOTH tables...');

      // Method 1: Get from leads table (scraped leads who converted)
      const { data: leadsData, error: leadsError } = await supabase
        .from('leads')
        .select('*')
        .eq('status', 'waitlisted')
        .order('waitlisted_at', { ascending: false, nullsFirst: false })
        .limit(limit);

      if (leadsError) {
        console.error('❌ [Supabase] Error fetching from leads table:', leadsError);
      }

      console.log('✅ [Supabase] Waitlisted from LEADS table:', leadsData?.length || 0);

      // Method 2: Get from waitlist table (direct signups)
      const { data: waitlistData, error: waitlistError } = await supabase
        .from('waitlist')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (waitlistError) {
        console.error('⚠️ [Supabase] Error fetching from waitlist table:', waitlistError);
        console.log('ℹ️ [Supabase] Waitlist table might not exist or has different schema');
      }

      console.log('✅ [Supabase] Waitlisted from WAITLIST table:', waitlistData?.length || 0);

      // Combine both sources and deduplicate by email
      const combined: Lead[] = [];
      const emailsSeen = new Set<string>();

      // Add leads from leads table
      if (leadsData) {
        for (const lead of leadsData) {
          if (lead.email && !emailsSeen.has(lead.email)) {
            combined.push(lead);
            emailsSeen.add(lead.email);
          }
        }
      }

      // Add from waitlist table (convert format if needed)
      if (waitlistData) {
        for (const item of waitlistData) {
          const email = (item as any).email;
          if (email && !emailsSeen.has(email)) {
            // Convert waitlist format to Lead format
            combined.push({
              id: (item as any).id,
              name: (item as any).name || (item as any).clinic_name || 'Unknown',
              email: email,
              phone: (item as any).phone || null,
              city: (item as any).city || null,
              status: 'waitlisted',
              created_at: (item as any).created_at,
              waitlisted_at: (item as any).created_at, // Use created_at as waitlisted_at
            } as Lead);
            emailsSeen.add(email);
          }
        }
      }

      console.log('✅ [Supabase] TOTAL waitlisted (combined, deduplicated):', combined.length);
      return combined;
    } catch (error) {
      console.error('❌ [Supabase] Exception fetching waitlisted leads:', error);
      return [];
    }
  }
}

// Export singleton instance
export const supabaseClient = new SupabaseClient();
