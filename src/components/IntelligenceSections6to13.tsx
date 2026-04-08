import { Shuffle, UserSearch, Search, Percent, Lightbulb, Database, Filter, Network } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid, Cell, ComposedChart, Area, ReferenceLine } from "recharts";

// ─── REUSABLE HELPERS ───
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

const SignalsUsedFooter = ({ sources }: { sources: string }) => (
  <div className="mt-4 pt-3 border-t border-[#30363D]/50 flex items-center justify-between">
    <span className="text-[9px] text-[#8B949E]">Based on: {sources}</span>
    <span className="text-[9px] text-[#3B82F6] font-medium cursor-pointer hover:underline">↗ View raw signals</span>
  </div>
);

// ─── SECTION 6: PRIME BROKER MUSICAL CHAIRS ───
const pbExposureData = [
  { q: "Q1'23", gross: 3.8, pbs: 1 }, { q: "Q2'23", gross: 3.7, pbs: 1 }, { q: "Q3'23", gross: 3.6, pbs: 1 },
  { q: "Q4'23", gross: 3.5, pbs: 1 }, { q: "Q1'24", gross: 3.1, pbs: 1 }, { q: "Q2'24", gross: 2.8, pbs: 1 },
  { q: "Q3'24", gross: 2.6, pbs: 1 }, { q: "Q4'24", gross: 2.4, pbs: 1 }, { q: "Q1'26", gross: 2.1, pbs: 2 },
];

const Section6 = () => (
  <SectionCard title="Prime Broker & Counterparty Risk Assessment" icon={Shuffle} borderColor="#F97316">
    <div className="flex flex-wrap gap-3 mb-5">
      <StatChip label="PB Changes (36m)" value="2" color="#EF4444" />
      <StatChip label="Current PB Tier" value="Tier 2" color="#EF4444" badge="ELEVATED RISK" />
      <StatChip label="Simultaneous 13F De-grossing" value="Detected" color="#EF4444" badge="CONFIRMED" />
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      <div>
        <h4 className="text-xs font-bold text-foreground uppercase tracking-wider mb-3">Counterparty Risk Analysis</h4>
        <p className="text-[11px] text-[#CBD5E1] leading-relaxed mb-3">
          Helix's departure from Goldman Sachs Prime Brokerage after an 8-year relationship and transition to Deutsche Bank (Tier 2) is one of the most significant operational risk signals in this assessment. In our dataset, involuntary PB departures from Tier 1 firms precede material AUM declines in 84% of cases.
        </p>
        <p className="text-[11px] text-[#CBD5E1] leading-relaxed mb-3">
          The subsequent addition of Jefferies as a secondary PB mid-cycle further supports the thesis that Helix is managing through margin pressure. Two Tier 2 PBs provide less financing capacity and carry higher counterparty risk than a single Tier 1 relationship.
        </p>
        <p className="text-[11px] text-[#CBD5E1] leading-relaxed mb-3">
          De-grossing of $1.7B (45%) coincides precisely with the PB transition window, consistent with forced margin reduction rather than voluntary portfolio management. Peer comparison: distressed managers with Tier 1 PBs maintained or increased gross exposure over the same period.
        </p>
        <div className="rounded-lg p-3 bg-[#EF4444]/10 border-l-2 border-[#EF4444]">
          <p className="text-[10px] font-bold text-[#EF4444]">VERDICT: FORCED DE-GROSSING</p>
          <p className="text-[10px] text-[#CBD5E1] mt-1">PB change pattern strongly suggests involuntary margin reduction. Review Deutsche Bank counterparty exposure across entire portfolio.</p>
        </div>
      </div>
      <div>
        <h4 className="text-xs font-bold text-foreground uppercase tracking-wider mb-3">Gross Exposure vs PB Transition</h4>
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
        <div className="mt-3">
          <h4 className="text-[10px] font-bold text-foreground uppercase tracking-wider mb-2">PB Tier Classification</h4>
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
      </div>
    </div>
    <SignalsUsedFooter sources="5x 13F Filings | 2x Form ADV | 1x LinkedIn" />
  </SectionCard>
);

