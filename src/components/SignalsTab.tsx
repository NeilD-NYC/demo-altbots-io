import { useState } from "react";
import { cn } from "@/lib/utils";

// ─── SOURCE DEFINITIONS ───
interface SourceFilter {
  id: string;
  label: string;
  color: string;
  count: number;
}

const SOURCE_FILTERS: SourceFilter[] = [
  { id: "sec_edgar", label: "SEC EDGAR", color: "#EF4444", count: 14 },
  { id: "finra", label: "FINRA BrokerCheck", color: "#F59E0B", count: 2 },
  { id: "linkedin", label: "LinkedIn", color: "#3B82F6", count: 8 },
  { id: "form_adv", label: "Form ADV", color: "#F97316", count: 6 },
  { id: "13f", label: "13F Filings", color: "#8B5CF6", count: 5 },
  { id: "property", label: "Property Records", color: "#8B949E", count: 2 },
  { id: "uspto", label: "USPTO Patents", color: "#22C55E", count: 4 },
  { id: "social", label: "Social Media", color: "#3B82F6", count: 7 },
  { id: "corresp", label: "EDGAR CORRESP", color: "#F59E0B", count: 3 },
  { id: "state_sos", label: "State SOS Filings", color: "#EF4444", count: 1 },
  { id: "irs_990", label: "IRS Form 990", color: "#8B949E", count: 3 },
  { id: "website", label: "Website Monitor", color: "#22C55E", count: 3 },
];

// ─── SIGNAL DATA ───
interface RawSignal {
  source: string;
  sourceId: string;
  date: string;
  type: string;
  content: string[];
  reference?: string;
  usedIn?: string;
}

