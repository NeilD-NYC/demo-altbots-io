
-- Enums
CREATE TYPE public.tax_entity_type AS ENUM ('family_office','foundation','endowment','pension');
CREATE TYPE public.ppli_mec_status AS ENUM ('safe','watch','mec');
CREATE TYPE public.ppli_wyden_risk AS ENUM ('low','medium','high');
CREATE TYPE public.residency_source AS ENUM ('google_calendar','icloud','netjets','amex_geo','manual');
CREATE TYPE public.k1_status AS ENUM ('received','pending','overdue','amended');
CREATE TYPE public.sec_1061_status AS ENUM ('pass','watch','fail');
CREATE TYPE public.flag_type AS ENUM ('pfic','qsbs','ubti','niit','ftc','wash_sale','salt_ptet','daf_crt','trust_situs','gst','sec_754');
CREATE TYPE public.flag_severity AS ENUM ('red','amber','green','info');
CREATE TYPE public.agent_status AS ENUM ('ok','warn','info','alert');
CREATE TYPE public.compliance_result AS ENUM ('pass','fail','flag');

-- tax_entities (root ownership)
CREATE TABLE public.tax_entities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  entity_name text NOT NULL,
  entity_type public.tax_entity_type NOT NULL,
  aum numeric,
  tax_year int,
  primary_residency_state text,
  secondary_residency_state text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_tax_entities_user_id ON public.tax_entities(user_id);

-- Security definer helper: check current user owns the entity
CREATE OR REPLACE FUNCTION public.user_owns_entity(_entity_id uuid)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.tax_entities
    WHERE id = _entity_id AND user_id = auth.uid()
  )
$$;

