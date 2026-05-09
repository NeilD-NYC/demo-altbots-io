import { useEffect, useState } from "react";
import { TrendingUp, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useActiveEntity } from "@/lib/active-entity";
import styles from "./KpiGrid.module.css";

type Kpi = {
  tax_alpha_ytd: number | null;
  fed_tax_ytd: number | null;
  ppli_cash_value: number | null;
  exemption_remaining: number | null;
  ny_days_ytd: number | null;
  ny_days_limit: number | null;
  harvest_available: number | null;
  harvest_tax_savings: number | null;
};

const compact = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
});
const fmt = (n: number | null | undefined) =>
  n == null ? "—" : `$${compact.format(n)}`;

export default function KpiGrid() {
  const { activeEntityId } = useActiveEntity();
  const [kpi, setKpi] = useState<Kpi | null>(null);

  useEffect(() => {
    let alive = true;
    supabase
      .from("tax_kpis")
      .select(
        "tax_alpha_ytd, fed_tax_ytd, ppli_cash_value, exemption_remaining, ny_days_ytd, ny_days_limit, harvest_available, harvest_tax_savings"
      )
      .eq("entity_id", activeEntityId)
      .order("snapshot_date", { ascending: false })
      .limit(1)
      .maybeSingle()
      .then(({ data }) => {
        if (alive) setKpi(data as Kpi | null);
      });
    return () => {
      alive = false;
    };
  }, [activeEntityId]);

  const nyLimit = kpi?.ny_days_limit ?? 183;
  const nyDays = kpi?.ny_days_ytd ?? 0;
  const nyMargin = nyLimit - nyDays;

  return (
    <div className={styles.grid}>
      <div className={styles.card}>
        <div className={styles.label}>Tax Alpha YTD</div>
        <div className={styles.num} style={{ color: "#10b981" }}>
          {fmt(kpi?.tax_alpha_ytd)}
        </div>
        <div className={styles.sub} style={{ color: "#10b981" }}>
          <TrendingUp size={10} /> AltBots-driven savings
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.label}>Est. Fed Tax YTD</div>
        <div className={styles.num} style={{ color: "#fff" }}>
          {fmt(kpi?.fed_tax_ytd)}
        </div>
        <div className={styles.sub} style={{ color: "#ef4444" }}>
          ↑ +$8.1M vs PY
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.label}>PPLI Cash Value</div>
        <div className={styles.num} style={{ color: "#f59e0b" }}>
          {fmt(kpi?.ppli_cash_value)}
        </div>
        <div className={styles.sub} style={{ color: "#ef4444" }}>
          <AlertCircle size={10} /> Wyden risk
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.label}>OBBBA Headroom</div>
        <div className={styles.num} style={{ color: "#fff" }}>
          {fmt(kpi?.exemption_remaining)}
        </div>
        <div className={styles.sub} style={{ color: "#10b981" }}>
          Couple · $30M cap
        </div>
      </div>

      <div className={styles.card} id="ny-days-kpi">
        <div className={styles.label}>NY Days YTD</div>
        <div className={styles.num} style={{ color: "#fbbf24" }}>
          {nyDays} / {nyLimit}
        </div>
        <div className={styles.sub} style={{ color: "#fbbf24" }}>
          {nyMargin} days margin
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.label}>Harvest Avail.</div>
        <div className={styles.num} style={{ color: "#10b981" }}>
          {fmt(kpi?.harvest_available)}
        </div>
        <div className={styles.sub} style={{ color: "#10b981" }}>
          Save {fmt(kpi?.harvest_tax_savings)}
        </div>
      </div>
    </div>
  );
}