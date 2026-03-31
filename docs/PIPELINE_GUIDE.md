# QB24-Sales Pipeline Guide

## End-to-End Email Campaign Pipeline

This guide shows you how to run the complete email campaign pipeline from scraping to sending emails and tracking waitlist signups.

---

## Pipeline Overview

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐     ┌──────────────┐
│   SCRAPE    │ --> │   ENRICH     │ --> │    SEND     │ --> │    TRACK     │
│   Leads     │     │   Emails     │     │   Emails    │     │  Waitlist    │
└─────────────┘     └──────────────┘     └─────────────┘     └──────────────┘
```

### Status Flow:
1. **new** → Lead scraped and saved to database
2. **email_sent** → Initial email sent
3. **follow_up_sent** → Follow-up email sent (after 3 days)
4. **waitlisted** → User joined the waitlist

---

## Setup Instructions

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Configure Environment

```bash
# Copy example config
cp .env.example .env

# Edit .env with your credentials
nano .env
```

**Required Settings:**
```env
# SMTP (Gmail example)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password

FROM_EMAIL=rahul@quickbook24.ai
FROM_NAME=Rahul Sanjay Panchal

# Rate Limits
DAILY_EMAIL_LIMIT=500
HOURLY_EMAIL_LIMIT=50
MIN_DELAY_SECONDS=30

# Google Maps API (optional)
GOOGLE_MAPS_API_KEY=your-api-key

# Database (SQLite by default)
DATABASE_URL=sqlite:///qb24_sales.db
```

### 3. Initialize Database

```bash
python cli.py init-db
```

### 4. Test SMTP Connection

```bash
python cli.py test-smtp
```

---

## Step-by-Step Pipeline

### STEP 1: Scrape Leads

#### Option A: Google Maps (requires API key)

```bash
# Scrape clinics in Mumbai
python cli.py scrape --source google-maps --city Mumbai --type clinic --limit 100

# Scrape hospitals in Delhi
python cli.py scrape --source google-maps --city Delhi --type hospital --limit 50
```

#### Option B: JustDial (no API key needed)

```bash
# Scrape clinics in Mumbai from JustDial
python cli.py scrape --source justdial --city Mumbai --type clinic --limit 100
```

#### Option C: All Sources + Email Enrichment

```bash
# Scrape from all sources and extract emails from websites
python cli.py scrape --source all --city Bangalore --type clinic --limit 50 --enrich-emails
```

**What happens:**
- Leads are scraped from Google Maps / JustDial
- If `--enrich-emails` is used, visits each website to extract email addresses
- Saves leads to database with status = "new"
- Skips duplicates and leads without email

---

### STEP 2: Send Initial Emails

#### Preview (Dry Run)

```bash
# See which leads would receive emails
python cli.py send-initial --limit 10 --dry-run
```

#### Send Emails

```bash
# Send to 50 leads with status "new"
python cli.py send-initial --limit 50
```

**What happens:**
- Fetches leads with status = "new" and valid email
- Renders beautiful HTML + plain text emails
- Sends emails respecting rate limits
- Updates status to "email_sent"
- Records email_sent_at timestamp

---

### STEP 3: Wait 3 Days

The system automatically tracks when emails were sent. After 3 days, leads become eligible for follow-up.

---

### STEP 4: Send Follow-up Emails

#### Preview Follow-ups

```bash
# See which leads are eligible for follow-up
python cli.py send-followup --limit 10 --dry-run
```

#### Send Follow-ups

```bash
# Send follow-up to leads who received initial email 3+ days ago
python cli.py send-followup --limit 30
```

**What happens:**
- Fetches leads with status = "email_sent"
- Sent 3+ days ago
- Sends follow-up email
- Updates status to "follow_up_sent"

---

### STEP 5: Track Waitlist Signups

When a lead signs up for the waitlist, mark them as converted:

```bash
python cli.py mark-waitlisted --email contact@clinic.com
```

**What happens:**
- Updates lead status to "waitlisted"
- Records waitlisted_at timestamp
- Won't send further follow-ups

---

### STEP 6: Monitor Campaign

#### View Statistics

```bash
python cli.py stats
```

**Output:**
```
📊 QB24-Sales Campaign Statistics
==================================================
Total Leads:          250
  - New:              100
  - Email Sent:       80
  - Follow-up Sent:   50
  - Waitlisted:       20 ✓

Conversion Rate:      8.00%
==================================================
```

---

## Complete Campaign (Automated)

Run everything in one command:

```bash
# Send 50 initial + 20 follow-ups
python cli.py run-campaign --initial 50 --followup 20
```

---

## Daily Workflow

### Morning Routine (9 AM)

```bash
# 1. Scrape new leads
python cli.py scrape --source all --city Mumbai --type clinic --limit 50 --enrich-emails

# 2. Check stats
python cli.py stats

