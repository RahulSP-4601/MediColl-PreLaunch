# Testing Flow - MediColl24 Sales Pipeline

## 🎯 Purpose
Test the entire sales automation flow manually before automating via cron jobs.

---

## 📋 Testing Steps

### **Step 1: Access Founder Dashboard**

```
1. Start your dev server:
   npm run dev

2. Go to: http://localhost:3000/founder

3. Login with password: qb24founder24
```

---

### **Step 2: Scrape 1 Test Lead**

```
1. Click: "🔍 Scrape 1 Lead (Test)" button

2. Wait 10-30 seconds

3. Check result message:
   ✅ Scraped 1 lead! Saved: 1, Duplicates: 0

4. See lead in "Scraped Leads" table with:
   - Name: Clinic/Hospital name
   - Email: Email address (or "❌ No email" if not found)
   - Phone: Phone number
   - City: Mumbai
   - Type: clinic
   - Status: new
   - Scraped: Timestamp
```

**What happens:**
- Scrapes 1 clinic from JustDial (Mumbai)
- Uses FREE JustDial (no Google Maps - too expensive)
- Saves to database if not duplicate
- Shows in table immediately after refresh

---

### **Step 3: Send Test Email**

```
1. Click: "📧 Send Email (Test)" button

2. Wait 5-10 seconds

3. Check result message:
   ✅ Email sent! Initial: 1

4. Check lead status changed from "new" to "email_sent"
```

**What happens:**
- Sends initial email to all leads with status="new"
- Maximum 10 leads at a time (for testing)
- Updates lead status to "email_sent"
- Email includes "Join Waitlist" link

---

### **Step 4: Check Email Received**

```
1. If lead has email: Check their inbox
   - From: rahul@medicoll.com
   - Subject: "Never miss a patient call again"
   - Contains: Join Waitlist button

2. If lead clicks "Join Waitlist":
   - They fill form on your website
   - Gets added to "Waitlisted Leads" table
   - Status changes to "waitlisted"
```

---

### **Step 5: Follow-up Email (48 hours later)**

**Manual testing:**
```
1. Wait 48 hours OR manually change lead timestamp in database

2. Click: "📧 Send Email (Test)" again
   - System checks if 48 hours passed since initial email
   - Sends follow-up email to leads with status="email_sent"
   - Updates status to "follow_up_sent"
```

**Automated (once you enable cron):**
```
- Cron job runs daily at 2 AM
- Automatically sends follow-ups to leads where:
  - Status = "email_sent"
  - AND 48 hours have passed
```

---

## 📊 Test Data Flow

```
┌─────────────────────────────────────────────────────────┐
│  1. SCRAPING                                            │
│  Button: "Scrape 1 Lead (Test)"                        │
│  Source: JustDial (FREE)                               │
│  Output: 1 clinic added to database                    │
│  Status: "new"                                          │
└─────────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────────┐
│  2. INITIAL EMAIL                                       │
│  Button: "Send Email (Test)"                           │
│  Target: Leads with status="new"                       │
│  Output: Email sent with waitlist link                 │
│  Status: "new" → "email_sent"                          │
└─────────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────────┐
│  3. LEAD RESPONSE (Optional)                            │
│  Action: Lead clicks "Join Waitlist" in email          │
│  Output: Lead added to "Waitlisted Leads" table        │
│  Status: "email_sent" → "waitlisted"                   │
└─────────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────────┐
│  4. FOLLOW-UP EMAIL (48 hours later)                    │
│  Trigger: Manual OR cron job                           │
│  Target: Leads with status="email_sent" + 48h passed   │
│  Output: Follow-up email sent                          │
│  Status: "email_sent" → "follow_up_sent"               │
└─────────────────────────────────────────────────────────┘
```

---

## 🔍 What's Different from Before

### **OLD (Automated Cron):**
- ❌ Scrapes 10 leads/day automatically at 2 AM
- ❌ No control over testing
- ❌ Hard to debug
- ❌ Uses Google Maps (expensive)

### **NEW (Manual Testing):**
- ✅ Scrape 1 lead at a time with button
- ✅ Send emails manually with button
- ✅ See results immediately
- ✅ Only JustDial (FREE)
- ✅ Perfect for testing flow

---

## 📝 Important Notes

1. **JustDial Only:**
   - No Google Maps scraping (removed - too expensive)
   - 100% FREE scraping
   - Good enough for testing

2. **Email Limits:**
   - Zoho Free: 250 emails/day
   - Test mode: Max 10 emails at a time
   - Perfect for testing

3. **Status Flow:**
   ```
   new → email_sent → follow_up_sent → waitlisted
                  ↘ not_interested
   ```

4. **Database Tables:**
   - `leads` - All scraped leads
   - `waitlist` - Leads who joined waitlist

---

## 🚀 Next Steps (After Testing Works)

Once you verify the flow works:

1. **Enable Automated Scraping:**
   - Update cron job to scrape 10-50 leads/day
   - Runs at 2 AM automatically

2. **Enable Automated Emails:**
   - Cron sends initial emails to new leads
   - Cron sends follow-ups after 48 hours

3. **Scale Up:**
   - Increase scraping from 1 → 10 → 50 leads/day
   - Monitor email deliverability
   - Track waitlist conversions

---

## ❓ Troubleshooting

**No email found for scraped lead?**
- Normal - 40% of clinics don't list emails publicly
- Scrape more leads to find ones with emails

**Email not sending?**
- Check Zoho SMTP password in .env
- Check Zoho daily limit (250/day)
- Check lead has valid email address

**Duplicate lead?**
- System automatically checks for duplicates
- Won't save same phone/email twice

**Follow-up not sending?**
- Must wait 48 hours after initial email
- Lead status must be "email_sent"
- OR manually test by changing timestamp

---

## ✅ Success Criteria

Your testing is successful when:

1. ✅ Can scrape 1 lead from JustDial
2. ✅ Lead appears in "Scraped Leads" table
3. ✅ Can send initial email to lead
4. ✅ Lead status changes to "email_sent"
5. ✅ Can send follow-up email (after 48h or manual)
6. ✅ Lead who clicks "Join Waitlist" appears in "Waitlisted Leads"

Once all ✅ → Ready to automate! 🎉
