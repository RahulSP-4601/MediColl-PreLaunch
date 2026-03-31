# Amazon SES Setup Guide for QB24-Sales

Setup Amazon SES for cost-effective email sending in India (~₹1,000/month for 100K emails)

## Step 1: Create AWS Account

1. Go to https://aws.amazon.com/
2. Click "Create an AWS Account"
3. Fill in your details (email, password, company name)
4. Add payment method (credit/debit card)
5. Complete phone verification

**Note:** AWS requires payment method but you'll only pay for what you use

---

## Step 2: Set Up SES in Mumbai Region

1. **Login to AWS Console**: https://console.aws.amazon.com/
2. **Go to SES**:
   - Search "SES" in the top search bar
   - Click "Amazon Simple Email Service"
3. **Select Mumbai Region**:
   - Top-right corner, change region to **"Asia Pacific (Mumbai) ap-south-1"**
   - This gives best performance for India

---

## Step 3: Verify Your Email Domain

### Option A: Verify Domain (Recommended for Production)

1. In SES Dashboard → **Identities** → **Create Identity**
2. Select **"Domain"**
3. Enter your domain: `qb24.com`
4. Check **"Use a custom MAIL FROM domain"**
5. Click **Create Identity**
6. You'll get DNS records to add:
   - **DKIM records** (3 CNAME records)
   - **SPF record** (TXT record)
   - **DMARC record** (TXT record)
7. Add these to your domain's DNS (GoDaddy/Namecheap/Route53)
8. Wait 24-72 hours for verification

### Option B: Verify Email (Quick Start for Testing)

1. In SES Dashboard → **Identities** → **Create Identity**
2. Select **"Email address"**
3. Enter: `noreply@qb24.com`
4. Click **Create Identity**
5. Check your email and click verification link
6. **Repeat for**: `support@qb24.com`

---

## Step 4: Request Production Access

**By default, SES is in SANDBOX mode** (can only send to verified emails)

### Request Production Access:

1. In SES Dashboard → **Account dashboard** → **Request production access**
2. Fill the form:
   - **Mail Type**: Transactional
   - **Website URL**: Your landing page URL
   - **Use Case Description**:
     ```
     QB24 - AI-powered receptionist for hospitals in India

     We send:
     - Waitlist confirmation emails to hospitals/clinics
     - Appointment confirmation emails to patients
     - System notifications

     Expected volume: 3,000-5,000 emails/day
     All emails are transactional, no marketing/promotional content.
     We handle unsubscribes and complaints properly.
     ```
   - **Compliance**: Describe how you handle bounces and complaints
3. Click **Submit**
4. **Approval time**: Usually 24 hours

**While waiting**, you can test by sending to verified email addresses.

---

## Step 5: Create IAM User for API Access

1. **Go to IAM**: Search "IAM" in AWS Console
2. **Users** → **Create User**
3. **User name**: `qb24-ses-sender`
4. Click **Next**
5. **Attach policies**:
   - Search "SES"
   - Select **"AmazonSESFullAccess"**
6. Click **Next** → **Create User**

### Get Access Keys:

1. Click on the user you just created
2. **Security credentials** tab
3. **Create access key**
4. Select **"Application running outside AWS"**
5. Click **Next** → **Create access key**
6. **IMPORTANT**: Copy both:
   - **Access Key ID**
   - **Secret Access Key**
   - Save them securely (you can't see secret again)

---

## Step 6: Update .env File

Add these to your `.env` file:

```env
# Amazon SES Configuration
AWS_REGION=ap-south-1
AWS_ACCESS_KEY_ID=AKIA************
AWS_SECRET_ACCESS_KEY=****************************************
AWS_SES_FROM_EMAIL=QB24 <noreply@qb24.com>
AWS_SES_REPLY_TO=support@qb24.com
```

---

## Step 7: Test Email Sending

### Quick Test:

```bash
# Join the waitlist on your landing page
# Check if email is received
```

### Manual Test (via AWS Console):

1. Go to SES Dashboard → **Verified identities**
2. Click on your verified email
3. Click **Send test email**
4. Enter recipient (must be verified if in sandbox)
5. Enter subject and body
6. Click **Send test email**

---

## Cost Breakdown (India - Mumbai Region)

| Volume | Monthly Cost | Per Email |
|--------|-------------|-----------|
| 10,000 emails | ~₹80 | ₹0.008 |
| 50,000 emails | ~₹400 | ₹0.008 |
| 100,000 emails | ~₹830 | ₹0.008 |
| 150,000 emails | ~₹1,245 | ₹0.008 |

**First 62,000 emails/month are FREE** (if sent from EC2)

---

## Monitoring & Best Practices

### 1. Monitor Bounce Rate
- Keep bounce rate < 5%
- Remove invalid emails from your list

### 2. Monitor Complaint Rate
- Keep complaint rate < 0.1%
- Add unsubscribe link (though QB24 emails are transactional)

### 3. Set Up SNS Notifications (Optional)
- Get notified of bounces/complaints
- Automatically remove bad emails

### 4. Reputation Dashboard
- Check SES → **Reputation metrics**
- Maintain good sender reputation

---

## Troubleshooting

### "Email address not verified"
- You're in sandbox mode
- Verify both sender and recipient emails
- OR request production access

### "Daily sending quota exceeded"
- Sandbox: 200 emails/day
- Production: Starts at 50,000/day
- Request limit increase if needed

### "Invalid AWS credentials"
- Double-check AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY
- Make sure IAM user has SES permissions

### Emails going to spam
- Add DKIM, SPF, DMARC records
- Use verified domain (not just email)
- Avoid spam trigger words
- Include physical address in footer

---

## Security Best Practices

1. **Never commit AWS credentials to Git**
2. **Use IAM user** (not root account)
3. **Rotate access keys** every 90 days
4. **Enable MFA** on AWS account
5. **Monitor CloudWatch** for unusual activity

---

## Estimated Timeline

- ✅ AWS Account: 10 minutes
- ✅ Email verification: 5 minutes
- ⏳ Domain verification: 24-72 hours
- ⏳ Production access: 24 hours
- ✅ IAM setup: 5 minutes
- ✅ Code integration: Already done!

**Total**: Ready to send in 24-72 hours

---

## Support

- AWS SES Docs: https://docs.aws.amazon.com/ses/
- AWS Support: https://console.aws.amazon.com/support/
- QB24 Team: If you need help, let me know!

---

**Ready to go!** Once you have the credentials, QB24-Sales will start sending emails via Amazon SES. 🎉
