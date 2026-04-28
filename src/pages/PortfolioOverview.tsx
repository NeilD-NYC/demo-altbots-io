import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { managers } from "@/data/managers";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Line } from "recharts";
import { AlertTriangle, TrendingUp, Users, Shield, DollarSign } from "lucide-react";
import FlagDot from "@/components/FlagDot";

const HealthGauge = ({ score }: { score: number }) => {
  const [animated, setAnimated] = useState(0);
  useEffect(() => {
    setAnimated(0);
    const duration = 1200;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setAnimated(Math.round(eased * score));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [score]);

  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (animated / 100) * circumference;

  return (
    <div className="relative w-28 h-28">
      <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
        <circle cx="60" cy="60" r="54" fill="none" stroke="#30363D" strokeWidth="8" />
        <circle
          cx="60" cy="60" r="54" fill="none"
          stroke="url(#health-grad)" strokeWidth="8" strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
        <defs>
          <linearGradient id="health-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#22C55E" />
            <stop offset="50%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#EF4444" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold text-warning">{animated}</span>
        <span className="text-[9px] text-muted-foreground">/100</span>
      </div>
    </div>
  );
};

const COLORS = {
  "Global Macro": "#C9A84C",
  "Long/Short Equity": "#3B82F6",
  "Quantitative Equity": "#8B5CF6",
  "Distressed Credit": "#EF4444",
  "Event Driven": "#22C55E",
  Other: "#6B7280",
};

const strategyData = [
  { name: "Global Macro", value: 35 },
  { name: "Long/Short Equity", value: 12 },
  { name: "Quantitative Equity", value: 27 },
  { name: "Distressed Credit", value: 9 },
  { name: "Event Driven", value: 14 },
  { name: "Other", value: 3 },
];

const riskData = [...managers]
  .sort((a, b) => b.risk_score - a.risk_score)
  .map((m) => ({
    name: m.name.length > 18 ? m.name.slice(0, 18) + "…" : m.name,
    score: m.risk_score,
    fill: m.risk_score > 50 ? "#EF4444" : m.risk_score >= 30 ? "#F59E0B" : "#22C55E",
  }));

const trendData = [
  { label: "Growing", count: managers.filter((m) => m.aum_trend === "Growing").length, fill: "#22C55E" },
  { label: "Stable", count: managers.filter((m) => m.aum_trend === "Stable").length, fill: "#6B7280" },
  { label: "Declining", count: managers.filter((m) => m.aum_trend === "Declining").length, fill: "#F59E0B" },
];

const totalAUM = managers.reduce((s, m) => s + m.aum_bn, 0);
const avgRisk = (managers.reduce((s, m) => s + m.risk_score, 0) / managers.length).toFixed(1);

const KPIShell = ({
  icon: Icon,
  label,
  accent,
  children,
}: {
  icon: any;
  label: string;
  accent?: boolean;
  children: React.ReactNode;
}) => (
  <div className="bg-card border border-border rounded-lg p-5 flex flex-col gap-3 min-h-[170px] hover:border-primary/30 transition-colors">
    <div className="flex items-center gap-2.5">
      <div className="p-2 rounded-md bg-secondary">
        <Icon className={`h-4 w-4 ${accent ? "text-destructive" : "text-primary"}`} />
      </div>
      <p className="text-[10px] text-muted-foreground uppercase tracking-widest">{label}</p>
    </div>
    <div className="flex-1 flex flex-col justify-between">{children}</div>
  </div>
);

// Card 1: AUM sparkline data (7 points, slight upward curve, ending ~26.5)
const aumSpark = [
  { x: 1, v: 24.8 },
  { x: 2, v: 25.0 },
  { x: 3, v: 25.1 },
  { x: 4, v: 25.3 },
  { x: 5, v: 25.7 },
  { x: 6, v: 26.1 },
  { x: 7, v: 26.5 },
];

const PortfolioOverview = () => {
  const navigate = useNavigate();

  return (
    <div className="p-8 space-y-8 max-w-[1400px] mx-auto">
      {/* KPI Row — 5 cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Card 1 — Total AUM */}
        <KPIShell icon={DollarSign} label="Total AUM Under Monitoring">
          <div>
            <p className="text-3xl font-bold text-foreground tabular-nums">$26.5B</p>
            <p className="text-xs text-success mt-1 font-medium">↑ +$1.2B since last sweep</p>
          </div>
          <div className="h-10 -mx-1">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={aumSpark} margin={{ top: 4, bottom: 2, left: 4, right: 4 }}>
                <Line
                  type="monotone"
                  dataKey="v"
                  stroke="#C9A84C"
                  strokeWidth={1.75}
                  dot={false}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </KPIShell>

        {/* Card 2 — Managers Monitored */}
        <KPIShell icon={Users} label="Managers Monitored">
          <div>
            <p className="text-3xl font-bold text-foreground tabular-nums">8</p>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-foreground/80">3</span> HF
              <span className="mx-1.5 text-border">|</span>
              <span className="text-foreground/80">2</span> PE
              <span className="mx-1.5 text-border">|</span>
              <span className="text-foreground/80">2</span> Credit
              <span className="mx-1.5 text-border">|</span>
              <span className="text-foreground/80">1</span> Real Assets
            </p>
          </div>
        </KPIShell>

        {/* Card 3 — Active Alerts */}
        <KPIShell icon={AlertTriangle} label="Active Alerts" accent>
          <div>
            <p className="text-3xl font-bold text-foreground flex items-center gap-2">
              1
              <span className="text-[10px] bg-destructive/20 text-destructive px-2 py-0.5 rounded-full font-semibold tracking-wide">ALERT</span>
            </p>
            <p className="text-xs text-muted-foreground mt-1">0 new since last sweep</p>
          </div>
          <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-destructive" /> 1 Critical</span>
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-warning/40" /> 0 Watch</span>
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-success/40" /> 0 Clear</span>
          </div>
        </KPIShell>

        {/* Card 4 — Avg Risk Score */}
        <KPIShell icon={Shield} label="Avg Risk Score">
          <div>
            <p className="text-3xl font-bold text-foreground tabular-nums">33.9 <span className="text-base text-muted-foreground font-normal">/ 100</span></p>
            <p className="text-xs text-warning mt-1 font-medium">↑ +2.1 pts vs prior month</p>
          </div>
          <div>
            <div className="relative h-1.5 rounded-full" style={{ background: "linear-gradient(to right, #22C55E, #F59E0B, #EF4444)" }}>
              <div
                className="absolute -top-1 h-3.5 w-0.5 bg-foreground rounded-sm"
                style={{ left: "33.9%" }}
              />
            </div>
            <div className="flex justify-between text-[9px] text-muted-foreground mt-1 tabular-nums">
              <span>0</span><span>50</span><span>100</span>
            </div>
          </div>
        </KPIShell>

        {/* Card 5 — Portfolio Health Score */}
        <KPIShell icon={TrendingUp} label="Portfolio Health Score">
          <div className="flex flex-col items-center justify-center -mt-1">
            <HealthGauge score={71} />
            <span className="text-[10px] font-bold tracking-widest text-warning mt-1">MODERATE RISK</span>
          </div>
          <p className="text-[10px] text-muted-foreground text-center tabular-nums">
            Sharpe <span className="text-foreground/80">1.74</span>
            <span className="mx-1 text-border">|</span>
            Sortino <span className="text-foreground/80">2.31</span>
            <span className="mx-1 text-border">|</span>
            Max DD <span className="text-destructive">-6.8%</span>
          </p>
        </KPIShell>
      </div>

      {/* Three Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Strategy Concentration */}
        <div className="bg-card border border-border rounded-lg p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Strategy Concentration</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={strategyData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} dataKey="value" paddingAngle={2}>
                {strategyData.map((entry) => (
                  <Cell key={entry.name} fill={COLORS[entry.name as keyof typeof COLORS] || "#6B7280"} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: "#161B22", border: "1px solid #30363D", borderRadius: 8, fontSize: 12 }}
                itemStyle={{ color: "#e5e7eb" }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
            {strategyData.map((s) => (
              <div key={s.name} className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: COLORS[s.name as keyof typeof COLORS] || "#6B7280" }} />
                {s.name} {s.value}%
              </div>
            ))}
          </div>
        </div>

        {/* Risk Score Distribution */}
        <div className="bg-card border border-border rounded-lg p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Risk Score Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={riskData} layout="vertical" margin={{ left: 0, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#30363D" horizontal={false} />
              <XAxis type="number" domain={[0, 100]} tick={{ fill: "#8b949e", fontSize: 11 }} />
              <YAxis type="category" dataKey="name" width={110} tick={{ fill: "#8b949e", fontSize: 10 }} />
              <Tooltip contentStyle={{ backgroundColor: "#161B22", border: "1px solid #30363D", borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="score" radius={[0, 4, 4, 0]} barSize={14}>
                {riskData.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* AUM Trend Summary */}
        <div className="bg-card border border-border rounded-lg p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">AUM Trend Summary</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={trendData} margin={{ top: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#30363D" />
              <XAxis dataKey="label" tick={{ fill: "#8b949e", fontSize: 12 }} />
              <YAxis tick={{ fill: "#8b949e", fontSize: 12 }} allowDecimals={false} />
              <Tooltip contentStyle={{ backgroundColor: "#161B22", border: "1px solid #30363D", borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="count" radius={[4, 4, 0, 0]} barSize={40}>
                {trendData.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Alert Feed */}
      <div className="bg-card border border-destructive/30 rounded-lg p-5">
        <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-destructive" />
          Recent Alerts
        </h3>
        <div className="flex items-start gap-3 bg-destructive/5 border border-destructive/20 rounded-lg p-4">
          <FlagDot flag="red" />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold text-destructive uppercase">Red Alert</span>
              <span className="text-xs text-muted-foreground">| Helix Credit Opportunities | April 8, 2026</span>
            </div>
            <p className="text-sm text-secondary-foreground leading-relaxed">
              SEC enforcement history confirmed. FINRA disclosure on record. Adverse media flagged (WSJ 2021). Strategy drift detected. Recommend immediate review.
            </p>
            <button
              onClick={() => navigate("/manager/4")}
              className="mt-3 text-xs font-medium text-primary hover:text-primary/80 border border-primary/30 rounded px-3 py-1.5 hover:bg-primary/10 transition-colors"
            >
              View Full Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioOverview;
