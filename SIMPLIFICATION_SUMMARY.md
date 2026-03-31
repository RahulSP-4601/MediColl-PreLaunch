# QB24-Sales Simplification Summary

## ✅ What Was Done

### 1. Database Cleanup (Run SQL Below)
- Removed `leads` table (all scraped clinic data)
- Removed campaign/email automation tables
- **Kept** `waitlist` table (direct signups from website)

### 2. Founder Dashboard Simplified
- ❌ **Removed**: Scraping button
- ❌ **Removed**: Send Email button  
- ❌ **Removed**: Campaign stats (email sent, follow-up, etc.)
- ❌ **Removed**: Scraped leads tab
- ✅ **Kept**: Waitlist leads only
- ✅ **Added**: Export to CSV button

### 3. What Still Works
- ✅ Waitlist signup form on website (https://medicoll24.com)
- ✅ People can join waitlist
- ✅ Founder dashboard shows all signups
- ✅ Export waitlist to CSV for manual outreach

---

## 📝 SQL Commands to Run in Supabase

Copy and run these in **Supabase SQL Editor**:

```sql
-- ============================================
-- STEP 1: Delete scraping & campaign data
-- ============================================

-- Drop leads table (all scraped leads)
DROP TABLE IF EXISTS leads CASCADE;

-- Drop other unused tables
DROP TABLE IF EXISTS campaign_stats CASCADE;
DROP TABLE IF EXISTS email_logs CASCADE;
DROP TABLE IF EXISTS sent_emails CASCADE;

-- ============================================
-- STEP 2: Verify waitlist table exists
-- ============================================

-- Check waitlist structure
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'waitlist'
ORDER BY ordinal_position;

-- Count total signups
SELECT COUNT(*) as total_signups FROM waitlist;

-- View recent signups
SELECT * FROM waitlist 
ORDER BY created_at DESC 
LIMIT 10;

-- ============================================
-- STEP 3: (Optional) Create waitlist table if missing
-- ============================================

-- Only run this if waitlist table doesn't exist
CREATE TABLE IF NOT EXISTS waitlist (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(50),
  city VARCHAR(100),
  clinic_name VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_waitlist_email ON waitlist(email);

-- Add index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_waitlist_created_at ON waitlist(created_at DESC);

-- ============================================
-- STEP 4: Enable Row Level Security (RLS)
-- ============================================

-- Enable RLS on waitlist
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

-- Allow public inserts (for signup form)
CREATE POLICY "Allow public signups" 
ON waitlist 
FOR INSERT 
TO public 
WITH CHECK (true);

-- Allow service role to read all (for dashboard)
CREATE POLICY "Allow service role to read all" 
ON waitlist 
FOR SELECT 
TO service_role 
USING (true);
```

---

## 🚀 How to Use the New Dashboard

### Access Dashboard
1. Go to: http://localhost:3000/founder
2. Password: `qb24founder24` (from .env)

### View Signups
- See all waitlist signups in one simple table
- Shows: Name, Email, Phone, City, Clinic Name, Signup Date

### Export Data
- Click "📥 Export to CSV" button
- Opens in Excel/Google Sheets
- Use for manual email outreach

### Refresh Data
- Click "🔄 Refresh Data" to see latest signups

---

## 📧 Manual Email Outreach Process

Since automation is removed, here's how to reach out manually:

### Option 1: One-by-One (Personalized)
1. Export waitlist to CSV
2. For each person:
   - Click email link in dashboard
   - Write personalized email
   - Send from rahul@medicoll24.com

### Option 2: Bulk Email (Mailchimp/Sendinblue)
1. Export waitlist to CSV
2. Upload to Mailchimp/Sendinblue
3. Create email campaign
4. Send to all at once

### Option 3: Google Sheets + Mail Merge
1. Export waitlist to CSV
2. Open in Google Sheets
3. Use "Yet Another Mail Merge" addon
4. Send personalized bulk emails via Gmail

---

## 🗑️ Files You Can Delete (Optional)

These files are no longer used but kept for backup:

### Scraping Files
- `lib/scrapers/justdial.ts`
- `lib/scrapers/google-maps.ts`
- `lib/scrapers/email-extractor.ts`
- `lib/scrapers/social-media.ts`
- `lib/scrapers/multi-source.ts`
- `app/api/scrape/manual/route.ts`
- `scripts/scrape-fast.ts`

### Email Campaign Files
- `app/api/campaign/manual/route.ts`
- `lib/email-templates/`
- `lib/ses.ts` (if not using email confirmation)

### Old Dashboard
- `app/founder/page.tsx.backup` (backup of complex dashboard)

---

## ✅ Testing Checklist

- [ ] Run SQL commands in Supabase
- [ ] Verify only 1 table exists: `waitlist`
- [ ] Go to http://localhost:3000/founder
- [ ] Login with password
- [ ] See waitlist signups
- [ ] Click "Export to CSV" - downloads file
- [ ] Go to https://medicoll24.com
- [ ] Fill waitlist form
- [ ] Check founder dashboard - new signup appears
- [ ] Click email link - opens email client

---

## 🎯 Next Steps (Your Manual Process)

1. **Daily**: Check founder dashboard for new signups
2. **Weekly**: Export to CSV
3. **Outreach**: 
   - Send personalized emails
   - Call high-value leads
   - Add to CRM (optional)
4. **Follow-up**: Track responses manually

---

## 🆘 Rollback (If Needed)

If you want the old system back:

```bash
cd /Users/rahulpanchal/Desktop/Project/QB24-Sales/app/founder
mv page.tsx page-simple.tsx
mv page.tsx.backup page.tsx
```

Then recreate the `leads` table using the old schema (see Git history).

---

## 📊 Current System Architecture

```
Website Visitor
    ↓
Fills Waitlist Form (medicoll24.com)
    ↓
POST /api/waitlist
    ↓
Saved to `waitlist` table
    ↓
Founder checks dashboard (/founder)
    ↓
GET /api/waitlist
    ↓
Displays all signups
    ↓
Export to CSV
    ↓
Manual email outreach
```

**Simple. Clean. No automation.**

---

## 📝 Notes

- Waitlist form still works on your website
- No automatic emails (you send manually)
- No scraping (you find leads manually)
- Dashboard shows only real signups
- Perfect for early-stage manual outreach

**Total tables: 1** (waitlist)  
**Total API routes: 1** (/api/waitlist)  
**Total dashboard pages: 1** (/founder)
