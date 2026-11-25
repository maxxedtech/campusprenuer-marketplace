# Database and Row Level Security

The application accesses Supabase through the browser client in `backend/supabase/client.ts` and data services in `backend/services/`. This repository currently contains no schema migrations or canonical database type snapshot, so the live Supabase project remains the source of truth for table columns and policies.

Before changing a query, verify its table columns and relationships in the Supabase project or add a migration under `backend/sql/`. Keep Row Level Security enabled for user data. Policies should scope profile reads/updates to the authenticated user, seller product/order access to the owning vendor, and customer order access to the buyer. Never put a service-role key in a `VITE_` variable or browser code.
