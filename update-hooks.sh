#!/bin/bash

# Simple script to update hooks to use API client instead of Supabase

HOOKS_DIR="src/hooks"

echo "Updating hooks to use API client..."

# List of hook files to update
FILES=(
    "useNews.ts"
    "useStaff.ts" 
    "useStaffAccounts.ts"
    "useWebsiteImages.ts"
    "useCreateNews.ts"
    "useCreateProject.ts"
    "useCreateStaff.ts"
    "useFileUpload.ts"
)

for file in "${FILES[@]}"; do
    if [ -f "$HOOKS_DIR/$file" ]; then
        echo "Updating $file..."
        
        # Comment out Supabase import and add API client import
        sed -i "s|import { supabase } from '@/integrations/supabase/client';|// import { supabase } from '@/integrations/supabase/client';\nimport { apiClient } from '@/lib/apiClient';|g" "$HOOKS_DIR/$file"
        
        echo "✅ Updated $file"
    else
        echo "❌ File not found: $file"
    fi
done

echo "🎉 Hook updates completed!"
