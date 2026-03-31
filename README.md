# MediColl24-Sales Pipeline - Next.js

**Automated lead generation and email campaign system for MediColl24.**

**100% Next.js/TypeScript - All Python files removed ✓**

Target: **200-500 clinic/hospital waitlist signups** before mid-May launch.

---

## 🎯 What This Does

Automated sales pipeline that:
1. **Scrapes** clinic/hospital leads (JustDial, Google Maps)
2. **Enriches** with emails, Instagram, Facebook, LinkedIn
3. **Sends** initial emails + WhatsApp messages
4. **Waits 48 hours** → Sends follow-ups
5. **Waits 48 hours** → Marks as not interested (link stays active)
6. **Tracks** waitlist signups via webhook
7. **Converts** even "not interested" to "waitlisted" if they join later

**Everything runs automatically via Vercel Cron:**
- **2:00 AM IST** - Scrape new leads across India (15 random cities)
- **3:30 AM IST** - Send emails, follow-ups, and mark not interested

---

## 🚀 Quick Start

```bash
# 1. Install
npm install

# 2. Configure
cp .env.example .env
nano .env  # Add your credentials (same Supabase as MediColl24)

# 3. Run Locally
npm run dev

# 4. Access Founder Dashboard
# Navigate to http://localhost:3000/founder
# Password: medicoll24founder2024 (change in production!)

# 5. Manual Testing (from founder dashboard)
# - Click "Scrape New Leads" to test scraping
# - Click "Run Email Campaign" to test emails
# - View waitlisted leads and stats

# 6. CLI Commands (optional)
npm run scrape -- --source justdial --city Mumbai --limit 100
npm run send-initial -- --limit 10 --dry-run
npm run stats
```

**📖 Full Guides:**
- [NEXTJS_DEPLOYMENT_GUIDE.md](NEXTJS_DEPLOYMENT_GUIDE.md) - Deploy to Vercel
- [COMPLETE_AUTOMATION_FLOW.md](COMPLETE_AUTOMATION_FLOW.md) - How automation works

---

## 🎛️ Founder Dashboard

**Secure, password-protected dashboard for manual control and monitoring.**

### Access
- **URL:** `/founder`
- **Password:** Set in `NEXT_PUBLIC_FOUNDER_PASSWORD` env variable
- **Default:** `medicoll24founder2024` (⚠️ CHANGE IN PRODUCTION!)

### Features
- 📊 **Real-time Statistics**
  - Total leads, email sent, follow-ups, waitlisted
  - Conversion rate tracking
  - Campaign performance metrics

- 🔍 **Manual Scraping**
  - Test scraping before deployment
  - Scrapes 10 random cities across India
  - Shows scraped, saved, and duplicate counts

- 📧 **Manual Email Campaigns**
  - Test email sending without waiting for cron
  - Send initial + follow-up emails
  - See results immediately

- ✅ **Waitlist View**
  - See all waitlisted leads
  - Name, email, phone, city, join date
  - Export-ready table format

### Why Use Founder Dashboard?
1. **Testing:** Test scraping and emails before production deployment
2. **Monitoring:** Track campaign performance in real-time
3. **Manual Control:** Run campaigns on-demand without waiting for cron
4. **Debugging:** See exactly what's happening with your leads

### Security
- Password-protected (session-based)
- Not indexed by search engines
- Separate from public pages
- Only accessible with correct password

---

## 📧 Email Campaign

### Email 1: Waitlist Invitation
**Subject:** Never miss a patient call again

- Personal intro from CEO Rahul Panchal
- Clear value proposition for MediColl24
- 5 key benefits
- CTA: Join waitlist

### Email 2: Follow-up (3 days later)
**Subject:** Just checking — worth exploring for your clinic?

- Quick reminder
- Request for feedback
- Same CTA: Early access signup

**📖 Campaign Details:** [CAMPAIGN_SUMMARY.md](CAMPAIGN_SUMMARY.md)

---

