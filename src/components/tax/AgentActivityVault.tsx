import { useEffect, useState } from "react";
import { Activity, Folder, FileText, MapPin, ShieldCheck, Receipt } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useActiveEntity } from "@/lib/active-entity";
import styles from "./AgentActivityVault.module.css";

type Status = "ok" | "warn" | "info" | "alert";
type ActivityRow = {
  id: string;
  created_at: string;
  agent_key: string | null;
  status: Status | null;
  message: string | null;
  flash?: boolean;
};

const AGENT_MESSAGES: Record<string, { status: Status; message: string }> = {
  legislative: { status: "ok",   message: "Legislative monitor: bill status refreshed" },
  ppli:        { status: "ok",   message: "PPLI compliance audit complete · 1 flag" },
  residency:   { status: "ok",   message: "Residency: calendar synced · 4 sources" },
  k1:          { status: "ok",   message: "K-1 chase: 14 sent · 1 received" },
  s1061:       { status: "warn", message: "§1061: scan found 1 fail · 2 watch" },
  scan:        { status: "ok",   message: "Full tax scan: 14 items · 0 new alerts" },
};

function fmtTime(ts: string) {
  const d = new Date(ts);
  return d.toLocaleTimeString("en-US", { hour12: false });
}

function tagClass(s: Status | null) {
  switch (s) {
    case "ok":    return styles.tagOk;
    case "warn":  return styles.tagWarn;
    case "info":  return styles.tagInfo;
    case "alert": return styles.tagAlert;
    default:      return styles.tagInfo;
  }
}

function ActivityFeed() {
  const { activeEntityId } = useActiveEntity();
  const [rows, setRows] = useState<ActivityRow[]>([]);

  useEffect(() => {
    let mounted = true;
    supabase
      .from("agent_activity_log")
      .select("id, created_at, agent_key, status, message")
      .eq("entity_id", activeEntityId)
      .order("created_at", { ascending: false })
      .limit(10)
      .then(({ data }) => {
        if (mounted && data) setRows(data as ActivityRow[]);
      });
    return () => { mounted = false; };
  }, [activeEntityId]);

  useEffect(() => {
    function handler(e: Event) {
      const detail = (e as CustomEvent<{ agent_key: string }>).detail;
      const meta = AGENT_MESSAGES[detail?.agent_key];
      if (!meta) return;
      const newRow: ActivityRow = {
        id: `local-${Date.now()}`,
        created_at: new Date().toISOString(),
        agent_key: detail.agent_key,
        status: meta.status,
        message: meta.message,
        flash: true,
      };
      setRows((prev) => [newRow, ...prev].slice(0, 10));
    }
    const add = (key: string) =>
      window.dispatchEvent(new CustomEvent("agent-complete", { detail: { agent_key: key } }));
    (window as any).addActivity = add;
    window.addEventListener("agent-complete", handler);
    return () => window.removeEventListener("agent-complete", handler);
  }, []);

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.titleRow}>
          <Activity size={14} color="#60a5fa" />
          <span className={styles.title}>Live Agent Activity</span>
        </div>
        <span className={styles.meta}>last 10 events</span>
      </div>
      <div className={styles.feed} id="activity-feed">
        {rows.map((r) => (
          <div key={r.id} className={`${styles.item} ${r.flash ? styles.flash : ""}`}>
            <span className={styles.ts}>{fmtTime(r.created_at)}</span>
            <span className={styles.ts}>·</span>
            <span className={`${styles.tag} ${tagClass(r.status)}`}>
              [{(r.status ?? "info").toUpperCase()}]
            </span>
            <span className={styles.msg}>{r.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function VaultCard() {
  const stats = [
    { Icon: FileText,    color: "#60a5fa", num: 156, label: "K-1s & 1099s" },
    { Icon: MapPin,      color: "#fbbf24", num: 340, label: "Days · GPS evidence" },
    { Icon: ShieldCheck, color: "#f59e0b", num: 28,  label: "PPLI memos" },
    { Icon: Receipt,     color: "#10b981", num: 88,  label: "Trust docs" },
  ];

  function generating(label: string) {
    const id = toast.loading(`Generating ${label}…`);
    setTimeout(() => toast.success(`${label} ready`, { id }), 2000);
  }

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.titleRow}>
          <Folder size={14} color="#f59e0b" />
          <span className={styles.title}>Audit Defense Vault</span>
        </div>
        <span className={styles.pillGreen}>412 docs · IRS-ready</span>
      </div>
      <div className={styles.statGrid}>
        {stats.map((s, i) => (
          <div key={i} className={styles.stat}>
            <s.Icon size={18} color={s.color} />
            <div className={styles.statNum}>{s.num}</div>
            <div className={styles.statLabel}>{s.label}</div>
          </div>
        ))}
      </div>
      <div className={styles.actions}>
        <button className={styles.ghostBtn} onClick={() => generating("IRS Defense Packet (.zip)")}>
          Generate IRS Defense Packet (.zip)
        </button>
        <button className={styles.ghostBtn} onClick={() => generating("BDO Workpapers (.csv)")}>
          Export to BDO Workpapers
        </button>
      </div>
    </div>
  );
}

export default function AgentActivityVault() {
  return (
    <div className={styles.row}>
      <ActivityFeed />
      <VaultCard />
    </div>
  );
}