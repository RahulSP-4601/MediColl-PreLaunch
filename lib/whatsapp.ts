import twilio from 'twilio';

export interface WhatsAppConfig {
  accountSid: string;
  authToken: string;
  whatsappNumber: string;
  dailyLimit: number;
  delaySeconds: number;
}

export class WhatsAppSender {
  private client: twilio.Twilio;
  private config: WhatsAppConfig;
  private messagesSentToday: number = 0;
  private lastMessageTime: Date | null = null;

  constructor() {
    this.config = {
      accountSid: process.env.TWILIO_ACCOUNT_SID || '',
      authToken: process.env.TWILIO_AUTH_TOKEN || '',
      whatsappNumber: process.env.TWILIO_WHATSAPP_NUMBER || 'whatsapp:+14155238886',
      dailyLimit: parseInt(process.env.DAILY_WHATSAPP_LIMIT || '100'),
      delaySeconds: parseInt(process.env.WHATSAPP_DELAY_SECONDS || '5'),
    };

    this.client = twilio(this.config.accountSid, this.config.authToken);
  }

  /**
   * Rate limiting check
   */
  private async checkRateLimit(): Promise<void> {
    // Check daily limit
    if (this.messagesSentToday >= this.config.dailyLimit) {
      throw new Error('Daily WhatsApp limit reached');
    }

    // Check minimum delay
    if (this.lastMessageTime) {
      const timeSinceLastMessage = Date.now() - this.lastMessageTime.getTime();
      const minDelayMs = this.config.delaySeconds * 1000;

      if (timeSinceLastMessage < minDelayMs) {
        const waitTime = minDelayMs - timeSinceLastMessage;
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
  }

  /**
   * Format phone number for WhatsApp
   */
  private formatPhoneNumber(phone: string): string {
    // Remove any existing whatsapp: prefix
    phone = phone.replace('whatsapp:', '');

    // Ensure it starts with +91 for India
    if (!phone.startsWith('+')) {
      phone = '+91' + phone.replace(/^0+/, '');
    }

    return `whatsapp:${phone}`;
  }

  /**
   * Send initial WhatsApp message
   */
  async sendInitialMessage(
    to: string,
    leadData: {
      name?: string;
      clinicName?: string;
    }
  ): Promise<boolean> {
    try {
      await this.checkRateLimit();

      const formattedTo = this.formatPhoneNumber(to);
      const greeting = leadData.name ? `Hello ${leadData.name}` : 'Hello';

      const message = `🎯 *MediColl24 - Never Miss a Patient Call*

${greeting}!

We're building MediColl24 - a 24/7 AI voice receptionist for clinics in India.

✅ *Answers every call (24/7)*
✅ *Books appointments automatically*
✅ *Handles doctor unavailability*
✅ *Prevents double bookings*

🚀 *Launching mid-May*

Would you be interested in early access?

👉 *Join waitlist:*
${process.env.NEXT_PUBLIC_WAITLIST_URL}

Happy to answer any questions!

Best regards,
*Rahul Sanjay Panchal*
CEO - MediColl24
medicoll24.ai

_Reply STOP to unsubscribe_`;

      await this.client.messages.create({
        from: this.config.whatsappNumber,
        to: formattedTo,
        body: message,
      });

      // Update rate limit counters
      this.messagesSentToday++;
      this.lastMessageTime = new Date();

      console.log(`✅ WhatsApp message sent to ${to}`);
      return true;
    } catch (error) {
      console.error(`❌ Error sending WhatsApp to ${to}:`, error);
      return false;
    }
  }

  /**
   * Send follow-up WhatsApp message
   */
  async sendFollowUpMessage(
    to: string,
    leadData: {
      name?: string;
    }
  ): Promise<boolean> {
    try {
      await this.checkRateLimit();

      const formattedTo = this.formatPhoneNumber(to);
      const greeting = leadData.name ? `Hi ${leadData.name}` : 'Hi';

      const message = `${greeting},

I sent you a message about *MediColl24* - our 24/7 AI voice receptionist for clinics.

Quick question: Did you get a chance to check it out?

We're launching in mid-May with *limited early access spots*.

👉 *Join waitlist:*
${process.env.NEXT_PUBLIC_WAITLIST_URL}

Thanks!

*Rahul Sanjay Panchal*
CEO - MediColl24

_Reply STOP to unsubscribe_`;

      await this.client.messages.create({
        from: this.config.whatsappNumber,
        to: formattedTo,
        body: message,
      });

      // Update rate limit counters
      this.messagesSentToday++;
      this.lastMessageTime = new Date();

      console.log(`✅ WhatsApp follow-up sent to ${to}`);
      return true;
    } catch (error) {
      console.error(`❌ Error sending WhatsApp follow-up to ${to}:`, error);
      return false;
    }
  }

  /**
   * Test Twilio connection
   */
  async testConnection(): Promise<boolean> {
    try {
      // Fetch account details to verify credentials
      await this.client.api.accounts(this.config.accountSid).fetch();
      console.log('✅ Twilio connection successful');
      return true;
    } catch (error) {
      console.error('❌ Twilio connection failed:', error);
      return false;
    }
  }
}

// Export singleton instance
export const whatsappSender = new WhatsAppSender();
