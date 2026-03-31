# QB24-Sales Complete Automation Flow

## ✅ 100% Next.js - All Python Files Removed

This document describes the **complete end-to-end automation** for the QB24-Sales pipeline.

---

## 🔄 Complete Automation Workflow

### **Status Flow Chart**

```
NEW LEAD
   ↓
   ├─ Email found? → Send Initial Email
   ├─ Phone found? → Send WhatsApp
   └─ No contact? → Skip
   ↓
STATUS: email_sent
   ↓
WAIT 48 HOURS
   ↓
   ├─ Did they join waitlist? → STATUS: waitlisted ✓ DONE
   └─ No response? → Send Follow-up Email
   ↓
STATUS: follow_up_sent
   ↓
WAIT 48 HOURS
   ↓
   ├─ Did they join waitlist? → STATUS: waitlisted ✓ DONE
   └─ No response? → Mark as Not Interested
   ↓
STATUS: not_interested
   ↓
   ├─ Waitlist link still active
   └─ If they join later → STATUS: waitlisted ✓ DONE
```

---

## 🎯 Day-by-Day Workflow Example

### **Day 1: Monday 9 AM IST**

**Automated Cron Job Runs:**

```typescript
// Vercel Cron calls: POST /api/campaign/run

1. Fetch new leads (status="new")
   → Found 100 leads

2. Send initial emails
   → 60 leads have email
   → Sent 60 emails
   → Update: status="new" → "email_sent", email_sent_at=NOW

3. Send WhatsApp messages (if enabled)
   → 40 leads have phone only
   → Sent 40 WhatsApp
   → Update: status="new" → "whatsapp_sent"

4. Check for follow-ups
   → No leads ready yet (need 48 hours)

5. Check for not interested
   → No leads ready yet (need 48 hours)
```

**Database State:**
- 60 leads: `status="email_sent"`, `email_sent_at="2026-03-30 09:00:00"`
- 40 leads: `status="whatsapp_sent"`

---

### **Day 2: Tuesday**

**Manual Check:**
```bash
# You check your waitlist
# 20 people joined!

# Call webhook or mark manually:
curl -X POST https://your-app.vercel.app/api/campaign/mark-waitlisted \
  -d '{"email": "user1@clinic.com"}'
```

**Database State:**
- 20 leads: `status="waitlisted"` ✓
- 40 leads: `status="email_sent"` (waiting)
- 40 leads: `status="whatsapp_sent"` (waiting)

---

### **Day 3: Wednesday 9 AM IST** (48 hours after Day 1)

**Automated Cron Job Runs:**

```typescript
// POST /api/campaign/run

1. Send initial emails
   → No new leads

2. Send follow-ups
   → Query: status="email_sent" AND email_sent_at <= NOW - 48 hours
   → Found 40 leads (60 initial - 20 waitlisted)
   → Send 40 follow-up emails
   → Update: status="email_sent" → "follow_up_sent", follow_up_sent_at=NOW

3. Check for not interested
   → No leads ready yet
```

**Database State:**
- 20 leads: `status="waitlisted"` ✓
- 40 leads: `status="follow_up_sent"`, `follow_up_sent_at="2026-04-01 09:00:00"`
- 40 leads: `status="whatsapp_sent"`

---

### **Day 4: Thursday**

**More Conversions:**
```bash
# 10 more joined after follow-up!
# Webhook automatically updates status
```

**Database State:**
- 30 leads: `status="waitlisted"` ✓ (20 + 10)
- 30 leads: `status="follow_up_sent"` (waiting)
- 40 leads: `status="whatsapp_sent"`

---

### **Day 5: Friday 9 AM IST** (48 hours after Day 3)

**Automated Cron Job Runs:**

```typescript
// POST /api/campaign/run

1. Send initial emails
   → No new leads

2. Send follow-ups
   → No leads ready

3. Mark as not interested
   → Query: status="follow_up_sent" AND follow_up_sent_at <= NOW - 48 hours
   → Found 30 leads (40 follow-ups - 10 waitlisted)
   → Update: status="follow_up_sent" → "not_interested", not_interested_at=NOW
   → ⚠️ WAITLIST LINK STAYS ACTIVE!
```

**Database State:**
- 30 leads: `status="waitlisted"` ✓
- 30 leads: `status="not_interested"` (but link still active)
- 40 leads: `status="whatsapp_sent"`

---

### **Day 10: One Week Later**

**Late Conversion:**
```bash
# Someone who was "not_interested" joins waitlist!
# Webhook receives: user10@clinic.com

# Automatic update:
UPDATE leads
SET status = 'waitlisted', waitlisted_at = NOW()
WHERE email = 'user10@clinic.com'
```

