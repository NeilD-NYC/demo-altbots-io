import { Shuffle, UserSearch, Search, Percent, Lightbulb, Database, Filter, Network } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid, Cell, ComposedChart, Area, ReferenceLine } from "recharts";

// ─── REUSABLE HELPERS (same pattern as main file) ───
const StatChip = ({ label, value, color = "#C9A84C", badge, pulse }: { label: string; value: string; color?: string; badge?: string; pulse?: boolean }) => (
  <div className="bg-[#161B22] border border-[#30363D] rounded-lg px-3 py-2 flex flex-col gap-0.5">
    <span className="text-[10px] text-[#8B949E] uppercase tracking-wider">{label}</span>
    <span className="text-sm font-bold" style={{ color }}>{value}</span>
    {badge && (
      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full w-fit mt-0.5 ${pulse ? "animate-pulse" : ""}`} style={{ backgroundColor: `${color}20`, color }}>
        {badge}
      </span>
    )}
  </div>
);

const SectionCard = ({ title, icon: Icon, borderColor, children }: { title: string; icon: React.ElementType; borderColor: string; children: React.ReactNode }) => (
  <div className="bg-[#161B22] border border-[#30363D] rounded-lg overflow-hidden" style={{ borderLeftWidth: 3, borderLeftColor: borderColor }}>
    <div className="px-5 py-4 border-b border-[#30363D] flex items-center gap-2">
      <Icon className="h-4 w-4" style={{ color: borderColor }} />
      <h3 className="text-sm font-bold text-foreground">{title}</h3>
    </div>
    <div className="p-5">{children}</div>
  </div>
);

// ─── SECTION 6: PRIME BROKER MUSICAL CHAIRS ───
const pbExposureData = [
  { q: "Q1'23", gross: 3.8, pbs: 1 }, { q: "Q2'23", gross: 3.7, pbs: 1 }, { q: "Q3'23", gross: 3.6, pbs: 1 },
  { q: "Q4'23", gross: 3.5, pbs: 1 }, { q: "Q1'24", gross: 3.1, pbs: 1 }, { q: "Q2'24", gross: 2.8, pbs: 1 },
  { q: "Q3'24", gross: 2.6, pbs: 1 }, { q: "Q4'24", gross: 2.4, pbs: 1 }, { q: "Q1'26", gross: 2.1, pbs: 2 },
];

const Section6 = () => (
  <SectionCard title="Prime Broker History & Counterparty Intelligence" icon={Shuffle} borderColor="#F97316">
    <div className="flex flex-wrap gap-3 mb-5">
      <StatChip label="PB Changes (36m)" value="2" color="#EF4444" />
      <StatChip label="Current PB Tier" value="Tier 2" color="#EF4444" badge="ELEVATED RISK" />
      <StatChip label="Simultaneous 13F De-grossing" value="Detected" color="#EF4444" badge="CONFIRMED" />
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      <div>
        <h4 className="text-xs font-bold text-foreground uppercase tracking-wider mb-3">Prime Broker Change Timeline</h4>
        <div className="space-y-4">
          <div className="relative pl-5">
            <div className="absolute left-0 top-1 w-2.5 h-2.5 rounded-full bg-[#EF4444]" />
            <div className="absolute left-[4px] top-4 w-px h-full bg-[#30363D]" />
            <span className="text-[10px] font-bold text-[#EF4444]">Apr 2024 — PB CHANGE</span>
            <p className="text-[11px] text-[#8B949E] mt-1 leading-relaxed">
              Departed Goldman Sachs Prime Brokerage after 8-year relationship. Onboarded Deutsche Bank as sole prime broker.
              Goldman Sachs is Tier 1. Deutsche Bank prime classified Tier 2.
            </p>
            <p className="text-[10px] text-[#EF4444] mt-1 italic">Signal: Margin call or credit limit reduction at Goldman suspected.</p>
          </div>
          <div className="relative pl-5">
            <div className="absolute left-0 top-1 w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
            <span className="text-[10px] font-bold text-[#F59E0B]">Jan 2026 — SECOND PB ADDED</span>
            <p className="text-[11px] text-[#8B949E] mt-1 leading-relaxed">
              Added Jefferies as secondary prime broker. Second PB addition mid-cycle is consistent with margin diversification following credit stress at primary PB. Jefferies classified Tier 2.
            </p>
          </div>
        </div>
        <p className="text-[10px] text-[#8B949E] italic mt-4">
          Peer median for $1-3B distressed managers: 1.4 PB relationships. Helix now at 2, both Tier 2. No Tier 1 PB relationship as of Q1 2026.
        </p>
      </div>
      <div>
        <h4 className="text-xs font-bold text-foreground uppercase tracking-wider mb-3">PB Change vs. 13F Gross Exposure Cross-Reference</h4>
        <ResponsiveContainer width="100%" height={200}>
          <ComposedChart data={pbExposureData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#30363D" />
            <XAxis dataKey="q" tick={{ fill: "#8B949E", fontSize: 9 }} />
            <YAxis yAxisId="left" tick={{ fill: "#8B949E", fontSize: 9 }} domain={[0, 5]} label={{ value: "Gross ($B)", angle: -90, position: "insideLeft", fill: "#8B949E", fontSize: 9 }} />
            <YAxis yAxisId="right" orientation="right" tick={{ fill: "#8B949E", fontSize: 9 }} domain={[0, 3]} label={{ value: "# PBs", angle: 90, position: "insideRight", fill: "#8B949E", fontSize: 9 }} />
            <Tooltip contentStyle={{ background: "#161B22", border: "1px solid #30363D", fontSize: 10 }} />
            <Line yAxisId="left" type="monotone" dataKey="gross" stroke="#EF4444" strokeWidth={2} dot={{ fill: "#EF4444", r: 3 }} name="Gross Exposure ($B)" />
            <Line yAxisId="right" type="stepAfter" dataKey="pbs" stroke="#F59E0B" strokeDasharray="5 5" strokeWidth={2} dot={{ fill: "#F59E0B", r: 3 }} name="# PB Relationships" />
          </ComposedChart>
        </ResponsiveContainer>
        <div className="mt-2 bg-[#F59E0B]/10 border border-[#F59E0B]/30 rounded-lg p-2 text-[10px] text-[#F59E0B] italic">
          De-grossing of $1.7B (45%) coincides precisely with PB transition. Consistent with forced margin reduction.
        </div>
      </div>
    </div>
    <div className="mt-5">
      <h4 className="text-[10px] font-bold text-foreground uppercase tracking-wider mb-2">PB Tier Classification Reference</h4>
      <div className="overflow-auto">
        <table className="w-full text-[10px]">
          <tbody>
            <tr className="border-b border-[#30363D]/50">
              <td className="py-1.5 px-2 text-[#22C55E] font-bold">Tier 1</td>
              <td className="py-1.5 px-2 text-[#CBD5E1]">Goldman Sachs, Morgan Stanley, JPMorgan, Citi, BofA, Barclays, UBS</td>
            </tr>
            <tr className="border-b border-[#30363D]/50">
              <td className="py-1.5 px-2 text-[#F59E0B] font-bold">Tier 2</td>
              <td className="py-1.5 px-2 text-[#CBD5E1]">Deutsche Bank, Jefferies, Nomura, Societe Generale, BTIG, Cowen</td>
            </tr>
            <tr>
              <td className="py-1.5 px-2 text-[#EF4444] font-bold">Tier 3</td>
              <td className="py-1.5 px-2 text-[#CBD5E1]">All others — elevated counterparty and operational risk</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </SectionCard>
);

// ─── SECTION 7: FOUNDER LIFE EVENT DETECTION ───
const Section7 = () => (
  <SectionCard title="Principal Life Event & Key Person Intelligence" icon={UserSearch} borderColor="#EC4899">
    <div className="flex flex-wrap gap-3 mb-5">
      <StatChip label="Public Records Scanned" value="847 (last 90 days)" />
      <StatChip label="Life Events Detected" value="3" color="#EF4444" />
      <StatChip label="New Entity Formations" value="1" color="#F59E0B" />
      <StatChip label="Key Person Risk Level" value="HIGH" color="#EF4444" badge="CRITICAL" pulse />
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      <div>
        <h4 className="text-xs font-bold text-foreground uppercase tracking-wider mb-3">Detected Life Events — Robert Vance</h4>
        <div className="space-y-3">
          {[
            { color: "#EF4444", date: "Mar 14 2026", title: "Property Transfer Detected",
              text: "Public record: 14 Round Hill Road, Greenwich CT 06831. Transfer filed Greenwich Town Clerk Mar 14 2026. Estimated value: $4.2M. Transferred to Vance Family Irrevocable Trust. Not a sale — estate planning motion.",
              signal: "Ambiguous. Could be routine estate planning or asset protection ahead of wind-down. Monitor.",
              source: "Greenwich CT property records" },
            { color: "#F59E0B", date: "Feb 3 2026", title: "New LLC Formation",
              text: "Vance Capital Advisors LLC formed Feb 3 2026. State: Delaware. Registered agent: CT Corporation. Purpose: 'Investment advisory and consulting services.'",
              signal: "New entity formed during period of flagship fund underperformance. Possible successor vehicle or wind-down vehicle. No ADV filing yet.",
              source: "Delaware SOS filing" },
            { color: "#F59E0B", date: "Nov 2025", title: "LinkedIn Activity Change",
              text: "Robert Vance updated LinkedIn headline from 'Founder & CIO, Helix Credit Opportunities' to 'Investor | Credit & Special Situations.' No firm name in current headline as of Nov 12 2025.",
              signal: "Disassociation language. Precedes departures at several historical fund wind-downs in our dataset.",
              source: "LinkedIn profile monitoring" },
          ].map((e, i) => (
            <div key={i} className="rounded-lg p-3" style={{ backgroundColor: `${e.color}10`, borderLeft: `2px solid ${e.color}` }}>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold" style={{ color: e.color }}>{e.date} — {e.title}</span>
              </div>
              <p className="text-[11px] text-[#CBD5E1] leading-relaxed">{e.text}</p>
              <p className="text-[10px] italic mt-1" style={{ color: e.color }}>Signal: {e.signal}</p>
              <span className="text-[9px] text-[#8B949E] mt-1 block">Source: {e.source}</span>
            </div>
          ))}
        </div>
      </div>
      <div>
        <h4 className="text-xs font-bold text-foreground uppercase tracking-wider mb-3">Key Person Dependency Analysis</h4>
        <div className="bg-[#0D1117] border border-[#30363D] rounded-lg p-4 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 rounded-full border-2 border-[#EF4444] flex items-center justify-center bg-[#161B22]">
              <span className="text-lg font-bold text-[#EF4444]">94</span>
            </div>
            <div>
              <p className="text-xs font-bold text-[#EF4444]">Single-PM Dependency Score: 94/100</p>
              <p className="text-[10px] text-[#8B949E]">CRITICAL — Sole decision-maker risk</p>
            </div>
          </div>
          <p className="text-[11px] text-[#CBD5E1] leading-relaxed">
            Robert Vance is identified as sole named investment decision-maker across all fund documents, ADV filings, and public materials. No named co-PM or successor.
          </p>
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <p className="text-[#8B949E]">Succession Plan Disclosed: <span className="text-[#EF4444] font-bold">NONE DETECTED</span></p>
            <p className="text-[#8B949E]">Named Deputy: <span className="text-[#EF4444] font-bold">NONE</span></p>
            <p className="text-[#8B949E]">Team Depth Score: <span className="text-[#EF4444] font-bold">2.1/10</span></p>
            <p className="text-[#8B949E]">Peer benchmark: <span className="text-[#CBD5E1]">2.3 named senior IPs avg</span></p>
          </div>
        </div>
        <p className="text-[10px] text-[#8B949E] italic mt-3">
          AltBots monitors public obituary databases and health-related filings for key-person risk on single-PM funds. No adverse signals detected for Robert Vance as of Apr 8 2026.
        </p>
      </div>
    </div>
  </SectionCard>
);

// ─── SECTION 8: REGULATORY COMMENT LETTER MINING ───
const Section8 = () => (
  <SectionCard title="SEC Comment Letter Intelligence — Top Holdings" icon={Search} borderColor="#EAB308">
    <div className="flex flex-wrap gap-3 mb-5">
      <StatChip label="Holdings Monitored via EDGAR" value="12" />
      <StatChip label="Active Comment Letters Detected" value="3" color="#F59E0B" />
      <StatChip label="Restatement Risk Flags" value="1" color="#EF4444" />
    </div>
    <div className="space-y-4">
      {[
        { ticker: "NVIDIA Corporation (NVDA)", type: "SEC Division of Corporation Finance — Comment Letter",
          filed: "Feb 18 2026", resolved: "Mar 29 2026 (60-day public lag)", status: "Resolved",
          topic: "Revenue Recognition — Data Center Segment",
          summary: "SEC staff questioned NVDA's timing of revenue recognition on multi-element data center arrangements, specifically whether software licensing components were being recognized upfront vs. ratably. Company responded with additional disclosure. No restatement required but additional footnote disclosure added.",
          risk: "MEDIUM", riskColor: "#F59E0B", riskNote: "No restatement but revenue recognition scrutiny on largest segment.",
          exposure: "Helix Exposure: $5.4B notional across portfolio managers." },
        { ticker: "UnitedHealth Group (UNH)", type: "SEC Division of Enforcement — Informal Inquiry",
          filed: "Jan 9 2026", resolved: "Status: OPEN (not yet resolved)", status: "Open",
          topic: "Non-GAAP Adjusted EPS Reconciliation and Related-Party MCO transactions",
          summary: "Staff seeking additional clarification on adjusted metric exclusions and intra-company transactions between UnitedHealth and Optum segment. Informal inquiry, not formal investigation.",
          risk: "WATCH", riskColor: "#F59E0B", riskNote: "Open inquiry, elevated until resolved.",
          exposure: "" },
        { ticker: "JPMorgan Chase (JPM)", type: "Comment Letter: Routine 10-K review",
          filed: "Dec 2025", resolved: "Feb 2026", status: "Resolved",
          topic: "Loan loss reserve methodology disclosure",
          summary: "Routine annual review comment. JPM responded with expanded CECL methodology disclosure. No substantive accounting issue identified.",
          risk: "LOW", riskColor: "#22C55E", riskNote: "Resolved, no action required.",
          exposure: "" },
      ].map((f, i) => (
        <div key={i} className="bg-[#0D1117] border border-[#30363D] rounded-lg p-4" style={{ borderLeftWidth: 2, borderLeftColor: f.riskColor }}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-foreground">{f.ticker}</span>
            <span className="text-[9px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: `${f.riskColor}20`, color: f.riskColor }}>
              Risk: {f.risk}
            </span>
          </div>
          <p className="text-[10px] text-[#8B949E]">{f.type}</p>
          <p className="text-[10px] text-[#8B949E]">Filed: {f.filed} | {f.resolved}</p>
          <p className="text-[10px] text-[#C9A84C] font-bold mt-2">Topic: {f.topic}</p>
          <p className="text-[11px] text-[#CBD5E1] leading-relaxed mt-1">{f.summary}</p>
          <p className="text-[10px] italic mt-1" style={{ color: f.riskColor }}>{f.riskNote}</p>
          {f.exposure && <p className="text-[10px] text-[#8B949E] mt-1">{f.exposure}</p>}
        </div>
      ))}
    </div>
    <p className="text-[10px] text-[#8B949E] italic mt-4">
      SEC comment letters become public 60 days after resolution via EDGAR CORRESP filing type. AltBots parses these daily for all holdings above 2% portfolio weight. This data is available in EDGAR but parsed by almost no institutional allocators systematically.
    </p>
  </SectionCard>
);

// ─── SECTION 9: FEE DRAG BENCHMARKING ───
const feeWaterfallData = [
  { name: "Mgmt Fee", value: 1.25, fill: "#C9A84C" },
  { name: "Perf Fee", value: 0.89, fill: "#F59E0B" },
  { name: "Admin/Ops", value: 0.31, fill: "#8B949E" },
  { name: "Legal/Compl", value: 0.28, fill: "#8B949E" },
  { name: "PB Financing", value: 0.44, fill: "#EF4444" },
  { name: "Txn Costs", value: 0.24, fill: "#8B949E" },
];

const Section9 = () => (
  <SectionCard title="Fee Drag & LPA Economics Analysis" icon={Percent} borderColor="#84CC16">
    <div className="flex flex-wrap gap-3 mb-5">
      <StatChip label="Stated Management Fee" value="1.25% (down from 1.5%)" />
      <StatChip label="Effective All-In Fee Drag" value="3.41%" color="#EF4444" badge="Above peer avg" />
      <StatChip label="Peer Composite Avg" value="2.38%" color="#22C55E" />
      <StatChip label="Excess Fee Drag" value="+103 bps" color="#EF4444" />
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      <div>
        <h4 className="text-xs font-bold text-foreground uppercase tracking-wider mb-3">Fee Waterfall Decomposition</h4>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={feeWaterfallData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#30363D" />
            <XAxis type="number" tick={{ fill: "#8B949E", fontSize: 9 }} domain={[0, 1.5]} unit="%" />
            <YAxis type="category" dataKey="name" tick={{ fill: "#8B949E", fontSize: 9 }} width={80} />
            <Tooltip contentStyle={{ background: "#161B22", border: "1px solid #30363D", fontSize: 10 }} formatter={(v: number) => `${v}%`} />
            <Bar dataKey="value" radius={[0, 4, 4, 0]}>
              {feeWaterfallData.map((d, i) => <Cell key={i} fill={d.fill} />)}
            </Bar>
            <ReferenceLine x={2.38} stroke="#22C55E" strokeDasharray="5 5" label={{ value: "Peer Avg", fill: "#22C55E", fontSize: 9 }} />
          </BarChart>
        </ResponsiveContainer>
        <div className="mt-2 bg-[#0D1117] border border-[#30363D] rounded-lg p-2">
          <p className="text-[11px] text-[#C9A84C] font-bold">Total Effective Fee Drag: 3.41%</p>
          <p className="text-[10px] text-[#8B949E] italic mt-1">Prime brokerage financing spread adds ~18bps premium vs. Tier 1 PB peers. Partially offset by reduced management fee.</p>
        </div>
      </div>
      <div>
        <h4 className="text-xs font-bold text-foreground uppercase tracking-wider mb-3">LPA Economic Terms Summary</h4>
        <div className="bg-[#0D1117] border border-[#30363D] rounded-lg p-4 space-y-2 text-[11px]">
          {[
            ["Hurdle Rate", "8% preferred return (LIBOR + 300 standard)"],
            ["Carried Interest", "20% above hurdle"],
            ["Catch-Up", "100% GP catch-up after hurdle"],
            ["Clawback", "Yes — 3-year lookback"],
            ["Most Favored Nation", "Available to LPs >$50M commitment"],
            ["Gates", "15% quarterly redemption gate"],
            ["Lock-Up", "2-year initial, annual thereafter"],
            ["Side Pocket", "Up to 20% of NAV"],
          ].map(([label, val]) => (
            <div key={label} className="flex justify-between">
              <span className="text-[#8B949E]">{label}:</span>
              <span className="text-[#CBD5E1] text-right max-w-[60%]">{val}</span>
            </div>
          ))}
          <div className="flex justify-between pt-2 border-t border-[#30363D]">
            <span className="text-[#F59E0B] font-bold">Key Man:</span>
            <span className="text-[#F59E0B] text-right max-w-[60%]">Triggers 90-day notification if Vance departs — does NOT trigger automatic wind-down</span>
          </div>
        </div>
        <div className="mt-3 bg-[#F59E0B]/10 border border-[#F59E0B]/30 rounded-lg p-3 text-[10px] text-[#F59E0B] italic leading-relaxed">
          Key Man clause does not force wind-down on departure. Investors receive notification only. No automatic redemption right triggered. Recommend negotiating hard key-man redemption right at next side letter opportunity.
        </div>
      </div>
    </div>
  </SectionCard>
);

// ─── SECTION 10: PATENT & IP VELOCITY ───
const patentData = [
  { q: "Q1'24", NVDA: 380, AAPL: 890, META: 210, UNH: 42 },
  { q: "Q2'24", NVDA: 410, AAPL: 902, META: 228, UNH: 39 },
  { q: "Q3'24", NVDA: 445, AAPL: 918, META: 241, UNH: 41 },
  { q: "Q4'24", NVDA: 471, AAPL: 931, META: 259, UNH: 38 },
  { q: "Q1'25", NVDA: 498, AAPL: 944, META: 278, UNH: 35 },
  { q: "Q2'25", NVDA: 521, AAPL: 951, META: 291, UNH: 31 },
  { q: "Q3'25", NVDA: 544, AAPL: 948, META: 287, UNH: 28 },
  { q: "Q4'25", NVDA: 562, AAPL: 939, META: 279, UNH: 24 },
];

const Section10 = () => (
  <SectionCard title="Patent & IP Filing Intelligence — Top Holdings" icon={Lightbulb} borderColor="#22D3EE">
    <div className="flex flex-wrap gap-3 mb-5">
      <StatChip label="Holdings Monitored" value="12" />
      <StatChip label="IP Deceleration Flags" value="2" color="#F59E0B" />
      <StatChip label="Sector-Leading Filers" value="3" color="#22C55E" />
    </div>
    <h4 className="text-xs font-bold text-foreground uppercase tracking-wider mb-3">USPTO Patent Filing Velocity — Trailing 8 Quarters</h4>
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={patentData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#30363D" />
        <XAxis dataKey="q" tick={{ fill: "#8B949E", fontSize: 9 }} />
        <YAxis tick={{ fill: "#8B949E", fontSize: 9 }} />
        <Tooltip contentStyle={{ background: "#161B22", border: "1px solid #30363D", fontSize: 10 }} />
        <Line type="monotone" dataKey="NVDA" stroke="#3B82F6" strokeWidth={2} dot={{ r: 2 }} />
        <Line type="monotone" dataKey="AAPL" stroke="#22C55E" strokeWidth={2} dot={{ r: 2 }} />
        <Line type="monotone" dataKey="META" stroke="#8B5CF6" strokeWidth={2} dot={{ r: 2 }} />
        <Line type="monotone" dataKey="UNH" stroke="#F59E0B" strokeWidth={2} dot={{ r: 2 }} />
      </LineChart>
    </ResponsiveContainer>
    <div className="flex gap-4 mt-2 mb-4">
      {[["NVDA", "#3B82F6"], ["AAPL", "#22C55E"], ["META", "#8B5CF6"], ["UNH", "#F59E0B"]].map(([t, c]) => (
        <span key={t} className="text-[9px] flex items-center gap-1"><span className="w-2 h-2 rounded-full" style={{ backgroundColor: c }} />{t}</span>
      ))}
    </div>
    <div className="space-y-3">
      {[
        { ticker: "NVDA", status: "ACCELERATING ✓", color: "#22C55E", text: "Patent velocity up 48% over 8 quarters. Filing categories: GPU architecture, transformer inference optimization, autonomous systems. R&D investment signal is strongly positive. Consistent with data center capex cycle." },
        { ticker: "AAPL", status: "PLATEAUING ⚠", color: "#F59E0B", text: "Patent filings flat to slightly declining over last 3 quarters after years of growth. Hardware filings declining. AR/VR category growing but offsetting decline in core device IP. Watch for continued deceleration." },
        { ticker: "META", status: "DECELERATING ⚠", color: "#F59E0B", text: "8% filing decline over last two quarters. Metaverse/VR filings dropped sharply while AI infrastructure filings increased. R&D reallocation visible — not alarming but notable." },
        { ticker: "UNH", status: "DECLINING 🔴", color: "#EF4444", text: "43% decline in patent filing rate over 8 quarters. Primarily in health data analytics and care management technology categories. Possible R&D investment pullback or strategic pivot. Flag for follow-up given open SEC inquiry." },
      ].map((f, i) => (
        <div key={i} className="rounded-lg p-3" style={{ backgroundColor: `${f.color}10`, borderLeft: `2px solid ${f.color}` }}>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-foreground">{f.ticker}</span>
            <span className="text-[10px] font-bold" style={{ color: f.color }}>{f.status}</span>
          </div>
          <p className="text-[11px] text-[#CBD5E1] leading-relaxed">{f.text}</p>
        </div>
      ))}
    </div>
  </SectionCard>
);

// ─── SECTION 11: ALT DATA SPEND & COMPETITIVE MOAT ───
const altDataPostings = [
  { q: "Q1'24", count: 3 }, { q: "Q2'24", count: 2 }, { q: "Q3'24", count: 1 }, { q: "Q4'24", count: 1 },
  { q: "Q1'25", count: 0 }, { q: "Q2'25", count: 0 }, { q: "Q3'25", count: 1 }, { q: "Q4'25", count: 1 }, { q: "Q1'26", count: 1 },
];

const Section11 = () => (
  <SectionCard title="Alternative Data Infrastructure & Competitive Moat Analysis" icon={Database} borderColor="#7C3AED">
    <div className="flex flex-wrap gap-3 mb-5">
      <StatChip label="Alt Data Job Postings Detected" value="2" color="#EF4444" badge="Below peer avg of 8" />
      <StatChip label="Data Vendor Relationships Detected" value="3" color="#F59E0B" />
      <StatChip label="Quant/Tech Hiring Ratio" value="8% of headcount" color="#EF4444" />
      <StatChip label="Moat Score vs Peers" value="28/100" color="#EF4444" />
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      <div>
        <h4 className="text-xs font-bold text-foreground uppercase tracking-wider mb-3">Data Infrastructure Job Posting History</h4>
        <ResponsiveContainer width="100%" height={120}>
          <BarChart data={altDataPostings}>
            <XAxis dataKey="q" tick={{ fill: "#8B949E", fontSize: 8 }} />
            <YAxis tick={{ fill: "#8B949E", fontSize: 8 }} domain={[0, 10]} />
            <Tooltip contentStyle={{ background: "#161B22", border: "1px solid #30363D", fontSize: 10 }} />
            <Bar dataKey="count" radius={[2, 2, 0, 0]}>
              {altDataPostings.map((d, i) => <Cell key={i} fill={d.count === 0 ? "#EF4444" : d.count <= 1 ? "#F59E0B" : "#C9A84C"} />)}
            </Bar>
            <ReferenceLine y={7} stroke="#22C55E" strokeDasharray="5 5" label={{ value: "Peer Median", fill: "#22C55E", fontSize: 8, position: "top" }} />
          </BarChart>
        </ResponsiveContainer>
        <div className="mt-3 space-y-1.5 text-[11px]">
          <p className="text-[10px] font-bold text-foreground uppercase tracking-wider mb-2">Role Categories Detected (Last 12m)</p>
          {[
            ["Credit Data Analyst", "2 postings", "#F59E0B", "— vanilla"],
            ["Data Engineer", "0", "#EF4444", "— none detected"],
            ["Alternative Data Researcher", "0", "#EF4444", "— none detected"],
            ["Quantitative Researcher", "0", "#EF4444", "— none detected"],
          ].map(([role, count, color, note]) => (
            <p key={role} className="text-[#CBD5E1]">• {role}: <span style={{ color }} className="font-bold">{count}</span> <span className="text-[#8B949E]">{note}</span></p>
          ))}
          <p className="text-[10px] text-[#8B949E] italic mt-2">
            Vs. peer Ironwood Systematic: Data Engineer (12), Alt Data Researcher (8), ML Engineer (6), Quant Researcher (11)
          </p>
        </div>
      </div>
      <div>
        <h4 className="text-xs font-bold text-foreground uppercase tracking-wider mb-3">Detected Data Vendor Relationships</h4>
        <div className="space-y-3">
          {[
            { vendor: "Bloomberg Terminal", status: "CONFIRMED ✓", color: "#22C55E", evidence: "Job postings require Bloomberg proficiency.", classification: "Table stakes — not a moat." },
            { vendor: "Refinitiv/LSEG Eikon", status: "LIKELY", color: "#F59E0B", evidence: "LinkedIn skills mentions on 3 current staff.", classification: "Table stakes." },
            { vendor: "FactSet", status: "POSSIBLE", color: "#8B949E", evidence: "Conference attendee list cross-reference.", classification: "Table stakes." },
          ].map((v, i) => (
            <div key={i} className="bg-[#0D1117] border border-[#30363D] rounded-lg p-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-foreground">{v.vendor}</span>
                <span className="text-[9px] font-bold" style={{ color: v.color }}>{v.status}</span>
              </div>
              <p className="text-[10px] text-[#8B949E] mt-1">Evidence: {v.evidence}</p>
              <p className="text-[10px] text-[#CBD5E1] italic">{v.classification}</p>
            </div>
          ))}
        </div>
        <p className="text-[10px] text-[#8B949E] italic mt-3">
          No evidence detected for: Orbital Insight, Placer.ai, Quandl/Nasdaq Data Link, M Science, Earnest Research, Second Measure, Eagle Alpha, or any satellite/geospatial vendor.
        </p>
      </div>
    </div>
    <div className="mt-4 bg-[#7C3AED]/10 border border-[#7C3AED]/30 rounded-lg p-3 text-[11px] text-[#CBD5E1] leading-relaxed">
      <span className="text-[#7C3AED] font-bold">Moat Assessment: </span>
      Helix Credit's data infrastructure appears limited to institutional-standard terminal access. No evidence of proprietary data sourcing, alternative data vendor relationships, or quantitative research capability. For a distressed credit manager this is partially acceptable given the fundamental/legal nature of the work, but the absence of any data engineering capability limits scalability and is below the median for $1B+ managers.
    </div>
  </SectionCard>
);

// ─── SECTION 12: REDEMPTION QUEUE ESTIMATION ───
const redemptionScenarioData = [
  { q: "Q2'26", bear: 2.3, base: 2.3, bull: 2.3 },
  { q: "Q3'26", bear: 1.9, base: 2.1, bull: 2.2 },
  { q: "Q4'26", bear: 1.6, base: 1.8, bull: 2.1 },
  { q: "Q1'27", bear: 1.3, base: 1.6, bull: 2.0 },
  { q: "Q2'27", bear: 1.1, base: 1.5, bull: 2.0 },
  { q: "Q3'27", bear: 0.9, base: 1.4, bull: 2.0 },
  { q: "Q4'27", bear: 0.7, base: 1.3, bull: 2.1 },
];

const Section12 = () => (
  <SectionCard title="Probabilistic Redemption Queue Model" icon={Filter} borderColor="#DC2626">
    <div className="flex flex-wrap gap-3 mb-5">
      <StatChip label="Redemption Probability Score" value="74/100" color="#EF4444" badge="HIGH" pulse />
      <StatChip label="Estimated Net Outflow (12m)" value="$380-620M" color="#EF4444" />
      <StatChip label="Signals Firing" value="7 of 9" color="#EF4444" />
      <StatChip label="Model Confidence" value="High (82%)" />
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      <div>
        <h4 className="text-xs font-bold text-foreground uppercase tracking-wider mb-3">Signal Ensemble Scorecard</h4>
        <div className="space-y-2">
          {[
            [true, "ADV AUM Declining", "confirmed — down $500M", "HIGH"],
            [true, "13F Gross Exposure Declining", "confirmed — down 45%", "HIGH"],
            [true, "Senior Operations/IR Staff Departed", "confirmed — 3 departures", "HIGH"],
            [true, "PB Downgrade Detected", "confirmed — GS to DB", "HIGH"],
            [true, "Social Redemption Narrative Forming", "confirmed — Reddit/Twitter", "MEDIUM"],
            [true, "Fee Concession Made", "confirmed — mgmt fee cut 25bps", "MEDIUM"],
            [true, "New Fund Formation During Flagship Stress", "confirmed — Helix Fund IV", "MEDIUM"],
            [false, "Form D Fundraising Success", "NOT confirmed (Fund IV only $42M of $500M)", ""],
            [false, "GP Co-Investment Increase", "NOT detected (no evidence)", ""],
          ].map(([active, label, detail, weight], i) => (
            <div key={i} className="flex items-start gap-2 text-[11px]">
              <span className={active ? "text-[#22C55E]" : "text-[#EF4444]"}>{active ? "✅" : "❌"}</span>
              <div className="flex-1">
                <span className="text-[#CBD5E1] font-medium">{label as string}</span>
                <span className="text-[#8B949E] ml-1">({detail as string})</span>
                {weight && <span className="text-[10px] text-[#C9A84C] ml-1">— Weight: {weight as string}</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div>
        <h4 className="text-xs font-bold text-foreground uppercase tracking-wider mb-3">Outflow Range Estimate</h4>
        <ResponsiveContainer width="100%" height={200}>
          <ComposedChart data={redemptionScenarioData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#30363D" />
            <XAxis dataKey="q" tick={{ fill: "#8B949E", fontSize: 9 }} />
            <YAxis tick={{ fill: "#8B949E", fontSize: 9 }} domain={[0, 3]} unit="B" />
            <Tooltip contentStyle={{ background: "#161B22", border: "1px solid #30363D", fontSize: 10 }} formatter={(v: number) => `$${v}B`} />
            <Area type="monotone" dataKey="bull" stroke="transparent" fill="#EF4444" fillOpacity={0.08} />
            <Area type="monotone" dataKey="bear" stroke="transparent" fill="transparent" />
            <Line type="monotone" dataKey="bear" stroke="#EF4444" strokeWidth={2} dot={{ r: 2 }} name="Bear" />
            <Line type="monotone" dataKey="base" stroke="#F59E0B" strokeWidth={2} dot={{ r: 2 }} name="Base" />
            <Line type="monotone" dataKey="bull" stroke="#22C55E" strokeWidth={2} dot={{ r: 2 }} name="Bull" />
          </ComposedChart>
        </ResponsiveContainer>
        <div className="flex gap-4 mt-1 mb-2">
          {[["Bear", "#EF4444"], ["Base", "#F59E0B"], ["Bull", "#22C55E"]].map(([l, c]) => (
            <span key={l} className="text-[9px] flex items-center gap-1"><span className="w-2 h-2 rounded-full" style={{ backgroundColor: c }} />{l}</span>
          ))}
        </div>
      </div>
    </div>
    <div className="mt-4 bg-[#EF4444]/10 border border-[#EF4444]/30 rounded-lg p-3 text-[11px] text-[#EF4444] font-medium leading-relaxed">
      At bear-case AUM of $700M, fixed cost base becomes uneconomical for a 12-person firm. Historical precedent suggests wind-down announcement typically follows AUM breach of approximately 60-65% of peak. Peak was $3.8B — breach level: ~$2.3-2.5B. Already at threshold.
    </div>
  </SectionCard>
);

// ─── SECTION 13: BOARD & ADVISORY INTERLOCKS ───
const Section13 = () => (
  <SectionCard title="Board, Advisory & Relationship Network Intelligence" icon={Network} borderColor="#4F46E5">
    <div className="flex flex-wrap gap-3 mb-5">
      <StatChip label="Board Seats Detected (Key Personnel)" value="4" />
      <StatChip label="Advisory Overlaps with Portfolio Peers" value="3" color="#F59E0B" />
      <StatChip label="Nonprofit Affiliations Mapped" value="6" />
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      <div>
        <h4 className="text-xs font-bold text-foreground uppercase tracking-wider mb-3">Robert Vance — Board & Advisory Positions</h4>
        <div className="space-y-1 mb-3">
          <p className="text-[10px] font-bold text-[#C9A84C] uppercase tracking-wider">Corporate</p>
          <div className="bg-[#0D1117] border border-[#30363D] rounded-lg p-3 space-y-2">
            <div>
              <p className="text-[11px] text-foreground font-bold">Redwood Holdings LLC — Board Observer</p>
              <p className="text-[10px] text-[#8B949E]">(Helix portfolio company — disclosed in ADV Jan 2026)</p>
              <p className="text-[10px] text-[#F59E0B]">⚠ Conflict of interest disclosed. Monitor for valuation independence.</p>
            </div>
            <div>
              <p className="text-[11px] text-foreground font-bold">Meridian Data Services Inc. — Advisory Board</p>
              <p className="text-[10px] text-[#8B949E]">(Private fintech, Series B stage)</p>
              <p className="text-[10px] text-[#3B82F6]">ℹ No disclosed conflict. Potential co-investment pipeline.</p>
            </div>
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-[10px] font-bold text-[#C9A84C] uppercase tracking-wider">Nonprofit (IRS Form 990)</p>
          <div className="bg-[#0D1117] border border-[#30363D] rounded-lg p-3 space-y-2 text-[11px]">
            {[
              { name: "Greenwich Academy — Board of Trustees", note: "Cross-references with Greenwich property record. Social network signal." },
              { name: "LSTA (Loan Syndications & Trading Association) — Board Member", note: "Industry standard for distressed PM. Network value: high. Conflict risk: low." },
              { name: "Robin Hood Foundation — Donor/Advisory", note: "Common among NYC hedge fund PMs. Useful for LP network cross-reference." },
            ].map((n, i) => (
              <div key={i}>
                <p className="text-foreground font-bold">{n.name}</p>
                <p className="text-[10px] text-[#8B949E]">ℹ {n.note}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div>
        <h4 className="text-xs font-bold text-foreground uppercase tracking-wider mb-3">Manager Network Overlap Map</h4>
        <div className="space-y-3">
          {[
            { pair: "Helix ↔ Arcturus Capital", overlaps: ["Shared advisor: ACA Group (compliance)", "Shared conference: AIMA Annual 2025"], strength: "LOW", color: "#22C55E" },
            { pair: "Helix ↔ Northgate Event Driven", overlaps: ["Shared nonprofit: Robin Hood Foundation donor list", "Shared legal counsel: Kleinberg Kaplan (partial overlap)"], strength: "MEDIUM", color: "#F59E0B" },
            { pair: "Helix ↔ Granite Point Capital", overlaps: ["Both managers in distressed credit", "Shared prime broker: Deutsche Bank (as of Q1 2026)", "Shared auditor tier: Non-Big 4"], strength: "HIGH", color: "#EF4444" },
          ].map((r, i) => (
            <div key={i} className="bg-[#0D1117] border border-[#30363D] rounded-lg p-3" style={{ borderLeftWidth: 2, borderLeftColor: r.color }}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-bold text-foreground">{r.pair}</span>
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: `${r.color}20`, color: r.color }}>
                  {r.strength}
                </span>
              </div>
              <ul className="space-y-0.5">
                {r.overlaps.map((o, j) => (
                  <li key={j} className="text-[10px] text-[#CBD5E1]">• {o}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="text-[10px] text-[#8B949E] italic mt-2">
          Potential co-investment history detected between Helix and Granite Point based on distressed credit overlap and shared PB.
        </p>
      </div>
    </div>
    <p className="text-[10px] text-[#8B949E] italic mt-4">
      Board and advisory data sourced from IRS Form 990 filings (nonprofit boards), SEC DEF 14A proxy statements (public company boards), ADV Part 2 disclosures (conflicts), and website advisory page scraping. Updated quarterly. Relationship strength scored by number of overlapping data points across sources.
    </p>
  </SectionCard>
);

// ─── EXPORT ALL SECTIONS ───
const IntelligenceSections6to13 = () => (
  <>
    <Section6 />
    <Section7 />
    <Section8 />
    <Section9 />
    <Section10 />
    <Section11 />
    <Section12 />
    <Section13 />
  </>
);

export default IntelligenceSections6to13;
