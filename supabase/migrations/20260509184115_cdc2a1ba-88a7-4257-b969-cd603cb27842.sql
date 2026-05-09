
-- Drop overly permissive policies
DROP POLICY IF EXISTS "auth insert legislative_alerts" ON public.legislative_alerts;
DROP POLICY IF EXISTS "auth update legislative_alerts" ON public.legislative_alerts;
DROP POLICY IF EXISTS "auth delete legislative_alerts" ON public.legislative_alerts;

-- Lock down SECURITY DEFINER helper function
REVOKE EXECUTE ON FUNCTION public.user_owns_entity(uuid) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.user_owns_entity(uuid) FROM anon;
GRANT EXECUTE ON FUNCTION public.user_owns_entity(uuid) TO authenticated;
