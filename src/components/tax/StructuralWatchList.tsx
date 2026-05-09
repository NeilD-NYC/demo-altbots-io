import { useEffect, useState } from "react";
import {
  Radar, Flag, Clock, ShieldX, Percent, Globe, Shuffle, ReceiptText, Heart, Building2,
  type LucideIcon,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useActiveEntity } from "@/lib/active-entity";
import styles from "./StructuralWatchList.module.css";
import { useAgentSimulation, type AgentLogLine } from "@/hooks/useAgentSimulation";

type Flag = {
  id: string;
  flag_type: string | null;
  severity: string | null;
  title: string | null;
  description: string | null;
};

const SCAN_LOG: AgentLogLine[] = [
  { type: "info", tag: "INIT",  message: "Full tax structural scan starting" },
  { type: "ok",   tag: "CHECK", message: "PFIC elections · QEF vs MTM windows" },
  { type: "ok",   tag: "CHECK", message: "QSBS clocks across 12 portcos" },
  { type: "ok",   tag: "CHECK", message: "UBTI exposure · foundation entities" },
  { type: "ok",   tag: "CHECK", message: "NIIT 3.8% on net investment income" },
  { type: "ok",   tag: "CHECK", message: "FTC carryovers approaching expiration" },
  { type: "ok",   tag: "CHECK", message: "Wash sale windows on harvest candidates" },
  { type: "ok",   tag: "CHECK", message: "PTET / SALT workaround utilization" },
  { type: "ok",   tag: "CHECK", message: "DAF / CRT capacity vs AGI deduction limits" },
  { type: "ok",   tag: "CHECK", message: "Trust situs · DAPT compliance · SD/NV" },
  { type: "ok",   tag: "CHECK", message: "GST exemption allocation tracking" },
  { type: "ok",   tag: "DONE",  message: "14 items scanned · 0 new alerts" },
];

const TYPE_META: Record<string, { color: string; Icon: LucideIcon }> = {
  pfic:        { color: "#ef4444", Icon: Flag },
  qsbs:        { color: "#fbbf24", Icon: Clock },
  ubti:        { color: "#fbbf24", Icon: ShieldX },
  niit:        { color: "#a78bfa", Icon: Percent },
  ftc:         { color: "#60a5fa", Icon: Globe },
  wash_sale:   { color: "#10b981", Icon: Shuffle },
  salt_ptet:   { color: "#f59e0b", Icon: ReceiptText },
  daf_crt:     { color: "#f472b6", Icon: Heart },
  trust_situs: { color: "#94a3b8", Icon: Building2 },
};

export default function StructuralWatchList() {
  const { activeEntityId } = useActiveEntity();
  const [flags, setFlags] = useState<Flag[]>([]);

  const { isLogOpen, currentLogs, run: runScan } = useAgentSimulation({
    agentKey: "scan",
    logSequence: SCAN_LOG,
    flashElementIds: ["scan-btn"],
  });

  useEffect(() => {
    supabase
      .from("structural_flags")
      .select("id, flag_type, severity, title, description")
      .eq("entity_id", activeEntityId)
      .order("created_at", { ascending: true })
      .then(({ data }) => setFlags((data as Flag[]) ?? []));
  }, [activeEntityId]);

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div>
          <div className={styles.titleRow}>
            <Radar size={16} color="#f59e0b" />
            <span className={styles.title}>Structural Watch List · {flags.length} items tracked</span>
          </div>
          <div className={styles.subtitle}>Continuously scanned across all entities and holdings</div>
        </div>
        <button id="scan-btn" className={styles.agentBtn} onClick={runScan}>⚡ Full Tax Scan</button>
      </div>

      <div className={styles.grid}>
        {flags.map((f) => {
          const meta = TYPE_META[f.flag_type ?? ""] ?? { color: "#888", Icon: Flag };
          const { Icon } = meta;
          return (
            <div
              key={f.id}
              className={styles.flag}
              style={{ borderLeftColor: meta.color }}
              onClick={() => { /* future: navigate to detail */ }}
            >
              <div className={styles.flagTitleRow} style={{ color: meta.color }}>
                <Icon size={12} color={meta.color} />
                {f.title}
              </div>
              <div className={styles.flagDesc}>{f.description}</div>
            </div>
          );
        })}
      </div>

      <div id="scan-log" className={`${styles.agentLog} ${isLogOpen ? styles.open : ""}`}>
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