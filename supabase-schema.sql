-- Pipeline CRM Database Schema
-- Safe for existing Supabase project (uses prefixed table names)

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Leads table
CREATE TABLE IF NOT EXISTS pipeline_leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  company TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  stage TEXT NOT NULL DEFAULT 'New' CHECK (stage IN ('New', 'Contacted', 'Qualified', 'Proposal', 'Won', 'Lost')),
  owner TEXT NOT NULL,
  source TEXT,
  value INTEGER DEFAULT 0,
  notes TEXT,
  last_contacted TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Activities table
CREATE TABLE IF NOT EXISTS pipeline_activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id UUID REFERENCES pipeline_leads(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('note', 'email', 'stage_change')),
  content TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_pipeline_leads_user_id ON pipeline_leads(user_id);
CREATE INDEX IF NOT EXISTS idx_pipeline_leads_stage ON pipeline_leads(stage);
CREATE INDEX IF NOT EXISTS idx_pipeline_leads_created_at ON pipeline_leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_pipeline_activities_lead_id ON pipeline_activities(lead_id);
CREATE INDEX IF NOT EXISTS idx_pipeline_activities_created_at ON pipeline_activities(created_at DESC);

-- Updated_at trigger function (create only if doesn't exist)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for leads table
DROP TRIGGER IF EXISTS update_pipeline_leads_updated_at ON pipeline_leads;
CREATE TRIGGER update_pipeline_leads_updated_at
  BEFORE UPDATE ON pipeline_leads
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE pipeline_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE pipeline_activities ENABLE ROW LEVEL SECURITY;

-- RLS Policies for pipeline_leads
DROP POLICY IF EXISTS "Users can view own leads" ON pipeline_leads;
CREATE POLICY "Users can view own leads"
  ON pipeline_leads FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own leads" ON pipeline_leads;
CREATE POLICY "Users can insert own leads"
  ON pipeline_leads FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own leads" ON pipeline_leads;
CREATE POLICY "Users can update own leads"
  ON pipeline_leads FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own leads" ON pipeline_leads;
CREATE POLICY "Users can delete own leads"
  ON pipeline_leads FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for pipeline_activities
DROP POLICY IF EXISTS "Users can view activities for own leads" ON pipeline_activities;
CREATE POLICY "Users can view activities for own leads"
  ON pipeline_activities FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM pipeline_leads
      WHERE pipeline_leads.id = pipeline_activities.lead_id
      AND pipeline_leads.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can insert activities for own leads" ON pipeline_activities;
CREATE POLICY "Users can insert activities for own leads"
  ON pipeline_activities FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM pipeline_leads
      WHERE pipeline_leads.id = lead_id
      AND pipeline_leads.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can delete own activities" ON pipeline_activities;
CREATE POLICY "Users can delete own activities"
  ON pipeline_activities FOR DELETE
  USING (auth.uid() = user_id);

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'Pipeline CRM schema created successfully!';
  RAISE NOTICE 'Tables: pipeline_leads, pipeline_activities';
  RAISE NOTICE 'RLS policies: enabled';
END $$;
