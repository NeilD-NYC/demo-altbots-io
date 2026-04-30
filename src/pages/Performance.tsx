import { useState, useRef, useEffect, useMemo } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowUp, ArrowDown, ChevronDown, ChevronUp } from "lucide-react";
import { useMarketSimulation } from "@/hooks/useMarketSimulation";
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, AreaChart, Area, CartesianGrid, Legend, ReferenceLine, ReferenceArea,
} from "recharts";

/* ───────── FLASH CELL COMPONENT ───────── */

function FlashCell({ value, children, className = "" }: { value: number; children: React.ReactNode; className?: string }) {
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

  return (
    <td key={keyRef.current} className={`${className} ${flash === "up" ? "flash-up" : flash === "down" ? "flash-down" : ""}`}>
      {children}
    </td>
  );
}

function PriceCell({ value, className = "" }: { value: number; className?: string }) {
  const prevRef = useRef(value);
  const [arrow, setArrow] = useState<"up" | "down" | null>(null);
  const [flash, setFlash] = useState<"up" | "down" | null>(null);
  const keyRef = useRef(0);

  useEffect(() => {
    if (value !== prevRef.current) {
      const dir = value > prevRef.current ? "up" : "down";
      setArrow(dir);
      setFlash(dir);
      keyRef.current++;
      prevRef.current = value;
      const t1 = setTimeout(() => setFlash(null), 650);
      const t2 = setTimeout(() => setArrow(null), 3000);
      return () => { clearTimeout(t1); clearTimeout(t2); };
    }
  }, [value]);

  return (
    <td key={keyRef.current} className={`${className} ${flash === "up" ? "flash-up" : flash === "down" ? "flash-down" : ""}`}>
      ${value.toFixed(2)}
      {arrow && (
        <span className={`ml-1 text-[10px] ${arrow === "up" ? "text-[#22C55E]" : "text-[#EF4444]"}`}>
          {arrow === "up" ? "▲" : "▼"}
        </span>
      )}
    </td>
  );
}

/* ───────── TAB 1: POSITIONS & NAV ───────── */

const managerRowsBase = [
  { mgr: "Arcturus Capital", strat: "Global Macro", nav: 98, pnl: 2.1, pnlPct: 2.1, cash: 12, margin: 18, status: "green" },
  { mgr: "Meridian Capital", strat: "L/S Equity", nav: 42, pnl: 0.6, pnlPct: 1.5, cash: 9, margin: 41, status: "yellow" },
  { mgr: "Ironwood Systematic", strat: "Quant Equity", nav: 165, pnl: 4.5, pnlPct: 2.7, cash: 6, margin: 22, status: "green" },
  { mgr: "Helix Credit", strat: "Distressed Credit", nav: 54, pnl: -1.1, pnlPct: -2.0, cash: 4, margin: 67, status: "red" },
  { mgr: "Northgate Event", strat: "Event Driven", nav: 84, pnl: 2.0, pnlPct: 2.4, cash: 11, margin: 29, status: "green" },
  { mgr: "Solaris Private Credit", strat: "Private Credit", nav: 21, pnl: 0.2, pnlPct: 1.0, cash: 18, margin: 12, status: "yellow" },
  { mgr: "Tundra Macro", strat: "Global Macro", nav: 128, pnl: 2.7, pnlPct: 2.1, cash: 14, margin: 25, status: "green" },
  { mgr: "Vega Special Sits", strat: "Special Situations", nav: 26, pnl: 0.9, pnlPct: 3.5, cash: 7, margin: 38, status: "yellow" },
];

const equityRowsBase = [
  { name: "NVIDIA", ticker: "NVDA", shares: 1200, price: 892.40, mtd: 6.2, ytd: 42.1, weight: 4.2 },
  { name: "Apple", ticker: "AAPL", shares: 8500, price: 189.30, mtd: 2.1, ytd: 18.4, weight: 6.3 },
  { name: "Caterpillar", ticker: "CAT", shares: 3200, price: 342.80, mtd: 1.8, ytd: 12.7, weight: 4.3 },
  { name: "SPDR S&P 500", ticker: "SPY", shares: 5500, price: 521.40, mtd: 1.1, ytd: 9.2, weight: 11.3 },
  { name: "Alphabet", ticker: "GOOGL", shares: 4800, price: 171.20, mtd: 3.4, ytd: 22.8, weight: 3.2 },
  { name: "Walmart", ticker: "WMT", shares: 12000, price: 68.40, mtd: 0.9, ytd: 8.1, weight: 3.2 },
  { name: "Amazon", ticker: "AMZN", shares: 6200, price: 182.50, mtd: 2.8, ytd: 24.3, weight: 4.5 },
  { name: "UnitedHealth", ticker: "UNH", shares: 2100, price: 512.80, mtd: -1.2, ytd: 6.4, weight: 4.2 },
  { name: "Pfizer", ticker: "PFE", shares: 28000, price: 27.80, mtd: -0.8, ytd: -14.2, weight: 3.1 },
];

// Build initial simulation values
function buildInitialValues() {
  const vals: Record<string, number> = {};
  equityRowsBase.forEach(r => {
    vals[`price_${r.ticker}`] = r.price;
    vals[`mtd_${r.ticker}`] = r.mtd;
  });
  managerRowsBase.forEach(r => {
    vals[`mgr_pnl_${r.mgr}`] = r.pnl;
    vals[`mgr_pnlPct_${r.mgr}`] = r.pnlPct;
  });
  vals["kpi_aum"] = 718;
  vals["kpi_hf_mtd"] = 11.9;
  vals["kpi_liquid"] = 31;
  return vals;
}

