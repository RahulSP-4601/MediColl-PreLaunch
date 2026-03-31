# Next.js Deployment Guide - QB24-Sales Pipeline

Complete guide to deploy QB24-Sales Next.js pipeline to Vercel with automated cron jobs.

---

## 🎯 Overview

You'll deploy the QB24-Sales pipeline to Vercel, which will:
- ✅ Host the Next.js app
- ✅ Run automated campaigns daily at 9 AM IST
- ✅ Integrate with your existing QuickBook24 product (same Supabase)
- ✅ Provide webhook endpoint for waitlist signups

---

## 📋 Prerequisites

1. ✅ GitHub account
2. ✅ Vercel account (free)
3. ✅ Supabase account (same as QuickBook24 product)
4. ✅ Gmail account (for SMTP)
5. ✅ Twilio account (optional, for WhatsApp)

---

## 🚀 Step-by-Step Deployment

### Step 1: Prepare Repository

```bash
# Navigate to project
cd /Users/rahulpanchal/Desktop/Project/QB24-Sales

# Initialize git (if not already)
git init

# Add all files
git add .

# Commit
git commit -m "Convert QB24-Sales to Next.js"

# Create GitHub repo and push
# Go to github.com → Create new repository → QB24-Sales-NextJS
git remote add origin https://github.com/YOUR_USERNAME/QB24-Sales-NextJS.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy to Vercel

1. **Go to [vercel.com](https://vercel.com)** and log in

2. **Click "Add New" → "Project"**

3. **Import your GitHub repository:**
   - Select "QB24-Sales-NextJS"
   - Click "Import"

4. **Configure project:**
   - Framework Preset: **Next.js** (auto-detected)
   - Root Directory: `./` (default)
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)

5. **Add Environment Variables** (click "Environment Variables"):

```env
# Supabase (SAME as QuickBook24 product)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...

# Email (Gmail SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-gmail-app-password
FROM_EMAIL=rahul@quickbook24.ai
FROM_NAME=Rahul Sanjay Panchal

# Email Limits
DAILY_EMAIL_LIMIT=500
HOURLY_EMAIL_LIMIT=50
MIN_DELAY_SECONDS=30

# WhatsApp (Twilio)
TWILIO_ACCOUNT_SID=ACxxxxx
TWILIO_AUTH_TOKEN=xxxxxxx
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886

# WhatsApp Limits
DAILY_WHATSAPP_LIMIT=100
WHATSAPP_DELAY_SECONDS=5

# Tracking
NEXT_PUBLIC_TRACKING_DOMAIN=track.quickbook24.com
NEXT_PUBLIC_UNSUBSCRIBE_URL=https://quickbook24.ai/unsubscribe
NEXT_PUBLIC_WAITLIST_URL=https://quickbook24.ai/waitlist

# Google Maps API (optional)
GOOGLE_MAPS_API_KEY=your-api-key

# User Agent
USER_AGENT=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36

# Target Audience
TARGET_TYPES=clinic,hospital
TARGET_CITIES=Mumbai,Delhi,Bangalore,Pune,Hyderabad,Chennai,Kolkata,Ahmedabad

# Feature Flags
ENABLE_WHATSAPP=true
ENABLE_SOCIAL_MEDIA_FINDER=true
ENABLE_ENHANCED_EMAIL_EXTRACTION=true

# Cron Secret (generate a random string)
CRON_SECRET=your-random-secret-key-here-generate-securely
```

6. **Click "Deploy"**

Wait 2-3 minutes for deployment to complete.

### Step 3: Setup Vercel Cron (Automated Campaigns)

The `vercel.json` file already configures a daily cron job:

```json
{
  "crons": [
    {
      "path": "/api/campaign/run",
      "schedule": "30 3 * * *"
    }
  ]
}
```

This runs **daily at 9 AM IST** (3:30 AM UTC).

**Vercel automatically:**
- ✅ Calls `/api/campaign/run` endpoint
- ✅ Sends `Authorization: Bearer ${CRON_SECRET}` header
- ✅ Runs campaign: initial emails → follow-ups → mark not interested

**No manual setup needed!** Vercel Cron is enabled automatically for Pro plans. For Hobby plan, upgrade to Pro ($20/month) to enable cron.

### Step 4: Verify Deployment

1. **Visit your deployed app:**
   ```
   https://qb24-sales-nextjs.vercel.app
   ```

2. **Test API endpoints:**

   ```bash
   # Get stats
   curl https://qb24-sales-nextjs.vercel.app/api/stats

   # Test scraping (dry run)
   curl -X POST https://qb24-sales-nextjs.vercel.app/api/scrape \
     -H "Content-Type: application/json" \
     -d '{
       "source": "justdial",
       "city": "Mumbai",
       "type": "clinic",
       "limit": 10,
       "enrichEmails": true,
       "findSocial": true
     }'
   ```

3. **Check cron logs:**
   - Go to Vercel dashboard → Your project → Logs
   - Filter by "cron" to see automated campaign runs

---

## 🔗 Integration with QuickBook24 Product

### Webhook Setup

Your QuickBook24 waitlist form should send a webhook when someone joins:

```javascript
// In your QuickBook24 waitlist form (quickbook24.ai/waitlist)

