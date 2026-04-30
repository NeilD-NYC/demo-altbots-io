import { useState, useEffect, useRef, useMemo } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Check } from "lucide-react";
import { useMarketSimulation, SimKeyConfig } from "@/hooks/useMarketSimulation";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
  AreaChart, Area, CartesianGrid, Legend, ReferenceLine, Line, ComposedChart,
} from "recharts";

/* ═══════════ FLASH CELL (local) ═══════════ */

function FlashCell({ value, children, className = "", tag = "td" }: { value: number; children: React.ReactNode; className?: string; tag?: "td" | "span" | "p" }) {
  const prevRef = useRef(value);
  const [flash, setFlash] = useState<"up" | "down" | null>(null);
  const keyRef = useRef(0);

  useEffect(() => {
    if (value !== prevRef.current) {
      setFlash(value > prevRef.current ? "up" : "down");
      keyRef.current++;
      prevRef.current = value;
      const t = setTimeout(() => setFlash(null), 650);
      return () => clearTimeout(t);
    }
  }, [value]);

  const Tag = tag;
  return (
    <Tag key={keyRef.current} className={`${className} ${flash === "up" ? "flash-up" : flash === "down" ? "flash-down" : ""}`}>
      {children}
    </Tag>
  );
}

/* ═══════════ TAB 1: CASH & BALANCES ═══════════ */

const cashByManagerBase = [
  { name: "Tundra Macro", value: 11.8, status: "green", key: "cash_tundra" },
  { name: "Arcturus Capital", value: 8.2, status: "green", key: "cash_arcturus" },
  { name: "Northgate Event", value: 5.8, status: "green", key: "cash_northgate" },
  { name: "Solaris Private Credit", value: 3.2, status: "green", key: "cash_solaris" },
  { name: "Ironwood Systematic", value: 3.6, status: "amber", key: "cash_ironwood" },
  { name: "Vega Special Sits", value: 1.4, status: "red", key: "cash_vega" },
  { name: "Meridian Capital", value: 1.1, status: "amber", key: "cash_meridian" },
  { name: "Helix Credit", value: 0.8, status: "red", key: "cash_helix" },
];

const cashComposition = [
  { name: "Money Market Funds", value: 61, color: "#3B82F6" },
  { name: "T-Bills <90 days", value: 19, color: "#22C55E" },
  { name: "Bank Deposits", value: 12, color: "#C9A84C" },
  { name: "Uninvested Cash", value: 8, color: "#F59E0B" },
];

const mmfTableBase = [
  { fund: "Fidelity Government MMF", provider: "Fidelity", balance: 6.0, yieldBase: 5.18, key: "mmf_fidelity", maturity: "Overnight", rating: "AAA", liq: "Daily" },
  { fund: "Vanguard Federal MMF", provider: "Vanguard", balance: 4.9, yieldBase: 5.09, key: "mmf_vanguard", maturity: "Overnight", rating: "AAA", liq: "Daily" },
  { fund: "BlackRock Liquid Envir", provider: "BlackRock", balance: 4.2, yieldBase: 5.21, key: "mmf_blackrock", maturity: "Overnight", rating: "AAA", liq: "Daily" },
  { fund: "JPM Prime MMF", provider: "JPMorgan", balance: 3.9, yieldBase: 5.31, key: "mmf_jpm", maturity: "7-day", rating: "AA+", liq: "Weekly" },
];

function barColor(s: string) { return s === "red" ? "#EF4444" : s === "amber" ? "#F59E0B" : "#22C55E"; }