**Database State:**
- 31 leads: `status="waitlisted"` ✓ (30 + 1 late conversion)
- 29 leads: `status="not_interested"`
- 40 leads: `status="whatsapp_sent"`

**Conversion Rate: 31/100 = 31%** 🎉

---

## 🤖 Complete Automation Implementation

### **1. Scraping Module** ([lib/scrapers/](lib/scrapers/))

```typescript
// lib/scrapers/justdial.ts
export class JustDialScraper {
  async scrape(city, type, limit, enrichEmails, findSocial) {
    // 1. Scrape from JustDial
    // 2. Extract name, phone, address, website
    // 3. If enrichEmails: Visit website → Find ANY email
    // 4. If findSocial: Find Instagram + Facebook
    // 5. Only save if: email OR phone OR social exists
    return leads;
  }
}
```

**Features:**
- ✅ JustDial scraper
- ✅ Google Maps scraper
- ✅ Enhanced email extractor (finds ANY email, not just contact@)
- ✅ Social media finder (Instagram + Facebook)
- ✅ LinkedIn finder

---

### **2. Email System** ([lib/email.ts](lib/email.ts))

```typescript
// lib/email.ts
export class EmailSender {
  async sendInitialEmail(to, leadData) {
    // 1. Check rate limit (500/day, 50/hour, 30s delay)
    // 2. Render React Email template
    // 3. Send via Nodemailer (SMTP)
    // 4. Update counters
  }

  async sendFollowUpEmail(to, leadData) {
    // Same flow for follow-up
  }
}
```

**Email Templates:**
- ✅ [emails/InitialEmail.tsx](emails/InitialEmail.tsx) - Beautiful gradient design
- ✅ [emails/FollowUpEmail.tsx](emails/FollowUpEmail.tsx) - Follow-up template

**Rate Limiting:**
- ✅ 500 emails/day
- ✅ 50 emails/hour
- ✅ 30 seconds delay between emails

---

### **3. WhatsApp System** ([lib/whatsapp.ts](lib/whatsapp.ts))

```typescript
// lib/whatsapp.ts
export class WhatsAppSender {
  async sendInitialMessage(phone, leadData) {
    // 1. Check rate limit (100/day, 5s delay)
    // 2. Format phone number (+91-XXXXXXXXXX)
    // 3. Send via Twilio
  }
}
```

**Rate Limiting:**
- ✅ 100 messages/day
- ✅ 5 seconds delay

---

### **4. Automation Engine** ([lib/automation.ts](lib/automation.ts))

```typescript
// lib/automation.ts
export class AutomationEngine {
  followUpDelayHours = 48;  // EXACTLY 48 hours
  notInterestedDelayHours = 48;  // EXACTLY 48 hours

  async sendInitialEmails(limit) {
    // 1. Get leads: status="new"
    // 2. Send emails
    // 3. Update: status → "email_sent", email_sent_at=NOW
  }

  async sendFollowUpEmails(limit) {
    // 1. Get leads: status="email_sent" AND email_sent_at <= NOW - 48 hours
    // 2. Send follow-ups
    // 3. Update: status → "follow_up_sent", follow_up_sent_at=NOW
  }

  async markAsNotInterested(limit) {
    // 1. Get leads: status="follow_up_sent" AND follow_up_sent_at <= NOW - 48 hours
    // 2. Update: status → "not_interested", not_interested_at=NOW
    // ⚠️ WAITLIST LINK STAYS ACTIVE!
  }

  async runCompleteCampaign() {
    // Runs all steps in order
    await this.sendInitialEmails(100);
    await this.sendFollowUpEmails(50);
    await this.markAsNotInterested(100);
  }
}
```

---

### **5. Supabase Integration** ([lib/supabase.ts](lib/supabase.ts))

```typescript
// lib/supabase.ts
export class SupabaseClient {
  async getLeadsByStatus(status, limit) {
    // Get leads with specific status
  }

  async getLeadsForFollowUp(limit) {
    // Query: status="email_sent" AND email_sent_at <= NOW - 48 hours
    const fortyEightHoursAgo = new Date();
    fortyEightHoursAgo.setHours(fortyEightHoursAgo.getHours() - 48);

    return await supabase
      .from('leads')
      .select('*')
      .eq('status', 'email_sent')
      .lte('email_sent_at', fortyEightHoursAgo.toISOString())
      .limit(limit);
  }

  async getLeadsToMarkNotInterested(limit) {
    // Query: status="follow_up_sent" AND follow_up_sent_at <= NOW - 48 hours
  }

  async markAsWaitlisted(email) {
    // Can convert from ANY status (including "not_interested")
    await supabase
      .from('leads')
      .update({
        status: 'waitlisted',
        waitlisted_at: NOW()
      })
      .eq('email', email);
  }
}
```

