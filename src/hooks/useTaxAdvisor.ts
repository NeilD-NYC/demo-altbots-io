import { useState, useCallback } from "react";

export type AdvisorKey = "wyden" | "slat" | "ny" | "qsbs";

export type AdvisorResponse = {
  key: AdvisorKey | "generic";
  iconName: "zap" | "shield" | "alert-triangle" | "clock";
  title: string;
  bodyHtml: string;
  confidence: "High" | "Medium" | "Low";
  latencySeconds: number;
  sources: number;
};

export const ADVISOR_QUESTIONS: Record<AdvisorKey, string> = {
  wyden: "How much would the Wyden PPLI bill cost us if it passes?",
  slat: "Should I do another SLAT given OBBBA?",
  ny: "Why did NY tax bill jump 40% YoY?",
  qsbs: "When do my QSBS clocks run out?",
};

const RESPONSES: Record<AdvisorKey, AdvisorResponse> = {
  wyden: {
    key: "wyden",
    iconName: "zap",
    title: "Wyden PPLI Bill (S.1117) — Wynfield Exposure",
    bodyHtml: `
      <p>If <strong>S.1117</strong> passes the Senate Finance markup on <strong>Jun 18, 2026</strong> in its current form, Wynfield Trust LP's two PPLI policies face a clawback range of <strong>$7.8M – $11.2M</strong> against current cash value of <strong>$42.0M</strong>.<span class="cite">[Sec. 7702(g) revision §3(b)]</span></p>
      <p>The hit decomposes as: (1) retroactive inside-buildup tax on Policy A's IDF gains since 2019 (<strong>$4.6M</strong>), (2) DAC re-characterization on Policy B premium loading (<strong>$1.9M – $3.4M</strong>), and (3) state premium tax true-up (<strong>$1.3M</strong>).<span class="cite">[IRC §817(h); Treas. Reg. §1.817-5]</span></p>
      <p><strong>Mitigation paths under review:</strong> accelerate Policy B's remaining premium tranche before Q3 to lock §7702 status, restructure IDF allocations away from concentrated growth managers, and re-paper investor-control flags ahead of markup. Cravath memo (Apr 2026) and Aon broker analysis converge on the same posture.<span class="cite">[Cravath PPLI memo §IV; Aon FY26 review]</span></p>
    `,
    confidence: "High",
    latencySeconds: 2.1,
    sources: 7,
  },
  slat: {
    key: "slat",
    iconName: "shield",
    title: "Second SLAT Under OBBBA — Recommendation",
    bodyHtml: `
      <p>With <strong>$18.6M of lifetime gift exemption remaining</strong> and OBBBA's $13.99M sunset reverting <strong>Jan 1, 2026</strong>, funding a second SLAT before <strong>Sep 15</strong> captures roughly <strong>$4.6M</strong> of additional transfer-tax shield versus waiting.<span class="cite">[IRC §2010(c); OBBBA §70106]</span></p>
      <p>The reciprocal-trust doctrine is the active risk: your existing 2021 SLAT names spouse as beneficiary on identical terms. Differentiation levers — varying trustee, distribution standard (HEMS vs. ascertainable + discretion), and corpus composition — would meet the <em>Estate of Levy</em> safe harbor.<span class="cite">[Estate of Levy v. Commr., T.C. Memo 1983-453]</span></p>
      <p><strong>Alternative:</strong> a 9-year GRAT overlay funded with the same $18.6M produces ~<strong>$3.1M PV shield</strong> with no exemption use, preserving optionality for a 2027 dynasty trust if rates fall.<span class="cite">[Treas. Reg. §25.2702-3]</span></p>
    `,
    confidence: "High",
    latencySeconds: 2.1,
    sources: 7,
  },
  ny: {
    key: "ny",
    iconName: "alert-triangle",
    title: "NY Tax Bill — 40% YoY Driver Decomposition",
    bodyHtml: `
      <p>FY26 NY State liability rose from <strong>$11.4M → $16.0M</strong> (<strong>+40.4%</strong>). Three factors explain 92% of the variance:<span class="cite">[NY Form IT-201; K-1 reconciliation file]</span></p>
      <p>(1) <strong>+$2.1M</strong> from PTET federal-cap erosion as the 2024 cure expired; (2) <strong>+$1.4M</strong> from carry recharacterization on the Aurora Therapeutics partial exit (3-year hold short of §1061 safe harbor); (3) <strong>+$0.9M</strong> from a <strong>127-day NY presence count YTD</strong> versus 96 days in FY25 — only <strong>56 days from the §605(b) statutory-residency tripwire</strong>.<span class="cite">[IRC §1061(a); NY Tax Law §605(b)(1)(B)]</span></p>
      <p><strong>Recommended actions:</strong> reroute Q3 board meetings to the FL office (target ≤170 NY days), file PTET election re-affirmation by the Sep 15 deadline, and review carried interest holding periods against §1061 with K&E before the Aurora Q4 distribution clears.<span class="cite">[K&E carry memo Mar 2026]</span></p>
    `,
    confidence: "High",
    latencySeconds: 2.1,
    sources: 7,
  },
  qsbs: {
    key: "qsbs",
    iconName: "clock",
    title: "QSBS §1202 5-Year Clock Inventory",
    bodyHtml: `
      <p>Three Wynfield positions cross the §1202 5-year hold threshold within the next nine months, unlocking aggregate exclusion eligibility of <strong>$8.6M</strong>:<span class="cite">[IRC §1202(b); §1202(d)]</span></p>
      <p>• <strong>Aurora Therapeutics</strong> — 5-year hit <strong>Jul 31, 2026</strong>, projected gain at exit <strong>$4.2M</strong>, gross-asset test confirmed at issuance ($38M).<br/>
      • <strong>Helix Compute</strong> — 5-year hit <strong>Oct 14, 2026</strong>, projected gain <strong>$1.8M</strong>, gross-asset test confirmed ($24M).<br/>
      • <strong>Northwind Bio</strong> — 5-year hit <strong>Mar 3, 2027</strong>, projected gain <strong>$2.6M</strong>, gross-asset test pending counsel confirmation.<span class="cite">[Cap-table review files; Cooley issuance opinions]</span></p>
      <p><strong>Action items:</strong> request §1202 tacking certification from Northwind by month-end, model §1045 rollover scenarios if Aurora exit timing slips into 2027, and confirm aggregate per-issuer cap ($10M / 10× basis) is not breached on any position.<span class="cite">[IRC §1045(b); §1202(b)(1)]</span></p>
    `,
    confidence: "High",
    latencySeconds: 2.1,
    sources: 7,
  },
};

