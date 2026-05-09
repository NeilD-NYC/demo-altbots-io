
-- Make user_id nullable to allow demo data without an auth user
ALTER TABLE public.tax_entities ALTER COLUMN user_id DROP NOT NULL;

-- Helper: list of tables scoped by entity_id directly
DO $$
DECLARE
  t text;
  entity_tables text[] := ARRAY[
    'tax_kpis','ppli_policies','residency_kpis','k1_tracking','carry_holdings',
    'structural_flags','service_providers','tax_calendar','agent_activity_log',
    'residency_days'
  ];
BEGIN
  FOREACH t IN ARRAY entity_tables LOOP
    EXECUTE format('DROP POLICY IF EXISTS "owners select %1$s" ON public.%1$s;', t);
    EXECUTE format('DROP POLICY IF EXISTS "owners insert %1$s" ON public.%1$s;', t);
    EXECUTE format('DROP POLICY IF EXISTS "owners update %1$s" ON public.%1$s;', t);
    EXECUTE format('DROP POLICY IF EXISTS "owners delete %1$s" ON public.%1$s;', t);
    EXECUTE format('CREATE POLICY "public read %1$s" ON public.%1$s FOR SELECT USING (true);', t);
    EXECUTE format('CREATE POLICY "auth insert %1$s" ON public.%1$s FOR INSERT TO authenticated WITH CHECK (user_owns_entity(entity_id));', t);
    EXECUTE format('CREATE POLICY "auth update %1$s" ON public.%1$s FOR UPDATE TO authenticated USING (user_owns_entity(entity_id));', t);
    EXECUTE format('CREATE POLICY "auth delete %1$s" ON public.%1$s FOR DELETE TO authenticated USING (user_owns_entity(entity_id));', t);
  END LOOP;
END $$;

-- tax_entities (uses user_id directly)
DROP POLICY IF EXISTS "owners select tax_entities" ON public.tax_entities;
DROP POLICY IF EXISTS "owners insert tax_entities" ON public.tax_entities;
DROP POLICY IF EXISTS "owners update tax_entities" ON public.tax_entities;
DROP POLICY IF EXISTS "owners delete tax_entities" ON public.tax_entities;
CREATE POLICY "public read tax_entities" ON public.tax_entities FOR SELECT USING (true);
CREATE POLICY "auth insert tax_entities" ON public.tax_entities FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "auth update tax_entities" ON public.tax_entities FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "auth delete tax_entities" ON public.tax_entities FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- ppli_compliance_checks (scoped via ppli_policies)
DROP POLICY IF EXISTS "owners select ppli_compliance_checks" ON public.ppli_compliance_checks;
DROP POLICY IF EXISTS "owners insert ppli_compliance_checks" ON public.ppli_compliance_checks;
DROP POLICY IF EXISTS "owners update ppli_compliance_checks" ON public.ppli_compliance_checks;
DROP POLICY IF EXISTS "owners delete ppli_compliance_checks" ON public.ppli_compliance_checks;
CREATE POLICY "public read ppli_compliance_checks" ON public.ppli_compliance_checks FOR SELECT USING (true);
CREATE POLICY "auth insert ppli_compliance_checks" ON public.ppli_compliance_checks FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM ppli_policies p WHERE p.id = policy_id AND user_owns_entity(p.entity_id)));
CREATE POLICY "auth update ppli_compliance_checks" ON public.ppli_compliance_checks FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM ppli_policies p WHERE p.id = policy_id AND user_owns_entity(p.entity_id)));
CREATE POLICY "auth delete ppli_compliance_checks" ON public.ppli_compliance_checks FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM ppli_policies p WHERE p.id = policy_id AND user_owns_entity(p.entity_id)));

-- chase_emails (scoped via k1_tracking)
DROP POLICY IF EXISTS "owners select chase_emails" ON public.chase_emails;
DROP POLICY IF EXISTS "owners insert chase_emails" ON public.chase_emails;
DROP POLICY IF EXISTS "owners update chase_emails" ON public.chase_emails;
DROP POLICY IF EXISTS "owners delete chase_emails" ON public.chase_emails;
CREATE POLICY "public read chase_emails" ON public.chase_emails FOR SELECT USING (true);
CREATE POLICY "auth insert chase_emails" ON public.chase_emails FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM k1_tracking k WHERE k.id = k1_tracking_id AND user_owns_entity(k.entity_id)));
CREATE POLICY "auth update chase_emails" ON public.chase_emails FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM k1_tracking k WHERE k.id = k1_tracking_id AND user_owns_entity(k.entity_id)));
CREATE POLICY "auth delete chase_emails" ON public.chase_emails FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM k1_tracking k WHERE k.id = k1_tracking_id AND user_owns_entity(k.entity_id)));

-- legislative_alerts: open SELECT to public (was authenticated only)
DROP POLICY IF EXISTS "auth read legislative_alerts" ON public.legislative_alerts;
CREATE POLICY "public read legislative_alerts" ON public.legislative_alerts FOR SELECT USING (true);

-- Seed three Wynfield demo entities with fixed UUIDs
INSERT INTO public.tax_entities (id, user_id, entity_name, entity_type, aum, tax_year, primary_residency_state, secondary_residency_state)
VALUES
  ('11111111-1111-1111-1111-111111111111', NULL, 'Wynfield Trust LP', 'family_office', 718000000, 2026, 'NY', 'FL'),
  ('22222222-2222-2222-2222-222222222222', NULL, 'Wynfield Charitable Foundation', 'foundation', 142000000, 2026, 'NY', NULL),
  ('33333333-3333-3333-3333-333333333333', NULL, 'Wynfield Family Endowment', 'endowment', 89000000, 2026, 'NY', NULL)
ON CONFLICT (id) DO NOTHING;
