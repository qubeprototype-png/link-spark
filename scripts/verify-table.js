#!/usr/bin/env node
/**
 * Script to verify if the links table exists in Supabase
 * 
 * Usage:
 *   node scripts/verify-table.js
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Try to load .env file manually
try {
  const envFile = readFileSync(join(__dirname, '../.env'), 'utf8');
  envFile.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match && !process.env[match[1]]) {
      process.env[match[1]] = match[2].trim();
    }
  });
} catch (err) {
  // .env file not found or can't be read, use existing env vars
}

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Error: Missing Supabase environment variables');
  console.error('Required: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
  console.error('\nMake sure your .env file contains these variables.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

console.log('🔍 Checking if links table exists...\n');

async function verifyTable() {
  try {
    // Try to query the table (this will fail if table doesn't exist)
    const { data, error, count } = await supabase
      .from('links')
      .select('*', { count: 'exact', head: true });

    if (error) {
      if (error.code === 'PGRST116' || error.message.includes('schema cache')) {
        console.log('❌ Table does NOT exist');
        console.log('\n📋 To create the table:');
        console.log('1. Go to: https://supabase.com/dashboard/project/bfloybonqrnvxtoytqny/sql/new');
        console.log('2. Copy SQL from: supabase/migrations/001_create_links_table.sql');
        console.log('3. Paste and run in SQL Editor');
        console.log('\nOr run: node scripts/create-links-table.js');
        return false;
      } else {
        console.error('❌ Error checking table:', error.message);
        return false;
      }
    }

    console.log('✅ Table EXISTS!');
    console.log(`   Current row count: ${count || 0}`);
    console.log('\n✅ Table is ready to use!');
    
    // Check if increment function exists
    console.log('\n🔍 Checking increment function...');
    try {
      // Try to call the function (will fail if it doesn't exist, but that's ok)
      const { error: funcError } = await supabase.rpc('increment_click_count', { code: 'test' });
      
      if (funcError && funcError.message.includes('function') && funcError.message.includes('does not exist')) {
        console.log('⚠️  Increment function does NOT exist');
        console.log('\n📋 To create the function:');
        console.log('1. Go to: https://supabase.com/dashboard/project/bfloybonqrnvxtoytqny/sql/new');
        console.log('2. Copy SQL from: supabase/migrations/002_create_increment_function.sql');
        console.log('3. Paste and run in SQL Editor');
      } else {
        console.log('✅ Increment function exists (or test failed, which is expected)');
      }
    } catch (err) {
      console.log('⚠️  Could not verify increment function (this is ok)');
    }
    
    return true;
  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
    return false;
  }
}

verifyTable().then((exists) => {
  if (exists) {
    console.log('\n🎉 Database is ready!');
  } else {
    console.log('\n⚠️  Please create the table first.');
  }
  process.exit(exists ? 0 : 1);
});

