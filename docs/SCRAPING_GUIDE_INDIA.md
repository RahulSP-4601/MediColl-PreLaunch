# Scraping Guide for India 🇮🇳

## Complete Guide to Collecting Clinic/Hospital Data in India

---

## 🎯 Best Sources for Indian Market

### 1. JustDial (★★★★★)
- **Best for:** India-specific data
- **Cost:** Free
- **Coverage:** Excellent in tier 1 & 2 cities
- **Data quality:** Good phone numbers, moderate emails
- **Recommended:** Yes, start here

### 2. Google Maps API (★★★★☆)
- **Best for:** Verified, accurate data
- **Cost:** ~$0.017 per request (first 100 requests/month free)
- **Coverage:** Excellent worldwide
- **Data quality:** Very high
- **Recommended:** Yes, for better data

### 3. Website Email Extraction (★★★☆☆)
- **Best for:** Getting emails when not listed
- **Cost:** Free but time-consuming
- **Success rate:** ~30-40% in India
- **Recommended:** Use with `--enrich-emails` flag

---

## 📍 Top Indian Cities for QB24

### Tier 1 Cities (Best ROI):
```bash
# Metro cities with highest digital adoption
python cli.py scrape --source justdial --city Mumbai --type clinic --limit 100
python cli.py scrape --source justdial --city Delhi --type clinic --limit 100
python cli.py scrape --source justdial --city Bangalore --type clinic --limit 100
python cli.py scrape --source justdial --city Pune --type clinic --limit 100
python cli.py scrape --source justdial --city Hyderabad --type clinic --limit 100
```

### Tier 2 Cities (Good Potential):
```bash
python cli.py scrape --source justdial --city Chennai --type clinic --limit 80
python cli.py scrape --source justdial --city Kolkata --type clinic --limit 80
python cli.py scrape --source justdial --city Ahmedabad --type clinic --limit 80
python cli.py scrape --source justdial --city Jaipur --type clinic --limit 50
python cli.py scrape --source justdial --city Surat --type clinic --limit 50
python cli.py scrape --source justdial --city Lucknow --type clinic --limit 50
python cli.py scrape --source justdial --city Chandigarh --type clinic --limit 50
```

### Specific Areas (Targeted):
```bash
# Rich areas with private clinics
python cli.py scrape --source google-maps --city "Bandra, Mumbai" --type clinic --limit 30
python cli.py scrape --source google-maps --city "Koramangala, Bangalore" --type clinic --limit 30
python cli.py scrape --source google-maps --city "Cyber City, Gurgaon" --type clinic --limit 30
python cli.py scrape --source google-maps --city "Banjara Hills, Hyderabad" --type clinic --limit 30
```

---

## 🚀 Recommended Scraping Strategy

### Week 1: Test & Validate

```bash
# Day 1: Test JustDial (no cost)
python cli.py scrape --source justdial --city Mumbai --type clinic --limit 20
python cli.py scrape --source justdial --city Delhi --type clinic --limit 20

# Check data quality
python cli.py stats

# Test email enrichment on subset
python cli.py scrape --source justdial --city Bangalore --type clinic --limit 10 --enrich-emails
```

### Week 2-4: Scale Up

```bash
# Daily routine: Scrape 100 leads/day from different cities
# Monday: Mumbai
python cli.py scrape --source justdial --city Mumbai --type clinic --limit 50 --enrich-emails
python cli.py scrape --source justdial --city Mumbai --type hospital --limit 50

# Tuesday: Delhi
python cli.py scrape --source justdial --city Delhi --type clinic --limit 50 --enrich-emails
python cli.py scrape --source justdial --city Delhi --type hospital --limit 50

# Wednesday: Bangalore
python cli.py scrape --source justdial --city Bangalore --type clinic --limit 50 --enrich-emails
python cli.py scrape --source justdial --city Bangalore --type hospital --limit 50

# Thursday: Pune
python cli.py scrape --source justdial --city Pune --type clinic --limit 50 --enrich-emails
python cli.py scrape --source justdial --city Pune --type hospital --limit 50

# Friday: Hyderabad
python cli.py scrape --source justdial --city Hyderabad --type clinic --limit 50 --enrich-emails
python cli.py scrape --source justdial --city Hyderabad --type hospital --limit 50
```

---

## 🔍 What Data You'll Get