async function handleWaitlistSignup(email, name) {
  // Save to QuickBook24 database
  await saveToDatabase(email, name);

  // Send webhook to sales pipeline
  await fetch('https://qb24-sales-nextjs.vercel.app/api/webhook/waitlist', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, name }),
  });
}
```

This automatically updates lead status in sales pipeline from "email_sent" → "waitlisted"!

---

## 📊 Daily Workflow (Automated)

### What Happens Automatically Every Day at 9 AM IST:

```
1. Check for new leads (status="new")
   ↓
2. Send initial emails (max 100)
   → Update status to "email_sent"
   ↓
3. Check for leads 48+ hours after initial email
   ↓
4. Send follow-up emails (max 50)
   → Update status to "follow_up_sent"
   ↓
5. Check for leads 48+ hours after follow-up
   ↓
6. Mark as "not_interested" (link stays active!)
   ↓
7. Display stats in Vercel logs
```

**You do NOTHING!** System runs on autopilot.

### Manual Operations (When Needed):

```bash
# 1. Scrape new leads (do this weekly)
# Run locally or via API:
npm run scrape -- --source justdial --city Mumbai --limit 100

# Or via API:
curl -X POST https://qb24-sales-nextjs.vercel.app/api/scrape \
  -H "Content-Type: application/json" \
  -d '{"source": "justdial", "city": "Mumbai", "limit": 100}'

# 2. View stats
npm run stats

# Or via API:
curl https://qb24-sales-nextjs.vercel.app/api/stats

# 3. Manually mark someone as waitlisted
curl -X POST https://qb24-sales-nextjs.vercel.app/api/campaign/mark-waitlisted \
  -H "Content-Type: application/json" \
  -d '{"email": "user@clinic.com"}'
```

---

## 🔧 Running Locally (Development)

```bash
# Install dependencies
npm install

# Setup environment
cp .env.local.example .env.local
# Edit .env.local with your credentials

# Run development server
npm run dev

# Open http://localhost:3000

# Test scraping
npm run scrape -- --source justdial --city Mumbai --limit 10

# Test email sending (dry run)
npm run send-initial -- --limit 5 --dry-run

# View stats
npm run stats
```

---

## 📱 Monitoring & Logs

### Vercel Dashboard

1. **Go to:** [vercel.com/dashboard](https://vercel.com/dashboard)
2. **Select:** QB24-Sales-NextJS project
3. **Click:** "Logs" tab
4. **View:**
   - Real-time API requests
   - Cron job executions
   - Errors and warnings

### Supabase Dashboard

1. **Go to:** [app.supabase.io](https://app.supabase.io)
2. **Select:** Your project (same as QuickBook24)
3. **Click:** "Table Editor" → "leads"
4. **View:**
   - All leads with status
   - Conversion rates
   - Timestamp tracking

### Campaign Statistics API

```bash
# Get live stats
curl https://qb24-sales-nextjs.vercel.app/api/stats

