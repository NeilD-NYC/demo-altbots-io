import styles from "./TaxIntelligence.module.css";

export default function TaxIntelligence() {
  return (
    <div className={styles.taxRoot}>
      <div className={styles.shell}>
        <h1 style={{ fontSize: 18, fontWeight: 600, margin: 0 }}>Tax Intelligence</h1>
      </div>
    </div>
  );
}