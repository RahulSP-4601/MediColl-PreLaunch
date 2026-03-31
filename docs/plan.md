# QB24-Sales - Lead Generation & Cold Outreach System

## Project Overview
Automated lead generation and email outreach system to generate sales traction for QuickBook24 by targeting clinics and hospitals in India.

## Core Objectives
1. **Scrape** clinic and hospital contact information (emails, phone numbers)
2. **Send** 100-500 targeted cold emails per day
3. **Drive waitlist signups** for QB24 early access (launching mid-May / early June)
4. **Track** sent emails to prevent duplicates
5. **Follow-up** with automated email sequences
6. **Measure** response rates, waitlist signups, and feedback

---

## Architecture

### 1. Data Scraping Module (`scraper/`)

#### Sources for Lead Generation:
- **Google Maps API** - Clinic/hospital listings with contact info
- **JustDial** - Indian business directory for clinics and hospitals
- **Google Search** - "clinic email" + location searches
- **Hospital websites** - Direct scraping of contact pages
- **Healthcare directories** - Online listings of medical facilities

#### Scraping Strategy:
```python
# Target data structure
Lead = {
    "name": str,          # Clinic/Hospital name
    "email": str,         # Primary email
    "phone": str,         # Contact number
    "address": str,       # Location
    "city": str,          # City
    "state": str,         # State
    "type": str,          # "clinic" or "hospital"
    "specialty": str,     # Medical specialty
    "website": str,       # Website URL
    "source": str,        # Where it was scraped from
    "scraped_at": datetime
}
```

#### Implementation:
- **Selenium/Playwright** for JavaScript-heavy sites
- **BeautifulSoup** for static HTML parsing
- **Google Maps API** for verified business listings
- **Rotate proxies** to avoid IP bans
- **Rate limiting** to respect robots.txt and avoid detection
- **Data validation** to ensure email format correctness

---

### 2. Database Module (`database/`)

#### Schema Design:
```sql
-- Leads table
CREATE TABLE leads (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    type VARCHAR(50),  -- clinic, hospital
    specialty VARCHAR(100),
    website VARCHAR(255),
    source VARCHAR(100),
    status VARCHAR(50) DEFAULT 'new',  -- new, contacted, replied, interested, not_interested
    scraped_at TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Email campaigns table
CREATE TABLE campaigns (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    template_name VARCHAR(100),
    status VARCHAR(50) DEFAULT 'active',
    daily_limit INTEGER DEFAULT 100,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Sent emails table (prevent duplicates)
CREATE TABLE sent_emails (
    id SERIAL PRIMARY KEY,
    lead_id INTEGER REFERENCES leads(id),
    campaign_id INTEGER REFERENCES campaigns(id),
    email_type VARCHAR(50),  -- initial, follow_up_1, follow_up_2
    subject VARCHAR(255),
    sent_at TIMESTAMP DEFAULT NOW(),
    opened BOOLEAN DEFAULT FALSE,
    clicked BOOLEAN DEFAULT FALSE,
    replied BOOLEAN DEFAULT FALSE,
    bounced BOOLEAN DEFAULT FALSE,
    unsubscribed BOOLEAN DEFAULT FALSE,
    UNIQUE(lead_id, campaign_id, email_type)
);

-- Follow-up schedule table
CREATE TABLE follow_up_schedule (
    id SERIAL PRIMARY KEY,
    lead_id INTEGER REFERENCES leads(id),
    campaign_id INTEGER REFERENCES campaigns(id),
    scheduled_for TIMESTAMP NOT NULL,
    email_type VARCHAR(50),
    status VARCHAR(50) DEFAULT 'pending',  -- pending, sent, skipped
    created_at TIMESTAMP DEFAULT NOW()
);

-- Unsubscribe list
CREATE TABLE unsubscribes (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    reason TEXT,
    unsubscribed_at TIMESTAMP DEFAULT NOW()
);

-- Response tracking
CREATE TABLE responses (
    id SERIAL PRIMARY KEY,
    lead_id INTEGER REFERENCES leads(id),
    response_text TEXT,
    sentiment VARCHAR(50),  -- positive, neutral, negative
    interested BOOLEAN,
    received_at TIMESTAMP DEFAULT NOW()
);
```

