# QB24-Sales Campaign Flow 🔄

## Complete Campaign Flow (48-Hour Cycles)

---

## 📊 Visual Flow Diagram

```
DAY 1 (9 AM)
┌─────────────────────────────────────────────────────────┐
│ 100 NEW LEADS                                           │
│ Status: "new"                                           │
└─────────────────────────────────────────────────────────┘
                      ↓
            [Send Initial Email]
                      ↓
┌─────────────────────────────────────────────────────────┐
│ 100 LEADS - Initial Email Sent                         │
│ Status: "email_sent" (timestamp recorded)               │
└─────────────────────────────────────────────────────────┘
                      ↓
              ⏰ 48 HOURS PASS
                      ↓
┌──────────────────────┬──────────────────────────────────┐
│ 50 JOINED WAITLIST   │ 50 DIDN'T JOIN                  │
│ Status: "waitlisted" │ Status: "email_sent"            │
│ ✓✓✓ SUCCESS!         │ Need follow-up                  │
└──────────────────────┴──────────────────────────────────┘


DAY 3 (After 48 hours)
┌─────────────────────────────────────────────────────────┐
│ 50 LEADS - Eligible for Follow-up                      │
│ Status: "email_sent" (48hrs+ ago)                      │
└─────────────────────────────────────────────────────────┘
                      ↓
           [Send Follow-up Email]
                      ↓
┌─────────────────────────────────────────────────────────┐
│ 50 LEADS - Follow-up Sent                              │
│ Status: "follow_up_sent" (timestamp recorded)          │
└─────────────────────────────────────────────────────────┘
                      ↓
              ⏰ 48 HOURS PASS
                      ↓
┌──────────────────────┬──────────────────────────────────┐
│ 20 JOINED WAITLIST   │ 30 DIDN'T JOIN                  │
│ Status: "waitlisted" │ Status: "follow_up_sent"        │
│ ✓✓✓ SUCCESS!         │ Mark as not interested          │
└──────────────────────┴──────────────────────────────────┘


DAY 5 (After 48 hours from follow-up)
┌─────────────────────────────────────────────────────────┐
│ 30 LEADS - No Response After Follow-up                 │
│ Status: "follow_up_sent" (48hrs+ ago)                  │
└─────────────────────────────────────────────────────────┘
                      ↓
         [Mark as Not Interested]
                      ↓
┌─────────────────────────────────────────────────────────┐
│ 30 LEADS - Not Interested                              │
│ Status: "not_interested"                               │
│ ⚠️  BUT: Waitlist link STILL ACTIVE!                   │
└─────────────────────────────────────────────────────────┘


WEEK 3 (Someone changes their mind!)
┌─────────────────────────────────────────────────────────┐
│ 1 LEAD - Joined from "not_interested"                  │
│ Status: "not_interested" → "waitlisted"                │
│ 🎉🎉🎉 LATE CONVERSION!                                 │
└─────────────────────────────────────────────────────────┘
```

---

## 🔄 Status Lifecycle

### Status Definitions:

| Status | Description | Next Status | Timing |
|--------|-------------|-------------|--------|
| `new` | Freshly scraped lead | `email_sent` | Immediately when email sent |
| `email_sent` | Initial email sent, waiting | `waitlisted` OR `follow_up_sent` | 48 hours |
| `follow_up_sent` | Follow-up sent, waiting | `waitlisted` OR `not_interested` | 48 hours |
| `waitlisted` | Joined waitlist ✓ | N/A (final success state) | Anytime |
| `not_interested` | No response after follow-up | `waitlisted` (can still convert!) | Anytime |

---

## 📅 Detailed Example: Day-by-Day

### **Day 1 - Monday 9 AM**

**Action:** Scrape & send to 100 new leads

```bash
# Scrape 100 clinics in Mumbai
python cli.py scrape --source justdial --city Mumbai --type clinic --limit 100 --enrich-emails

# Send initial emails
python cli.py send-initial --limit 100
```

**Result:**
- 100 leads: `new` → `email_sent`
- Email: "Never miss a patient call again"
- Timestamp: `email_sent_at = 2024-05-01 09:00:00`

---