-- tax_kpis
CREATE TABLE public.tax_kpis (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_id uuid NOT NULL REFERENCES public.tax_entities(id) ON DELETE CASCADE,
  snapshot_date date NOT NULL,
  tax_alpha_ytd numeric,
  fed_tax_ytd numeric,
  ppli_cash_value numeric,
  exemption_used numeric,
  exemption_remaining numeric,
  ny_days_ytd int,
  ny_days_limit int DEFAULT 183,
  harvest_available numeric,
  harvest_tax_savings numeric,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_tax_kpis_entity_id ON public.tax_kpis(entity_id);

-- ppli_policies
CREATE TABLE public.ppli_policies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_id uuid NOT NULL REFERENCES public.tax_entities(id) ON DELETE CASCADE,
  carrier_name text,
  policy_letter text,
  issue_date date,
  cash_value numeric,
  death_benefit numeric,
  premium_year_current int,
  premium_years_total int,
  idf_domicile text,
  idf_holdings_count int,
  max_position_pct numeric,
  mec_status public.ppli_mec_status,
  diversification_817h_pass boolean,
  investor_control_flags int,
  dac_tax_paid numeric,
  state_premium_tax numeric,
  me_charges_bps numeric,
  broker_name text,
  broker_contact text,
  wyden_risk_level public.ppli_wyden_risk,
  wyden_clawback_low numeric,
  wyden_clawback_high numeric,
  lifetime_pv_shield numeric,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_ppli_policies_entity_id ON public.ppli_policies(entity_id);

-- residency_days
CREATE TABLE public.residency_days (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_id uuid NOT NULL REFERENCES public.tax_entities(id) ON DELETE CASCADE,
  date date NOT NULL,
  location_state text,
  location_city text,
  source public.residency_source,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_residency_days_entity_id ON public.residency_days(entity_id);

-- residency_kpis
CREATE TABLE public.residency_kpis (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_id uuid NOT NULL REFERENCES public.tax_entities(id) ON DELETE CASCADE,
  year int NOT NULL,
  ny_days int,
  fl_days int,
  ca_days int,
  international_days int,
  nyc_days int,
  audit_win_probability numeric,
  domicile_factors_weak jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_residency_kpis_entity_id ON public.residency_kpis(entity_id);

-- k1_tracking
CREATE TABLE public.k1_tracking (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_id uuid NOT NULL REFERENCES public.tax_entities(id) ON DELETE CASCADE,
  manager_name text,
  fund_entity_type text,
  expected_date date,
  received_date date,
  status public.k1_status,
  chase_count int DEFAULT 0,
  last_chase_date date,
  lpa_section_reference text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_k1_tracking_entity_id ON public.k1_tracking(entity_id);

-- carry_holdings
CREATE TABLE public.carry_holdings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_id uuid NOT NULL REFERENCES public.tax_entities(id) ON DELETE CASCADE,
  fund_name text,
  position_id text,
  hold_period_years numeric,
  sec_1061_status public.sec_1061_status,
  recharacterization_amount numeric,
  tax_delta numeric,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_carry_holdings_entity_id ON public.carry_holdings(entity_id);

-- legislative_alerts (global, no entity ownership; readable to all authenticated)
CREATE TABLE public.legislative_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bill_number text,
  bill_name text,
  status text,
  last_updated date,
  severity text,
  exposure_amount numeric,
  applicable_entities uuid[],
  markup_result text,
  floor_vote_estimate text,
  summary text,
  mitigation_options jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- structural_flags
CREATE TABLE public.structural_flags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_id uuid NOT NULL REFERENCES public.tax_entities(id) ON DELETE CASCADE,
  flag_type public.flag_type,
  severity public.flag_severity,
  title text,
  description text,
  due_date date,
  amount numeric,
  irc_citation text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_structural_flags_entity_id ON public.structural_flags(entity_id);

-- service_providers
CREATE TABLE public.service_providers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_id uuid NOT NULL REFERENCES public.tax_entities(id) ON DELETE CASCADE,
  firm_name text,
  contact_name text,
  role text,
  status text,
  last_contact_date date,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_service_providers_entity_id ON public.service_providers(entity_id);

-- tax_calendar
CREATE TABLE public.tax_calendar (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_id uuid NOT NULL REFERENCES public.tax_entities(id) ON DELETE CASCADE,
  event_date date,
  title text,
  description text,
  severity text,
  amount numeric,
  category text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_tax_calendar_entity_id ON public.tax_calendar(entity_id);

-- agent_activity_log
CREATE TABLE public.agent_activity_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_id uuid NOT NULL REFERENCES public.tax_entities(id) ON DELETE CASCADE,
  agent_key text,
  status public.agent_status,
  message text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_agent_activity_log_entity_id ON public.agent_activity_log(entity_id);

-- ppli_compliance_checks (linked via policy -> entity)
CREATE TABLE public.ppli_compliance_checks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  policy_id uuid NOT NULL REFERENCES public.ppli_policies(id) ON DELETE CASCADE,
  irc_section text,
  check_type text,
  result public.compliance_result,
  detail text,
  last_run timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_ppli_compliance_checks_policy_id ON public.ppli_compliance_checks(policy_id);

-- chase_emails (linked via k1_tracking -> entity)
CREATE TABLE public.chase_emails (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  k1_tracking_id uuid NOT NULL REFERENCES public.k1_tracking(id) ON DELETE CASCADE,
  from_addr text,
  to_addr text,
  cc_addr text,
  subject text,
  body text,
  sent_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_chase_emails_k1_tracking_id ON public.chase_emails(k1_tracking_id);

-- Enable RLS on all tables
ALTER TABLE public.tax_entities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tax_kpis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ppli_policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.residency_days ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.residency_kpis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.k1_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.carry_holdings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.legislative_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.structural_flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tax_calendar ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ppli_compliance_checks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chase_emails ENABLE ROW LEVEL SECURITY;

-- RLS: tax_entities (owner is user_id)
CREATE POLICY "owners select tax_entities" ON public.tax_entities FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "owners insert tax_entities" ON public.tax_entities FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "owners update tax_entities" ON public.tax_entities FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "owners delete tax_entities" ON public.tax_entities FOR DELETE USING (auth.uid() = user_id);

-- Helper macro pattern via repeated policies for each entity-scoped table
-- tax_kpis
CREATE POLICY "owners select tax_kpis" ON public.tax_kpis FOR SELECT USING (public.user_owns_entity(entity_id));
CREATE POLICY "owners insert tax_kpis" ON public.tax_kpis FOR INSERT WITH CHECK (public.user_owns_entity(entity_id));
CREATE POLICY "owners update tax_kpis" ON public.tax_kpis FOR UPDATE USING (public.user_owns_entity(entity_id));
CREATE POLICY "owners delete tax_kpis" ON public.tax_kpis FOR DELETE USING (public.user_owns_entity(entity_id));

-- ppli_policies
CREATE POLICY "owners select ppli_policies" ON public.ppli_policies FOR SELECT USING (public.user_owns_entity(entity_id));
CREATE POLICY "owners insert ppli_policies" ON public.ppli_policies FOR INSERT WITH CHECK (public.user_owns_entity(entity_id));
CREATE POLICY "owners update ppli_policies" ON public.ppli_policies FOR UPDATE USING (public.user_owns_entity(entity_id));
CREATE POLICY "owners delete ppli_policies" ON public.ppli_policies FOR DELETE USING (public.user_owns_entity(entity_id));

-- residency_days
CREATE POLICY "owners select residency_days" ON public.residency_days FOR SELECT USING (public.user_owns_entity(entity_id));
CREATE POLICY "owners insert residency_days" ON public.residency_days FOR INSERT WITH CHECK (public.user_owns_entity(entity_id));
CREATE POLICY "owners update residency_days" ON public.residency_days FOR UPDATE USING (public.user_owns_entity(entity_id));
CREATE POLICY "owners delete residency_days" ON public.residency_days FOR DELETE USING (public.user_owns_entity(entity_id));

-- residency_kpis
CREATE POLICY "owners select residency_kpis" ON public.residency_kpis FOR SELECT USING (public.user_owns_entity(entity_id));
CREATE POLICY "owners insert residency_kpis" ON public.residency_kpis FOR INSERT WITH CHECK (public.user_owns_entity(entity_id));
CREATE POLICY "owners update residency_kpis" ON public.residency_kpis FOR UPDATE USING (public.user_owns_entity(entity_id));
CREATE POLICY "owners delete residency_kpis" ON public.residency_kpis FOR DELETE USING (public.user_owns_entity(entity_id));

-- k1_tracking
CREATE POLICY "owners select k1_tracking" ON public.k1_tracking FOR SELECT USING (public.user_owns_entity(entity_id));
CREATE POLICY "owners insert k1_tracking" ON public.k1_tracking FOR INSERT WITH CHECK (public.user_owns_entity(entity_id));
CREATE POLICY "owners update k1_tracking" ON public.k1_tracking FOR UPDATE USING (public.user_owns_entity(entity_id));
CREATE POLICY "owners delete k1_tracking" ON public.k1_tracking FOR DELETE USING (public.user_owns_entity(entity_id));

-- carry_holdings
CREATE POLICY "owners select carry_holdings" ON public.carry_holdings FOR SELECT USING (public.user_owns_entity(entity_id));
CREATE POLICY "owners insert carry_holdings" ON public.carry_holdings FOR INSERT WITH CHECK (public.user_owns_entity(entity_id));
CREATE POLICY "owners update carry_holdings" ON public.carry_holdings FOR UPDATE USING (public.user_owns_entity(entity_id));
CREATE POLICY "owners delete carry_holdings" ON public.carry_holdings FOR DELETE USING (public.user_owns_entity(entity_id));

-- structural_flags
CREATE POLICY "owners select structural_flags" ON public.structural_flags FOR SELECT USING (public.user_owns_entity(entity_id));
CREATE POLICY "owners insert structural_flags" ON public.structural_flags FOR INSERT WITH CHECK (public.user_owns_entity(entity_id));
CREATE POLICY "owners update structural_flags" ON public.structural_flags FOR UPDATE USING (public.user_owns_entity(entity_id));
CREATE POLICY "owners delete structural_flags" ON public.structural_flags FOR DELETE USING (public.user_owns_entity(entity_id));

-- service_providers
CREATE POLICY "owners select service_providers" ON public.service_providers FOR SELECT USING (public.user_owns_entity(entity_id));
CREATE POLICY "owners insert service_providers" ON public.service_providers FOR INSERT WITH CHECK (public.user_owns_entity(entity_id));
CREATE POLICY "owners update service_providers" ON public.service_providers FOR UPDATE USING (public.user_owns_entity(entity_id));
CREATE POLICY "owners delete service_providers" ON public.service_providers FOR DELETE USING (public.user_owns_entity(entity_id));

-- tax_calendar
CREATE POLICY "owners select tax_calendar" ON public.tax_calendar FOR SELECT USING (public.user_owns_entity(entity_id));
CREATE POLICY "owners insert tax_calendar" ON public.tax_calendar FOR INSERT WITH CHECK (public.user_owns_entity(entity_id));
CREATE POLICY "owners update tax_calendar" ON public.tax_calendar FOR UPDATE USING (public.user_owns_entity(entity_id));
CREATE POLICY "owners delete tax_calendar" ON public.tax_calendar FOR DELETE USING (public.user_owns_entity(entity_id));

-- agent_activity_log
CREATE POLICY "owners select agent_activity_log" ON public.agent_activity_log FOR SELECT USING (public.user_owns_entity(entity_id));
CREATE POLICY "owners insert agent_activity_log" ON public.agent_activity_log FOR INSERT WITH CHECK (public.user_owns_entity(entity_id));
CREATE POLICY "owners update agent_activity_log" ON public.agent_activity_log FOR UPDATE USING (public.user_owns_entity(entity_id));
CREATE POLICY "owners delete agent_activity_log" ON public.agent_activity_log FOR DELETE USING (public.user_owns_entity(entity_id));

-- ppli_compliance_checks (via policy -> entity)
CREATE POLICY "owners select ppli_compliance_checks" ON public.ppli_compliance_checks FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.ppli_policies p WHERE p.id = policy_id AND public.user_owns_entity(p.entity_id)));
CREATE POLICY "owners insert ppli_compliance_checks" ON public.ppli_compliance_checks FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.ppli_policies p WHERE p.id = policy_id AND public.user_owns_entity(p.entity_id)));
CREATE POLICY "owners update ppli_compliance_checks" ON public.ppli_compliance_checks FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.ppli_policies p WHERE p.id = policy_id AND public.user_owns_entity(p.entity_id)));
CREATE POLICY "owners delete ppli_compliance_checks" ON public.ppli_compliance_checks FOR DELETE
  USING (EXISTS (SELECT 1 FROM public.ppli_policies p WHERE p.id = policy_id AND public.user_owns_entity(p.entity_id)));

