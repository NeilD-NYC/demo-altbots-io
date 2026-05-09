import { useEffect, useState } from "react";
import { ShieldCheck, ChevronDown, FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useActiveEntity } from "@/lib/active-entity";
import styles from "./PpliRiskMonitor.module.css";
import { useAgentSimulation, type AgentLogLine } from "@/hooks/useAgentSimulation";

const PPLI_AUDIT_LOG: AgentLogLine[] = [
  { type: "info", tag: "INIT",  message: "PPLI compliance audit · Policies A & B" },
  { type: "info", tag: "CHECK", message: "IRC §817(h) diversification (5/25/40)" },
  { type: "ok",   tag: "PASS",  message: "Policy A · 5 holdings · max 28%" },
  { type: "warn", tag: "FLAG",  message: "Policy A · 3 allocation memos in 12mo" },
  { type: "info", tag: "CHECK", message: "Investor control doctrine · Rev. Rul. 2003-91" },
  { type: "ok",   tag: "PASS",  message: "Policy B · §7702A MEC clean" },
  { type: "info", tag: "SCAN",  message: "Wyden S.4421 clawback exposure refresh" },
  { type: "ok",   tag: "DONE",  message: "Audit complete · 1 flag · memo queued" },
];

type Policy = {
  id: string;
  carrier_name: string | null;
  policy_letter: string | null;
  issue_date: string | null;
  cash_value: number | null;
  death_benefit: number | null;
  premium_year_current: number | null;
  premium_years_total: number | null;
  idf_domicile: string | null;
  idf_holdings_count: number | null;
  max_position_pct: number | null;
  mec_status: string | null;
  diversification_817h_pass: boolean | null;
  investor_control_flags: number | null;
  wyden_risk_level: string | null;
  wyden_clawback_low: number | null;
  wyden_clawback_high: number | null;
  lifetime_pv_shield: number | null;
  broker_name: string | null;
};

const compact = new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 });
const fmtM = (n: number | null | undefined) => (n == null ? "—" : `$${compact.format(n)}`);
const fmtMonth = (d: string | null) => {
  if (!d) return "—";
  const dt = new Date(d);
  return dt.toLocaleDateString("en-US", { month: "short", year: "numeric" });
};

function triggerAdvisor(key: string) {
  window.dispatchEvent(new CustomEvent("altbots:advisor", { detail: key }));
}