### **Day 2 - Tuesday**

**Action:** Scrape & send to another 100 leads

```bash
python cli.py scrape --source justdial --city Delhi --type clinic --limit 100 --enrich-emails
python cli.py send-initial --limit 100
```

**Meanwhile:**
- Previous 100 leads: Waiting (only 24hrs elapsed)
- Check who joined: 20 leads joined → status changed to `waitlisted`

```bash
# Manually mark those who joined (or automate via webhook)
python cli.py mark-waitlisted --email clinic1@example.com
python cli.py mark-waitlisted --email clinic2@example.com
# ... 20 total
```

**Current Status:**
- Day 1 batch: 20 `waitlisted`, 80 `email_sent` (still waiting)
- Day 2 batch: 100 `email_sent` (just sent)

---

### **Day 3 - Wednesday (48 hours after Day 1)**

**Action:** Send follow-ups + send to new 100 leads

```bash
# Send follow-ups to Day 1 batch (those who didn't join after 48hrs)
python cli.py send-followup --limit 100

# Scrape & send to new batch
python cli.py scrape --source justdial --city Bangalore --type clinic --limit 100 --enrich-emails
python cli.py send-initial --limit 100
```

**Result:**
- Day 1 batch: 80 leads eligible for follow-up
  - 80 leads: `email_sent` → `follow_up_sent`
  - Email: "Just checking — worth exploring?"
  - Timestamp: `follow_up_sent_at = 2024-05-03 09:00:00`

**Current Status:**
- Day 1: 20 `waitlisted`, 80 `follow_up_sent`
- Day 2: 35 `waitlisted`, 65 `email_sent` (waiting for 48hrs)
- Day 3: 100 `email_sent` (just sent)

---

### **Day 4 - Thursday**

**Action:** Check conversions + send to new batch

```bash
# Check stats
python cli.py stats

# Day 1 batch: Some joined after follow-up
# Mark them manually
python cli.py mark-waitlisted --email clinic21@example.com
# ... etc

# Send to new batch
python cli.py scrape --source justdial --city Pune --type clinic --limit 100 --enrich-emails
python cli.py send-initial --limit 100
```

**Current Status:**
- Day 1: 40 `waitlisted`, 60 `follow_up_sent` (20 joined after follow-up)
- Day 2: 50 `waitlisted`, 50 `email_sent` (15 more joined)
- Day 3: 15 `waitlisted`, 85 `email_sent`
- Day 4: 100 `email_sent`

---

### **Day 5 - Friday (48 hours after Day 3 follow-up)**

**Action:** Mark non-responders as not_interested

```bash
# Mark Day 1 non-responders as not_interested
python cli.py mark-not-interested

# Send follow-ups to Day 2 batch
python cli.py send-followup --limit 100
```

**Result:**
- Day 1 batch: 60 leads with `follow_up_sent` (48hrs+ ago)
  - If no waitlist signup → status: `follow_up_sent` → `not_interested`
  - **NOTE:** Waitlist link stays active!

**Current Status:**
- Day 1: 40 `waitlisted`, 60 `not_interested` (link active)
- Day 2: 50 `waitlisted`, 50 `follow_up_sent` (just sent follow-up)
- Day 3: 25 `waitlisted`, 75 `email_sent` (waiting)
- Day 4: 20 `waitlisted`, 80 `email_sent`
- Day 5: 100 `email_sent` (just sent)

---

### **Week 2-3: Late Conversions**

Some leads from "not_interested" decide to join later!

```bash
# Someone from Day 1 batch joins on Day 15
python cli.py mark-waitlisted --email clinic50@example.com

# Logs: "🎉 CONVERTED! clinic50@example.com joined waitlist (was: not_interested)"
```

**Status Change:**
- `not_interested` → `waitlisted` ✓

---

## 🤖 Automated Daily Workflow

### **Option 1: Full Automation**

Run this every day:

```bash
python cli.py run-campaign --initial 100 --followup 50 --mark-not-interested
```

This will:
1. ✅ Send initial emails to 100 "new" leads
2. ✅ Send follow-ups to leads 48hrs+ after initial email
3. ✅ Mark as not_interested: leads 48hrs+ after follow-up

