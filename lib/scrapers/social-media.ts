import axios from 'axios';
import * as cheerio from 'cheerio';

export interface SocialMediaData {
  instagram?: string | null;
  facebook?: string | null;
}

export class SocialMediaFinder {
  private userAgent: string;

  constructor() {
    this.userAgent =
      process.env.USER_AGENT ||
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';
  }

  /**
   * Find Instagram handle from website
   */
  async findInstagramFromWebsite(websiteUrl: string): Promise<string | null> {
    try {
      if (!websiteUrl.startsWith('http://') && !websiteUrl.startsWith('https://')) {
        websiteUrl = 'https://' + websiteUrl;
      }

      const response = await axios.get(websiteUrl, {
        headers: { 'User-Agent': this.userAgent },
        timeout: 10000,
      });

      const $ = cheerio.load(response.data);

      // Method 1: Find Instagram links
      const instagramPatterns = [
        /instagram\.com\/([a-zA-Z0-9_.]+)/,
        /@([a-zA-Z0-9_.]+)/,
      ];

      // Check all links
      let handle: string | null = null;
      $('a[href*="instagram.com"]').each((_, element) => {
        const href = $(element).attr('href');
        if (href) {
          const match = href.match(instagramPatterns[0]);
          if (match && match[1]) {
            handle = '@' + match[1].replace('/', '');
            return false; // Break loop
          }
        }
      });

      if (handle) return handle;

      // Method 2: Check page text for @username
      const text = $('body').text();
      const handleMatch = text.match(/@([a-zA-Z0-9_.]{3,30})/);
      if (handleMatch) {
        return '@' + handleMatch[1];
      }

      return null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Find Facebook page from website
   */
  async findFacebookFromWebsite(websiteUrl: string): Promise<string | null> {
    try {
      if (!websiteUrl.startsWith('http://') && !websiteUrl.startsWith('https://')) {
        websiteUrl = 'https://' + websiteUrl;
      }

      const response = await axios.get(websiteUrl, {
        headers: { 'User-Agent': this.userAgent },
        timeout: 10000,
      });

      const $ = cheerio.load(response.data);

      // Find Facebook links
      let facebookUrl: string | null = null;
      $('a[href*="facebook.com"]').each((_, element) => {
        const href = $(element).attr('href');
        if (href && !href.includes('/sharer/')) {
          facebookUrl = href;
          return false; // Break loop
        }
      });

      return facebookUrl;
    } catch (error) {
      return null;
    }
  }

  /**
   * Search for Instagram handle via Google
   */
  async searchInstagram(
    businessName: string,
    city: string
  ): Promise<string | null> {
    try {
      const query = `${businessName} ${city} Instagram`;
      const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;

      const response = await axios.get(searchUrl, {
        headers: { 'User-Agent': this.userAgent },
        timeout: 10000,
      });

      // Look for Instagram profile links in results
      const instagramPattern = /instagram\.com\/([a-zA-Z0-9_.]+)/;
      const match = response.data.match(instagramPattern);

      if (match && match[1]) {
        return '@' + match[1].replace('/', '');
      }

      return null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Search for Facebook page via Google
   */
  async searchFacebook(
    businessName: string,
    city: string
  ): Promise<string | null> {
    try {
      const query = `${businessName} ${city} Facebook`;
      const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;

      const response = await axios.get(searchUrl, {
        headers: { 'User-Agent': this.userAgent },
        timeout: 10000,
      });

      // Look for Facebook page links in results
      const facebookPattern = /facebook\.com\/([a-zA-Z0-9.-]+)/;
      const match = response.data.match(facebookPattern);

      if (match && match[0]) {
        return 'https://facebook.com/' + match[1];
      }

      return null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Find all social media for a lead
   */
  async findSocialMedia(
    website?: string,
    businessName?: string,
    city?: string
  ): Promise<SocialMediaData> {
    const socialMedia: SocialMediaData = {
      instagram: null,
      facebook: null,
    };

    // Try to find from website first
    if (website) {
      console.log(`Finding social media for ${website}...`);

      socialMedia.instagram = await this.findInstagramFromWebsite(website);
      await this.delay(1000);

      socialMedia.facebook = await this.findFacebookFromWebsite(website);
      await this.delay(1000);
    }

    // If not found and we have business name, search Google
    if (!socialMedia.instagram && businessName && city) {
      console.log(`Searching Instagram for ${businessName}...`);
      socialMedia.instagram = await this.searchInstagram(businessName, city);
      await this.delay(2000);
    }

    if (!socialMedia.facebook && businessName && city) {
      console.log(`Searching Facebook for ${businessName}...`);
      socialMedia.facebook = await this.searchFacebook(businessName, city);
      await this.delay(2000);
    }

    return socialMedia;
  }

  /**
   * Delay helper
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Export singleton instance
export const socialMediaFinder = new SocialMediaFinder();
