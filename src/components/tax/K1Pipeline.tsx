import { useEffect, useMemo, useState } from "react";
import { MailPlus, Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useActiveEntity } from "@/lib/active-entity";
import styles from "./K1Pipeline.module.css";
import { useAgentSimulation, type AgentLogLine } from "@/hooks/useAgentSimulation";

type K1Row = {
  id: string;
  manager_name: string | null;
  status: "received" | "pending" | "overdue" | "amended" | null;
  expected_date: string | null;
  received_date: string | null;
  chase_count: number | null;
};

type ChaseEmail = {
  k1_tracking_id: string;
  from_addr: string | null;
  to_addr: string | null;
  cc_addr: string | null;
  subject: string | null;
  body: string | null;
};

const SYNC_LOG: AgentLogLine[] = [
  { type: "info", tag: "AGENT", message: "K-1 chase routine launching" },
  { type: "info", tag: "AUTH",  message: "OAuth · investor portals (12)" },
  { type: "info", tag: "DRAFT", message: "Template: 3rd-chase escalation" },
  { type: "ok",   tag: "SENT",  message: "Solaris PC · escalated to GP + counsel" },
  { type: "ok",   tag: "SENT",  message: "Vega Special Sits · 2nd chase" },
  { type: "ok",   tag: "SENT",  message: "12 standard chases dispatched" },
  { type: "info", tag: "WATCH", message: "Monitoring fund admin portal feeds" },
  { type: "ok",   tag: "RECV",  message: "Tundra Macro K-1 received in real-time" },
  { type: "info", tag: "PARSE", message: "Tundra K-1 ingested into workpapers" },
  { type: "ok",   tag: "DONE",  message: "14 → 13 pending · 142 → 143 received" },
];

function daysBetween(a: string, b: string): number {
  return Math.round((new Date(a).getTime() - new Date(b).getTime()) / 86400000);
}

