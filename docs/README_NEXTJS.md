# QB24-Sales Pipeline - Next.js Version

Complete lead generation and email campaign system for QuickBook 24, now in Next.js!

## 🚀 Features

- ✅ **Dual-channel marketing**: Email + WhatsApp
- ✅ **Enhanced email extraction**: Finds ANY email (contact@, info@, personal emails)
- ✅ **Social media finder**: Instagram & Facebook for leads without email/phone
- ✅ **LinkedIn finder**: Decision maker profiles
- ✅ **48-hour follow-up system**: Automated timing
- ✅ **Cloud database**: Supabase (same as QuickBook24 product)
- ✅ **Beautiful email templates**: React Email with gradient design
- ✅ **Automated campaigns**: Vercel Cron jobs
- ✅ **API routes**: RESTful endpoints for all operations
- ✅ **CLI scripts**: Command-line tools for manual operations

## 📦 Installation

```bash
# Install dependencies
npm install

# Or with yarn
yarn install
```

## ⚙️ Configuration

### 1. Create `.env.local` file

```bash
cp .env.local.example .env.local
```

### 2. Add your credentials

```env
# Supabase (same as QuickBook24 product)
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

# WhatsApp (Twilio)
TWILIO_ACCOUNT_SID=ACxxxxx
TWILIO_AUTH_TOKEN=xxxxxxx
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886

# Tracking
NEXT_PUBLIC_WAITLIST_URL=https://quickbook24.ai/waitlist
NEXT_PUBLIC_UNSUBSCRIBE_URL=https://quickbook24.ai/unsubscribe

# Google Maps API (optional)
GOOGLE_MAPS_API_KEY=your-api-key

# Cron Secret (for API route protection)
CRON_SECRET=your-random-secret-key-here
```

### 3. Setup Supabase Database

Run the schema from [SYSTEM_OVERVIEW.md](SYSTEM_OVERVIEW.md) in your Supabase SQL editor.

## 🎯 Usage

### CLI Scripts

```bash
# 1. Scrape leads from JustDial
npm run scrape -- --source justdial --city Mumbai --type clinic --limit 100

# 2. Scrape from Google Maps
npm run scrape -- --source google_maps --city Bangalore --type hospital --limit 50

# 3. Send initial emails
npm run send-initial -- --limit 50

# 4. Send follow-up emails (48hrs after initial)
npm run send-followup -- --limit 50

# 5. Run complete campaign
npm run run-campaign -- --initial 100 --followup 50

# 6. View campaign statistics
npm run stats

# Dry run (test without sending)
npm run send-initial -- --limit 10 --dry-run
```

### API Routes

#### Scrape Leads

```bash
curl -X POST http://localhost:3000/api/scrape \
  -H "Content-Type: application/json" \
  -d '{
    "source": "justdial",
    "city": "Mumbai",
    "type": "clinic",
    "limit": 100,
    "enrichEmails": true,
    "findSocial": true
  }'
```

#### Send Initial Emails

```bash
curl -X POST http://localhost:3000/api/campaign/send-initial \
  -H "Content-Type: application/json" \
  -d '{
    "limit": 50,
    "dryRun": false
  }'
```

#### Send Follow-ups

```bash
curl -X POST http://localhost:3000/api/campaign/send-followup \
  -H "Content-Type: application/json" \
  -d '{
    "limit": 50,
    "dryRun": false
  }'
```

#### Run Complete Campaign

```bash
curl -X POST http://localhost:3000/api/campaign/run \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-cron-secret" \
  -d '{
    "initialLimit": 100,
    "followupLimit": 50,
    "markNotInterested": true,
    "dryRun": false
  }'
```

#### Mark as Waitlisted

```bash
curl -X POST http://localhost:3000/api/campaign/mark-waitlisted \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@clinic.com"
  }'
```

#### Get Statistics

```bash
curl http://localhost:3000/api/stats
```

### Webhook Integration

