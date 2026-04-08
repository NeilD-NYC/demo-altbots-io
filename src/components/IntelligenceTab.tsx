import { Landmark, Radio, Users, Shield, Globe, AlertTriangle, CheckCircle, TrendingUp, TrendingDown } from "lucide-react";
import IntelligenceSections6to13 from "./IntelligenceSections6to13";
import { cn } from "@/lib/utils";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid, Cell } from "recharts";

// ─── TYPES ───
interface ManagerIntelligence {
  insiderTrades: { holding: string; insider: string; role: string; trade: string; shares: string; date: string; signal: "divergence" | "aligned" | "neutral" | "none" }[];
  insiderAlert: string;
  congressTrades: { member: string; chamber: string; holding: string; trade: string; amount: string; disclosed: string; lag: string }[];
  sentiment: {
    managerMentions7d: number; mentionDelta: string; sentimentScore: number; topHoldingTrend: { ticker: string; score: number }; crisisFlag: boolean;
    mentionBars: number[];
    feedItems: { color: string; source: string; date: string; text: string; sentiment: string; reach: string }[];
    holdingsHeatmap: { ticker: string; score: number }[];
    narratives: { emoji: string; theme: string; mentions: number; trend: string }[];
    crisisAlert: string;
  };
  workforce: {
    headcount: number; headcountFrom: number; seniorDepartures: number; openRoles: number; hiringVsPeers: string;
    headcountTrend: { quarter: string; count: number }[];
    headcountAnnotations: { quarter: string; label: string }[];
    peerMedian: number;
    personnelFeed: { color: string; date: string; text: string; source: string }[];
    roleMixCurrent: number[];
    roleMixBaseline: number[];
    roleMixNote: string;
  };
  regulatory: {
    advAmendments12m: number; advAvg: number; formDFilings: string; finraFlags: number; secActions: string; ofac: string;
    advTimeline: { date: string; label: string; description: string; flag: string; flagColor: string }[];
    brokerCheck: { name: string; role: string; disclosures: { type: string; detail: string; amount?: string; status: string }[] }[];
    formDDetail: { fundName: string; filed: string; amountSought: string; amountRaised: string; note: string };
    ofacDetail: { personnel: string; affiliates: string; lastScreened: string; stateAG: string };
  };
  webPresence: {
    websiteChanges90d: number; pressReleases90d: number; conferences12m: number; conferencePeerAvg: number; mediaMentions: number;
    websiteChanges: { color: string; date: string; section: string; description: string; diff: string }[];
    domain: { domain: string; registered: string; renews: string; ssl: string; hosting: string; lastChange: string };
    conferences: { date: string; event: string; appearance: string; tone: string; reach: string; signal?: string }[];
    tvPodcast: { outlet: string; appearances: string; note?: string }[];
    mediaNote: string;
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
  insiderTrades: [
    { holding: "NVDA", insider: "Jensen Huang", role: "CEO", trade: "SELL", shares: "240,000", date: "Apr 3 2026", signal: "divergence" },
    { holding: "NVDA", insider: "Colette Kress", role: "CFO", trade: "SELL", shares: "85,000", date: "Apr 1 2026", signal: "divergence" },
    { holding: "JPM", insider: "Jamie Dimon", role: "CEO", trade: "BUY", shares: "50,000", date: "Mar 28 2026", signal: "aligned" },
    { holding: "META", insider: "Mark Zuckerberg", role: "CEO", trade: "HOLD", shares: "—", date: "—", signal: "neutral" },
    { holding: "TLT", insider: "—", role: "—", trade: "—", shares: "—", date: "—", signal: "none" },
    { holding: "AAPL", insider: "Tim Cook", role: "CEO", trade: "SELL", shares: "511,000", date: "Mar 15 2026", signal: "divergence" },
  ],
  insiderAlert: "⚠ Divergence Detected: Helix holds NVDA as a top position. Both CEO and CFO have filed Form 4 sell transactions totaling 325,000 shares in the past 7 days while your manager maintains or increases position.",
  congressTrades: [
    { member: "Sen. Thomas Carper", chamber: "Senate", holding: "NVDA", trade: "SELL", amount: "$50-100K", disclosed: "Apr 2 2026", lag: "41 days" },
    { member: "Rep. Nancy Pelosi", chamber: "House", holding: "NVDA", trade: "BUY", amount: "$500K-1M", disclosed: "Mar 18 2026", lag: "27 days" },
    { member: "Sen. Mark Warner", chamber: "Senate", holding: "MSFT", trade: "BUY", amount: "$100-250K", disclosed: "Mar 25 2026", lag: "33 days" },
    { member: "Rep. Dan Crenshaw", chamber: "House", holding: "AAPL", trade: "SELL", amount: "$15-50K", disclosed: "Mar 30 2026", lag: "38 days" },
  ],
  sentiment: {
    managerMentions7d: 34, mentionDelta: "+180%", sentimentScore: 38, topHoldingTrend: { ticker: "NVDA", score: 71 }, crisisFlag: true,
    mentionBars: [2, 3, 2, 4, 3, 2, 4, 3, 5, 4, 18, 24, 31, 34],
    feedItems: [
      { color: "red", source: "Reddit r/hedgefund", date: "Apr 7 2026", text: "Anyone else hearing redemption rumors at Helix? Two sources saying a $200M+ LP is pulling out mid-year.", sentiment: "Very Negative", reach: "2,847 upvotes" },
      { color: "amber", source: "Twitter/X", date: "Apr 6 2026", text: "Helix Credit underperforming vs peers by 380bps YTD per Bloomberg data. Distressed space broadly challenging but this seems manager-specific.", sentiment: "Negative", reach: "1,204 impressions" },
      { color: "gray", source: "StockTwits", date: "Apr 5 2026", text: "Deutsche Bank PB relationship at Helix — anyone tracking counterparty exposure here?", sentiment: "Neutral/Watchful", reach: "341 views" },
    ],
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
    personnelFeed: [
      { color: "red", date: "Mar 2026", text: "Chief Risk Officer Michael Torres departed after 6 years. No replacement filing detected. Role appears eliminated.", source: "LinkedIn + SEC ADV amendment" },
      { color: "red", date: "Jan 2026", text: "Senior Portfolio Manager (credit trading) departed. Replaced by analyst-level hire per LinkedIn. Downgrade in role seniority detected.", source: "LinkedIn scrape" },
      { color: "amber", date: "Nov 2025", text: "Head of Investor Relations departed. New IR hire detected 45 days later — junior profile.", source: "LinkedIn scrape" },
      { color: "amber", date: "Sep 2025", text: "Two open roles detected: Junior Credit Analyst and Compliance Associate. Both roles suggest cost-reduction hiring pattern.", source: "LinkedIn job postings" },
    ],
    roleMixCurrent: [42, 25, 17, 8, 8],
    roleMixBaseline: [47, 18, 15, 12, 8],
    roleMixNote: "Compliance headcount up 39% while IR/marketing down 33% — consistent with redemption defense mode.",
  },
  regulatory: {
    advAmendments12m: 4, advAvg: 1.2, formDFilings: "1 new fund", finraFlags: 2, secActions: "1 settled", ofac: "Clear",
    advTimeline: [
      { date: "Apr 2026", label: "Amendment #4", description: "AUM reported: $2.3B (down from $2.8B prior filing). Fee structure modified: reduced management fee from 1.5% to 1.25%.", flag: "AUM decline + fee concession", flagColor: "red" },
      { date: "Jan 2026", label: "Amendment #3", description: "Added conflict of interest disclosure: GP co-investment in portfolio company Redwood Holdings LLC.", flag: "New conflict disclosed", flagColor: "amber" },
      { date: "Sep 2025", label: "Amendment #2", description: "Personnel change: CRO removed from Form ADV Part 1. No replacement listed.", flag: "Senior departure", flagColor: "red" },
      { date: "Mar 2025", label: "Amendment #1", description: "Regulatory AUM restated downward by $420M. Strategy description expanded to include 'opportunistic equity'.", flag: "Strategy drift signal", flagColor: "amber" },
    ],
    brokerCheck: [
      { name: "Robert Vance", role: "Founder/CIO", disclosures: [{ type: "Regulatory", detail: "2019 SEC settlement — Failure to disclose conflicts with placement agent", amount: "$285,000 civil penalty", status: "Resolved | ⚠ On record" }] },
      { name: "David Mercer", role: "Head of Trading", disclosures: [{ type: "Customer dispute", detail: "2017, prior firm — Unsuitable recommendation", amount: "$45,000 settlement", status: "Resolved | ⚠ On record" }] },
    ],
    formDDetail: { fundName: "Helix Credit Opportunities Fund IV", filed: "Feb 14 2026", amountSought: "$500M", amountRaised: "$42M", note: "New fund launch during period of flagship fund underperformance and AUM decline. Potential capital distraction risk." },
    ofacDetail: { personnel: "CLEAR ✓", affiliates: "CLEAR ✓", lastScreened: "Apr 8 2026", stateAG: "None detected ✓" },
  },
  webPresence: {
    websiteChanges90d: 3, pressReleases90d: 0, conferences12m: 2, conferencePeerAvg: 6, mediaMentions: 1,
    websiteChanges: [
      { color: "red", date: "Mar 28 2026", section: "Team Page", description: "3 professionals removed from team page. Names: Michael Torres (CRO), James Wu (PM), Sarah Chen (PM). No announcement published.", diff: "-3 personnel entries" },
      { color: "amber", date: "Feb 12 2026", section: "Strategy Description", description: "Language change on flagship fund strategy page. 'Primarily distressed debt' changed to 'credit opportunities across the capital structure.' Strategy drift language signal.", diff: "~180 words modified" },
      { color: "amber", date: "Dec 3 2025", section: "Legal Disclaimer", description: "Disclaimer updated to include explicit language around liquidity risk, gates, and suspension of redemptions. Unusual for mid-cycle update.", diff: "+340 words added" },
    ],
    domain: { domain: "helixcredit.com", registered: "2013", renews: "Dec 2026", ssl: "Valid ✓", hosting: "AWS us-east-1 ✓", lastChange: "Feb 2026" },
    conferences: [
      { date: "Mar 2026", event: "SALT New York Conference", appearance: "Panel participant, \"Distressed Opportunities in a Higher-For-Longer Environment\"", tone: "Defensive. Vance acknowledged \"challenging vintage\" and \"selective deployment\" posture. No new fundraising language.", reach: "~800 attendees" },
      { date: "Sep 2025", event: "AIMA Annual Conference", appearance: "Audience attendee only. Not on program.", tone: "Significant step-down from 2024 when Vance was a keynote speaker.", reach: "", signal: "Reduced profile" },
    ],
    tvPodcast: [
      { outlet: "Bloomberg Surveillance", appearances: "0 appearances (was 3x in 2024)" },
      { outlet: "CNBC Fast Money", appearances: "0 appearances" },
      { outlet: "The Due Diligence Podcast", appearances: "1 appearance, Oct 2025" },
    ],
    mediaNote: "Sharply reduced media presence vs prior years. Consistent with firm in defensive/redemption management mode.",
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

const signalBadge = (signal: string) => {
  if (signal === "divergence") return <span className="text-[11px] font-bold text-[#EF4444]">⚠ DIVERGENCE</span>;
  if (signal === "aligned") return <span className="text-[11px] font-bold text-[#22C55E]">✓ ALIGNED</span>;
  if (signal === "neutral") return <span className="text-[11px] font-bold text-[#8B949E]">NEUTRAL</span>;
  return <span className="text-[11px] text-[#8B949E]">No insider activity</span>;
};

const sentimentColor = (score: number) => score > 70 ? "#22C55E" : score >= 50 ? "#F59E0B" : "#EF4444";
const sentimentLabel = (score: number) => score > 70 ? "Bullish" : score >= 50 ? "Neutral" : score >= 40 ? "Bearish" : "Very Bearish";
const sentimentArrow = (score: number) => score > 70 ? "↑" : score >= 50 ? "→" : "↓";

const feedColorMap: Record<string, string> = { red: "#EF4444", amber: "#F59E0B", gray: "#8B949E" };

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

  const { sentiment, workforce, regulatory, webPresence, summary } = data;

  return (
    <div className="space-y-6">
      {/* ═══ SECTION 1: INSIDER & POLITICAL ═══ */}
      <SectionCard title="Insider & Political Trade Intelligence" icon={Landmark} borderColor="#C9A84C">
        <div className="flex gap-3 mb-5">
          <StatChip label="Form 4 Filings (30 days)" value="847 parsed" />
          <StatChip label="Congressional Disclosures (45d lag)" value="23 active positions" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Insider Activity */}
          <div>
            <h4 className="text-xs font-bold text-foreground uppercase tracking-wider mb-3">Insider Activity on Your Holdings</h4>
            <div className="overflow-auto">
              <table className="w-full text-[11px]">
                <thead><tr className="border-b border-[#30363D]">
                  {["Holding", "Insider", "Role", "Trade", "Shares", "Date", "Signal"].map(h => <th key={h} className="text-left py-2 px-1.5 text-[#8B949E] font-medium">{h}</th>)}
                </tr></thead>
                <tbody>
                  {data.insiderTrades.map((t, i) => (
                    <tr key={i} className="border-b border-[#30363D]/50">
                      <td className="py-2 px-1.5 font-bold text-foreground">{t.holding}</td>
                      <td className="py-2 px-1.5 text-[#CBD5E1]">{t.insider}</td>
                      <td className="py-2 px-1.5 text-[#8B949E]">{t.role}</td>
                      <td className="py-2 px-1.5"><span className={cn("font-bold", t.trade === "SELL" ? "text-[#EF4444]" : t.trade === "BUY" ? "text-[#22C55E]" : "text-[#8B949E]")}>{t.trade}</span></td>
                      <td className="py-2 px-1.5 text-[#CBD5E1]">{t.shares}</td>
                      <td className="py-2 px-1.5 text-[#8B949E]">{t.date}</td>
                      <td className="py-2 px-1.5">{signalBadge(t.signal)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-3 bg-[#EF4444]/10 border border-[#EF4444]/30 rounded-lg p-3 text-[11px] text-[#EF4444] font-medium leading-relaxed">
              {data.insiderAlert}
            </div>
          </div>
          {/* Congressional */}
          <div>
            <h4 className="text-xs font-bold text-foreground uppercase tracking-wider mb-3">Congressional Trade Activity</h4>
            <div className="overflow-auto">
              <table className="w-full text-[11px]">
                <thead><tr className="border-b border-[#30363D]">
                  {["Member", "Chamber", "Holding", "Trade", "Amount", "Disclosed", "Lag"].map(h => <th key={h} className="text-left py-2 px-1.5 text-[#8B949E] font-medium">{h}</th>)}
                </tr></thead>
                <tbody>
                  {data.congressTrades.map((t, i) => (
                    <tr key={i} className="border-b border-[#30363D]/50">
                      <td className="py-2 px-1.5 text-[#CBD5E1] font-medium">{t.member}</td>
                      <td className="py-2 px-1.5 text-[#8B949E]">{t.chamber}</td>
                      <td className="py-2 px-1.5 font-bold text-foreground">{t.holding}</td>
                      <td className="py-2 px-1.5"><span className={cn("font-bold", t.trade === "SELL" ? "text-[#EF4444]" : "text-[#22C55E]")}>{t.trade}</span></td>
                      <td className="py-2 px-1.5 text-[#CBD5E1]">{t.amount}</td>
                      <td className="py-2 px-1.5 text-[#8B949E]">{t.disclosed}</td>
                      <td className="py-2 px-1.5 text-[#8B949E]">{t.lag}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-[10px] text-[#8B949E] italic">
              Congressional disclosures carry mandatory 45-day reporting lag per STOCK Act. Divergence vs. manager positions flagged automatically.
            </p>
          </div>
        </div>
      </SectionCard>

      {/* ═══ SECTION 2: SOCIAL & SENTIMENT ═══ */}
      <SectionCard title="Social & Sentiment Intelligence" icon={Radio} borderColor="#3B82F6">
        <div className="flex flex-wrap gap-3 mb-5">
          <StatChip label="Manager Mentions (7d)" value={String(sentiment.managerMentions7d)} color="#F59E0B" badge={`${sentiment.mentionDelta} vs prior week`} />
          <StatChip label="Sentiment Score" value={`${sentiment.sentimentScore}/100`} color="#EF4444" badge="Negative" />
          <StatChip label="Top Holding Trend Score" value={`${sentiment.topHoldingTrend.score}/100 ${sentiment.topHoldingTrend.ticker}`} color="#22C55E" />
          <StatChip label="Crisis Flag" value="ACTIVE" color="#EF4444" badge="CRISIS DETECTED" pulse />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Col 1: Manager Sentiment */}
          <div>
            <h4 className="text-xs font-bold text-foreground uppercase tracking-wider mb-3">Manager Sentiment — Helix Credit</h4>
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
            <div className="space-y-3 mt-4">
              {sentiment.feedItems.map((item, i) => (
                <div key={i} className="rounded-lg p-3" style={{ backgroundColor: `${feedColorMap[item.color]}10`, borderLeft: `2px solid ${feedColorMap[item.color]}` }}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold" style={{ color: feedColorMap[item.color] }}>{item.source}</span>
                    <span className="text-[9px] text-[#8B949E]">{item.date}</span>
                  </div>
                  <p className="text-[11px] text-[#CBD5E1] italic leading-relaxed">"{item.text}"</p>
                  <div className="flex gap-3 mt-1.5">
                    <span className="text-[9px]" style={{ color: feedColorMap[item.color] }}>Sentiment: {item.sentiment}</span>
                    <span className="text-[9px] text-[#8B949E]">Reach: {item.reach}</span>
                  </div>
                </div>
              ))}
            </div>
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
          </div>
        </div>
        <div className="mt-4 bg-[#EF4444]/10 border border-[#EF4444]/30 rounded-lg p-3 text-[11px] text-[#EF4444] font-bold leading-relaxed">
          {sentiment.crisisAlert}
        </div>
      </SectionCard>

      {/* ═══ SECTION 3: WORKFORCE ═══ */}
      <SectionCard title="Workforce & Organizational Intelligence" icon={Users} borderColor="#8B5CF6">
        <div className="flex flex-wrap gap-3 mb-5">
          <StatChip label="Estimated Headcount" value={`${workforce.headcount} (down from ${workforce.headcountFrom})`} color="#EF4444" />
          <StatChip label="Senior Departures (12m)" value={String(workforce.seniorDepartures)} color="#EF4444" />
          <StatChip label="Open Roles Detected" value={String(workforce.openRoles)} color="#F59E0B" />
          <StatChip label="Hiring vs Peers" value={workforce.hiringVsPeers} color="#EF4444" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Headcount Trend */}
          <div>
            <h4 className="text-xs font-bold text-foreground uppercase tracking-wider mb-3">Headcount Trend (Estimated via LinkedIn)</h4>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={workforce.headcountTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#30363D" />
                <XAxis dataKey="quarter" tick={{ fill: "#8B949E", fontSize: 10 }} />
                <YAxis domain={[8, 20]} tick={{ fill: "#8B949E", fontSize: 10 }} />
                <Tooltip contentStyle={{ background: "#161B22", border: "1px solid #30363D", fontSize: 11 }} />
                <Line type="monotone" dataKey="count" stroke="#EF4444" strokeWidth={2} dot={{ fill: "#EF4444", r: 3 }} />
                {/* Peer median reference */}
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
          {/* Personnel Feed */}
          <div>
            <h4 className="text-xs font-bold text-foreground uppercase tracking-wider mb-3">Personnel Signal Feed</h4>
            <div className="space-y-3">
              {workforce.personnelFeed.map((e, i) => (
                <div key={i} className="rounded-lg p-3" style={{ backgroundColor: `${feedColorMap[e.color]}10`, borderLeft: `2px solid ${feedColorMap[e.color]}` }}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold" style={{ color: feedColorMap[e.color] }}>{e.date}</span>
                  </div>
                  <p className="text-[11px] text-[#CBD5E1] leading-relaxed">{e.text}</p>
                  <span className="text-[9px] text-[#8B949E] mt-1 block">Source: {e.source}</span>
                </div>
              ))}
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
      </SectionCard>

      {/* ═══ SECTION 4: REGULATORY ═══ */}
      <SectionCard title="Regulatory Intelligence & Filing Activity" icon={Shield} borderColor="#EF4444">
        <div className="flex flex-wrap gap-3 mb-5">
          <StatChip label="ADV Amendments (12m)" value={`${regulatory.advAmendments12m}`} color="#EF4444" badge={`Above avg of ${regulatory.advAvg}`} />
          <StatChip label="Form D Filings" value={regulatory.formDFilings} color="#F59E0B" />
          <StatChip label="FINRA Flags (Key Personnel)" value={String(regulatory.finraFlags)} color="#EF4444" />
          <StatChip label="SEC Actions" value={regulatory.secActions} color="#EF4444" />
          <StatChip label="OFAC/Sanctions" value={regulatory.ofac} color="#22C55E" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* ADV Timeline */}
          <div>
            <h4 className="text-xs font-bold text-foreground uppercase tracking-wider mb-3">ADV Amendment Timeline</h4>
            <div className="space-y-4">
              {regulatory.advTimeline.map((item, i) => (
                <div key={i} className="relative pl-5">
                  <div className="absolute left-0 top-1 w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.flagColor === "red" ? "#EF4444" : "#F59E0B" }} />
                  {i < regulatory.advTimeline.length - 1 && <div className="absolute left-[4px] top-4 w-px h-full bg-[#30363D]" />}
                  <span className="text-[10px] font-bold text-[#CBD5E1]">{item.date}: {item.label}</span>
                  <p className="text-[11px] text-[#8B949E] mt-1 leading-relaxed">{item.description}</p>
                  <span className="text-[9px] font-bold mt-1 block" style={{ color: item.flagColor === "red" ? "#EF4444" : "#F59E0B" }}>Flag: {item.flag}</span>
                </div>
              ))}
            </div>
          </div>
          {/* BrokerCheck */}
          <div>
            <h4 className="text-xs font-bold text-foreground uppercase tracking-wider mb-3">FINRA BrokerCheck — Key Personnel</h4>
            <div className="space-y-4">
              {regulatory.brokerCheck.map((person, i) => (
                <div key={i} className="bg-[#0D1117] border border-[#30363D] rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold text-foreground">{person.name}</span>
                    <span className="text-[9px] text-[#8B949E]">({person.role})</span>
                  </div>
                  {person.disclosures.map((d, j) => (
                    <div key={j} className="text-[11px] space-y-1">
                      <p className="text-[#8B949E]">Disclosures: 1 {d.type.toLowerCase()}</p>
                      <p className="text-[#CBD5E1]">{d.detail}</p>
                      {d.amount && <p className="text-[#CBD5E1]">Amount: {d.amount}</p>}
                      <p className="text-[#F59E0B] font-medium">Status: {d.status}</p>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
          {/* Form D & OFAC */}
          <div>
            <h4 className="text-xs font-bold text-foreground uppercase tracking-wider mb-3">Form D & Fund Activity</h4>
            <div className="bg-[#0D1117] border border-[#30363D] rounded-lg p-3 space-y-2 text-[11px]">
              <p className="font-bold text-foreground">{regulatory.formDDetail.fundName}</p>
              <p className="text-[#8B949E]">Form D filed: {regulatory.formDDetail.filed}</p>
              <p className="text-[#8B949E]">Amount sought: {regulatory.formDDetail.amountSought}</p>
              <p className="text-[#8B949E]">Amount raised to date: {regulatory.formDDetail.amountRaised}</p>
              <p className="text-[#F59E0B] italic mt-1">Note: {regulatory.formDDetail.note}</p>
            </div>
            <div className="mt-4">
              <h4 className="text-xs font-bold text-foreground uppercase tracking-wider mb-3">OFAC/Sanctions Screening</h4>
              <div className="bg-[#0D1117] border border-[#30363D] rounded-lg p-3 space-y-1.5 text-[11px]">
                <p className="text-[#CBD5E1]">All key personnel: <span className="text-[#22C55E] font-bold">{regulatory.ofacDetail.personnel}</span></p>
                <p className="text-[#CBD5E1]">All known affiliates: <span className="text-[#22C55E] font-bold">{regulatory.ofacDetail.affiliates}</span></p>
                <p className="text-[#8B949E]">Last screened: {regulatory.ofacDetail.lastScreened}</p>
                <p className="text-[#CBD5E1]">State AG Actions: <span className="text-[#22C55E] font-bold">{regulatory.ofacDetail.stateAG}</span></p>
              </div>
            </div>
          </div>
        </div>
      </SectionCard>

      {/* ═══ SECTION 5: WEB PRESENCE ═══ */}
      <SectionCard title="Web Presence & Operational Intelligence" icon={Globe} borderColor="#06B6D4">
        <div className="flex flex-wrap gap-3 mb-5">
          <StatChip label="Website Changes (90d)" value={String(webPresence.websiteChanges90d)} color="#F59E0B" badge="detected" />
          <StatChip label="Press Releases (90d)" value={String(webPresence.pressReleases90d)} color="#EF4444" badge="silence signal" />
          <StatChip label="Conference Appearances (12m)" value={`${webPresence.conferences12m}`} color="#EF4444" badge={`below peer avg of ${webPresence.conferencePeerAvg}`} />
          <StatChip label="Media Mentions (TV/Podcast)" value={String(webPresence.mediaMentions)} color="#EF4444" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Left: Website Changes + Domain */}
          <div>
            <h4 className="text-xs font-bold text-foreground uppercase tracking-wider mb-3">Website Change Detection</h4>
            <div className="space-y-3">
              {webPresence.websiteChanges.map((c, i) => (
                <div key={i} className="rounded-lg p-3" style={{ backgroundColor: `${feedColorMap[c.color]}10`, borderLeft: `2px solid ${feedColorMap[c.color]}` }}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold" style={{ color: feedColorMap[c.color] }}>{c.date} — {c.section}</span>
                  </div>
                  <p className="text-[11px] text-[#CBD5E1] leading-relaxed">{c.description}</p>
                  <span className="text-[9px] text-[#8B949E] mt-1 block">Diff: {c.diff}</span>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <h4 className="text-xs font-bold text-foreground uppercase tracking-wider mb-3">Domain & Infrastructure</h4>
              <div className="bg-[#0D1117] border border-[#30363D] rounded-lg p-3 text-[11px] grid grid-cols-2 gap-2">
                <p className="text-[#8B949E]">Domain: <span className="text-foreground">{webPresence.domain.domain}</span></p>
                <p className="text-[#8B949E]">Registered: <span className="text-foreground">{webPresence.domain.registered}</span></p>
                <p className="text-[#8B949E]">Renews: <span className="text-foreground">{webPresence.domain.renews}</span></p>
                <p className="text-[#8B949E]">SSL: <span className="text-[#22C55E]">{webPresence.domain.ssl}</span></p>
                <p className="text-[#8B949E]">Hosting: <span className="text-[#22C55E]">{webPresence.domain.hosting}</span></p>
                <p className="text-[#8B949E]">Last change: <span className="text-foreground">{webPresence.domain.lastChange}</span></p>
              </div>
            </div>
          </div>
          {/* Right: Conferences + Media + Press Releases */}
          <div>
            <h4 className="text-xs font-bold text-foreground uppercase tracking-wider mb-3">Conference & Media Appearances</h4>
            <div className="space-y-3">
              {webPresence.conferences.map((c, i) => (
                <div key={i} className="bg-[#0D1117] border border-[#30363D] rounded-lg p-3">
                  <span className="text-[10px] font-bold text-[#C9A84C]">{c.date} — {c.event}</span>
                  <p className="text-[11px] text-[#CBD5E1] mt-1">{c.appearance}</p>
                  <p className="text-[10px] text-[#8B949E] mt-1 italic">{c.tone}</p>
                  {c.reach && <span className="text-[9px] text-[#8B949E]">Reach: {c.reach}</span>}
                  {c.signal && <span className="text-[9px] text-[#F59E0B] ml-2">Signal: {c.signal}</span>}
                </div>
              ))}
            </div>
            <div className="mt-4">
              <h4 className="text-[10px] font-bold text-foreground uppercase tracking-wider mb-2">TV & Podcast Appearances (12 months)</h4>
              <div className="space-y-1">
                {webPresence.tvPodcast.map((t, i) => (
                  <p key={i} className="text-[11px] text-[#8B949E]">{t.outlet}: <span className="text-[#CBD5E1]">{t.appearances}</span></p>
                ))}
              </div>
              <p className="text-[10px] text-[#F59E0B] italic mt-2">{webPresence.mediaNote}</p>
            </div>
            <div className="mt-4">
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
      </SectionCard>

      {/* ═══ SECTIONS 6-13 ═══ */}
      <IntelligenceSections6to13 />

      {/* ═══ INTELLIGENCE SUMMARY BANNER ═══ */}
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
    </div>
  );
};

export default IntelligenceTab;