function CashTab({ liveValues }: { liveValues: Record<string, number> }) {
  const totalCash = liveValues["cash_total"] ?? 31.2;
  const mmHoldings = liveValues["cash_mm"] ?? 19.0;
  const uninvested = totalCash - mmHoldings;
  const cashYield = liveValues["cash_yield"] ?? 5.12;
  const cashPctNav = totalCash / 718 * 100;

  const cashByManager = cashByManagerBase.map(m => ({
    ...m,
    value: liveValues[m.key] ?? m.value,
  }));

  const mmfTable = mmfTableBase.map(m => ({
    ...m,
    yield7d: liveValues[m.key] ?? m.yieldBase,
  }));
  const avgYield = mmfTable.reduce((s, r) => s + r.yield7d, 0) / mmfTable.length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        <Card className="bg-[#161B22] border-[#30363D]">
          <CardContent className="p-4 space-y-1">
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Total Cash & Equivalents</p>
            <FlashCell value={totalCash} tag="p" className="text-xl font-bold text-[#C9A84C]">${totalCash.toFixed(1)}M</FlashCell>
          </CardContent>
        </Card>
        <Card className="bg-[#161B22] border-[#30363D]">
          <CardContent className="p-4 space-y-1">
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Money Market Holdings</p>
            <FlashCell value={mmHoldings} tag="p" className="text-xl font-bold text-[#3B82F6]">${mmHoldings.toFixed(1)}M</FlashCell>
            <p className="text-[10px] text-muted-foreground">{(mmHoldings / totalCash * 100).toFixed(0)}% of cash</p>
          </CardContent>
        </Card>
        <Card className="bg-[#161B22] border-[#30363D]">
          <CardContent className="p-4 space-y-1">
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Uninvested Cash</p>
            <FlashCell value={uninvested} tag="p" className="text-xl font-bold text-[#F59E0B]">${uninvested.toFixed(1)}M</FlashCell>
          </CardContent>
        </Card>
        <Card className="bg-[#161B22] border-[#30363D]">
          <CardContent className="p-4 space-y-1">
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Weighted Cash Yield</p>
            <FlashCell value={cashYield} tag="p" className="text-xl font-bold text-[#22C55E]">{cashYield.toFixed(2)}%</FlashCell>
            <p className="text-[10px] text-muted-foreground">annualized</p>
          </CardContent>
        </Card>
        <Card className="bg-[#161B22] border-[#30363D]">
          <CardContent className="p-4 space-y-1">
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Cash as % of Total NAV</p>
            <FlashCell value={cashPctNav} tag="p" className="text-xl font-bold text-[#F59E0B]">{cashPctNav.toFixed(1)}%</FlashCell>
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-[#161B22] border-[#30363D]">
          <CardHeader className="pb-2"><CardTitle className="text-sm text-[#C9A84C]">Cash Balance by Manager</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={cashByManager} layout="vertical" margin={{ left: 110 }}>
                <XAxis type="number" tick={{ fill: "#8b949e", fontSize: 11 }} />
                <YAxis type="category" dataKey="name" tick={{ fill: "#8b949e", fontSize: 10 }} width={110} />
                <Tooltip contentStyle={{ background: "#161B22", border: "1px solid #30363D", color: "#fff", fontSize: 11 }} formatter={(v: number) => `$${v.toFixed(1)}M`} />
                <ReferenceLine x={1.5} stroke="#EF4444" strokeDasharray="4 4" label={{ value: "Min Cash Target $1.5M", fill: "#EF4444", fontSize: 9, position: "insideTopRight" }} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} animationDuration={400}>
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
                  <td className="px-4 py-2 text-foreground">${r.balance.toFixed(1)}M</td>
                  <FlashCell value={r.yield7d} className="px-4 py-2 text-[#22C55E]">{r.yield7d.toFixed(2)}%</FlashCell>
                  <td className="px-4 py-2 text-muted-foreground">{r.maturity}</td>
                  <td className="px-4 py-2 text-foreground">{r.rating}</td>
                  <td className="px-4 py-2 text-muted-foreground">{r.liq}</td>
                </tr>
              ))}
              <tr className="border-t border-[#C9A84C]/30 font-semibold text-[#C9A84C]">
                <td className="px-4 py-2">Total</td><td /><td className="px-4 py-2">${mmHoldings.toFixed(1)}M</td><td className="px-4 py-2">Avg {avgYield.toFixed(2)}%</td><td /><td /><td />
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
  { label: "Total Available Buying Power", value: "$48.4M", color: "#C9A84C" },
  { label: "Margin Capacity Remaining", value: "$27.1M", color: "#C9A84C" },
  { label: "Credit Facility Undrawn", value: "$15.0M", color: "#3B82F6" },
  { label: "Leverage Ratio (Portfolio)", value: "1.34x", color: "#F59E0B" },
];

