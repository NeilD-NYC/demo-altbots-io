import styles from "./TaxIntelligence.module.css";
import TaxHeader from "@/components/tax/TaxHeader";
import AITaxAdvisor from "@/components/tax/AITaxAdvisor";
import LegislativeAlert from "@/components/tax/LegislativeAlert";
import KpiGrid from "@/components/tax/KpiGrid";
import PpliRiskMonitor from "@/components/tax/PpliRiskMonitor";
import ResidencyAuditCard from "@/components/tax/ResidencyAuditCard";
import K1Pipeline from "@/components/tax/K1Pipeline";
import EstateAndCarry from "@/components/tax/EstateAndCarry";
import CalendarAndProviders from "@/components/tax/CalendarAndProviders";
import StructuralWatchList from "@/components/tax/StructuralWatchList";
import AgentActivityVault from "@/components/tax/AgentActivityVault";
import residencyStyles from "@/components/tax/ResidencyAuditCard.module.css";
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
        <LegislativeAlert />
        <KpiGrid />
        <PpliRiskMonitor />
        <div className={residencyStyles.row}>
          <ResidencyAuditCard />
          <K1Pipeline />
        </div>
        <EstateAndCarry />
        <CalendarAndProviders />
        <StructuralWatchList />
        <AgentActivityVault />
      </div>
    </div>
  );
}
