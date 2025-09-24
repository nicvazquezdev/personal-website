import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const isDevelopment = process.env.NODE_ENV === "development";

export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

// Export development mode flag
export const isDevelopmentMode = isDevelopment;

export interface GuestbookEntry {
  id: string;
  name: string;
  message: string;
  created_at: string;
  session_id: string;
}