export default function K1Pipeline() {
  const { activeEntityId } = useActiveEntity();
  const [rows, setRows] = useState<K1Row[]>([]);
  const [emails, setEmails] = useState<Record<string, ChaseEmail>>({});
  const [openId, setOpenId] = useState<string | null>(null);
  const [delta, setDelta] = useState({ pending: 0, received: 0 });

  const { isLogOpen, currentLogs, run: runChase } = useAgentSimulation({
    agentKey: "k1",
    logSequence: SYNC_LOG,
    flashElementIds: ["k1-pending", "k1-received", "k1-btn"],
    onComplete: () => setDelta({ pending: -1, received: 1 }),
  });

  useEffect(() => {
    supabase
      .from("k1_tracking")
      .select("id, manager_name, status, expected_date, received_date, chase_count")
      .eq("entity_id", activeEntityId)
      .order("status", { ascending: true })
      .then(({ data }) => setRows((data as K1Row[]) ?? []));
  }, [activeEntityId]);

  useEffect(() => {
    if (!rows.length) return;
    const ids = rows.map((r) => r.id);
    supabase
      .from("chase_emails")
      .select("k1_tracking_id, from_addr, to_addr, cc_addr, subject, body")
      .in("k1_tracking_id", ids)
      .then(({ data }) => {
        const m: Record<string, ChaseEmail> = {};
        (data as ChaseEmail[] | null)?.forEach((e) => { m[e.k1_tracking_id] = e; });
        setEmails(m);
      });
  }, [rows]);

  const counts = useMemo(() => {
    const c = { received: 0, pending: 0, overdue: 0 };
    rows.forEach((r) => {
      if (r.status === "received") c.received++;
      else if (r.status === "pending") c.pending++;
      else if (r.status === "overdue" || r.status === "amended") c.overdue++;
    });
    return c;
  }, [rows]);

  const sorted = useMemo(() => {
    const nameOrder = [
      "Solaris Private Credit III",
      "Helix Credit Opportunities",
      "Vega Special Situations II",
      "Arcturus Master",
      "Meridian Capital",
      "Ironwood Systematic",
      "Tundra Macro",
    ];
    const idx = (n: string | null) => {
      const i = nameOrder.indexOf(n ?? "");
      return i === -1 ? 999 : i;
    };
    const order = { overdue: 0, amended: 0, pending: 1, received: 2 } as Record<string, number>;
    return [...rows].sort((a, b) => {
      const ai = idx(a.manager_name), bi = idx(b.manager_name);
      if (ai !== 999 || bi !== 999) return ai - bi;
      return (order[a.status ?? ""] ?? 9) - (order[b.status ?? ""] ?? 9);
    });
  }, [rows]);

  const today = new Date().toISOString().slice(0, 10);

  const togglek1Email = (id: string) => setOpenId((cur) => (cur === id ? null : id));

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div>
          <div className={styles.titleRow}>
            <MailPlus size={16} color="#f59e0b" />
            <span className={styles.title}>K-1 Pipeline · TY 2025</span>
          </div>
          <div className={styles.subtitle}>Final extension: Sep 15, 2026 · 156 expected</div>
        </div>
        <button id="k1-btn" className={styles.agentBtn} onClick={runChase}>⚡ Chase Missing</button>
      </div>

      <div className={styles.counters}>
        <div id="k1-received" className={`${styles.counter} ${styles.received}`}>
          <div className={styles.cLabel}>Received</div>
          <div className={`${styles.cNum} ${styles.numReceived}`}>{counts.received + delta.received}</div>
        </div>
        <div id="k1-pending" className={`${styles.counter} ${styles.pending}`}>
          <div className={styles.cLabel}>Pending</div>
          <div className={`${styles.cNum} ${styles.numPending}`}>{counts.pending + delta.pending}</div>
        </div>
        <div className={`${styles.counter} ${styles.overdue}`}>
          <div className={styles.cLabel}>Overdue</div>
          <div className={`${styles.cNum} ${styles.numOverdue}`}>{counts.overdue}</div>
        </div>
      </div>

      <div className={styles.scroll}>
        <table className={styles.tbl}>
          <thead className={styles.thead}>
            <tr>
              <th>Manager</th>
              <th className={styles.right}>Delay</th>
              <th className={styles.right}>Status</th>
            </tr>
          </thead>
          <tbody className={styles.tbody}>
            {sorted.map((r) => {
              const isOverdue = r.status === "overdue" || r.status === "amended";
              const daysLate = r.expected_date ? daysBetween(today, r.expected_date) : 0;
              let delay: JSX.Element;
              let pill: JSX.Element;
              if (isOverdue) {
                delay = <span className={styles.delayRed}>{daysLate}d late</span>;
                pill = <span className={styles.pillRed}>{(r.chase_count ?? 0) >= 3 ? "3RD CHASE" : (r.status ?? "").toUpperCase()}</span>;
              } else if (r.status === "pending") {
                delay = <span className={styles.delayAmber}>{daysLate > 0 ? `${daysLate}d late` : "due soon"}</span>;
                pill = <span className={styles.pillAmber}>PENDING</span>;
              } else {
                delay = <span className={styles.delayMuted}>on time</span>;
                pill = <span className={styles.pillGreen}>EXTENSION</span>;
              }
              return (
                <tr key={r.id} onClick={() => togglek1Email(r.id)}>
                  <td>{r.manager_name}</td>
                  <td className={styles.right}>{delay}</td>
                  <td className={styles.right}>{pill}</td>
                </tr>
              );
            })}
            <tr>
              <td colSpan={3} style={{ color: "#666", fontStyle: "italic", padding: "6px 8px" }}>
                + 7 more pending
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {(() => {
        const row = openId ? sorted.find((r) => r.id === openId) : null;
        const email = openId ? emails[openId] : null;
        return (
          <div id="k1-email" className={`${styles.sheet} ${openId ? styles.open : ""}`}>
            {row && (
              <>
                <div className={styles.sheetTitle}>
                  <Mail size={12} /> ↗ Outbound chase · {row.manager_name} ({(row.chase_count ?? 0) >= 3 ? "3rd attempt" : `${(row.chase_count ?? 0) + 1}${["st","nd","rd"][(row.chase_count ?? 0)] ?? "th"} attempt`})
                </div>
                <div className={styles.emailBox}>
                  {email ? (
                    <>
                      <div className={styles.emailHead}>
                        <div className={styles.row}><span className={styles.l}>From:</span><span className={styles.v}>{email.from_addr}</span></div>
                        <div className={styles.row}><span className={styles.l}>To:</span><span className={styles.v}>{email.to_addr}</span></div>
                        <div className={styles.row}><span className={styles.l}>Cc:</span><span className={styles.v}>{email.cc_addr}</span></div>
                        <div className={styles.row}><span className={styles.l}>Subj:</span><span className={styles.v}>{email.subject}</span></div>
                      </div>
                      <div className={styles.emailBody}>{email.body}</div>
                    </>
                  ) : (
                    <div style={{ color: "#666" }}>No chase email drafted yet for this manager.</div>
                  )}
                  <div className={styles.actionRow}>
                    <button className={styles.ghostBtn}>Edit</button>
                    <button className={styles.agentBtn}>Send</button>
                  </div>
                </div>
              </>
            )}
          </div>
        );
      })()}

      <div id="k1-log" className={`${styles.agentLog} ${isLogOpen ? styles.open : ""}`}>
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