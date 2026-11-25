import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabasePublishableKey);

const clientUrl = supabaseUrl || "https://missing-supabase-config.supabase.co";
const clientKey = supabasePublishableKey || "missing-supabase-publishable-key";

export const supabase = createClient(clientUrl, clientKey);
