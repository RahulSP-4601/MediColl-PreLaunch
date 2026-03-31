# QB24-Sales Deployment Checklist

Complete checklist for deploying to Vercel with automated scraping and email campaigns.

---

## 📋 Pre-Deployment Checklist

### 1. ✅ Environment Variables

Configure these in Vercel dashboard under **Settings → Environment Variables**:

#### Required Variables
```bash
# Supabase (use same credentials as QuickBook24)
NEXT_PUBLIC_SUPABASE_URL=https://zaycctejpqvrtvoeidwm.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...

# SMTP Email (Gmail recommended for testing)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-gmail-app-password  # Create at myaccount.google.com/apppasswords
FROM_EMAIL=your-email@gmail.com
FROM_NAME=Rahul Sanjay Panchal

# Waitlist URLs
NEXT_PUBLIC_WAITLIST_URL=https://quickbook24.ai/waitlist
NEXT_PUBLIC_UNSUBSCRIBE_URL=https://your-vercel-app.vercel.app/unsubscribe

# Security (IMPORTANT: Change these!)
CRON_SECRET=your-strong-random-secret-here-use-uuidgen
NEXT_PUBLIC_FOUNDER_PASSWORD=your-secure-password-different-from-default

# Optional
ENABLE_WHATSAPP=false
DAILY_EMAIL_LIMIT=500
HOURLY_EMAIL_LIMIT=50
MIN_DELAY_SECONDS=30
```

### 2. 🔐 Security Setup

1. **Change Default Passwords**
   ```bash
   # Generate strong secrets
   uuidgen  # For CRON_SECRET
   openssl rand -base64 32  # For FOUNDER_PASSWORD
   ```

