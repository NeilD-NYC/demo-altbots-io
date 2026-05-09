import { useEffect, useState } from "react";
import { AlertTriangle, Zap } from "lucide-react";
import styles from "./LegislativeAlert.module.css";
import { supabase } from "@/integrations/supabase/client";

type Alert = {
  id: string;
  bill_number: string | null;
  bill_name: string | null;
  markup_result: string | null;
  exposure_amount: number | null;
  summary: string | null;
};

function fmtMillions(n: number | null) {
  if (!n) return "—";
  return `$${Math.round(n / 1_000_000)}M`;
}

function triggerAdvisor(key: string) {
  window.dispatchEvent(new CustomEvent("altbots:advisor", { detail: key }));
}

export default function LegislativeAlert() {
  const [alert, setAlert] = useState<Alert | null>(null);
  const [updatedMin, setUpdatedMin] = useState(14);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    let active = true;
    supabase
      .from("legislative_alerts")
      .select("id,bill_number,bill_name,markup_result,exposure_amount,summary")
      .eq("bill_number", "S.4421")
      .order("last_updated", { ascending: false })
      .limit(1)
      .maybeSingle()
      .then(({ data }) => {
        if (active && data) setAlert(data as Alert);
      });
    return () => {
      active = false;
    };
  }, []);

  function refreshBill() {
    setRefreshing(true);
    window.setTimeout(() => {
      setUpdatedMin(0);
      setRefreshing(false);
    }, 900);
  }

  if (!alert) return null;

  const headline = `${alert.bill_number} '${alert.bill_name}' advances out of Senate Finance Committee`;

  return (
    <div className={styles.container}>
      <div className={styles.row}>
        <div className={styles.left}>
          <div className={styles.tagRow}>
            <span className={styles.alertTag}>
              <AlertTriangle size={11} /> LEGISLATIVE RED ALERT
            </span>
            <span id="leg-updated" className={styles.updated}>
              UPDATED {updatedMin} MIN AGO
            </span>
            <span className={styles.exposurePill}>
              PPLI EXPOSURE: {fmtMillions(alert.exposure_amount)}
            </span>
            <span className="pill-red">
              SEN. FINANCE MARKUP: {alert.markup_result ?? "—"}
            </span>
          </div>

          <h3 className={styles.headline}>{headline}</h3>

          <p
            className={styles.body}
            dangerouslySetInnerHTML={{ __html: alert.summary ?? "" }}
          />
        </div>

        <div className={styles.right}>
          <button
            id="leg-btn"
            type="button"
            className={styles.agentBtn}
            onClick={refreshBill}
            disabled={refreshing}
          >
            <Zap size={11} /> {refreshing ? "Refreshing…" : "Refresh Bill Status"}
          </button>
          <button
            type="button"
            className={styles.ghostBtn}
            onClick={() => triggerAdvisor("wyden")}
          >
            View Mitigation Plan
          </button>
        </div>
      </div>

      <div id="leg-log" className={styles.agentLog} aria-hidden="true" />
    </div>
  );
}
