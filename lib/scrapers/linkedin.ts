import axios from 'axios';
import * as cheerio from 'cheerio';

export interface LinkedInData {
  personalProfile?: string | null;
  companyPage?: string | null;
}

export class LinkedInFinder {
  private userAgent: string;

  constructor() {
    this.userAgent =
      process.env.USER_AGENT ||
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';
  }

  /**
   * Find LinkedIn profile from website
   */
  async findLinkedInFromWebsite(websiteUrl: string): Promise<string | null> {
    try {
      if (!websiteUrl.startsWith('http://') && !websiteUrl.startsWith('https://')) {
        websiteUrl = 'https://' + websiteUrl;
      }

      const response = await axios.get(websiteUrl, {
        headers: { 'User-Agent': this.userAgent },
        timeout: 10000,
      });

      const $ = cheerio.load(response.data);

      // LinkedIn patterns
      const linkedinPatterns = [
        /linkedin\.com\/in\/([a-zA-Z0-9-]+)/,
        /linkedin\.com\/company\/([a-zA-Z0-9-]+)/,
      ];

      // Check all links
      let linkedinUrl: string | null = null;
      $('a[href*="linkedin.com"]').each((_, element) => {
        const href = $(element).attr('href');
        if (href) {
          for (const pattern of linkedinPatterns) {
            const match = href.match(pattern);
            if (match && match[1]) {
              if (href.includes('/in/')) {
                linkedinUrl = `https://linkedin.com/in/${match[1]}`;
              } else {
                linkedinUrl = `https://linkedin.com/company/${match[1]}`;
              }
              return false; // Break loop
            }
          }
        }
      });

      return linkedinUrl;
    } catch (error) {
      return null;
    }
  }

  /**
   * Search for LinkedIn profile via Google
   */
  async searchLinkedInProfile(
    businessName: string,
    city: string,
    personTitle: string = 'owner'
  ): Promise<string | null> {
    try {
      const query = `${businessName} ${city} ${personTitle} site:linkedin.com/in`;
      const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;

      const response = await axios.get(searchUrl, {
        headers: { 'User-Agent': this.userAgent },
        timeout: 10000,
      });

      // Look for LinkedIn profile links in results
      const linkedinPattern = /linkedin\.com\/in\/([a-zA-Z0-9-]+)/;
      const match = response.data.match(linkedinPattern);

      if (match && match[1]) {
        return `https://linkedin.com/in/${match[1]}`;
      }

      return null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Find decision maker LinkedIn for a lead
   */
  async findDecisionMaker(
    website?: string,
    businessName?: string,
    city?: string
  ): Promise<LinkedInData> {
    const linkedinData: LinkedInData = {
      personalProfile: null,
      companyPage: null,
    };

    // Try to find from website first
    if (website) {
      console.log(`Finding LinkedIn for ${website}...`);
      const linkedinUrl = await this.findLinkedInFromWebsite(website);

      if (linkedinUrl) {
        if (linkedinUrl.includes('/in/')) {
          linkedinData.personalProfile = linkedinUrl;
        } else {
          linkedinData.companyPage = linkedinUrl;
        }
      }

      await this.delay(1000);
    }

    // If personal profile not found, search for owner/founder
    if (!linkedinData.personalProfile && businessName && city) {
      console.log(`Searching LinkedIn for ${businessName} owner...`);

      // Try different titles
      const titles = ['owner', 'founder', 'director', 'CEO'];
      for (const title of titles) {
        const profileUrl = await this.searchLinkedInProfile(
          businessName,
          city,
          title
        );
        if (profileUrl) {
          linkedinData.personalProfile = profileUrl;
          break;
        }
        await this.delay(2000);
      }
    }

    return linkedinData;
  }

  /**
   * Delay helper
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Export singleton instance
export const linkedinFinder = new LinkedInFinder();
