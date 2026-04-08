import { Landmark, Radio, Users, Shield, Globe, AlertTriangle, CheckCircle, TrendingUp, TrendingDown } from "lucide-react";
import IntelligenceSections6to13 from "./IntelligenceSections6to13";
import { cn } from "@/lib/utils";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid, Cell } from "recharts";

// ─── TYPES ───
interface ManagerIntelligence {
  sentiment: {
    managerMentions7d: number; mentionDelta: string; sentimentScore: number; topHoldingTrend: { ticker: string; score: number }; crisisFlag: boolean;
    mentionBars: number[];
    holdingsHeatmap: { ticker: string; score: number }[];
    narratives: { emoji: string; theme: string; mentions: number; trend: string }[];
    crisisAlert: string;
  };
  workforce: {
    headcount: number; headcountFrom: number; seniorDepartures: number; openRoles: number; hiringVsPeers: string;
    headcountTrend: { quarter: string; count: number }[];
    headcountAnnotations: { quarter: string; label: string }[];
    peerMedian: number;
    roleMixCurrent: number[];
    roleMixBaseline: number[];
    roleMixNote: string;
  };
  webPresence: {
    websiteChanges90d: number; pressReleases90d: number; conferences12m: number; conferencePeerAvg: number; mediaMentions: number;
    pressReleaseData: { quarter: string; count: number }[];
    pressReleaseNote: string;
  };
  summary: {
    keyRisks: string[];
    operationalFlags: string[];
    recommendedActions: string[];
    overallAssessment: string;
    signalsProcessed: number;
    confidence: string;
    generatedDate: string;
  };
}

