import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "cmheobhagkyrcuqjcjle"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNtaGVvYmhhZ2t5cmN1cWpjamxlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU4MTE1MjcsImV4cCI6MjA5MTM4NzUyN30.S2w_rjOwsWBL_zyA_lS6O3M78KLeis87gwJWOu9dfbI"

export const supabase = createClient(supabaseUrl, supabaseKey)