# 3. Run campaign
python cli.py run-campaign --initial 50 --followup 20
```

### Evening Check (6 PM)

```bash
# View results
python cli.py stats

# Mark any new waitlist signups (check your waitlist page)
python cli.py mark-waitlisted --email newlead@clinic.com
```

---

## Advanced Usage

### Scrape Multiple Cities

```bash
# Create a script to scrape multiple cities
for city in Mumbai Delhi Bangalore Pune Hyderabad; do
    python cli.py scrape --source justdial --city $city --type clinic --limit 30
done
```

### Rate Limiting

The system automatically enforces:
- **Daily Limit:** 500 emails/day (configurable in .env)
- **Hourly Limit:** 50 emails/hour
- **Min Delay:** 30 seconds between emails

---

## Email Deliverability Tips

### 1. Warm Up Your Domain

Start slow and increase gradually:

```bash
# Day 1-3: 20 emails/day
python cli.py send-initial --limit 20

# Day 4-7: 50 emails/day
python cli.py send-initial --limit 50

# Day 8+: 100-200 emails/day
python cli.py send-initial --limit 100
```

### 2. Monitor Bounce Rate

- Keep below 5%
- Remove bounced emails immediately
- Verify email addresses before sending

### 3. Set Up Email Authentication

- Configure SPF record
- Enable DKIM signing
- Set up DMARC policy

---

## Troubleshooting

### Problem: No emails being sent

```bash
# Test SMTP connection
python cli.py test-smtp

# Check configuration
python cli.py config

# Check if rate limit reached
python cli.py stats
```

### Problem: Scraped leads have no emails

```bash
# Use email enrichment
python cli.py scrape --source all --city Mumbai --type clinic --enrich-emails
```

### Problem: "Rate limit reached"

Wait for the next hour/day or increase limits in `.env`:

```env
DAILY_EMAIL_LIMIT=1000
HOURLY_EMAIL_LIMIT=100
```

---

## Database Structure

### Lead Statuses

| Status | Description |
|--------|-------------|
| `new` | Freshly scraped, ready for initial email |
| `email_sent` | Initial email sent, waiting for response |
| `follow_up_sent` | Follow-up email sent after 3 days |
| `waitlisted` | User joined waitlist (SUCCESS!) |

### Lead Fields

```python
{
    "name": "Dr. Sharma Clinic",
    "email": "contact@sharmaclinic.com",
    "phone": "+91 98765 43210",
    "address": "123 Main St, Mumbai",
    "city": "Mumbai",
    "state": "Maharashtra",
    "type": "clinic",  # or "hospital"
    "website": "https://sharmaclinic.com",
    "source": "google_maps",  # or "justdial"
    "status": "new",
    "email_sent_at": null,
    "follow_up_sent_at": null,
    "waitlisted_at": null
}
```

---

## CLI Commands Reference

### Database
- `python cli.py init-db` - Initialize database
- `python cli.py stats` - View campaign statistics
- `python cli.py config` - Show configuration

### Scraping
- `python cli.py scrape` - Scrape leads
  - `--source` - google-maps, justdial, or all
  - `--city` - City name
  - `--type` - clinic or hospital
  - `--limit` - Max results
  - `--enrich-emails` - Extract emails from websites

### Email Campaign
- `python cli.py test-smtp` - Test SMTP connection
- `python cli.py send-initial` - Send initial emails
  - `--limit` - Number to send
  - `--dry-run` - Preview without sending
- `python cli.py send-followup` - Send follow-up emails
  - `--limit` - Number to send
  - `--dry-run` - Preview without sending
- `python cli.py mark-waitlisted` - Mark lead as converted
  - `--email` - Email address
- `python cli.py run-campaign` - Run complete campaign
  - `--initial` - Initial emails to send
  - `--followup` - Follow-up emails to send

---

## Expected Results

### First 30 Days

With consistent daily scraping and sending:

| Week | Emails Sent | Waitlist Signups | Conv. Rate |
|------|-------------|------------------|------------|
| 1    | 350         | 5-10             | 1.5-3%     |
| 2    | 700         | 15-25            | 2-3.5%     |
| 3    | 1,400       | 30-50            | 2-3.5%     |
| 4    | 2,800       | 60-100           | 2-3.5%     |

**Target:** 200-500 waitlist signups before mid-May launch

---

## Support

For issues or questions:
1. Check logs in `logs/app.log`
2. Run `python cli.py stats` to diagnose
3. Review [plan.md](plan.md) for architecture details

---

## Next Steps

1. ✅ Set up environment and test SMTP
2. ✅ Scrape 100 test leads
3. ✅ Send 10 test emails
4. ✅ Monitor for 3 days
5. ✅ Send follow-ups
6. 📈 Scale to 100-500 emails/day
7. 🎯 Track conversion rate and optimize

**Good luck with your campaign! 🚀**
