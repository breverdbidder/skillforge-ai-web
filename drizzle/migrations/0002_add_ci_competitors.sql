-- Migration: Add Competitive Intelligence Tables
-- Version: 0002
-- Created: 2026-01-30

-- ============================================================================
-- COMPETITIVE INTELLIGENCE TABLES
-- ============================================================================

-- Competitor Registry
CREATE TABLE IF NOT EXISTS ci_competitors (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  domain TEXT,
  category TEXT CHECK (category IN ('direct', 'adjacent', 'aspirational')),
  description TEXT,
  video_sources JSONB DEFAULT '[]'::jsonb,
  known_features JSONB DEFAULT '[]'::jsonb,
  pricing JSONB,
  traffic_data JSONB,
  tech_stack JSONB,
  last_analyzed TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ci_competitors_category ON ci_competitors(category);
CREATE INDEX IF NOT EXISTS idx_ci_competitors_name ON ci_competitors(name);

-- Competitor Analyses (stores analysis results)
CREATE TABLE IF NOT EXISTS ci_analyses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  competitor_id TEXT NOT NULL REFERENCES ci_competitors(id),
  analysis_type TEXT CHECK (analysis_type IN ('full', 'update', 'monitor')),
  features JSONB DEFAULT '[]'::jsonb,
  ui_patterns JSONB DEFAULT '[]'::jsonb,
  pricing_signals JSONB DEFAULT '[]'::jsonb,
  marketing_claims JSONB DEFAULT '[]'::jsonb,
  technical_stack JSONB DEFAULT '{}'::jsonb,
  screenshots JSONB DEFAULT '[]'::jsonb,
  raw_content TEXT,
  analysis_score INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ci_analyses_competitor ON ci_analyses(competitor_id);
CREATE INDEX IF NOT EXISTS idx_ci_analyses_created ON ci_analyses(created_at DESC);

-- Feature Matrix (comparison data)
CREATE TABLE IF NOT EXISTS ci_feature_matrix (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  feature_name TEXT NOT NULL,
  feature_category TEXT NOT NULL,
  biddeed_status TEXT CHECK (biddeed_status IN ('available', 'planned', 'not_planned')),
  competitors JSONB DEFAULT '{}'::jsonb, -- {competitor_id: true/false/partial}
  priority INTEGER DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ci_feature_matrix_category ON ci_feature_matrix(feature_category);