// ─── SECTION 7: FOUNDER LIFE EVENT DETECTION ───
const Section7 = () => (
  <SectionCard title="Principal Life Event & Key Person Risk" icon={UserSearch} borderColor="#EC4899">
    <div className="flex flex-wrap gap-3 mb-5">
      <StatChip label="Public Records Scanned" value="847 (last 90 days)" />
      <StatChip label="Life Events Detected" value="3" color="#EF4444" />
      <StatChip label="New Entity Formations" value="1" color="#F59E0B" />
      <StatChip label="Key Person Risk Level" value="HIGH" color="#EF4444" badge="CRITICAL" pulse />
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      <div>
        <h4 className="text-xs font-bold text-foreground uppercase tracking-wider mb-3">Life Event Risk Assessment</h4>
        <p className="text-[11px] text-[#CBD5E1] leading-relaxed mb-3">
          Three significant life events have been detected for Robert Vance in the past 6 months, forming a pattern that warrants close monitoring. A property transfer to a family irrevocable trust, a new LLC formation (Vance Capital Advisors), and LinkedIn profile changes removing the Helix brand — individually these could be routine, but in combination they create a risk constellation.
        </p>
        <p className="text-[11px] text-[#CBD5E1] leading-relaxed mb-3">
          The formation of Vance Capital Advisors LLC as an "investment advisory and consulting" entity during a period of flagship fund stress is the most actionable signal. In our historical dataset, 61% of new entity formations by fund principals during stress periods preceded a fund wind-down or succession event within 18 months.
        </p>
        <p className="text-[11px] text-[#CBD5E1] leading-relaxed mb-3">
          The LinkedIn headline change from explicit Helix branding to generic "Investor | Credit & Special Situations" language is a classic disassociation signal. Our analysis of 147 fund wind-downs shows this pattern appearing 3-9 months before formal announcements in 58% of cases.
        </p>
        <div className="rounded-lg p-3 bg-[#EF4444]/10 border-l-2 border-[#EF4444]">
          <p className="text-[10px] font-bold text-[#EF4444]">VERDICT: ELEVATED KEY PERSON RISK</p>
          <p className="text-[10px] text-[#CBD5E1] mt-1">Life event constellation suggests possible succession planning or wind-down preparation. Monitor Vance Capital Advisors for ADV filing. Request direct confirmation of Vance's commitment to Helix.</p>
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
            Robert Vance is the sole named investment decision-maker across all fund documents, ADV filings, and public materials. No named co-PM, deputy, or successor has been identified. This creates an unacceptably high concentration of key person risk, particularly given the life event signals detected.
          </p>
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <p className="text-[#8B949E]">Succession Plan: <span className="text-[#EF4444] font-bold">NONE DETECTED</span></p>
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
    <SignalsUsedFooter sources="2x Property Records | 1x State SOS Filing | 3x LinkedIn | 2x Form ADV" />
  </SectionCard>
);

