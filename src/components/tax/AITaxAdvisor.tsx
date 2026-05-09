import { KeyboardEvent, useEffect } from "react";
import { Sparkles, Loader2, Zap, Shield, AlertTriangle, Clock, FileDown, Mail } from "lucide-react";
import styles from "./AITaxAdvisor.module.css";
import { useTaxAdvisor, ADVISOR_QUESTIONS, AdvisorKey } from "@/hooks/useTaxAdvisor";

const ICONS = { zap: Zap, shield: Shield, "alert-triangle": AlertTriangle, clock: Clock };

const CHIPS: Array<{ label: string; key: AdvisorKey }> = [
  { label: "⚡ Wyden PPLI bill exposure", key: "wyden" },
  { label: "Should I do another SLAT given OBBBA?", key: "slat" },
  { label: "Why did NY tax bill jump 40% YoY?", key: "ny" },
  { label: "When do my QSBS clocks run out?", key: "qsbs" },
];

export default function AITaxAdvisor() {
  const { input, setInput, isOpen, isLoading, response, runAdvisor } = useTaxAdvisor();

  useEffect(() => {
    function onExternal(e: Event) {
      const detail = (e as CustomEvent<string>).detail;
      if (detail) runAdvisor(detail);
    }
    window.addEventListener("altbots:advisor", onExternal as EventListener);
    return () => window.removeEventListener("altbots:advisor", onExternal as EventListener);
  }, [runAdvisor]);

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      if (input.trim()) runAdvisor(input);
    }
  }

  const TitleIcon = response ? ICONS[response.iconName] : null;

  return (
    <div className={styles.container}>
      <div className={styles.topRow}>
        <Sparkles size={16} color="#f59e0b" />
        <span className={styles.title}>Ask AltBots Tax Advisor</span>
        <span className={styles.subtitle}>Trained on IRC, Treasury Regs, family office case law</span>
      </div>

      <input
        className={styles.input}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder="e.g. How much would the Wyden PPLI bill cost us if it passes?"
      />

      <div className={styles.chipRow}>
        {CHIPS.map((c) => (
          <button
            key={c.key}
            type="button"
            className={`suggestion-chip ${styles.chip}`}
            onClick={() => runAdvisor(c.key)}
            title={ADVISOR_QUESTIONS[c.key]}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className={`${styles.response} ${isOpen ? styles.open : ""}`}>
        {isLoading && (
          <div className={styles.loading}>
            <Loader2 size={14} className={styles.spinner} color="#f59e0b" />
            <span>Analyzing across IRC, Treasury Regs, your portfolio data, and 4 service provider memos…</span>
          </div>
        )}

        {!isLoading && response && (
          <div className={styles.responseInner}>
            <div className={styles.responseTitle}>
              {TitleIcon ? <TitleIcon size={14} color="#f59e0b" /> : null}
              <span>{response.title}</span>
            </div>
            <div
              className={styles.responseBody}
              dangerouslySetInnerHTML={{ __html: response.bodyHtml }}
            />
            <div className={styles.footer}>
              <div className={styles.meta}>
                <span className={styles.metaConfidence}>Confidence: {response.confidence}</span>
                <span className={styles.metaSep}>·</span>
                <span>Latency: {response.latencySeconds.toFixed(1)}s</span>
                <span className={styles.metaSep}>·</span>
                <span>Sources: {response.sources}</span>
              </div>
              <div className={styles.actions}>
                <button type="button" className={styles.ghostBtn}>
                  <FileDown size={11} /> Export Memo
                </button>
                <button type="button" className={styles.ghostBtn}>
                  <Mail size={11} /> Email Cravath
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
