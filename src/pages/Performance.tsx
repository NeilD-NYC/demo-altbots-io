import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowUp, ArrowDown } from "lucide-react";
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, AreaChart, Area, CartesianGrid, Legend, ReferenceLine, ReferenceArea,
} from "recharts";

/* ───────── TAB 1: POSITIONS & NAV ───────── */

const kpis = [
  { label: "Total Portfolio NAV", value: "$26.5B", change: "+2.3% MTD", up: true },
  { label: "Aggregate P&L MTD", value: "+$612M", change: null, up: true },
  { label: "Total Cash & Equivalents", value: "$2.1B", change: "8.1% of NAV", up: null },
  { label: "Blended Buying Power", value: "$4.8B", change: null, up: null },
  { label: "Avg Margin Utilization", value: "34.2%", change: null, up: null, marginBar: 34.2 },
];

const managerRows = [
  { mgr: "Arcturus Capital", strat: "Global Macro", nav: 4200, pnl: 88.2, pnlPct: 2.1, cash: 12, margin: 18, status: "green" },
  { mgr: "Meridian Capital", strat: "L/S Equity", nav: 1800, pnl: 27.0, pnlPct: 1.5, cash: 9, margin: 41, status: "yellow" },
  { mgr: "Ironwood Systematic", strat: "Quant Equity", nav: 7100, pnl: 191.7, pnlPct: 2.7, cash: 6, margin: 22, status: "green" },
  { mgr: "Helix Credit", strat: "Distressed", nav: 2300, pnl: -46.0, pnlPct: -2.0, cash: 4, margin: 67, status: "red" },
  { mgr: "Northgate Event", strat: "Event Driven", nav: 3600, pnl: 86.4, pnlPct: 2.4, cash: 11, margin: 29, status: "green" },
  { mgr: "Solaris Private Credit", strat: "Private Credit", nav: 900, pnl: 9.0, pnlPct: 1.0, cash: 18, margin: 12, status: "yellow" },
  { mgr: "Tundra Macro", strat: "Global Macro", nav: 5500, pnl: 115.5, pnlPct: 2.1, cash: 14, margin: 25, status: "green" },
  { mgr: "Vega Special Sits", strat: "Special Sits", nav: 1100, pnl: 38.5, pnlPct: 3.5, cash: 7, margin: 38, status: "yellow" },
];

function marginColor(v: number) {
  if (v > 60) return "text-[#EF4444]";
  if (v >= 35) return "text-[#F59E0B]";
  return "text-[#22C55E]";
}

