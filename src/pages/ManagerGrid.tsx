import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { managers, Manager } from "@/data/managers";
import FlagDot from "@/components/FlagDot";
import RiskScoreBadge from "@/components/RiskScoreBadge";
import { Search } from "lucide-react";

type SortKey = keyof Manager;
type SortDir = "asc" | "desc";

const ManagerGrid = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [strategyFilter, setStrategyFilter] = useState("All");
  const [flagFilter, setFlagFilter] = useState("All");
  const [sortKey, setSortKey] = useState<SortKey>("risk_score");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const strategies = useMemo(() => ["All", ...new Set(managers.map((m) => m.strategy))], []);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("desc"); }
  };

  const filtered = useMemo(() => {
    let result = [...managers];
    if (search) result = result.filter((m) => m.name.toLowerCase().includes(search.toLowerCase()));
    if (strategyFilter !== "All") result = result.filter((m) => m.strategy === strategyFilter);
    if (flagFilter !== "All") result = result.filter((m) => m.flag === flagFilter.toLowerCase());
    result.sort((a, b) => {
      const av = a[sortKey], bv = b[sortKey];
      if (av == null) return 1;
      if (bv == null) return -1;
      if (typeof av === "string") return sortDir === "asc" ? av.localeCompare(bv as string) : (bv as string).localeCompare(av);
      return sortDir === "asc" ? (av as number) - (bv as number) : (bv as number) - (av as number);
    });
    return result;
  }, [search, strategyFilter, flagFilter, sortKey, sortDir]);

  const SortHeader = ({ label, field }: { label: string; field: SortKey }) => (
    <th
      className="px-3 py-3 text-left text-[11px] uppercase tracking-wider text-muted-foreground cursor-pointer hover:text-foreground transition-colors select-none"
      onClick={() => toggleSort(field)}
    >
      {label} {sortKey === field && (sortDir === "asc" ? "↑" : "↓")}
    </th>
  );

  return (
    <div className="p-6 space-y-4 max-w-[1400px] mx-auto">
      <h2 className="text-lg font-semibold text-foreground">Manager Grid</h2>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            className="bg-secondary border border-border rounded-md pl-9 pr-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary w-60"
            placeholder="Search by name…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="bg-secondary border border-border rounded-md px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          value={strategyFilter}
          onChange={(e) => setStrategyFilter(e.target.value)}
        >
          {strategies.map((s) => <option key={s}>{s}</option>)}
        </select>
        <select
          className="bg-secondary border border-border rounded-md px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          value={flagFilter}
          onChange={(e) => setFlagFilter(e.target.value)}
        >
          {["All", "Green", "Yellow", "Red"].map((f) => <option key={f}>{f}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-lg overflow-x-auto scrollbar-thin">
        <table className="w-full text-sm">
          <thead className="border-b border-border">
            <tr>
              <SortHeader label="Manager Name" field="name" />
              <SortHeader label="Strategy" field="strategy" />
              <SortHeader label="AUM ($B)" field="aum_bn" />
              <SortHeader label="Risk Score" field="risk_score" />
              <th className="px-3 py-3 text-left text-[11px] uppercase tracking-wider text-muted-foreground">Flag</th>
              <th className="px-3 py-3 text-left text-[11px] uppercase tracking-wider text-muted-foreground">SEC Reg</th>
              <th className="px-3 py-3 text-left text-[11px] uppercase tracking-wider text-muted-foreground">FINRA</th>
              <th className="px-3 py-3 text-left text-[11px] uppercase tracking-wider text-muted-foreground">Adverse Media</th>
              <SortHeader label="Key Person Risk" field="key_person_risk" />
              <SortHeader label="AUM Trend" field="aum_trend" />
              <th className="px-3 py-3 text-left text-[11px] uppercase tracking-wider text-muted-foreground">Updated</th>
              <th className="px-3 py-3 text-left text-[11px] uppercase tracking-wider text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((m) => (
              <tr key={m.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                <td className="px-3 py-3 font-medium text-foreground whitespace-nowrap">{m.name}</td>
                <td className="px-3 py-3 text-muted-foreground">{m.strategy}</td>
                <td className="px-3 py-3 tabular-nums">${m.aum_bn}</td>
                <td className="px-3 py-3"><RiskScoreBadge score={m.risk_score} /></td>
                <td className="px-3 py-3"><FlagDot flag={m.flag} /></td>
                <td className="px-3 py-3">{m.sec_registered ? "✓" : "✗"}</td>
                <td className="px-3 py-3 text-xs">{m.finra_status}</td>
                <td className="px-3 py-3 text-xs max-w-[150px] truncate">{m.adverse_media}</td>
                <td className="px-3 py-3 text-xs">{m.key_person_risk}</td>
                <td className="px-3 py-3 text-xs">{m.aum_trend}</td>
                <td className="px-3 py-3 text-xs text-muted-foreground">{m.last_updated}</td>
                <td className="px-3 py-3">
                  <button
                    onClick={() => navigate(`/manager/${m.id}`)}
                    className="text-xs font-medium text-primary hover:text-primary/80 border border-primary/30 rounded px-2.5 py-1 hover:bg-primary/10 transition-colors"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManagerGrid;
