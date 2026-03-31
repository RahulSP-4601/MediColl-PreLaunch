# QB24-Sales Enhanced System - Complete Overview

## 🎯 What This System Does (Simple Explanation)

Think of this as your **automated sales assistant** that works 24/7:

1. **Finds** clinic/hospital contacts (name, email, phone, Instagram)
2. **Stores** them in cloud database (Supabase - accessible anywhere)
3. **Sends** emails AND WhatsApp messages automatically
4. **Tracks** who joined your waitlist
5. **Follows up** with those who didn't respond
6. **Runs automatically** every day without you touching it

---

## 📊 Complete Flow (Enhanced Version)

### **STEP 1: Finding Leads (Improved)**

**What happens:**
- System visits JustDial/Google Maps
- Gets 100 clinics in Mumbai
- For each clinic:
  - ✅ Extracts name, phone, address, website
  - ✅ Visits website → Looks for **ANY** email (not just contact@)
  - ✅ Searches for Instagram handle
  - ✅ Searches for Facebook page
- **ONLY saves if email OR phone exists**

**Example Results:**

```
Out of 100 clinics scraped:
- 30 have email → ✓ SAVED
- 40 have phone only → ✓ SAVED
- 20 have neither email nor phone BUT have Instagram → ✓ SAVED
- 10 have nothing → ✗ NOT SAVED
```

**Command:**
```bash
python cli.py scrape --source justdial --city Mumbai --type clinic --limit 100 --enrich-emails --find-social
```

**What gets saved:**

| Name | Email | Phone | Instagram | Facebook | Status |
|------|-------|-------|-----------|----------|--------|
| Dr. Sharma Clinic | contact@sharma.com | +91-98765... | @sharmaclinic | fb.com/sharma | new |
| Apollo Hospital | info@apollo.in | +91-80-2630... | @apollohospitals | fb.com/apollo | new |
| Max Healthcare | - | +91-11-2651... | @maxhealthcare | fb.com/max | new |
| City Clinic | - | - | @cityclinicmumbai | - | new |

**Note:** The 4th clinic (City Clinic) has NO email or phone, but we found their Instagram → **SAVED!**

---

### **STEP 2: Storing in Cloud (Supabase)**

**What is Supabase?**
- Like Google Sheets, but smarter
- Accessible from anywhere (web, mobile, API)
- Real-time updates
- You can see data at: `app.supabase.io/project/xxx/editor`

**Why Supabase instead of local database?**
- ✅ Access from anywhere (not just your computer)
- ✅ Real-time dashboard
- ✅ Automatic backups
- ✅ API access (webhook integration)
- ✅ Can build mobile app later

**Your data is stored at:**
```
https://xxxxx.supabase.co
Table: leads
```

---

### **STEP 3: Dual-Channel Marketing**

**Now you can reach leads via:**

#### **Channel 1: Email** 📧

```bash
python cli.py send-initial --limit 50
```

**Sends to:** Leads with email
**Message:** HTML email with your signature
**Rate:** 50/hour, 500/day

#### **Channel 2: WhatsApp** 💬

```bash
python cli.py send-whatsapp --limit 50
```

**Sends to:** Leads with phone number
**Message:** WhatsApp text with link
**Rate:** 100/day
**Cost:** $0.005 per message (~₹0.40)

**Example WhatsApp Message:**
```
🎯 QuickBook 24 - Never Miss a Patient Call

Hello Dr. Sharma!

We're building QB24 - a 24/7 AI voice receptionist for clinics.

✅ Answers every call (24/7)
✅ Books appointments automatically

🚀 Launching mid-May

Join waitlist:
👉 https://quickbook24.ai/waitlist

Thanks!
Rahul - QuickBook 24
```

---

### **STEP 4: Enhanced Email Extraction**

**Old way:** Only found `contact@domain.com`

**New way:** Finds **ANY** email:
- ✅ `contact@domain.com`
- ✅ `info@domain.com`
- ✅ `admin@domain.com`
- ✅ `support@domain.com`
- ✅ `drsharm@gmail.com` (personal email)
- ✅ `clinic.mumbai@yahoo.com`
- ✅ Hidden emails in footer, about page, team page

**How it works:**
1. Visits homepage
2. Visits /contact page
3. Visits /about page
4. Visits /team page
5. Checks all links for emails
6. Checks mailto: links
7. Checks meta tags
8. **Finds ALL emails** → Picks best one

**Priority order:**
1. Email matching business name (sharma.clinic@gmail.com for Sharma Clinic)
2. Professional emails (contact@, info@, support@)
3. Any other valid email

---

### **STEP 5: Social Media Finder (For Those Without Email/Phone)**

**Problem:** 30 out of 100 leads have NO email or phone

**Solution:** Find them on Instagram/Facebook!

**How it works:**

1. **From Website:**
   - Looks for Instagram icon links
   - Finds "@clinicname" in footer
   - Extracts Facebook page URL

