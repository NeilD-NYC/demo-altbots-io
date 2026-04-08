import { useParams, useNavigate } from "react-router-dom";
import { managers, signalEvents } from "@/data/managers";
import { useState } from "react";
import FlagDot from "@/components/FlagDot";
import RiskScoreBadge from "@/components/RiskScoreBadge";
import { ArrowLeft, FileText, CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = ["Identity", "Compliance", "Intelligence", "Signals"] as const;
type Tab = typeof tabs[number];

const ManagerDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>("Identity");

  const manager = managers.find((m) => m.id === Number(id));
  if (!manager) return <div className="p-6 text-foreground">Manager not found.</div>;

  const signals = signalEvents[manager.id];

  const complianceItems = [
    { label: "SEC Registered", value: manager.sec_registered, display: manager.sec_registered ? "Yes" : "No" },
    { label: "FINRA Status", value: manager.finra_status === "Clean", display: manager.finra_status },
    { label: "SEC Enforcement", value: manager.sec_enforcement === "None", display: manager.sec_enforcement },
    { label: "Form D Filed", value: manager.form_d, display: manager.form_d ? "Yes" : "No" },
    { label: "Sanctions", value: manager.sanctions === "Clear", display: manager.sanctions },
    { label: "Adverse Media", value: manager.adverse_media === "None", display: manager.adverse_media },
  ];

  // Risk gauge calculation
  const angle = (manager.risk_score / 100) * 180;
  const gaugeColor = manager.risk_score > 50 ? "#EF4444" : manager.risk_score >= 30 ? "#F59E0B" : "#22C55E";

  return (
    <div className="p-6 space-y-6 max-w-[1000px] mx-auto">
      {/* Back + Header */}
      <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div>
              <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                {manager.name}
                <FlagDot flag={manager.flag} />
              </h2>
              <span className="text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full">{manager.strategy}</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {/* Gauge */}
            <div className="relative w-24 h-14">
              <svg viewBox="0 0 120 70" className="w-full h-full">
                <path d="M 10 65 A 50 50 0 0 1 110 65" fill="none" stroke="#30363D" strokeWidth="8" strokeLinecap="round" />
                <path
                  d="M 10 65 A 50 50 0 0 1 110 65"
                  fill="none"
                  stroke={gaugeColor}
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${(angle / 180) * 157} 157`}
                />
                <text x="60" y="62" textAnchor="middle" fill={gaugeColor} fontSize="20" fontWeight="700">{manager.risk_score}</text>
              </svg>
            </div>
            <button className="text-xs font-medium text-primary border border-primary/30 rounded px-3 py-2 hover:bg-primary/10 transition-colors flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5" /> Generate PDF Report
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mt-6 border-b border-border">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-4 py-2.5 text-sm font-medium transition-colors relative",
                activeTab === tab ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {tab}
              {activeTab === tab && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="mt-5">
          {activeTab === "Identity" && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[
                ["AUM", `$${manager.aum_bn}B`],
                ["Inception", manager.inception],
                ["Domicile", manager.domicile],
                ["HQ", manager.hq],
                ["GP Name", manager.gp_name],
                ["Team Size", manager.team_size],
                ["Last Updated", manager.last_updated],
              ].map(([label, value]) => (
                <div key={label as string}>
                  <p className="text-[11px] text-muted-foreground uppercase tracking-wider">{label}</p>
                  <p className="text-sm font-medium text-foreground mt-0.5">{String(value)}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === "Compliance" && (
            <div className="space-y-3">
              {complianceItems.map((item) => (
                <div key={item.label} className="flex items-center justify-between py-2.5 border-b border-border/50">
                  <span className="text-sm text-foreground">{item.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">{item.display}</span>
                    {item.value ? (
                      <CheckCircle2 className="h-4 w-4 text-success" />
                    ) : (
                      <XCircle className="h-4 w-4 text-destructive" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "Intelligence" && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[
                ["Key Person Risk", manager.key_person_risk],
                ["AUM Trend", manager.aum_trend],
                ["Strategy Drift", manager.strategy_drift ? "Detected" : "None"],
                ["Performance YTD", `${manager.performance_ytd}%`],
                ["Performance 3yr", manager.performance_3yr != null ? `${manager.performance_3yr}%` : "N/A"],
                ["Prime Broker", manager.prime_broker],
                ["Auditor", manager.auditor],
                ["Legal Counsel", manager.legal_counsel],
              ].map(([label, value]) => (
                <div key={label as string}>
                  <p className="text-[11px] text-muted-foreground uppercase tracking-wider">{label}</p>
                  <p className={cn(
                    "text-sm font-medium mt-0.5",
                    label === "Strategy Drift" && value === "Detected" ? "text-destructive" : "text-foreground"
                  )}>{String(value)}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === "Signals" && (
            <div>
              {signals ? (
                <div className="space-y-4">
                  {signals.map((s, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="flex flex-col items-center">
                        <span className="h-3 w-3 rounded-full bg-destructive" />
                        {i < signals.length - 1 && <span className="w-px h-8 bg-border mt-1" />}
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-destructive">{s.year}</p>
                        <p className="text-sm text-foreground">{s.event}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-success">No adverse signals detected.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManagerDetail;