#### Database Choice:
- **PostgreSQL** for production (supports JSONB for flexible lead data)
- **SQLite** for development/testing

---

### 3. Email Module (`email_sender/`)

#### SMTP Configuration:
```python
SMTP_CONFIGS = {
    "gmail": {
        "host": "smtp.gmail.com",
        "port": 587,
        "use_tls": True
    },
    "sendgrid": {
        "host": "smtp.sendgrid.net",
        "port": 587,
        "use_tls": True
    },
    "aws_ses": {
        "host": "email-smtp.region.amazonaws.com",
        "port": 587,
        "use_tls": True
    }
}
```

#### Email Templates:

**Initial Email Template:**
```html
Subject: Never Miss Another Patient Call at [CLINIC_NAME]

Hi [DOCTOR_NAME/CLINIC_NAME],

I noticed that [CLINIC_NAME] serves patients in [CITY]. I'm reaching out because many clinics in [CITY] are losing patients due to missed calls during busy hours.

QuickBook 24 is an AI voice agent that:
✓ Answers patient calls 24/7 - even after hours
✓ Books appointments automatically
✓ Sends SMS confirmations
✓ Reduces no-shows by 40%

We're currently working with 500+ clinics across India.

Would you be interested in a quick 10-minute demo to see how it works?

Best regards,
[YOUR_NAME]
QuickBook 24
www.quickbook24.com
+91 98765 43210

---
Click here to unsubscribe: [UNSUBSCRIBE_LINK]
```

**Follow-up 1 (3 days later):**
```
Subject: Quick question about [CLINIC_NAME]'s patient booking

Hi [NAME],

I sent you a note a few days ago about how QuickBook 24 helps clinics never miss a patient call.

I understand you're busy. Just wanted to check:

Are missed calls or after-hours booking a challenge for your practice?

If yes, I'd love to show you a 5-minute demo.
If no, I won't bother you again.

Best,
[YOUR_NAME]
```

**Follow-up 2 (7 days later):**
```
Subject: Last follow-up: AI receptionist for [CLINIC_NAME]

Hi [NAME],

This is my last follow-up. I don't want to spam you!

QuickBook 24 offers a 30-day free trial. No credit card required.

If you'd like to try it out, just reply "YES" and I'll set you up in 5 minutes.

Otherwise, I'll remove you from my list.

Cheers,
[YOUR_NAME]
```

#### Email Sending Strategy:
- **Rate limiting**: 100-500 emails/day (configurable)
- **Time distribution**: Spread throughout business hours (9 AM - 6 PM IST)
- **Warm-up period**: Start with 50/day, increase by 20/day
- **Domain reputation**: Use authenticated domain with SPF, DKIM, DMARC
- **Personalization**: Use recipient's name, clinic name, city
- **Tracking**: Embed tracking pixels for open rates (optional, privacy-conscious)

---

### 4. Follow-up Scheduler (`scheduler/`)

#### Follow-up Logic:
```python
FOLLOW_UP_SCHEDULE = {
    "initial": {
        "delay_days": 0,
        "template": "initial_email"
    },
    "follow_up_1": {
        "delay_days": 3,
        "template": "follow_up_1",
        "condition": "not_replied"
    },
    "follow_up_2": {
        "delay_days": 7,
        "template": "follow_up_2",
        "condition": "not_replied"
    },
    "follow_up_3": {
        "delay_days": 14,
        "template": "follow_up_3",
        "condition": "not_replied"
    }
}
```

#### Scheduler Implementation:
- **Cron job** or **Celery** for scheduled tasks
- Run every hour to check for pending follow-ups
- Skip follow-ups if lead replied, unsubscribed, or marked as not interested
- Respect unsubscribe requests immediately

---

### 5. Compliance & Ethics Module (`compliance/`)

#### Legal Compliance (Critical!):
1. **CAN-SPAM Act** (if targeting US)
   - Include physical address
   - Clear unsubscribe mechanism
   - Honor unsubscribe within 10 days
   - Don't use misleading subject lines