2. **From Google Search:**
   - Searches: "Dr. Sharma Clinic Mumbai Instagram"
   - Finds their Instagram handle
   - Searches: "Apollo Hospital Bangalore Facebook"
   - Finds Facebook page

**Result:**
```
Lead: City Clinic Mumbai
  Email: None
  Phone: None
  → Searching...
  → Found: Instagram: @cityclinicmumbai
  → Found: Facebook: facebook.com/cityclinicmumbai
  → SAVED! ✓
```

**You can now:**
- Send Instagram DM manually
- Run Instagram DM automation (future feature)
- Comment on their posts
- Send Facebook message

---

### **STEP 6: Validation (Only Save Useful Leads)**

**Rule:** Lead must have **at least ONE** of:
- Email
- Phone number
- Instagram
- Facebook

**Examples:**

✅ **SAVED:**
- Dr. Sharma: email + phone + Instagram
- Apollo: email + phone
- Max: phone only
- City Clinic: Instagram only

✗ **NOT SAVED:**
- Random Clinic: No email, no phone, no social media, just address

**This ensures you only save leads you can actually reach!**

---

## 🔄 Automated Daily Workflow (Cloud Deployment)

### **Setup Once (Deployment)**

1. **Create Supabase account** → Get database URL and key
2. **Create Twilio account** → Get WhatsApp credentials
3. **Push code to GitHub**
4. **Deploy to Railway.app** → Add environment variables
5. **Setup cron job** → Runs every day at 9 AM

### **What Happens Automatically Every Day:**

```
9:00 AM IST - Railway cron job triggers
    ↓
[Reads Supabase database]
    ↓
Step 1: Send initial emails (50 leads with status="new")
    ↓
Step 2: Send WhatsApp messages (50 leads with phone)
    ↓
Step 3: Send follow-ups (48hrs+ after initial)
    ↓
Step 4: Mark non-responders as "not_interested"
    ↓
[Updates Supabase database]
    ↓
Done! ✓
```

**You do NOTHING!** System runs on autopilot.

---

## 📊 Real-time Dashboard

**Access your data from anywhere:**

```
1. Open browser
2. Go to: https://app.supabase.io/project/xxx/editor
3. View leads table
4. See stats:
   - Total leads: 500
   - Email sent: 200
   - Waitlisted: 75
   - Conversion rate: 37.5%
```

**Or check from CLI:**
```bash
railway run python cli.py stats
```

**Output:**
```
📊 QB24-Sales Campaign Statistics
==================================================
Total Leads:          500
  - New:              100
  - Email Sent:       150 (waiting 48hrs)
  - Follow-up Sent:   80  (waiting 48hrs)
  - Not Interested:   70  (link active)
  - Waitlisted:       100 ✓✓✓

Total Emailed:        400
Conversion Rate:      25.00%
==================================================
```

---

## 🎯 Example: 100 Leads Journey

### **Day 1 - Scraping:**

```bash
python cli.py scrape --source justdial --city Mumbai --type clinic --limit 100 --enrich-emails --find-social
```

**Results:**
- 100 clinics found
- 30 have email (from website)
- 40 have phone only
- 20 have Instagram/Facebook only
- 10 have nothing → NOT SAVED
- **Saved: 90 leads** ✓

**Breakdown:**
- 30 leads: email + phone + social
- 30 leads: email only
- 20 leads: phone only
- 10 leads: social media only

---

### **Day 1 - Send Initial Messages:**

**Email Campaign:**
```bash
python cli.py send-initial --limit 60
```
- Sends to 60 leads with email
- Status: "new" → "email_sent"

