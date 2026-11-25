# Supabase integration

The browser client is initialized in `client.ts`. It reads `VITE_SUPABASE_URL` and either `VITE_SUPABASE_PUBLISHABLE_KEY` or `VITE_SUPABASE_ANON_KEY` from the Vite environment. The publishable key takes precedence when both are present.

No Supabase CLI project configuration, migrations, or Edge Functions were present when this repository was organized. Add those here when they are introduced, and keep schema changes versioned as migrations.