const helixSignals: RawSignal[] = [
  {
    source: "SEC EDGAR", sourceId: "sec_edgar", date: "Apr 3 2026", type: "Form 4",
    content: [
      "Filer: Jensen Huang, NVIDIA Corporation",
      "Transaction: Sale of 240,000 shares of common stock",
      "Price: $118.42 average. Total: $28.4M",
    ],
    reference: "Filing CIK: 0001045810 | Accession: 0001045810-26-000041",
    usedIn: "Insider Divergence Analysis",
  },
  {
    source: "SEC EDGAR", sourceId: "sec_edgar", date: "Apr 1 2026", type: "Form 4",
    content: [
      "Filer: Colette Kress, NVIDIA Corporation",
      "Transaction: Sale of 85,000 shares",
      "Price: $119.14 average. Total: $10.1M",
    ],
    reference: "Filing CIK: 0001045810 | Accession: 0001045810-26-000039",
    usedIn: "Insider Divergence Analysis",
  },
  {
    source: "Social Media", sourceId: "social", date: "Apr 7 2026", type: "Reddit r/hedgefund",
    content: [
      "Post detected mentioning \"Helix Credit\"",
      "Content excerpt: \"Redemption rumors... $200M+ LP pulling out\"",
      "Upvotes at detection: 2,847 | Comments: 184",
      "Sentiment score: -0.81 (very negative)",
    ],
    usedIn: "Social Crisis Signal",
  },
  {
    source: "Social Media", sourceId: "social", date: "Apr 6 2026", type: "Twitter/X",
    content: [
      "Post mentioning \"Helix Credit underperforming\"",
      "Impressions at detection: 1,204",
      "Account type: Institutional analyst, 8,400 followers",
      "Sentiment score: -0.54 (negative)",
    ],
    usedIn: "Social Crisis Signal",
  },
  {
    source: "Form ADV", sourceId: "form_adv", date: "Apr 2 2026", type: "ADV Amendment #4",
    content: [
      "Regulatory AUM change detected",
      "Prior filing AUM: $2,800,000,000",
      "Current filing AUM: $2,300,000,000",
      "Delta: -$500,000,000 (-17.9%)",
      "Management fee change: 1.50% → 1.25%",
    ],
    reference: "Filing reference: SEC IA-XXXX-2026-04",
    usedIn: "Redemption Queue Model, Fee Drag Analysis",
  },
  {
    source: "LinkedIn", sourceId: "linkedin", date: "Mar 28 2026", type: "Profile Monitoring",
    content: [
      "Profile update detected: Robert Vance",
      "Change: Headline modified",
      "Prior: \"Founder & CIO, Helix Credit Opportunities\"",
      "Current: \"Investor | Credit & Special Situations\"",
      "Firm name removed from headline",
      "Raw diff: 6 words removed, 5 words added",
    ],
    usedIn: "Founder Life Event Detection",
  },
  {
    source: "Property Records", sourceId: "property", date: "Mar 14 2026", type: "Greenwich CT Town Clerk",
    content: [
      "Document type: Property transfer",
      "Address: 14 Round Hill Road, Greenwich CT 06831",
      "Grantor: Robert Vance",
      "Grantee: Vance Family Irrevocable Trust",
      "Consideration: $0 (intra-family transfer)",
      "Book/Page: 8841/127",
    ],
    usedIn: "Founder Life Event Detection",
  },
  {
    source: "State SOS Filings", sourceId: "state_sos", date: "Feb 3 2026", type: "Delaware Secretary of State",
    content: [
      "Entity formed: Vance Capital Advisors LLC",
      "Formation date: Feb 3 2026",
      "Registered agent: CT Corporation System",
      "Entity type: LLC — Investment Advisory",
      "File number: 7291847",
    ],
    usedIn: "Founder Life Event Detection",
  },
  {
    source: "Form ADV", sourceId: "form_adv", date: "Jan 15 2026", type: "ADV Amendment #3",
    content: [
      "New conflict of interest disclosure added",
      "Text added: \"GP co-investment in portfolio company Redwood Holdings LLC, a portfolio company of the Fund\"",
      "Section: Part 2A Item 11 (Conflicts of Interest)",
    ],
    reference: "Filing reference: SEC IA-XXXX-2026-01",
    usedIn: "Board & Advisory Interlocks",
  },
  {
    source: "LinkedIn", sourceId: "linkedin", date: "Jan 8 2026", type: "Profile Monitoring",
    content: [
      "Profile update detected: Michael Torres",
      "Change: Employment end date added at Helix Credit Opportunities",
      "New current role: \"Independent Risk Consultant\"",
      "Tenure at Helix: 6 years 2 months",
      "Title held: Chief Risk Officer",
    ],
    usedIn: "Workforce Intelligence",
  },
  {
    source: "EDGAR CORRESP", sourceId: "corresp", date: "Jan 9 2026", type: "CORRESP — Informal Inquiry",
    content: [
      "Company: UnitedHealth Group (UNH)",
      "Inquiry topic: Non-GAAP adjusted EPS reconciliation",
      "Division: SEC Division of Corporation Finance",
      "Status: Open — response pending",
      "EDGAR filing type: CORRESP",
    ],
    reference: "Accession: 0000101648-26-000012",
    usedIn: "Regulatory Comment Letter Mining",
  },
  {
    source: "13F Filings", sourceId: "13f", date: "Jan 15 2026", type: "13F-HR Q4 2025",
    content: [
      "Filer: Helix Credit Opportunities Fund LP",
      "Gross long exposure: $2,140,000,000",
      "Prior quarter gross: $2,490,000,000",
      "Delta: -$350,000,000 (-14.1%)",
      "New positions: 0",
      "Eliminated positions: 3",
    ],
    reference: "EDGAR CIK: 0001587234",
    usedIn: "PB Musical Chairs, Redemption Queue Model",
  },
  {
    source: "Form ADV", sourceId: "form_adv", date: "Sep 12 2025", type: "ADV Amendment #2",
    content: [
      "Personnel change detected in ADV Part 1",
      "Removed from Schedule A: Michael Torres (CRO)",
      "No replacement filing detected as of current date",
      "Section: Part 1A Item 10",
    ],
    usedIn: "Regulatory Filing Velocity, Workforce Intelligence",
  },
  {
    source: "LinkedIn", sourceId: "linkedin", date: "Sep 5 2025", type: "Job Posting Monitor",
    content: [
      "Job posting detected: Helix Credit Opportunities",
      "Role: Junior Credit Analyst",
      "Seniority level: Entry level (0-2 years experience)",
      "Department: Investments",
      "Compensation listed: $85,000-$105,000 base",
      "Signal: Replacement hire for senior departure at junior seniority",
    ],
    usedIn: "Workforce Intelligence",
  },
  {
    source: "Website Monitor", sourceId: "website", date: "Mar 28 2026", type: "Team Page Change",
    content: [
      "URL: helixcredit.com/team",
      "Change type: Personnel removal",
      "Names removed: Michael Torres, James Wu, Sarah Chen",
      "Prior team page count: 12 professionals",
      "Current team page count: 9 professionals",
      "Diff size: -340 characters",
    ],
    usedIn: "Web Presence & Operational Signals",
  },
  {
    source: "Website Monitor", sourceId: "website", date: "Feb 12 2026", type: "Strategy Page Change",
    content: [
      "URL: helixcredit.com/strategy",
      "Change type: Content modification",
      "Key phrase changed: \"primarily distressed debt\" → \"credit opportunities across the capital structure\"",
      "Diff size: ~180 words modified",
    ],
    usedIn: "Web Presence & Operational Signals",
  },
  {
    source: "USPTO Patents", sourceId: "uspto", date: "Q4 2025", type: "Patent Filing Velocity",
    content: [
      "Company monitored: UnitedHealth Group (UNH)",
      "Q4 2025 filings: 24",
      "Q4 2024 filings: 38",
      "4-quarter trend: 42, 39, 35, 31, 28, 24 (declining)",
      "Category decline: Health data analytics (-61%)",
    ],
    usedIn: "Patent & IP Velocity",
  },
  {
    source: "FINRA BrokerCheck", sourceId: "finra", date: "Static", type: "Robert Vance",
    content: [
      "CRD Number: 2847193",
      "Disclosure type: Regulatory action",
      "Date: 2019",
      "Regulator: SEC",
      "Allegation: Failure to disclose conflicts of interest with third-party placement agent",
      "Resolution: Settled",
      "Penalty: $285,000 civil penalty",
    ],
    usedIn: "Regulatory & Filing Velocity",
  },
  {
    source: "FINRA BrokerCheck", sourceId: "finra", date: "Static", type: "David Mercer",
    content: [
      "CRD Number: 3912847",
      "Disclosure type: Customer dispute",
      "Date: 2017 (prior firm)",
      "Allegation: Unsuitable recommendation",
      "Resolution: Settled",
      "Amount: $45,000",
    ],
    usedIn: "Regulatory & Filing Velocity",
  },
  {
    source: "IRS Form 990", sourceId: "irs_990", date: "2024 filing", type: "Greenwich Academy",
    content: [
      "Organization: Greenwich Academy",
      "Board member listed: Robert Vance",
      "Role: Trustee",
      "Year first listed: 2021",
      "Source: IRS Form 990, Schedule O",
    ],
    usedIn: "Board & Advisory Interlocks",
  },
  {
    source: "Form ADV", sourceId: "form_adv", date: "Mar 2025", type: "ADV Amendment #1",
    content: [
      "AUM restatement detected",
      "Prior regulatory AUM: $2,720,000,000",
      "Restated regulatory AUM: $2,300,000,000",
      "Delta: -$420,000,000",
      "Strategy description expanded to include \"opportunistic equity co-investments\"",
      "Section: Part 2A Item 8",
    ],
    usedIn: "Regulatory Filing Velocity",
  },
];