function PositionsTab() {
  return (
    <div className="space-y-6">
      {/* KPI cards */}
      <div className="grid grid-cols-5 gap-4">
        {kpis.map((k) => (
          <Card key={k.label} className="bg-[#161B22] border-[#30363D]">
            <CardContent className="p-4 space-y-1">
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{k.label}</p>
              <p className="text-xl font-bold text-foreground">{k.value}</p>
              {k.change && (
                <span className={`text-xs flex items-center gap-1 ${k.up ? "text-[#22C55E]" : "text-[#EF4444]"}`}>
                  {k.up ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                  {k.change}
                </span>
              )}
              {k.marginBar != null && (
                <div className="pt-1">
                  <Progress value={k.marginBar} className="h-2 bg-[#30363D] [&>div]:bg-[#F59E0B]" />
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Manager table */}
      <Card className="bg-[#161B22] border-[#30363D]">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-[#C9A84C]">Manager-Level Snapshot</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-[#30363D] text-muted-foreground">
                  {["Manager","Strategy","NAV ($M)","P&L MTD ($M)","P&L MTD %","Cash %","Margin Util %","Status"].map(h => (
                    <th key={h} className="px-4 py-2 text-left font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {managerRows.map(r => (
                  <tr key={r.mgr} className="border-b border-[#30363D]/50 hover:bg-[#0D1117]/60">
                    <td className="px-4 py-2 font-medium text-foreground">{r.mgr}</td>
                    <td className="px-4 py-2 text-muted-foreground">{r.strat}</td>
                    <td className="px-4 py-2 text-foreground">{r.nav.toLocaleString()}</td>
                    <td className={`px-4 py-2 ${r.pnl >= 0 ? "text-[#22C55E]" : "text-[#EF4444]"}`}>
                      {r.pnl >= 0 ? "+" : ""}{r.pnl.toFixed(1)}
                    </td>
                    <td className={`px-4 py-2 ${r.pnlPct >= 0 ? "text-[#22C55E]" : "text-[#EF4444]"}`}>
                      {r.pnlPct >= 0 ? "+" : ""}{r.pnlPct.toFixed(1)}%
                    </td>
                    <td className="px-4 py-2 text-foreground">{r.cash}%</td>
                    <td className={`px-4 py-2 font-medium ${marginColor(r.margin)}`}>{r.margin}%</td>
                    <td className="px-4 py-2">
                      <span className={`inline-block h-2.5 w-2.5 rounded-full ${
                        r.status === "green" ? "bg-[#22C55E]" : r.status === "yellow" ? "bg-[#F59E0B]" : "bg-[#EF4444]"
                      }`} />
                    </td>
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

/* ───────── TAB 2: EXPOSURE ───────── */

const sectorData = [
  { name: "Technology", value: 31, color: "#3B82F6" },
  { name: "Financials", value: 18, color: "#C9A84C" },
  { name: "Healthcare", value: 12, color: "#22C55E" },
  { name: "Consumer", value: 11, color: "#F59E0B" },
  { name: "Energy", value: 8, color: "#EF4444" },
  { name: "Industrials", value: 7, color: "#8B5CF6" },
  { name: "Fixed Income", value: 8, color: "#06B6D4" },
  { name: "Cash", value: 5, color: "#6B7280" },
];

const geoData = [
  { name: "North America", value: 62 },
  { name: "Europe", value: 18 },
  { name: "Asia Pacific", value: 12 },
  { name: "EM", value: 6 },
  { name: "Other", value: 2 },
];

const capData = [
  { name: "Mega Cap >$200B", value: 38 },
  { name: "Large $10-200B", value: 29 },
  { name: "Mid $2-10B", value: 19 },
  { name: "Small <$2B", value: 9 },
  { name: "Private/Illiquid", value: 5 },
];

const factorData = [
  { name: "Momentum", value: 0.62 },
  { name: "Value", value: -0.18 },
  { name: "Quality", value: 0.41 },
  { name: "Size", value: -0.09 },
  { name: "Low Vol", value: 0.23 },
  { name: "Growth", value: 0.55 },
];

function ExposureTab() {
  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Sector donut */}
      <Card className="bg-[#161B22] border-[#30363D]">
        <CardHeader className="pb-2"><CardTitle className="text-sm text-[#C9A84C]">Sector Breakdown</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={sectorData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value" label={({ name, value }) => `${name} ${value}%`} labelLine={false}>
                {sectorData.map(s => <Cell key={s.name} fill={s.color} />)}
              </Pie>
              <Tooltip contentStyle={{ background: "#161B22", border: "1px solid #30363D", color: "#fff", fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Geo bar */}
      <Card className="bg-[#161B22] border-[#30363D]">
        <CardHeader className="pb-2"><CardTitle className="text-sm text-[#C9A84C]">Geographic Decomposition</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={geoData} layout="vertical" margin={{ left: 80 }}>
              <XAxis type="number" domain={[0, 70]} tick={{ fill: "#8b949e", fontSize: 11 }} />
              <YAxis type="category" dataKey="name" tick={{ fill: "#8b949e", fontSize: 11 }} width={80} />
              <Tooltip contentStyle={{ background: "#161B22", border: "1px solid #30363D", color: "#fff", fontSize: 11 }} />
              <Bar dataKey="value" fill="#C9A84C" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Market cap bar */}
      <Card className="bg-[#161B22] border-[#30363D]">
        <CardHeader className="pb-2"><CardTitle className="text-sm text-[#C9A84C]">Market Cap Exposure</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={capData} margin={{ bottom: 20 }}>
              <XAxis dataKey="name" tick={{ fill: "#8b949e", fontSize: 9 }} angle={-15} textAnchor="end" />
              <YAxis tick={{ fill: "#8b949e", fontSize: 11 }} />
              <Tooltip contentStyle={{ background: "#161B22", border: "1px solid #30363D", color: "#fff", fontSize: 11 }} />
              <Bar dataKey="value" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Factor exposure */}
      <Card className="bg-[#161B22] border-[#30363D]">
        <CardHeader className="pb-2"><CardTitle className="text-sm text-[#C9A84C]">Factor Exposure (Beta)</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={factorData} layout="vertical" margin={{ left: 60 }}>
              <XAxis type="number" domain={[-0.3, 0.7]} tick={{ fill: "#8b949e", fontSize: 11 }} />
              <YAxis type="category" dataKey="name" tick={{ fill: "#8b949e", fontSize: 11 }} width={60} />
              <ReferenceLine x={0} stroke="#30363D" />
              <Tooltip contentStyle={{ background: "#161B22", border: "1px solid #30363D", color: "#fff", fontSize: 11 }} />
              <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                {factorData.map(f => <Cell key={f.name} fill={f.value >= 0 ? "#22C55E" : "#EF4444"} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}

/* ───────── TAB 3: CORRELATION ───────── */

const corrLabels = ["Arcturus","Meridian","Ironwood","Helix","Northgate","Solaris","Tundra","Vega","S&P 500","HFRI","Barc Agg"];
const corrMatrix = [
  [1.00,0.42,0.31,0.18,0.38,0.09,0.71,0.29,0.54,0.61,-0.12],
  [0.42,1.00,0.58,0.21,0.63,0.14,0.39,0.44,0.72,0.68,-0.08],
  [0.31,0.58,1.00,0.12,0.51,0.07,0.28,0.37,0.81,0.74,-0.15],
  [0.18,0.21,0.12,1.00,0.24,0.41,0.16,0.33,0.19,0.31,0.22],
  [0.38,0.63,0.51,0.24,1.00,0.11,0.35,0.52,0.69,0.65,-0.09],
  [0.09,0.14,0.07,0.41,0.11,1.00,0.08,0.19,0.12,0.22,0.31],
  [0.71,0.39,0.28,0.16,0.35,0.08,1.00,0.27,0.48,0.57,-0.18],
  [0.29,0.44,0.37,0.33,0.52,0.19,0.27,1.00,0.58,0.53,-0.04],
  [0.54,0.72,0.81,0.19,0.69,0.12,0.48,0.58,1.00,0.87,-0.21],
  [0.61,0.68,0.74,0.31,0.65,0.22,0.57,0.53,0.87,1.00,-0.14],
  [-0.12,-0.08,-0.15,0.22,-0.09,0.31,-0.18,-0.04,-0.21,-0.14,1.00],
];

function corrCellColor(v: number, isDiag: boolean) {
  if (isDiag) return "#C9A84C";
  if (v < 0) {
    const t = Math.min(Math.abs(v) / 0.25, 1);
    return `rgba(245,158,11,${0.3 + t * 0.7})`;
  }
  if (v < 0.1) return "#2D333B";
  if (v < 0.4) return "#334155";
  if (v < 0.7) return "#93C5FD";
  if (v < 0.9) return "#3B82F6";
  return "#1E40AF";
}

function corrTextColor(v: number, isDiag: boolean) {
  if (isDiag) return "#0D1117";
  if (v >= 0.4 && v < 0.7) return "#0D1117";
  if (v >= 0.1 && v < 0.4) return "#E2E8F0";
  return "#fff";
}

function CorrelationTab() {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-[#C9A84C]">Manager & Benchmark Correlation Matrix</h3>
        <p className="text-[10px] text-muted-foreground">Rolling 12-month daily returns</p>
      </div>
      <div className="overflow-x-auto">
        <table className="border-collapse">
          <thead>
            <tr>
              <th className="w-20" />
              {corrLabels.map(l => (
                <th key={l} className="px-1 py-1 text-[9px] text-muted-foreground font-medium text-center" style={{ minWidth: 52 }}>{l}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {corrLabels.map((rowL, ri) => (
              <tr key={rowL}>
                <td className="pr-2 text-[10px] text-muted-foreground text-right whitespace-nowrap font-medium">{rowL}</td>
                {corrMatrix[ri].map((v, ci) => {
                  const isDiag = ri === ci;
                  return (
                    <td key={ci} className="p-0">
                      <div
                        className="flex items-center justify-center"
                        style={{
                          width: 52, height: 28,
                          background: corrCellColor(v, isDiag),
                          color: corrTextColor(v, isDiag),
                          fontSize: 11, fontWeight: isDiag ? 700 : 400,
                        }}
                      >
                        {v.toFixed(2)}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-[10px] text-muted-foreground italic">
        High correlation between Ironwood, Meridian and S&P 500 (0.81, 0.72) suggests limited diversification benefit from quant and L/S equity managers.
      </p>
    </div>
  );
}

/* ───────── TAB 4: RISK METRICS ───────── */

function genMonths(startYear: number, startMonth: number, count: number) {
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const out: string[] = [];
  let y = startYear, m = startMonth;
  for (let i = 0; i < count; i++) {
    out.push(`${months[m]} ${y}`);
    m++;
    if (m === 12) { m = 0; y++; }
  }
  return out;
}

function interp(points: { i: number; v: number }[], total: number): number[] {
  const out: number[] = [];
  for (let t = 0; t < total; t++) {
    let before = points[0], after = points[points.length - 1];
    for (let p = 0; p < points.length - 1; p++) {
      if (t >= points[p].i && t <= points[p + 1].i) { before = points[p]; after = points[p + 1]; break; }
    }
    const range = after.i - before.i || 1;
    const frac = (t - before.i) / range;
    out.push(+(before.v + (after.v - before.v) * frac + (Math.random() - 0.5) * 0.3).toFixed(2));
  }
  return out;
}

const ddMonths = genMonths(2023, 0, 40);
const ddPortfolio = interp([{i:0,v:0},{i:9,v:-4.2},{i:16,v:-1.0},{i:19,v:-6.8},{i:30,v:-2.0},{i:39,v:-1.1}], 40);
const ddSP = interp([{i:0,v:0},{i:9,v:-8.1},{i:16,v:-2.0},{i:19,v:-5.2},{i:30,v:-1.0},{i:39,v:0}], 40);
const ddHFRI = interp([{i:0,v:0},{i:9,v:-5.3},{i:16,v:-2.5},{i:25,v:-3.1},{i:39,v:-1.8}], 40);
const drawdownData = ddMonths.map((m, i) => ({ month: m, Portfolio: ddPortfolio[i], "S&P 500": ddSP[i], HFRI: ddHFRI[i] }));

const sharpeMonths = genMonths(2024, 0, 28);
const sharpePort = interp([{i:0,v:1.1},{i:5,v:0.8},{i:10,v:1.5},{i:15,v:1.3},{i:20,v:2.1},{i:25,v:1.9},{i:27,v:1.74}], 28);
const sharpeHFRI = interp([{i:0,v:0.7},{i:5,v:0.4},{i:12,v:0.9},{i:18,v:0.6},{i:22,v:1.3},{i:27,v:0.91}], 28);
const sharpeData = sharpeMonths.map((m, i) => ({ month: m, Portfolio: sharpePort[i], HFRI: sharpeHFRI[i] }));

const volMonths = genMonths(2023, 0, 40);
const volValues = interp([{i:0,v:7.2},{i:5,v:8.1},{i:9,v:11.8},{i:14,v:6.4},{i:19,v:9.1},{i:25,v:7.0},{i:32,v:6.2},{i:39,v:5.8}], 40);
const volData = volMonths.map((m, i) => ({ month: m, vol: volValues[i] }));

const sortinoData = [
  { quarter: "Q1 2025", Arcturus: 1.8, Ironwood: 2.4, Helix: 0.4, Vega: 1.9 },
  { quarter: "Q2 2025", Arcturus: 2.1, Ironwood: 2.8, Helix: -0.2, Vega: 2.2 },
  { quarter: "Q3 2025", Arcturus: 1.6, Ironwood: 2.1, Helix: 0.6, Vega: 1.7 },
  { quarter: "Q4 2025", Arcturus: 2.3, Ironwood: 3.1, Helix: 0.3, Vega: 2.6 },
];

function RiskTab() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {/* Drawdown */}
        <Card className="bg-[#161B22] border-[#30363D]">
          <CardHeader className="pb-2"><CardTitle className="text-sm text-[#C9A84C]">Drawdown from Peak — Portfolio vs Benchmarks</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={drawdownData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#30363D" />
                <XAxis dataKey="month" tick={{ fill: "#8b949e", fontSize: 9 }} interval={5} angle={-30} textAnchor="end" />
                <YAxis tick={{ fill: "#8b949e", fontSize: 11 }} domain={[-12, 2]} tickFormatter={v => `${v}%`} />
                <Tooltip contentStyle={{ background: "#161B22", border: "1px solid #30363D", color: "#fff", fontSize: 11 }} formatter={(v: number) => `${v}%`} />
                <ReferenceLine y={-10} stroke="#EF4444" strokeDasharray="4 4" label={{ value: "Drawdown Threshold", fill: "#EF4444", fontSize: 9, position: "insideTopLeft" }} />
                <Area type="monotone" dataKey="Portfolio" stroke="#C9A84C" fill="rgba(201,168,76,0.15)" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="S&P 500" stroke="#3B82F6" strokeWidth={1.5} dot={false} />
                <Line type="monotone" dataKey="HFRI" stroke="#6B7280" strokeWidth={1.5} dot={false} />
                <Legend wrapperStyle={{ fontSize: 10, color: "#8b949e" }} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Sharpe */}
        <Card className="bg-[#161B22] border-[#30363D] relative">
          <CardHeader className="pb-2"><CardTitle className="text-sm text-[#C9A84C]">Rolling 12-Month Sharpe Ratio</CardTitle></CardHeader>
          <div className="absolute top-3 right-4 bg-[#0D1117] border border-[#30363D] rounded px-2 py-1 text-[10px] text-[#C9A84C]">
            Current Sharpe: 1.74 | Sortino: 2.31
          </div>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={sharpeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#30363D" />
                <XAxis dataKey="month" tick={{ fill: "#8b949e", fontSize: 9 }} interval={4} angle={-30} textAnchor="end" />
                <YAxis tick={{ fill: "#8b949e", fontSize: 11 }} domain={[0, 2.5]} />
                <Tooltip contentStyle={{ background: "#161B22", border: "1px solid #30363D", color: "#fff", fontSize: 11 }} />
                <ReferenceLine y={1.0} stroke="#22C55E" strokeDasharray="4 4" label={{ value: "Target", fill: "#22C55E", fontSize: 9, position: "insideTopRight" }} />
                <Line type="monotone" dataKey="Portfolio" stroke="#C9A84C" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="HFRI" stroke="#6B7280" strokeWidth={1.5} strokeDasharray="5 3" dot={false} />
                <Legend wrapperStyle={{ fontSize: 10, color: "#8b949e" }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Volatility */}
        <Card className="bg-[#161B22] border-[#30363D]">
          <CardHeader className="pb-2"><CardTitle className="text-sm text-[#C9A84C]">Annualized Volatility — 60-Day Rolling</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={volData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#30363D" />
                <XAxis dataKey="month" tick={{ fill: "#8b949e", fontSize: 9 }} interval={5} angle={-30} textAnchor="end" />
                <YAxis tick={{ fill: "#8b949e", fontSize: 11 }} domain={[0, 16]} tickFormatter={v => `${v}%`} />
                <Tooltip contentStyle={{ background: "#161B22", border: "1px solid #30363D", color: "#fff", fontSize: 11 }} formatter={(v: number) => `${v}%`} />
                <ReferenceArea y1={10} y2={15} fill="rgba(239,68,68,0.08)" label={{ value: "Elevated Vol Regime", fill: "#EF4444", fontSize: 8, position: "insideTopLeft" }} />
                <ReferenceArea y1={7} y2={10} fill="rgba(245,158,11,0.08)" label={{ value: "Moderate", fill: "#F59E0B", fontSize: 8, position: "insideTopLeft" }} />
                <ReferenceArea y1={0} y2={7} fill="rgba(34,197,94,0.06)" label={{ value: "Low Vol", fill: "#22C55E", fontSize: 8, position: "insideBottomLeft" }} />
                <Area type="monotone" dataKey="vol" stroke="#C9A84C" fill="rgba(201,168,76,0.2)" strokeWidth={2} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Sortino */}
        <Card className="bg-[#161B22] border-[#30363D]">
          <CardHeader className="pb-2"><CardTitle className="text-sm text-[#C9A84C]">Quarterly Risk-Adjusted Returns by Manager</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={sortinoData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#30363D" />
                <XAxis dataKey="quarter" tick={{ fill: "#8b949e", fontSize: 10 }} />
                <YAxis tick={{ fill: "#8b949e", fontSize: 11 }} domain={[-0.5, 3.5]} />
                <Tooltip contentStyle={{ background: "#161B22", border: "1px solid #30363D", color: "#fff", fontSize: 11 }} />
                <ReferenceLine y={0} stroke="#30363D" />
                <Bar dataKey="Arcturus" fill="#C9A84C" radius={[2, 2, 0, 0]} />
                <Bar dataKey="Ironwood" fill="#C9A84C" radius={[2, 2, 0, 0]} />
                <Bar dataKey="Helix" fill="#EF4444" radius={[2, 2, 0, 0]} />
                <Bar dataKey="Vega" fill="#C9A84C" radius={[2, 2, 0, 0]} />
                <Legend wrapperStyle={{ fontSize: 10, color: "#8b949e" }} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Summary bar */}
      <Card className="bg-[#0D1117] border-[#C9A84C]/30">
        <CardContent className="py-3 px-6">
          <p className="text-xs text-[#C9A84C] font-medium text-center tracking-wide">
            Portfolio Risk Summary: Sharpe 1.74 | Sortino 2.31 | Max Drawdown -6.8% | Annualized Vol 5.8% | Beta to S&P 0.41 | VaR 95% (1-day) -0.82%
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

/* ───────── MAIN PAGE ───────── */

const stressScenarios = [
  { name: "Rate Shock +200bps", navB: "-$1.2B", navPct: "-4.5%", dd: "-8.2%", sharpe: "-0.31", illiq: "+1.8%", sev: "MODERATE" },
  { name: "Equity Selloff -20%", navB: "-$2.8B", navPct: "-10.6%", dd: "-13.4%", sharpe: "-0.58", illiq: "+2.4%", sev: "HIGH" },
  { name: "Credit Spread +300bps", navB: "-$1.9B", navPct: "-7.2%", dd: "-11.1%", sharpe: "-0.44", illiq: "+3.1%", sev: "HIGH" },
  { name: "Combined Shock", navB: "-$4.1B", navPct: "-15.5%", dd: "-18.7%", sharpe: "-0.89", illiq: "+4.6%", sev: "SEVERE" },
];

const stressNarratives = [
  { name: "Rate Shock +200bps", text: "A 200bps rate increase compresses NAV by an estimated $1.2B, primarily impacting private credit and growth equity valuations. Drawdown remains within the -10% policy threshold; no immediate rebalancing required." },
  { name: "Equity Selloff -20%", text: "A broad equity selloff of 20% pushes estimated drawdown to -13.4%, breaching the -10% policy threshold. Recommend reviewing Ironwood Systematic and Arcturus Capital exposures for near-term risk reduction." },
  { name: "Credit Spread +300bps", text: "A 300bps credit spread widening would materially impair Helix Distressed III and Solaris Credit Fund valuations, driving illiquid allocation above target. Immediate liquidity review recommended for the distressed sleeve." },
  { name: "Combined Shock", text: "Under a combined macro shock, portfolio NAV declines by an estimated $4.1B (-15.5%), with drawdown reaching -18.7% — well beyond policy limits. This scenario warrants immediate Portfolio Committee escalation and defensive repositioning across liquid allocations." },
];

function severityBadge(sev: string) {
  if (sev === "MODERATE") return "bg-[#C9A84C]/15 text-[#C9A84C] border-[#C9A84C]/40";
  if (sev === "HIGH") return "bg-[#EF4444]/15 text-[#EF4444] border-[#EF4444]/40";
  return "bg-[#EF4444]/25 text-[#FF6B6B] border-[#EF4444]/60 font-bold";
}

function StressScenariosTab() {
  return (
    <div className="space-y-4">
      <Card className="bg-[#161B22] border-[#30363D]">
        <CardHeader className="pb-2"><CardTitle className="text-sm text-[#C9A84C]">Portfolio Stress Test — Macro Scenarios</CardTitle></CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead><tr className="border-b border-[#30363D] text-muted-foreground">
                {["Scenario","NAV Impact ($B)","NAV Impact (%)","Max Drawdown","Sharpe Impact","Illiquid Alloc Shift","Severity"].map(h => (
                  <th key={h} className="px-3 py-2 text-left font-medium">{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {stressScenarios.map(r => (
                  <tr key={r.name} className="border-b border-[#30363D]/50 hover:bg-[#0D1117]/60">
                    <td className={`px-3 py-2 text-foreground ${r.sev === "SEVERE" ? "font-bold" : "font-medium"}`}>{r.name}</td>
                    <td className="px-3 py-2 text-[#EF4444] font-semibold">{r.navB}</td>
                    <td className="px-3 py-2 text-[#EF4444] font-semibold">{r.navPct}</td>
                    <td className="px-3 py-2 text-[#EF4444] font-semibold">{r.dd}</td>
                    <td className="px-3 py-2 text-foreground">{r.sharpe}</td>
                    <td className="px-3 py-2 text-foreground">{r.illiq}</td>
                    <td className="px-3 py-2">
                      <span className={`inline-block px-2 py-0.5 rounded border text-[10px] tracking-wide ${severityBadge(r.sev)}`}>{r.sev}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-[#161B22] border-[#30363D]">
        <CardHeader className="pb-2"><CardTitle className="text-sm text-[#C9A84C]">AI Analyst — Scenario Interpretation</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {stressNarratives.map(n => (
            <div
              key={n.name}
              className={`bg-[#0D1117] border border-[#30363D] rounded p-3 ${n.name === "Combined Shock" ? "border-l-4 border-l-[#EF4444]" : ""}`}
            >
              <div className="text-xs font-semibold text-[#C9A84C] mb-1">{n.name}</div>
              <p className="text-xs text-muted-foreground leading-relaxed">{n.text}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

export default function Performance() {
  return (
    <div className="p-6 space-y-4 bg-[#0D1117] min-h-full">
      <Tabs defaultValue="positions" className="w-full">
        <TabsList className="bg-[#161B22] border border-[#30363D]">
          <TabsTrigger value="positions" className="text-xs data-[state=active]:bg-[#C9A84C]/20 data-[state=active]:text-[#C9A84C]">POSITIONS & NAV</TabsTrigger>
          <TabsTrigger value="exposure" className="text-xs data-[state=active]:bg-[#C9A84C]/20 data-[state=active]:text-[#C9A84C]">EXPOSURE</TabsTrigger>
          <TabsTrigger value="correlation" className="text-xs data-[state=active]:bg-[#C9A84C]/20 data-[state=active]:text-[#C9A84C]">CORRELATION</TabsTrigger>
          <TabsTrigger value="risk" className="text-xs data-[state=active]:bg-[#C9A84C]/20 data-[state=active]:text-[#C9A84C]">RISK METRICS</TabsTrigger>
          <TabsTrigger value="stress" className="text-xs data-[state=active]:bg-[#C9A84C]/20 data-[state=active]:text-[#C9A84C]">STRESS SCENARIOS</TabsTrigger>
        </TabsList>
        <TabsContent value="positions"><PositionsTab /></TabsContent>
        <TabsContent value="exposure"><ExposureTab /></TabsContent>
        <TabsContent value="correlation"><CorrelationTab /></TabsContent>
        <TabsContent value="risk"><RiskTab /></TabsContent>
        <TabsContent value="stress"><StressScenariosTab /></TabsContent>
      </Tabs>
    </div>
  );
}