Configure your QuickBook24 waitlist form to send webhook to:

```
POST https://your-vercel-app.vercel.app/api/webhook/waitlist

Body:
{
  "email": "user@clinic.com",
  "name": "Dr. Sharma"
}
```

This automatically updates lead status when someone joins the waitlist!

## 🔄 Campaign Flow

```
Day 1: Scrape 100 leads → Save to Supabase
       ↓
       Send initial email/WhatsApp (status: new → email_sent)
       ↓
Day 3: Wait 48 hours
       ↓
       Send follow-up (status: email_sent → follow_up_sent)
       ↓
Day 5: Wait 48 hours
       ↓
       Mark as not interested (status: follow_up_sent → not_interested)
       * Waitlist link stays active!
```

## 🚀 Deployment to Vercel

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "QB24-Sales Next.js pipeline"
git push
```

### 2. Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repo
3. Add environment variables (from `.env.local`)
4. Deploy!

### 3. Setup Vercel Cron

The cron job is configured in `vercel.json`:

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

This runs daily at 9 AM IST (3:30 AM UTC).

**Important**: Add `CRON_SECRET` to Vercel environment variables and configure Vercel Cron to send `Authorization: Bearer YOUR_CRON_SECRET` header.

## 📊 Database Schema

Same Supabase database as QuickBook24 product:

```sql
CREATE TABLE leads (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE,
  phone VARCHAR(20),
  city VARCHAR(100),
  type VARCHAR(50),
  status VARCHAR(50) DEFAULT 'new',
  instagram VARCHAR(255),
  facebook VARCHAR(255),
  linkedin_profile TEXT,
  email_sent_at TIMESTAMPTZ,
  follow_up_sent_at TIMESTAMPTZ,
  waitlisted_at TIMESTAMPTZ,
  not_interested_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT leads_email_phone_check CHECK (email IS NOT NULL OR phone IS NOT NULL)
);
```

See [SYSTEM_OVERVIEW.md](SYSTEM_OVERVIEW.md) for complete schema.

## 🔐 Security

- ✅ Environment variables (no hardcoded secrets)
- ✅ Cron route protected with Bearer token
- ✅ Rate limiting (500 emails/day, 100 WhatsApp/day)
- ✅ Supabase Row Level Security
- ✅ HTTPS only

## 📈 Expected Results

### Week 1:
- Scrape: 500 leads
- Email sent: 400
- WhatsApp sent: 100
- Waitlisted: 100-150 (25-37% conversion)

### Month 1:
- Total leads: 2,000
- Total emailed: 1,600
- Waitlisted: 400-600 (25-37% conversion)

## 🛠️ Tech Stack

- **Next.js 14** - App Router
- **TypeScript** - Type safety
- **Supabase** - Cloud database (shared with QuickBook24)
- **React Email** - Beautiful email templates
- **Nodemailer** - SMTP email sending
- **Twilio** - WhatsApp messaging
- **Cheerio** - Web scraping
- **Axios** - HTTP requests
- **Vercel** - Deployment & Cron jobs

## 📚 Documentation

- [SYSTEM_OVERVIEW.md](SYSTEM_OVERVIEW.md) - Complete system overview
- [CAMPAIGN_FLOW.md](CAMPAIGN_FLOW.md) - Campaign flow details
- [FREE_MARKETING_CHANNELS.md](FREE_MARKETING_CHANNELS.md) - 9 free marketing channels
- [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) - Python version deployment (for reference)

## 🆘 Troubleshooting

### SMTP Error

```bash
# Test SMTP connection
node -e "require('./lib/email').emailSender.testConnection()"
```

### Twilio Error

```bash
# Test Twilio connection
node -e "require('./lib/whatsapp').whatsappSender.testConnection()"
```

### Supabase Error

Check environment variables and ensure database schema is uploaded.

## 📞 Support

Questions? Check the documentation or contact Rahul.

---

**Built with ❤️ for QuickBook 24**
