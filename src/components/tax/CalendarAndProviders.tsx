import { useEffect, useState } from "react";
import { CalendarClock, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useActiveEntity } from "@/lib/active-entity";
import styles from "./CalendarAndProviders.module.css";

type Cal = {
  id: string;
  event_date: string | null;
  title: string | null;
  description: string | null;
  severity: string | null;
  category: string | null;
  amount: number | null;
};

type Provider = {
  id: string;
  firm_name: string | null;
  contact_name: string | null;
  role: string | null;
  status: string | null;
};

const SEV_COLOR: Record<string, string> = {
  red: "#ef4444",
  amber: "#fbbf24",
  blue: "#60a5fa",
  purple: "#a78bfa",
  gold: "#f59e0b",
};

const compact = new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 });

function pillClass(severity: string | null, category: string | null) {
  if (severity === "red") return styles.pillRed;
  if (severity === "blue" || category === "review") return styles.pillBlue;
  if (severity === "purple" || category === "qsbs") return styles.pillPurple;
  if (severity === "gold" || category === "filing") return styles.pillGold;
  return styles.pillAmber;
}

function pillLabel(c: Cal): string {
  if (c.amount) return `$${compact.format(c.amount)} DUE`;
  switch (c.category) {
    case "priority": return "PRIORITY";
    case "fbar": return "FBAR";
    case "review": return "REVIEW";
    case "qsbs": return "QSBS";
    case "filing": return "FILING";
    default: return (c.severity ?? "").toUpperCase();
  }
}

function fmtDate(d: string): string {
  const dt = new Date(d);
  return dt.toLocaleDateString("en-US", { month: "short", day: "numeric" }).toUpperCase();
}

function daysFromNow(d: string): number {
  const ms = new Date(d).getTime() - Date.now();
  return Math.max(0, Math.round(ms / 86400000));
}

function initials(firm: string | null): string {
  if (!firm) return "?";
  const parts = firm.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return firm.slice(0, 2).toUpperCase();
}

function CalendarCard() {
  const { activeEntityId } = useActiveEntity();
  const [items, setItems] = useState<Cal[]>([]);

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    const in90 = new Date(Date.now() + 90 * 86400000).toISOString().slice(0, 10);
    supabase
      .from("tax_calendar")
      .select("*")
      .eq("entity_id", activeEntityId)
      .gte("event_date", today)
      .lte("event_date", in90)
      .order("event_date", { ascending: true })
      .then(({ data }) => setItems((data as Cal[]) ?? []));
  }, [activeEntityId]);

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.titleRow}>
          <CalendarClock size={16} color="#f59e0b" />
          <span className={styles.title}>Upcoming Tax Calendar · Next 90 days</span>
        </div>
        <button className={styles.ghostBtn}>Add to Calendar</button>
      </div>
      <div className={styles.list}>
        {items.map((c) => {
          const color = SEV_COLOR[c.severity ?? "amber"] ?? "#888";
          const days = c.event_date ? daysFromNow(c.event_date) : 0;
          return (
            <div key={c.id} className={styles.calRow} style={{ borderLeftColor: color }}>
              <div className={styles.dateCell} style={{ color }}>
                {c.event_date ? fmtDate(c.event_date) : "—"}
              </div>
              <div className={styles.calBody}>
                {c.title}{c.description ? ` · ${c.description}` : ""}
                <span className={styles.calCount}> · {days} days</span>
              </div>
              <span className={`${styles.pill} ${pillClass(c.severity, c.category)}`}>
                {pillLabel(c)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ProvidersCard() {
  const { activeEntityId } = useActiveEntity();
  const [providers, setProviders] = useState<Provider[]>([]);

  useEffect(() => {
    supabase
      .from("service_providers")
      .select("id, firm_name, contact_name, role, status")
      .eq("entity_id", activeEntityId)
      .order("created_at", { ascending: true })
      .then(({ data }) => setProviders((data as Provider[]) ?? []));
  }, [activeEntityId]);

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.titleRow}>
          <Users size={16} color="#f59e0b" />
          <span className={styles.title}>Service Providers</span>
        </div>
        <button className={styles.ghostBtn}>Manage</button>
      </div>
      <div className={styles.list}>
        {providers.map((p) => (
          <div key={p.id} className={styles.provRow}>
            <div className={styles.avatar}>{initials(p.firm_name)}</div>
            <div className={styles.provBody}>
              <div className={styles.provName}>
                {p.firm_name}{p.contact_name ? ` · ${p.contact_name}` : ""}
              </div>
              <div className={styles.provRole}>{p.role}</div>
            </div>
            <span className={`${styles.pill} ${p.status === "active" ? styles.pillGreen : styles.pillAmber}`}>
              {p.status === "active" ? "ACTIVE" : "FOLLOW UP"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function CalendarAndProviders() {
  return (
    <div className={styles.row}>
      <CalendarCard />
      <ProvidersCard />
    </div>
  );
}