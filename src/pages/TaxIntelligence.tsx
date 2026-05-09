import styles from "./TaxIntelligence.module.css";
import TaxHeader from "@/components/tax/TaxHeader";
import AITaxAdvisor from "@/components/tax/AITaxAdvisor";
import { useActiveEntity } from "@/lib/active-entity";

export default function TaxIntelligence() {
  const { isSwitching } = useActiveEntity();
  return (
    <div className={styles.taxRoot}>
      <div
        className={styles.shell}
        style={{
          opacity: isSwitching ? 0.4 : 1,
          transition: "opacity 400ms ease",
        }}
      >
        <TaxHeader />
        <AITaxAdvisor />
      </div>
    </div>
  );
}
