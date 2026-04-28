import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Check } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
  AreaChart, Area, CartesianGrid, Legend, ReferenceLine, Line, ComposedChart,
} from "recharts";

/* ═══════════ TAB 1: CASH & BALANCES ═══════════ */

const cashKpis = [
  { label: "Total Cash & Equivalents", value: "$2.14B", color: "#C9A84C" },
  { label: "Money Market Holdings", value: "$1.31B", sub: "61% of cash", color: "#3B82F6" },
  { label: "Uninvested Cash", value: "$830M", color: "#F59E0B" },
  { label: "Weighted Cash Yield", value: "5.12%", sub: "annualized", color: "#22C55E" },
  { label: "Cash as % of Total NAV", value: "8.1%", color: "#6B7280" },
];

const cashByManager = [
  { name: "Tundra Macro", value: 770, status: "green" },
  { name: "Arcturus Capital", value: 504, status: "green" },
  { name: "Northgate Event", value: 396, status: "green" },
  { name: "Solaris Private Credit", value: 162, status: "green" },
  { name: "Ironwood Systematic", value: 142, status: "amber" },
  { name: "Vega Special Sits", value: 77, status: "red" },
  { name: "Meridian Capital", value: 63, status: "amber" },
  { name: "Helix Credit", value: 28, status: "red" },
];

const cashComposition = [
  { name: "Money Market Funds", value: 61, color: "#3B82F6" },
  { name: "T-Bills <90 days", value: 19, color: "#22C55E" },
  { name: "Bank Deposits", value: 12, color: "#C9A84C" },
  { name: "Uninvested Cash", value: 8, color: "#F59E0B" },
];

const mmfTable = [
  { fund: "Fidelity Government MMF", provider: "Fidelity", balance: 412, yield7d: "5.18%", maturity: "Overnight", rating: "AAA", liq: "Daily" },
  { fund: "Vanguard Federal MMF", provider: "Vanguard", balance: 338, yield7d: "5.09%", maturity: "Overnight", rating: "AAA", liq: "Daily" },
  { fund: "BlackRock Liquid Envir", provider: "BlackRock", balance: 289, yield7d: "5.21%", maturity: "Overnight", rating: "AAA", liq: "Daily" },
  { fund: "JPM Prime MMF", provider: "JPMorgan", balance: 271, yield7d: "5.31%", maturity: "7-day", rating: "AA+", liq: "Weekly" },
];

function barColor(s: string) { return s === "red" ? "#EF4444" : s === "amber" ? "#F59E0B" : "#22C55E"; }