**Same Supabase as QuickBook24 Product!**

---

### **6. API Routes** ([app/api/](app/api/))

#### **Scraping**
```typescript
// app/api/scrape/route.ts
POST /api/scrape
{
  "source": "justdial",
  "city": "Mumbai",
  "type": "clinic",
  "limit": 100,
  "enrichEmails": true,
  "findSocial": true
}
```

#### **Campaign Operations**
```typescript
// app/api/campaign/send-initial/route.ts
POST /api/campaign/send-initial
{ "limit": 100, "dryRun": false }

// app/api/campaign/send-followup/route.ts
POST /api/campaign/send-followup
{ "limit": 50, "dryRun": false }

// app/api/campaign/run/route.ts (CRON JOB)
POST /api/campaign/run
Authorization: Bearer CRON_SECRET
{ "initialLimit": 100, "followupLimit": 50, "markNotInterested": true }

// app/api/campaign/mark-waitlisted/route.ts
POST /api/campaign/mark-waitlisted
{ "email": "user@clinic.com" }
```

#### **Webhook Integration**
```typescript
// app/api/webhook/waitlist/route.ts
POST /api/webhook/waitlist
{
  "email": "user@clinic.com",
  "name": "Dr. Sharma"
}

// Automatically updates status:
// "email_sent" → "waitlisted"
// "follow_up_sent" → "waitlisted"
// "not_interested" → "waitlisted" ✓ CAN ALWAYS JOIN!
```

#### **Statistics**
```typescript
// app/api/stats/route.ts
GET /api/stats

// Returns:
{
  "total_leads": 500,
  "new_leads": 100,
  "email_sent": 150,
  "follow_up_sent": 80,
  "waitlisted": 100,
  "not_interested": 70,
  "conversion_rate": 25.00
}
```

---

### **7. Automated Cron Job** ([vercel.json](vercel.json))

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

**Runs daily at 9 AM IST (3:30 AM UTC)**

**What it does:**
1. ✅ Send initial emails to new leads
2. ✅ Send follow-ups (48+ hours after initial)
3. ✅ Mark as not interested (48+ hours after follow-up)
4. ✅ Send WhatsApp (if enabled)
5. ✅ Log results to Vercel

**NO MANUAL INTERVENTION NEEDED!**

---

## 🔗 Integration with QuickBook24 Product

### **Webhook Setup**

In your QuickBook24 waitlist form:

```javascript
// quickbook24.ai/waitlist form handler
async function handleWaitlistSignup(email, name) {
  // 1. Save to QuickBook24 database
  await saveToQuickBookDatabase(email, name);

  // 2. Send webhook to sales pipeline
  await fetch('https://qb24-sales.vercel.app/api/webhook/waitlist', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, name }),
  });
}
```

**What happens:**
1. User joins waitlist on QuickBook24 site
2. Webhook fires to sales pipeline
3. Sales pipeline updates lead status
4. Status changes from any status → "waitlisted"
5. **Even "not_interested" can convert back to "waitlisted"!**

---

## 📊 Complete Data Flow

```
1. SCRAPING
   ↓
   JustDial/Google Maps
   ↓
   Extract: name, phone, address, website
   ↓
   Enrich: Visit website → Find ANY email
   ↓
   Enrich: Find Instagram + Facebook
   ↓
   Validate: Must have email OR phone OR social
   ↓
   Save to Supabase with status="new"

2. INITIAL OUTREACH (Day 1, 9 AM IST)
   ↓
   Cron job runs: /api/campaign/run
   ↓
   Fetch leads: status="new"
   ↓
   Send emails via SMTP
   ↓
   Send WhatsApp via Twilio
   ↓
   Update: status="email_sent", email_sent_at=NOW

3. WAIT 48 HOURS
   ↓
   Check if joined waitlist via webhook
   ↓
   If yes: status="waitlisted" ✓ STOP
   ↓
   If no: Continue to follow-up

4. FOLLOW-UP (Day 3, 9 AM IST)
   ↓
   Cron job runs: /api/campaign/run
   ↓
   Query: status="email_sent" AND email_sent_at <= NOW - 48 hours
   ↓
   Send follow-up emails
   ↓
   Update: status="follow_up_sent", follow_up_sent_at=NOW

5. WAIT 48 HOURS
   ↓
   Check if joined waitlist via webhook
   ↓
   If yes: status="waitlisted" ✓ STOP
   ↓
   If no: Continue to not interested

6. MARK NOT INTERESTED (Day 5, 9 AM IST)
   ↓
   Cron job runs: /api/campaign/run
   ↓
   Query: status="follow_up_sent" AND follow_up_sent_at <= NOW - 48 hours
   ↓
   Update: status="not_interested", not_interested_at=NOW
   ↓
   ⚠️ WAITLIST LINK STAYS ACTIVE!

7. LATE CONVERSION (Anytime in future)
   ↓
   User clicks old email link
   ↓
   Joins waitlist on QuickBook24
   ↓
   Webhook fires
   ↓
   Update: status="not_interested" → "waitlisted" ✓
```

