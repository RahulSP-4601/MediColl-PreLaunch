-- =====================================================
-- MediColl24-Sales Complete Database Schema
-- Run this entire script in Supabase SQL Editor
-- =====================================================

-- =====================================================
-- 1. LEADS TABLE (Sales/Marketing Pipeline)
-- =====================================================

CREATE TABLE IF NOT EXISTS leads (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    type VARCHAR(50),  -- 'clinic' or 'hospital'
    specialty VARCHAR(100),
    website VARCHAR(255),
    source VARCHAR(100),  -- 'google_maps', 'justdial', 'landing_page'
    status VARCHAR(50) DEFAULT 'new',  -- 'new', 'email_sent', 'follow_up_sent', 'waitlisted', 'not_interested'

    -- Social Media
    instagram VARCHAR(255),
    facebook VARCHAR(255),
    linkedin_profile VARCHAR(255),
    linkedin_company VARCHAR(255),

    -- Timestamps
    email_sent_at TIMESTAMPTZ,
    follow_up_sent_at TIMESTAMPTZ,
    waitlisted_at TIMESTAMPTZ,
    not_interested_at TIMESTAMPTZ,
    scraped_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    -- Constraints
    CONSTRAINT leads_email_phone_check CHECK (email IS NOT NULL OR phone IS NOT NULL),
    CONSTRAINT leads_email_unique UNIQUE(email)
);

-- Indexes for leads table
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_phone ON leads(phone);
CREATE INDEX IF NOT EXISTS idx_leads_city ON leads(city);
CREATE INDEX IF NOT EXISTS idx_leads_type ON leads(type);
CREATE INDEX IF NOT EXISTS idx_leads_source ON leads(source);
CREATE INDEX IF NOT EXISTS idx_leads_email_sent_at ON leads(email_sent_at);
CREATE INDEX IF NOT EXISTS idx_leads_follow_up_sent_at ON leads(follow_up_sent_at);

-- =====================================================
-- 2. WAITLIST TABLE (Product Interest)
-- =====================================================

CREATE TABLE IF NOT EXISTS waitlist (
    id BIGSERIAL PRIMARY KEY,

    -- Contact Information
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(20) NOT NULL,
    clinic_name VARCHAR(255),
    city VARCHAR(100),

    -- Metadata
    source VARCHAR(100) DEFAULT 'landing_page',
    referral_code VARCHAR(50),

    -- Status tracking
    status VARCHAR(50) DEFAULT 'pending',  -- 'pending', 'invited', 'converted', 'cancelled'
    priority INTEGER DEFAULT 0,  -- Higher number = higher priority

    -- Timestamps
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    invited_at TIMESTAMPTZ,
    converted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    -- Additional context
    notes TEXT,
    metadata JSONB
);

-- Indexes for waitlist table
CREATE INDEX IF NOT EXISTS idx_waitlist_email ON waitlist(email);
CREATE INDEX IF NOT EXISTS idx_waitlist_phone ON waitlist(phone);
CREATE INDEX IF NOT EXISTS idx_waitlist_status ON waitlist(status);
CREATE INDEX IF NOT EXISTS idx_waitlist_joined_at ON waitlist(joined_at);
CREATE INDEX IF NOT EXISTS idx_waitlist_priority ON waitlist(priority DESC);
CREATE INDEX IF NOT EXISTS idx_waitlist_city ON waitlist(city);

-- =====================================================
-- 3. CAMPAIGNS TABLE (Email Campaign Tracking)
-- =====================================================