**WhatsApp Campaign:**
```bash
python cli.py send-whatsapp --limit 30
```
- Sends to 30 leads with phone (who didn't get email)
- Status: "new" → "whatsapp_sent"

**Total Reached: 90 leads** ✓

---

### **Day 2 - Conversions:**

**What you do:**
- Check quickbook24.ai/waitlist
- See 20 people joined
- Mark them:

```bash
python cli.py mark-waitlisted --email user1@clinic.com
python cli.py mark-waitlisted --email user2@clinic.com
# ... 20 total
```

**Database now:**
- 20 leads: "waitlisted" ✓
- 70 leads: "email_sent" / "whatsapp_sent" (waiting)

---

### **Day 3 - Follow-ups (48 hours later):**

```bash
# Automatic (via cron) or manual:
python cli.py send-followup --limit 100
```

**System checks:**
- Who got email/WhatsApp 48+ hours ago?
- Who hasn't joined waitlist?
- Sends follow-up to 70 leads

**Database:**
- 20 "waitlisted" ✓
- 70 "follow_up_sent" (just sent)

---

### **Day 5 - Mark Non-Responders:**

```bash
python cli.py mark-not-interested
```

- 50 leads still didn't join
- Status: "follow_up_sent" → "not_interested"
- But link stays active!

**Final Stats:**
- 20 "waitlisted" from initial
- 10 "waitlisted" from follow-up (converted after 48hrs)
- 60 "not_interested" (but can still join later!)

**Conversion: 30/90 = 33%** 🎉

---

## 🌐 How Deployment Works (Simple)

### **Without Deployment (Local):**
- You run: `python cli.py run-campaign`
- Computer must be ON and connected
- You must run it manually every day
- Only works on your computer

### **With Deployment (Cloud):**
- Code runs on Railway's servers (cloud)
- Runs 24/7 automatically
- Scheduled via cron job (9 AM every day)
- Accessible from anywhere
- You don't need to do anything!

**Think of it like:**
- **Local:** You manually turning on a light switch every day
- **Deployed:** Smart home that turns on lights automatically at 7 AM

---

## 📱 Instagram/Social Media Strategy

**For leads with only Instagram/Facebook:**

### **Manual Approach (Simple):**

1. **Export leads with social media only:**
```bash
python cli.py export-social-media-leads
```

2. **Get CSV file:**
```
Name, Instagram, Facebook, City
City Clinic, @cityclinicmumbai, fb.com/cityclinic, Mumbai
...
```

3. **Reach out manually:**
- Send Instagram DM
- Comment on their posts
- Send Facebook message

### **Automated Approach (Future):**

- Use Instagram API (requires approval)
- Auto-send DMs
- Auto-comment on posts
- Track responses

**For now:** Manual outreach to Instagram/Facebook leads is fastest.

---

## 💰 Cost Breakdown (Real Numbers)

### **Monthly Costs:**

| Service | Cost | What For |
|---------|------|----------|
| Supabase | $0 (Free tier) or $25 (Pro) | Cloud database |
| Railway | $5/month | Automated deployment |
| Twilio WhatsApp | $0.005/message | WhatsApp messages |
| Gmail SMTP | Free | Email sending |
| Google Maps API | $0 (100 free requests) | Scraping |

**Example Costs for 10,000 leads/month:**

- 5,000 emails → Free (Gmail)
- 5,000 WhatsApp → $25 (5,000 × $0.005)
- Supabase → $25 (Pro plan)
- Railway → $5

**Total: ~$55/month** to reach 10,000 leads

**Cost per lead: $0.0055** (₹0.45)

---

## 🔐 Security & Best Practices

### **✅ Already Built-In:**

1. **Rate Limiting:**
   - Email: 500/day, 50/hour
   - WhatsApp: 100/day
   - Scraping: 2-3 second delays

2. **Data Validation:**
   - Only saves leads with email/phone/social
   - Validates email format
   - Checks for duplicates

3. **Privacy:**
   - Unsubscribe link in every email
   - "STOP" keyword for WhatsApp
   - GDPR compliant

4. **Security:**
   - Environment variables (no hardcoded passwords)
   - Supabase Row Level Security
   - HTTPS only

---

## 🎯 Summary: What Changed

### **Old System:**
- ❌ Only saved leads with `contact@domain.com`
- ❌ Local SQLite database (only on your computer)
- ❌ Email only (no WhatsApp)
- ❌ Manual execution every day
- ❌ Lost 70% of leads (no email)

### **New Enhanced System:**
- ✅ Finds **ANY** email (contact@, info@, personal emails)
- ✅ Cloud database (Supabase - access anywhere)
- ✅ **Email + WhatsApp** dual-channel marketing
- ✅ **Automated 24/7** via deployment
- ✅ Finds Instagram/Facebook for leads without email/phone
- ✅ **Only saves useful leads** (must have email OR phone OR social)
- ✅ Saves 90% of leads (vs 30% before)

---

## 🚀 Quick Start (Step-by-Step)

### **1. Install Dependencies:**
```bash
pip install -r requirements.txt
```

### **2. Setup Supabase:**
- Go to supabase.com → Create account
- Create project → Get URL and Key
- Run `supabase/schema.sql` in SQL Editor

### **3. Setup Twilio (Optional for WhatsApp):**
- Go to twilio.com → Create account
- Get WhatsApp sandbox number
- Get Account SID and Auth Token

### **4. Configure .env:**
```bash
cp .env.example .env
nano .env

# Add:
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_KEY=eyJhbGc...
TWILIO_ACCOUNT_SID=ACxxxxx
TWILIO_AUTH_TOKEN=xxxxxxx
```

### **5. Test Locally:**
```bash
# Test scraping
python cli.py scrape --source justdial --city Mumbai --limit 10 --enrich-emails --find-social

# Check Supabase - you should see 10 leads!

# Test email
python cli.py send-initial --limit 5

# Test WhatsApp
python cli.py send-whatsapp --limit 5
```

### **6. Deploy (Optional):**
```bash
# Push to GitHub
git init
git add .
git commit -m "QB24-Sales pipeline"
git push

# Deploy to Railway
# Follow DEPLOYMENT_GUIDE.md
```

---

**You now have a complete, production-ready, dual-channel marketing system! 🚀**

**Questions? Check:**
- [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) - How to deploy
- [CAMPAIGN_FLOW.md](CAMPAIGN_FLOW.md) - How emails/WhatsApp flow works
- [SCRAPING_GUIDE_INDIA.md](SCRAPING_GUIDE_INDIA.md) - How scraping works in India