export default function PpliRiskMonitor() {
  const { activeEntityId } = useActiveEntity();
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [openLetter, setOpenLetter] = useState<string | null>(null);

  const { isLogOpen, currentLogs, run: runAudit } = useAgentSimulation({
    agentKey: "ppli",
    logSequence: PPLI_AUDIT_LOG,
    flashElementIds: ["ppli-btn"],
  });

  useEffect(() => {
    supabase
      .from("ppli_policies")
      .select("*")
      .eq("entity_id", activeEntityId)
      .order("policy_letter", { ascending: true })
      .then(({ data }) => setPolicies((data as Policy[]) ?? []));
  }, [activeEntityId]);

  const totalCash = policies.reduce((s, p) => s + (p.cash_value ?? 0), 0);
  const policyA = policies.find((p) => p.policy_letter === "A");
  const policyB = policies.find((p) => p.policy_letter === "B");

  const togglePolicy = (letter: string) =>
    setOpenLetter((cur) => (cur === letter ? null : letter));

  const wydenColor = (lvl: string | null) =>
    lvl === "high" ? styles.red : lvl === "medium" ? styles.amber : styles.green;

  const renderPolicyCard = (p: Policy) => {
    const isOpen = openLetter === p.policy_letter;
    const flagged = p.wyden_risk_level === "high" || (p.investor_control_flags ?? 0) > 0;
    return (
      <div className={styles.policyCol} key={p.id}>
        <div className={styles.policyCard} onClick={() => togglePolicy(p.policy_letter!)}>
          <div className={styles.policyHead}>
            <div>
              <div className={styles.policyName}>
                Policy {p.policy_letter} · {p.carrier_name}
              </div>
              <div className={styles.policyMeta}>
                Issued {fmtMonth(p.issue_date)} · {p.idf_domicile} IDF · {fmtM(p.death_benefit)} death benefit
              </div>
            </div>
            <div className={styles.statusGroup}>
              <span className={flagged ? styles.pillAmber : styles.pillGreen}>
                {flagged ? "MONITOR" : "COMPLIANT"}
              </span>
              <ChevronDown
                id={`pol-${p.policy_letter}-chev`}
                size={14}
                className={`${styles.chev} ${isOpen ? styles.open : ""}`}
              />
            </div>
          </div>
          <div className={styles.statRow}>
            <div><span className={styles.statKey}>Cash value:</span> {fmtM(p.cash_value)}</div>
            <div>
              <span className={styles.statKey}>MEC status:</span>{" "}
              <span className={p.premium_year_current === p.premium_years_total ? styles.green : styles.amber}>
                {p.premium_year_current === p.premium_years_total
                  ? "✓ Fully funded"
                  : `✓ Year ${p.premium_year_current} of ${p.premium_years_total}`}
              </span>
            </div>
            <div>
              <span className={styles.statKey}>817(h) test:</span>{" "}
              <span className={styles.green}>✓ Pass ({p.idf_holdings_count} holdings)</span>
            </div>
            <div>
              <span className={styles.statKey}>Wyden risk:</span>{" "}
              <span className={wydenColor(p.wyden_risk_level)}>
                {(p.wyden_risk_level ?? "low").toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderSheet = (p: Policy | undefined, opts: {
    issuance: string;
    dacText: string;
    statePremText: string;
    meText: string;
    investorControlText: string;
    holdingsText: string;
    recharPct: string;
    surrenderText: string;
  }) => {
    if (!p) return null;
    const isOpen = openLetter === p.policy_letter;
    return (
      <div id={`pol-${p.policy_letter}-detail`} className={`${styles.sheet} ${isOpen ? styles.open : ""}`}>
        <div className={styles.sheetTitle}>
          <FileText size={14} color="#f59e0b" />
          Policy {p.policy_letter} · {p.carrier_name} · Detail View
        </div>
        <div className={styles.sheetGrid}>
          <div>
            <div className={styles.sectionLabel}>Compliance Checks</div>
            <div className={styles.dataRow}>
              <span className={styles.dataKey}>IRC §7702 corridor</span>
              <span className={`${styles.dataVal} ${styles.green}`}>✓ Pass · DB/CV ratio 2.03×</span>
            </div>
            <div className={styles.dataRow}>
              <span className={styles.dataKey}>IRC §7702A (MEC)</span>
              <span className={`${styles.dataVal} ${styles.green}`}>
                ✓ Year {p.premium_year_current} of {p.premium_years_total} funding
              </span>
            </div>
            <div className={styles.dataRow}>
              <span className={styles.dataKey}>IRC §817(h) diversification</span>
              <span className={`${styles.dataVal} ${styles.green}`}>{opts.holdingsText}</span>
            </div>
            <div className={styles.dataRow}>
              <span className={styles.dataKey}>Investor control doctrine</span>
              <span className={`${styles.dataVal} ${styles.amber}`}>{opts.investorControlText}</span>
            </div>
            <div className={styles.dataRow}>
              <span className={styles.dataKey}>DAC tax (§848)</span>
              <span className={styles.dataVal}>{opts.dacText}</span>
            </div>
            <div className={styles.dataRow}>
              <span className={styles.dataKey}>State premium tax</span>
              <span className={styles.dataVal}>{opts.statePremText}</span>
            </div>
            <div className={styles.dataRow}>
              <span className={styles.dataKey}>Annual M&amp;E charges</span>
              <span className={styles.dataVal}>{opts.meText}</span>
            </div>
          </div>
          <div>
            <div className={styles.sectionLabel}>Wyden Bill Exposure Analysis</div>
            <div className={styles.dataRow}>
              <span className={styles.dataKey}>Issuance date</span>
              <span className={styles.dataVal}>{opts.issuance}</span>
            </div>
            <div className={styles.dataRow}>
              <span className={styles.dataKey}>Falls under retroactive scope</span>
              <span className={`${styles.dataVal} ${styles.red}`}>YES · post-2020 issuance</span>
            </div>
            <div className={styles.dataRow}>
              <span className={styles.dataKey}>'Covered contract' trigger</span>
              <span className={`${styles.dataVal} ${styles.red}`}>YES · alt asset wrapper</span>
            </div>
            <div className={styles.dataRow}>
              <span className={styles.dataKey}>Recharacterization risk</span>
              <span className={`${styles.dataVal} ${styles.amber}`}>{opts.recharPct}</span>
            </div>
            <div className={styles.dataRow}>
              <span className={styles.dataKey}>Estimated clawback</span>
              <span className={`${styles.dataVal} ${styles.red}`}>
                {fmtM(p.wyden_clawback_low)} – {fmtM(p.wyden_clawback_high)}
              </span>
            </div>
            <div className={styles.dataRow}>
              <span className={styles.dataKey}>Mitigation: surrender</span>
              <span className={styles.dataVal}>{opts.surrenderText}</span>
            </div>
            <div className={styles.dataRow}>
              <span className={styles.dataKey}>Mitigation: 1035 exchange</span>
              <span className={`${styles.dataVal} ${styles.green}`}>$0 tax · domicile shift</span>
            </div>
            <div className={styles.actionRow}>
              <button className={styles.ghostBtn} onClick={(e) => { e.stopPropagation(); triggerAdvisor("wyden"); }}>Modeling →</button>
              <button className={styles.ghostBtn} onClick={(e) => e.stopPropagation()}>Email {p.carrier_name?.split(" ")[0]}</button>
              <button className={styles.ghostBtn} onClick={(e) => e.stopPropagation()}>Generate Memo</button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const totalPvShield = policies.reduce((s, p) => s + (p.lifetime_pv_shield ?? 0), 0);
  const totalClawLow = policies.reduce((s, p) => s + (p.wyden_clawback_low ?? 0), 0);
  const totalClawHigh = policies.reduce((s, p) => s + (p.wyden_clawback_high ?? 0), 0);
  const netAtRiskLowPct = totalPvShield > 0 ? Math.round((totalClawLow / totalPvShield) * 100) : 0;
  const netAtRiskHighPct = totalPvShield > 0 ? Math.round((totalClawHigh / totalPvShield) * 100) : 0;

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div>
          <div className={styles.titleRow}>
            <ShieldCheck size={16} color="#f59e0b" />
            <span className={styles.title}>PPLI Risk Monitor</span>
          </div>
          <div className={styles.subtitle}>
            {policies.length} active policies · {fmtM(totalCash)} cash value · IRC §817(h) diversification · Investor control doctrine · §7702A MEC
          </div>
        </div>
        <div className={styles.actions}>
          <button className={styles.ghostBtn} onClick={() => triggerAdvisor("wyden")}>
            Mitigation Options
          </button>
          <button id="ppli-btn" className={styles.agentBtn} onClick={runAudit}>⚡ Run Compliance Audit</button>
        </div>
      </div>

      <div className={styles.policyGrid}>
        {policies.map(renderPolicyCard)}
      </div>

      {renderSheet(policyA, {
        issuance: "Mar 14, 2022",
        dacText: "$184K · 1.5% of premium",
        statePremText: "$24K · DE domicile",
        meText: "87 bps · institutional",
        investorControlText: "⚠ 3 allocation memos in 12mo",
        holdingsText: "✓ 5 holdings · max 28%",
        recharPct: "~38% of cash value",
        surrenderText: "$2.1M tax · $22.5M net",
      })}

      {renderSheet(policyB, {
        issuance: "Sep 8, 2021",
        dacText: "$92K · 1.5% of premium",
        statePremText: "$18K · DE domicile",
        meText: "82 bps · institutional",
        investorControlText: "⚠ 1 allocation memo in 12mo",
        holdingsText: "✓ 7 holdings · max 22%",
        recharPct: "~28% of cash value",
        surrenderText: "$0.9M tax · $11.0M net",
      })}

      <div className={styles.summary}>
        <span><strong>Lifetime PV shield:</strong> {fmtM(totalPvShield)}</span>
        <span><strong>Wyden clawback range:</strong> {fmtM(totalClawLow)} – {fmtM(totalClawHigh)}</span>
        <span><strong>Net at risk:</strong> {netAtRiskLowPct}–{netAtRiskHighPct}%</span>
        <span><strong>Broker:</strong> {policies[0]?.broker_name ?? "—"}</span>
      </div>

      <div id="ppli-log" className={`${styles.agentLog} ${isLogOpen ? styles.open : ""}`} style={{ padding: isLogOpen ? "10px 12px" : 0 }}>
        {currentLogs.map((l, i) => {
          const color = l.type === "ok" ? "#10b981" : l.type === "warn" ? "#fbbf24" : l.type === "err" ? "#ef4444" : "#60a5fa";
          return (
            <div key={i} style={{ fontSize: 10, fontFamily: "ui-monospace, monospace", color: "#aaa", padding: "2px 0" }}>
              <span style={{ color: "#555", marginRight: 6 }}>{l.ts}</span>
              <span style={{ color, fontWeight: 600, marginRight: 6 }}>[{l.tag}]</span>
              {l.message}
            </div>
          );
        })}
      </div>
    </div>
  );
}