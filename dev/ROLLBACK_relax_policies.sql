-- ROLLBACK: Remove permissive dev policies created by `relax_policies.sql`
-- WARNING: Execute in Supabase Console -> SQL Editor only for development/testing.
-- This will DROP the permissive policies. If you want to fully disable RLS, uncomment the ALTER TABLE DISABLE lines below.

-- profiles
DROP POLICY IF EXISTS "dev_full_access_profiles" ON public.profiles;
-- ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;

-- accounts
DROP POLICY IF EXISTS "dev_full_access_accounts" ON public.accounts;
-- ALTER TABLE public.accounts DISABLE ROW LEVEL SECURITY;

-- categories
DROP POLICY IF EXISTS "dev_full_access_categories" ON public.categories;
-- ALTER TABLE public.categories DISABLE ROW LEVEL SECURITY;

-- transactions
DROP POLICY IF EXISTS "dev_full_access_transactions" ON public.transactions;
-- ALTER TABLE public.transactions DISABLE ROW LEVEL SECURITY;

-- budgets
DROP POLICY IF EXISTS "dev_full_access_budgets" ON public.budgets;
-- ALTER TABLE public.budgets DISABLE ROW LEVEL SECURITY;

-- assets
DROP POLICY IF EXISTS "dev_full_access_assets" ON public.assets;
-- ALTER TABLE public.assets DISABLE ROW LEVEL SECURITY;

-- investments
DROP POLICY IF EXISTS "dev_full_access_investments" ON public.investments;
-- ALTER TABLE public.investments DISABLE ROW LEVEL SECURITY;

-- goals
DROP POLICY IF EXISTS "dev_full_access_goals" ON public.goals;
-- ALTER TABLE public.goals DISABLE ROW LEVEL SECURITY;

-- Optional: confirm policies removed
-- SELECT policyname, table_schema, table_name FROM pg_policies WHERE policyname LIKE 'dev_full_access_%';
