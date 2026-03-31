import axios from 'axios';
import * as cheerio from 'cheerio';

export class EmailExtractor {
  private userAgent: string;

  constructor() {
    this.userAgent =
      process.env.USER_AGENT ||
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';
  }

  /**
   * Extract ALL emails from a website (not just contact@)
   * Checks homepage, /contact, /about, /team pages
   */
  async extractEmailsFromWebsite(websiteUrl: string): Promise<string[]> {
    const emails: Set<string> = new Set();

    try {
      // Ensure URL has protocol
      if (!websiteUrl.startsWith('http://') && !websiteUrl.startsWith('https://')) {
        websiteUrl = 'https://' + websiteUrl;
      }

      // Pages to check
      const pagesToCheck = [
        '',
        '/contact',
        '/contact-us',
        '/about',
        '/about-us',
        '/team',
      ];

      for (const page of pagesToCheck) {
        try {
          const url = websiteUrl + page;
          const pageEmails = await this.extractEmailsFromPage(url);
          pageEmails.forEach(email => emails.add(email));

          // Delay to avoid rate limiting
          await this.delay(1000);
        } catch (error) {
          // Continue with other pages if one fails
          continue;
        }
      }

      return this.prioritizeEmails(Array.from(emails));
    } catch (error) {
      console.error(`Error extracting emails from ${websiteUrl}:`, error);
      return [];
    }
  }

  /**
   * Extract emails from a single page
   */
  private async extractEmailsFromPage(url: string): Promise<string[]> {
    const emails: Set<string> = new Set();

    try {
      const response = await axios.get(url, {
        headers: { 'User-Agent': this.userAgent },
        timeout: 10000,
        validateStatus: (status) => status < 500, // Accept 4xx responses
      });

      if (response.status !== 200) {
        return [];
      }

      const $ = cheerio.load(response.data);

      // Method 1: Find mailto: links
      $('a[href^="mailto:"]').each((_, element) => {
        const href = $(element).attr('href');
        if (href) {
          const email = href.replace('mailto:', '').split('?')[0].trim();
          if (this.isValidEmail(email)) {
            emails.add(email.toLowerCase());
          }
        }
      });

      // Method 2: Extract from text content
      const text = $('body').text();
      const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
      const matches = text.match(emailRegex);
      if (matches) {
        matches.forEach(email => {
          if (this.isValidEmail(email)) {
            emails.add(email.toLowerCase());
          }
        });
      }

      // Method 3: Check meta tags
      $('meta').each((_, element) => {
        const content = $(element).attr('content');
        if (content) {
          const matches = content.match(emailRegex);
          if (matches) {
            matches.forEach(email => {
              if (this.isValidEmail(email)) {
                emails.add(email.toLowerCase());
              }
            });
          }
        }
      });

      return Array.from(emails);
    } catch (error) {
      return [];
    }
  }

  /**
   * Validate email format
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Basic validation
    if (!emailRegex.test(email)) return false;

    // Filter out common non-email patterns
    const invalidPatterns = [
      '@example.com',
      '@test.com',
      '@domain.com',
      'noreply@',
      'no-reply@',
      '.png',
      '.jpg',
      '.gif',
    ];

    return !invalidPatterns.some(pattern => email.includes(pattern));
  }

  /**
   * Prioritize emails (business emails first)
   */
  private prioritizeEmails(emails: string[]): string[] {
    if (emails.length === 0) return [];

    // Priority order:
    // 1. contact@, info@, support@, admin@, hello@
    // 2. Other business emails
    // 3. Personal emails (gmail, yahoo, etc.)

    const priority1 = ['contact@', 'info@', 'support@', 'admin@', 'hello@'];
    const priority2 = []; // Domain-specific emails
    const priority3 = ['@gmail.', '@yahoo.', '@hotmail.', '@outlook.'];

    const sorted = emails.sort((a, b) => {
      // Check priority 1
      const aPriority1 = priority1.some(prefix => a.startsWith(prefix));
      const bPriority1 = priority1.some(prefix => b.startsWith(prefix));
      if (aPriority1 && !bPriority1) return -1;
      if (!aPriority1 && bPriority1) return 1;

      // Check priority 3 (lower priority)
      const aPriority3 = priority3.some(domain => a.includes(domain));
      const bPriority3 = priority3.some(domain => b.includes(domain));
      if (!aPriority3 && bPriority3) return -1;
      if (aPriority3 && !bPriority3) return 1;

      return 0;
    });

    return sorted;
  }

  /**
   * Get best email from website
   */
  async getBestEmail(websiteUrl: string): Promise<string | null> {
    const emails = await this.extractEmailsFromWebsite(websiteUrl);
    return emails.length > 0 ? emails[0] : null;
  }

  /**
   * Delay helper
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Export singleton instance
export const emailExtractor = new EmailExtractor();