---

### **Option 2: Manual Control (Recommended)**

**Morning Routine (9 AM):**

```bash
# 1. Scrape new leads
python cli.py scrape --source justdial --city Mumbai --type clinic --limit 100 --enrich-emails

# 2. Run campaign
python cli.py run-campaign --initial 100 --followup 50 --mark-not-interested

# 3. Check stats
python cli.py stats
```

**Evening Routine (6 PM):**

```bash
# Check who joined waitlist today (from your waitlist page analytics)
python cli.py mark-waitlisted --email user1@clinic.com
python cli.py mark-waitlisted --email user2@clinic.com
python cli.py mark-waitlisted --email user3@clinic.com

# Check updated stats
python cli.py stats
```

---

## 📊 Expected Conversion Rates

### Batch of 100 Leads:

| Stage | Timing | Conversion | Status | Count |
|-------|--------|------------|--------|-------|
| Initial Email | Day 1 | 20-30% | `waitlisted` | 25 |
| After 48hrs | Day 3 | Remaining | `email_sent` → `follow_up_sent` | 75 |
| Follow-up | Day 3 | 15-25% | `waitlisted` | 15 |
| After 48hrs | Day 5 | Remaining | `follow_up_sent` → `not_interested` | 60 |
| Late Conversions | Week 2-3 | 5-10% | `not_interested` → `waitlisted` | 5 |

**Total Conversion: 45/100 = 45%** ✓

---

## 🎯 30-Day Campaign Plan

### Goal: 200-500 Waitlist Signups

**Daily Target:**
- Scrape: 100 leads/day
- Send initial: 100 emails/day
- Send follow-ups: 50 emails/day
- Expected signups: 10-15/day

**Weekly Breakdown:**

| Week | Scraped | Emailed | Waitlisted | Cumulative |
|------|---------|---------|------------|------------|
| 1    | 700     | 700     | 150        | 150        |
| 2    | 700     | 700     | 150        | 300        |
| 3    | 700     | 700     | 100        | 400        |
| 4    | 700     | 700     | 100        | 500        |

**Target Hit: 500 Signups in 30 Days!** 🎉

---

## 💡 Key Points

### ✅ Waitlist Link Always Active

Even leads marked as `not_interested` can still join:
- Link doesn't expire
- Can join 1 week, 2 weeks, even 1 month later
- System automatically updates status when they join

### ✅ Smart Follow-up Targeting

- **Initial Email Sent:** Only to leads with status `new`
- **Follow-up Sent:** Only to leads with status `email_sent` (48hrs+)
- **Never duplicates:** Each lead gets exactly 1 initial + 1 follow-up

### ✅ Real-time Tracking

```bash
python cli.py stats
```

Shows:
- Total leads
- How many at each status
- Conversion rate
- Total emailed

---

## 🔧 CLI Commands Summary

### Daily Workflow:

```bash
# Morning
python cli.py scrape --source justdial --city Mumbai --type clinic --limit 100 --enrich-emails
python cli.py run-campaign --initial 100 --followup 50 --mark-not-interested
python cli.py stats

# Evening
python cli.py mark-waitlisted --email user@clinic.com
python cli.py stats
```

### Manual Controls:

```bash
# Send initial emails only
python cli.py send-initial --limit 100

# Send follow-ups only
python cli.py send-followup --limit 50

# Mark non-responders
python cli.py mark-not-interested

# Mark someone as joined waitlist
python cli.py mark-waitlisted --email user@clinic.com
```

---

## 🎬 Getting Started

### Day 1:

```bash
# Test with 10 leads
python cli.py scrape --source justdial --city Mumbai --type clinic --limit 10 --enrich-emails
python cli.py send-initial --limit 10

# Check results
python cli.py stats
```

### Day 3 (48 hours later):

```bash
# Send follow-ups
python cli.py send-followup --limit 10

# Check stats
python cli.py stats
```

### Day 5 (48 hours after follow-up):

```bash
# Mark non-responders
python cli.py mark-not-interested

# Check stats
python cli.py stats
```

---

**Your campaign flow is now optimized for maximum conversions with 48-hour cycles! 🚀**