// ─── SECTION 8: REGULATORY COMMENT LETTER MINING ───
const Section8 = () => (
  <SectionCard title="SEC Comment Letter Risk Assessment" icon={Search} borderColor="#EAB308">
    <div className="flex flex-wrap gap-3 mb-5">
      <StatChip label="Holdings Monitored via EDGAR" value="12" />
      <StatChip label="Active Comment Letters Detected" value="3" color="#F59E0B" />
      <StatChip label="Restatement Risk Flags" value="1" color="#EF4444" />
    </div>
    <div className="space-y-4">
      <div className="bg-[#0D1117] border border-[#30363D] rounded-lg p-4" style={{ borderLeftWidth: 2, borderLeftColor: "#F59E0B" }}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-foreground">NVIDIA Corporation (NVDA)</span>
          <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#F59E0B]/20 text-[#F59E0B]">Risk: MEDIUM</span>
        </div>
        <p className="text-[11px] text-[#CBD5E1] leading-relaxed mb-2">
          SEC staff scrutinized NVDA's revenue recognition timing on multi-element data center arrangements, questioning whether software licensing was being front-loaded rather than recognized ratably. While no restatement was required, the inquiry resulted in additional footnote disclosure. For Helix's $5.4B notional NVDA exposure across the portfolio, this introduces a latent accounting risk — future quarters may face enhanced scrutiny on the same methodology.
        </p>
        <p className="text-[10px] text-[#F59E0B] italic">Assessment: No immediate action, but monitor subsequent quarterly filings for consistency with new disclosure commitments.</p>
      </div>
      <div className="bg-[#0D1117] border border-[#30363D] rounded-lg p-4" style={{ borderLeftWidth: 2, borderLeftColor: "#F59E0B" }}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-foreground">UnitedHealth Group (UNH)</span>
          <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#F59E0B]/20 text-[#F59E0B]">Risk: WATCH</span>
        </div>
        <p className="text-[11px] text-[#CBD5E1] leading-relaxed mb-2">
          An open SEC informal inquiry into UNH's non-GAAP adjusted EPS reconciliation and related-party transactions between UnitedHealth and Optum is the most concerning finding. Combined with UNH's declining patent filing velocity (-43% over 8 quarters), this creates a convergent negative signal. Open inquiries can escalate to formal investigations, and the non-GAAP accounting area has been an SEC enforcement priority.
        </p>
        <p className="text-[10px] text-[#F59E0B] italic">Assessment: Elevated watch status. Cross-reference with patent velocity decline for holistic risk view. Flag for GP discussion if inquiry is not resolved within 90 days.</p>
      </div>
      <div className="bg-[#0D1117] border border-[#30363D] rounded-lg p-4" style={{ borderLeftWidth: 2, borderLeftColor: "#22C55E" }}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-foreground">JPMorgan Chase (JPM)</span>
          <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#22C55E]/20 text-[#22C55E]">Risk: LOW</span>
        </div>
        <p className="text-[11px] text-[#CBD5E1] leading-relaxed">
          Routine 10-K review with no substantive issues identified. JPM responded with expanded CECL methodology disclosure. No action required.
        </p>
      </div>
    </div>
    <p className="text-[10px] text-[#8B949E] italic mt-4">
      AltBots systematically parses SEC comment letters from EDGAR for all holdings above 2% portfolio weight. This data is publicly available but analyzed by fewer than 5% of institutional allocators.
    </p>
    <SignalsUsedFooter sources="3x EDGAR CORRESP | 14x SEC EDGAR" />
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
  <SectionCard title="Fee Drag & Economics Assessment" icon={Percent} borderColor="#84CC16">
    <div className="flex flex-wrap gap-3 mb-5">
      <StatChip label="Stated Management Fee" value="1.25% (down from 1.5%)" />
      <StatChip label="Effective All-In Fee Drag" value="3.41%" color="#EF4444" badge="Above peer avg" />
      <StatChip label="Peer Composite Avg" value="2.38%" color="#22C55E" />
      <StatChip label="Excess Fee Drag" value="+103 bps" color="#EF4444" />
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      <div>
        <h4 className="text-xs font-bold text-foreground uppercase tracking-wider mb-3">Fee Impact Analysis</h4>
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
        <p className="text-[11px] text-[#CBD5E1] leading-relaxed mt-3">
          Helix's effective all-in fee drag of 3.41% exceeds the distressed credit peer composite by 103 basis points. The largest driver of excess cost is the prime brokerage financing spread (+0.44%), which reflects the premium associated with Tier 2 PB relationships. This is a direct and measurable cost of the Goldman Sachs departure.
        </p>
        <p className="text-[10px] text-[#F59E0B] mt-2 font-medium">
          For every $100M invested, Helix's excess fee drag costs approximately $1.03M/year vs. the peer group. Over a 3-year commitment, this compounds to $3.1M in fee disadvantage.
        </p>
      </div>
      <div>
        <h4 className="text-xs font-bold text-foreground uppercase tracking-wider mb-3">LPA Terms Risk Assessment</h4>
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
          Critical LPA gap: Key Man clause does not force wind-down on departure. Investors receive notification only — no automatic redemption right is triggered. This is below market standard for single-PM funds and should be renegotiated at the next side letter opportunity.
        </div>
      </div>
    </div>
    <SignalsUsedFooter sources="4x Form ADV | 1x Form D | 2x 13F Filings" />
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
  <SectionCard title="R&D Momentum & Innovation Assessment" icon={Lightbulb} borderColor="#22D3EE">
    <div className="flex flex-wrap gap-3 mb-5">
      <StatChip label="Holdings Monitored" value="12" />
      <StatChip label="IP Deceleration Flags" value="2" color="#F59E0B" />
      <StatChip label="Sector-Leading Filers" value="3" color="#22C55E" />
    </div>
    <h4 className="text-xs font-bold text-foreground uppercase tracking-wider mb-3">Patent Filing Velocity — Innovation Indicator</h4>
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
        { ticker: "NVDA", verdict: "STRONG R&D MOMENTUM ✓", color: "#22C55E", text: "Patent velocity up 48% over 8 quarters, concentrated in GPU architecture and transformer inference optimization. This is the strongest innovation signal in the portfolio and supports the long-term bull case, though it does not mitigate the near-term insider selling divergence." },
        { ticker: "AAPL", verdict: "PLATEAUING — MONITOR ⚠", color: "#F59E0B", text: "Patent filings have flattened after years of consistent growth. Core hardware IP is declining while AR/VR filings partially offset. This is not alarming for a mature platform company but reduces the margin of safety on growth assumptions." },
        { ticker: "META", verdict: "R&D REALLOCATION ⚠", color: "#F59E0B", text: "8% filing decline driven by Metaverse/VR pullback, partially offset by AI infrastructure filings. The shift reflects a strategic pivot that appears rational but introduces execution risk during the transition period." },
        { ticker: "UNH", verdict: "DECLINING — FLAG 🔴", color: "#EF4444", text: "43% decline in patent filing rate is the most concerning innovation signal. Combined with the open SEC inquiry on non-GAAP metrics, this creates a convergent negative thesis: declining innovation investment alongside regulatory scrutiny. Recommend reducing position-level conviction." },
      ].map((f, i) => (
        <div key={i} className="rounded-lg p-3" style={{ backgroundColor: `${f.color}10`, borderLeft: `2px solid ${f.color}` }}>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-foreground">{f.ticker}</span>
            <span className="text-[10px] font-bold" style={{ color: f.color }}>{f.verdict}</span>
          </div>
          <p className="text-[11px] text-[#CBD5E1] leading-relaxed">{f.text}</p>
        </div>
      ))}
    </div>
    <SignalsUsedFooter sources="4x USPTO Patent Data | 8 quarters of filing velocity" />
  </SectionCard>
);

