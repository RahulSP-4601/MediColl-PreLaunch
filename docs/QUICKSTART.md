# QB24-Sales Quick Start Guide

Get your email campaign running in 5 minutes!

---

## 🚀 Installation (2 minutes)

```bash
# 1. Install dependencies
pip install -r requirements.txt

# 2. Copy and edit environment config
cp .env.example .env
nano .env  # Add your SMTP credentials

# 3. Initialize database
python cli.py init-db

# 4. Test SMTP connection
python cli.py test-smtp
```

---

## 📧 Your First Campaign (3 minutes)

### Step 1: Scrape 20 Test Leads

```bash
python cli.py scrape \
  --source justdial \
  --city Mumbai \
  --type clinic \
  --limit 20 \
  --enrich-emails
```

### Step 2: Check What You Got

```bash
python cli.py stats
```

Output:
```
📊 QB24-Sales Campaign Statistics
Total Leads:          20
  - New:              20
  - Email Sent:       0
  - Follow-up Sent:   0
  - Waitlisted:       0
```

### Step 3: Send 5 Test Emails

```bash
# Preview first (dry run)
python cli.py send-initial --limit 5 --dry-run

# Actually send
python cli.py send-initial --limit 5
```

### Step 4: Wait 3 Days, Then Send Follow-up

```bash
# After 3 days
python cli.py send-followup --limit 5
```

### Step 5: Mark Waitlist Signups

```bash
# When someone joins your waitlist
python cli.py mark-waitlisted --email contact@clinic.com
```

---

## 🎯 Daily Production Workflow

### Morning (9 AM) - Scrape & Send

```bash
# Scrape 50 new leads
python cli.py scrape --source all --city Delhi --type clinic --limit 50 --enrich-emails

# Run campaign: 50 initial + 20 follow-ups
python cli.py run-campaign --initial 50 --followup 20
```

### Evening (6 PM) - Check Results

```bash
# View stats
python cli.py stats

# Mark any new waitlist signups
python cli.py mark-waitlisted --email newlead@example.com
```

---

## 📊 Complete Pipeline Example

```bash
# Day 1: Setup
python cli.py init-db
python cli.py test-smtp

# Day 1-2: Scrape 100 leads
python cli.py scrape --source all --city Mumbai --type clinic --limit 50
python cli.py scrape --source all --city Delhi --type clinic --limit 50

# Day 2: Send 50 initial emails
python cli.py send-initial --limit 50

# Day 5: Send 30 follow-ups (to those who didn't join waitlist)
python cli.py send-followup --limit 30

# Daily: Mark waitlist signups
python cli.py mark-waitlisted --email user@example.com

# Anytime: Check progress
python cli.py stats
```

---

## 🔧 Configuration

Edit `.env` for your settings:

```env
# Gmail SMTP Example
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password  # Use App Password, not regular password

# Sender Info
FROM_EMAIL=rahul@quickbook24.ai
FROM_NAME=Rahul Sanjay Panchal

# Limits
DAILY_EMAIL_LIMIT=500
HOURLY_EMAIL_LIMIT=50

# Optional: Google Maps API Key (for more reliable data)
GOOGLE_MAPS_API_KEY=your-api-key
```

---

## 🎨 Email Templates

Both HTML and text versions are ready:
- **Initial Email**: "Never miss a patient call again"
- **Follow-up**: "Just checking — worth exploring?"

Templates are in `config/email_templates/`

---

## 📈 Expected Results

| Metric | Target |
|--------|--------|
| Open Rate | 20%+ |
| Click Rate | 5%+ |
| Waitlist Signup | 2-3% |

**Goal:** 200-500 waitlist signups in 30 days

---

## ❓ Common Issues

### "SMTP authentication failed"

→ Use Gmail App Password (not your regular password)
→ Enable "Less secure app access" in Gmail settings

### "No emails being sent"

→ Check rate limits: `python cli.py stats`
→ Test connection: `python cli.py test-smtp`

### "Leads have no email addresses"

→ Use `--enrich-emails` flag when scraping
→ JustDial provides fewer emails than Google Maps

---

## 📚 Full Documentation

- **[PIPELINE_GUIDE.md](PIPELINE_GUIDE.md)** - Complete pipeline details
- **[CAMPAIGN_SUMMARY.md](CAMPAIGN_SUMMARY.md)** - Email campaign info
- **[plan.md](plan.md)** - Full architecture and implementation plan

---

## 🎯 Next Steps

1. ✅ Install and test SMTP
2. ✅ Scrape 10-20 test leads
3. ✅ Send 5-10 test emails
4. ✅ Monitor for 3 days
5. ✅ Send follow-ups
6. 📈 Scale to 100-500/day
7. 🎉 Reach 200+ waitlist signups

**Ready to get your first 100 signups? Let's go! 🚀**

---

**Questions?** Check the logs at `logs/app.log`
