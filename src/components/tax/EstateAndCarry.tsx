import { useEffect, useState } from "react";
import { Landmark, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useActiveEntity } from "@/lib/active-entity";
import styles from "./EstateAndCarry.module.css";
import { useAgentSimulation, type AgentLogLine } from "@/hooks/useAgentSimulation";

type Carry = {
  id: string;
  fund_name: string | null;
  hold_period_years: number | null;
  sec_1061_status: "pass" | "watch" | "fail" | null;
  recharacterization_amount: number | null;
  tax_delta: number | null;
};

const SCAN_LOG: AgentLogLine[] = [
  { type: "info", tag: "SCAN",  message: "23 carry-eligible funds" },
  { type: "info", tag: "CHECK", message: "IRC §1061(d) 3-year hold test" },
  { type: "warn", tag: "FAIL",  message: "Helix PE IV · 2.1y avg hold" },
  { type: "warn", tag: "CALC",  message: "$1.8M LTCG → STCG" },
  { type: "warn", tag: "WATCH", message: "Vega Special Sits · 2.8y · approaching test" },
  { type: "warn", tag: "WATCH", message: "Arcturus II · 2.6y · approaching test" },
  { type: "ok",   tag: "PASS",  message: "Northgate V · 4.2y safe" },
  { type: "ok",   tag: "PASS",  message: "Solaris III · 5.1y safe" },
  { type: "info", tag: "CALC",  message: "Tax delta: $452K (17% spread)" },
  { type: "ok",   tag: "DONE",  message: "Recharacterization scan complete" },
];

const compact = new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 });
const fmtM = (n: number | null | undefined) => (n == null ? "—" : `$${compact.format(n)}`);

function EstateCard() {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div>
          <div className={styles.titleRow}>
            <Landmark size={16} color="#f59e0b" />
            <span className={styles.title}>OBBBA Estate Planning</span>
          </div>
          <div className={styles.subtitle}>$15M permanent exemption · Step-up basis recalculus · GST</div>
        </div>
        <span className={styles.pillAmber}>REVISIT 2024 PLAN</span>
      </div>

      <table className={styles.tbl}>
        <tbody>
          <tr><td className={styles.k}>Federal exemption (2026)</td><td className={`${styles.right} ${styles.v}`}>$15.0M / person</td></tr>
          <tr><td className={styles.k}>Used in 2024 SLAT</td><td className={`${styles.right} ${styles.amber}`}>$11.4M (over-funded)</td></tr>
          <tr><td className={styles.k}>Combined headroom</td><td className={`${styles.right} ${styles.green}`}>$18.6M</td></tr>
          <tr><td className={styles.k}>NY estate tax cliff</td><td className={`${styles.right} ${styles.red}`}>$3.2M exposure</td></tr>
          <tr><td className={styles.k}>Step-up forgone (2024 gifts)</td><td className={`${styles.right} ${styles.red}`}>~$4.1M basis lost</td></tr>
          <tr><td className={styles.k}>Active GRATs</td><td className={`${styles.right} ${styles.v}`}>3 rolling · $14.0M</td></tr>
          <tr><td className={styles.k}>SLAT reciprocity risk</td><td className={`${styles.right} ${styles.amber}`}>Material · review</td></tr>
        </tbody>
      </table>

      <div className={styles.insight}>
        <strong style={{ color: "#fff", fontWeight: 500 }}>Action:</strong> 2024 SLAT was sized for ~$7M post-sunset exemption. OBBBA permanence at $15M means high-basis assets may belong back in the grantor's estate for §1014 step-up. Consider §675 swap power.
      </div>
    </div>
  );
}

function CarryCard() {
  const { activeEntityId } = useActiveEntity();
  const [rows, setRows] = useState<Carry[]>([]);

  const { isLogOpen, currentLogs, run: runScan } = useAgentSimulation({
    agentKey: "s1061",
    logSequence: SCAN_LOG,
    flashElementIds: ["s1061-btn"],
  });

  useEffect(() => {
    supabase
      .from("carry_holdings")
      .select("id, fund_name, hold_period_years, sec_1061_status, recharacterization_amount, tax_delta")
      .eq("entity_id", activeEntityId)
      .order("hold_period_years", { ascending: true })
      .then(({ data }) => setRows((data as Carry[]) ?? []));
  }, [activeEntityId]);

  const totalRisk = rows.reduce((s, r) => s + (r.recharacterization_amount ?? 0), 0);
  const totalDelta = rows.reduce((s, r) => s + (r.tax_delta ?? 0), 0);

  const holdClass = (y: number | null) => {
    if (y == null) return styles.muted;
    if (y >= 3) return styles.green;
    if (y >= 2.5) return styles.amber;
    return styles.red;
  };

  const statusPill = (s: Carry["sec_1061_status"]) => {
    if (s === "pass") return <span className={styles.pillGreen}>PASS</span>;
    if (s === "watch") return <span className={styles.pillAmberSm}>WATCH</span>;
    return <span className={styles.pillRed}>FAIL</span>;
  };

  const riskCell = (r: Carry) => {
    if (r.sec_1061_status === "pass") return <span className={styles.muted}>—</span>;
    const cls = r.sec_1061_status === "fail" ? styles.red : styles.amber;
    return <span className={cls}>{fmtM(r.recharacterization_amount)}</span>;
  };

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div>
          <div className={styles.titleRow}>
            <Clock size={16} color="#f59e0b" />
            <span className={styles.title}>§1061 Carry Tracker</span>
          </div>
          <div className={styles.subtitle}>3-yr APIC hold test · Recharacterization · LP carry</div>
        </div>
        <button id="s1061-btn" className={styles.agentBtn} onClick={runScan}>⚡ Scan</button>
      </div>

      <table className={styles.tbl}>
        <thead>
          <tr>
            <th>Fund</th>
            <th className={styles.right}>Hold</th>
            <th className={styles.right}>Test</th>
            <th className={styles.right}>Risk $</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id}>
              <td className={styles.v}>{r.fund_name}</td>
              <td className={`${styles.right} ${holdClass(r.hold_period_years)}`}>
                {r.hold_period_years?.toFixed(1)}y
              </td>
              <td className={styles.right}>{statusPill(r.sec_1061_status)}</td>
              <td className={styles.right}>{riskCell(r)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className={`${styles.insight} ${styles.red}`}>
        <strong style={{ color: "#fff", fontWeight: 500 }}>Total recharacterization risk:</strong> {fmtM(totalRisk)} (LTCG → STCG) · Tax delta: {fmtM(totalDelta)} at 17% bracket spread · Negotiate hold extension w/ Helix GP
      </div>

      <div id="s1061-log" className={`${styles.agentLog} ${isLogOpen ? styles.open : ""}`}>
        {currentLogs.map((l, i) => (
          <div key={i} className={styles.logLine}>
            <span style={{ color: "#555", marginRight: 6 }}>{l.ts}</span>
            <span className={`${styles.logTag} ${l.type === "ok" ? styles.tagOk : l.type === "warn" ? styles.tagWarn : styles.tagInfo}`}>
              {l.tag}
            </span>
            {l.message}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function EstateAndCarry() {
  return (
    <div className={styles.row}>
      <EstateCard />
      <CarryCard />
    </div>
  );
}