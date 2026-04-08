import { useParams, useNavigate } from "react-router-dom";
import { managers, signalEvents } from "@/data/managers";
import { useState, useEffect } from "react";
import FlagDot from "@/components/FlagDot";
import RiskScoreBadge from "@/components/RiskScoreBadge";
import { ArrowLeft, FileText, CheckCircle2, XCircle, Building2, CheckCircle, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = ["Overview", "Identity", "Compliance", "Intelligence", "Signals"] as const;
type Tab = typeof tabs[number];

// --- Overview content per manager ---
const managerOverviews: Record<number, { firmSummary: [string, string]; pmBio: { name: string; initials: string; title: string; subline: string; paragraphs: [string, string] } }> = {
  1: {
    firmSummary: [
      "Arcturus Capital Management is a New York-based global macro hedge fund founded in 2011 by Marcus Holt, a veteran macro trader with prior experience at Bridgewater Associates and Tudor Investment Corp. The firm employs a top-down discretionary approach to global macro investing, expressing views across rates, FX, commodities, and equity indices through liquid derivatives and cash instruments. The strategy targets absolute returns with low correlation to traditional asset classes, emphasizing capital preservation during periods of market stress.",
      "As of Q1 2026, Arcturus manages approximately $4.2 billion in AUM across its flagship fund and two institutional sub-accounts. The portfolio has maintained a consistent risk-reward profile with annualized returns of 11.2% over the trailing three years. The firm's AUM has grown steadily from $2.8 billion in 2020, reflecting strong performance and institutional inflows from pension funds and sovereign wealth entities. Arcturus maintains a robust operational infrastructure with Goldman Sachs as prime broker and Deloitte as auditor."
    ],
    pmBio: {
      name: "Marcus Holt",
      initials: "MH",
      title: "Founder & Chief Investment Officer",
      subline: "28 years experience | Bridgewater Associates | Tudor Investment Corp",
      paragraphs: [
        "Marcus Holt founded Arcturus Capital Management in 2011 following a distinguished 15-year career in global macro trading. He spent seven years at Bridgewater Associates as a Senior Investment Engineer focused on sovereign debt and currency strategies, and prior to that held portfolio management roles at Tudor Investment Corp where he managed a $1.2 billion rates book.",
        "Holt holds a B.A. in Mathematics from Princeton University and an M.Phil in Economics from the University of Cambridge. He is a frequent speaker at the Global Macro Conference and serves on the advisory board of the Princeton Bendheim Center for Finance. He has no disclosed regulatory matters and maintains an exemplary compliance record."
      ]
    }
  },
  2: {
    firmSummary: [
      "Meridian Capital Management is a Greenwich, Connecticut-based long/short equity hedge fund founded in 2016 by Diana Reyes, formerly a managing director at Viking Global Investors. The firm pursues a fundamental research-driven approach to U.S. and European equities, maintaining a concentrated portfolio of 30 to 50 positions with typical net exposure between 20% and 50%. The strategy emphasizes deep sector expertise in technology, healthcare, and consumer discretionary, with a particular focus on identifying mispriced growth companies undergoing inflection points.",
      "As of Q1 2026, Meridian manages approximately $1.8 billion in AUM, relatively stable from its 2024 peak of $2.0 billion. The fund has delivered 8.7% annualized returns over three years, modestly trailing long/short equity peers due to elevated short-side losses during the 2024 AI-driven rally. The firm's key person risk is rated High due to Diana Reyes's outsized influence on investment decisions and a relatively lean team of 9 professionals. Despite this, operational quality remains strong with Morgan Stanley as prime broker and PwC as auditor."
    ],
    pmBio: {
      name: "Diana Reyes",
      initials: "DR",
      title: "Founder & Chief Investment Officer",
      subline: "22 years experience | Viking Global Investors | Goldman Sachs",
      paragraphs: [
        "Diana Reyes founded Meridian Capital Management in 2016 after a successful 12-year career at Viking Global Investors, where she rose to Partner and managed the firm's consumer and technology sector books totaling $3 billion in gross exposure. Prior to Viking, Reyes spent five years in Goldman Sachs's equity research division covering internet and media companies.",
        "Reyes holds a B.S. in Finance from the Wharton School and an MBA from Harvard Business School. She was named to Institutional Investor's Rising Stars list in 2018 and serves on the board of the 100 Women in Finance organization. She has no disclosed regulatory matters or compliance issues."
      ]
    }
  },
  3: {
    firmSummary: [
      "Ironwood Systematic Partners is a Chicago-based quantitative equity hedge fund founded in 2008 by Chen Wei, a former quantitative researcher at D.E. Shaw & Co. The firm deploys systematic, model-driven strategies across U.S. and international equity markets using proprietary alpha signals derived from alternative data, natural language processing, and statistical arbitrage techniques. The strategy operates with high portfolio turnover and typically holds 500 to 2,000 positions, maintaining market-neutral to modestly net-long exposure.",
      "As of Q1 2026, Ironwood manages approximately $7.1 billion in AUM, making it one of the larger quantitative equity platforms in the mid-cap space. The fund has delivered exceptional performance with 14.6% annualized returns over three years and 9.2% YTD. AUM has grown from $4.5 billion in 2022, driven by strong alpha generation and institutional demand for uncorrelated systematic strategies. The firm's infrastructure includes a 31-person team spanning research, engineering, and operations, with Goldman Sachs as prime broker and KPMG as auditor."
    ],
    pmBio: {
      name: "Chen Wei",
      initials: "CW",
      title: "Founder & Chief Executive Officer",
      subline: "26 years experience | D.E. Shaw & Co | Renaissance Technologies",
      paragraphs: [
        "Chen Wei founded Ironwood Systematic Partners in 2008 after serving as a Senior Vice President and Portfolio Manager at D.E. Shaw & Co, where he led the development of equity statistical arbitrage models for the firm's Composite Fund. Earlier in his career, Wei spent four years as a quantitative analyst at Renaissance Technologies working on medium-frequency equity signals.",
        "Wei holds a Ph.D. in Applied Mathematics from MIT and a B.S. in Physics from Peking University. He has published research on machine learning applications in financial markets in the Journal of Financial Economics and Quantitative Finance. He holds no regulatory disclosures and Ironwood has maintained a clean compliance record since inception."
      ]
    }
  },
  4: {
    firmSummary: [
      "Helix Credit Opportunities is a New York-based distressed credit manager founded in 2014 by Robert Vance, formerly a senior portfolio manager at Cerberus Capital Management. The firm focuses on stressed and distressed corporate credit across the capital structure, targeting situations where fundamental dislocation has created asymmetric recovery opportunities. The strategy employs a deep fundamental research process with an activist orientation, typically concentrating the portfolio in 15 to 25 high-conviction positions across bankruptcy reorganizations, out-of-court restructurings, and secondary loan trades.",
      "As of Q1 2026 the portfolio reflects a defensive tilt, with increased allocation to secured senior debt and reduced exposure to equity tranches following deteriorating credit conditions in the middle market. The firm manages approximately $2.3 billion across its flagship fund and a separately managed account, with institutional investors comprising the majority of the capital base. Helix has experienced meaningful AUM decline from a peak of $3.8 billion in 2021, driven primarily by below-benchmark performance in the 2022-2023 vintage and one notable investor redemption in Q3 2023."
    ],
    pmBio: {
      name: "Robert Vance",
      initials: "RV",
      title: "Founder & Chief Investment Officer",
      subline: "32 years experience | Cerberus Capital | Drexel Burnham Lambert",
      paragraphs: [
        "Robert Vance founded Helix Credit Opportunities in 2014 following an 11-year tenure at Cerberus Capital Management where he served as Senior Portfolio Manager for the firm's North American distressed debt book. Prior to Cerberus, Vance spent eight years at Deutsche Bank's leveraged finance and restructuring group and began his career at Drexel Burnham Lambert during the seminal period of high-yield market development in the late 1980s.",
        "Vance holds a B.S. in Economics from the Wharton School and an MBA from Columbia Business School. He is a CFA charterholder and serves on the board of the Loan Syndications and Trading Association. He has been the subject of one disclosed regulatory matter, a 2019 SEC settlement related to undisclosed conflicts of interest with a third-party placement agent, which has been noted in the firm's compliance record."
      ]
    }
  },
  5: {
    firmSummary: [
      "Northgate Event Driven Fund is a New York-based event driven hedge fund founded in 2010 by Sarah Kim, formerly a senior analyst at Paulson & Co. The firm specializes in merger arbitrage, activist situations, and corporate restructurings, combining quantitative deal analysis with fundamental research on strategic rationale and regulatory probability. The portfolio typically holds 40 to 60 positions across announced and anticipated corporate events in North America and Europe.",
      "As of Q1 2026, Northgate manages approximately $3.6 billion in AUM with a team of 18 investment professionals. The fund has delivered consistent returns of 10.3% annualized over three years with notably low volatility, reflecting the strategy's hedged and catalyst-driven approach. AUM has remained stable over the past two years as strong performance has been offset by selective capacity management. The firm maintains an institutional-grade operational setup with JPMorgan as prime broker and EY as auditor."
    ],
    pmBio: {
      name: "Sarah Kim",
      initials: "SK",
      title: "Founder & Chief Investment Officer",
      subline: "24 years experience | Paulson & Co | Lazard",
      paragraphs: [
        "Sarah Kim founded Northgate Event Driven Fund in 2010 after spending eight years at Paulson & Co, where she served as a Senior Portfolio Manager covering event driven and merger arbitrage strategies in the healthcare and technology sectors. Prior to Paulson, Kim spent six years at Lazard's restructuring advisory practice where she advised on over $20 billion in distressed M&A transactions.",
        "Kim holds a B.A. in Economics from Yale University and a J.D. from NYU School of Law. She is a member of the New York State Bar and serves on the advisory board of the Managed Funds Association. She has no disclosed regulatory matters and is recognized as one of the leading female portfolio managers in the event driven space."
      ]
    }
  },
  6: {
    firmSummary: [
      "Solaris Private Credit is a Miami-based private credit manager founded in 2019 by James Okafor, formerly a director in Apollo Global Management's credit origination group. The firm focuses on direct lending to middle-market companies with EBITDA between $10 million and $75 million, providing first lien senior secured term loans, delayed draw facilities, and unitranche structures. Solaris differentiates through deep sector expertise in healthcare services, business services, and specialty manufacturing.",
      "As of Q1 2026, Solaris manages approximately $900 million in AUM, having grown steadily from $200 million at inception. The fund's relatively young track record limits the three-year performance data, but YTD returns of 4.8% are in line with direct lending peers. The firm's key person risk is rated High due to the small team of 6 professionals and heavy reliance on founder James Okafor for origination and underwriting decisions. Solaris is not SEC registered, which is flagged for monitoring though common for smaller private credit managers."
    ],
    pmBio: {
      name: "James Okafor",
      initials: "JO",
      title: "Founder & Managing Partner",
      subline: "18 years experience | Apollo Global Management | Ares Capital",
      paragraphs: [
        "James Okafor founded Solaris Private Credit in 2019 after a seven-year career at Apollo Global Management, where he served as a Director in the firm's direct origination group responsible for sourcing and underwriting middle-market loans across the Southeast United States. Prior to Apollo, Okafor spent five years at Ares Capital Corporation in leveraged finance origination.",
        "Okafor holds a B.S. in Finance from Howard University and an MBA from the University of Chicago Booth School of Business. He is a member of the Private Debt Investor advisory council and speaks regularly at middle-market lending conferences. He has no disclosed regulatory matters. The firm's lack of SEC registration is noted as a monitoring item in due diligence assessments."
      ]
    }
  },
  7: {
    firmSummary: [
      "Tundra Macro Strategies is a London-based global macro hedge fund founded in 2006 by Alistair Brooks, formerly a senior rates trader at Brevan Howard Asset Management. The firm deploys a discretionary macro approach with particular emphasis on G10 rates, European sovereign credit, and commodity markets. The strategy combines top-down macroeconomic analysis with tactical trading around central bank policy decisions, fiscal events, and geopolitical catalysts.",
      "As of Q1 2026, Tundra manages approximately $5.5 billion in AUM, down from a peak of $7.2 billion in 2022. The AUM decline reflects a combination of modest relative underperformance in 2024 and selective investor rebalancing away from European-domiciled managers. Three-year annualized returns of 7.8% trail the global macro peer group median. Despite the AUM decline, the firm maintains a experienced 22-person team and strong institutional relationships across European pension funds and family offices."
    ],
    pmBio: {
      name: "Alistair Brooks",
      initials: "AB",
      title: "Founder & Chief Investment Officer",
      subline: "30 years experience | Brevan Howard | Bank of England",
      paragraphs: [
        "Alistair Brooks founded Tundra Macro Strategies in 2006 after a nine-year tenure at Brevan Howard Asset Management, where he managed a $2 billion portfolio of G10 rates and FX positions. Prior to Brevan Howard, Brooks spent seven years at the Bank of England in the Markets Directorate, where he was responsible for managing the UK's foreign currency reserves and gilt portfolio.",
        "Brooks holds a B.A. in Philosophy, Politics and Economics from the University of Oxford and an M.Sc. in Financial Mathematics from Imperial College London. He is a Fellow of the Royal Statistical Society and serves on the advisory committee of the Alternative Investment Management Association (AIMA). He has no disclosed regulatory matters in any jurisdiction."
      ]
    }
  },
  8: {
    firmSummary: [
      "Vega Special Situations is a New York-based special situations hedge fund founded in 2018 by Patricia Nguyen, formerly a vice president at Elliott Management Corporation. The firm targets complex, catalyst-rich situations across the capital structure including post-reorganization equities, litigation-driven opportunities, regulatory change beneficiaries, and spin-off/carve-out transactions. The strategy typically maintains 20 to 35 concentrated positions with a holding period of 6 to 18 months.",
      "As of Q1 2026, Vega manages approximately $1.1 billion in AUM, having grown from $300 million at launch. The fund has delivered strong performance with 12.4% annualized returns over three years and 7.1% YTD. Despite the strong track record, key person risk remains High due to the small 7-person team and Patricia Nguyen's central role in all investment decisions. The firm has been flagged for its prime brokerage relationship with Credit Suisse, which carries legacy counterparty risk considerations following the UBS acquisition."
    ],
    pmBio: {
      name: "Patricia Nguyen",
      initials: "PN",
      title: "Founder & Chief Investment Officer",
      subline: "20 years experience | Elliott Management | Houlihan Lokey",
      paragraphs: [
        "Patricia Nguyen founded Vega Special Situations in 2018 after a nine-year career at Elliott Management Corporation, where she was a Vice President and senior analyst covering special situations and distressed equities globally. Prior to Elliott, Nguyen spent five years at Houlihan Lokey in the restructuring advisory practice, where she advised on Chapter 11 proceedings and out-of-court workouts across industrial and retail sectors.",
        "Nguyen holds a B.S. in Applied Economics from Cornell University and an MBA from Stanford Graduate School of Business. She is a CFA charterholder and was recognized on Forbes 30 Under 30 in Finance in 2015. She has no disclosed regulatory matters and is an active mentor in the Toigo Foundation's fellowship program for underrepresented professionals in finance."
      ]
    }
  }
};

// --- Service Providers per manager ---
interface ServiceProvider {
  category: string;
  name: string;
  status: "tier1" | "warning" | "neutral";
  note?: string;
}

const serviceProviders: Record<number, ServiceProvider[]> = {
  1: [
    { category: "Prime Broker", name: "Goldman Sachs", status: "tier1" },
    { category: "Auditor", name: "Deloitte", status: "tier1" },
    { category: "Legal Counsel", name: "Seward & Kissel", status: "tier1" },
    { category: "Fund Administrator", name: "Citco Group", status: "tier1" },
    { category: "Compliance Consultant", name: "ACA Group", status: "tier1" },
    { category: "Tax Advisor", name: "PwC", status: "tier1" },
  ],
  2: [
    { category: "Prime Broker", name: "Morgan Stanley", status: "tier1" },
    { category: "Auditor", name: "PwC", status: "tier1" },
    { category: "Legal Counsel", name: "Schulte Roth & Zabel", status: "tier1" },
    { category: "Fund Administrator", name: "SS&C Technologies", status: "tier1" },
    { category: "Compliance Consultant", name: "Oyster Consulting", status: "neutral" },
    { category: "Tax Advisor", name: "Deloitte", status: "tier1" },
  ],
  3: [
    { category: "Prime Broker", name: "Goldman Sachs", status: "tier1" },
    { category: "Auditor", name: "KPMG", status: "tier1" },
    { category: "Legal Counsel", name: "Kirkland & Ellis", status: "tier1" },
    { category: "Fund Administrator", name: "Apex Group", status: "tier1" },
    { category: "Compliance Consultant", name: "ACA Group", status: "tier1" },
    { category: "Tax Advisor", name: "EY", status: "tier1" },
  ],
  4: [
    { category: "Prime Broker", name: "Deutsche Bank", status: "warning" },
    { category: "Auditor", name: "BDO", status: "warning" },
    { category: "Legal Counsel", name: "Kleinberg Kaplan", status: "neutral" },
    { category: "Fund Administrator", name: "SS&C Technologies", status: "tier1" },
    { category: "Compliance Consultant", name: "ACA Group", status: "tier1" },
    { category: "Tax Advisor", name: "RSM US", status: "neutral" },
  ],
  5: [
    { category: "Prime Broker", name: "JPMorgan", status: "tier1" },
    { category: "Auditor", name: "EY", status: "tier1" },
    { category: "Legal Counsel", name: "Proskauer Rose", status: "tier1" },
    { category: "Fund Administrator", name: "Citco Group", status: "tier1" },
    { category: "Compliance Consultant", name: "ACA Group", status: "tier1" },
    { category: "Tax Advisor", name: "KPMG", status: "tier1" },
  ],
  6: [
    { category: "Prime Broker", name: "None — Direct Lending", status: "neutral" },
    { category: "Auditor", name: "Cohen & Company", status: "warning" },
    { category: "Legal Counsel", name: "Greenberg Traurig", status: "tier1" },
    { category: "Fund Administrator", name: "Alter Domus", status: "tier1" },
    { category: "Compliance Consultant", name: "Hardin Compliance", status: "neutral" },
    { category: "Tax Advisor", name: "Grant Thornton", status: "neutral" },
  ],
  7: [
    { category: "Prime Broker", name: "Barclays", status: "tier1" },
    { category: "Auditor", name: "Grant Thornton", status: "neutral" },
    { category: "Legal Counsel", name: "Walkers", status: "tier1" },
    { category: "Fund Administrator", name: "Maples Fund Services", status: "tier1" },
    { category: "Compliance Consultant", name: "Duff & Phelps", status: "tier1" },
    { category: "Tax Advisor", name: "KPMG", status: "tier1" },
  ],
  8: [
    { category: "Prime Broker", name: "Credit Suisse", status: "warning", note: "Legacy relationship, counterparty risk flagged" },
    { category: "Auditor", name: "Marcum", status: "warning" },
    { category: "Legal Counsel", name: "Seward & Kissel", status: "tier1" },
    { category: "Fund Administrator", name: "SS&C Technologies", status: "tier1" },
    { category: "Compliance Consultant", name: "Oyster Consulting", status: "neutral" },
    { category: "Tax Advisor", name: "RSM US", status: "neutral" },
  ],
};

const AnimatedGauge = ({ score, managerId }: { score: number; managerId: number }) => {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    setAnimatedScore(0);
    const duration = 1200;
    const start = performance.now();
    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedScore(Math.round(eased * score));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [score, managerId]);

  const getColor = (s: number) => {
    if (s <= 30) return "#22C55E";
    if (s <= 50) return "#F59E0B";
    return "#EF4444";
  };

  const color = getColor(animatedScore);
  const angle = (animatedScore / 100) * 180;
  const arcLen = (angle / 180) * 157;

  const label = score > 50 ? "ELEVATED RISK" : score >= 30 ? "MONITOR" : "CLEAR";
  const labelColor = score > 50 ? "#EF4444" : score >= 30 ? "#F59E0B" : "#22C55E";

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-24 h-14">
        <svg viewBox="0 0 120 70" className="w-full h-full">
          <defs>
            <linearGradient id={`gauge-grad-${managerId}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#22C55E" />
              <stop offset="50%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#EF4444" />
            </linearGradient>
          </defs>
          <path d="M 10 65 A 50 50 0 0 1 110 65" fill="none" stroke="#30363D" strokeWidth="8" strokeLinecap="round" />
          <path
            d="M 10 65 A 50 50 0 0 1 110 65"
            fill="none"
            stroke={`url(#gauge-grad-${managerId})`}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${arcLen} 157`}
            className="transition-none"
          />
          <text x="60" y="62" textAnchor="middle" fill={color} fontSize="20" fontWeight="700">
            {animatedScore}
          </text>
        </svg>
      </div>
      <span className="text-[10px] font-bold tracking-widest mt-0.5" style={{ color: labelColor }}>
        {label}
      </span>
    </div>
  );
};

const flagBorderColor = (flag: "green" | "yellow" | "red") => {
  if (flag === "green") return "border-l-[#22C55E]";
  if (flag === "yellow") return "border-l-[#F59E0B]";
  return "border-l-[#EF4444]";
};

const ManagerDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>("Overview");

  const manager = managers.find((m) => m.id === Number(id));
  if (!manager) return <div className="p-6 text-foreground">Manager not found.</div>;

  const signals = signalEvents[manager.id];
  const overview = managerOverviews[manager.id];
  const providers = serviceProviders[manager.id] || [];

  const complianceItems = [
    { label: "SEC Registered", value: manager.sec_registered, display: manager.sec_registered ? "Yes" : "No" },
    { label: "FINRA Status", value: manager.finra_status === "Clean", display: manager.finra_status },
    { label: "SEC Enforcement", value: manager.sec_enforcement === "None", display: manager.sec_enforcement },
    { label: "Form D Filed", value: manager.form_d, display: manager.form_d ? "Yes" : "No" },
    { label: "Sanctions", value: manager.sanctions === "Clear", display: manager.sanctions },
    { label: "Adverse Media", value: manager.adverse_media === "None", display: manager.adverse_media },
  ];

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
            <AnimatedGauge score={manager.risk_score} managerId={manager.id} />
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
          {/* OVERVIEW TAB */}
          {activeTab === "Overview" && overview && (
            <div className="space-y-6">
              {/* Firm & Strategy Summary */}
              <div>
                <h3 className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">Firm & Strategy Summary</h3>
                <div className={cn("bg-[#161B22] border border-border rounded-lg p-5 border-l-[3px]", flagBorderColor(manager.flag))}>
                  <p className="text-[14px] leading-[1.8] text-[#CBD5E1] mb-4">{overview.firmSummary[0]}</p>
                  <p className="text-[14px] leading-[1.8] text-[#CBD5E1]">{overview.firmSummary[1]}</p>
                </div>
              </div>

              {/* Portfolio Manager Biography */}
              <div>
                <h3 className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">Portfolio Manager Biography</h3>
                <div className="bg-[#161B22] border border-border rounded-lg p-5 border-l-[3px] border-l-primary">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full border-2 border-primary bg-[#0D1117] flex items-center justify-center">
                      <span className="text-sm font-bold text-primary">{overview.pmBio.initials}</span>
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-foreground">{overview.pmBio.name}</h4>
                      <p className="text-xs text-muted-foreground">{overview.pmBio.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{overview.pmBio.subline}</p>
                    </div>
                  </div>
                  <p className="text-[14px] leading-[1.8] text-[#CBD5E1] mb-4">{overview.pmBio.paragraphs[0]}</p>
                  <p className="text-[14px] leading-[1.8] text-[#CBD5E1]">{overview.pmBio.paragraphs[1]}</p>
                </div>
              </div>
            </div>
          )}

          {/* IDENTITY TAB */}
          {activeTab === "Identity" && (
            <div className="space-y-8">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[
                  ["AUM", `$${manager.aum_bn}B`],
                  ["Inception", manager.inception],
                  ["Domicile", manager.domicile],
                  ["HQ", manager.hq],
                  ["Portfolio Manager", manager.gp_name],
                  ["Team Size", manager.team_size],
                  ["Last Updated", manager.last_updated],
                ].map(([label, value]) => (
                  <div key={label as string}>
                    <p className="text-[11px] text-muted-foreground uppercase tracking-wider">{label}</p>
                    <p className="text-sm font-medium text-foreground mt-0.5">{String(value)}</p>
                  </div>
                ))}
              </div>

              {/* Service Providers */}
              {providers.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-primary" />
                    Service Providers
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {providers.map((sp) => (
                      <div key={sp.category} className="bg-[#161B22] border border-border rounded-lg p-4 flex items-start justify-between">
                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-widest text-primary mb-1">{sp.category}</p>
                          <p className={cn(
                            "text-sm font-bold",
                            sp.status === "warning" ? "text-[#F59E0B]" : "text-foreground"
                          )}>
                            {sp.name}
                          </p>
                          {sp.note && <p className="text-[10px] text-[#F59E0B] mt-0.5">{sp.note}</p>}
                        </div>
                        <div className="flex-shrink-0 mt-1">
                          {sp.status === "tier1" && <CheckCircle className="h-4 w-4 text-[#22C55E]" />}
                          {sp.status === "warning" && <AlertTriangle className="h-4 w-4 text-[#F59E0B]" />}
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-3 italic">
                    Service provider quality is a key operational due diligence factor. Non-Big 4 auditors and non-tier-1 prime brokers are flagged for review.
                  </p>
                </div>
              )}
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