const managerSignalsData: Record<number, RawSignal[]> = {
  4: helixSignals,
};

// ─── SOURCE COLOR MAP ───
const sourceColorMap: Record<string, string> = {};
SOURCE_FILTERS.forEach(f => { sourceColorMap[f.id] = f.color; });

// ─── COMPONENT ───
const SignalsTab = ({ managerId }: { managerId: number }) => {
  const [activeFilters, setActiveFilters] = useState<Set<string>>(
    new Set(SOURCE_FILTERS.map(f => f.id))
  );

  const signals = managerSignalsData[managerId];

  if (!signals) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-sm">Signal data is being collected for this manager.</p>
        <p className="text-[11px] text-[#8B949E] mt-1">Check back soon for raw signal feeds.</p>
      </div>
    );
  }

  const toggleFilter = (id: string) => {
    setActiveFilters(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const filteredSignals = signals.filter(s => activeFilters.has(s.sourceId));

  return (
    <div className="flex gap-0 min-h-[600px]">
      {/* LEFT SIDEBAR */}
      <div className="w-[200px] flex-shrink-0 bg-[#0D1117] border-r border-[#30363D] p-4">
        <h4 className="text-[10px] font-bold text-[#C9A84C] uppercase tracking-widest mb-4">Data Sources</h4>
        <div className="space-y-1.5">
          {SOURCE_FILTERS.map(f => {
            const active = activeFilters.has(f.id);
            return (
              <button
                key={f.id}
                onClick={() => toggleFilter(f.id)}
                className={cn(
                  "w-full flex items-center gap-2 px-2 py-1.5 rounded text-left transition-all text-[11px]",
                  active ? "bg-[#161B22]" : "opacity-40 hover:opacity-70"
                )}
              >
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: f.color }} />
                <span className="text-[#CBD5E1] flex-1 truncate">{f.label}</span>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full" style={{ backgroundColor: `${f.color}20`, color: f.color }}>
                  {f.count}
                </span>
              </button>
            );
          })}
        </div>
        <div className="mt-6 pt-4 border-t border-[#30363D] space-y-1.5 text-[10px] text-[#8B949E]">
          <p>Last full sweep: <span className="text-[#CBD5E1]">Apr 8 2026 02:14 UTC</span></p>
          <p>Next scheduled: <span className="text-[#CBD5E1]">Apr 15 2026</span></p>
          <p>Total raw signals: <span className="text-[#C9A84C] font-bold">62</span></p>
        </div>
      </div>

      {/* MAIN FEED */}
      <div className="flex-1 min-w-0">
        {/* Top banner */}
        <div className="bg-[#C9A84C]/10 border-b border-[#C9A84C]/30 px-5 py-2.5 flex items-center gap-2">
          <span className="text-[11px] text-[#C9A84C]">
            This tab shows raw detected signals with full source attribution. For analysis and conclusions see the <span className="font-bold">Intelligence tab →</span>
          </span>
        </div>

        {/* Feed */}
        <div className="p-5 space-y-3">
          {filteredSignals.length === 0 && (
            <p className="text-sm text-[#8B949E] text-center py-8">No signals match current filters.</p>
          )}
          {filteredSignals.map((signal, i) => {
            const color = sourceColorMap[signal.sourceId] || "#8B949E";
            return (
              <div key={i} className="bg-[#161B22] border border-[#30363D] rounded-lg p-4">
                {/* Header row */}
                <div className="flex items-center gap-2 flex-wrap mb-2.5">
                  <span
                    className="text-[9px] font-bold px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: `${color}20`, color }}
                  >
                    {signal.source}
                  </span>
                  <span className="text-[10px] text-[#8B949E]">{signal.date}</span>
                  <span className="text-[10px] text-[#CBD5E1] font-medium">{signal.type}</span>
                </div>

                {/* Content lines */}
                <div className="space-y-0.5 mb-2">
                  {signal.content.map((line, j) => (
                    <p key={j} className="text-[11px] text-[#CBD5E1] leading-relaxed">{line}</p>
                  ))}
                </div>

                {/* Reference */}
                {signal.reference && (
                  <p className="text-[10px] text-[#8B949E] font-mono">{signal.reference}</p>
                )}

                {/* Used in Intelligence */}
                {signal.usedIn && (
                  <div className="mt-2 pt-2 border-t border-[#30363D]/50 flex items-center gap-1.5">
                    <span className="text-[9px] text-[#3B82F6] font-medium">Used in Intelligence:</span>
                    <span className="text-[9px] text-[#3B82F6] font-bold">{signal.usedIn} ↗</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SignalsTab;