2. **GDPR** (if targeting EU)
   - Obtain consent or legitimate interest
   - Provide opt-out mechanism
   - Allow data deletion requests

3. **India IT Act 2000**
   - Section 66A (sending offensive messages)
   - Avoid spamming under Information Technology (Procedure and Safeguards for Interception, Monitoring and Decryption of Information) Rules 2009

#### Best Practices:
- **Unsubscribe link** in every email
- **Immediate unsubscribe** processing
- **Respect opt-outs** across all campaigns
- **Monitor bounce rates** (keep below 5%)
- **Monitor complaint rates** (keep below 0.1%)
- **Authenticate emails** (SPF, DKIM, DMARC)
- **Use real reply-to address** to receive responses

---

### 6. Analytics & Reporting (`analytics/`)

#### Metrics to Track:
```python
metrics = {
    "total_leads": int,
    "emails_sent_today": int,
    "emails_sent_total": int,
    "open_rate": float,      # % of emails opened
    "click_rate": float,     # % of links clicked
    "reply_rate": float,     # % of replies received
    "bounce_rate": float,    # % of bounced emails
    "unsubscribe_rate": float,
    "interested_leads": int,
    "positive_responses": int,
    "scheduled_demos": int,
    "daily_sending_status": {
        "target": int,
        "sent": int,
        "remaining": int
    }
}
```

#### Dashboard:
- Real-time sending status
- Campaign performance
- Lead quality scores
- Response sentiment analysis
- Geographic distribution of leads
- Best performing email templates

---

## Project Structure

```
QB24-Sales/
├── plan.md                 # This file
├── README.md              # Setup instructions
├── requirements.txt       # Python dependencies
├── .env.example          # Environment variables template
├── config/
│   ├── config.py         # Configuration management
│   ├── email_templates/  # Email HTML templates
│   └── smtp_config.json  # SMTP settings
├── scraper/
│   ├── __init__.py
│   ├── google_maps_scraper.py
│   ├── justdial_scraper.py
│   ├── practo_scraper.py
│   ├── website_scraper.py
│   ├── proxy_manager.py
│   └── data_validator.py
├── database/
│   ├── __init__.py
│   ├── models.py         # SQLAlchemy models
│   ├── migrations/       # Alembic migrations
│   └── seed.py           # Sample data
├── email_sender/
│   ├── __init__.py
│   ├── smtp_client.py    # SMTP connection handler
│   ├── template_engine.py # Jinja2 template rendering
│   ├── rate_limiter.py   # Email sending rate control
│   └── tracking.py       # Open/click tracking
├── scheduler/
│   ├── __init__.py
│   ├── follow_up_scheduler.py
│   └── cron_jobs.py
├── compliance/
│   ├── __init__.py
│   ├── unsubscribe_handler.py
│   ├── bounce_handler.py
│   └── spam_checker.py
├── analytics/
│   ├── __init__.py
│   ├── metrics.py
│   ├── reporting.py
│   └── dashboard.py
├── utils/
│   ├── __init__.py
│   ├── logger.py
│   ├── email_validator.py
│   └── text_utils.py
├── scripts/
│   ├── run_scraper.py    # Manual scraping script
│   ├── send_campaign.py  # Manual email sending
│   └── export_leads.py   # Export to CSV
├── tests/
│   ├── test_scraper.py
│   ├── test_email_sender.py
│   └── test_scheduler.py
└── cli.py                # Command-line interface
```

---

## Implementation Phases

### Phase 1: Foundation (Week 1)
- [ ] Set up project structure
- [ ] Configure database (PostgreSQL)
- [ ] Create database schema and migrations
- [ ] Set up SMTP connection
- [ ] Build email template engine
- [ ] Implement unsubscribe mechanism
- [ ] Create CLI interface

### Phase 2: Scraping (Week 2)
- [ ] Implement Google Maps scraper
- [ ] Implement JustDial scraper
- [ ] Implement Practo scraper
- [ ] Build proxy rotation system
- [ ] Add data validation and deduplication
- [ ] Test scraping with 100 sample leads

