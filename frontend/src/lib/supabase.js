import { createClient } from '@supabase/supabase-js'

// The frontend talks to FastAPI, which in turn talks to Supabase (Postgres).
// This client is only used for optional direct-to-Supabase features
// (e.g. file storage for the Documents vault, or realtime subscriptions).
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null