// ─── HELIX DATA (manager 4) ───
const helixIntelligence: ManagerIntelligence = {
  sentiment: {
    managerMentions7d: 34, mentionDelta: "+180%", sentimentScore: 38, topHoldingTrend: { ticker: "NVDA", score: 71 }, crisisFlag: true,
    mentionBars: [2, 3, 2, 4, 3, 2, 4, 3, 5, 4, 18, 24, 31, 34],
    holdingsHeatmap: [
      { ticker: "NVDA", score: 82 }, { ticker: "AAPL", score: 61 }, { ticker: "MSFT", score: 74 }, { ticker: "META", score: 79 },
      { ticker: "JPM", score: 58 }, { ticker: "TLT", score: 44 }, { ticker: "GOOGL", score: 71 }, { ticker: "AMZN", score: 68 },
      { ticker: "TSLA", score: 31 }, { ticker: "BRK.B", score: 66 }, { ticker: "UNH", score: 49 }, { ticker: "SPY", score: 63 },
    ],
    narratives: [
      { emoji: "🔴", theme: "Redemption pressure", mentions: 14, trend: "trending up" },
      { emoji: "🔴", theme: "Underperformance vs peers", mentions: 11, trend: "trending up" },
      { emoji: "🟡", theme: "Credit market stress / middle market", mentions: 9, trend: "stable" },
      { emoji: "🟡", theme: "Deutsche Bank counterparty", mentions: 6, trend: "new" },
      { emoji: "🟢", theme: "Restructuring pipeline building", mentions: 5, trend: "stable" },
      { emoji: "⚪", theme: "Conference appearance SALT NY", mentions: 3, trend: "stable" },
    ],
    crisisAlert: "🚨 Crisis Signal: Abnormal mention spike detected (+180% in 7 days). Redemption narrative forming across Reddit and Twitter. Recommend direct LP outreach to confirm.",
  },
  workforce: {
    headcount: 12, headcountFrom: 17, seniorDepartures: 3, openRoles: 2, hiringVsPeers: "-2.1 SD below average",
    headcountTrend: [
      { quarter: "Q1'24", count: 17 }, { quarter: "Q2'24", count: 17 }, { quarter: "Q3'24", count: 16 }, { quarter: "Q4'24", count: 15 },
      { quarter: "Q1'25", count: 15 }, { quarter: "Q2'25", count: 14 }, { quarter: "Q3'25", count: 13 }, { quarter: "Q4'25", count: 12 },
    ],
    headcountAnnotations: [{ quarter: "Q3'24", label: "CRO departure" }, { quarter: "Q1'25", label: "2 senior PMs departed" }],
    peerMedian: 14,
    roleMixCurrent: [42, 25, 17, 8, 8],
    roleMixBaseline: [47, 18, 15, 12, 8],
    roleMixNote: "Compliance headcount up 39% while IR/marketing down 33% — consistent with redemption defense mode.",
  },
  webPresence: {
    websiteChanges90d: 3, pressReleases90d: 0, conferences12m: 2, conferencePeerAvg: 6, mediaMentions: 1,
    pressReleaseData: [
      { quarter: "Q1'24", count: 3 }, { quarter: "Q2'24", count: 2 }, { quarter: "Q3'24", count: 2 }, { quarter: "Q4'24", count: 1 },
      { quarter: "Q1'25", count: 1 }, { quarter: "Q2'25", count: 1 }, { quarter: "Q3'25", count: 0 }, { quarter: "Q4'25", count: 0 }, { quarter: "Q1'26", count: 0 },
    ],
    pressReleaseNote: "Zero press releases in 9 months. Peer average: 4-6 per year for comparable AUM managers.",
  },
  summary: {
    keyRisks: [
      "Insider selling divergence on NVDA (top holding)",
      "Social crisis signal: redemption narrative forming",
      "3 senior departures in 12 months including CRO",
      "AUM declined 39% from 2021 peak",
      "PB downgrade from Tier 1 to Tier 2 with simultaneous de-grossing",
      "Founder new LLC formation during fund stress period",
      "Redemption queue probability score 74/100",
    ],
    operationalFlags: [
      "ADV amended 4x in 12 months (3x above norm)",
      "Non-tier-1 prime broker (Deutsche Bank)",
      "Non-Big 4 auditor (BDO)",
      "New fund launch during flagship underperformance",
      "Fee drag 103bps above peer composite (3.41% vs 2.38%)",
      "Alt data moat score 28/100 — below peer median",
      "SEC comment letter open on UNH (top holding)",
      "Key Man clause does not trigger automatic wind-down",
    ],
    recommendedActions: [
      "Schedule GP call within 7 days",
      "Request updated LP letter and portfolio attribution",
      "Confirm Apr 15 capital call funding plan",
      "Review redemption gate provisions",
      "Activate standby credit facility monitoring",
      "Negotiate hard Key Man redemption trigger at next side letter",
      "Request GP co-investment disclosure for Redwood Holdings LLC",
      "Monitor Robert Vance new LLC (Vance Capital Advisors) for ADV filing",
      "Review Deutsche Bank counterparty exposure across portfolio",
    ],
    overallAssessment: "Overall Assessment: ELEVATED CONCERN — Recommend active monitoring and board-level discussion before next commitment.",
    signalsProcessed: 134,
    confidence: "High",
    generatedDate: "Apr 8, 2026",
  },
};

const managerIntelligenceData: Record<number, ManagerIntelligence> = {
  4: helixIntelligence,
};