### Phase 3: Email System (Week 3)
- [ ] Build SMTP client with retry logic
- [ ] Implement rate limiting (100-500/day)
- [ ] Create email templates (initial + 3 follow-ups)
- [ ] Add personalization engine
- [ ] Implement tracking (opens, clicks)
- [ ] Build bounce handling

### Phase 4: Automation (Week 4)
- [ ] Build follow-up scheduler
- [ ] Implement cron jobs for automation
- [ ] Add response detection
- [ ] Build analytics dashboard
- [ ] Implement spam prevention checks
- [ ] Add error monitoring and logging

### Phase 5: Testing & Launch (Week 5)
- [ ] Send 10 test emails
- [ ] Send 50 emails/day for 3 days (warm-up)
- [ ] Send 100 emails/day for 3 days
- [ ] Scale to 200-500 emails/day
- [ ] Monitor metrics and adjust
- [ ] A/B test different subject lines

---

## Technology Stack

### Core:
- **Python 3.10+**
- **PostgreSQL** (database)
- **SQLAlchemy** (ORM)
- **Alembic** (migrations)

### Scraping:
- **Selenium** / **Playwright** (browser automation)
- **BeautifulSoup4** (HTML parsing)
- **Requests** (HTTP requests)
- **Google Maps API** (official data)

### Email:
- **smtplib** (built-in SMTP)
- **Jinja2** (template engine)
- **email.mime** (email composition)
- **Mailgun** / **SendGrid** / **AWS SES** (optional for better deliverability)

### Automation:
- **APScheduler** (Python job scheduler)
- **Celery** + **Redis** (optional for production)
- **Cron** (system scheduler)

### Analytics:
- **Pandas** (data analysis)
- **Matplotlib** / **Plotly** (visualizations)
- **Streamlit** (dashboard UI)

### Utilities:
- **python-dotenv** (environment variables)
- **loguru** (logging)
- **pydantic** (data validation)
- **click** (CLI framework)

---

## Configuration

### Environment Variables (`.env`):
```env
# Database
DATABASE_URL=postgresql://user:password@localhost/qb24_sales

# SMTP Settings
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password
FROM_EMAIL=sales@quickbook24.com
FROM_NAME=QuickBook 24 Team

# Sending Limits
DAILY_EMAIL_LIMIT=500
HOURLY_EMAIL_LIMIT=50
MIN_DELAY_SECONDS=30

# Tracking
ENABLE_OPEN_TRACKING=true
ENABLE_CLICK_TRACKING=true
TRACKING_DOMAIN=track.quickbook24.com

# Unsubscribe
UNSUBSCRIBE_URL=https://quickbook24.com/unsubscribe

# Scraping
PROXY_LIST=proxy1.com:8080,proxy2.com:8080
USER_AGENT=Mozilla/5.0 (compatible; QB24Bot/1.0)

# API Keys
GOOGLE_MAPS_API_KEY=your-api-key
```

---

## Email Deliverability Best Practices

### 1. Domain Setup:
- Use a subdomain (e.g., `mail.quickbook24.com`)
- Set up SPF record
- Set up DKIM signing
- Set up DMARC policy
- Add reverse DNS (PTR record)

### 2. Sender Reputation:
- Start slow (50 emails/day)
- Gradually increase (20% per week)
- Monitor bounce rates (<5%)
- Monitor complaint rates (<0.1%)
- Use a dedicated IP (if sending 100k+/month)

### 3. Content Quality:
- Avoid spam trigger words ("free", "guarantee", "click here")
- Maintain text-to-image ratio (60% text, 40% images)
- Include unsubscribe link
- Use proper grammar and spelling
- Personalize each email

### 4. List Hygiene:
- Remove hard bounces immediately
- Remove unsubscribes immediately
- Remove non-responders after 3 follow-ups
- Verify email addresses before sending
- Clean list every 3 months

---

## Success Metrics & KPIs