## 🔄 Complete Pipeline

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐     ┌──────────────┐
│   SCRAPE    │ --> │   ENRICH     │ --> │    SEND     │ --> │    TRACK     │
│   Leads     │     │   Emails     │     │   Emails    │     │  Waitlist    │
└─────────────┘     └──────────────┘     └─────────────┘     └──────────────┘
```

### Status Flow:
- **new** → Lead scraped
- **email_sent** → Initial email sent
- **follow_up_sent** → Follow-up sent (after 3 days)
- **waitlisted** → User joined waitlist ✓

---

## 📊 Features

- ✅ **Multi-source scraping** (Google Maps API, JustDial)
- ✅ **India-wide coverage** (100+ cities, automated rotation)
- ✅ **Smart duplicate prevention** (never scrape same lead twice)
- ✅ **Email extraction** from clinic/hospital websites
- ✅ **Beautiful HTML emails** with gradient design
- ✅ **Rate limiting** (respects SMTP limits)
- ✅ **Automatic follow-ups** after 48 hours
- ✅ **Waitlist tracking** with conversion metrics
- ✅ **Founder dashboard** for manual control and testing
- ✅ **Compliance built-in** (unsubscribe links)
- ✅ **Automated cron jobs** (scraping + campaigns)

---

## 🛠️ Tech Stack

- **Next.js 14** - App Router
- **TypeScript** - Type safety
- **Supabase** - Cloud database (shared with MediColl24)
- **React Email** - Email templates
- **Nodemailer** - SMTP
- **Twilio** - WhatsApp
- **Cheerio** - Web scraping
- **Vercel** - Deployment + Cron

---

## 📁 Project Structure

```
MediColl24-Sales/
├── app/                          # Next.js App Router
│   ├── api/                     # API Routes
│   │   ├── scrape/              # Scraping endpoint
│   │   ├── campaign/            # Campaign endpoints
│   │   ├── stats/               # Statistics
│   │   └── webhook/             # Waitlist webhook
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Homepage
├── lib/                         # Core libraries
│   ├── supabase.ts             # Database client
│   ├── email.ts                # Email sender
│   ├── whatsapp.ts             # WhatsApp sender
│   ├── automation.ts           # Automation engine
│   └── scrapers/               # All scrapers
├── emails/                      # React Email templates
│   ├── InitialEmail.tsx        # Initial email
│   └── FollowUpEmail.tsx       # Follow-up email
├── scripts/                     # CLI scripts
│   ├── scrape.ts               # Scraping script
│   ├── send-initial.ts         # Send emails
│   ├── send-followup.ts        # Follow-ups
│   └── stats.ts                # Statistics
├── package.json                 # Dependencies
├── vercel.json                 # Vercel Cron config
└── tsconfig.json               # TypeScript config
```

---

## 📖 Documentation

- **[COMPLETE_AUTOMATION_FLOW.md](COMPLETE_AUTOMATION_FLOW.md)** - Complete automation workflow
- **[NEXTJS_DEPLOYMENT_GUIDE.md](NEXTJS_DEPLOYMENT_GUIDE.md)** - Deploy to Vercel
- **[CONVERSION_SUMMARY.md](CONVERSION_SUMMARY.md)** - Python → Next.js conversion
- **[CAMPAIGN_FLOW.md](CAMPAIGN_FLOW.md)** - Campaign flow details
- **[FREE_MARKETING_CHANNELS.md](FREE_MARKETING_CHANNELS.md)** - 9 free marketing channels

---

## 🎯 Expected Results

### 30-Day Campaign:

| Metric | Target |
|--------|--------|
| Emails Sent | 10,000 |
| Open Rate | 20%+ |
| Click Rate | 5%+ |
| Waitlist Signups | 200-500 |
| Conversion Rate | 2-3% |

---

## 🔧 Configuration

**Minimum Required (in `.env`):**

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password
FROM_EMAIL=rahul@medicoll24.ai
FROM_NAME=Rahul Sanjay Panchal
```

**Optional:**

```env
GOOGLE_MAPS_API_KEY=your-api-key
DAILY_EMAIL_LIMIT=500
HOURLY_EMAIL_LIMIT=50
```

---

## 📋 CLI Commands

### Scraping
```bash
npm run scrape -- --source justdial --city Mumbai --type clinic --limit 100
npm run scrape -- --source google_maps --city Bangalore --type hospital --limit 50
```

### Campaign
```bash
npm run send-initial -- --limit 50                  # Send initial emails
npm run send-followup -- --limit 30                 # Send follow-ups
npm run run-campaign                                # Run complete campaign
npm run stats                                       # View statistics
```

### API Routes
```bash
# Scrape via API
curl -X POST http://localhost:3000/api/scrape \
  -d '{"source": "justdial", "city": "Mumbai", "limit": 100}'

# Mark as waitlisted
curl -X POST http://localhost:3000/api/campaign/mark-waitlisted \
  -d '{"email": "user@clinic.com"}'

# Get stats
curl http://localhost:3000/api/stats
```

---

## 🎬 Example Workflow

```bash
# Day 1: Setup & scrape
npm install
npm run scrape -- --source justdial --city Mumbai --limit 500

# Day 1: Deploy to Vercel
git push  # Automatic deployment

# Daily at 9 AM IST: Cron job runs automatically
# - Sends initial emails
# - Sends follow-ups (48 hours later)
# - Marks as not interested (48 hours after follow-up)

# When someone joins: Webhook automatically updates status
# You do nothing! System runs on autopilot.

# Monitor: Check Vercel logs or run stats
npm run stats
```

---

## 🚦 Status

- ✅ Converted to Next.js/TypeScript
- ✅ All Python files removed
- ✅ Scraping modules complete
- ✅ Email system complete
- ✅ WhatsApp integration complete
- ✅ 48-hour automation complete
- ✅ Webhook integration complete
- ✅ Vercel Cron configured
- ✅ **Ready for production deployment!**

---

## 📝 License

Proprietary - MediColl24 Internal Use Only

---

## 🤝 Support

For issues:
1. Check `logs/app.log`
2. Run `python cli.py stats`
3. Review documentation in `PIPELINE_GUIDE.md`

---

**Built with ❤️ for MediColl24**

🎯 **Goal:** 200-500 waitlist signups before mid-May launch

🚀 **Deploy to Vercel and let automation handle the rest!**