// ─── SECTION 11: ALT DATA SPEND & COMPETITIVE MOAT ───
const altDataPostings = [
  { q: "Q1'24", count: 3 }, { q: "Q2'24", count: 2 }, { q: "Q3'24", count: 1 }, { q: "Q4'24", count: 1 },
  { q: "Q1'25", count: 0 }, { q: "Q2'25", count: 0 }, { q: "Q3'25", count: 1 }, { q: "Q4'25", count: 1 }, { q: "Q1'26", count: 1 },
];

const Section11 = () => (
  <SectionCard title="Competitive Moat & Data Infrastructure Assessment" icon={Database} borderColor="#7C3AED">
    <div className="flex flex-wrap gap-3 mb-5">
      <StatChip label="Alt Data Job Postings Detected" value="2" color="#EF4444" badge="Below peer avg of 8" />
      <StatChip label="Data Vendor Relationships Detected" value="3" color="#F59E0B" />
      <StatChip label="Quant/Tech Hiring Ratio" value="8% of headcount" color="#EF4444" />
      <StatChip label="Moat Score vs Peers" value="28/100" color="#EF4444" />
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      <div>
        <h4 className="text-xs font-bold text-foreground uppercase tracking-wider mb-3">Data Capability Assessment</h4>
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
        <p className="text-[11px] text-[#CBD5E1] leading-relaxed mt-3">
          Helix's data infrastructure appears limited to institutional-standard terminal access (Bloomberg, Refinitiv, FactSet). No evidence of proprietary data sourcing, alternative data vendor relationships, or quantitative research capability. Zero data engineering or ML hires detected in 12 months, compared to peer Ironwood Systematic which has made 37 technical hires in the same period.
        </p>
        <p className="text-[11px] text-[#CBD5E1] leading-relaxed mt-2">
          For a distressed credit manager, this is partially defensible given the fundamental/legal nature of the work. However, the absence of any data engineering capability limits scalability and puts Helix at a structural disadvantage in sourcing and analyzing opportunities.
        </p>
      </div>
      <div>
        <h4 className="text-xs font-bold text-foreground uppercase tracking-wider mb-3">Moat Verdict</h4>
        <div className="bg-[#7C3AED]/10 border border-[#7C3AED]/30 rounded-lg p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-14 h-14 rounded-full border-2 border-[#EF4444] flex items-center justify-center bg-[#161B22]">
              <span className="text-lg font-bold text-[#EF4444]">28</span>
            </div>
            <div>
              <p className="text-xs font-bold text-[#EF4444]">Moat Score: 28/100</p>
              <p className="text-[10px] text-[#8B949E]">Below peer median — limited competitive advantage</p>
            </div>
          </div>
          <p className="text-[11px] text-[#CBD5E1] leading-relaxed">
            Helix's competitive moat rests almost entirely on Robert Vance's personal relationships and experience — a fragile moat given the single-PM dependency. No proprietary data, technology, or process differentiation has been detected. This means the fund's value proposition is entirely concentrated in one individual, amplifying key person risk.
          </p>
          <p className="text-[10px] text-[#F59E0B] mt-2 font-medium">
            Recommendation: During GP call, probe for any proprietary sourcing advantages or technology investments not visible through public signals.
          </p>
        </div>
      </div>
    </div>
    <SignalsUsedFooter sources="8x LinkedIn Job Postings | 3x LinkedIn Skills | 1x Conference Cross-Ref" />
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
  <SectionCard title="Probabilistic Redemption Forecast" icon={Filter} borderColor="#DC2626">
    <div className="flex flex-wrap gap-3 mb-5">
      <StatChip label="Redemption Probability Score" value="74/100" color="#EF4444" badge="HIGH" pulse />
      <StatChip label="Estimated Net Outflow (12m)" value="$380-620M" color="#EF4444" />
      <StatChip label="Signals Firing" value="7 of 9" color="#EF4444" />
      <StatChip label="Model Confidence" value="High (82%)" />
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      <div>
        <h4 className="text-xs font-bold text-foreground uppercase tracking-wider mb-3">Redemption Signal Ensemble</h4>
        <p className="text-[11px] text-[#CBD5E1] leading-relaxed mb-3">
          Seven of nine redemption prediction signals are currently firing, producing a composite probability score of 74/100. The four highest-weight signals — AUM decline, de-grossing, senior departures, and PB downgrade — are all confirmed, creating an unusually strong convergent signal.
        </p>
        <div className="space-y-2 mb-3">
          {[
            [true, "ADV AUM Declining", "HIGH"],
            [true, "13F Gross Exposure Declining", "HIGH"],
            [true, "Senior Operations/IR Staff Departed", "HIGH"],
            [true, "PB Downgrade Detected", "HIGH"],
            [true, "Social Redemption Narrative Forming", "MEDIUM"],
            [true, "Fee Concession Made", "MEDIUM"],
            [true, "New Fund Formation During Flagship Stress", "MEDIUM"],
            [false, "Form D Fundraising Success", ""],
            [false, "GP Co-Investment Increase", ""],
          ].map(([active, label, weight], i) => (
            <div key={i} className="flex items-start gap-2 text-[11px]">
              <span className={active ? "text-[#22C55E]" : "text-[#EF4444]"}>{active ? "✅" : "❌"}</span>
              <span className="text-[#CBD5E1]">{label as string}</span>
              {weight && <span className="text-[10px] text-[#C9A84C] ml-auto">Weight: {weight as string}</span>}
            </div>
          ))}
        </div>
        <p className="text-[10px] text-[#8B949E] italic">
          The two unfiring signals (fundraising success and GP co-investment) would typically provide stabilizing counterweight. Their absence reinforces the bearish thesis.
        </p>
      </div>
      <div>
        <h4 className="text-xs font-bold text-foreground uppercase tracking-wider mb-3">AUM Trajectory Forecast</h4>
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
        <div className="flex gap-4 mt-1 mb-3">
          {[["Bear", "#EF4444"], ["Base", "#F59E0B"], ["Bull", "#22C55E"]].map(([l, c]) => (
            <span key={l} className="text-[9px] flex items-center gap-1"><span className="w-2 h-2 rounded-full" style={{ backgroundColor: c }} />{l}</span>
          ))}
        </div>
        <p className="text-[11px] text-[#CBD5E1] leading-relaxed">
          Under the bear case, AUM declines to $700M by Q4 2027 — below the economic viability threshold for a 12-person firm. Historical precedent shows wind-down announcements typically follow when AUM breaches 60-65% of peak. With a peak of $3.8B, the breach level is ~$2.3-2.5B — Helix is already at this threshold.
        </p>
      </div>
    </div>
    <div className="mt-4 bg-[#EF4444]/10 border border-[#EF4444]/30 rounded-lg p-3 text-[11px] text-[#EF4444] font-medium leading-relaxed">
      Forecast: Base case projects continued outflows of $380-620M over 12 months. Bear case projects potential fund viability crisis by late 2027. Immediate actions: confirm LP commitments, review gate provisions, prepare contingency liquidity plan.
    </div>
    <SignalsUsedFooter sources="6x Form ADV | 5x 13F Filings | 7x Social Media | 8x LinkedIn" />
  </SectionCard>
);