const waterfallData = [
  { name: "Starting NAV", value: 718, total: 718, fill: "#C9A84C" },
  { name: "Less: Illiquid", value: -100, total: 618, fill: "#EF4444" },
  { name: "Less: Locked Capital", value: -42, total: 576, fill: "#EF4444" },
  { name: "Less: Margin Posted", value: -24, total: 552, fill: "#EF4444" },
  { name: "Plus: Credit Facility", value: 15, total: 567, fill: "#22C55E" },
  { name: "Plus: Undrawn Commits", value: 8, total: 575, fill: "#22C55E" },
  { name: "Net Buying Power", value: 48.4, total: 48.4, fill: "#C9A84C" },
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
  let bp = 48, dep = 670;
  for (let i = 0; i < 90; i++) {
    const d = new Date(2026, 0, 8 + i);
    const label = `${d.getMonth() + 1}/${d.getDate()}`;
    const noise = (Math.random() - 0.5) * 2;
    const dip = (i >= 45 && i <= 52) ? -8 + (i - 45) * 1.1 : 0;
    bp = Math.max(42, Math.min(55, bp + noise + dip));
    dep = 718 - bp - 15 + (Math.random() - 0.5) * 1.5;
    data.push({ day: label, bp: +bp.toFixed(1), deployed: +dep.toFixed(1) });
  }
  return data;
}
const bpTimeline = genBPTimeline();