function inferKey(query: string): AdvisorKey {
  const q = query.toLowerCase();
  if (q.includes("ppli") || q.includes("wyden") || q.includes("s.1117")) return "wyden";
  if (q.includes("slat") || q.includes("obbba") || q.includes("exemption")) return "slat";
  if (q.includes("ny") || q.includes("new york") || q.includes("state tax")) return "ny";
  if (q.includes("qsbs") || q.includes("1202") || q.includes("clock")) return "qsbs";
  return "wyden";
}

export function useTaxAdvisor() {
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<AdvisorResponse | null>(null);

  const runAdvisor = useCallback((queryOrKey: string | AdvisorKey) => {
    const isKey = (queryOrKey === "wyden" || queryOrKey === "slat" || queryOrKey === "ny" || queryOrKey === "qsbs");
    const key: AdvisorKey = isKey ? (queryOrKey as AdvisorKey) : inferKey(queryOrKey);
    if (isKey) setInput(ADVISOR_QUESTIONS[key]);

    setIsOpen(true);
    setIsLoading(true);
    setResponse(null);

    window.setTimeout(() => {
      setResponse(RESPONSES[key]);
      setIsLoading(false);
    }, 2100);
  }, []);

  return { input, setInput, isOpen, isLoading, response, runAdvisor };
}
