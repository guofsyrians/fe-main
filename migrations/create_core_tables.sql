-- Migration: Create core tables for Syrian Student Union website
-- Tables: cities, sub_unions, articles, projects, offices

-- ============================================================================
-- CREATE ENUMS
-- ============================================================================

-- Enum for sub_union status
CREATE TYPE sub_union_status AS ENUM ('active', 'inactive');

-- Enum for article category
CREATE TYPE article_category AS ENUM ('news', 'events', 'announcements');

-- Enum for project status
CREATE TYPE project_status AS ENUM ('ongoing', 'completed', 'planned');

-- Enum for office category
CREATE TYPE office_category AS ENUM ('board', 'supervisory', 'electoral', 'offices', 'general_assembly');

-- ============================================================================
-- CREATE TABLES
-- ============================================================================

-- 1. Cities table (must be created first as sub_unions references it)
CREATE TABLE IF NOT EXISTS public.cities (
    id SERIAL PRIMARY KEY,
    city_code TEXT UNIQUE NOT NULL,
    name_ar TEXT NOT NULL,
    name_en TEXT NOT NULL,
    name_tr TEXT NOT NULL,
    svg_x INTEGER NOT NULL,
    svg_y INTEGER NOT NULL,
    color_zone INTEGER NOT NULL,
    click_zone INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 2. Sub-unions table
CREATE TABLE IF NOT EXISTS public.sub_unions (
    id SERIAL PRIMARY KEY,
    name_ar TEXT NOT NULL,
    name_en TEXT NOT NULL,
    name_tr TEXT NOT NULL,
    city_id INTEGER REFERENCES public.cities(id) ON DELETE SET NULL,
    contact_email TEXT NOT NULL,
    phone TEXT NOT NULL,
    member_count INTEGER DEFAULT 0,
    established_year INTEGER,
    status sub_union_status DEFAULT 'active' NOT NULL,
    logo_url TEXT,
    about_description_ar TEXT,
    about_description_en TEXT,
    about_description_tr TEXT,
    card_description_ar TEXT,
    card_description_en TEXT,
    card_description_tr TEXT,
    contact_number_ar TEXT,
    contact_number_en TEXT,
    contact_number_tr TEXT,
    activities_and_achievements_ar TEXT,
    activities_and_achievements_en TEXT,
    activities_and_achievements_tr TEXT,
    special_achievements_ar TEXT,
    special_achievements_en TEXT,
    special_achievements_tr TEXT,
    current_administrative_team_ar TEXT,
    current_administrative_team_en TEXT,
    current_administrative_team_tr TEXT,
    notes_ar TEXT,
    notes_en TEXT,
    notes_tr TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 3. Articles table
CREATE TABLE IF NOT EXISTS public.articles (
    id SERIAL PRIMARY KEY,
    title_ar TEXT NOT NULL,
    title_en TEXT NOT NULL,
    title_tr TEXT NOT NULL,
    excerpt_ar TEXT NOT NULL,
    excerpt_en TEXT NOT NULL,
    excerpt_tr TEXT NOT NULL,
    content_ar TEXT,
    content_en TEXT,
    content_tr TEXT,
    date DATE NOT NULL,
    formatted_date_ar TEXT NOT NULL,
    formatted_date_en TEXT NOT NULL,
    formatted_date_tr TEXT NOT NULL,
    category article_category NOT NULL,
    image_url TEXT NOT NULL,
    author_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    published BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 4. Projects table
CREATE TABLE IF NOT EXISTS public.projects (
    id SERIAL PRIMARY KEY,
    title_ar TEXT NOT NULL,
    title_en TEXT NOT NULL,
    title_tr TEXT NOT NULL,
    description_ar TEXT NOT NULL,
    description_en TEXT NOT NULL,
    description_tr TEXT NOT NULL,
    status project_status NOT NULL,
    image_url TEXT,
    start_date DATE NOT NULL,
    end_date DATE,
    progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    member_count INTEGER DEFAULT 0,
    category_ar TEXT NOT NULL,
    category_en TEXT NOT NULL,
    category_tr TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 5. Offices table
CREATE TABLE IF NOT EXISTS public.offices (
    id SERIAL PRIMARY KEY,
    category office_category NOT NULL,
    name_ar TEXT,
    name_en TEXT,
    name_tr TEXT,
    head_name_ar TEXT NOT NULL,
    head_name_en TEXT NOT NULL,
    head_name_tr TEXT NOT NULL,
    position_ar TEXT NOT NULL,
    position_en TEXT NOT NULL,
    position_tr TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    image_url TEXT,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- ============================================================================
-- CREATE INDEXES
-- ============================================================================

-- Cities indexes
CREATE INDEX IF NOT EXISTS idx_cities_city_code ON public.cities(city_code);

-- Sub-unions indexes
CREATE INDEX IF NOT EXISTS idx_sub_unions_city_id ON public.sub_unions(city_id);
CREATE INDEX IF NOT EXISTS idx_sub_unions_status ON public.sub_unions(status);

-- Articles indexes
CREATE INDEX IF NOT EXISTS idx_articles_category ON public.articles(category);
CREATE INDEX IF NOT EXISTS idx_articles_date ON public.articles(date);
CREATE INDEX IF NOT EXISTS idx_articles_published ON public.articles(published);
CREATE INDEX IF NOT EXISTS idx_articles_author_id ON public.articles(author_id);

-- Projects indexes
CREATE INDEX IF NOT EXISTS idx_projects_status ON public.projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_start_date ON public.projects(start_date);

-- Offices indexes
CREATE INDEX IF NOT EXISTS idx_offices_category ON public.offices(category);
CREATE INDEX IF NOT EXISTS idx_offices_order_index ON public.offices(order_index);

-- ============================================================================
-- CREATE UPDATED_AT TRIGGER FUNCTION
-- ============================================================================

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at on all tables
CREATE TRIGGER update_cities_updated_at
    BEFORE UPDATE ON public.cities
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_sub_unions_updated_at
    BEFORE UPDATE ON public.sub_unions
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_articles_updated_at
    BEFORE UPDATE ON public.articles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_projects_updated_at
    BEFORE UPDATE ON public.projects
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_offices_updated_at
    BEFORE UPDATE ON public.offices
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================================
-- ENABLE ROW LEVEL SECURITY
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE public.cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sub_unions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.offices ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- CREATE RLS POLICIES
-- ============================================================================

-- Cities: Public read access
CREATE POLICY "Public can view cities"
    ON public.cities
    FOR SELECT
    USING (true);

-- Sub-unions: Public read access
CREATE POLICY "Public can view sub_unions"
    ON public.sub_unions
    FOR SELECT
    USING (true);

-- Articles: Public read access for published articles
CREATE POLICY "Public can view published articles"
    ON public.articles
    FOR SELECT
    USING (published = true);

-- Projects: Public read access
CREATE POLICY "Public can view projects"
    ON public.projects
    FOR SELECT
    USING (true);

-- Offices: Public read access
CREATE POLICY "Public can view offices"
    ON public.offices
    FOR SELECT
    USING (true);

-- Note: Admin/moderation policies can be added later if needed for INSERT/UPDATE/DELETE operations