function BuyingPowerTab({ liveValues }: { liveValues: Record<string, number> }) {
  const bp = liveValues["bp_total"] ?? 48.4;
  const marginUtil = liveValues["bp_margin"] ?? 34.2;

  const bpKpisLive = [
    { label: "Total Available Buying Power", value: `$${bp.toFixed(1)}M`, color: "#C9A84C", lv: bp },
    { label: "Margin Capacity Remaining", value: "$27.1M", color: "#C9A84C", lv: 27.1 },
    { label: "Credit Facility Undrawn", value: "$15.0M", color: "#3B82F6", lv: 15 },
    { label: "Leverage Ratio (Portfolio)", value: "1.34x", color: "#F59E0B", lv: 1.34 },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {bpKpisLive.map((k, i) => (
          <Card key={k.label} className="bg-[#161B22] border-[#30363D]">
            <CardContent className="p-4 space-y-1">
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{k.label}</p>
              {i === 0 ? (
                <FlashCell value={k.lv} tag="p" className="text-xl font-bold" style={{ color: k.color }}>{k.value}</FlashCell>
              ) : (
                <p className="text-xl font-bold" style={{ color: k.color }}>{k.value}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-[#161B22] border-[#30363D]">
          <CardHeader className="pb-2"><CardTitle className="text-sm text-[#C9A84C]">Available Capital Decomposition</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={waterfallBars} margin={{ bottom: 30 }}>
                <XAxis dataKey="name" tick={{ fill: "#8b949e", fontSize: 8 }} angle={-20} textAnchor="end" />
                <YAxis tick={{ fill: "#8b949e", fontSize: 10 }} tickFormatter={v => `$${v.toFixed(1)}M`} domain={[0, 3.5]} />
                <Tooltip contentStyle={{ background: "#161B22", border: "1px solid #30363D", color: "#fff", fontSize: 11 }} formatter={(v: number) => `$${v.toFixed(1)}M`} />
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
              <YAxis tick={{ fill: "#8b949e", fontSize: 10 }} tickFormatter={v => `$${v.toFixed(1)}M`} domain={[0, 3.5]} />
              <Tooltip contentStyle={{ background: "#161B22", border: "1px solid #30363D", color: "#fff", fontSize: 11 }} formatter={(v: number) => `$${v.toFixed(1)}M`} />
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
  { label: "Pending Capital Calls", value: "$3.8M", badge: "4 Active", badgeColor: "#EF4444" },
  { label: "Due Within 30 Days", value: "$2.2M", color: "#EF4444" },
  { label: "Due 31-90 Days", value: "$1.6M", color: "#F59E0B" },
  { label: "YTD Capital Called", value: "$12.4M", color: "#6B7280" },
];

const ccRows = [
  { fund: "Helix Credit Opportunities", strat: "Distressed", amount: "$0.9M", due: "Apr 15 2026", status: "URGENT", days: 7, cash: "$0.4M", action: "SHORTFALL", urgent: true },
  { fund: "Granite Point Capital", strat: "Distressed", amount: "$0.6M", due: "Apr 22 2026", status: "PENDING", days: 14, cash: "$2.1M", action: "FUNDED", urgent: false },
  { fund: "Solaris Private Credit", strat: "Private Credit", amount: "$0.5M", due: "May 1 2026", status: "PENDING", days: 23, cash: "$2.4M", action: "FUNDED", urgent: false },
  { fund: "Dune Credit Strategies", strat: "Distressed", amount: "$1.8M", due: "May 28 2026", status: "SCHEDULED", days: 50, cash: "$5.8M", action: "FUNDED", urgent: false },
];

const ccHistory = [
  { month: "May 25", calls: 1.8, distributions: 0 },
  { month: "Jun 25", calls: 1.0, distributions: 1.2 },
  { month: "Jul 25", calls: 2.2, distributions: 0.5 },
  { month: "Aug 25", calls: 1.5, distributions: 0 },
  { month: "Sep 25", calls: 3.1, distributions: 0.9 },
  { month: "Oct 25", calls: 0.9, distributions: 2.0 },
  { month: "Nov 25", calls: 2.0, distributions: 0 },
  { month: "Dec 25", calls: 2.6, distributions: 1.4 },
  { month: "Jan 26", calls: 1.1, distributions: 3.1 },
  { month: "Feb 26", calls: 1.8, distributions: 0.7 },
  { month: "Mar 26", calls: 3.4, distributions: 0 },
  { month: "Apr 26", calls: 0.9, distributions: 1.8 },
].map(d => ({ ...d, net: d.distributions - d.calls }));

function statusBadge(s: string) {
  const c = s === "URGENT" ? "bg-[#EF4444]/20 text-[#EF4444]" : s === "PENDING" ? "bg-[#F59E0B]/20 text-[#F59E0B]" : "bg-[#6B7280]/20 text-[#6B7280]";
  return <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${c}`}>{s}</span>;
}

function CapitalCallsTab() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
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
              <YAxis tick={{ fill: "#8b949e", fontSize: 10 }} tickFormatter={v => `$${v.toFixed(1)}M`} domain={[0, 3.5]} />
              <Tooltip contentStyle={{ background: "#161B22", border: "1px solid #30363D", color: "#fff", fontSize: 11 }} />
              <Bar dataKey="calls" name="Calls" fill="#EF4444" radius={[2, 2, 0, 0]} />
              <Bar dataKey="distributions" name="Distributions" fill="#22C55E" radius={[2, 2, 0, 0]} />
              <Line type="monotone" dataKey="net" name="Net" stroke="#C9A84C" strokeWidth={2} dot={false} />
              <Legend wrapperStyle={{ fontSize: 10 }} />
            </ComposedChart>
          </ResponsiveContainer>
          <p className="text-[10px] text-muted-foreground mt-2 text-center">YTD Calls: $12.4M | YTD Distributions: $11.5M | Net: -$0.9M</p>
        </CardContent>
      </Card>
    </div>
  );
}

/* ═══════════ TAB 4: PE/VC PACING ═══════════ */

const peKpis = [
  { label: "Total Illiquid Commitments", value: "$68.5M", color: "#C9A84C" },
  { label: "Capital Called to Date", value: "$42.1M", sub: "61%", color: "#C9A84C" },
  { label: "Remaining Unfunded", value: "$26.4M", color: "#F59E0B" },
  { label: "Estimated NAV (Illiquid)", value: "$51.2M", sub: "TVPI 1.22x", color: "#22C55E" },
  { label: "Target Illiquid Alloc", value: "10% | Actual 9.6%", color: "#22C55E" },
];

const vintageData = [
  { year: "2019", called: 9.2, uncalled: 0.1, tvpi: 1.61 },
  { year: "2020", called: 6.8, uncalled: 0.7, tvpi: 1.43 },
  { year: "2021", called: 8.4, uncalled: 1.6, tvpi: 1.28 },
  { year: "2022", called: 5.4, uncalled: 1.8, tvpi: 1.14 },
  { year: "2023", called: 4.8, uncalled: 2.6, tvpi: 1.08 },
  { year: "2024", called: 3.4, uncalled: 3.3, tvpi: 1.02 },
  { year: "2025", called: 2.4, uncalled: 8.4, tvpi: 1.00 },
];

const pacingData = [
  { q: "Q2 26", base: 1.0, bear: 1.2, bull: 0.8 },
  { q: "Q3 26", base: 1.5, bear: 1.8, bull: 1.1 },
  { q: "Q4 26", base: 2.0, bear: 2.4, bull: 1.5 },
  { q: "Q1 27", base: 2.3, bear: 2.8, bull: 1.7 },
  { q: "Q2 27", base: 2.6, bear: 3.2, bull: 1.9 },
  { q: "Q3 27", base: 2.5, bear: 3.4, bull: 1.8 },
  { q: "Q4 27", base: 2.2, bear: 3.1, bull: 1.6 },
  { q: "Q1 28", base: 1.9, bear: 2.6, bull: 1.3 },
  { q: "Q2 28", base: 1.5, bear: 2.1, bull: 1.0 },
  { q: "Q3 28", base: 1.2, bear: 1.7, bull: 0.8 },
  { q: "Q4 28", base: 0.9, bear: 1.2, bull: 0.6 },
  { q: "Q1 29", base: 0.6, bear: 0.8, bull: 0.4 },
];

const fundDetail = [
  { fund: "Arcturus PE Fund III", strat: "Buyout", vintage: 2019, commit: 9.5, called: 9.3, uncalled: 0.2, nav: 15.3, tvpi: 1.61, dpi: 0.82, moic: 1.61, irr: 18.4, status: "Harvesting" },
  { fund: "Meridian Ventures II", strat: "Venture", vintage: 2020, commit: 7.5, called: 6.8, uncalled: 0.7, nav: 10.7, tvpi: 1.43, dpi: 0.41, moic: 1.43, irr: 14.2, status: "Active" },
  { fund: "Ironwood Growth IV", strat: "Growth", vintage: 2021, commit: 9.0, called: 8.1, uncalled: 0.9, nav: 11.5, tvpi: 1.28, dpi: 0.28, moic: 1.28, irr: 11.7, status: "Active" },
  { fund: "Northgate Opps I", strat: "Special Sits", vintage: 2022, commit: 8.5, called: 7.2, uncalled: 1.3, nav: 9.7, tvpi: 1.14, dpi: 0.09, moic: 1.14, irr: 9.3, status: "Investing" },
  { fund: "Solaris Credit Fund", strat: "Private Credit", vintage: 2022, commit: 7.0, called: 5.5, uncalled: 1.5, nav: 8.0, tvpi: 1.14, dpi: 0.31, moic: 1.14, irr: 8.8, status: "Active" },
  { fund: "Helix Distressed III", strat: "Distressed", vintage: 2023, commit: 8.5, called: 5.6, uncalled: 2.9, nav: 9.2, tvpi: 1.08, dpi: 0.00, moic: 1.08, irr: 6.1, status: "Investing" },
  { fund: "Vega Special II", strat: "Special Sits", vintage: 2024, commit: 7.5, called: 4.0, uncalled: 3.5, nav: 7.7, tvpi: 1.02, dpi: 0.00, moic: 1.02, irr: 2.4, status: "Early" },
  { fund: "Tundra Real Assets", strat: "Real Assets", vintage: 2025, commit: 11.5, called: 2.8, uncalled: 8.7, nav: 11.6, tvpi: 1.00, dpi: 0.00, moic: 1.00, irr: 0.0, status: "Funding" },
];

function tvpiColor(v: number) { return v > 1.2 ? "text-[#22C55E]" : v >= 1.0 ? "text-[#F59E0B]" : "text-[#EF4444]"; }
function moicColor(v: number) { return v >= 1.5 ? "text-[#22C55E]" : v >= 1.0 ? "text-[#C9A84C]" : "text-[#EF4444]"; }
function irrColor(v: number) { return v >= 15 ? "text-[#22C55E]" : v >= 8 ? "text-[#C9A84C]" : "text-[#EF4444]"; }

function PEPacingTab({ liveValues }: { liveValues: Record<string, number> }) {
  const calledToDate = liveValues["pe_called"] ?? 42.1;
  const illiquidNav = liveValues["pe_nav_illiq"] ?? 51.2;
  const tvpiTotal = illiquidNav / calledToDate;
  const illiqPct = illiquidNav / 718 * 100;

  const peKpisLive = [
    { label: "Total Illiquid Commitments", value: "$68.5M", color: "#C9A84C" },
    { label: "Capital Called to Date", value: `$${calledToDate.toFixed(1)}M`, sub: `${(calledToDate / 68.5 * 100).toFixed(0)}%`, color: "#C9A84C" },
    { label: "Remaining Unfunded", value: `$${(68.5 - calledToDate).toFixed(1)}M`, color: "#F59E0B" },
    { label: "Estimated NAV (Illiquid)", value: `$${illiquidNav.toFixed(1)}M`, sub: `TVPI ${tvpiTotal.toFixed(2)}x`, color: "#22C55E" },
    { label: "Target Illiquid Alloc", value: `10% | Actual ${illiqPct.toFixed(1)}%`, color: "#22C55E" },
  ];

  const fundDetailLive = fundDetail.map(r => {
    const nav = liveValues[`pe_nav_${r.fund}`] ?? r.nav;
    const tvpi = nav / r.called;
    return { ...r, nav, tvpi };
  });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {peKpisLive.map(k => (
          <Card key={k.label} className="bg-[#161B22] border-[#30363D]">
            <CardContent className="p-4 space-y-1">
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{k.label}</p>
              <p className="text-xl font-bold" style={{ color: k.color }}>{k.value}</p>
              {k.sub && <p className="text-[10px] text-muted-foreground">{k.sub}</p>}
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-[#161B22] border-[#30363D]">
          <CardHeader className="pb-2"><CardTitle className="text-sm text-[#C9A84C]">Called vs Uncalled by Vintage Year</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={vintageData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#30363D" />
                <XAxis dataKey="year" tick={{ fill: "#8b949e", fontSize: 11 }} />
                <YAxis yAxisId="left" tick={{ fill: "#8b949e", fontSize: 10 }} tickFormatter={v => `$${v}M`} domain={[0, 12]} />
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
                <YAxis tick={{ fill: "#8b949e", fontSize: 10 }} tickFormatter={v => `$${v.toFixed(1)}M`} domain={[0, 3.5]} />
                <Tooltip contentStyle={{ background: "#161B22", border: "1px solid #30363D", color: "#fff", fontSize: 11 }} />
                <Area type="monotone" dataKey="bear" name="Bear Case" stroke="#EF4444" fill="rgba(239,68,68,0.05)" strokeDasharray="5 3" strokeWidth={1.5} />
                <Area type="monotone" dataKey="base" name="Base Case" stroke="#C9A84C" fill="rgba(201,168,76,0.15)" strokeWidth={2} />
                <Area type="monotone" dataKey="bull" name="Bull Case" stroke="#22C55E" fill="rgba(34,197,94,0.05)" strokeDasharray="5 3" strokeWidth={1.5} />
                <Legend wrapperStyle={{ fontSize: 10 }} />
              </AreaChart>
            </ResponsiveContainer>
            <p className="text-[10px] text-muted-foreground italic mt-1">Peak Q2 2027 — Q3 2027</p>
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
                {fundDetailLive.map(r => (
                  <tr key={r.fund} className="border-b border-[#30363D]/50 hover:bg-[#0D1117]/60">
                    <td className="px-3 py-2 text-foreground font-medium">{r.fund}</td>
                    <td className="px-3 py-2 text-muted-foreground">{r.strat}</td>
                    <td className="px-3 py-2 text-foreground">{r.vintage}</td>
                    <td className="px-3 py-2 text-foreground">${r.commit}M</td>
                    <td className="px-3 py-2 text-foreground">${r.called.toFixed(1)}M</td>
                    <td className="px-3 py-2 text-foreground">${r.uncalled.toFixed(1)}M</td>
                    <FlashCell value={r.nav} className="px-3 py-2 text-foreground">${r.nav.toFixed(1)}M</FlashCell>
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
  { label: "Stressed Liquidity Gap (30-day)", value: "+$8.4M surplus", color: "#22C55E" },
  { label: "Gate Risk Exposure", value: "$18M", sub: "3 managers with redemption gates", color: "#F59E0B" },
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
  { name: "Available Liquidity", value: 48.4, base: 0, bar: 48.4, fill: "#C9A84C" },
  { name: "Capital Calls", value: -3.8, base: 44.6, bar: 3.8, fill: "#EF4444" },
  { name: "Redemption Gates", value: -18, base: 26.6, bar: 18, fill: "#EF4444" },
  { name: "Margin Call (2σ)", value: -9.2, base: 17.4, bar: 9.2, fill: "#EF4444" },
  { name: "Operational Reserve", value: -2.5, base: 14.9, bar: 2.5, fill: "#EF4444" },
  { name: "Net Stressed Liquidity", value: 14.9, base: 0, bar: 14.9, fill: "#22C55E" },
];

const gateRows = [
  { mgr: "Helix Credit Opportunities", gate: "15% quarterly", aum: "$54M", trigger: "$8.1M redemption", notice: "90 days", risk: "HIGH" },
  { mgr: "Solaris Private Credit", gate: "10% quarterly", aum: "$21M", trigger: "$2.1M redemption", notice: "60 days", risk: "MEDIUM" },
  { mgr: "Granite Point Capital", gate: "20% quarterly", aum: "$26M", trigger: "$5.2M redemption", notice: "90 days", risk: "MEDIUM" },
];

function LiquidityStressTab() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <YAxis tick={{ fill: "#8b949e", fontSize: 10 }} tickFormatter={v => `$${v}M`} />
                <Tooltip contentStyle={{ background: "#161B22", border: "1px solid #30363D", color: "#fff", fontSize: 11 }} formatter={(v: number) => `$${v.toFixed(1)}M`} />
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
            <span><strong>Liquidity Advisory:</strong> Helix Credit gate risk combined with $0.9M capital call due Apr 15 creates a potential $1.3M funding gap. Recommend immediate review and standby credit facility activation.</span>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

/* ═══════════ MAIN PAGE ═══════════ */

export default function Liquidity() {
  return (
    <div className="p-3 sm:p-6 space-y-4 bg-[#0D1117] min-h-full">
      <LiquidityInner />
    </div>
  );
}

/* ═══════════ SIMULATION WIRING ═══════════ */

const LIQ_INITIAL: Record<string, number> = {
  cash_total: 31.2,
  cash_mm: 19.0,
  cash_yield: 5.12,
  // cash by manager
  cash_tundra: 11.8, cash_arcturus: 8.2, cash_northgate: 5.8,
  cash_solaris: 3.2, cash_ironwood: 3.6, cash_vega: 1.4,
  cash_meridian: 1.1, cash_helix: 0.8,
  // mmf yields
  mmf_fidelity: 5.18, mmf_vanguard: 5.09, mmf_blackrock: 5.21, mmf_jpm: 5.31,
  // buying power
  bp_total: 48.4, bp_margin: 34.2,
  // PE/VC
  pe_called: 42.1, pe_nav_illiq: 51.2,
  ...Object.fromEntries(fundDetail.map(r => [`pe_nav_${r.fund}`, r.nav])),
};

const LIQ_CONFIGS: Record<string, SimKeyConfig> = {
  cash_total: { drift: 0.015, tickMin: 8000, tickMax: 20000 },
  cash_mm: { drift: 0.008, tickMin: 10000, tickMax: 25000 },
  cash_yield: { drift: 0.05, absolute: true, tickMin: 30000, tickMax: 90000, floor: 4.50, ceiling: 5.80 },
  // cash by manager
  cash_tundra: { drift: 0.02, tickMin: 6000, tickMax: 15000 },
  cash_arcturus: { drift: 0.02, tickMin: 6000, tickMax: 15000 },
  cash_northgate: { drift: 0.02, tickMin: 6000, tickMax: 15000 },
  cash_solaris: { drift: 0.015, tickMin: 6000, tickMax: 15000 },
  cash_ironwood: { drift: 0.015, tickMin: 6000, tickMax: 15000 },
  cash_vega: { drift: 0.02, tickMin: 6000, tickMax: 15000 },
  cash_meridian: { drift: 0.02, tickMin: 6000, tickMax: 15000 },
  cash_helix: { drift: 0.01, tickMin: 6000, tickMax: 15000 },
  // mmf yields
  mmf_fidelity: { drift: 0.04, absolute: true, tickMin: 20000, tickMax: 60000, floor: 4.50, ceiling: 5.80 },
  mmf_vanguard: { drift: 0.04, absolute: true, tickMin: 20000, tickMax: 60000, floor: 4.50, ceiling: 5.80 },
  mmf_blackrock: { drift: 0.04, absolute: true, tickMin: 20000, tickMax: 60000, floor: 4.50, ceiling: 5.80 },
  mmf_jpm: { drift: 0.04, absolute: true, tickMin: 20000, tickMax: 60000, floor: 4.50, ceiling: 5.80 },
  // buying power
  bp_total: { drift: 0.015, tickMin: 8000, tickMax: 18000 },
  bp_margin: { drift: 0.3, absolute: true, tickMin: 10000, tickMax: 20000, floor: 28, ceiling: 45 },
  // PE/VC
  pe_called: { drift: 0.002, tickMin: 60000, tickMax: 120000 },
  pe_nav_illiq: { drift: 0.005, tickMin: 45000, tickMax: 90000 },
  ...Object.fromEntries(fundDetail.map(r => {
    const drift = ["Solaris Credit Fund","Helix Distressed III"].includes(r.fund) ? 0.002
      : r.fund === "Tundra Real Assets" ? 0.001
      : ["Meridian Ventures II"].includes(r.fund) ? 0.004
      : 0.003;
    return [`pe_nav_${r.fund}`, { drift, tickMin: 45000, tickMax: 120000 } as SimKeyConfig];
  })),
};

function LiquidityInner() {
  const { liveValues, isLive, toggleLive } = useMarketSimulation(LIQ_INITIAL, 0.08, LIQ_CONFIGS);

  return (
    <>
      <div className="flex justify-end">
        <button onClick={toggleLive} className="flex items-center gap-1.5 focus:outline-none hover:opacity-80">
          <span className="relative flex h-2 w-2">
            {isLive && <span className="animate-pulse-dot absolute inline-flex h-full w-full rounded-full bg-[#22C55E] opacity-75" />}
            <span className={`relative inline-flex rounded-full h-2 w-2 ${isLive ? "bg-[#22C55E]" : "bg-muted-foreground"}`} />
          </span>
          <span className={`font-semibold tracking-wider text-[10px] ${isLive ? "text-[#22C55E]" : "text-muted-foreground"}`}>
            {isLive ? "LIVE" : "PAUSED"}
          </span>
        </button>
      </div>
      <Tabs defaultValue="cash" className="w-full">
        <TabsList className="bg-[#161B22] border border-[#30363D] flex flex-wrap h-auto gap-1 p-1">
          <TabsTrigger value="cash" className="text-[10px] sm:text-xs px-2 py-1.5 cursor-pointer transition-all duration-200 hover:bg-[#C9A84C]/10 hover:text-[#C9A84C] hover:scale-105 data-[state=active]:bg-[#C9A84C]/20 data-[state=active]:text-[#C9A84C] data-[state=active]:shadow-[0_0_12px_rgba(201,168,76,0.3)] data-[state=inactive]:tab-heartbeat-inactive">CASH</TabsTrigger>
          <TabsTrigger value="buying" className="text-[10px] sm:text-xs px-2 py-1.5 cursor-pointer transition-all duration-200 hover:bg-[#C9A84C]/10 hover:text-[#C9A84C] hover:scale-105 data-[state=active]:bg-[#C9A84C]/20 data-[state=active]:text-[#C9A84C] data-[state=active]:shadow-[0_0_12px_rgba(201,168,76,0.3)] data-[state=inactive]:tab-heartbeat-inactive">BUYING POWER</TabsTrigger>
          <TabsTrigger value="calls" className="text-[10px] sm:text-xs px-2 py-1.5 cursor-pointer transition-all duration-200 hover:bg-[#C9A84C]/10 hover:text-[#C9A84C] hover:scale-105 data-[state=active]:bg-[#C9A84C]/20 data-[state=active]:text-[#C9A84C] data-[state=active]:shadow-[0_0_12px_rgba(201,168,76,0.3)] data-[state=inactive]:tab-heartbeat-inactive">CALLS</TabsTrigger>
          <TabsTrigger value="pacing" className="text-[10px] sm:text-xs px-2 py-1.5 cursor-pointer transition-all duration-200 hover:bg-[#C9A84C]/10 hover:text-[#C9A84C] hover:scale-105 data-[state=active]:bg-[#C9A84C]/20 data-[state=active]:text-[#C9A84C] data-[state=active]:shadow-[0_0_12px_rgba(201,168,76,0.3)] data-[state=inactive]:tab-heartbeat-inactive">PE/VC</TabsTrigger>
          <TabsTrigger value="stress" className="text-[10px] sm:text-xs px-2 py-1.5 cursor-pointer transition-all duration-200 hover:bg-[#C9A84C]/10 hover:text-[#C9A84C] hover:scale-105 data-[state=active]:bg-[#C9A84C]/20 data-[state=active]:text-[#C9A84C] data-[state=active]:shadow-[0_0_12px_rgba(201,168,76,0.3)] data-[state=inactive]:tab-heartbeat-inactive">STRESS</TabsTrigger>
        </TabsList>
        <TabsContent value="cash"><CashTab liveValues={liveValues} /></TabsContent>
        <TabsContent value="buying"><BuyingPowerTab liveValues={liveValues} /></TabsContent>
        <TabsContent value="calls"><CapitalCallsTab /></TabsContent>
        <TabsContent value="pacing"><PEPacingTab liveValues={liveValues} /></TabsContent>
        <TabsContent value="stress"><LiquidityStressTab /></TabsContent>
      </Tabs>
    </>
  );
}
