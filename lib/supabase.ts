import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export function hasSupabaseConfig() {
  return Boolean(supabaseUrl && supabaseAnonKey);
}

export function createBrowserSupabase() {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase public env belum dikonfigurasi.");
  }

  return createClient(supabaseUrl, supabaseAnonKey);
}

export function createServiceSupabase() {
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error("Supabase service role env belum dikonfigurasi.");
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}
