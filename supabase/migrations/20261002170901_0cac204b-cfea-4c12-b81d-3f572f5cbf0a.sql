DROP POLICY IF EXISTS "Leads are readable" ON public.leads;
REVOKE ALL PRIVILEGES ON TABLE public.leads FROM anon;
REVOKE ALL PRIVILEGES ON TABLE public.leads FROM authenticated;