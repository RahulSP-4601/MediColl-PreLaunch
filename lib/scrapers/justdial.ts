import axios from 'axios';
import * as cheerio from 'cheerio';
import { Lead } from '../supabase';
import { emailExtractor } from './email-extractor';
import { socialMediaFinder } from './social-media';

export class JustDialScraper {
  private userAgent: string;
  private baseUrl: string = 'https://www.justdial.com';

  constructor() {
    this.userAgent =
      process.env.USER_AGENT ||
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';
  }

  /**
   * Scrape clinics/hospitals from JustDial
   */
  async scrape(
    city: string,
    type: 'clinic' | 'hospital',
    limit: number = 100,
    enrichEmails: boolean = true,
    findSocial: boolean = true
  ): Promise<Lead[]> {
    console.log(`\n🔍 Scraping ${type}s in ${city} from JustDial...`);

    const leads: Lead[] = [];
    const seenNames = new Set<string>(); // Prevent duplicates by name
    const searchQuery = type === 'clinic' ? 'Clinics' : 'Hospitals';
    const searchUrl = `${this.baseUrl}/${city}/${searchQuery}`;

    try {
      const response = await axios.get(searchUrl, {
        headers: { 'User-Agent': this.userAgent },
        timeout: 15000,
      });

      const $ = cheerio.load(response.data);

      // JustDial listings - adjust selectors based on actual HTML structure
      const listings = $('.resultbox, .store-details, .jcn, li[class*="resultbox"]').slice(0, limit * 2); // Get more listings to filter

      console.log(`Found ${listings.length} listings`);

      for (let i = 0; i < listings.length && leads.length < limit; i++) {
        try {
          const listing = listings.eq(i);

          // Extract basic info
          const name = this.extractName($, listing);
          if (!name) continue;

          // Skip duplicates by name
          const normalizedName = name.toLowerCase().trim();
          if (seenNames.has(normalizedName)) {
            console.log(`⏭️  Skipped duplicate: ${name}`);
            continue;
          }
          seenNames.add(normalizedName);

          const phone = this.extractPhone($, listing);
          const address = this.extractAddress($, listing);
          const website = this.extractWebsite($, listing);

          // Create base lead
          const lead: Lead = {
            name,
            phone,
            address,
            city,
            type,
            source: 'justdial',
            status: 'new',
          };

          // Enrich with email if website exists
          if (enrichEmails && website) {
            lead.website = website;
            console.log(`  Extracting email from ${website}...`);
            const email = await emailExtractor.getBestEmail(website);
            if (email) {
              lead.email = email;
              console.log(`    ✅ Found email: ${email}`);
            }
            await this.delay(2000);
          }

          // Find social media if enabled
          if (findSocial) {
            console.log(`  Finding social media for ${name}...`);
            const socialMedia = await socialMediaFinder.findSocialMedia(
              website,
              name,
              city
            );
            if (socialMedia.instagram) {
              lead.instagram = socialMedia.instagram;
              console.log(`    ✅ Found Instagram: ${socialMedia.instagram}`);
            }
            if (socialMedia.facebook) {
              lead.facebook = socialMedia.facebook;
              console.log(`    ✅ Found Facebook: ${socialMedia.facebook}`);
            }
            await this.delay(2000);
          }

          // Only save if has email OR phone (must be able to contact them)
          if (lead.email || lead.phone) {
            leads.push(lead);
            console.log(`✅ Saved: ${name} (Email: ${lead.email || '❌'}, Phone: ${lead.phone || '❌'}) - ${leads.length}/${limit}`);
          } else {
            console.log(`⏭️  Skipped: ${name} (no email or phone - can't contact)`);
          }

          await this.delay(1000);
        } catch (error) {
          console.error(`Error processing listing:`, error);
          continue;
        }
      }

      console.log(`\n✅ Scraped ${leads.length} leads from JustDial`);
      return leads;
    } catch (error) {
      console.error(`Error scraping JustDial:`, error);
      return leads;
    }
  }

  /**
   * Extract business name
   */
  private extractName($: cheerio.CheerioAPI, listing: cheerio.Cheerio): string | null {
    const selectors = [
      '.jcn a',
      '.resultbox_title_anchor',
      '.store-name',
      'h2 a',
      '.heading a',
    ];

    for (const selector of selectors) {
      const name = listing.find(selector).first().text().trim();
      if (name) return name;
    }

    return null;
  }

  /**
   * Extract phone number
   */
  private extractPhone($: cheerio.CheerioAPI, listing: cheerio.Cheerio): string | null {
    const selectors = [
      '.contact-info',
      '.phone',
      'p.contact-info',
      'a[href^="tel:"]',
    ];

    for (const selector of selectors) {
      const element = listing.find(selector).first();
      let phone = element.text().trim();

      // Also check href attribute for tel: links
      if (!phone) {
        const href = element.attr('href');
        if (href && href.startsWith('tel:')) {
          phone = href.replace('tel:', '');
        }
      }

      if (phone) {
        // Clean phone number
        phone = phone.replace(/[^0-9+\-]/g, '');
        if (phone.length >= 10) {
          // Ensure it starts with +91 for India
          if (!phone.startsWith('+')) {
            phone = '+91-' + phone.replace(/^0+/, '');
          }
          return phone;
        }
      }
    }

    return null;
  }

  /**
   * Extract address
   */
  private extractAddress($: cheerio.CheerioAPI, listing: cheerio.Cheerio): string | null {
    const selectors = [
      '.address',
      '.resultbox_address',
      '.store-address',
      'p.address',
    ];

    for (const selector of selectors) {
      const address = listing.find(selector).first().text().trim();
      if (address) return address;
    }

    return null;
  }

  /**
   * Extract website URL
   */
  private extractWebsite($: cheerio.CheerioAPI, listing: cheerio.Cheerio): string | null {
    const selectors = [
      'a[href*="http"]',
      '.website a',
      'a.website',
    ];

    for (const selector of selectors) {
      const href = listing.find(selector).attr('href');
      if (href && (href.includes('http://') || href.includes('https://'))) {
        // Filter out JustDial's own URLs
        if (!href.includes('justdial.com')) {
          return href;
        }
      }
    }

    return null;
  }

  /**
   * Delay helper
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Export singleton instance
export const justDialScraper = new JustDialScraper();