CREATE TABLE IF NOT EXISTS campaigns (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    template_name VARCHAR(100),
    status VARCHAR(50) DEFAULT 'active',  -- 'active', 'paused', 'completed'
    daily_limit INTEGER DEFAULT 100,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 4. SENT EMAILS TABLE (Email Tracking)
-- =====================================================

CREATE TABLE IF NOT EXISTS sent_emails (
    id BIGSERIAL PRIMARY KEY,
    lead_id BIGINT REFERENCES leads(id) ON DELETE CASCADE,
    campaign_id BIGINT REFERENCES campaigns(id) ON DELETE SET NULL,
    email_type VARCHAR(50) NOT NULL,  -- 'initial', 'follow_up_1', 'follow_up_2'
    subject VARCHAR(255),
    sent_at TIMESTAMPTZ DEFAULT NOW(),
    opened BOOLEAN DEFAULT FALSE,
    clicked BOOLEAN DEFAULT FALSE,
    replied BOOLEAN DEFAULT FALSE,
    bounced BOOLEAN DEFAULT FALSE,
    unsubscribed BOOLEAN DEFAULT FALSE,

    CONSTRAINT unique_lead_campaign_type UNIQUE(lead_id, campaign_id, email_type)
);

-- Indexes for sent_emails
CREATE INDEX IF NOT EXISTS idx_sent_emails_lead_id ON sent_emails(lead_id);
CREATE INDEX IF NOT EXISTS idx_sent_emails_campaign_id ON sent_emails(campaign_id);
CREATE INDEX IF NOT EXISTS idx_sent_emails_sent_at ON sent_emails(sent_at);

-- =====================================================
-- 5. WHATSAPP MESSAGES TABLE (WhatsApp Tracking)
-- =====================================================

CREATE TABLE IF NOT EXISTS whatsapp_messages (
    id BIGSERIAL PRIMARY KEY,
    lead_id BIGINT REFERENCES leads(id) ON DELETE CASCADE,
    message_type VARCHAR(50) NOT NULL,  -- 'initial', 'follow_up', 'reminder'
    message_text TEXT,
    sent_at TIMESTAMPTZ DEFAULT NOW(),
    delivered BOOLEAN DEFAULT FALSE,
    read BOOLEAN DEFAULT FALSE,
    replied BOOLEAN DEFAULT FALSE,
    twilio_sid VARCHAR(255)
);

-- Indexes for whatsapp_messages
CREATE INDEX IF NOT EXISTS idx_whatsapp_lead_id ON whatsapp_messages(lead_id);
CREATE INDEX IF NOT EXISTS idx_whatsapp_sent_at ON whatsapp_messages(sent_at);

-- =====================================================
-- 6. FUNCTIONS & TRIGGERS
-- =====================================================

-- Function to auto-update updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for auto-updating updated_at
DROP TRIGGER IF EXISTS update_leads_updated_at ON leads;
CREATE TRIGGER update_leads_updated_at
    BEFORE UPDATE ON leads
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_waitlist_updated_at ON waitlist;
CREATE TRIGGER update_waitlist_updated_at
    BEFORE UPDATE ON waitlist
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_campaigns_updated_at ON campaigns;
CREATE TRIGGER update_campaigns_updated_at
    BEFORE UPDATE ON campaigns
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 7. VIEWS FOR ANALYTICS
-- =====================================================

-- Campaign Stats View
CREATE OR REPLACE VIEW campaign_stats AS
SELECT
    COUNT(*) as total_leads,
    COUNT(*) FILTER (WHERE status = 'new') as new_leads,
    COUNT(*) FILTER (WHERE status = 'email_sent') as email_sent,
    COUNT(*) FILTER (WHERE status = 'follow_up_sent') as follow_up_sent,
    COUNT(*) FILTER (WHERE status = 'waitlisted') as waitlisted,
    COUNT(*) FILTER (WHERE status = 'not_interested') as not_interested,
    ROUND(
        (COUNT(*) FILTER (WHERE status = 'waitlisted')::DECIMAL /
        NULLIF(COUNT(*) FILTER (WHERE status IN ('email_sent', 'follow_up_sent', 'waitlisted', 'not_interested')), 0)) * 100,
        2
    ) as conversion_rate
FROM leads;

-- Waitlist Stats View
CREATE OR REPLACE VIEW waitlist_stats AS
SELECT
    COUNT(*) as total_waitlist,
    COUNT(*) FILTER (WHERE status = 'pending') as pending,
    COUNT(*) FILTER (WHERE status = 'invited') as invited,
    COUNT(*) FILTER (WHERE status = 'converted') as converted,
    COUNT(*) FILTER (WHERE status = 'cancelled') as cancelled,
    COUNT(*) FILTER (WHERE joined_at > NOW() - INTERVAL '7 days') as joined_last_7_days,
    COUNT(*) FILTER (WHERE joined_at > NOW() - INTERVAL '30 days') as joined_last_30_days,
    ROUND(AVG(priority), 2) as avg_priority
FROM waitlist;

-- =====================================================
-- 8. ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE sent_emails ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_messages ENABLE ROW LEVEL SECURITY;

-- Create policies (allow all operations for now - adjust based on your auth)
-- Drop existing policies first to avoid conflicts
DROP POLICY IF EXISTS "Enable all access for leads" ON leads;
DROP POLICY IF EXISTS "Enable read access for waitlist" ON waitlist;
DROP POLICY IF EXISTS "Enable insert for waitlist" ON waitlist;
DROP POLICY IF EXISTS "Enable update for waitlist" ON waitlist;
DROP POLICY IF EXISTS "Enable all access for campaigns" ON campaigns;
DROP POLICY IF EXISTS "Enable all access for sent_emails" ON sent_emails;
DROP POLICY IF EXISTS "Enable all access for whatsapp_messages" ON whatsapp_messages;

-- LEADS
CREATE POLICY "Enable all access for leads" ON leads
    FOR ALL USING (true) WITH CHECK (true);

-- WAITLIST
CREATE POLICY "Enable read access for waitlist" ON waitlist
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for waitlist" ON waitlist
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for waitlist" ON waitlist
    FOR UPDATE USING (true) WITH CHECK (true);

-- CAMPAIGNS
CREATE POLICY "Enable all access for campaigns" ON campaigns
    FOR ALL USING (true) WITH CHECK (true);

-- SENT_EMAILS
CREATE POLICY "Enable all access for sent_emails" ON sent_emails
    FOR ALL USING (true) WITH CHECK (true);

-- WHATSAPP_MESSAGES
CREATE POLICY "Enable all access for whatsapp_messages" ON whatsapp_messages
    FOR ALL USING (true) WITH CHECK (true);

-- =====================================================
-- 9. COMMENTS (Documentation)
-- =====================================================

COMMENT ON TABLE leads IS 'Sales and marketing leads from scraping and campaigns';
COMMENT ON TABLE waitlist IS 'Product waitlist signups from landing page';
COMMENT ON TABLE campaigns IS 'Email campaign definitions and tracking';
COMMENT ON TABLE sent_emails IS 'Tracks all emails sent to leads';
COMMENT ON TABLE whatsapp_messages IS 'Tracks all WhatsApp messages sent to leads';

COMMENT ON COLUMN waitlist.priority IS 'Higher number = earlier access (e.g., 10 for investors, 5 for early signups, 0 for regular)';
COMMENT ON COLUMN waitlist.metadata IS 'JSON field for utm_source, utm_campaign, device info, etc.';
COMMENT ON COLUMN leads.status IS 'Lead lifecycle: new → email_sent → follow_up_sent → waitlisted/not_interested';

-- =====================================================
-- DONE! All tables created successfully
-- =====================================================

-- Verify tables were created
SELECT
    schemaname,
    tablename,
    tableowner
FROM pg_tables
WHERE schemaname = 'public'
    AND tablename IN ('leads', 'waitlist', 'campaigns', 'sent_emails', 'whatsapp_messages')
ORDER BY tablename;
