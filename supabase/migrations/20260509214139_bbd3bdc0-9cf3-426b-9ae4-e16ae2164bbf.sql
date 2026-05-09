INSERT INTO public.legislative_alerts (
  bill_number, bill_name, status, severity, exposure_amount,
  applicable_entities, markup_result, floor_vote_estimate, summary,
  mitigation_options, last_updated
)
SELECT
  'S.4421',
  'Protecting Proper Life Insurance from Abuse Act',
  'advanced_committee',
  'red',
  42000000,
  ARRAY(SELECT id FROM public.tax_entities LIMIT 5),
  'PASSED 14-13',
  'Floor vote estimated Q3 2026',
  'Senate Finance Committee advanced S.4421 with <span class="leg-amber">retroactive provisions</span> reaching back to policies issued after Jan 1, 2020. For Wynfield, this implicates <span class="leg-red">2 PPLI policies ($42M cash value)</span> held through <span class="leg-red">Bermuda-domiciled IDFs</span>, with modeled clawback exposure of <span class="leg-red-bold">$8.4M-$11.2M</span>. Senate Finance markup completed; floor consideration window opens <span class="leg-amber">June 18, 2026</span>.',
  '[
    {"label":"Accelerate Policy B premium tranche before Q3","impact":"Locks §7702 status pre-enactment"},
    {"label":"Restructure IDF allocations away from concentrated growth","impact":"Reduces §817(h) diversification risk"},
    {"label":"Re-paper investor-control flags ahead of markup","impact":"Mitigates Treas. Reg. §1.817-5 exposure"}
  ]'::jsonb,
  CURRENT_DATE;