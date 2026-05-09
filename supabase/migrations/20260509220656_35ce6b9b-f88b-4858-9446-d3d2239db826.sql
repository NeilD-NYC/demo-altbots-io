
INSERT INTO public.ppli_policies (
  entity_id, carrier_name, policy_letter, issue_date, cash_value, death_benefit,
  premium_year_current, premium_years_total, idf_domicile, idf_holdings_count,
  max_position_pct, mec_status, diversification_817h_pass, investor_control_flags,
  dac_tax_paid, state_premium_tax, me_charges_bps, broker_name, broker_contact,
  wyden_risk_level, wyden_clawback_low, wyden_clawback_high, lifetime_pv_shield
) VALUES
('11111111-1111-1111-1111-111111111111','Lombard International','A','2022-03-14',
 28400000,57700000,3,7,'Bermuda',5,28,'safe',true,3,184000,24000,87,
 'Northern Trust Insurance Services','Marcus Whitfield · mwhitfield@ntis.com',
 'high',5800000,7400000,42000000),
('11111111-1111-1111-1111-111111111111','Zurich International','B','2021-09-08',
 13800000,28000000,5,5,'Bermuda',7,22,'safe',true,1,92000,18000,82,
 'Northern Trust Insurance Services','Marcus Whitfield · mwhitfield@ntis.com',
 'high',2600000,3800000,21000000);
