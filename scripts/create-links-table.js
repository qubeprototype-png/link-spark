#!/usr/bin/env node
/**
 * Script to create the links table in Supabase
 * 
 * This script uses the Supabase Management API or direct SQL execution.
 * 
 * IMPORTANT: This requires the SUPABASE_SERVICE_ROLE_KEY (not anon key)
 * 
 * Usage:
 * 1. Set SUPABASE_SERVICE_ROLE_KEY in your environment
 * 2. Run: node scripts/create-links-table.js
 * 
 * OR use the Supabase Dashboard SQL Editor (recommended):
 * 1. Go to https://supabase.com/dashboard/project/bfloybonqrnvxtoytqny/sql
 * 2. Copy and paste the SQL from supabase/migrations/001_create_links_table.sql
 * 3. Click "Run"
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the migration file
const migrationPath = path.join(__dirname, '../supabase/migrations/001_create_links_table.sql');
const sql = fs.readFileSync(migrationPath, 'utf8');

console.log('='.repeat(60));
console.log('Supabase Links Table Creation Script');
console.log('='.repeat(60));
console.log('\nSQL Migration File:');
console.log('-'.repeat(60));
console.log(sql);
console.log('-'.repeat(60));

console.log('\n📋 Instructions:');
console.log('\nOption 1: Supabase Dashboard (Recommended)');
console.log('1. Go to: https://supabase.com/dashboard/project/bfloybonqrnvxtoytqny/sql/new');
console.log('2. Copy the SQL above');
console.log('3. Paste into the SQL Editor');
console.log('4. Click "Run" button');
console.log('5. Verify table exists in Table Editor');

console.log('\nOption 2: Supabase CLI');
console.log('1. Install: npm install -g supabase');
console.log('2. Login: supabase login');
console.log('3. Link: supabase link --project-ref bfloybonqrnvxtoytqny');
console.log('4. Run: supabase db push');

console.log('\nOption 3: Using this script with Service Role Key');
console.log('1. Set SUPABASE_SERVICE_ROLE_KEY environment variable');
console.log('2. Set SUPABASE_URL environment variable');
console.log('3. Run: node scripts/create-links-table.js --execute');

// If --execute flag is provided, try to execute
if (process.argv.includes('--execute')) {
  const { createClient } = await import('@supabase/supabase-js');
  
  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !serviceRoleKey) {
    console.error('\n❌ Error: Missing environment variables');
    console.error('Required: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
  }
  
  console.log('\n⚠️  Attempting to execute SQL...');
  console.log('Note: Supabase JS client cannot execute DDL statements directly.');
  console.log('Please use Supabase Dashboard SQL Editor instead.');
  console.log('\nSQL to execute:');
  console.log(sql);
}

console.log('\n✅ Next Steps:');
console.log('After creating the table, also run:');
console.log('  supabase/migrations/002_create_increment_function.sql');
console.log('='.repeat(60));

