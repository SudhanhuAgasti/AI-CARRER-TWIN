-- ==========================================
-- AI Career Twin Database Schema
-- ==========================================

-- Enable UUID extension if available
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table 1: Resumes
-- Holds parsed structured resume data and extracted raw text content.
CREATE TABLE IF NOT EXISTS resumes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    candidate_name VARCHAR(255),
    candidate_email VARCHAR(255),
    candidate_phone VARCHAR(50),
    total_years_experience NUMERIC(4, 2),
    skills TEXT[] DEFAULT '{}',
    education JSONB DEFAULT '[]'::jsonb,
    experience JSONB DEFAULT '[]'::jsonb,
    certifications TEXT[] DEFAULT '{}',
    raw_text TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table 2: ATS Reports
-- Stores deterministic rule-based evaluation results and semantic matching scores.
CREATE TABLE IF NOT EXISTS ats_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    resume_id UUID NOT NULL REFERENCES resumes(id) ON DELETE CASCADE,
    overall_score INT NOT NULL,
    grade VARCHAR(5) NOT NULL,
    checklist_results JSONB DEFAULT '[]'::jsonb,
    job_description TEXT,
    similarity_score INT,
    keyword_overlap JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table 3: Learning Roadmaps
-- Stores custom target study plans generated for developer skill gaps.
CREATE TABLE IF NOT EXISTS roadmaps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    resume_id UUID REFERENCES resumes(id) ON DELETE CASCADE,
    target_role VARCHAR(100) NOT NULL,
    available_hours_per_day INT DEFAULT 2,
    skill_gaps TEXT[] DEFAULT '{}',
    curriculum JSONB NOT NULL,
    validation_errors TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance optimization
CREATE INDEX IF NOT EXISTS idx_resumes_email ON resumes(candidate_email);
CREATE INDEX IF NOT EXISTS idx_ats_reports_resume_id ON ats_reports(resume_id);
CREATE INDEX IF NOT EXISTS idx_roadmaps_resume_id ON roadmaps(resume_id);