# Response:
{
  "success": true,
  "stats": {
    "total_leads": 500,
    "new_leads": 100,
    "email_sent": 150,
    "follow_up_sent": 80,
    "waitlisted": 100,
    "not_interested": 70,
    "conversion_rate": 25.00
  }
}
```

---

## 💰 Cost Breakdown

### Vercel Pro (Required for Cron):
- **$20/month** - Unlimited cron jobs, unlimited bandwidth

### Supabase Pro (Optional):
- **$25/month** - 8GB database, 500K rows
- **Free tier works fine** for <500MB, <50K rows

### Twilio WhatsApp (Optional):
- **$0.005/message** (~₹0.40)
- **100 messages/day** = $15/month

### Gmail SMTP:
- **FREE** - 500 emails/day

### Google Maps API (Optional):
- **FREE** - 100 requests/month
- Use JustDial instead (no API key needed)

### Total Monthly Cost:
- **Minimum:** $20/month (Vercel Pro only)
- **With WhatsApp:** $35-50/month
- **With Supabase Pro:** $45-75/month

---

## 🔐 Security Best Practices

### 1. Environment Variables

✅ **DO:**
- Store all secrets in Vercel environment variables
- Use different `CRON_SECRET` than production passwords
- Rotate secrets every 3 months

❌ **DON'T:**
- Commit `.env.local` to GitHub
- Share environment variables publicly
- Reuse passwords across services

### 2. API Route Protection

```typescript
// All cron routes check authorization
const authHeader = request.headers.get('authorization');
if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}
```

### 3. Rate Limiting

Already built-in:
- **Email:** 500/day, 50/hour, 30s delay
- **WhatsApp:** 100/day, 5s delay
- **Scraping:** 1-3s delays between requests

### 4. Supabase RLS (Row Level Security)

Ensure RLS is enabled in Supabase:

```sql
-- Enable RLS on leads table
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Create policy (adjust as needed)
CREATE POLICY "Service role can do everything"
  ON leads
  FOR ALL
  TO service_role
  USING (true);
```

---

## 🐛 Troubleshooting

### Issue: Deployment Failed

**Solution:**
1. Check build logs in Vercel dashboard
2. Ensure all dependencies are in `package.json`
3. Verify TypeScript has no errors: `npm run build` locally

### Issue: Cron Not Running

**Solution:**
1. Verify Vercel Pro plan (Hobby plan doesn't support cron)
2. Check `vercel.json` exists and is valid
3. View cron logs in Vercel dashboard → Logs → Filter "cron"

### Issue: Email Not Sending

**Solution:**
1. Verify Gmail App Password (not regular password)
2. Enable "Less secure app access" in Gmail settings
3. Test connection: Visit `/api/stats` to check SMTP config

### Issue: Supabase Connection Failed

**Solution:**
1. Verify `NEXT_PUBLIC_SUPABASE_URL` and keys in Vercel
2. Check Supabase project is active
3. Ensure database schema is uploaded (see SYSTEM_OVERVIEW.md)

### Issue: WhatsApp Failed

**Solution:**
1. Verify Twilio credentials
2. Check WhatsApp sandbox is activated
3. Ensure phone numbers have `whatsapp:` prefix

---

## 📊 Expected Performance

### Week 1:
- **Scrape:** 500 leads
- **Emails sent:** 400
- **WhatsApp sent:** 100
- **Waitlisted:** 100-150 (25-37% conversion)

### Month 1:
- **Total leads:** 2,000
- **Total emailed:** 1,600
- **Waitlisted:** 400-600 (25-37% conversion)

### Cost per Waitlist Signup:
- **Email only:** ~₹0 (Gmail is free)
- **Email + WhatsApp:** ~₹1-2 per signup

---

## 🎉 Go Live Checklist

- [ ] GitHub repo created and pushed
- [ ] Vercel project deployed
- [ ] Environment variables added
- [ ] Supabase database schema uploaded
- [ ] Gmail SMTP configured with App Password
- [ ] Twilio WhatsApp setup (if using)
- [ ] Cron job verified (check Vercel logs)
- [ ] Webhook endpoint tested
- [ ] Test scraping: `npm run scrape -- --limit 10`
- [ ] Test email: `npm run send-initial -- --limit 5 --dry-run`
- [ ] Monitor first automated run (9 AM IST next day)

---

## 🚀 Next Steps

1. **Scrape initial leads:**
   ```bash
   npm run scrape -- --source justdial --city Mumbai --limit 500
   ```

2. **Let automation run:**
   - Cron job will send emails daily at 9 AM IST
   - Webhook will track waitlist signups automatically

3. **Monitor results:**
   - Check Vercel logs daily
   - View Supabase dashboard for conversions
   - Review stats: `curl https://your-app.vercel.app/api/stats`

4. **Scale up:**
   - Scrape more cities (Delhi, Bangalore, Pune)
   - Increase daily email limits if needed
   - Add more marketing channels (LinkedIn, cold calling)

---

**Your QB24-Sales pipeline is now fully automated on Vercel! 🎉**

The system will:
✅ Send initial emails automatically
✅ Send follow-ups 48 hours later
✅ Track waitlist signups via webhook
✅ Update lead status in real-time
✅ Run 24/7 without manual intervention

**Integration with QuickBook24 product complete! Both systems share the same Supabase database.**