function CashTab() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-5 gap-4">
        {cashKpis.map(k => (
          <Card key={k.label} className="bg-[#161B22] border-[#30363D]">
            <CardContent className="p-4 space-y-1">
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{k.label}</p>
              <p className="text-xl font-bold" style={{ color: k.color }}>{k.value}</p>
              {k.sub && <p className="text-[10px] text-muted-foreground">{k.sub}</p>}
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-[#161B22] border-[#30363D]">
          <CardHeader className="pb-2"><CardTitle className="text-sm text-[#C9A84C]">Cash Balance by Manager</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={cashByManager} layout="vertical" margin={{ left: 110 }}>
                <XAxis type="number" tick={{ fill: "#8b949e", fontSize: 11 }} />
                <YAxis type="category" dataKey="name" tick={{ fill: "#8b949e", fontSize: 10 }} width={110} />
                <Tooltip contentStyle={{ background: "#161B22", border: "1px solid #30363D", color: "#fff", fontSize: 11 }} formatter={(v: number) => `$${v}M`} />
                <ReferenceLine x={100} stroke="#EF4444" strokeDasharray="4 4" label={{ value: "Min Cash Target $100M", fill: "#EF4444", fontSize: 9, position: "insideTopRight" }} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {cashByManager.map(d => <Cell key={d.name} fill={barColor(d.status)} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="bg-[#161B22] border-[#30363D]">
          <CardHeader className="pb-2"><CardTitle className="text-sm text-[#C9A84C]">Cash Composition</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={cashComposition} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value" label={({ name, value }) => `${name} ${value}%`} labelLine={false}>
                  {cashComposition.map(s => <Cell key={s.name} fill={s.color} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "#161B22", border: "1px solid #30363D", color: "#fff", fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      <Card className="bg-[#161B22] border-[#30363D]">
        <CardHeader className="pb-2"><CardTitle className="text-sm text-[#C9A84C]">Money Market Fund Detail</CardTitle></CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-xs">
            <thead><tr className="border-b border-[#30363D] text-muted-foreground">
              {["Fund Name","Provider","Balance ($M)","7-Day Yield","Maturity","Rating","Liquidity"].map(h => <th key={h} className="px-4 py-2 text-left font-medium">{h}</th>)}
            </tr></thead>
            <tbody>
              {mmfTable.map(r => (
                <tr key={r.fund} className="border-b border-[#30363D]/50 hover:bg-[#0D1117]/60">
                  <td className="px-4 py-2 text-foreground font-medium">{r.fund}</td>
                  <td className="px-4 py-2 text-muted-foreground">{r.provider}</td>
                  <td className="px-4 py-2 text-foreground">${r.balance}M</td>
                  <td className="px-4 py-2 text-[#22C55E]">{r.yield7d}</td>
                  <td className="px-4 py-2 text-muted-foreground">{r.maturity}</td>
                  <td className="px-4 py-2 text-foreground">{r.rating}</td>
                  <td className="px-4 py-2 text-muted-foreground">{r.liq}</td>
                </tr>
              ))}
              <tr className="border-t border-[#C9A84C]/30 font-semibold text-[#C9A84C]">
                <td className="px-4 py-2">Total</td><td /><td className="px-4 py-2">$1,310M</td><td className="px-4 py-2">Avg 5.20%</td><td /><td /><td />
              </tr>
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}

/* ═══════════ TAB 2: BUYING POWER ═══════════ */

const bpKpis = [
  { label: "Total Available Buying Power", value: "$4.83B", color: "#C9A84C" },
  { label: "Margin Capacity Remaining", value: "$2.71B", color: "#C9A84C" },
  { label: "Credit Facility Undrawn", value: "$1.50B", color: "#3B82F6" },
  { label: "Leverage Ratio (Portfolio)", value: "1.34x", color: "#F59E0B" },
];

const waterfallData = [
  { name: "Starting NAV", value: 26500, total: 26500, fill: "#C9A84C" },
  { name: "Less: Illiquid", value: -4200, total: 22300, fill: "#EF4444" },
  { name: "Less: Locked Capital", value: -2800, total: 19500, fill: "#EF4444" },
  { name: "Less: Margin Posted", value: -1600, total: 17900, fill: "#EF4444" },
  { name: "Plus: Credit Facility", value: 1500, total: 19400, fill: "#22C55E" },
  { name: "Plus: Undrawn Commits", value: 800, total: 20200, fill: "#22C55E" },
  { name: "Net Buying Power", value: 4830, total: 4830, fill: "#C9A84C" },
];

// waterfall needs base + visible
const waterfallBars = waterfallData.map((d, i) => {
  if (i === 0) return { ...d, base: 0, bar: d.total };
  if (i === waterfallData.length - 1) return { ...d, base: 0, bar: d.total };
  const prev = waterfallData[i - 1].total;
  if (d.value < 0) return { ...d, base: prev + d.value, bar: -d.value };
  return { ...d, base: prev, bar: d.value };
});

const marginByMgr = [
  { name: "Helix Credit", value: 67 },
  { name: "Meridian Capital", value: 41 },
  { name: "Vega Special Sits", value: 38 },
  { name: "Northgate Event", value: 29 },
  { name: "Tundra Macro", value: 25 },
  { name: "Ironwood Systematic", value: 22 },
  { name: "Arcturus Capital", value: 18 },
  { name: "Solaris Private Credit", value: 12 },
];

function genBPTimeline() {
  const data: { day: string; bp: number; deployed: number }[] = [];
  let bp = 4800, dep = 21700;
  for (let i = 0; i < 90; i++) {
    const d = new Date(2026, 0, 8 + i);
    const label = `${d.getMonth() + 1}/${d.getDate()}`;
    const noise = (Math.random() - 0.5) * 150;
    // dip event around day 47 (late Feb)
    const dip = (i >= 45 && i <= 52) ? -600 + (i - 45) * 80 : 0;
    bp = Math.max(4200, Math.min(5400, bp + noise + dip));
    dep = 26500 - bp - 1500 + (Math.random() - 0.5) * 100;
    data.push({ day: label, bp: +bp.toFixed(0), deployed: +dep.toFixed(0) });
  }
  return data;
}
const bpTimeline = genBPTimeline();

function BuyingPowerTab() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-4">
        {bpKpis.map(k => (
          <Card key={k.label} className="bg-[#161B22] border-[#30363D]">
            <CardContent className="p-4 space-y-1">
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{k.label}</p>
              <p className="text-xl font-bold" style={{ color: k.color }}>{k.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-[#161B22] border-[#30363D]">
          <CardHeader className="pb-2"><CardTitle className="text-sm text-[#C9A84C]">Available Capital Decomposition</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={waterfallBars} margin={{ bottom: 30 }}>
                <XAxis dataKey="name" tick={{ fill: "#8b949e", fontSize: 8 }} angle={-20} textAnchor="end" />
                <YAxis tick={{ fill: "#8b949e", fontSize: 10 }} tickFormatter={v => `$${(v / 1000).toFixed(1)}B`} />
                <Tooltip contentStyle={{ background: "#161B22", border: "1px solid #30363D", color: "#fff", fontSize: 11 }} formatter={(v: number) => `$${(v / 1000).toFixed(2)}B`} />
                <Bar dataKey="base" stackId="a" fill="transparent" />
                <Bar dataKey="bar" stackId="a" radius={[4, 4, 0, 0]}>
                  {waterfallBars.map(d => <Cell key={d.name} fill={d.fill} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="bg-[#161B22] border-[#30363D]">
          <CardHeader className="pb-2"><CardTitle className="text-sm text-[#C9A84C]">Margin Utilization by Manager</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={marginByMgr} layout="vertical" margin={{ left: 110 }}>
                <XAxis type="number" domain={[0, 80]} tick={{ fill: "#8b949e", fontSize: 11 }} tickFormatter={v => `${v}%`} />
                <YAxis type="category" dataKey="name" tick={{ fill: "#8b949e", fontSize: 10 }} width={110} />
                <Tooltip contentStyle={{ background: "#161B22", border: "1px solid #30363D", color: "#fff", fontSize: 11 }} formatter={(v: number) => `${v}%`} />
                <ReferenceLine x={35} stroke="#F59E0B" strokeDasharray="4 4" label={{ value: "Watch", fill: "#F59E0B", fontSize: 9, position: "top" }} />
                <ReferenceLine x={60} stroke="#EF4444" strokeDasharray="4 4" label={{ value: "Limit", fill: "#EF4444", fontSize: 9, position: "top" }} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {marginByMgr.map(d => <Cell key={d.name} fill={d.value > 60 ? "#EF4444" : d.value >= 35 ? "#F59E0B" : "#22C55E"} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      <Card className="bg-[#161B22] border-[#30363D]">
        <CardHeader className="pb-2"><CardTitle className="text-sm text-[#C9A84C]">Rolling 90-Day Buying Power vs Deployment</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={bpTimeline}>
              <CartesianGrid strokeDasharray="3 3" stroke="#30363D" />
              <XAxis dataKey="day" tick={{ fill: "#8b949e", fontSize: 9 }} interval={14} />
              <YAxis tick={{ fill: "#8b949e", fontSize: 10 }} tickFormatter={v => `$${(v / 1000).toFixed(1)}B`} />
              <Tooltip contentStyle={{ background: "#161B22", border: "1px solid #30363D", color: "#fff", fontSize: 11 }} formatter={(v: number) => `$${(v / 1000).toFixed(2)}B`} />
              <Area type="monotone" dataKey="bp" name="Available Buying Power" stroke="#C9A84C" fill="rgba(201,168,76,0.15)" strokeWidth={2} />
              <Area type="monotone" dataKey="deployed" name="Capital Deployed" stroke="#3B82F6" fill="rgba(59,130,246,0.1)" strokeWidth={2} />
              <Legend wrapperStyle={{ fontSize: 10 }} />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}

/* ═══════════ TAB 3: CAPITAL CALLS ═══════════ */

const ccKpis = [
  { label: "Pending Capital Calls", value: "$380M", badge: "4 Active", badgeColor: "#EF4444" },
  { label: "Due Within 30 Days", value: "$215M", color: "#EF4444" },
  { label: "Due 31-90 Days", value: "$165M", color: "#F59E0B" },
  { label: "YTD Capital Called", value: "$1.24B", color: "#6B7280" },
];

const ccRows = [
  { fund: "Helix Credit Opportunities", strat: "Distressed", amount: "$85M", due: "Apr 15 2026", status: "URGENT", days: 7, cash: "$28M", action: "SHORTFALL", urgent: true },
  { fund: "Granite Point Capital", strat: "Distressed", amount: "$60M", due: "Apr 22 2026", status: "PENDING", days: 14, cash: "$142M", action: "FUNDED", urgent: false },
  { fund: "Solaris Private Credit", strat: "Private Credit", amount: "$45M", due: "May 1 2026", status: "PENDING", days: 23, cash: "$162M", action: "FUNDED", urgent: false },
  { fund: "Dune Credit Strategies", strat: "Distressed", amount: "$190M", due: "May 28 2026", status: "SCHEDULED", days: 50, cash: "$396M", action: "FUNDED", urgent: false },
];

const ccHistory = [
  { month: "May 25", calls: 180, distributions: 0 },
  { month: "Jun 25", calls: 95, distributions: 120 },
  { month: "Jul 25", calls: 220, distributions: 45 },
  { month: "Aug 25", calls: 145, distributions: 0 },
  { month: "Sep 25", calls: 310, distributions: 85 },
  { month: "Oct 25", calls: 85, distributions: 200 },
  { month: "Nov 25", calls: 195, distributions: 0 },
  { month: "Dec 25", calls: 260, distributions: 140 },
  { month: "Jan 26", calls: 110, distributions: 310 },
  { month: "Feb 26", calls: 175, distributions: 65 },
  { month: "Mar 26", calls: 340, distributions: 0 },
  { month: "Apr 26", calls: 85, distributions: 180 },
].map(d => ({ ...d, net: d.distributions - d.calls }));

function statusBadge(s: string) {
  const c = s === "URGENT" ? "bg-[#EF4444]/20 text-[#EF4444]" : s === "PENDING" ? "bg-[#F59E0B]/20 text-[#F59E0B]" : "bg-[#6B7280]/20 text-[#6B7280]";
  return <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${c}`}>{s}</span>;
}

function CapitalCallsTab() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-4">
        {ccKpis.map(k => (
          <Card key={k.label} className="bg-[#161B22] border-[#30363D]">
            <CardContent className="p-4 space-y-1">
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{k.label}</p>
              <div className="flex items-center gap-2">
                <p className="text-xl font-bold" style={{ color: k.color || "#C9A84C" }}>{k.value}</p>
                {k.badge && <span className="text-[9px] px-1.5 py-0.5 rounded font-semibold" style={{ background: `${k.badgeColor}22`, color: k.badgeColor }}>{k.badge}</span>}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card className="bg-[#161B22] border-[#30363D]">
        <CardHeader className="pb-2"><CardTitle className="text-sm text-[#C9A84C]">Active Capital Call Schedule</CardTitle></CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-xs">
            <thead><tr className="border-b border-[#30363D] text-muted-foreground">
              {["Fund","Strategy","Amount","Due Date","Status","Days Until Due","Cash Available","Action"].map(h => <th key={h} className="px-3 py-2 text-left font-medium">{h}</th>)}
            </tr></thead>
            <tbody>
              {ccRows.map(r => (
                <tr key={r.fund} className={`border-b border-[#30363D]/50 hover:bg-[#0D1117]/60 ${r.urgent ? "border-l-2 border-l-[#EF4444] animate-pulse" : ""}`}
                  style={r.urgent ? { background: "rgba(239,68,68,0.05)" } : {}}>
                  <td className="px-3 py-2 text-foreground font-medium">{r.fund}</td>
                  <td className="px-3 py-2 text-muted-foreground">{r.strat}</td>
                  <td className="px-3 py-2 text-foreground">{r.amount}</td>
                  <td className="px-3 py-2 text-muted-foreground">{r.due}</td>
                  <td className="px-3 py-2">{statusBadge(r.status)}</td>
                  <td className="px-3 py-2 text-foreground">{r.days} days</td>
                  <td className="px-3 py-2 text-foreground">{r.cash}</td>
                  <td className="px-3 py-2">
                    {r.action === "SHORTFALL"
                      ? <span className="flex items-center gap-1 text-[#EF4444] font-semibold text-[10px]"><AlertTriangle className="h-3 w-3" /> SHORTFALL</span>
                      : <span className="flex items-center gap-1 text-[#22C55E] font-semibold text-[10px]"><Check className="h-3 w-3" /> FUNDED</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
      <Card className="bg-[#161B22] border-[#30363D]">
        <CardHeader className="pb-2"><CardTitle className="text-sm text-[#C9A84C]">Monthly Capital Calls vs Distributions — TTM</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={280}>
            <ComposedChart data={ccHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="#30363D" />
              <XAxis dataKey="month" tick={{ fill: "#8b949e", fontSize: 10 }} />
              <YAxis tick={{ fill: "#8b949e", fontSize: 10 }} tickFormatter={v => `$${v}M`} />
              <Tooltip contentStyle={{ background: "#161B22", border: "1px solid #30363D", color: "#fff", fontSize: 11 }} />
              <Bar dataKey="calls" name="Calls" fill="#EF4444" radius={[2, 2, 0, 0]} />
              <Bar dataKey="distributions" name="Distributions" fill="#22C55E" radius={[2, 2, 0, 0]} />
              <Line type="monotone" dataKey="net" name="Net" stroke="#C9A84C" strokeWidth={2} dot={false} />
              <Legend wrapperStyle={{ fontSize: 10 }} />
            </ComposedChart>
          </ResponsiveContainer>
          <p className="text-[10px] text-muted-foreground mt-2 text-center">YTD Calls: $1,240M | YTD Distributions: $1,145M | Net: -$95M</p>
        </CardContent>
      </Card>
    </div>
  );
}

/* ═══════════ TAB 4: PE/VC PACING ═══════════ */

const peKpis = [
  { label: "Total Illiquid Commitments", value: "$6.8B", color: "#C9A84C" },
  { label: "Capital Called to Date", value: "$4.2B", sub: "62%", color: "#C9A84C" },
  { label: "Remaining Unfunded", value: "$2.6B", color: "#F59E0B" },
  { label: "Estimated NAV (Illiquid)", value: "$5.1B", sub: "TVPI 1.21x", color: "#22C55E" },
  { label: "Target Illiquid Alloc", value: "20% | Actual 19.2%", color: "#22C55E" },
];

const vintageData = [
  { year: "2019", called: 850, uncalled: 50, tvpi: 1.61 },
  { year: "2020", called: 720, uncalled: 80, tvpi: 1.43 },
  { year: "2021", called: 1100, uncalled: 100, tvpi: 1.28 },
  { year: "2022", called: 980, uncalled: 320, tvpi: 1.14 },
  { year: "2023", called: 620, uncalled: 480, tvpi: 1.08 },
  { year: "2024", called: 410, uncalled: 590, tvpi: 1.02 },
  { year: "2025", called: 120, uncalled: 980, tvpi: 1.00 },
];

const pacingData = [
  { q: "Q2 26", base: 165, bear: 220, bull: 110 },
  { q: "Q3 26", base: 180, bear: 245, bull: 120 },
  { q: "Q4 26", base: 195, bear: 260, bull: 135 },
  { q: "Q1 27", base: 210, bear: 280, bull: 145 },
  { q: "Q2 27", base: 185, bear: 255, bull: 130 },
  { q: "Q3 27", base: 175, bear: 240, bull: 120 },
  { q: "Q4 27", base: 160, bear: 215, bull: 110 },
  { q: "Q1 28", base: 145, bear: 190, bull: 100 },
  { q: "Q2 28", base: 130, bear: 170, bull: 90 },
  { q: "Q3 28", base: 115, bear: 145, bull: 80 },
  { q: "Q4 28", base: 100, bear: 120, bull: 75 },
  { q: "Q1 29", base: 85, bear: 95, bull: 65 },
];

const fundDetail = [
  { fund: "Arcturus PE Fund III", strat: "Buyout", vintage: 2019, commit: 400, called: 392, uncalled: 8, nav: 631, tvpi: 1.61, dpi: 0.82, moic: 1.61, irr: 18.4, status: "Harvesting" },
  { fund: "Meridian Ventures II", strat: "Venture", vintage: 2020, commit: 250, called: 228, uncalled: 22, nav: 326, tvpi: 1.43, dpi: 0.41, moic: 1.43, irr: 14.2, status: "Active" },
  { fund: "Ironwood Growth IV", strat: "Growth", vintage: 2021, commit: 500, called: 451, uncalled: 49, nav: 577, tvpi: 1.28, dpi: 0.28, moic: 1.28, irr: 11.7, status: "Active" },
  { fund: "Northgate Opps I", strat: "Special Sits", vintage: 2022, commit: 350, called: 298, uncalled: 52, nav: 340, tvpi: 1.14, dpi: 0.09, moic: 1.14, irr: 9.3, status: "Investing" },
  { fund: "Solaris Credit Fund", strat: "Private Credit", vintage: 2022, commit: 200, called: 156, uncalled: 44, nav: 178, tvpi: 1.14, dpi: 0.31, moic: 1.14, irr: 8.8, status: "Active" },
  { fund: "Helix Distressed III", strat: "Distressed", vintage: 2023, commit: 300, called: 198, uncalled: 102, nav: 214, tvpi: 1.08, dpi: 0.00, moic: 1.08, irr: 6.1, status: "Investing" },
  { fund: "Vega Special II", strat: "Special Sits", vintage: 2024, commit: 280, called: 142, uncalled: 138, nav: 145, tvpi: 1.02, dpi: 0.00, moic: 1.02, irr: 2.4, status: "Early" },
  { fund: "Tundra Real Assets", strat: "Real Assets", vintage: 2025, commit: 450, called: 98, uncalled: 352, nav: 100, tvpi: 1.00, dpi: 0.00, moic: 1.00, irr: 0.0, status: "Funding" },
];

function tvpiColor(v: number) { return v > 1.2 ? "text-[#22C55E]" : v >= 1.0 ? "text-[#F59E0B]" : "text-[#EF4444]"; }
function moicColor(v: number) { return v >= 1.5 ? "text-[#22C55E]" : v >= 1.0 ? "text-[#C9A84C]" : "text-[#EF4444]"; }
function irrColor(v: number) { return v >= 15 ? "text-[#22C55E]" : v >= 8 ? "text-[#C9A84C]" : "text-[#EF4444]"; }

function PEPacingTab() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-5 gap-4">
        {peKpis.map(k => (
          <Card key={k.label} className="bg-[#161B22] border-[#30363D]">
            <CardContent className="p-4 space-y-1">
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{k.label}</p>
              <p className="text-xl font-bold" style={{ color: k.color }}>{k.value}</p>
              {k.sub && <p className="text-[10px] text-muted-foreground">{k.sub}</p>}
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-[#161B22] border-[#30363D]">
          <CardHeader className="pb-2"><CardTitle className="text-sm text-[#C9A84C]">Called vs Uncalled by Vintage Year</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={vintageData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#30363D" />
                <XAxis dataKey="year" tick={{ fill: "#8b949e", fontSize: 11 }} />
                <YAxis yAxisId="left" tick={{ fill: "#8b949e", fontSize: 10 }} tickFormatter={v => `$${v}M`} />
                <YAxis yAxisId="right" orientation="right" tick={{ fill: "#8b949e", fontSize: 10 }} tickFormatter={v => `${v}x`} domain={[0.8, 1.8]} />
                <Tooltip contentStyle={{ background: "#161B22", border: "1px solid #30363D", color: "#fff", fontSize: 11 }} />
                <Bar yAxisId="left" dataKey="called" name="Called" fill="#C9A84C" radius={[2, 2, 0, 0]} />
                <Bar yAxisId="left" dataKey="uncalled" name="Uncalled" fill="#30363D" radius={[2, 2, 0, 0]} />
                <Line yAxisId="right" type="monotone" dataKey="tvpi" name="TVPI" stroke="#22C55E" strokeWidth={2} dot={{ fill: "#22C55E", r: 3 }} />
                <Legend wrapperStyle={{ fontSize: 10 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="bg-[#161B22] border-[#30363D]">
          <CardHeader className="pb-2"><CardTitle className="text-sm text-[#C9A84C]">Projected Capital Calls — Next 36 Months</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={pacingData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#30363D" />
                <XAxis dataKey="q" tick={{ fill: "#8b949e", fontSize: 9 }} />
                <YAxis tick={{ fill: "#8b949e", fontSize: 10 }} tickFormatter={v => `$${v}M`} />
                <Tooltip contentStyle={{ background: "#161B22", border: "1px solid #30363D", color: "#fff", fontSize: 11 }} />
                <Area type="monotone" dataKey="bear" name="Bear Case" stroke="#EF4444" fill="rgba(239,68,68,0.05)" strokeDasharray="5 3" strokeWidth={1.5} />
                <Area type="monotone" dataKey="base" name="Base Case" stroke="#C9A84C" fill="rgba(201,168,76,0.15)" strokeWidth={2} />
                <Area type="monotone" dataKey="bull" name="Bull Case" stroke="#22C55E" fill="rgba(34,197,94,0.05)" strokeDasharray="5 3" strokeWidth={1.5} />
                <Legend wrapperStyle={{ fontSize: 10 }} />
              </AreaChart>
            </ResponsiveContainer>
            <p className="text-[10px] text-muted-foreground italic mt-1">Peak call period Q3 2026 - Q2 2027</p>
          </CardContent>
        </Card>
      </div>
      <Card className="bg-[#161B22] border-[#30363D]">
        <CardHeader className="pb-2"><CardTitle className="text-sm text-[#C9A84C]">Fund-Level Commitment Detail</CardTitle></CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead><tr className="border-b border-[#30363D] text-muted-foreground">
                {["Fund","Strategy","Vintage","Commitment","Called","Uncalled","NAV","TVPI","DPI","MOIC","IRR (Net)","Status"].map(h => <th key={h} className="px-3 py-2 text-left font-medium">{h}</th>)}
              </tr></thead>
              <tbody>
                {fundDetail.map(r => (
                  <tr key={r.fund} className="border-b border-[#30363D]/50 hover:bg-[#0D1117]/60">
                    <td className="px-3 py-2 text-foreground font-medium">{r.fund}</td>
                    <td className="px-3 py-2 text-muted-foreground">{r.strat}</td>
                    <td className="px-3 py-2 text-foreground">{r.vintage}</td>
                    <td className="px-3 py-2 text-foreground">${r.commit}M</td>
                    <td className="px-3 py-2 text-foreground">${r.called}M</td>
                    <td className="px-3 py-2 text-foreground">${r.uncalled}M</td>
                    <td className="px-3 py-2 text-foreground">${r.nav}M</td>
                    <td className={`px-3 py-2 font-semibold ${tvpiColor(r.tvpi)}`}>{r.tvpi.toFixed(2)}x</td>
                    <td className="px-3 py-2 text-muted-foreground">{r.dpi.toFixed(2)}x</td>
                    <td className={`px-3 py-2 font-semibold ${moicColor(r.moic)}`}>{r.moic.toFixed(2)}x</td>
                    <td className={`px-3 py-2 font-semibold ${irrColor(r.irr)}`}>{r.irr.toFixed(1)}%</td>
                    <td className="px-3 py-2 text-muted-foreground">{r.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/* ═══════════ TAB 5: LIQUIDITY STRESS ═══════════ */

const stressKpis = [
  { label: "Liquidity Coverage Ratio", value: "2.14x", sub: "Adequate", color: "#22C55E" },
  { label: "Stressed Liquidity Gap (30-day)", value: "+$842M surplus", color: "#22C55E" },
  { label: "Gate Risk Exposure", value: "$1.8B", sub: "3 managers with redemption gates", color: "#F59E0B" },
];

const liquidityLadder = [
  { name: "Arcturus Capital", daily: 15, weekly: 25, monthly: 30, quarterly: 20, annual: 5, locked: 5 },
  { name: "Meridian Capital", daily: 10, weekly: 20, monthly: 35, quarterly: 25, annual: 5, locked: 5 },
  { name: "Ironwood Systematic", daily: 20, weekly: 30, monthly: 30, quarterly: 15, annual: 3, locked: 2 },
  { name: "Helix Credit", daily: 5, weekly: 5, monthly: 10, quarterly: 20, annual: 20, locked: 40 },
  { name: "Northgate Event", daily: 12, weekly: 18, monthly: 35, quarterly: 25, annual: 5, locked: 5 },
  { name: "Solaris Private", daily: 0, weekly: 0, monthly: 5, quarterly: 10, annual: 25, locked: 60 },
  { name: "Tundra Macro", daily: 18, weekly: 28, monthly: 32, quarterly: 18, annual: 2, locked: 2 },
  { name: "Vega Special Sits", daily: 8, weekly: 12, monthly: 25, quarterly: 30, annual: 15, locked: 10 },
];

const stressWaterfall = [
  { name: "Available Liquidity", value: 4830, base: 0, bar: 4830, fill: "#C9A84C" },
  { name: "Capital Calls", value: -380, base: 4450, bar: 380, fill: "#EF4444" },
  { name: "Redemption Gates", value: -1800, base: 2650, bar: 1800, fill: "#EF4444" },
  { name: "Margin Call (2σ)", value: -920, base: 1730, bar: 920, fill: "#EF4444" },
  { name: "Operational Reserve", value: -250, base: 1480, bar: 250, fill: "#EF4444" },
  { name: "Net Stressed Liquidity", value: 1480, base: 0, bar: 1480, fill: "#22C55E" },
];

const gateRows = [
  { mgr: "Helix Credit Opportunities", gate: "15% quarterly", aum: "$2.3B", trigger: "$345M redemption", notice: "90 days", risk: "HIGH" },
  { mgr: "Solaris Private Credit", gate: "10% quarterly", aum: "$900M", trigger: "$90M redemption", notice: "60 days", risk: "MEDIUM" },
  { mgr: "Granite Point Capital", gate: "20% quarterly", aum: "$1.3B", trigger: "$260M redemption", notice: "90 days", risk: "MEDIUM" },
];

function LiquidityStressTab() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        {stressKpis.map(k => (
          <Card key={k.label} className="bg-[#161B22] border-[#30363D]">
            <CardContent className="p-4 space-y-1">
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{k.label}</p>
              <p className="text-xl font-bold" style={{ color: k.color }}>{k.value}</p>
              {k.sub && <p className="text-[10px] text-muted-foreground">{k.sub}</p>}
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-[#161B22] border-[#30363D]">
          <CardHeader className="pb-2"><CardTitle className="text-sm text-[#C9A84C]">Liquidity Profile by Redemption Window</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={liquidityLadder} layout="vertical" margin={{ left: 100 }}>
                <XAxis type="number" domain={[0, 100]} tick={{ fill: "#8b949e", fontSize: 10 }} tickFormatter={v => `${v}%`} />
                <YAxis type="category" dataKey="name" tick={{ fill: "#8b949e", fontSize: 9 }} width={100} />
                <Tooltip contentStyle={{ background: "#161B22", border: "1px solid #30363D", color: "#fff", fontSize: 11 }} formatter={(v: number) => `${v}%`} />
                <Bar dataKey="daily" name="Daily" stackId="a" fill="#22C55E" />
                <Bar dataKey="weekly" name="Weekly" stackId="a" fill="#4ADE80" />
                <Bar dataKey="monthly" name="Monthly" stackId="a" fill="#C9A84C" />
                <Bar dataKey="quarterly" name="Quarterly" stackId="a" fill="#F59E0B" />
                <Bar dataKey="annual" name="Annual" stackId="a" fill="#F97316" />
                <Bar dataKey="locked" name="Locked" stackId="a" fill="#EF4444" />
                <Legend wrapperStyle={{ fontSize: 9 }} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="bg-[#161B22] border-[#30363D]">
          <CardHeader className="pb-2"><CardTitle className="text-sm text-[#C9A84C]">Stressed Cash Need vs Available Liquidity</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={stressWaterfall} margin={{ bottom: 30 }}>
                <XAxis dataKey="name" tick={{ fill: "#8b949e", fontSize: 8 }} angle={-15} textAnchor="end" />
                <YAxis tick={{ fill: "#8b949e", fontSize: 10 }} tickFormatter={v => `$${(v / 1000).toFixed(1)}B`} />
                <Tooltip contentStyle={{ background: "#161B22", border: "1px solid #30363D", color: "#fff", fontSize: 11 }} formatter={(v: number) => `$${(v / 1000).toFixed(2)}B`} />
                <Bar dataKey="base" stackId="a" fill="transparent" />
                <Bar dataKey="bar" stackId="a" radius={[4, 4, 0, 0]}>
                  {stressWaterfall.map(d => <Cell key={d.name} fill={d.fill} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      <Card className="bg-[#161B22] border-[#30363D]">
        <CardHeader className="pb-2"><CardTitle className="text-sm text-[#C9A84C]">Managers with Redemption Gate Provisions</CardTitle></CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-xs">
            <thead><tr className="border-b border-[#30363D] text-muted-foreground">
              {["Manager","Gate Threshold","Current AUM","Gate Triggered At","Notice Period","Risk Level"].map(h => <th key={h} className="px-4 py-2 text-left font-medium">{h}</th>)}
            </tr></thead>
            <tbody>
              {gateRows.map(r => (
                <tr key={r.mgr} className="border-b border-[#30363D]/50 hover:bg-[#0D1117]/60">
                  <td className="px-4 py-2 text-foreground font-medium">{r.mgr}</td>
                  <td className="px-4 py-2 text-muted-foreground">{r.gate}</td>
                  <td className="px-4 py-2 text-foreground">{r.aum}</td>
                  <td className="px-4 py-2 text-muted-foreground">{r.trigger}</td>
                  <td className="px-4 py-2 text-muted-foreground">{r.notice}</td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${r.risk === "HIGH" ? "bg-[#EF4444]/20 text-[#EF4444]" : "bg-[#F59E0B]/20 text-[#F59E0B]"}`}>{r.risk}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
      <Card className="bg-[#F59E0B]/10 border-[#F59E0B]/30">
        <CardContent className="py-3 px-6">
          <p className="text-xs text-[#F59E0B] flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
            <span><strong>Liquidity Advisory:</strong> Helix Credit gate risk combined with $85M capital call due Apr 15 creates a potential $113M funding gap. Recommend immediate review and standby credit facility activation.</span>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

/* ═══════════ MAIN PAGE ═══════════ */

export default function Liquidity() {
  return (
    <div className="p-6 space-y-4 bg-[#0D1117] min-h-full">
      <Tabs defaultValue="cash" className="w-full">
        <TabsList className="bg-[#161B22] border border-[#30363D]">
          <TabsTrigger value="cash" className="text-xs data-[state=active]:bg-[#C9A84C]/20 data-[state=active]:text-[#C9A84C]">CASH & BALANCES</TabsTrigger>
          <TabsTrigger value="buying" className="text-xs data-[state=active]:bg-[#C9A84C]/20 data-[state=active]:text-[#C9A84C]">BUYING POWER</TabsTrigger>
          <TabsTrigger value="calls" className="text-xs data-[state=active]:bg-[#C9A84C]/20 data-[state=active]:text-[#C9A84C]">CAPITAL CALLS</TabsTrigger>
          <TabsTrigger value="pacing" className="text-xs data-[state=active]:bg-[#C9A84C]/20 data-[state=active]:text-[#C9A84C]">PE/VC PACING</TabsTrigger>
          <TabsTrigger value="stress" className="text-xs data-[state=active]:bg-[#C9A84C]/20 data-[state=active]:text-[#C9A84C]">LIQUIDITY STRESS</TabsTrigger>
        </TabsList>
        <TabsContent value="cash"><CashTab /></TabsContent>
        <TabsContent value="buying"><BuyingPowerTab /></TabsContent>
        <TabsContent value="calls"><CapitalCallsTab /></TabsContent>
        <TabsContent value="pacing"><PEPacingTab /></TabsContent>
        <TabsContent value="stress"><LiquidityStressTab /></TabsContent>
      </Tabs>
    </div>
  );
}
