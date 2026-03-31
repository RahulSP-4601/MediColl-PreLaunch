# Deployment Guide - QB24-Sales Pipeline

## Deploy for Real-time, 24/7 Automated Operation

---

## 🎯 Deployment Options

### Option 1: **Railway.app** (Recommended - Easiest)
- ✅ Free tier available
- ✅ Automatic deployments from GitHub
- ✅ Built-in cron jobs
- ✅ Simple setup

### Option 2: **Heroku**
- ✅ Well-documented
- ✅ Add-ons for scheduling
- ✅ Easy scaling

### Option 3: **AWS EC2**
- ✅ Full control
- ✅ Most powerful
- ❌ More complex setup

### Option 4: **DigitalOcean Droplet**
- ✅ Simple VPS
- ✅ $5/month
- ✅ Good for small scale

---

## 🚀 Quick Deploy to Railway.app (Recommended)

### Step 1: Setup Supabase (Database)

```bash
# 1. Go to supabase.com and create account
# 2. Create new project
# 3. Go to SQL Editor
# 4. Copy and run: supabase/schema.sql
# 5. Get your credentials:
#    - Project URL: https://xxx.supabase.co
#    - Project API Key: eyJhbGc...
```

### Step 2: Setup Twilio (WhatsApp)

```bash
# 1. Go to twilio.com/console
# 2. Get WhatsApp sandbox number or buy number
# 3. Get credentials:
#    - Account SID: ACxxxxx
#    - Auth Token: xxxxxxx
#    - WhatsApp Number: whatsapp:+14155238886
```

### Step 3: Push Code to GitHub

```bash
# Initialize git
git init
git add .
git commit -m "Initial commit - QB24-Sales pipeline"

# Create GitHub repo and push
git remote add origin https://github.com/yourusername/qb24-sales.git
git branch -M main
git push -u origin main
```

### Step 4: Deploy to Railway

```bash
# 1. Go to railway.app
# 2. Click "New Project" → "Deploy from GitHub repo"
# 3. Select your qb24-sales repo
# 4. Add environment variables (from .env)
```

### Step 5: Add Environment Variables in Railway

```env
# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password
FROM_EMAIL=rahul@quickbook24.ai
FROM_NAME=Rahul Sanjay Panchal

# Supabase
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_KEY=eyJhbGc...

# Twilio WhatsApp
TWILIO_ACCOUNT_SID=ACxxxxx
TWILIO_AUTH_TOKEN=xxxxxxx
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886

# Limits
DAILY_EMAIL_LIMIT=500
HOURLY_EMAIL_LIMIT=50
DAILY_WHATSAPP_LIMIT=100

# Google Maps (optional)
GOOGLE_MAPS_API_KEY=your-api-key
```

### Step 6: Setup Cron Jobs

Create `railway.toml`:

```toml
[build]
builder = "NIXPACKS"

[deploy]
startCommand = "python cli.py run-campaign --initial 50 --followup 30 --mark-not-interested"
healthcheckPath = "/health"
healthcheckTimeout = 300
restartPolicyType = "ON_FAILURE"
restartPolicyMaxRetries = 10

# Run campaign every day at 9 AM IST
[[cron]]
schedule = "0 3 * * *"  # 9 AM IST = 3:30 AM UTC
command = "python cli.py run-campaign --initial 100 --followup 50 --mark-not-interested"
```

---

## 🔄 Automated Daily Workflow

Once deployed, the system runs automatically:

### **Every Day at 9 AM IST:**

```bash
# Railway cron job runs:
python cli.py run-campaign --initial 100 --followup 50 --mark-not-interested
```

**This automatically:**
1. ✅ Scrapes 100 new leads (optional - run manually)
2. ✅ Sends initial emails to leads with status="new"
3. ✅ Sends follow-ups to leads 48hrs+ after initial
4. ✅ Marks non-responders as "not_interested"
5. ✅ Sends WhatsApp messages (if enabled)

### **You manually:**
- **Morning:** Check Supabase, mark who joined waitlist
- **Evening:** Run scraping command for new leads

---

## 📊 Real-time Dashboard

### Setup Supabase Realtime

```sql
-- Enable realtime for leads table
ALTER PUBLICATION supabase_realtime ADD TABLE leads;
```

### Access Dashboard

```bash
# Option 1: Supabase built-in dashboard
https://app.supabase.io/project/xxx/editor

# Option 2: Build custom dashboard (optional)
cd dashboard/
streamlit run app.py
```

---

## 🔧 Manual Controls (While Deployed)

### Via Railway CLI:

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Run commands on deployed app
railway run python cli.py stats
railway run python cli.py scrape --source justdial --city Mumbai --limit 100
railway run python cli.py mark-waitlisted --email user@clinic.com
```

### Via Supabase SQL:

```sql
-- Mark someone as waitlisted
UPDATE leads
SET status = 'waitlisted', waitlisted_at = NOW()
WHERE email = 'user@clinic.com';

