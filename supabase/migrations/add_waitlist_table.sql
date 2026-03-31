-- Create waitlist table (separate from leads)
-- This table specifically tracks people who joined the waitlist from the landing page

CREATE TABLE IF NOT EXISTS waitlist (
    id BIGSERIAL PRIMARY KEY,

    -- Contact Information
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(20) NOT NULL,
    clinic_name VARCHAR(255),
    city VARCHAR(100),

    -- Metadata
    source VARCHAR(100) DEFAULT 'landing_page',  -- Where they signed up from
    referral_code VARCHAR(50),  -- If they came from a referral

    -- Status tracking
    status VARCHAR(50) DEFAULT 'pending',  -- 'pending', 'invited', 'converted', 'cancelled'
    priority INTEGER DEFAULT 0,  -- Higher priority = earlier access

    -- Timestamps
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    invited_at TIMESTAMPTZ,  -- When we sent them early access
    converted_at TIMESTAMPTZ,  -- When they became a customer
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    -- Additional context
    notes TEXT,
    metadata JSONB  -- For any additional data
);

-- Create indexes for faster queries
CREATE INDEX idx_waitlist_email ON waitlist(email);
CREATE INDEX idx_waitlist_phone ON waitlist(phone);
CREATE INDEX idx_waitlist_status ON waitlist(status);
CREATE INDEX idx_waitlist_joined_at ON waitlist(joined_at);
CREATE INDEX idx_waitlist_priority ON waitlist(priority);
CREATE INDEX idx_waitlist_city ON waitlist(city);

-- Create trigger for auto-updating updated_at
CREATE TRIGGER update_waitlist_updated_at BEFORE UPDATE ON waitlist
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (adjust based on your auth setup)
CREATE POLICY "Enable read access for all users" ON waitlist
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for all users" ON waitlist
    FOR INSERT WITH CHECK (true);

-- Create view for waitlist stats
CREATE OR REPLACE VIEW waitlist_stats AS
SELECT
    COUNT(*) as total_waitlist,
    COUNT(*) FILTER (WHERE status = 'pending') as pending,
    COUNT(*) FILTER (WHERE status = 'invited') as invited,
    COUNT(*) FILTER (WHERE status = 'converted') as converted,
    COUNT(*) FILTER (WHERE joined_at > NOW() - INTERVAL '7 days') as joined_last_7_days,
    COUNT(*) FILTER (WHERE joined_at > NOW() - INTERVAL '30 days') as joined_last_30_days
FROM waitlist;

-- Comment the tables
COMMENT ON TABLE waitlist IS 'Stores waitlist signups from the landing page';
COMMENT ON COLUMN waitlist.priority IS 'Higher priority gets earlier access (e.g., investors, partners)';
COMMENT ON COLUMN waitlist.metadata IS 'Store additional context like utm_source, utm_campaign, etc.';