-- chase_emails (via k1 -> entity)
CREATE POLICY "owners select chase_emails" ON public.chase_emails FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.k1_tracking k WHERE k.id = k1_tracking_id AND public.user_owns_entity(k.entity_id)));
CREATE POLICY "owners insert chase_emails" ON public.chase_emails FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.k1_tracking k WHERE k.id = k1_tracking_id AND public.user_owns_entity(k.entity_id)));
CREATE POLICY "owners update chase_emails" ON public.chase_emails FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.k1_tracking k WHERE k.id = k1_tracking_id AND public.user_owns_entity(k.entity_id)));
CREATE POLICY "owners delete chase_emails" ON public.chase_emails FOR DELETE
  USING (EXISTS (SELECT 1 FROM public.k1_tracking k WHERE k.id = k1_tracking_id AND public.user_owns_entity(k.entity_id)));

-- legislative_alerts: readable to any authenticated user; only authenticated can insert/modify
CREATE POLICY "auth read legislative_alerts" ON public.legislative_alerts FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth insert legislative_alerts" ON public.legislative_alerts FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "auth update legislative_alerts" ON public.legislative_alerts FOR UPDATE TO authenticated USING (true);
CREATE POLICY "auth delete legislative_alerts" ON public.legislative_alerts FOR DELETE TO authenticated USING (true);
