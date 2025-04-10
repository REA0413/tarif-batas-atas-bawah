import { supabase } from './supabase';

export async function setupDatabase() {
  // Check if tables exist first
  const { data: existingTables } = await supabase
    .from('information_schema.tables')
    .select('table_name')
    .eq('table_schema', 'public');
  
  const tableNames = existingTables?.map(t => t.table_name) || [];
  
  // Create tables if they don't exist
  const queries = [
    `CREATE TABLE IF NOT EXISTS "SERVICE CATEGORY" (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      number INTEGER,
      airlines VARCHAR NOT NULL,
      category VARCHAR NOT NULL
    );`,
    // ... add other tables here
  ];
  
  for (const query of queries) {
    const { error } = await supabase.rpc('pgSQL', { query });
    if (error) console.error('Error creating table:', error);
  }
} 