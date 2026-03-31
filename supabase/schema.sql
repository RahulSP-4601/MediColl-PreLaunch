-- Supabase Schema for MediColl24-Sales
-- Run this in your Supabase SQL Editor

-- Create leads table
CREATE TABLE IF NOT EXISTS leads (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(20),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    type VARCHAR(50),  -- 'clinic' or 'hospital'
    specialty VARCHAR(100),
    website VARCHAR(255),
    source VARCHAR(100),  -- 'google_maps', 'justdial', etc.
    status VARCHAR(50) DEFAULT 'new',  -- 'new', 'email_sent', 'follow_up_sent', 'waitlisted', 'not_interested'

    -- Social Media
    instagram VARCHAR(255),
    facebook VARCHAR(255),

    -- Timestamps
    email_sent_at TIMESTAMPTZ,
    follow_up_sent_at TIMESTAMPTZ,
    waitlisted_at TIMESTAMPTZ,
    not_interested_at TIMESTAMPTZ,
    scraped_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    -- Indexes
    CONSTRAINT leads_email_phone_check CHECK (email IS NOT NULL OR phone IS NOT NULL)
);

-- Create indexes for faster queries
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_email ON leads(email);
CREATE INDEX idx_leads_phone ON leads(phone);
CREATE INDEX idx_leads_city ON leads(city);
CREATE INDEX idx_leads_type ON leads(type);
CREATE INDEX idx_leads_email_sent_at ON leads(email_sent_at);
CREATE INDEX idx_leads_follow_up_sent_at ON leads(follow_up_sent_at);

-- Create campaigns table
CREATE TABLE IF NOT EXISTS campaigns (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    template_name VARCHAR(100),
    status VARCHAR(50) DEFAULT 'active',
    daily_limit INTEGER DEFAULT 100,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create sent_emails tracking table
CREATE TABLE IF NOT EXISTS sent_emails (
    id BIGSERIAL PRIMARY KEY,
    lead_id BIGINT REFERENCES leads(id),
    campaign_id BIGINT REFERENCES campaigns(id),
    email_type VARCHAR(50) NOT NULL,  -- 'initial', 'follow_up_1', etc.
    subject VARCHAR(255),
    sent_at TIMESTAMPTZ DEFAULT NOW(),
    opened BOOLEAN DEFAULT FALSE,
    clicked BOOLEAN DEFAULT FALSE,
    replied BOOLEAN DEFAULT FALSE,
    bounced BOOLEAN DEFAULT FALSE,
    unsubscribed BOOLEAN DEFAULT FALSE,

    UNIQUE(lead_id, campaign_id, email_type)
);

-- Create whatsapp_messages tracking table
CREATE TABLE IF NOT EXISTS whatsapp_messages (
    id BIGSERIAL PRIMARY KEY,
    lead_id BIGINT REFERENCES leads(id),
    message_type VARCHAR(50) NOT NULL,  -- 'initial', 'follow_up'
    message_text TEXT,
    sent_at TIMESTAMPTZ DEFAULT NOW(),
    delivered BOOLEAN DEFAULT FALSE,
    read BOOLEAN DEFAULT FALSE,
    replied BOOLEAN DEFAULT FALSE,
    twilio_sid VARCHAR(255)
);

-- Create function to auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for auto-updating updated_at
CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON leads
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE sent_emails ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_messages ENABLE ROW LEVEL SECURITY;

-- Create policy to allow authenticated users to do everything
CREATE POLICY "Allow all operations for authenticated users" ON leads
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all operations for authenticated users" ON campaigns
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all operations for authenticated users" ON sent_emails
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all operations for authenticated users" ON whatsapp_messages
    FOR ALL USING (auth.role() = 'authenticated');

-- Create view for campaign stats
CREATE OR REPLACE VIEW campaign_stats AS
SELECT
    COUNT(*) as total_leads,
    COUNT(*) FILTER (WHERE status = 'new') as new,
    COUNT(*) FILTER (WHERE status = 'email_sent') as email_sent,
    COUNT(*) FILTER (WHERE status = 'follow_up_sent') as follow_up_sent,
    COUNT(*) FILTER (WHERE status = 'waitlisted') as waitlisted,
    COUNT(*) FILTER (WHERE status = 'not_interested') as not_interested,
    COUNT(*) FILTER (WHERE email IS NOT NULL) as with_email,
    COUNT(*) FILTER (WHERE phone IS NOT NULL) as with_phone,
    COUNT(*) FILTER (WHERE instagram IS NOT NULL OR facebook IS NOT NULL) as with_social_media,
    ROUND(
        (COUNT(*) FILTER (WHERE status = 'waitlisted')::NUMERIC /
         NULLIF(COUNT(*) FILTER (WHERE status != 'new'), 0)) * 100,
        2
    ) as conversion_rate
FROM leads;

-- Grant access to view
GRANT SELECT ON campaign_stats TO authenticated;
