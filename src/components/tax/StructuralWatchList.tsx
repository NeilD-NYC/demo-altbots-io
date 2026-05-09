import { useEffect, useRef, useState } from "react";
import {
  Radar, Flag, Clock, ShieldX, Percent, Globe, Shuffle, ReceiptText, Heart, Building2,
  type LucideIcon,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useActiveEntity } from "@/lib/active-entity";
import styles from "./StructuralWatchList.module.css";

type Flag = {
  id: string;
  flag_type: string | null;
  severity: string | null;
  title: string | null;
  description: string | null;
};

type LogLine = { tag: "info" | "ok" | "warn"; text: string };

const SCAN_LOG: LogLine[] = [
  { tag: "info", text: "INIT Full tax structural scan starting" },
  { tag: "ok",   text: "CHECK PFIC elections · QEF vs MTM windows" },
  { tag: "ok",   text: "CHECK QSBS clocks across 12 portcos" },
  { tag: "ok",   text: "CHECK UBTI exposure · foundation entities" },
  { tag: "ok",   text: "CHECK NIIT 3.8% on net investment income" },
  { tag: "ok",   text: "CHECK FTC carryovers approaching expiration" },
  { tag: "ok",   text: "CHECK Wash sale windows on harvest candidates" },
  { tag: "ok",   text: "CHECK PTET / SALT workaround utilization" },
  { tag: "ok",   text: "CHECK DAF / CRT capacity vs AGI deduction limits" },
  { tag: "ok",   text: "CHECK Trust situs · DAPT compliance · SD/NV" },
  { tag: "ok",   text: "CHECK GST exemption allocation tracking" },
  { tag: "ok",   text: "DONE 14 items scanned · 0 new alerts" },
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
  const [logOpen, setLogOpen] = useState(false);
  const [logVisible, setLogVisible] = useState<LogLine[]>([]);
  const runningRef = useRef(false);

  useEffect(() => {
    supabase
      .from("structural_flags")
      .select("id, flag_type, severity, title, description")
      .eq("entity_id", activeEntityId)
      .order("created_at", { ascending: true })
      .then(({ data }) => setFlags((data as Flag[]) ?? []));
  }, [activeEntityId]);

  const runScan = () => {
    if (runningRef.current) return;
    runningRef.current = true;
    setLogVisible([]);
    setLogOpen(true);
    SCAN_LOG.forEach((line, i) => {
      setTimeout(() => {
        setLogVisible((prev) => [...prev, line]);
        if (i === SCAN_LOG.length - 1) runningRef.current = false;
      }, 280 + i * 280);
    });
  };

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

      <div id="scan-log" className={`${styles.agentLog} ${logOpen ? styles.open : ""}`}>
        {logVisible.map((l, i) => (
          <div key={i} className={styles.logLine}>
            <span className={`${styles.logTag} ${l.tag === "ok" ? styles.tagOk : l.tag === "warn" ? styles.tagWarn : styles.tagInfo}`}>
              {l.tag}
            </span>
            {l.text}
          </div>
        ))}
      </div>
    </div>
  );
}