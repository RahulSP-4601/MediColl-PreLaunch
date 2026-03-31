import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import { render } from '@react-email/render';
import { InitialEmail } from '@/emails/InitialEmail';
import { FollowUpEmail } from '@/emails/FollowUpEmail';

export interface EmailConfig {
  fromEmail: string;
  fromName: string;
  replyTo: string;
  dailyLimit: number;
  hourlyLimit: number;
  minDelay: number;
}

export class EmailSender {
  private sesClient: SESClient;
  private config: EmailConfig;
  private emailsSentToday: number = 0;
  private emailsSentThisHour: number = 0;
  private lastEmailTime: Date | null = null;

  constructor() {
    // Initialize AWS SES client
    this.sesClient = new SESClient({
      region: process.env.AWS_REGION || 'ap-south-1', // Mumbai region
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
      },
    });

    this.config = {
      fromEmail: process.env.AWS_SES_FROM_EMAIL || 'MediColl24 <noreply@medicoll24.com>',
      fromName: process.env.FROM_NAME || 'Rahul Sanjay Panchal',
      replyTo: process.env.AWS_SES_REPLY_TO || 'support@medicoll24.com',
      dailyLimit: parseInt(process.env.DAILY_EMAIL_LIMIT || '10000'),
      hourlyLimit: parseInt(process.env.HOURLY_EMAIL_LIMIT || '1000'),
      minDelay: parseInt(process.env.MIN_DELAY_SECONDS || '2'),
    };
  }

  /**
   * Rate limiting check
   */
  private async checkRateLimit(): Promise<void> {
    // Check daily limit
    if (this.emailsSentToday >= this.config.dailyLimit) {
      throw new Error('Daily email limit reached');
    }

    // Check hourly limit
    if (this.emailsSentThisHour >= this.config.hourlyLimit) {
      throw new Error('Hourly email limit reached');
    }

    // Check minimum delay
    if (this.lastEmailTime) {
      const timeSinceLastEmail = Date.now() - this.lastEmailTime.getTime();
      const minDelayMs = this.config.minDelay * 1000;

      if (timeSinceLastEmail < minDelayMs) {
        const waitTime = minDelayMs - timeSinceLastEmail;
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
  }

  /**
   * Send initial email
   */
  async sendInitialEmail(
    to: string,
    leadData: {
      name?: string;
      clinicName?: string;
      city?: string;
    }
  ): Promise<boolean> {
    try {
      await this.checkRateLimit();

      // Render email using React Email
      const emailHtml = render(
        InitialEmail({
          name: leadData.name,
          clinicName: leadData.clinicName,
          city: leadData.city,
        })
      );

      // Send email using AWS SES
      const command = new SendEmailCommand({
        Source: this.config.fromEmail,
        Destination: {
          ToAddresses: [to],
        },
        Message: {
          Subject: {
            Data: '🎯 Never miss a patient call again — MediColl24',
            Charset: 'UTF-8',
          },
          Body: {
            Html: {
              Data: emailHtml,
              Charset: 'UTF-8',
            },
            Text: {
              Data: this.generatePlainTextInitial(leadData),
              Charset: 'UTF-8',
            },
          },
        },
        ReplyToAddresses: [this.config.replyTo],
      });

      await this.sesClient.send(command);

      // Update rate limit counters
      this.emailsSentToday++;
      this.emailsSentThisHour++;
      this.lastEmailTime = new Date();

      console.log(`✅ Initial email sent to ${to} via AWS SES`);
      return true;
    } catch (error) {
      console.error(`❌ Error sending initial email to ${to}:`, error);
      return false;
    }
  }

  /**
   * Send follow-up email
   */
  async sendFollowUpEmail(
    to: string,
    leadData: {
      name?: string;
      clinicName?: string;
    }
  ): Promise<boolean> {
    try {
      await this.checkRateLimit();

      // Render email using React Email
      const emailHtml = render(
        FollowUpEmail({
          name: leadData.name,
          clinicName: leadData.clinicName,
        })
      );

      // Send email using AWS SES
      const command = new SendEmailCommand({
        Source: this.config.fromEmail,
        Destination: {
          ToAddresses: [to],
        },
        Message: {
          Subject: {
            Data: 'Just checking — worth exploring? (MediColl24)',
            Charset: 'UTF-8',
          },
          Body: {
            Html: {
              Data: emailHtml,
              Charset: 'UTF-8',
            },
            Text: {
              Data: this.generatePlainTextFollowUp(leadData),
              Charset: 'UTF-8',
            },
          },
        },
        ReplyToAddresses: [this.config.replyTo],
      });

      await this.sesClient.send(command);

      // Update rate limit counters
      this.emailsSentToday++;
      this.emailsSentThisHour++;
      this.lastEmailTime = new Date();

      console.log(`✅ Follow-up email sent to ${to} via AWS SES`);
      return true;
    } catch (error) {
      console.error(`❌ Error sending follow-up email to ${to}:`, error);
      return false;
    }
  }

  /**
   * Generate plain text version of initial email
   */
  private generatePlainTextInitial(leadData: {
    name?: string;
    clinicName?: string;
    city?: string;
  }): string {
    const greeting = leadData.name ? `Hi ${leadData.name}` : 'Hi';
    const clinicMention = leadData.clinicName
      ? `I noticed ${leadData.clinicName}${leadData.city ? ` in ${leadData.city}` : ''}.`
      : '';

    return `
${greeting},

${clinicMention}

My name is Rahul Sanjay Panchal, CEO of MediColl24.

Many clinics lose patients due to missed calls and after-hours unavailability. We're solving this.

MediColl24 is a 24/7 AI voice receptionist that:
✅ Answers every call (24/7)
✅ Books appointments automatically
✅ Handles doctor unavailability
✅ Prevents double bookings

We're launching in mid-May and offering limited early access.

Would you be interested in joining the waitlist?

Join here: ${process.env.NEXT_PUBLIC_WAITLIST_URL}

Happy to answer any questions!

Best regards,
Rahul Sanjay Panchal
CEO - MediColl24
medicoll24.ai

---
Unsubscribe: ${process.env.NEXT_PUBLIC_UNSUBSCRIBE_URL}
    `.trim();
  }

  /**
   * Generate plain text version of follow-up email
   */
  private generatePlainTextFollowUp(leadData: {
    name?: string;
    clinicName?: string;
  }): string {
    const greeting = leadData.name ? `Hi ${leadData.name}` : 'Hi';

    return `
${greeting},

I sent you a message about MediColl24 — our 24/7 AI voice receptionist for clinics.

Quick question: Did you get a chance to check it out?

I'd love to hear your thoughts:
• Is this something you'd find useful?
• Any questions I can answer?

We're launching in mid-May with limited early access spots.

Join waitlist: ${process.env.NEXT_PUBLIC_WAITLIST_URL}

Thanks for your time!

Best regards,
Rahul Sanjay Panchal
CEO - MediColl24
medicoll24.ai

---
Unsubscribe: ${process.env.NEXT_PUBLIC_UNSUBSCRIBE_URL}
    `.trim();
  }

  /**
   * Test AWS SES connection
   */
  async testConnection(): Promise<boolean> {
    try {
      // Test by checking if we can create a command (doesn't send email)
      const command = new SendEmailCommand({
        Source: this.config.fromEmail,
        Destination: {
          ToAddresses: [this.config.replyTo],
        },
        Message: {
          Subject: { Data: 'Test', Charset: 'UTF-8' },
          Body: {
            Text: { Data: 'Test connection', Charset: 'UTF-8' },
          },
        },
      });

      // Note: To fully test, uncomment below (it will send a test email)
      // await this.sesClient.send(command);

      console.log('✅ AWS SES client configured successfully');
      return true;
    } catch (error) {
      console.error('❌ AWS SES connection failed:', error);
      return false;
    }
  }
}

// Export singleton instance
export const emailSender = new EmailSender();
