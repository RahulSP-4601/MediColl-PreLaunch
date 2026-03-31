import axios from 'axios';
import { Lead } from '../supabase';
import { emailExtractor } from './email-extractor';
import { socialMediaFinder } from './social-media';

export class GoogleMapsScraper {
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.GOOGLE_MAPS_API_KEY || '';
  }

  /**
   * Check if API key is configured
   */
  isConfigured(): boolean {
    return this.apiKey.length > 0;
  }

  /**
   * Scrape clinics/hospitals from Google Maps API
   */
  async scrape(
    city: string,
    type: 'clinic' | 'hospital',
    limit: number = 100,
    enrichEmails: boolean = true,
    findSocial: boolean = true
  ): Promise<Lead[]> {
    if (!this.isConfigured()) {
      console.log('❌ Google Maps API key not configured');
      return [];
    }

    console.log(`\n🔍 Scraping ${type}s in ${city} from Google Maps...`);

    const leads: Lead[] = [];
    const searchQuery = type === 'clinic' ? 'clinic' : 'hospital';

    try {
      // Use Places API Text Search
      const searchUrl = 'https://maps.googleapis.com/maps/api/place/textsearch/json';
      const response = await axios.get(searchUrl, {
        params: {
          query: `${searchQuery} in ${city}`,
          key: this.apiKey,
          region: 'in', // India
        },
      });

      if (response.data.status !== 'OK') {
        console.error(`Google Maps API error: ${response.data.status}`);
        return [];
      }

      const places = response.data.results.slice(0, limit);
      console.log(`Found ${places.length} places`);

      for (const place of places) {
        try {
          // Get place details
          const details = await this.getPlaceDetails(place.place_id);
          if (!details) continue;

          // Create base lead
          const lead: Lead = {
            name: details.name,
            phone: details.phone,
            address: details.address,
            city,
            type,
            website: details.website,
            source: 'google_maps',
            status: 'new',
          };

          // Enrich with email if website exists
          if (enrichEmails && details.website) {
            console.log(`  Extracting email from ${details.website}...`);
            const email = await emailExtractor.getBestEmail(details.website);
            if (email) {
              lead.email = email;
              console.log(`    ✅ Found email: ${email}`);
            }
            await this.delay(2000);
          }

          // Find social media if enabled
          if (findSocial) {
            console.log(`  Finding social media for ${details.name}...`);
            const socialMedia = await socialMediaFinder.findSocialMedia(
              details.website,
              details.name,
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

          // Only save if has email OR phone OR social media
          if (lead.email || lead.phone || lead.instagram || lead.facebook) {
            leads.push(lead);
            console.log(`✅ Saved: ${details.name} (${leads.length}/${limit})`);
          } else {
            console.log(`❌ Skipped: ${details.name} (no contact info)`);
          }

          await this.delay(1000);
        } catch (error) {
          console.error(`Error processing place:`, error);
          continue;
        }
      }

      console.log(`\n✅ Scraped ${leads.length} leads from Google Maps`);
      return leads;
    } catch (error) {
      console.error(`Error scraping Google Maps:`, error);
      return leads;
    }
  }

  /**
   * Get detailed information about a place
   */
  private async getPlaceDetails(placeId: string): Promise<{
    name: string;
    phone?: string;
    address?: string;
    website?: string;
  } | null> {
    try {
      const detailsUrl = 'https://maps.googleapis.com/maps/api/place/details/json';
      const response = await axios.get(detailsUrl, {
        params: {
          place_id: placeId,
          fields: 'name,formatted_phone_number,formatted_address,website',
          key: this.apiKey,
        },
      });

      if (response.data.status !== 'OK') {
        return null;
      }

      const result = response.data.result;
      return {
        name: result.name,
        phone: result.formatted_phone_number,
        address: result.formatted_address,
        website: result.website,
      };
    } catch (error) {
      return null;
    }
  }

  /**
   * Delay helper
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Export singleton instance
export const googleMapsScraper = new GoogleMapsScraper();
