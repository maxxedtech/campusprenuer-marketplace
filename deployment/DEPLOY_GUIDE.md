# Deployment guide

## Vercel

1. Keep the Vercel project root set to the repository root.
2. Install with `npm ci` and build with `npm run build`.
3. Keep `vercel.json` at the repository root; its rewrite sends client-side routes to `index.html`.
4. Add the environment variables from `.env.example` in the Vercel project settings for each environment.
5. Deploy a preview and verify the landing page, sign-in, marketplace, a `/store/:slug` storefront, and dashboard routes before promoting production.

## Supabase

1. Configure the production Supabase URL and publishable/anon key as Vercel environment variables.
2. Apply reviewed SQL changes from `backend/sql/` to the intended Supabase project.
3. Verify Row Level Security and storage policies using customer, seller, and admin accounts.
4. Confirm the browser network panel shows no failed data requests, and never expose a service-role key to the frontend.

See `backend/docs/DATABASE_AND_RLS.md` for database ownership guidance.
