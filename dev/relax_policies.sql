-- DEV: Relax row-level security (RLS) for development/testing only
-- WARNING: This file grants broad access to sensitive tables. Do NOT run in production.
-- Recommended usage: copy-paste and run in Supabase Console -> SQL Editor for your project.

-- Tables to relax
DO $$
BEGIN
  -- For each table, enable RLS (if not enabled) and create a permissive policy
  PERFORM 1;
END
$$;

-- Replace or extend the list below with your project's actual table names if different.
-- This creates a policy that allows all operations for all roles (dev only).

-- profiles
ALTER TABLE IF EXISTS public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "dev_full_access_profiles" ON public.profiles FOR ALL USING (true) WITH CHECK (true);

-- accounts
ALTER TABLE IF EXISTS public.accounts ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "dev_full_access_accounts" ON public.accounts FOR ALL USING (true) WITH CHECK (true);

-- categories
ALTER TABLE IF EXISTS public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "dev_full_access_categories" ON public.categories FOR ALL USING (true) WITH CHECK (true);

-- transactions
ALTER TABLE IF EXISTS public.transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "dev_full_access_transactions" ON public.transactions FOR ALL USING (true) WITH CHECK (true);

-- budgets
ALTER TABLE IF EXISTS public.budgets ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "dev_full_access_budgets" ON public.budgets FOR ALL USING (true) WITH CHECK (true);

-- assets
ALTER TABLE IF EXISTS public.assets ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "dev_full_access_assets" ON public.assets FOR ALL USING (true) WITH CHECK (true);

-- investments
ALTER TABLE IF EXISTS public.investments ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "dev_full_access_investments" ON public.investments FOR ALL USING (true) WITH CHECK (true);

-- goals
ALTER TABLE IF EXISTS public.goals ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "dev_full_access_goals" ON public.goals FOR ALL USING (true) WITH CHECK (true);

-- Optional: to fully disable RLS instead (less flexible), uncomment the lines below and run instead
-- ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.accounts DISABLE ROW LEVEL SECURITY;

-- How to revert: remove the policies and (optionally) disable RLS
-- DROP POLICY IF EXISTS "dev_full_access_profiles" ON public.profiles;
-- ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