-- View stats
SELECT * FROM campaign_stats;
```

---

## 🌐 Alternative: Deploy to AWS EC2

### Step 1: Launch EC2 Instance

```bash
# 1. Go to AWS Console → EC2
# 2. Launch Ubuntu 22.04 instance (t2.micro for free tier)
# 3. Configure security group (allow SSH)
# 4. Connect via SSH
```

### Step 2: Setup Server

```bash
# SSH into server
ssh -i your-key.pem ubuntu@ec2-xx-xx-xx-xx.compute.amazonaws.com

# Update system
sudo apt update && sudo apt upgrade -y

# Install Python
sudo apt install python3.10 python3-pip -y

# Clone repo
git clone https://github.com/yourusername/qb24-sales.git
cd qb24-sales

# Install dependencies
pip3 install -r requirements.txt

# Setup environment
cp .env.example .env
nano .env  # Add your credentials
```

### Step 3: Setup Cron Job

```bash
# Open crontab
crontab -e

# Add daily job (9 AM IST = 3:30 AM UTC)
30 3 * * * cd /home/ubuntu/qb24-sales && /usr/bin/python3 cli.py run-campaign --initial 100 --followup 50 --mark-not-interested >> /home/ubuntu/logs/campaign.log 2>&1
```

### Step 4: Keep Running (Optional - for web dashboard)

```bash
# Install PM2
sudo npm install -g pm2

# Start app
pm2 start "python3 cli.py run-campaign --initial 100 --followup 50" --name qb24-campaign --cron "30 3 * * *"

# Auto-start on reboot
pm2 startup
pm2 save
```

---

## 📱 Webhook Integration (Automatic Waitlist Tracking)

### Setup Webhook Endpoint

Create `api/webhook.py`:

```python
from flask import Flask, request, jsonify
from database.supabase_client import supabase_client

app = Flask(__name__)

@app.route('/webhook/waitlist', methods=['POST'])
def waitlist_webhook():
    """Webhook to receive waitlist signups"""
    data = request.json
    email = data.get('email')

    if email:
        # Update lead status
        supabase_client.update_lead_status(
            email=email,
            status='waitlisted',
            timestamp_field='waitlisted_at'
        )
        return jsonify({"success": True}), 200

    return jsonify({"error": "No email provided"}), 400

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
```

### Configure Your Waitlist Form

```javascript
// On your quickbook24.ai/waitlist page
fetch('https://your-railway-app.railway.app/webhook/waitlist', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({email: 'user@clinic.com'})
});
```

Now when someone joins, status automatically updates! 🎉

---

## 🔐 Security Best Practices

### 1. Environment Variables

```bash
# NEVER commit .env to GitHub
# Always use environment variables in Railway/Heroku
```

### 2. API Rate Limits

```python
# Already built-in:
# - Email: 500/day, 50/hour
# - WhatsApp: 100/day
# - Scraping: 2-3 second delays
```

### 3. Supabase RLS (Row Level Security)

```sql
-- Already enabled in schema.sql
-- Only authenticated users can access data
```

---

## 📊 Monitoring & Logs

### Railway Logs

```bash
# View logs in Railway dashboard
railway logs

# Or via CLI
railway logs --follow
```

### Supabase Logs

```bash
# View in Supabase dashboard
https://app.supabase.io/project/xxx/logs
```

### Custom Logging

```python
# Logs are saved to:
# - logs/app.log (all logs)
# - logs/error.log (errors only)
```

---

## 💰 Cost Estimate

### Free Tier (Good for testing):
- **Supabase:** Free (500MB database, 50K rows)
- **Railway:** $5/month (500 hours execution)
- **Twilio WhatsApp:** $0.005/message
- **Gmail SMTP:** Free (500 emails/day)

### Production ($50-100/month):
- **Supabase Pro:** $25/month (8GB database)
- **Railway Pro:** $20/month (unlimited execution)
- **Twilio:** ~$50/month (10K WhatsApp messages)
- **SendGrid/AWS SES:** $10/month (10K emails)

**Total: ~$105/month** for full production scale

---

## 🚀 Go Live Checklist

- [ ] Supabase database created and schema uploaded
- [ ] Twilio WhatsApp setup (if using)
- [ ] Gmail SMTP configured with App Password
- [ ] Code pushed to GitHub
- [ ] Railway app deployed
- [ ] Environment variables added in Railway
- [ ] Cron job configured (9 AM IST daily)
- [ ] Test scraping: `railway run python cli.py scrape --limit 10`
- [ ] Test email: `railway run python cli.py send-initial --limit 5`
- [ ] Webhook endpoint set up (optional)
- [ ] Monitoring dashboard accessible

---

## 📞 Support & Troubleshooting

### Check Logs:
```bash
railway logs --follow
```

### Test Commands:
```bash
railway run python cli.py test-smtp
railway run python cli.py stats
```

### Common Issues:

**"Supabase connection failed"**
→ Check SUPABASE_URL and SUPABASE_KEY in environment variables

**"SMTP authentication failed"**
→ Use Gmail App Password, not regular password

**"Railway build failed"**
→ Check requirements.txt has all dependencies

---

**Your pipeline is ready for 24/7 automated operation! 🚀**
