/**
 * Amazon SES Email Service
 * Cost-effective email sending for India market (~₹1,000/month for 100K emails)
 */

import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

// Initialize SES client
const sesClient = new SESClient({
  region: process.env.AWS_REGION || 'ap-south-1', // Mumbai region for India
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export interface EmailOptions {
  to: string | string[];
  subject: string;
  htmlBody: string;
  textBody?: string;
  replyTo?: string;
}

/**
 * Send email using Amazon SES
 */
export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    const { to, subject, htmlBody, textBody, replyTo } = options;

    const toAddresses = Array.isArray(to) ? to : [to];
    const fromEmail = process.env.AWS_SES_FROM_EMAIL || 'MediColl24 <noreply@medicoll24.com>';
    const replyToEmail = replyTo || process.env.AWS_SES_REPLY_TO || 'support@medicoll24.com';

    const command = new SendEmailCommand({
      Source: fromEmail,
      Destination: {
        ToAddresses: toAddresses,
      },
      Message: {
        Subject: {
          Data: subject,
          Charset: 'UTF-8',
        },
        Body: {
          Html: {
            Data: htmlBody,
            Charset: 'UTF-8',
          },
          Text: textBody
            ? {
                Data: textBody,
                Charset: 'UTF-8',
              }
            : undefined,
        },
      },
      ReplyToAddresses: [replyToEmail],
    });

    const response = await sesClient.send(command);

    if (response.MessageId) {
      console.log('✅ [SES] Email sent successfully:', {
        messageId: response.MessageId,
        to: toAddresses,
      });
      return true;
    }

    return false;
  } catch (error) {
    console.error('❌ [SES] Failed to send email:', error);
    return false;
  }
}

/**
 * Send waitlist confirmation email
 */
export async function sendWaitlistConfirmation(
  email: string,
  name: string,
  clinicName?: string
): Promise<boolean> {
  const displayName = clinicName || name;

  const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to MediColl24 Waitlist</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #323232; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #F5F5F5;">
  <div style="background-color: #ffffff; border-radius: 16px; padding: 40px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);">

    <!-- Header -->
    <div style="text-align: center; margin-bottom: 30px;">
      <h1 style="color: #323232; font-size: 32px; margin: 0 0 10px 0; font-weight: 700;">
        Welcome to MediColl24! 🎉
      </h1>
      <p style="color: #666; font-size: 16px; margin: 0;">
        You're on the priority waitlist
      </p>
    </div>

    <!-- Greeting -->
    <p style="font-size: 16px; color: #323232; margin-bottom: 20px;">
      Hi <strong>${displayName}</strong>,
    </p>

    <p style="font-size: 16px; color: #323232; margin-bottom: 25px;">
      Thank you for joining the MediColl24 waitlist! You're now on the priority list for early access to India's first AI-powered receptionist for hospitals.
    </p>

    <!-- What's Next Box -->
    <div style="background-color: #DDD0C8; border-radius: 12px; padding: 25px; margin: 30px 0;">
      <h2 style="color: #323232; font-size: 20px; margin: 0 0 16px 0; font-weight: 600;">
        📋 What's Next?
      </h2>
      <ul style="color: #323232; font-size: 15px; margin: 0; padding-left: 20px; line-height: 1.8;">
        <li>You're on the <strong>priority list</strong> for early access</li>
        <li>Launching in <strong>mid-May 2025</strong></li>
        <li>Early access members get <strong>special pricing</strong></li>
        <li>We'll notify you <strong>1 week before launch</strong></li>
      </ul>
    </div>

    <!-- Features Box -->
    <div style="background-color: #323232; color: #DDD0C8; border-radius: 12px; padding: 25px; margin: 30px 0; text-align: center;">
      <h3 style="margin: 0 0 16px 0; font-size: 20px; font-weight: 600;">
        Why MediColl24?
      </h3>
      <div style="font-size: 15px; line-height: 1.8;">
        ✓ Never miss a patient call<br>
        ✓ 24/7 AI-powered receptionist<br>
        ✓ Automatic appointment scheduling<br>
        ✓ Reduce no-shows by 40%<br>
        ✓ Works in Hindi & English
      </div>
    </div>

    <!-- Pricing Preview -->
    <div style="background-color: #F8F8F8; border-radius: 12px; padding: 20px; margin: 30px 0; text-align: center;">
      <p style="color: #666; font-size: 14px; margin: 0 0 8px 0;">
        Early Access Pricing (Waitlist Members Only)
      </p>
      <p style="color: #323232; font-size: 28px; font-weight: 700; margin: 0;">
        ₹2,999<span style="font-size: 16px; font-weight: 400; color: #666;">/month</span>
      </p>
      <p style="color: #666; font-size: 13px; margin: 8px 0 0 0;">
        Regular price: ₹4,999/month (save 40%)
      </p>
    </div>

    <!-- Questions -->
    <p style="font-size: 16px; color: #323232; margin: 25px 0 20px 0;">
      Have questions? Just reply to this email - we'd love to hear from you!
    </p>

    <!-- Signature -->
    <p style="font-size: 16px; color: #323232; margin: 30px 0 10px 0;">
      Best regards,<br>
      <strong>The MediColl24 Team</strong>
    </p>

    <!-- Footer -->
    <div style="border-top: 1px solid #E0E0E0; margin-top: 40px; padding-top: 20px; text-align: center;">
      <p style="font-size: 14px; color: #999; margin: 0;">
        MediColl24 - AI-powered receptionist for hospitals<br>
        Made in India 🇮🇳 for Indian Healthcare
      </p>
      <p style="font-size: 13px; color: #999; margin: 10px 0 0 0;">
        <a href="mailto:support@medicoll24.com" style="color: #666; text-decoration: none;">support@medicoll24.com</a>
      </p>
    </div>

  </div>
</body>
</html>
  `;

  const textBody = `
Welcome to MediColl24, ${displayName}!

Thank you for joining the MediColl24 waitlist. You're now on the priority list for early access.

What's Next:
- You're on the priority list for early access
- Launching in mid-May 2025
- Early access members get special pricing
- We'll notify you 1 week before launch

Why MediColl24?
✓ Never miss a patient call
✓ 24/7 AI-powered receptionist
✓ Automatic appointment scheduling
✓ Reduce no-shows by 40%
✓ Works in Hindi & English

Early Access Pricing: ₹2,999/month (Regular: ₹4,999/month)

Have questions? Reply to this email!

Best regards,
The MediColl24 Team

---
MediColl24 - AI-powered receptionist for hospitals
Made in India 🇮🇳 for Indian Healthcare
support@medicoll24.com
  `;

  return sendEmail({
    to: email,
    subject: '🎉 Welcome to MediColl24 Waitlist - You\'re In!',
    htmlBody,
    textBody,
  });
}

/**
 * Send bulk emails (for campaigns)
 * Note: SES has rate limits - adjust based on your SES tier
 */
export async function sendBulkEmails(
  emails: Array<{ to: string; subject: string; htmlBody: string; textBody?: string }>
): Promise<{ sent: number; failed: number }> {
  let sent = 0;
  let failed = 0;

  for (const email of emails) {
    const success = await sendEmail(email);
    if (success) {
      sent++;
    } else {
      failed++;
    }

    // Rate limiting: SES allows 14 emails/second in sandbox, more in production
    // Add delay to avoid hitting rate limits
    await new Promise((resolve) => setTimeout(resolve, 100)); // 10 emails/second
  }

  return { sent, failed };
}
