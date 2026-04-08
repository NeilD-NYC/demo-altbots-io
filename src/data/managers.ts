export interface Manager {
  id: number;
  name: string;
  strategy: string;
  aum_bn: number;
  inception: string;
  domicile: string;
  hq: string;
  gp_name: string;
  team_size: number;
  sec_registered: boolean;
  finra_status: string;
  sec_enforcement: string;
  form_d: boolean;
  sanctions: string;
  adverse_media: string;
  aum_trend: "Growing" | "Stable" | "Declining";
  strategy_drift: boolean;
  key_person_risk: "Low" | "Medium" | "High";
  last_updated: string;
  risk_score: number;
  flag: "green" | "yellow" | "red";
  performance_ytd: number;
  performance_3yr: number | null;
  prime_broker: string;
  auditor: string;
  legal_counsel: string;
}

export const managers: Manager[] = [
  {
    id: 1,
    name: "Arcturus Capital Management",
    strategy: "Global Macro",
    aum_bn: 4.2,
    inception: "2011",
    domicile: "Cayman Islands",
    hq: "New York, NY",
    gp_name: "Marcus Holt",
    team_size: 14,
    sec_registered: true,
    finra_status: "Clean",
    sec_enforcement: "None",
    form_d: true,
    sanctions: "Clear",
    adverse_media: "None",
    aum_trend: "Growing",
    strategy_drift: false,
    key_person_risk: "Low",
    last_updated: "2026-04-01",
    risk_score: 18,
    flag: "green",
    performance_ytd: 6.4,
    performance_3yr: 11.2,
    prime_broker: "Goldman Sachs",
    auditor: "Deloitte",
    legal_counsel: "Seward & Kissel"
  },
  {
    id: 2,
    name: "Meridian Capital Management",
    strategy: "Long/Short Equity",
    aum_bn: 1.8,
    inception: "2016",
    domicile: "Delaware LP",
    hq: "Greenwich, CT",
    gp_name: "Diana Reyes",
    team_size: 9,
    sec_registered: true,
    finra_status: "Clean",
    sec_enforcement: "None",
    form_d: true,
    sanctions: "Clear",
    adverse_media: "None",
    aum_trend: "Stable",
    strategy_drift: false,
    key_person_risk: "High",
    last_updated: "2026-04-01",
    risk_score: 34,
    flag: "yellow",
    performance_ytd: 3.1,
    performance_3yr: 8.7,
    prime_broker: "Morgan Stanley",
    auditor: "PwC",
    legal_counsel: "Schulte Roth"
  },
  {
    id: 3,
    name: "Ironwood Systematic Partners",
    strategy: "Quantitative Equity",
    aum_bn: 7.1,
    inception: "2008",
    domicile: "Cayman Islands",
    hq: "Chicago, IL",
    gp_name: "Chen Wei",
    team_size: 31,
    sec_registered: true,
    finra_status: "Clean",
    sec_enforcement: "None",
    form_d: true,
    sanctions: "Clear",
    adverse_media: "None",
    aum_trend: "Growing",
    strategy_drift: false,
    key_person_risk: "Low",
    last_updated: "2026-04-01",
    risk_score: 12,
    flag: "green",
    performance_ytd: 9.2,
    performance_3yr: 14.6,
    prime_broker: "Goldman Sachs",
    auditor: "KPMG",
    legal_counsel: "Kirkland & Ellis"
  },
  {
    id: 4,
    name: "Helix Credit Opportunities",
    strategy: "Distressed Credit",
    aum_bn: 2.3,
    inception: "2014",
    domicile: "Cayman Islands",
    hq: "New York, NY",
    gp_name: "Robert Vance",
    team_size: 12,
    sec_registered: true,
    finra_status: "1 Disclosure",
    sec_enforcement: "Settled 2019 - failure to disclose conflicts",
    form_d: true,
    sanctions: "Clear",
    adverse_media: "WSJ article 2021 - investor dispute",
    aum_trend: "Declining",
    strategy_drift: true,
    key_person_risk: "High",
    last_updated: "2026-04-01",
    risk_score: 78,
    flag: "red",
    performance_ytd: -1.2,
    performance_3yr: 3.1,
    prime_broker: "Deutsche Bank",
    auditor: "BDO",
    legal_counsel: "Kleinberg Kaplan"
  },
  {
    id: 5,
    name: "Northgate Event Driven Fund",
    strategy: "Event Driven",
    aum_bn: 3.6,
    inception: "2010",
    domicile: "Cayman Islands",
    hq: "New York, NY",
    gp_name: "Sarah Kim",
    team_size: 18,
    sec_registered: true,
    finra_status: "Clean",
    sec_enforcement: "None",
    form_d: true,
    sanctions: "Clear",
    adverse_media: "None",
    aum_trend: "Stable",
    strategy_drift: false,
    key_person_risk: "Medium",
    last_updated: "2026-04-01",
    risk_score: 22,
    flag: "green",
    performance_ytd: 5.7,
    performance_3yr: 10.3,
    prime_broker: "JPMorgan",
    auditor: "EY",
    legal_counsel: "Proskauer Rose"
  },
  {
    id: 6,
    name: "Solaris Private Credit",
    strategy: "Private Credit",
    aum_bn: 0.9,
    inception: "2019",
    domicile: "Delaware LP",
    hq: "Miami, FL",
    gp_name: "James Okafor",
    team_size: 6,
    sec_registered: false,
    finra_status: "Clean",
    sec_enforcement: "None",
    form_d: true,
    sanctions: "Clear",
    adverse_media: "None",
    aum_trend: "Growing",
    strategy_drift: false,
    key_person_risk: "High",
    last_updated: "2026-04-01",
    risk_score: 41,
    flag: "yellow",
    performance_ytd: 4.8,
    performance_3yr: null,
    prime_broker: "None",
    auditor: "Cohen & Company",
    legal_counsel: "Greenberg Traurig"
  },
  {
    id: 7,
    name: "Tundra Macro Strategies",
    strategy: "Global Macro",
    aum_bn: 5.5,
    inception: "2006",
    domicile: "Cayman Islands",
    hq: "London, UK",
    gp_name: "Alistair Brooks",
    team_size: 22,
    sec_registered: true,
    finra_status: "Clean",
    sec_enforcement: "None",
    form_d: false,
    sanctions: "Clear",
    adverse_media: "None",
    aum_trend: "Declining",
    strategy_drift: false,
    key_person_risk: "Medium",
    last_updated: "2026-04-01",
    risk_score: 29,
    flag: "green",
    performance_ytd: 2.3,
    performance_3yr: 7.8,
    prime_broker: "Barclays",
    auditor: "Grant Thornton",
    legal_counsel: "Walkers"
  },
  {
    id: 8,
    name: "Vega Special Situations",
    strategy: "Special Situations",
    aum_bn: 1.1,
    inception: "2018",
    domicile: "Delaware LP",
    hq: "New York, NY",
    gp_name: "Patricia Nguyen",
    team_size: 7,
    sec_registered: true,
    finra_status: "Clean",
    sec_enforcement: "None",
    form_d: true,
    sanctions: "Clear",
    adverse_media: "None",
    aum_trend: "Growing",
    strategy_drift: false,
    key_person_risk: "High",
    last_updated: "2026-04-01",
    risk_score: 37,
    flag: "yellow",
    performance_ytd: 7.1,
    performance_3yr: 12.4,
    prime_broker: "Credit Suisse",
    auditor: "Marcum",
    legal_counsel: "Seward & Kissel"
  }
];

export const signalEvents: Record<number, { year: string; event: string }[]> = {
  4: [
    { year: "2019", event: "SEC Settlement — failure to disclose conflicts" },
    { year: "2021", event: "Adverse Media (WSJ) — investor dispute" },
    { year: "2026", event: "Strategy Drift Detected" },
  ],
};
