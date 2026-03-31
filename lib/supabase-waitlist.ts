import { supabase } from './supabase';

/**
 * Waitlist-specific database operations
 * Separate from leads table for better organization
 */

export interface WaitlistEntry {
  id?: number;
  name: string;
  email: string;
  phone: string;
  clinic_name?: string;
  city?: string;
  source?: string;
  referral_code?: string;
  status?: string;
  priority?: number;
  notes?: string;
  metadata?: any;
  joined_at?: string;
  created_at?: string;
  updated_at?: string;
}

export class WaitlistClient {
  /**
   * Check if email already exists in waitlist
   */
  async exists(email: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('waitlist')
        .select('id')
        .eq('email', email)
        .limit(1);

      if (error) {
        console.error('Error checking waitlist existence:', error);
        return false;
      }

      return (data && data.length > 0) || false;
    } catch (error) {
      console.error('Exception checking waitlist:', error);
      return false;
    }
  }

  /**
   * Add new entry to waitlist
   */
  async add(entry: WaitlistEntry): Promise<WaitlistEntry | null> {
    try {
      const { data, error } = await supabase
        .from('waitlist')
        .insert(entry)
        .select()
        .single();

      if (error) {
        console.error('Error adding to waitlist:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Exception adding to waitlist:', error);
      return null;
    }
  }

  /**
   * Update waitlist entry status
   */
  async updateStatus(email: string, status: string): Promise<boolean> {
    try {
      const updateData: any = { status };

      // Add timestamp based on status
      if (status === 'invited') {
        updateData.invited_at = new Date().toISOString();
      } else if (status === 'converted') {
        updateData.converted_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('waitlist')
        .update(updateData)
        .eq('email', email);

      if (error) {
        console.error('Error updating waitlist status:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Exception updating waitlist status:', error);
      return false;
    }
  }

  /**
   * Get waitlist stats
   */
  async getStats(): Promise<any> {
    try {
      const { data, error } = await supabase
        .from('waitlist_stats')
        .select('*')
        .single();

      if (error) {
        console.error('Error fetching waitlist stats:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Exception fetching waitlist stats:', error);
      return null;
    }
  }

  /**
   * Get all waitlist entries with pagination
   */
  async getAll(limit: number = 100, offset: number = 0): Promise<WaitlistEntry[]> {
    try {
      const { data, error } = await supabase
        .from('waitlist')
        .select('*')
        .order('joined_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) {
        console.error('Error fetching waitlist:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Exception fetching waitlist:', error);
      return [];
    }
  }
}

// Export singleton instance
export const waitlistClient = new WaitlistClient();
