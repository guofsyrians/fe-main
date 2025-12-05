-- Migration: Add 'general_assembly' category to office_category enum
-- This migration adds the new 'general_assembly' (الهيئة العمومية) category to the existing office_category enum

-- ============================================================================
-- ADD NEW ENUM VALUE
-- ============================================================================

-- Add 'general_assembly' to the office_category enum
ALTER TYPE office_category ADD VALUE IF NOT EXISTS 'general_assembly';

-- Note: IF NOT EXISTS is used to prevent errors if the value already exists
-- This migration is idempotent and can be run multiple times safely