### From JustDial:

**Example 1: Small Clinic**
```json
{
  "name": "Dr. Rajesh Sharma's Clinic",
  "phone": "+91-22-26354178",
  "address": "Shop No. 5, Andheri West, Mumbai - 400053",
  "website": null,
  "city": "Mumbai",
  "type": "clinic",
  "source": "justdial"
}
```

**Example 2: Hospital**
```json
{
  "name": "Apollo Hospitals",
  "phone": "+91-80-26304050",
  "address": "154/11, Bannerghatta Road, Bangalore - 560076",
  "website": "https://www.apollohospitals.com",
  "city": "Bangalore",
  "type": "hospital",
  "source": "justdial"
}
```

### With Email Enrichment:

```json
{
  "name": "Max Healthcare",
  "phone": "+91-11-26515050",
  "address": "Press Enclave Road, Saket, Delhi - 110017",
  "website": "https://www.maxhealthcare.in",
  "email": "info@maxhealthcare.in",  // ← Extracted from website
  "city": "Delhi",
  "type": "hospital",
  "source": "justdial"
}
```

---

## 💡 Tips for Indian Market

### 1. **Phone Numbers are More Reliable than Emails**

In India, many clinics list phone numbers but not emails on JustDial. Options:

**Option A:** Use email enrichment
```bash
python cli.py scrape --source justdial --city Mumbai --type clinic --limit 50 --enrich-emails
```

**Option B:** Send emails only to leads with valid emails
```python
# The system automatically skips leads without email
python cli.py send-initial --limit 50
# Only sends to leads where email is not null
```

**Option C:** Manual verification
- Hire a VA to call and collect emails
- Use the phone numbers from JustDial
- Update database manually

### 2. **Target Tier 1 Cities First**

Better digital adoption = higher email availability:
- Mumbai (★★★★★)
- Bangalore (★★★★★)
- Delhi/NCR (★★★★★)
- Pune (★★★★☆)
- Hyderabad (★★★★☆)

### 3. **Specific Area Targeting**

Target upscale areas with private clinics:
- **Mumbai:** Bandra, Andheri, Powai, Worli
- **Bangalore:** Koramangala, Indiranagar, Whitefield
- **Delhi:** Saket, Greater Kailash, Vasant Vihar
- **Pune:** Koregaon Park, Kalyani Nagar
- **Hyderabad:** Banjara Hills, Jubilee Hills

### 4. **Hospitals vs Clinics**

**Hospitals:**
- More likely to have websites and emails
- Larger organizations, better digital presence
- May take longer to decide

**Clinics:**
- Smaller, faster decision makers
- Less likely to have emails on listings
- Need email enrichment

**Recommendation:** Target both, but clinics are better for quick wins.

---

## 🛠️ Practical Examples

### Scenario 1: Quick Start (No API Key)

```bash
# 100 leads in 1 hour from JustDial
python cli.py scrape --source justdial --city Mumbai --type clinic --limit 50
python cli.py scrape --source justdial --city Delhi --type clinic --limit 50

# Check how many have emails
python cli.py stats

# Send to those with emails
python cli.py send-initial --limit 20
```

### Scenario 2: High Quality Data (With Google Maps API)

```bash
# Get Google Maps API key (first 100 requests/month free)
# Add to .env: GOOGLE_MAPS_API_KEY=your-key

# Scrape verified data
python cli.py scrape --source google-maps --city "Mumbai, India" --type clinic --limit 50 --enrich-emails

# Higher email success rate
python cli.py stats
```

### Scenario 3: Maximum Coverage

```bash
# Use both sources + email enrichment
python cli.py scrape --source all --city Mumbai --type clinic --limit 50 --enrich-emails

# This will:
# 1. Scrape from Google Maps
# 2. Scrape from JustDial
# 3. Remove duplicates
# 4. Visit websites to extract emails
# 5. Save to database
```

---

## 📊 Expected Data Quality

### JustDial (No Enrichment):
- **Total Scraped:** 100 leads
- **With Phone:** ~95 (95%)
- **With Website:** ~40 (40%)
- **With Email:** ~10 (10%)
- **Usable for Email Campaign:** 10

### JustDial + Email Enrichment:
- **Total Scraped:** 100 leads
- **With Phone:** ~95 (95%)
- **With Website:** ~40 (40%)
- **Websites Visited:** 40
- **Emails Extracted:** ~15 (37% success rate)
- **Usable for Email Campaign:** 15-20

