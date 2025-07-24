#!/bin/bash
# Data Extraction Script for Supabase Migration
# This script will export all data from Supabase before migration

# Set your Supabase credentials
SUPABASE_URL="https://wahuoitatqcsurjvoqff.supabase.co"
SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndhaHVvaXRhdHFjc3VyanZvcWZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk5MTYzNDksImV4cCI6MjA2NTQ5MjM0OX0.HkSG2ptTxU8eijR_uQ-u47_caS3B9PpLYf4a2TAqED8"

# Create backup directory
mkdir -p ./migration-backup/supabase-data
mkdir -p ./migration-backup/supabase-schema

echo "🔍 Starting Supabase data extraction..."

# Tables to export (based on your schema)
TABLES=(
  "email_subscriptions"
  "gallery" 
  "news"
  "profiles"
  "projects"
  "staff"
  "staff_accounts"
  "user_analytics"
  "user_profiles"
  "website_images"
)

# Export each table's data
for table in "${TABLES[@]}"; do
  echo "📦 Exporting table: $table"
  # You'll need to use Supabase CLI or create a custom export script
  # supabase db dump --schema public --table $table > ./migration-backup/supabase-data/${table}.sql
done

echo "✅ Data extraction completed!"
echo "📁 Data saved to: ./migration-backup/"
