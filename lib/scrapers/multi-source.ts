import { justDialScraper } from './justdial';
import { googleMapsScraper } from './google-maps';
import { Lead } from '../supabase';

/**
 * Multi-Source Scraper
 * Scrapes from multiple sources in parallel for maximum speed
 * Target: 10+ clients/hour
 */
export class MultiSourceScraper {
  /**
   * Scrape from all available sources in parallel
   * This is FAST - can get 50-100 leads in 1 hour
   */
  async scrapeParallel(
    city: string,
    type: 'clinic' | 'hospital',
    leadsPerSource: number = 20
  ): Promise<Lead[]> {
    console.log(`\n🚀 [MULTI-SOURCE] Starting parallel scraping for ${city}...`);
    console.log(`📊 Target: ${leadsPerSource} leads per source`);

    const startTime = Date.now();

    // Run all scrapers in parallel (at the same time)
    const results = await Promise.allSettled([
      // Source 1: JustDial (FREE)
      this.scrapeWithTimeout(
        () => justDialScraper.scrape(city, type, leadsPerSource, true, true),
        'JustDial',
        30000 // 30 second timeout
      ),

      // Source 2: Google Maps (if API key configured)
      this.scrapeWithTimeout(
        async () => {
          if (googleMapsScraper.isConfigured()) {
            return await googleMapsScraper.scrape(city, type, leadsPerSource, true, true);
          }
          console.log('⏭️  [Google Maps] Skipped (no API key)');
          return [];
        },
        'Google Maps',
        30000
      ),

      // TODO: Add more sources here
      // - Practo
      // - Lybrate
      // - Yellow Pages
    ]);

    // Combine all results
    const allLeads: Lead[] = [];

    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        allLeads.push(...result.value);
      } else {
        console.error(`❌ Source ${index + 1} failed:`, result.reason);
      }
    });

    // Remove duplicates (based on phone or email)
    const uniqueLeads = this.removeDuplicates(allLeads);

    const duration = ((Date.now() - startTime) / 1000).toFixed(1);
    const leadsPerHour = Math.round((uniqueLeads.length / parseFloat(duration)) * 3600);

    console.log(`\n✅ [MULTI-SOURCE] Scraping complete!`);
    console.log(`📊 Stats:`);
    console.log(`   - Total leads: ${uniqueLeads.length}`);
    console.log(`   - Time taken: ${duration}s`);
    console.log(`   - Speed: ~${leadsPerHour} leads/hour 🚀`);
    console.log(`   - Sources used: ${results.filter(r => r.status === 'fulfilled').length}`);

    return uniqueLeads;
  }

  /**
   * Scrape with timeout to prevent hanging
   */
  private async scrapeWithTimeout(
    scraperFn: () => Promise<Lead[]>,
    sourceName: string,
    timeoutMs: number
  ): Promise<Lead[]> {
    console.log(`🔍 [${sourceName}] Starting...`);

    const timeoutPromise = new Promise<Lead[]>((_, reject) => {
      setTimeout(() => reject(new Error(`${sourceName} timeout`)), timeoutMs);
    });

    try {
      const leads = await Promise.race([scraperFn(), timeoutPromise]);
      console.log(`✅ [${sourceName}] Found ${leads.length} leads`);
      return leads;
    } catch (error) {
      console.error(`❌ [${sourceName}] Failed:`, error);
      return [];
    }
  }

  /**
   * Remove duplicate leads
   */
  private removeDuplicates(leads: Lead[]): Lead[] {
    const seen = new Set<string>();
    const unique: Lead[] = [];

    for (const lead of leads) {
      const key = lead.phone || lead.email || lead.name;
      if (key && !seen.has(key)) {
        seen.add(key);
        unique.push(lead);
      }
    }

    return unique;
  }

  /**
   * Aggressive scraping mode - scrape from multiple cities in parallel
   * Target: 100+ leads/hour
   */
  async scrapeBulk(
    cities: string[],
    type: 'clinic' | 'hospital',
    leadsPerCity: number = 10
  ): Promise<Lead[]> {
    console.log(`\n🔥 [BULK MODE] Starting aggressive scraping...`);
    console.log(`📍 Cities: ${cities.join(', ')}`);

    const startTime = Date.now();

    // Scrape all cities in parallel
    const cityResults = await Promise.allSettled(
      cities.map(city => this.scrapeParallel(city, type, leadsPerCity))
    );

    // Combine results
    const allLeads: Lead[] = [];
    cityResults.forEach((result) => {
      if (result.status === 'fulfilled') {
        allLeads.push(...result.value);
      }
    });

    const uniqueLeads = this.removeDuplicates(allLeads);
    const duration = ((Date.now() - startTime) / 1000).toFixed(1);
    const leadsPerHour = Math.round((uniqueLeads.length / parseFloat(duration)) * 3600);

    console.log(`\n🎉 [BULK MODE] Complete!`);
    console.log(`📊 Final Stats:`);
    console.log(`   - Total leads: ${uniqueLeads.length}`);
    console.log(`   - Cities covered: ${cities.length}`);
    console.log(`   - Time: ${duration}s`);
    console.log(`   - Speed: ~${leadsPerHour} leads/hour 🚀🚀🚀`);

    return uniqueLeads;
  }
}

export const multiSourceScraper = new MultiSourceScraper();