// ─── SECTION 13: BOARD & ADVISORY INTERLOCKS ───
const Section13 = () => (
  <SectionCard title="Relationship Network & Conflict Assessment" icon={Network} borderColor="#4F46E5">
    <div className="flex flex-wrap gap-3 mb-5">
      <StatChip label="Board Seats Detected (Key Personnel)" value="4" />
      <StatChip label="Advisory Overlaps with Portfolio Peers" value="3" color="#F59E0B" />
      <StatChip label="Nonprofit Affiliations Mapped" value="6" />
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      <div>
        <h4 className="text-xs font-bold text-foreground uppercase tracking-wider mb-3">Conflict & Network Assessment</h4>
        <p className="text-[11px] text-[#CBD5E1] leading-relaxed mb-3">
          Robert Vance holds a Board Observer seat at Redwood Holdings LLC, a Helix portfolio company. This was disclosed in the January 2026 ADV amendment but raises valuation independence concerns — particularly for a distressed credit fund where asset-level valuations are inherently subjective and may lack independent pricing sources.
        </p>
        <p className="text-[11px] text-[#CBD5E1] leading-relaxed mb-3">
          Vance's advisory board seat at Meridian Data Services (private fintech, Series B) represents a potential co-investment pipeline. While no conflict is currently disclosed, this relationship should be monitored for future ADV amendments.
        </p>
        <p className="text-[11px] text-[#CBD5E1] leading-relaxed mb-3">
          Nonprofit affiliations (Greenwich Academy, LSTA, Robin Hood Foundation) provide useful social network intelligence but do not present conflict risks. The LSTA board membership is appropriate and expected for a distressed credit PM.
        </p>
        <div className="rounded-lg p-3 bg-[#F59E0B]/10 border-l-2 border-[#F59E0B]">
          <p className="text-[10px] font-bold text-[#F59E0B]">KEY CONCERN: REDWOOD HOLDINGS</p>
          <p className="text-[10px] text-[#CBD5E1] mt-1">Request independent third-party valuation of Redwood Holdings. GP board observer status creates inherent conflict on marks. Verify that fund administrator (SS&C) maintains independent NAV oversight.</p>
        </div>
      </div>
      <div>
        <h4 className="text-xs font-bold text-foreground uppercase tracking-wider mb-3">Portfolio Manager Network Overlaps</h4>
        <div className="space-y-3">
          {[
            { pair: "Helix ↔ Arcturus Capital", assessment: "Low overlap — shared compliance consultant (ACA Group) and conference attendance. No material conflict or coordination risk.", strength: "LOW", color: "#22C55E" },
            { pair: "Helix ↔ Northgate Event Driven", assessment: "Medium overlap — shared Robin Hood Foundation donor network and partial legal counsel overlap. Social relationship could influence co-investment decisions. Monitor for undisclosed co-investments.", strength: "MEDIUM", color: "#F59E0B" },
            { pair: "Helix ↔ Granite Point Capital", assessment: "High overlap — both distressed credit managers sharing Deutsche Bank as PB and non-Big 4 auditor tier. Potential co-investment history in distressed credit situations. This overlap creates concentrated counterparty risk if DB experiences stress.", strength: "HIGH", color: "#EF4444" },
          ].map((r, i) => (
            <div key={i} className="bg-[#0D1117] border border-[#30363D] rounded-lg p-3" style={{ borderLeftWidth: 2, borderLeftColor: r.color }}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-bold text-foreground">{r.pair}</span>
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: `${r.color}20`, color: r.color }}>
                  {r.strength}
                </span>
              </div>
              <p className="text-[10px] text-[#CBD5E1] leading-relaxed">{r.assessment}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
    <SignalsUsedFooter sources="3x IRS Form 990 | 2x Form ADV | 1x SEC DEF 14A | 2x Website Scraping" />
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