---

## 🎯 Status Transitions

### **All Possible Transitions:**

```
new → email_sent (initial email sent)
new → whatsapp_sent (WhatsApp sent)
email_sent → waitlisted (joined after initial)
email_sent → follow_up_sent (follow-up sent)
follow_up_sent → waitlisted (joined after follow-up)
follow_up_sent → not_interested (no response)
not_interested → waitlisted (late conversion) ✓ ALWAYS POSSIBLE
whatsapp_sent → waitlisted (joined via WhatsApp link)
```

### **Terminal States:**

- **waitlisted** ✓ - Success! They joined.
- **not_interested** - No response, but can still join anytime

---

## ✅ Everything is Automated

### **What Runs Automatically:**
1. ✅ Daily cron job at 9 AM IST
2. ✅ Initial emails sent
3. ✅ WhatsApp messages sent
4. ✅ Follow-ups after 48 hours
5. ✅ Mark not interested after 48 hours
6. ✅ Webhook updates status when joined
7. ✅ Rate limiting enforced
8. ✅ Logs sent to Vercel

### **What You Do Manually:**
1. Scrape new leads (weekly): `npm run scrape`
2. Monitor Vercel logs (daily)
3. Check Supabase dashboard (weekly)

### **What You DON'T Do:**
- ❌ Send emails manually
- ❌ Send WhatsApp manually
- ❌ Update status manually (webhook does it)
- ❌ Check timing for follow-ups (automated)
- ❌ Mark not interested (automated)

---

## 🚀 Deployment & Usage

### **Deploy to Vercel:**

```bash
# 1. Push to GitHub
git add .
git commit -m "QB24-Sales Next.js - Complete automation"
git push

# 2. Deploy to Vercel (one-click)
# See NEXTJS_DEPLOYMENT_GUIDE.md

# 3. Add environment variables in Vercel
# Same Supabase credentials as QuickBook24!

# 4. Cron job automatically enabled
# Runs daily at 9 AM IST
```

### **Manual Operations:**

```bash
# Scrape new leads (run weekly)
npm run scrape -- --source justdial --city Mumbai --limit 500

# View statistics
npm run stats

# Test campaign (dry run)
npm run run-campaign -- --dry-run

# Or via API:
curl https://your-app.vercel.app/api/stats
```

---

## 📈 Expected Results

### **Week 1:**
- Scrape: 500 leads
- Email sent: 400 (80%)
- WhatsApp sent: 100 (20%)
- Waitlisted after initial: 80-120 (20-30%)
- Follow-ups sent: 280-320
- Waitlisted after follow-up: 40-60 (15-20% of follow-ups)
- **Total waitlisted: 120-180 (24-36% conversion)**

### **Month 1:**
- Total leads: 2,000
- Total emailed: 1,600
- Total WhatsApp: 400
- **Waitlisted: 480-720 (24-36% conversion)**

---

## 🔐 Security & Reliability

✅ **Rate Limiting:** Prevents spam, respects Gmail limits
✅ **Cron Secret:** Protected API routes
✅ **Environment Variables:** No hardcoded secrets
✅ **Supabase RLS:** Row-level security
✅ **HTTPS Only:** Vercel enforces HTTPS
✅ **Unsubscribe Link:** Every email has unsubscribe
✅ **STOP Keyword:** WhatsApp supports STOP

---

## 🎉 Summary

**The QB24-Sales pipeline is now:**

✅ **100% Next.js/TypeScript** - No Python files
✅ **Fully automated** - Runs daily at 9 AM IST via Vercel Cron
✅ **End-to-end functional** - Scraping → Emailing → Following up → Tracking
✅ **Integrated with QuickBook24** - Same Supabase, webhook updates
✅ **Status tracking** - new → email_sent → follow_up_sent → waitlisted/not_interested
✅ **48-hour cycles** - Exact timing for follow-ups and not interested
✅ **Late conversions** - Can always convert from "not_interested" to "waitlisted"
✅ **Production ready** - Deploy to Vercel and forget!

**NO MANUAL INTERVENTION NEEDED AFTER DEPLOYMENT!**

The system handles everything automatically:
- Sends initial emails
- Waits 48 hours
- Sends follow-ups
- Waits 48 hours
- Marks as not interested
- Updates status via webhook
- Allows late conversions anytime

**Just scrape new leads weekly and let the automation do the rest! 🚀**
