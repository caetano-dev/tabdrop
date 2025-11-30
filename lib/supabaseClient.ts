import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUB_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Delete all collections older than the specified number of months
 * @param months - Number of months (e.g., 2 for 2 months)
 * @returns The number of deleted records
 */
export async function deleteOldCollections(months: number = 12) {
  const cutoffDate = new Date();
  cutoffDate.setMonth(cutoffDate.getMonth() - months);
  
  const { data, error } = await supabase
    .from('collections')
    .delete()
    .lt('created_at', cutoffDate.toISOString())
    .select();
  
  if (error) {
    console.error('Error deleting old collections:', error);
    throw error;
  }
  
  return data?.length || 0;
}