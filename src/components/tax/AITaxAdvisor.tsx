import { useState, KeyboardEvent } from "react";
import { Sparkles } from "lucide-react";
import styles from "./AITaxAdvisor.module.css";

const CANNED: Record<string, { title: string; body: string }> = {
  wyden: {
    title: "Wyden PPLI Bill — Exposure Estimate",
    body:
      "If S.1117 passes as currently marked-up, your two PPLI policies (cash value $42.0M) face a clawback range of $7.8M–$11.2M based on lifetime PV shield analysis. Mitigation: accelerate Policy B premium, restructure IDF allocations, and review investor-control flags before Jun 18 markup.",
  },
  slat: {
    title: "Second SLAT Under OBBBA",
    body:
      "With $18.6M of lifetime exemption remaining and OBBBA's $13.99M sunset reverting Jan 2026, a second SLAT funded before Sep 15 captures ~$4.6M of additional shield. Recommend a 9-year GRAT overlay if the spousal SLAT path triggers reciprocal-trust scrutiny.",
  },
  ny: {
    title: "NY Tax Bill — 40% YoY Driver Analysis",
    body:
      "FY26 NY liability rose from $11.4M → $16.0M (+40%). Drivers: (1) +$2.1M from PTET cap erosion, (2) +$1.4M from carry recharacterization on Aurora exit, (3) +$0.9M from 127 NY-day count vs. 96 prior year. Risk: 56 days from statutory residency tripwire.",
  },
  qsbs: {
    title: "QSBS 5-Year Clocks",
    body:
      "Three positions cross §1202 5-year hold in the next 9 months: Aurora Therapeutics (Jul 31, $4.2M gain), Helix Compute (Oct 14, $1.8M), Northwind Bio (Mar 03, $2.6M). Aggregate exclusion eligible: $8.6M. Action: confirm gross-asset test at issuance for each.",
  },
};

function lookupResponse(q: string): { title: string; body: string } {
  const key = q.toLowerCase();
  if (CANNED[key]) return CANNED[key];
  if (key.includes("wyden") || key.includes("ppli")) return CANNED.wyden;
  if (key.includes("slat") || key.includes("obbba")) return CANNED.slat;
  if (key.includes("ny") || key.includes("new york")) return CANNED.ny;
  if (key.includes("qsbs") || key.includes("1202")) return CANNED.qsbs;
  return {
    title: "AltBots Tax Advisor",
    body: `Analyzing "${q}" against IRC, Treasury Regulations, and your entity's structural posture. Demo response: full reasoning would synthesize K-1 timing, PPLI compliance state, and current legislative risk into a citation-backed memo.`,
  };
}

const CHIPS: Array<{ label: string; key: string; query: string }> = [
  { label: "⚡ Wyden PPLI bill exposure", key: "wyden", query: "Wyden PPLI bill exposure" },
  { label: "Should I do another SLAT given OBBBA?", key: "slat", query: "Should I do another SLAT given OBBBA?" },
  { label: "Why did NY tax bill jump 40% YoY?", key: "ny", query: "Why did NY tax bill jump 40% YoY?" },
  { label: "When do my QSBS clocks run out?", key: "qsbs", query: "When do my QSBS clocks run out?" },
];

export default function AITaxAdvisor() {
  const [value, setValue] = useState("");
  const [open, setOpen] = useState(false);
  const [response, setResponse] = useState<{ title: string; body: string } | null>(null);

  function runAdvisor(q: string) {
    if (!q.trim()) return;
    setResponse(lookupResponse(q));
    setOpen(true);
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      runAdvisor(value);
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.topRow}>
        <Sparkles size={16} color="#f59e0b" />
        <span className={styles.title}>Ask AltBots Tax Advisor</span>
        <span className={styles.subtitle}>Trained on IRC, Treasury Regs, family office case law</span>
      </div>

      <input
        className={styles.input}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder="e.g. How much would the Wyden PPLI bill cost us if it passes?"
      />

      <div className={styles.chipRow}>
        {CHIPS.map((c) => (
          <button
            key={c.key}
            type="button"
            className={`suggestion-chip ${styles.chip}`}
            onClick={() => {
              setValue(c.query);
              runAdvisor(c.key);
            }}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className={`${styles.response} ${open ? styles.open : ""}`}>
        {response && (
          <div className={styles.responseInner}>
            <div className={styles.responseTitle}>{response.title}</div>
            <div className={styles.responseBody}>{response.body}</div>
          </div>
        )}
      </div>
    </div>
  );
}
