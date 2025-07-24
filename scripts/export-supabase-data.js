import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const SUPABASE_URL = "https://wahuoitatqcsurjvoqff.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndhaHVvaXRhdHFjc3VyanZvcWZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk5MTYzNDksImV4cCI6MjA2NTQ5MjM0OX0.HkSG2ptTxU8eijR_uQ-u47_caS3B9PpLYf4a2TAqED8";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Ensure backup directory exists
const backupDir = path.join(process.cwd(), 'migration-backup', 'supabase-data');
if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir, { recursive: true });
}

// Tables to export
const tables = [
  'email_subscriptions',
  'gallery',
  'news',
  'profiles',
  'projects',
  'staff',
  'staff_accounts',
  'user_analytics',
  'user_profiles',
  'website_images'
];

async function exportSupabaseData() {
  console.log('🔍 Starting Supabase data extraction...');
  
  const allData = {};
  
  for (const table of tables) {
    try {
      console.log(`📦 Extracting data from table: ${table}`);
      
      const { data, error } = await supabase
        .from(table)
        .select('*');
      
      if (error) {
        console.error(`❌ Error extracting ${table}:`, error);
        continue;
      }
      
      allData[table] = data;
      
      // Save individual table data
      const tableFilePath = path.join(backupDir, `${table}.json`);
      fs.writeFileSync(tableFilePath, JSON.stringify(data, null, 2));
      
      console.log(`✅ Exported ${data?.length || 0} records from ${table}`);
      
    } catch (err) {
      console.error(`❌ Failed to export ${table}:`, err);
    }
  }
  
  // Save combined data
  const combinedFilePath = path.join(backupDir, 'complete-database-export.json');
  fs.writeFileSync(combinedFilePath, JSON.stringify(allData, null, 2));
  
  // Create migration report
  const report = {
    exportDate: new Date().toISOString(),
    totalTables: tables.length,
    tablesExported: Object.keys(allData).length,
    recordCounts: Object.fromEntries(
      Object.entries(allData).map(([table, data]) => [table, Array.isArray(data) ? data.length : 0])
    ),
    totalRecords: Object.values(allData).reduce((sum, data) => 
      sum + (Array.isArray(data) ? data.length : 0), 0
    )
  };
  
  const reportPath = path.join(backupDir, 'migration-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  
  console.log('📊 Migration Report:');
  console.log(`   Total Tables: ${report.totalTables}`);
  console.log(`   Tables Exported: ${report.tablesExported}`);
  console.log(`   Total Records: ${report.totalRecords}`);
  console.log(`📁 Data saved to: ${backupDir}`);
  
  return report;
}

// Run the export
exportSupabaseData()
  .then(report => {
    console.log('✅ Data extraction completed successfully!');
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ Data extraction failed:', error);
    process.exit(1);
  });