const INITIAL_SIM_VALUES = buildInitialValues();

function marginColor(v: number) {
  if (v > 60) return "text-[#EF4444]";
  if (v >= 35) return "text-[#F59E0B]";
  return "text-[#22C55E]";
}

function PositionsTab({ liveValues, isLive, toggleLive }: { liveValues: Record<string, number>; isLive: boolean; toggleLive: () => void }) {
  const equityRows = useMemo(() => equityRowsBase.map(r => {
    const price = liveValues[`price_${r.ticker}`] ?? r.price;
    const mtd = liveValues[`mtd_${r.ticker}`] ?? r.mtd;
    const value = Math.round(r.shares * price);
    return { ...r, price, mtd, value };
  }), [liveValues]);

  const managerRows = useMemo(() => managerRowsBase.map(r => ({
    ...r,
    pnl: liveValues[`mgr_pnl_${r.mgr}`] ?? r.pnl,
    pnlPct: liveValues[`mgr_pnlPct_${r.mgr}`] ?? r.pnlPct,
  })), [liveValues]);

  const totalAum = liveValues["kpi_aum"] ?? 718;
  const hfMtd = liveValues["kpi_hf_mtd"] ?? 11.9;
  const liquidAssets = liveValues["kpi_liquid"] ?? 31;
  const managerPnlSum = managerRows.reduce((s, r) => s + r.pnl, 0);
  const equityTotal = equityRows.reduce((s, r) => s + r.value, 0);

  return (
    <div className="space-y-6">
      {/* Live toggle */}
      <div className="flex justify-end">
        <button
          onClick={toggleLive}
          className="flex items-center gap-1.5 focus:outline-none hover:opacity-80"
        >
          <span className="relative flex h-2 w-2">
            {isLive && (
              <span className="animate-pulse-dot absolute inline-flex h-full w-full rounded-full bg-[#22C55E] opacity-75" />
            )}
            <span className={`relative inline-flex rounded-full h-2 w-2 ${isLive ? "bg-[#22C55E]" : "bg-muted-foreground"}`} />
          </span>
          <span className={`font-semibold tracking-wider text-[10px] ${isLive ? "text-[#22C55E]" : "text-muted-foreground"}`}>
            {isLive ? "LIVE" : "PAUSED"}
          </span>
        </button>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {/* Card 1 */}
        <Card className="bg-[#161B22] border-[#30363D]">
          <CardContent className="p-4 space-y-1">
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Total Family Office AUM</p>
            <p className="text-lg sm:text-xl font-bold text-foreground">${totalAum.toFixed(0)}M</p>
            <span className={`text-xs flex items-center gap-1 ${totalAum >= 718 ? "text-[#22C55E]" : "text-[#EF4444]"}`}>
              {totalAum >= 718 ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
              {totalAum >= 718 ? "+" : ""}${(totalAum - 718 + 8.4).toFixed(1)}M MTD
            </span>
          </CardContent>
        </Card>
        {/* Card 2 */}
        <Card className="bg-[#161B22] border-[#30363D]">
          <CardContent className="p-4 space-y-1">
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Hedge Fund Sleeve</p>
            <p className="text-lg sm:text-xl font-bold text-foreground">$618M</p>
            <span className={`text-xs flex items-center gap-1 ${hfMtd >= 0 ? "text-[#22C55E]" : "text-[#EF4444]"}`}>
              {hfMtd >= 0 ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
              86.1% of portfolio | {hfMtd >= 0 ? "+" : ""}${hfMtd.toFixed(1)}M MTD
            </span>
          </CardContent>
        </Card>
        {/* Card 3 */}
        <Card className="bg-[#161B22] border-[#30363D]">
          <CardContent className="p-4 space-y-1">
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Liquid Assets (Cash & Equivalents)</p>
            <p className="text-lg sm:text-xl font-bold text-foreground">${liquidAssets.toFixed(0)}M</p>
            <span className="text-xs flex items-center gap-1 text-[#EF4444]">
              {(liquidAssets / totalAum * 100).toFixed(1)}% of NAV — {liquidAssets / totalAum < 0.05 ? "below" : "above"} 5% threshold
            </span>
          </CardContent>
        </Card>
        {/* Card 4 */}
        <Card className="bg-[#161B22] border-[#30363D]">
          <CardContent className="p-4 space-y-1">
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Illiquid & Alternatives</p>
            <p className="text-lg sm:text-xl font-bold text-foreground">$100M</p>
            <span className="text-xs text-muted-foreground">13.9% of portfolio</span>
          </CardContent>
        </Card>
        {/* Card 5 */}
        <Card className="bg-[#161B22] border-[#30363D]">
          <CardContent className="p-4 space-y-1">
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Avg Manager Risk Score</p>
            <p className="text-lg sm:text-xl font-bold text-foreground">38.1 / 100</p>
            <span className="text-xs flex items-center gap-1 text-[#F59E0B]">
              <ArrowUp className="h-3 w-3" />+2.1 pts vs prior month
            </span>
            <div className="pt-1">
              <div className="h-2 rounded-full overflow-hidden" style={{ background: "linear-gradient(to right, #22C55E, #F59E0B, #EF4444)" }}>
                <div className="relative h-full">
                  <div className="absolute h-full w-0.5 bg-white" style={{ left: "38.1%" }} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Manager table */}
      <Card className="bg-[#161B22] border-[#30363D]">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-[#C9A84C]">Manager-Level Snapshot</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ManagerTable managerRows={managerRows} managerPnlSum={managerPnlSum} />
        </CardContent>
      </Card>

      {/* Collapsible sections */}
      <DirectEquitySection equityRows={equityRows} equityTotal={equityTotal} liveValues={liveValues} />
      <CommercialRealEstateSection />
      <PrivateAlternativeSection />

      {/* Portfolio Allocation Summary */}
      <PortfolioAllocationSummary />
    </div>
  );
}

/* ───────── MANAGER TABLE ───────── */

function ManagerTable({ managerRows, managerPnlSum }: { managerRows: typeof managerRowsBase; managerPnlSum: number }) {
  return (
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
              <td className="px-4 py-2 text-foreground">${r.nav}M</td>
              <FlashCell value={r.pnl} className={`px-4 py-2 ${r.pnl >= 0 ? "text-[#22C55E]" : "text-[#EF4444]"}`}>
                {r.pnl >= 0 ? "+" : ""}${Math.abs(r.pnl).toFixed(1)}M
              </FlashCell>
              <FlashCell value={r.pnlPct} className={`px-4 py-2 ${r.pnlPct >= 0 ? "text-[#22C55E]" : "text-[#EF4444]"}`}>
                {r.pnlPct >= 0 ? "+" : ""}{r.pnlPct.toFixed(1)}%
              </FlashCell>
              <td className="px-4 py-2 text-foreground">{r.cash}%</td>
              <td className={`px-4 py-2 font-medium ${marginColor(r.margin)}`}>{r.margin}%</td>
              <td className="px-4 py-2">
                <span className={`inline-block h-2.5 w-2.5 rounded-full ${
                  r.status === "green" ? "bg-[#22C55E]" : r.status === "yellow" ? "bg-[#F59E0B]" : "bg-[#EF4444]"
                }`} />
              </td>
            </tr>
          ))}
          <tr className="border-t-2 border-[#30363D] font-bold">
            <td className="px-4 py-2 text-foreground">Subtotal</td>
            <td className="px-4 py-2 text-muted-foreground">—</td>
            <td className="px-4 py-2 text-foreground">$618M</td>
            <td className={`px-4 py-2 ${managerPnlSum >= 0 ? "text-[#22C55E]" : "text-[#EF4444]"}`}>
              {managerPnlSum >= 0 ? "+" : ""}${Math.abs(managerPnlSum).toFixed(1)}M
            </td>
            <td className="px-4 py-2 text-muted-foreground">—</td>
            <td className="px-4 py-2 text-foreground">—</td>
            <td className="px-4 py-2 text-foreground">—</td>
            <td className="px-4 py-2">—</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

/* ───────── COLLAPSIBLE SECTION WRAPPER ───────── */

function CollapsibleSection({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | "auto">("auto");

  useEffect(() => {
    if (contentRef.current) {
      setHeight(open ? contentRef.current.scrollHeight : 0);
    }
  }, [open]);

  useEffect(() => {
    if (open && contentRef.current) {
      setHeight(contentRef.current.scrollHeight);
    }
  }, []);

  return (
    <Card className="bg-[#161B22] border-[#30363D]">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 text-left"
      >
        <span className="text-sm font-semibold text-[#C9A84C]">{title}</span>
        {open ? <ChevronUp className="h-4 w-4 text-[#C9A84C]" /> : <ChevronDown className="h-4 w-4 text-[#C9A84C]" />}
      </button>
      <div
        style={{ height: typeof height === "number" ? height : "auto", overflow: "hidden", transition: "height 0.3s ease" }}
      >
        <div ref={contentRef}>
          {children}
        </div>
      </div>
    </Card>
  );
}

/* ───────── SUBSECTION A: DIRECT EQUITY ───────── */

function DirectEquitySection({ equityRows, equityTotal, liveValues }: { equityRows: Array<{ name: string; ticker: string; shares: number; price: number; value: number; mtd: number; ytd: number; weight: number }>; equityTotal: number; liveValues: Record<string, number> }) {
  return (
    <CollapsibleSection title={`Direct Equity Holdings  |  $${(equityTotal / 1000000).toFixed(1)}M  |  Est. MTD: +$0.8M`}>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[#30363D] text-muted-foreground">
                {["Holding","Ticker","Shares","Price","Market Value","MTD Return","YTD Return","Weight %"].map(h => (
                  <th key={h} className="px-4 py-2 text-left font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {equityRows.map(r => (
                <tr key={r.ticker} className="border-b border-[#30363D]/50 hover:bg-[#0D1117]/60">
                  <td className="px-4 py-2 font-medium text-foreground">{r.name}</td>
                  <td className="px-4 py-2 text-muted-foreground">{r.ticker}</td>
                  <td className="px-4 py-2 text-foreground">{r.shares.toLocaleString()}</td>
                  <PriceCell value={r.price} className="px-4 py-2 text-foreground" />
                  <FlashCell value={r.value} className="px-4 py-2 text-foreground">
                    ${r.value.toLocaleString()}
                  </FlashCell>
                  <FlashCell value={r.mtd} className={`px-4 py-2 ${r.mtd >= 0 ? "text-[#22C55E]" : "text-[#EF4444]"}`}>
                    {r.mtd >= 0 ? "+" : ""}{r.mtd.toFixed(2)}%
                  </FlashCell>
                  <td className={`px-4 py-2 ${r.ytd >= 0 ? "text-[#22C55E]" : "text-[#EF4444]"}`}>{r.ytd >= 0 ? "+" : ""}{r.ytd}%</td>
                  <td className="px-4 py-2 text-foreground">{r.weight}%</td>
                </tr>
              ))}
              <tr className="border-t-2 border-[#30363D] font-bold">
                <td className="px-4 py-2 text-foreground">Direct Equity Total</td>
                <td className="px-4 py-2 text-muted-foreground">—</td>
                <td className="px-4 py-2 text-muted-foreground">—</td>
                <td className="px-4 py-2 text-muted-foreground">—</td>
                <td className="px-4 py-2 text-foreground">${equityTotal.toLocaleString()}</td>
                <td className="px-4 py-2 text-[#22C55E]">+1.8%</td>
                <td className="px-4 py-2 text-[#22C55E]">+14.2%</td>
                <td className="px-4 py-2 text-foreground">44.3%</td>
              </tr>
              <tr className="border-b border-[#30363D]/50">
                <td className="px-4 py-2 text-muted-foreground italic">Cash / Money Market</td>
                <td className="px-4 py-2 text-muted-foreground">—</td>
                <td className="px-4 py-2 text-muted-foreground">—</td>
                <td className="px-4 py-2 text-muted-foreground">—</td>
                <td className="px-4 py-2 text-foreground">$14,126,070</td>
                <td className="px-4 py-2 text-muted-foreground">—</td>
                <td className="px-4 py-2 text-muted-foreground">—</td>
                <td className="px-4 py-2 text-foreground">55.7%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </CardContent>
    </CollapsibleSection>
  );
}

/* ───────── SUBSECTION B: COMMERCIAL REAL ESTATE ───────── */

const creRows = [
  { property: "Brickell Office Tower", location: "Miami, FL", type: "Class A Office", purchase: 6.2, current: 7.8, gain: 1.6, income: "468K", status: "Active" },
  { property: "Austin Mixed-Use", location: "Austin, TX", type: "Mixed-Use Retail", purchase: 4.8, current: 5.4, gain: 0.6, income: "324K", status: "Active" },
  { property: "Brooklyn Industrial Park", location: "Brooklyn, NY", type: "Industrial", purchase: 5.5, current: 6.1, gain: 0.6, income: "366K", status: "Active" },
  { property: "Beverly Hills Retail", location: "Los Angeles, CA", type: "Retail Strip", purchase: 4.1, current: 4.2, gain: 0.1, income: "252K", status: "Watch" },
  { property: "Dallas Medical Office", location: "Dallas, TX", type: "Medical Office", purchase: 2.8, current: 3.1, gain: 0.3, income: "192K", status: "Active" },
];

function CommercialRealEstateSection() {
  return (
    <CollapsibleSection title="Commercial Real Estate  |  $25.0M  |  Est. Annual Yield: 6.2%">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[#30363D] text-muted-foreground">
                {["Property","Location","Type","Purchase Price","Current Value","Unrealized Gain","Annual Income","Status"].map(h => (
                  <th key={h} className="px-4 py-2 text-left font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {creRows.map(r => (
                <tr key={r.property} className="border-b border-[#30363D]/50 hover:bg-[#0D1117]/60">
                  <td className="px-4 py-2 font-medium text-foreground">{r.property}</td>
                  <td className="px-4 py-2 text-muted-foreground">{r.location}</td>
                  <td className="px-4 py-2 text-muted-foreground">{r.type}</td>
                  <td className="px-4 py-2 text-foreground">${r.purchase}M</td>
                  <td className="px-4 py-2 text-foreground">${r.current}M</td>
                  <td className="px-4 py-2 text-[#22C55E]">+${r.gain}M</td>
                  <td className="px-4 py-2 text-foreground">${r.income}</td>
                  <td className="px-4 py-2">
                    <span className="flex items-center gap-1.5">
                      <span className={`inline-block h-2.5 w-2.5 rounded-full ${r.status === "Active" ? "bg-[#22C55E]" : "bg-[#F59E0B]"}`} />
                      <span className="text-muted-foreground">{r.status}</span>
                    </span>
                  </td>
                </tr>
              ))}
              <tr className="border-t-2 border-[#30363D] font-bold">
                <td className="px-4 py-2 text-foreground">CRE Total</td>
                <td className="px-4 py-2 text-muted-foreground">—</td>
                <td className="px-4 py-2 text-muted-foreground">—</td>
                <td className="px-4 py-2 text-foreground">$23.4M</td>
                <td className="px-4 py-2 text-foreground">$26.6M</td>
                <td className="px-4 py-2 text-[#22C55E]">+$3.2M</td>
                <td className="px-4 py-2 text-foreground">$1,602K</td>
                <td className="px-4 py-2">—</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="px-4 py-3 text-[10px] text-muted-foreground italic">
          Valuations based on most recent appraisal. Beverly Hills Retail flagged for lease renewal review Q3 2026.
        </p>
      </CardContent>
    </CollapsibleSection>
  );
}

/* ───────── SUBSECTION C: PRIVATE & ALTERNATIVE ASSETS ───────── */

const vcRows = [
  { company: "Stealth AI Co.", stage: "Series B", sector: "Artificial Intelligence", invested: 4.0, value: 9.2, moic: 2.3, status: "Active" },
  { company: "FinTech Platform X", stage: "Series C", sector: "Financial Technology", invested: 5.0, value: 7.5, moic: 1.5, status: "Active" },
  { company: "CleanEnergy Startup", stage: "Series A", sector: "Clean Energy", invested: 3.0, value: 3.8, moic: 1.3, status: "Active" },
  { company: "BioTech Venture", stage: "Series B", sector: "Healthcare", invested: 6.0, value: 5.4, moic: 0.9, status: "Watch" },
  { company: "PropTech Co.", stage: "Series A", sector: "Real Estate Tech", invested: 4.0, value: 4.8, moic: 1.2, status: "Active" },
  { company: "Consumer Brand", stage: "Seed", sector: "Consumer", invested: 3.0, value: 2.1, moic: 0.7, status: "Watch" },
];

const hardAssetRows = [
  { asset: "Basquiat (1982)", category: "Fine Art", cost: 4.2, value: 7.1, appraised: "Jan 2026", liquidity: "Low" },
  { asset: "Picasso Lithograph Set", category: "Fine Art", cost: 1.8, value: 2.4, appraised: "Mar 2026", liquidity: "Low" },
  { asset: "3.8ct Pink Diamond Ring", category: "Jewelry", cost: 0.9, value: 1.4, appraised: "Feb 2026", liquidity: "Low" },
  { asset: "Patek Philippe Watch Coll", category: "Jewelry / Watches", cost: 0.6, value: 1.1, appraised: "Jan 2026", liquidity: "Low" },
  { asset: "1962 Ferrari 250 GTE", category: "Collectible Auto", cost: 1.4, value: 2.8, appraised: "Dec 2025", liquidity: "Low" },
  { asset: "1967 Ford GT40 Replica", category: "Collectible Auto", cost: 0.4, value: 0.7, appraised: "Dec 2025", liquidity: "Low" },
  { asset: "Aspen Ski Chalet", category: "Vacation Property", cost: 8.5, value: 11.2, appraised: "Oct 2025", liquidity: "Low" },
  { asset: "Palm Beach Residence", category: "Vacation Property", cost: 14.0, value: 18.4, appraised: "Nov 2025", liquidity: "Low" },
  { asset: "St. Barths Villa", category: "Vacation Property", cost: 6.8, value: 9.4, appraised: "Sep 2025", liquidity: "Low" },
  { asset: "Misc. Collectibles", category: "Collectibles", cost: 1.4, value: 1.8, appraised: "Dec 2025", liquidity: "Low" },
];

function moicColor(m: number) {
  if (m >= 1.5) return "text-[#22C55E]";
  if (m >= 1.0) return "text-[#F59E0B]";
  return "text-[#EF4444]";
}

function PrivateAlternativeSection() {
  return (
    <CollapsibleSection title="Private & Alternative Assets  |  $75.0M  |  Illiquid">
      <CardContent className="space-y-6">
        {/* VC */}
        <div>
          <p className="text-xs font-semibold text-[#C9A84C] mb-2">Venture & Private Equity</p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-[#30363D] text-muted-foreground">
                  {["Company","Stage","Sector","Invested","Est. Value","MOIC","Status"].map(h => (
                    <th key={h} className="px-4 py-2 text-left font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {vcRows.map(r => (
                  <tr key={r.company} className="border-b border-[#30363D]/50 hover:bg-[#0D1117]/60">
                    <td className="px-4 py-2 font-medium text-foreground">{r.company}</td>
                    <td className="px-4 py-2 text-muted-foreground">{r.stage}</td>
                    <td className="px-4 py-2 text-muted-foreground">{r.sector}</td>
                    <td className="px-4 py-2 text-foreground">${r.invested}M</td>
                    <td className="px-4 py-2 text-foreground">${r.value}M</td>
                    <td className={`px-4 py-2 font-semibold ${moicColor(r.moic)}`}>{r.moic.toFixed(1)}x</td>
                    <td className="px-4 py-2">
                      <span className="flex items-center gap-1.5">
                        <span className={`inline-block h-2.5 w-2.5 rounded-full ${r.status === "Active" ? "bg-[#22C55E]" : "bg-[#F59E0B]"}`} />
                        <span className="text-muted-foreground">{r.status}</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="px-4 py-2 text-xs text-muted-foreground font-medium">
            Subtotal: Invested $25.0M | Est. Value $32.8M | Blended MOIC 1.31x
          </p>
        </div>

        {/* Hard Assets */}
        <div>
          <p className="text-xs font-semibold text-[#C9A84C] mb-2">Art, Jewelry, Collectibles & Real Property</p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-[#30363D] text-muted-foreground">
                  {["Asset","Category","Acquisition Cost","Est. Value","Last Appraised","Liquidity"].map(h => (
                    <th key={h} className="px-4 py-2 text-left font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {hardAssetRows.map(r => (
                  <tr key={r.asset} className="border-b border-[#30363D]/50 hover:bg-[#0D1117]/60">
                    <td className="px-4 py-2 font-medium text-foreground">{r.asset}</td>
                    <td className="px-4 py-2 text-muted-foreground">{r.category}</td>
                    <td className="px-4 py-2 text-foreground">${r.cost}M</td>
                    <td className="px-4 py-2 text-foreground">${r.value}M</td>
                    <td className="px-4 py-2 text-muted-foreground">{r.appraised}</td>
                    <td className="px-4 py-2 text-muted-foreground">{r.liquidity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="px-4 py-2 text-xs text-muted-foreground font-medium">
            Subtotal: Cost $40.0M | Est. Value $56.3M | Unrealized Gain +$16.3M
          </p>
          <p className="px-4 pb-3 text-[10px] text-muted-foreground italic">
            Hard asset valuations are estimates based on most recent independent appraisal. Not marked to market daily.
          </p>
        </div>
      </CardContent>
    </CollapsibleSection>
  );
}

/* ───────── PORTFOLIO ALLOCATION SUMMARY ───────── */

const allocSegments = [
  { label: "Hedge Funds (Liquid Alt)", value: 618, pct: 86.1, color: "#C9A84C" },
  { label: "Direct Equity", value: 25, pct: 3.5, color: "#3B82F6" },
  { label: "Commercial Real Estate", value: 25, pct: 3.5, color: "#22C55E" },
  { label: "Private / VC", value: 25, pct: 3.5, color: "#8B5CF6" },
  { label: "Hard Assets", value: 50, pct: 7.0, color: "#9CA3AF" },
];

function PortfolioAllocationSummary() {
  return (
    <Card className="bg-[#161B22] border-[#30363D]">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm text-[#C9A84C]">Total Portfolio Allocation Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Stacked bar */}
        <div className="flex h-8 rounded overflow-hidden">
          {allocSegments.map(s => (
            <div
              key={s.label}
              style={{ width: `${s.pct}%`, backgroundColor: s.color }}
              className="flex items-center justify-center text-[9px] font-semibold text-white overflow-hidden whitespace-nowrap"
              title={`${s.label}: $${s.value}M (${s.pct}%)`}
            >
              {s.pct > 5 ? `${s.pct}%` : ""}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4">
          {allocSegments.map(s => (
            <div key={s.label} className="flex items-center gap-2 text-xs">
              <span className="inline-block h-3 w-3 rounded" style={{ backgroundColor: s.color }} />
              <span className="text-foreground">{s.label}</span>
              <span className="text-muted-foreground">${s.value}M ({s.pct}%)</span>
            </div>
          ))}
        </div>

        <p className="text-xs text-muted-foreground text-center border-t border-[#30363D] pt-3">
          Total: $718M  |  Liquid: $649M (90.4%)  |  Illiquid: $75M (10.4%)  |  Semi-liquid: $25M (3.5%)
        </p>
      </CardContent>
    </Card>
  );
}

/* ───────── TAB 2: EXPOSURE ───────── */

const sectorData = [
  { name: "Technology", value: 34, color: "#3B82F6" },
  { name: "Financials", value: 16, color: "#C9A84C" },
  { name: "Consumer", value: 10, color: "#F59E0B" },
  { name: "Healthcare", value: 9, color: "#22C55E" },
  { name: "Real Estate", value: 7, color: "#10B981" },
  { name: "Hard Assets", value: 7, color: "#A78BFA" },
  { name: "Industrials", value: 6, color: "#8B5CF6" },
  { name: "Energy", value: 5, color: "#EF4444" },
  { name: "Fixed Income", value: 5, color: "#06B6D4" },
  { name: "Cash", value: 3, color: "#6B7280" },
  { name: "Private/VC", value: 3, color: "#D946EF" },
];

const geoData = [
  { name: "North America", value: 72 },
  { name: "Europe", value: 12 },
  { name: "Asia Pacific", value: 8 },
  { name: "Emerging Markets", value: 5 },
  { name: "Other / Global", value: 3 },
];

const capData = [
  { name: "Mega Cap >$200B", value: 38 },
  { name: "Large $10-200B", value: 29 },
  { name: "Mid $2-10B", value: 18 },
  { name: "Small <$2B", value: 7 },
  { name: "Private / Illiquid", value: 8 },
];

const factorData = [
  { name: "Momentum", value: 0.71 },
  { name: "Value", value: -0.14 },
  { name: "Quality", value: 0.58 },
  { name: "Size", value: -0.09 },
  { name: "Low Vol", value: 0.22 },
  { name: "Growth", value: 0.64 },
];

function ExposureTab() {
  const factorDecomp = [
    { factor: "Momentum", beta: 0.71, contrib: 2.9, pct: 32.2, dir: "Long" },
    { factor: "Quality",  beta: 0.58, contrib: 2.0, pct: 22.2, dir: "Long" },
    { factor: "Growth",   beta: 0.64, contrib: 1.8, pct: 20.0, dir: "Long" },
    { factor: "Low Vol",  beta: 0.22, contrib: 0.8, pct: 8.9, dir: "Long" },
    { factor: "Value",    beta: -0.14, contrib: 0.5, pct: 5.6, dir: "Short" },
    { factor: "Size",     beta: -0.09, contrib: 0.3, pct: 3.3, dir: "Short" },
    { factor: "Residual", beta: null,  contrib: 0.7, pct: 7.8, dir: "--" },
  ] as const;
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Sector donut */}
      <Card className="bg-[#161B22] border-[#30363D]">
        <CardHeader className="pb-2"><CardTitle className="text-sm text-[#C9A84C]">Sector Breakdown</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={sectorData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value" label={({ name, value, cx, x }) => { const anchor = x > cx ? "start" : "end"; return <text x={x} textAnchor={anchor} dominantBaseline="central" fill="#8b949e" fontSize={9}>{`${name} ${value}%`}</text>; }} labelLine={{ stroke: "#30363D" }}>
                {sectorData.map(s => <Cell key={s.name} fill={s.color} />)}
              </Pie>
              <text x="50%" y="50%" textAnchor="middle" dominantBaseline="central" fill="#C9A84C" fontSize={13} fontWeight={600}>11 Sectors</text>
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
            <BarChart data={geoData} layout="vertical" margin={{ left: 100 }}>
              <XAxis type="number" domain={[0, 80]} tick={{ fill: "#8b949e", fontSize: 11 }} />
              <YAxis type="category" dataKey="name" tick={{ fill: "#8b949e", fontSize: 11 }} width={100} />
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
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {capData.map((d) => (
                  <Cell key={d.name} fill={d.name === "Private / Illiquid" ? "#8B5CF6" : "#3B82F6"} />
                ))}
              </Bar>
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
              <XAxis type="number" domain={[-0.3, 0.8]} tick={{ fill: "#8b949e", fontSize: 11 }} />
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

      {/* Factor Risk Decomposition */}
      <Card className="bg-[#161B22] border-[#30363D]">
        <CardHeader className="pb-2"><CardTitle className="text-sm text-[#C9A84C]">Factor Risk Decomposition</CardTitle></CardHeader>
        <CardContent>
          <table className="w-full text-xs">
            <thead>
              <tr className="text-[10px] uppercase tracking-widest text-muted-foreground border-b border-[#30363D]">
                <th className="text-left py-2 font-medium">Factor</th>
                <th className="text-right py-2 font-medium">Beta</th>
                <th className="text-right py-2 font-medium">Risk Contribution</th>
                <th className="text-left py-2 font-medium pl-6">% of Total Risk</th>
                <th className="text-right py-2 font-medium">Direction</th>
              </tr>
            </thead>
            <tbody>
              {factorDecomp.map((r) => (
                <tr key={r.factor} className="border-b border-[#30363D]/50">
                  <td className="py-2 text-foreground">{r.factor}</td>
                  <td className={`py-2 text-right font-mono ${r.beta === null ? "text-muted-foreground" : r.beta >= 0 ? "text-[#22C55E]" : "text-[#EF4444]"}`}>
                    {r.beta === null ? "--" : `${r.beta >= 0 ? "+" : ""}${r.beta.toFixed(2)}`}
                  </td>
                  <td className="py-2 text-right font-mono text-foreground">{r.contrib.toFixed(1)}%</td>
                  <td className="py-2 pl-6">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-[#0D1117] rounded-full overflow-hidden max-w-[200px]">
                        <div className="h-full bg-[#C9A84C] rounded-full" style={{ width: `${r.pct}%` }} />
                      </div>
                      <span className="font-mono text-foreground w-12 text-right">{r.pct.toFixed(1)}%</span>
                    </div>
                  </td>
                  <td className={`py-2 text-right font-medium ${r.dir === "Long" ? "text-[#22C55E]" : r.dir === "Short" ? "text-[#EF4444]" : "text-muted-foreground"}`}>
                    {r.dir}
                  </td>
                </tr>
              ))}
              <tr className="border-t-2 border-[#30363D] font-bold">
                <td className="py-2 text-foreground">TOTAL</td>
                <td className="py-2 text-right text-muted-foreground">--</td>
                <td className="py-2 text-right font-mono text-foreground">9.0%</td>
                <td className="py-2 pl-6">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-[#0D1117] rounded-full overflow-hidden max-w-[200px]">
                      <div className="h-full bg-[#C9A84C] rounded-full" style={{ width: `100%` }} />
                    </div>
                    <span className="font-mono text-foreground w-12 text-right">100%</span>
                  </div>
                </td>
                <td className="py-2 text-right text-muted-foreground">--</td>
              </tr>
            </tbody>
          </table>
          <p className="mt-3 text-[10px] text-muted-foreground italic">
            Risk contribution calculated using Barra-style factor decomposition. Residual = idiosyncratic risk not explained by listed factors.
          </p>
        </CardContent>
      </Card>

      {/* Asset Class Allocation */}
      <AssetClassAllocationChart />
    </div>
  );
}

/* ───────── ASSET CLASS ALLOCATION CHART ───────── */

const assetClassData = [
  { name: "Hedge Funds (Liquid Alt)", value: 618, pct: 86.1, color: "#C9A84C" },
  { name: "Direct Equity", value: 25, pct: 3.5, color: "#3B82F6" },
  { name: "Commercial Real Estate", value: 25, pct: 3.5, color: "#22C55E" },
  { name: "Private / VC", value: 25, pct: 3.5, color: "#8B5CF6" },
  { name: "Hard Assets", value: 50, pct: 7.0, color: "#9CA3AF" },
];

function AssetClassAllocationChart() {
  return (
    <Card className="bg-[#161B22] border-[#30363D]">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm text-[#C9A84C]">Asset Class Allocation — Full Portfolio ($718M)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {assetClassData.map((d) => (
          <div key={d.name} className="flex items-center gap-3 text-xs">
            <span className="w-[100px] sm:w-[180px] text-foreground shrink-0 truncate text-[10px] sm:text-xs">{d.name}</span>
            <div className="flex-1 h-6 bg-[#0D1117] rounded overflow-hidden relative">
              <div
                className="h-full rounded flex items-center justify-end pr-2"
                style={{ width: `${Math.max(d.pct, 4)}%`, backgroundColor: d.color }}
              >
                {d.pct > 10 && <span className="text-[10px] font-semibold text-white">${d.value}M</span>}
              </div>
              {d.pct <= 10 && (
                <span className="absolute left-[calc(max(4%,_var(--w))_+_8px)] top-1/2 -translate-y-1/2 text-[10px] text-foreground" style={{ left: `calc(${Math.max(d.pct, 4)}% + 8px)` }}>
                  ${d.value}M
                </span>
              )}
            </div>
            <span className="w-12 text-right text-muted-foreground font-mono">{d.pct}%</span>
          </div>
        ))}
        <p className="text-[10px] text-muted-foreground text-center border-t border-[#30363D] pt-3 mt-4">
          Liquid: $643M (89.6%)  |  Semi-liquid: $25M (3.5%)  |  Illiquid: $75M (10.4%)  |  Total AUM: $718M
        </p>
      </CardContent>
    </Card>
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
  const [varMethod, setVarMethod] = useState<"Parametric" | "Historical Simulation" | "Monte Carlo">("Parametric");
  const varValues: Record<typeof varMethod, string> = {
    "Parametric": "-0.82%",
    "Historical Simulation": "-1.14%",
    "Monte Carlo": "-0.97%",
  };
  const methods: Array<typeof varMethod> = ["Parametric", "Historical Simulation", "Monte Carlo"];
  return (
    <div className="space-y-4">
      {/* VaR methodology selector */}
      <div className="flex items-center gap-3">
        <span className="text-xs text-muted-foreground">VaR Methodology:</span>
        <div className="flex items-center gap-2">
          {methods.map((m) => {
            const active = varMethod === m;
            return (
              <button
                key={m}
                onClick={() => setVarMethod(m)}
                className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                  active
                    ? "bg-[#C9A84C] text-[#0D1117] border-[#C9A84C]"
                    : "bg-[#161B22] text-[#8b949e] border-[#30363D] hover:text-[#C9A84C] hover:border-[#C9A84C]/50"
                }`}
              >
                {m}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            Portfolio Risk Summary: Sharpe 1.74 | Sortino 2.31 | Max Drawdown -6.8% | Annualized Vol 5.8% | Beta to S&P 0.41 | VaR 95% (1-day) {varValues[varMethod]}
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
    <div className="p-3 sm:p-6 space-y-4 bg-[#0D1117] min-h-full">
      <Tabs defaultValue="positions" className="w-full">
        <TabsList className="bg-[#161B22] border border-[#30363D] flex flex-wrap h-auto gap-1 p-1">
          <TabsTrigger value="positions" className="text-[10px] sm:text-xs px-2 py-1.5 cursor-pointer transition-all duration-200 hover:bg-[#C9A84C]/10 hover:text-[#C9A84C] hover:scale-105 data-[state=active]:bg-[#C9A84C]/20 data-[state=active]:text-[#C9A84C] data-[state=active]:shadow-[0_0_12px_rgba(201,168,76,0.3)] data-[state=inactive]:tab-heartbeat-inactive">HOLDINGS</TabsTrigger>
          <TabsTrigger value="exposure" className="text-[10px] sm:text-xs px-2 py-1.5 cursor-pointer transition-all duration-200 hover:bg-[#C9A84C]/10 hover:text-[#C9A84C] hover:scale-105 data-[state=active]:bg-[#C9A84C]/20 data-[state=active]:text-[#C9A84C] data-[state=active]:shadow-[0_0_12px_rgba(201,168,76,0.3)] data-[state=inactive]:tab-heartbeat-inactive">EXPOSURE</TabsTrigger>
          <TabsTrigger value="correlation" className="text-[10px] sm:text-xs px-2 py-1.5 cursor-pointer transition-all duration-200 hover:bg-[#C9A84C]/10 hover:text-[#C9A84C] hover:scale-105 data-[state=active]:bg-[#C9A84C]/20 data-[state=active]:text-[#C9A84C] data-[state=active]:shadow-[0_0_12px_rgba(201,168,76,0.3)] data-[state=inactive]:tab-heartbeat-inactive">CORRELATIONS</TabsTrigger>
          <TabsTrigger value="risk" className="text-[10px] sm:text-xs px-2 py-1.5 cursor-pointer transition-all duration-200 hover:bg-[#C9A84C]/10 hover:text-[#C9A84C] hover:scale-105 data-[state=active]:bg-[#C9A84C]/20 data-[state=active]:text-[#C9A84C] data-[state=active]:shadow-[0_0_12px_rgba(201,168,76,0.3)] data-[state=inactive]:tab-heartbeat-inactive">RISK</TabsTrigger>
          <TabsTrigger value="stress" className="text-[10px] sm:text-xs px-2 py-1.5 cursor-pointer transition-all duration-200 hover:bg-[#C9A84C]/10 hover:text-[#C9A84C] hover:scale-105 data-[state=active]:bg-[#C9A84C]/20 data-[state=active]:text-[#C9A84C] data-[state=active]:shadow-[0_0_12px_rgba(201,168,76,0.3)] data-[state=inactive]:tab-heartbeat-inactive">STRESS TEST YOUR PORTFOLIO</TabsTrigger>
        </TabsList>
        <TabsContent value="positions"><PositionsTabWrapper /></TabsContent>
        <TabsContent value="exposure"><ExposureTab /></TabsContent>
        <TabsContent value="correlation"><CorrelationTab /></TabsContent>
        <TabsContent value="risk"><RiskTab /></TabsContent>
        <TabsContent value="stress"><StressScenariosTab /></TabsContent>
      </Tabs>
    </div>
  );
}

function PositionsTabWrapper() {
  const { liveValues, isLive, toggleLive } = useMarketSimulation(INITIAL_SIM_VALUES, 0.08);
  return <PositionsTab liveValues={liveValues} isLive={isLive} toggleLive={toggleLive} />;
}