2. **Gmail App Password**
   - Go to [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
   - Create app password for "Mail"
   - Use this in `SMTP_PASSWORD` (NOT your regular Gmail password)

3. **Vercel Cron Secret**
   - Vercel automatically sets `Authorization: Bearer {CRON_SECRET}` header
   - Our cron endpoints verify this to prevent unauthorized access

### 3. 📧 Email Setup

**Option A: Gmail (Recommended for testing)**
- Free up to 500 emails/day
- Easy setup with app password
- Good for MVP and testing

**Option B: AWS SES (Production)**
- ~₹1,000/month for 50,000 emails
- Better deliverability
- Requires AWS setup

### 4. 🗄️ Database Setup

Your Supabase database should have:
- ✅ `leads` table (created from schema.sql)
- ✅ `campaign_stats` view (created from schema.sql)
- ✅ Proper indexes for performance

If not set up yet:
```bash
# Run the schema in Supabase SQL Editor
cat supabase/schema.sql
```

---

## 🚀 Deployment Steps

### Step 1: Deploy to Vercel

```bash
# Option A: Deploy via Vercel CLI
npm install -g vercel
vercel --prod

# Option B: Deploy via GitHub
# 1. Push to GitHub
# 2. Import project in Vercel dashboard
# 3. Connect repository
# 4. Deploy
```

### Step 2: Configure Cron Jobs

Cron jobs are automatically configured from `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/scrape/cron",
      "schedule": "0 2 * * *"  // Daily at 2:00 AM IST
    },
    {
      "path": "/api/campaign/run",
      "schedule": "30 3 * * *"  // Daily at 3:30 AM IST
    }
  ]
}
```

**Verify in Vercel Dashboard:**
- Go to **Settings → Cron Jobs**
- You should see 2 cron jobs listed
- Check execution logs after deployment

### Step 3: Test Before Going Live

1. **Access Founder Dashboard**
   ```
   https://your-app.vercel.app/founder
   Password: your-founder-password
   ```

2. **Test Scraping**
   - Click "Scrape New Leads"
   - Wait for completion (may take 2-5 minutes)
   - Check stats to verify leads were saved

3. **Test Email Sending (DRY RUN)**
   - In founder dashboard, modify the campaign endpoint to use `dryRun: true`
   - Or use CLI: `npm run send-initial -- --dry-run`
   - Verify no actual emails are sent

4. **Test Email Sending (REAL)**
   - Send to your own email first
   - Verify email format, links, and content
   - Check spam folder

### Step 4: Monitor Cron Execution

**View Cron Logs:**
```bash
# Via Vercel CLI
vercel logs --follow

# Via Vercel Dashboard
# Go to Deployments → View Function Logs
# Filter by /api/scrape/cron or /api/campaign/run
```

**Expected Daily Flow:**
```
2:00 AM IST → Scrape new leads across 15 random cities
             → Save to database (skip duplicates)
             → Log: "Saved X new leads, skipped Y duplicates"

3:30 AM IST → Send initial emails to "new" leads
             → Send follow-ups (48h after initial)
             → Mark as not interested (48h after follow-up)
             → Log: "Campaign complete! Sent X emails"
```

---

## 🧪 Post-Deployment Testing

### Day 1: After First Deployment

- [ ] Cron jobs appear in Vercel dashboard
- [ ] Founder dashboard is accessible
- [ ] Manual scraping works
- [ ] Database connection works
- [ ] Stats API returns data

### Day 2: After First Cron Run (2 AM)

- [ ] Check cron logs for scraping job
- [ ] Verify new leads in database
- [ ] No duplicate leads created
- [ ] Stats updated correctly

### Day 2: After First Email Campaign (3:30 AM)

- [ ] Check cron logs for campaign job
- [ ] Verify emails were sent (check logs)
- [ ] Lead statuses updated to "email_sent"
- [ ] Email timestamps recorded

### Day 4: After First Follow-up

- [ ] Follow-up emails sent to 48h+ old leads
- [ ] Lead statuses updated to "follow_up_sent"

### Day 6: After First "Not Interested" Marking

- [ ] Leads marked as "not_interested" after 48h
- [ ] Waitlist link still works for these leads

---

## 🔧 Troubleshooting

### Cron Jobs Not Running

1. **Check Cron Secret**
   ```bash
   # Verify CRON_SECRET is set in Vercel
   # Check cron endpoint logs for "Unauthorized" errors
   ```

2. **Check Cron Schedule**
   ```bash
   # Verify vercel.json has correct cron configuration
   # Times are in UTC, not IST
   ```

3. **Manual Test**
   ```bash
   # Test cron endpoint manually
   curl https://your-app.vercel.app/api/scrape/cron \
     -H "Authorization: Bearer your-cron-secret"
   ```

### Emails Not Sending

1. **Check SMTP Credentials**
   - Verify Gmail app password is correct
   - Check SMTP_HOST, SMTP_PORT are correct
   - Test with: `npm run send-initial -- --limit 1`

2. **Check Rate Limits**
   - Gmail: 500 emails/day max
   - Check logs for "Daily email limit reached"

3. **Check Email Format**
   - FROM_EMAIL must match SMTP_USERNAME
   - Verify FROM_NAME is set

### Scraping Returns 0 Leads

1. **Check JustDial Accessibility**
   - JustDial may block scrapers
   - Try different city names
   - Check scraper logs

2. **Use Google Maps API** (paid alternative)
   - Add GOOGLE_MAPS_API_KEY to env
   - Modify scraper to use Google Maps

---

## 📊 Monitoring Dashboard

### Key Metrics to Track

1. **Daily Scraping**
   - New leads scraped: 300-500/day
   - Duplicates skipped: Should increase over time
   - Cities covered: 15/day

2. **Email Campaigns**
   - Initial emails sent: 100/day
   - Follow-ups sent: 50/day
   - Conversion rate: Target 2-5%

3. **Waitlist Signups**
   - Track via founder dashboard
   - Goal: 200-500 before mid-May

### Set Up Alerts

**Vercel Notifications:**
- Enable deployment notifications
- Enable cron job failure alerts
- Email yourself daily summaries

**Custom Alerts (Optional):**
```typescript
// Add to cron endpoints
if (totalSaved === 0) {
  // Send alert to Slack/email
  console.error('⚠️ ALERT: No new leads scraped today!');
}
```

---

## ✅ Production Readiness Checklist

Before going fully live:

- [ ] All environment variables set in Vercel
- [ ] Changed default passwords (CRON_SECRET, FOUNDER_PASSWORD)
- [ ] Gmail app password working
- [ ] Tested scraping manually
- [ ] Tested email sending to yourself
- [ ] Verified cron jobs run on schedule
- [ ] Database schema up to date
- [ ] Waitlist webhook working
- [ ] Unsubscribe page created
- [ ] Founder dashboard secured
- [ ] Monitoring set up
- [ ] Daily email limit appropriate

---

## 🎯 Success Metrics

**Week 1:**
- 1,000+ leads scraped
- 500+ emails sent
- 10+ waitlist signups

**Week 2:**
- 2,000+ total leads
- 1,000+ emails sent
- 50+ waitlist signups

**By Mid-May:**
- 10,000+ total leads
- 5,000+ emails sent
- 200-500 waitlist signups ✅

---

## 🆘 Support

If you encounter issues:

1. Check Vercel deployment logs
2. Check cron job execution logs
3. Test manually via founder dashboard
4. Review environment variables
5. Check database connection
6. Verify email credentials

**Common Issues:**
- Cron not running → Check CRON_SECRET
- Emails not sending → Check SMTP credentials
- No leads scraped → Check JustDial accessibility
- Duplicates → Good! System working correctly
