import styles from "./TaxIntelligence.module.css";
import { useActiveEntity } from "@/lib/active-entity";

export default function TaxIntelligence() {
  const { activeEntityId, setActiveEntityId, entities } = useActiveEntity();
  return (
    <div className={styles.taxRoot}>
      <div className={styles.shell}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <h1 style={{ fontSize: 18, fontWeight: 600, margin: 0 }}>Tax Intelligence</h1>
          <select
            value={activeEntityId}
            onChange={(e) => setActiveEntityId(e.target.value)}
            style={{
              background: "#141414",
              color: "#ccc",
              border: "1px solid #1f1f1f",
              borderRadius: 8,
              padding: "6px 10px",
              fontSize: 12,
            }}
          >
            {entities.map((e) => (
              <option key={e.id} value={e.id}>{e.name}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
