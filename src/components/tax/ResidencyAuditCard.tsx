import { useEffect, useMemo, useRef, useState } from "react";
import { MapPin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useActiveEntity } from "@/lib/active-entity";
import styles from "./ResidencyAuditCard.module.css";

const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
const DAYS_IN_MONTH_2026 = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

type Kpi = {
  ny_days: number | null;
  nyc_days: number | null;
  fl_days: number | null;
  ca_days: number | null;
  international_days: number | null;
  audit_win_probability: number | null;
  domicile_factors_weak: unknown;
};

type DayRow = { date: string; location_state: string | null; location_city: string | null };

type LogLine = { tag: "info" | "ok" | "warn"; text: string };

const SYNC_LOG: LogLine[] = [
  { tag: "info", text: "SYNC Google Calendar OAuth" },
  { tag: "info", text: "SYNC iCloud Calendar IMAP" },
  { tag: "info", text: "SYNC NetJets manifest pull" },
  { tag: "info", text: "SYNC AmEx geolocated transactions" },
  { tag: "info", text: "PARSE GPS tower triangulation log" },
  { tag: "ok",   text: "COUNT NY days YTD: 127 (+0 from prior)" },
  { tag: "ok",   text: "COUNT FL days YTD: 189" },
  { tag: "warn", text: "FLAG NYC days: 94 · city tax watch" },
  { tag: "info", text: "CHECK Domicile factors per TSB-M-09(15)I" },
  { tag: "warn", text: "WEAK Treating physicians: NY (kept)" },
  { tag: "warn", text: "WEAK Art collection: NY-stored (kept)" },
  { tag: "ok",   text: "DONE Audit win probability: 62%" },
];

export default function ResidencyAuditCard() {
  const { activeEntityId } = useActiveEntity();
  const [kpi, setKpi] = useState<Kpi | null>(null);
  const [days, setDays] = useState<DayRow[]>([]);
  const [logOpen, setLogOpen] = useState(false);
  const [logVisible, setLogVisible] = useState<LogLine[]>([]);
  const [flash, setFlash] = useState(false);
  const runningRef = useRef(false);

  useEffect(() => {
    supabase
      .from("residency_kpis")
      .select("ny_days, nyc_days, fl_days, ca_days, international_days, audit_win_probability, domicile_factors_weak")
      .eq("entity_id", activeEntityId)
      .eq("year", 2026)
      .maybeSingle()
      .then(({ data }) => setKpi(data as Kpi | null));

    supabase
      .from("residency_days")
      .select("date, location_state, location_city")
      .eq("entity_id", activeEntityId)
      .gte("date", "2026-01-01")
      .lte("date", "2026-12-31")
      .order("date", { ascending: true })
      .then(({ data }) => setDays((data as DayRow[]) ?? []));
  }, [activeEntityId]);

  const monthly = useMemo(() => {
    const buckets = MONTHS.map(() => ({ ny: 0, fl: 0, other: 0 }));
    for (const r of days) {
      const m = new Date(r.date).getUTCMonth();
      const b = buckets[m];
      if (r.location_state === "NY") b.ny++;
      else if (r.location_state === "FL") b.fl++;
      else b.other++;
    }
    return buckets;
  }, [days]);

  const nyDays = kpi?.ny_days ?? 0;
  const pct = Math.min(100, (nyDays / 183) * 100);

  const factors = Array.isArray(kpi?.domicile_factors_weak) ? (kpi!.domicile_factors_weak as string[]) : [];

  const runSync = () => {
    if (runningRef.current) return;
    runningRef.current = true;
    setLogVisible([]);
    setLogOpen(true);
    SYNC_LOG.forEach((line, i) => {
      setTimeout(() => {
        setLogVisible((prev) => [...prev, line]);
        if (i === SYNC_LOG.length - 1) {
          runningRef.current = false;
          setFlash(true);
          setTimeout(() => setFlash(false), 1200);
        }
      }, 350 + i * 320);
    });
  };

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div>
          <div className={styles.titleRow}>
            <MapPin size={16} color="#f59e0b" />
            <span className={styles.title}>NY Residency Audit Defense</span>
          </div>
          <div className={styles.subtitle}>183-day rule · TSB-M-09(15)I domicile factors · NYC city tax</div>
        </div>
        <div className={styles.actions}>
          <button className={styles.ghostBtn}>Audit Packet</button>
          <button id="res-btn" className={styles.agentBtn} onClick={runSync}>⚡ Sync Calendar</button>
        </div>
      </div>

      <div className={`${styles.dayCounter} ${flash ? styles.flash : ""}`}>
        <div className={styles.counterTop}>
          <div>
            <div className={styles.counterLabel}>NY days · calendar 2026</div>
            <div className={styles.counterSubLabel}>tracked via 4 sources</div>
          </div>
          <div>
            <span className={styles.counterDays}>{nyDays}</span>
            <span className={styles.counterMax}> / 183</span>
          </div>
        </div>
        <div className={styles.track}>
          <div className={styles.trackFill} style={{ width: `${pct}%` }} />
        </div>
        <div className={styles.trackLegend}>
          <span>Safe (&lt;90)</span>
          <span>Watch (150)</span>
          <span>Audit risk (183)</span>
        </div>
      </div>

      <div className={styles.heatLabel}>2026 days by month · NY exposure</div>
      <div className={styles.heatGrid}>
        {monthly.map((b, i) => {
          const fillColor = b.ny >= 15 ? "#ef4444" : b.ny >= 10 ? "#fbbf24" : "#10b981";
          const heightPct = Math.min(100, (b.ny / DAYS_IN_MONTH_2026[i]) * 100);
          const tip = `${MONTHS[i].charAt(0) + MONTHS[i].slice(1).toLowerCase()}: NY ${b.ny} / FL ${b.fl} / Other ${b.other}`;
          return (
            <div key={i} className={styles.heatCell} title={tip}>
              <div className={styles.heatFill} style={{ height: `${heightPct}%`, background: fillColor }} />
            </div>
          );
        })}
      </div>
      <div className={styles.monthLabels}>
        {MONTHS.map((m) => <div key={m} className={styles.monthLabel}>{m}</div>)}
      </div>

      <div className={styles.dataGrid}>
        <div>
          <div className={styles.dataRow}>
            <span className={styles.dataKey}>FL (claimed domicile)</span>
            <span className={styles.green}>{kpi?.fl_days ?? 0} days</span>
          </div>
          <div className={styles.dataRow}>
            <span className={styles.dataKey}>CA</span>
            <span>{kpi?.ca_days ?? 0} days</span>
          </div>
          <div className={styles.dataRow}>
            <span className={styles.dataKey}>International</span>
            <span>{kpi?.international_days ?? 0} days</span>
          </div>
        </div>
        <div>
          <div className={styles.dataRow}>
            <span className={styles.dataKey}>NYC (city tax)</span>
            <span className={styles.amber}>{kpi?.nyc_days ?? 0} days</span>
          </div>
          <div className={styles.dataRow}>
            <span className={styles.dataKey}>PE/jets logged</span>
            <span className={styles.green}>All cleared</span>
          </div>
          <div className={styles.dataRow}>
            <span className={styles.dataKey}>CC ledger reconciled</span>
            <span className={styles.green}>99.2%</span>
          </div>
        </div>
      </div>

      <div className={styles.warnBox}>
        ⚠ Domicile factors ({factors.length} of 7 weak): {factors.join(", ") || "—"}. Audit win probability: {kpi?.audit_win_probability ?? 0}%.
      </div>

      <div id="res-log" className={`${styles.agentLog} ${logOpen ? styles.open : ""}`}>
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