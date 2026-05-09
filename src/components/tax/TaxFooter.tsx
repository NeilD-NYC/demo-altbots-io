import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

function fmt(ts: string | null) {
  const d = ts ? new Date(ts) : new Date();
  const date = d.toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
    timeZone: "America/New_York",
  });
  const time = d.toLocaleTimeString("en-US", {
    hour: "2-digit", minute: "2-digit", hour12: false,
    timeZone: "America/New_York",
  });
  return `${date} ${time} ET`;
}

export default function TaxFooter() {
  const [ts, setTs] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      const [{ data: kpi }, { data: log }] = await Promise.all([
        supabase.from("tax_kpis").select("snapshot_date").order("snapshot_date", { ascending: false }).limit(1).maybeSingle(),
        supabase.from("agent_activity_log").select("created_at").order("created_at", { ascending: false }).limit(1).maybeSingle(),
      ]);
      if (!alive) return;
      const a = log?.created_at ? new Date(log.created_at).getTime() : 0;
      const b = kpi?.snapshot_date ? new Date(kpi.snapshot_date).getTime() : 0;
      setTs(a >= b ? log?.created_at ?? null : kpi?.snapshot_date ?? null);
    })();
    return () => { alive = false; };
  }, []);

  return (
    <div style={{
      padding: "10px 0",
      fontSize: 9,
      color: "#555",
      textAlign: "center",
      lineHeight: 1.6,
    }}>
      <div>
        AltBots Tax Intelligence · Estimates synthesized from K-1s · 1099s · SEC filings · fund admin feeds · Senate &amp; House legislative trackers · NY DTF · IRS guidance · CapTrust · LexisNexis · current as of {fmt(ts)}
      </div>
      <div style={{ color: "#444" }}>
        Not tax advice. Confirm all positions with licensed tax counsel before filing. AltBots is a tooling and intelligence layer, not a CPA or law firm.
      </div>
    </div>
  );
}