### Target Metrics (First 30 Days):
- **Emails sent**: 10,000
- **Open rate**: >20%
- **Click rate**: >5% (500 clicks to waitlist page)
- **Waitlist signups**: >2% (200 signups)
- **Reply rate**: >1% (100 replies - including feedback)
- **Positive feedback**: >50% of replies

### Weekly Goals:
- Week 1: 350 emails, 20% open rate, 10 waitlist signups
- Week 2: 700 emails, 5% click rate, 30 waitlist signups
- Week 3: 1,400 emails, 2% signup rate, 60 waitlist signups
- Week 4: 2,800 emails, maintain 2%+ signup rate, 100+ total signups

### Campaign Goal:
**Get 200-500 qualified clinics/hospitals on the waitlist before mid-May launch**

---

## Risk Mitigation

### Risks & Solutions:
1. **Spam complaints** → Use double opt-in, clear unsubscribe, quality content
2. **Low deliverability** → Warm-up period, authenticate domain, monitor metrics
3. **IP/domain blacklisting** → Use reputable SMTP provider, follow best practices
4. **Legal issues** → Include unsubscribe, physical address, honor opt-outs
5. **Low response rates** → A/B test subject lines, improve targeting, better copy
6. **Data quality** → Validate emails, verify businesses exist, remove bounces

---

## Alternative Approach: Paid Lead Generation

If scraping proves difficult or ineffective, consider:
1. **LinkedIn Sales Navigator** ($79/month) - Filter by healthcare professionals
2. **ZoomInfo** ($) - B2B contact database
3. **Apollo.io** ($) - Sales intelligence platform
4. **IndiaMART** - Indian business directory with verified contacts
5. **Paid ads** - Google/Facebook ads to landing page with lead form

---

## Compliance Checklist

Before sending any emails:
- [ ] Unsubscribe link in every email
- [ ] Physical address in footer
- [ ] Real reply-to email address
- [ ] Clear sender identification
- [ ] Accurate subject lines (no clickbait)
- [ ] Honor unsubscribes within 24 hours
- [ ] SPF, DKIM, DMARC configured
- [ ] Bounce handling implemented
- [ ] Privacy policy accessible
- [ ] Terms of service for email list

---

## Next Steps

1. **Review this plan** and adjust based on your goals
2. **Set up infrastructure** (database, SMTP account)
3. **Start with Phase 1** (foundation)
4. **Test with 10 emails** to friends/test accounts
5. **Scale gradually** from 50 to 500 emails/day
6. **Monitor metrics** and optimize
7. **Iterate on email copy** based on responses

---

## Expected Timeline

- **Week 1-2**: Build foundation + scraping
- **Week 3**: Email system + templates
- **Week 4**: Automation + scheduler
- **Week 5**: Testing + launch
- **Week 6+**: Scale to 500 emails/day

**Total: 6-8 weeks to production-ready system**

---

## Estimated Costs

- **SMTP Service** (SendGrid/Mailgun): $0-50/month (for 10k-100k emails)
- **Database Hosting** (Heroku/AWS): $10-30/month
- **Proxy Service** (for scraping): $20-50/month
- **Google Maps API**: $0-100/month (depending on usage)
- **Domain & Email Authentication**: $10/year

**Total: ~$50-150/month**

---

## Questions to Answer Before Starting

1. Do we have approval to send cold emails? ✓
2. What's our target audience? **Clinics and Hospitals** ✓
3. Which cities/states should we focus on?
4. What email provider will we use? (Gmail, SendGrid, AWS SES?)
5. Do we have a domain for sending? (e.g., mail.quickbook24.com)
6. Who will handle responses? (sales team ready?)
7. What's our conversion goal? (demos, signups, trials?)

---

## Notes

- This is a **lead generation tool**, not a spam tool
- Focus on **quality over quantity**
- **Personalize** every email - use recipient's name, clinic name, city
- **Provide value** - explain how QB24 solves their problem
- **Be respectful** - honor unsubscribes immediately
- **Monitor metrics** - if open rate <15%, improve subject lines
- **Test everything** - A/B test subject lines, email copy, send times
- **Stay compliant** - follow anti-spam laws religiously

---

*This is a living document. Update as we learn and iterate.*
