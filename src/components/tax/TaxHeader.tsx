import { useActiveEntity } from "@/lib/active-entity";
import LiveClock from "./LiveClock";
import styles from "./TaxHeader.module.css";

const ENTITY_TYPE_LABEL: Record<string, string> = {
  family_office: "Family Office",
  foundation: "Foundation",
  endowment: "Endowment",
  pension: "Pension",
};

function fmtAum(aum: number | null) {
  if (!aum) return "—";
  if (aum >= 1_000_000_000) return `$${(aum / 1_000_000_000).toFixed(aum % 1_000_000_000 === 0 ? 0 : 1)}B`;
  if (aum >= 1_000_000) return `$${Math.round(aum / 1_000_000)}M`;
  return `$${aum.toLocaleString()}`;
}

export default function TaxHeader() {
  const { entities, activeEntityId, setActiveEntityId } = useActiveEntity();

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <div className={styles.titleRow}>
          <span className={styles.brand}>AltBots</span>
          <span className={styles.divider} />
          <span className={styles.product}>Tax Intelligence</span>
          <span className={styles.beta}>BETA</span>
        </div>
        <div className={styles.subtitle}>
          Sophisticated tax monitoring for institutional allocators · v2.4.1 · <LiveClock />
        </div>
      </div>

      <div className={styles.right}>
        <select
          className={styles.entitySelect}
          value={activeEntityId}
          onChange={(e) => setActiveEntityId(e.target.value)}
        >
          {entities.map((e) => (
            <option key={e.id} value={e.id}>
              {e.entity_name} · {ENTITY_TYPE_LABEL[e.entity_type] ?? e.entity_type} ({fmtAum(e.aum)})
            </option>
          ))}
        </select>
        <div className={styles.statusRow}>
          <span className={styles.statusItem}>
            <span className={`${styles.dot} ${styles.dotGreen}`} />
            5 AGENTS ACTIVE
          </span>
          <span className={styles.sep}>·</span>
          <span className={styles.statusItem}>
            <span className={`${styles.dot} ${styles.dotRed}`} />
            1 RED ALERT
          </span>
          <span className={styles.sep}>·</span>
          <span className={styles.statusItem}>
            FY: <span className={styles.fyYear}>&nbsp;2026</span>&nbsp;YTD
          </span>
        </div>
      </div>
    </header>
  );
}