// ─── HELPERS ───
const StatChip = ({ label, value, color = "#C9A84C", badge, pulse }: { label: string; value: string; color?: string; badge?: string; pulse?: boolean }) => (
  <div className="bg-[#161B22] border border-[#30363D] rounded-lg px-3 py-2 flex flex-col gap-0.5">
    <span className="text-[10px] text-[#8B949E] uppercase tracking-wider">{label}</span>
    <span className="text-sm font-bold" style={{ color }}>{value}</span>
    {badge && (
      <span className={cn("text-[9px] font-bold px-1.5 py-0.5 rounded-full w-fit mt-0.5", pulse && "animate-pulse")} style={{ backgroundColor: `${color}20`, color }}>
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

const sentimentColor = (score: number) => score > 70 ? "#22C55E" : score >= 50 ? "#F59E0B" : "#EF4444";
const sentimentLabel = (score: number) => score > 70 ? "Bullish" : score >= 50 ? "Neutral" : score >= 40 ? "Bearish" : "Very Bearish";
const sentimentArrow = (score: number) => score > 70 ? "↑" : score >= 50 ? "→" : "↓";

const ROLE_MIX_COLORS = ["#3B82F6", "#EF4444", "#C9A84C", "#22C55E", "#8B5CF6"];
const ROLE_MIX_LABELS = ["Investment/PM", "Risk/Compliance", "Operations", "IR/Marketing", "Tech/Quant"];

// ─── COMPONENT ───
const IntelligenceTab = ({ managerId }: { managerId: number }) => {
  const data = managerIntelligenceData[managerId];

  if (!data) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-sm">Intelligence data is being compiled for this manager.</p>
        <p className="text-[11px] text-[#8B949E] mt-1">Check back soon for a full intelligence assessment.</p>
      </div>
    );
  }

  const { sentiment, workforce, webPresence, summary } = data;

  return (
    <div className="space-y-6">
      {/* ═══ INTELLIGENCE SUMMARY BANNER (TOP) ═══ */}
      <div className="bg-[#1e0a0a] border border-[#EF4444]/30 rounded-lg overflow-hidden" style={{ borderLeftWidth: 3, borderLeftColor: "#EF4444" }}>
        <div className="px-5 py-4 border-b border-[#30363D]">
          <h3 className="text-sm font-bold text-foreground">AltBots Intelligence Assessment — Helix Credit Opportunities</h3>
          <p className="text-[10px] text-[#8B949E] mt-0.5">Generated {summary.generatedDate} | Confidence: {summary.confidence} | {summary.signalsProcessed} signals processed across 13 intelligence modules</p>
        </div>
        <div className="p-5 grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div>
            <h4 className="text-[10px] font-bold text-[#EF4444] uppercase tracking-wider mb-2">Key Risks Identified</h4>
            <ul className="space-y-1.5">
              {summary.keyRisks.map((r, i) => (
                <li key={i} className="text-[11px] text-[#CBD5E1] flex items-start gap-1.5">
                  <span className="text-[#EF4444] mt-0.5">•</span> {r}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-[10px] font-bold text-[#F59E0B] uppercase tracking-wider mb-2">Operational Red Flags</h4>
            <ul className="space-y-1.5">
              {summary.operationalFlags.map((f, i) => (
                <li key={i} className="text-[11px] text-[#CBD5E1] flex items-start gap-1.5">
                  <span className="text-[#F59E0B] mt-0.5">•</span> {f}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-[10px] font-bold text-[#3B82F6] uppercase tracking-wider mb-2">Recommended Actions</h4>
            <ul className="space-y-1.5">
              {summary.recommendedActions.map((a, i) => (
                <li key={i} className="text-[11px] text-[#CBD5E1] flex items-start gap-1.5">
                  <span className="text-[#3B82F6] mt-0.5">•</span> {a}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="px-5 py-3 border-t border-[#30363D]">
          <p className="text-[12px] font-bold text-[#C9A84C]">{summary.overallAssessment}</p>
        </div>
      </div>

      {/* ═══ SECTION 1: INSIDER & POLITICAL — ANALYSIS ONLY ═══ */}
      <SectionCard title="Insider & Political Trade Intelligence" icon={Landmark} borderColor="#C9A84C">
        <div className="flex gap-3 mb-5">
          <StatChip label="Form 4 Filings (30 days)" value="847 parsed" />
          <StatChip label="Congressional Disclosures (45d lag)" value="23 active positions" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div>
            <h4 className="text-xs font-bold text-foreground uppercase tracking-wider mb-3">Insider Divergence Assessment</h4>
            <div className="space-y-3">
              <div className="rounded-lg p-3 bg-[#EF4444]/10 border-l-2 border-[#EF4444]">
                <p className="text-[10px] font-bold text-[#EF4444] mb-1">NVDA — CRITICAL DIVERGENCE</p>
                <p className="text-[11px] text-[#CBD5E1] leading-relaxed">
                  Both NVIDIA's CEO and CFO have executed significant insider sales totaling 325,000 shares ($38.5M) within the past 7 days. Helix maintains NVDA as a top portfolio position and appears to be increasing exposure. This creates a material divergence between insider sentiment and manager positioning. Historically, coordinated C-suite selling at this magnitude precedes a 6-12 month period of underperformance in 67% of cases in our dataset.
                </p>
                <p className="text-[10px] text-[#EF4444] mt-2 font-medium">Recommendation: Flag for GP discussion. Request Helix's conviction thesis on NVDA given insider selling pattern.</p>
              </div>
              <div className="rounded-lg p-3 bg-[#22C55E]/10 border-l-2 border-[#22C55E]">
                <p className="text-[10px] font-bold text-[#22C55E] mb-1">JPM — ALIGNED</p>
                <p className="text-[11px] text-[#CBD5E1] leading-relaxed">
                  CEO insider buying of $50K+ is directionally aligned with Helix's JPM position. No action required.
                </p>
              </div>
              <div className="rounded-lg p-3 bg-[#EF4444]/10 border-l-2 border-[#EF4444]">
                <p className="text-[10px] font-bold text-[#EF4444] mb-1">AAPL — DIVERGENCE</p>
                <p className="text-[11px] text-[#CBD5E1] leading-relaxed">
                  CEO Tim Cook executed a significant sale of 511,000 shares. While Cook's sales often follow a pre-planned 10b5-1 pattern, the magnitude is notable. Monitor for additional insider selling signals.
                </p>
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-xs font-bold text-foreground uppercase tracking-wider mb-3">Congressional Activity Assessment</h4>
            <p className="text-[11px] text-[#CBD5E1] leading-relaxed mb-3">
              Analysis of 23 active congressional trading disclosures reveals a mixed signal environment for Helix's portfolio. Notable concern: a Senate member sold NVDA in the same window as insider C-suite selling, creating a multi-source convergence signal on the fund's largest position.
            </p>
            <p className="text-[11px] text-[#CBD5E1] leading-relaxed mb-3">
              Congressional buying activity in NVDA by a House member creates a conflicting signal. However, the STOCK Act's 45-day disclosure lag means these trades reflect sentiment from late February — before the most recent insider selling wave.
            </p>
            <p className="text-[10px] text-[#F59E0B] font-medium">
              Net assessment: Congressional signals are directionally negative for NVDA when adjusted for reporting lag. Combined with insider selling, this creates a convergent bearish signal from two independent informed-party sources.
            </p>
          </div>
        </div>
        <div className="mt-3 bg-[#EF4444]/10 border border-[#EF4444]/30 rounded-lg p-3 text-[11px] text-[#EF4444] font-medium leading-relaxed">
          ⚠ Divergence Detected: Helix holds NVDA as a top position. Both CEO and CFO have filed Form 4 sell transactions totaling 325,000 shares in the past 7 days while your manager maintains or increases position.
        </div>
        <SignalsUsedFooter sources="6x SEC EDGAR Form 4 | 4x Congressional Disclosure" />
      </SectionCard>

      {/* ═══ SECTION 2: SOCIAL & SENTIMENT — ANALYSIS ONLY ═══ */}
      <SectionCard title="Social & Sentiment Intelligence" icon={Radio} borderColor="#3B82F6">
        <div className="flex flex-wrap gap-3 mb-5">
          <StatChip label="Manager Mentions (7d)" value={String(sentiment.managerMentions7d)} color="#F59E0B" badge={`${sentiment.mentionDelta} vs prior week`} />
          <StatChip label="Sentiment Score" value={`${sentiment.sentimentScore}/100`} color="#EF4444" badge="Negative" />
          <StatChip label="Top Holding Trend Score" value={`${sentiment.topHoldingTrend.score}/100 ${sentiment.topHoldingTrend.ticker}`} color="#22C55E" />
          <StatChip label="Crisis Flag" value="ACTIVE" color="#EF4444" badge="CRISIS DETECTED" pulse />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Col 1: Analytical narrative */}
          <div>
            <h4 className="text-xs font-bold text-foreground uppercase tracking-wider mb-3">Crisis Narrative Assessment</h4>
            <ResponsiveContainer width="100%" height={100}>
              <BarChart data={sentiment.mentionBars.map((v, i) => ({ day: i + 1, mentions: v }))}>
                <Bar dataKey="mentions" radius={[2, 2, 0, 0]}>
                  {sentiment.mentionBars.map((v, i) => (
                    <Cell key={i} fill={v > 15 ? "#EF4444" : v > 8 ? "#F59E0B" : "#3B82F6"} />
                  ))}
                </Bar>
                <Tooltip contentStyle={{ background: "#161B22", border: "1px solid #30363D", fontSize: 11 }} />
              </BarChart>
            </ResponsiveContainer>
            <p className="text-[11px] text-[#CBD5E1] leading-relaxed mt-3">
              Helix Credit is experiencing an abnormal social media attention spike of +180% in 7 days. The dominant narrative is a forming redemption thesis, with multiple independent sources discussing large LP withdrawals and underperformance relative to peers.
            </p>
            <p className="text-[11px] text-[#CBD5E1] leading-relaxed mt-2">
              This pattern matches our historical "crisis formation" template — where social sentiment precedes actual redemption events by 30-90 days in 72% of observed cases. The presence of institutional analysts amplifying the narrative (not just retail) elevates the credibility of this signal.
            </p>
            <p className="text-[10px] text-[#EF4444] mt-2 font-medium">
              Verdict: Active crisis signal. Recommend direct LP outreach to assess sentiment before it crystallizes into formal redemption requests.
            </p>
          </div>
          {/* Col 2: Holdings Heatmap */}
          <div>
            <h4 className="text-xs font-bold text-foreground uppercase tracking-wider mb-3">Holdings Sentiment Heatmap</h4>
            <div className="grid grid-cols-3 gap-2">
              {sentiment.holdingsHeatmap.map((h) => {
                const bg = sentimentColor(h.score);
                return (
                  <div key={h.ticker} className="rounded-lg p-2 text-center" style={{ backgroundColor: `${bg}15`, border: `1px solid ${bg}30` }}>
                    <span className="text-xs font-bold text-foreground block">{h.ticker}</span>
                    <span className="text-[10px] font-bold block" style={{ color: bg }}>{h.score}/100</span>
                    <span className="text-[9px]" style={{ color: bg }}>{sentimentLabel(h.score)} {sentimentArrow(h.score)}</span>
                  </div>
                );
              })}
            </div>
            <p className="text-[10px] text-[#8B949E] mt-3 italic">
              Portfolio-weighted sentiment is below neutral at 58/100, dragged down by TLT (44), UNH (49), and TSLA (31). Holdings with bearish sentiment represent ~18% of estimated portfolio weight.
            </p>
          </div>
          {/* Col 3: Narrative Themes */}
          <div>
            <h4 className="text-xs font-bold text-foreground uppercase tracking-wider mb-3">Narrative Themes (AI Extracted)</h4>
            <div className="space-y-2.5">
              {sentiment.narratives.map((n, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="text-sm mt-0.5">{n.emoji}</span>
                  <div className="flex-1">
                    <span className="text-[11px] font-bold text-[#CBD5E1]">"{n.theme}"</span>
                    <span className="text-[10px] text-[#8B949E] ml-2">— {n.mentions} mentions, {n.trend}</span>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-[11px] text-[#CBD5E1] mt-3 leading-relaxed">
              The top two narratives — redemption pressure and underperformance — are mutually reinforcing and trending upward. The emergence of "Deutsche Bank counterparty" as a new theme suggests the market is beginning to connect operational risk dots.
            </p>
          </div>
        </div>
        <div className="mt-4 bg-[#EF4444]/10 border border-[#EF4444]/30 rounded-lg p-3 text-[11px] text-[#EF4444] font-bold leading-relaxed">
          {sentiment.crisisAlert}
        </div>
        <SignalsUsedFooter sources="7x Social Media | 1x Website Monitor" />
      </SectionCard>

      {/* ═══ SECTION 3: WORKFORCE — ANALYSIS ONLY ═══ */}
      <SectionCard title="Workforce & Organizational Intelligence" icon={Users} borderColor="#8B5CF6">
        <div className="flex flex-wrap gap-3 mb-5">
          <StatChip label="Estimated Headcount" value={`${workforce.headcount} (down from ${workforce.headcountFrom})`} color="#EF4444" />
          <StatChip label="Senior Departures (12m)" value={String(workforce.seniorDepartures)} color="#EF4444" />
          <StatChip label="Open Roles Detected" value={String(workforce.openRoles)} color="#F59E0B" />
          <StatChip label="Hiring vs Peers" value={workforce.hiringVsPeers} color="#EF4444" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Headcount Analysis */}
          <div>
            <h4 className="text-xs font-bold text-foreground uppercase tracking-wider mb-3">Organizational Trajectory Analysis</h4>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={workforce.headcountTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#30363D" />
                <XAxis dataKey="quarter" tick={{ fill: "#8B949E", fontSize: 10 }} />
                <YAxis domain={[8, 20]} tick={{ fill: "#8B949E", fontSize: 10 }} />
                <Tooltip contentStyle={{ background: "#161B22", border: "1px solid #30363D", fontSize: 11 }} />
                <Line type="monotone" dataKey="count" stroke="#EF4444" strokeWidth={2} dot={{ fill: "#EF4444", r: 3 }} />
                <Line type="monotone" dataKey={() => workforce.peerMedian} stroke="#8B949E" strokeDasharray="5 5" strokeWidth={1} dot={false} name="Peer Median" />
              </LineChart>
            </ResponsiveContainer>
            <div className="flex gap-4 mt-1">
              {workforce.headcountAnnotations.map((a, i) => (
                <span key={i} className="text-[9px] text-[#EF4444]">📍 {a.quarter}: {a.label}</span>
              ))}
            </div>
            <span className="text-[9px] text-[#8B949E] mt-1 block">Gray dashed line: Peer Median ({workforce.peerMedian})</span>
          </div>
          {/* Workforce Verdict */}
          <div>
            <h4 className="text-xs font-bold text-foreground uppercase tracking-wider mb-3">Workforce Risk Verdict</h4>
            <p className="text-[11px] text-[#CBD5E1] leading-relaxed mb-3">
              Helix has lost 29% of its workforce in 8 quarters, declining from 17 to 12 professionals. This is 2.1 standard deviations below the hiring rate for comparable distressed credit managers in the $1-3B AUM bracket.
            </p>
            <p className="text-[11px] text-[#CBD5E1] leading-relaxed mb-3">
              Most critically, the Chief Risk Officer departure has not been replaced — the role appears eliminated entirely. Combined with the replacement of a senior PM with a junior analyst, this indicates a systematic seniority downgrade pattern consistent with cost-cutting under AUM pressure.
            </p>
            <p className="text-[11px] text-[#CBD5E1] leading-relaxed mb-3">
              The shift in role mix is telling: compliance headcount has grown 39% while investor relations and marketing has shrunk 33%. This is a classic "redemption defense mode" pattern — firms invest in compliance infrastructure while reducing outward-facing functions when managing through outflows.
            </p>
            <div className="rounded-lg p-3 bg-[#EF4444]/10 border-l-2 border-[#EF4444]">
              <p className="text-[10px] font-bold text-[#EF4444]">RISK LEVEL: HIGH</p>
              <p className="text-[10px] text-[#CBD5E1] mt-1">CRO elimination creates a material operational risk gap. Request confirmation of risk oversight structure and whether external risk consultants have been engaged.</p>
            </div>
          </div>
        </div>
        {/* Role Mix */}
        <div className="mt-5">
          <h4 className="text-xs font-bold text-foreground uppercase tracking-wider mb-3">Role Mix Analysis</h4>
          <div className="space-y-2">
            {["Current (2026)", "2024 Baseline"].map((label, idx) => {
              const values = idx === 0 ? workforce.roleMixCurrent : workforce.roleMixBaseline;
              return (
                <div key={label}>
                  <span className="text-[10px] text-[#8B949E] block mb-1">{label}</span>
                  <div className="flex h-5 rounded-full overflow-hidden">
                    {values.map((v, i) => (
                      <div key={i} style={{ width: `${v}%`, backgroundColor: ROLE_MIX_COLORS[i] }} className="flex items-center justify-center">
                        {v >= 10 && <span className="text-[8px] font-bold text-white">{v}%</span>}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
            <div className="flex gap-3 mt-2 flex-wrap">
              {ROLE_MIX_LABELS.map((l, i) => (
                <span key={l} className="text-[9px] flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: ROLE_MIX_COLORS[i] }} /> {l}
                </span>
              ))}
            </div>
            <p className="text-[10px] text-[#F59E0B] mt-2 italic">{workforce.roleMixNote}</p>
          </div>
        </div>
        <SignalsUsedFooter sources="8x LinkedIn | 2x Form ADV | 1x LinkedIn Job Postings" />
      </SectionCard>

      {/* ═══ SECTION 4: REGULATORY — ANALYSIS ONLY ═══ */}
      <SectionCard title="Regulatory Intelligence Assessment" icon={Shield} borderColor="#EF4444">
        <div className="flex flex-wrap gap-3 mb-5">
          <StatChip label="ADV Amendments (12m)" value="4" color="#EF4444" badge="Above avg of 1.2" />
          <StatChip label="Form D Filings" value="1 new fund" color="#F59E0B" />
          <StatChip label="FINRA Flags (Key Personnel)" value="2" color="#EF4444" />
          <StatChip label="SEC Actions" value="1 settled" color="#EF4444" />
          <StatChip label="OFAC/Sanctions" value="Clear" color="#22C55E" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div>
            <h4 className="text-xs font-bold text-foreground uppercase tracking-wider mb-3">Filing Velocity Assessment</h4>
            <p className="text-[11px] text-[#CBD5E1] leading-relaxed mb-3">
              Helix has amended its Form ADV four times in 12 months — more than 3x the industry average of 1.2 amendments per year. While amendments are not inherently negative, the pattern reveals a cascading series of material changes: AUM decline, fee restructuring, personnel departures, and new conflict disclosures.
            </p>
            <p className="text-[11px] text-[#CBD5E1] leading-relaxed mb-3">
              The velocity of these filings suggests a fund in active transition. Each amendment individually might be routine; taken together, they paint a picture of an organization adapting rapidly to deteriorating conditions.
            </p>
            <div className="rounded-lg p-3 bg-[#EF4444]/10 border-l-2 border-[#EF4444]">
              <p className="text-[10px] font-bold text-[#EF4444]">VERDICT: ELEVATED FILING ACTIVITY</p>
              <p className="text-[10px] text-[#CBD5E1] mt-1">4x amendments in 12 months with consistently negative deltas (AUM decline, fee cuts, personnel losses, new conflicts). Recommend requesting a comprehensive ADV walkthrough from compliance counsel.</p>
            </div>
          </div>
          <div>
            <h4 className="text-xs font-bold text-foreground uppercase tracking-wider mb-3">Personnel Compliance Assessment</h4>
            <p className="text-[11px] text-[#CBD5E1] leading-relaxed mb-3">
              Two key personnel carry disclosed regulatory history. The founder Robert Vance has a 2019 SEC settlement ($285,000 civil penalty) for failure to disclose placement agent conflicts. While resolved, this indicates a historical pattern of disclosure lapses that is relevant given the recent ADV conflict addition regarding Redwood Holdings.
            </p>
            <p className="text-[11px] text-[#CBD5E1] leading-relaxed">
              Head of Trading David Mercer carries a prior-firm customer dispute that was settled for $45,000. This is lower severity but contributes to the overall personnel risk profile.
            </p>
            <p className="text-[10px] text-[#F59E0B] mt-2 font-medium">
              Note: Vance's prior disclosure failure combined with the recent Redwood Holdings conflict addition creates a pattern that warrants enhanced monitoring of future disclosures.
            </p>
          </div>
          <div>
            <h4 className="text-xs font-bold text-foreground uppercase tracking-wider mb-3">New Fund & Sanctions Assessment</h4>
            <p className="text-[11px] text-[#CBD5E1] leading-relaxed mb-3">
              Helix Credit Opportunities Fund IV was launched via Form D in February 2026, seeking $500M but raising only $42M to date (8.4% of target). Launching a new fund during a period of flagship underperformance and AUM decline creates capital distraction risk and may signal desperation for new fee-generating vehicles.
            </p>
            <p className="text-[11px] text-[#CBD5E1] leading-relaxed mb-3">
              OFAC/sanctions screening is clear for all key personnel and known affiliates. No state AG actions detected. This is one of the few unambiguously positive findings in this assessment.
            </p>
            <div className="rounded-lg p-3 bg-[#22C55E]/10 border-l-2 border-[#22C55E]">
              <p className="text-[10px] font-bold text-[#22C55E]">OFAC/SANCTIONS: CLEAR ✓</p>
              <p className="text-[10px] text-[#CBD5E1] mt-1">All personnel and affiliates screened as of Apr 8 2026.</p>
            </div>
          </div>
        </div>
        <SignalsUsedFooter sources="6x Form ADV | 2x FINRA BrokerCheck | 1x Form D | 1x OFAC screening" />
      </SectionCard>

      {/* ═══ SECTION 5: WEB PRESENCE — ANALYSIS ONLY ═══ */}
      <SectionCard title="Web Presence & Operational Intelligence" icon={Globe} borderColor="#06B6D4">
        <div className="flex flex-wrap gap-3 mb-5">
          <StatChip label="Website Changes (90d)" value={String(webPresence.websiteChanges90d)} color="#F59E0B" badge="detected" />
          <StatChip label="Press Releases (90d)" value={String(webPresence.pressReleases90d)} color="#EF4444" badge="silence signal" />
          <StatChip label="Conference Appearances (12m)" value={`${webPresence.conferences12m}`} color="#EF4444" badge={`below peer avg of ${webPresence.conferencePeerAvg}`} />
          <StatChip label="Media Mentions (TV/Podcast)" value={String(webPresence.mediaMentions)} color="#EF4444" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div>
            <h4 className="text-xs font-bold text-foreground uppercase tracking-wider mb-3">Digital Footprint Assessment</h4>
            <p className="text-[11px] text-[#CBD5E1] leading-relaxed mb-3">
              Helix's web presence reveals a pattern of quiet retreat. Three personnel were removed from the team page without any public announcement — a strong signal of organizational contraction that the firm chose not to communicate proactively. The strategy description was softened from "primarily distressed debt" to the more ambiguous "credit opportunities across the capital structure," which suggests either strategy drift or an attempt to reposition for a broader LP audience.
            </p>
            <p className="text-[11px] text-[#CBD5E1] leading-relaxed mb-3">
              Most concerning: the legal disclaimer was updated mid-cycle to include explicit language about liquidity risk, gates, and redemption suspensions. Disclaimer updates of this nature are typically made pre-emptively when a firm anticipates liquidity stress events.
            </p>
            <div className="rounded-lg p-3 bg-[#EF4444]/10 border-l-2 border-[#EF4444]">
              <p className="text-[10px] font-bold text-[#EF4444]">VERDICT: DEFENSIVE POSTURE</p>
              <p className="text-[10px] text-[#CBD5E1] mt-1">Website changes collectively signal a firm preparing for potential redemption events. Legal disclaimer update is the strongest single indicator.</p>
            </div>
          </div>
          <div>
            <h4 className="text-xs font-bold text-foreground uppercase tracking-wider mb-3">Public Profile & Media Assessment</h4>
            <p className="text-[11px] text-[#CBD5E1] leading-relaxed mb-3">
              Helix has essentially gone silent in public forums. Zero press releases in 9 months (peer average: 4-6/year). Conference presence has dropped from keynote speaker to audience attendee. Bloomberg and CNBC appearances have ceased entirely after 3 appearances in 2024.
            </p>
            <p className="text-[11px] text-[#CBD5E1] leading-relaxed mb-3">
              At the one conference where Vance did speak (SALT New York, March 2026), his tone was notably defensive — acknowledging a "challenging vintage" and "selective deployment" posture. No fundraising language was used, which is unusual for a firm with an open Fund IV.
            </p>
            <div className="mt-3">
              <h4 className="text-[10px] font-bold text-foreground uppercase tracking-wider mb-2">Press Release Velocity</h4>
              <ResponsiveContainer width="100%" height={80}>
                <BarChart data={webPresence.pressReleaseData}>
                  <XAxis dataKey="quarter" tick={{ fill: "#8B949E", fontSize: 8 }} />
                  <Bar dataKey="count" radius={[2, 2, 0, 0]}>
                    {webPresence.pressReleaseData.map((d, i) => (
                      <Cell key={i} fill={d.count === 0 ? "#EF4444" : d.count <= 1 ? "#F59E0B" : "#C9A84C"} />
                    ))}
                  </Bar>
                  <Tooltip contentStyle={{ background: "#161B22", border: "1px solid #30363D", fontSize: 10 }} />
                </BarChart>
              </ResponsiveContainer>
              <p className="text-[10px] text-[#EF4444] italic mt-1">{webPresence.pressReleaseNote}</p>
            </div>
          </div>
        </div>
        <SignalsUsedFooter sources="3x Website Monitor | 2x Conference Records | 3x Media Monitoring" />
      </SectionCard>

      {/* ═══ SECTIONS 6-13 ═══ */}
      <IntelligenceSections6to13 />
    </div>
  );
};

export default IntelligenceTab;