### Google Maps + Email Enrichment:
- **Total Scraped:** 100 leads
- **With Phone:** ~98 (98%)
- **With Website:** ~60 (60%)
- **Websites Visited:** 60
- **Emails Extracted:** ~25 (42% success rate)
- **Usable for Email Campaign:** 30-35

---

## 🚨 Important Notes

### 1. Respect Rate Limits

```bash
# Don't scrape too aggressively
# JustDial may block if too many requests

# Good practice:
python cli.py scrape --source justdial --city Mumbai --type clinic --limit 50
# Wait 10-15 minutes
python cli.py scrape --source justdial --city Delhi --type clinic --limit 50
```

### 2. Use Proxies for Large Scale

If scraping 1000+ leads/day, consider:
- Rotating proxies
- VPN rotation
- Distributed scraping

### 3. Legal Compliance

- JustDial data is publicly available
- Using data for B2B outreach is generally acceptable
- Always include unsubscribe links in emails
- Respect opt-outs immediately

### 4. Data Verification

```bash
# Before sending emails, verify data quality
python cli.py stats

# Check sample leads
sqlite3 qb24_sales.db "SELECT name, email, city FROM leads LIMIT 10;"
```

---

## 🎯 30-Day Collection Plan

### Goal: 3,000 leads with emails

```bash
# Week 1: Mumbai + Delhi (1,000 leads)
# Days 1-2: Mumbai
python cli.py scrape --source all --city Mumbai --type clinic --limit 200 --enrich-emails
python cli.py scrape --source all --city Mumbai --type hospital --limit 100

# Days 3-4: Delhi
python cli.py scrape --source all --city Delhi --type clinic --limit 200 --enrich-emails
python cli.py scrape --source all --city Delhi --type hospital --limit 100

# Days 5-7: Buffer + quality check

# Week 2: Bangalore + Pune (800 leads)
# Week 3: Hyderabad + Chennai (700 leads)
# Week 4: Tier 2 cities (500 leads)

# Total: 3,000+ leads
# With emails: ~600-900 (20-30%)
# Enough for: 2-3 months of email campaign
```

---

## 🔧 Troubleshooting

### Problem: "No results found"

**Solution:** Try different city name formats:
```bash
# Try these variations
python cli.py scrape --source justdial --city Mumbai
python cli.py scrape --source justdial --city "Mumbai, Maharashtra"
python cli.py scrape --source google-maps --city "Mumbai, India"
```

### Problem: "Very few emails extracted"

**Reasons:**
1. Many Indian clinics don't have websites
2. Email not visible on website
3. Contact forms instead of email addresses

**Solutions:**
- Focus on hospitals (higher email rate)
- Target tier 1 cities (better digital presence)
- Use Google Maps API (better data)
- Manual verification via phone calls

### Problem: "JustDial blocking requests"

**Solutions:**
- Add delays between requests (already built-in)
- Use VPN or proxy
- Spread scraping across multiple days
- Use Google Maps API instead

---

## 📞 Alternative: Phone-First Approach

If email extraction is challenging:

1. **Scrape phone numbers** (95% success rate)
2. **Hire a VA** to call and collect emails
3. **Update database** manually
4. **Then start email campaign**

```bash
# Export leads with phone numbers
sqlite3 qb24_sales.db "SELECT name, phone, city FROM leads WHERE phone IS NOT NULL" > leads_to_call.csv

# VA calls and collects emails
# Import emails back
python cli.py mark-waitlisted --email collected@email.com
```

---

## ✅ Quick Start Checklist

- [ ] Install dependencies: `pip install -r requirements.txt`
- [ ] Configure .env with SMTP (not needed for scraping)
- [ ] Initialize database: `python cli.py init-db`
- [ ] Test scrape 10 leads: `python cli.py scrape --source justdial --city Mumbai --type clinic --limit 10`
- [ ] Check results: `python cli.py stats`
- [ ] Try email enrichment: `python cli.py scrape --source justdial --city Mumbai --type clinic --limit 10 --enrich-emails`
- [ ] Scale up to 50-100/day

---

**The scraping system is specifically optimized for the Indian market using JustDial and Google Maps!** 🇮🇳
