import { useState, useRef, useEffect } from "react";
import { Bot, Send } from "lucide-react";
import { managers } from "@/data/managers";
import { cn } from "@/lib/utils";

/* ── Types ─────────────────────────────────────────── */

interface Message {
  role: "user" | "assistant";
  content: string;
  personaName?: string;
}

interface Persona {
  id: string;
  name: string;
  years: string;
  philosophy: string;
  initials: string;
  placeholder: string;
  chips: string[];
  systemPrompt: string;
}

/* ── Data ──────────────────────────────────────────── */

type Mode = "standard" | "persona";

const standardChips = [
  "Which managers have regulatory issues?",
  "Show me all managers with AUM over $3B",
  "Who has high key person risk?",
  "Which managers are seeing AUM declines?",
  "Summarize the biggest risk in my portfolio",
];

const personas: Persona[] = [
  {
    id: "graham",
    name: "Benjamin Graham",
    years: "1894–1976",
    philosophy: "Father of value investing. Focuses on buying assets below intrinsic value using net-net analysis and margin of safety.",
    initials: "BG",
    placeholder: "Ask Graham about valuation and margin of safety...",
    chips: [
      "Which of my managers are trading below intrinsic value?",
      "Where do I have the highest margin of safety?",
      "Which positions look overvalued on a net-net basis?",
      "What would Graham think of my distressed credit exposure?",
    ],
    systemPrompt: `You are Benjamin Graham, father of value investing. You analyze investment portfolios through the lens of intrinsic value, margin of safety, and net-net analysis. You are skeptical of speculation and focus on fundamentals. Reference the portfolio data provided and respond in Graham's measured, analytical voice.\n\nPortfolio data: ${JSON.stringify(managers)}`,
  },
  {
    id: "buffett",
    name: "Warren Buffett",
    years: "1930–present",
    philosophy: "Quality businesses with durable moats at reasonable prices. Long-term compounding over short-term trading.",
    initials: "WB",
    placeholder: "Ask Buffett about moats, quality and long-term value...",
    chips: [
      "Which managers have the strongest economic moats?",
      "Where am I overpaying for growth?",
      "Which holdings does Buffett would approve of long-term?",
      "How concentrated is my portfolio in quality businesses?",
    ],
    systemPrompt: `You are Warren Buffett speaking to an institutional allocator. You evaluate portfolios through the lens of durable competitive advantages, quality of management, and long-term compounding. You are patient, folksy but sharp. Reference the portfolio data and respond as Buffett would in a shareholder letter tone.\n\nPortfolio data: ${JSON.stringify(managers)}`,
  },
  {
    id: "druckenmiller",
    name: "Stanley Druckenmiller",
    years: "1980s–present",
    philosophy: "Top-down macro investing. Identifies themes, sectors and inflection points before markets price them in.",
    initials: "SD",
    placeholder: "Ask Druckenmiller about macro themes and sector rotation...",
    chips: [
      "What macro themes dominate my current book?",
      "Which sectors am I most exposed to?",
      "Where should I be rotating given current macro regime?",
      "What's my biggest macro risk right now?",
    ],
    systemPrompt: `You are Stanley Druckenmiller, legendary macro investor. You analyze portfolios for macro theme exposure, sector rotation opportunities and inflection points. You think in terms of big picture themes and are willing to take concentrated positions when conviction is high. Reference portfolio data and respond with Druckenmiller's direct, thesis-driven style.\n\nPortfolio data: ${JSON.stringify(managers)}`,
  },
  {
    id: "lafont",
    name: "Philippe Lafont",
    years: "1990s–present",
    philosophy: "Legendary tech and growth investor. Evaluates AI exposure, platform durability and long-term disruption potential of tech positions.",
    initials: "PL",
    placeholder: "Ask Lafont about your tech positions and AI exposure...",
    chips: [
      "How AI-proof is my current portfolio?",
      "Which tech positions have the strongest platform moats?",
      "Where is my technology exposure most concentrated?",
      "Which holdings would Lafont add to vs trim?",
    ],
    systemPrompt: `You are Philippe Lafont, legendary technology and growth investor. You evaluate portfolios for AI exposure, platform durability, network effects and long-term disruption potential. You are deeply familiar with tech business models and how AI is reshaping competitive landscapes. Reference the portfolio holdings and respond with Lafont's analytical, tech-native perspective.\n\nPortfolio data: ${JSON.stringify(managers)}`,
  },
  {
    id: "tudor",
    name: "Paul Tudor Jones",
    years: "1980s–present",
    philosophy: "Global macro and commodities. Famous for predicting the 1987 crash. Focuses on risk/reward, technical levels and macro regime shifts.",
    initials: "PTJ",
    placeholder: "Ask Tudor Jones about macro regimes and risk/reward...",
    chips: [
      "What's my biggest macro risk heading into Q3?",
      "Which positions have the worst risk/reward setup?",
      "How does my book look vs the 1987 setup?",
      "Where should I be hedging given current vol levels?",
    ],
    systemPrompt: `You are Paul Tudor Jones, global macro trader and risk manager. You analyze portfolios through the lens of macro regime, risk/reward setups, technical levels and historical analogs. You are famous for capital preservation and asymmetric trades. Reference the portfolio data and respond with Tudor Jones's direct, risk-focused trading mindset.\n\nPortfolio data: ${JSON.stringify(managers)}`,
  },
];

/* ── Component ─────────────────────────────────────── */

const AIAnalyst = () => {
  const [mode, setMode] = useState<Mode>("standard");
  const [activePersona, setActivePersona] = useState<Persona | null>(null);

  // Separate message histories
  const [standardMessages, setStandardMessages] = useState<Message[]>([]);
  const [personaMessages, setPersonaMessages] = useState<Message[]>([]);

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const messages = mode === "standard" ? standardMessages : personaMessages;
  const setMessages = mode === "standard" ? setStandardMessages : setPersonaMessages;

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;
    const userMsg: Message = { role: "user", content: text.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    const response = generateLocalResponse(text.trim(), mode === "persona" ? activePersona : null);
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: response,
          personaName: mode === "persona" && activePersona ? activePersona.name : undefined,
        },
      ]);
      setIsLoading(false);
    }, 800);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleChangePersona = () => {
    setActivePersona(null);
    setPersonaMessages([]);
  };

  const currentChips = mode === "standard" ? standardChips : activePersona?.chips ?? [];
  const currentPlaceholder =
    mode === "standard"
      ? "Ask about your portfolio managers…"
      : activePersona?.placeholder ?? "Select a persona first…";

  /* ── Render ──────────────────────────────────────── */

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)] max-w-[900px] mx-auto">
      {/* Header + Toggle */}
      <div className="p-6 pb-4 space-y-4">
        <div className="flex items-center gap-3 mb-1">
          <div className="p-2 rounded-lg bg-primary/10">
            <Bot className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              {mode === "standard" ? "AltBots Portfolio Analyst" : "Persona Mode"}
            </h2>
            <p className="text-xs text-muted-foreground">
              {mode === "standard"
                ? "Ask me anything about your portfolio managers and positions."
                : activePersona
                  ? `Viewing through the lens of ${activePersona.name}`
                  : "Select an investing legend to analyze your portfolio"}
            </p>
          </div>
        </div>

        {/* Pill Toggle */}
        <div className="flex gap-1 bg-secondary/60 rounded-full p-1 w-fit">
          <button
            onClick={() => setMode("standard")}
            className={cn(
              "px-4 py-1.5 text-xs font-medium rounded-full transition-all duration-200 cursor-pointer",
              mode === "standard"
                ? "bg-primary text-primary-foreground shadow-sm shadow-primary/30"
                : "text-muted-foreground hover:text-foreground hover:scale-105 tab-heartbeat-inactive"
            )}
          >
            Standard Analyst
          </button>
          <button
            onClick={() => setMode("persona")}
            className={cn(
              "px-4 py-1.5 text-xs font-medium rounded-full transition-all duration-200 cursor-pointer",
              mode === "persona"
                ? "bg-primary text-primary-foreground shadow-sm shadow-primary/30"
                : "text-muted-foreground hover:text-foreground hover:scale-105 tab-heartbeat-inactive"
            )}
          >
            Persona Mode
          </button>
        </div>
      </div>

      {/* Input — always visible at top */}
      <form onSubmit={handleSubmit} className="px-6 pb-4">
        <div className="flex gap-2">
          <input
            className="flex-1 bg-secondary border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            placeholder={currentPlaceholder}
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-primary text-primary-foreground rounded-lg px-4 py-3 hover:bg-primary/90 transition-colors disabled:opacity-40"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </form>

      {/* ── Persona Selection Grid ──────────────────── */}
      {mode === "persona" && !activePersona && (
        <div className="flex-1 overflow-y-auto px-6 pb-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {personas.slice(0, 3).map((p) => (
              <PersonaCard key={p.id} persona={p} onSelect={() => setActivePersona(p)} />
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 sm:max-w-[66%] mx-auto">
            {personas.slice(3).map((p) => (
              <PersonaCard key={p.id} persona={p} onSelect={() => setActivePersona(p)} />
            ))}
          </div>
        </div>
      )}

      {/* ── Chat Area (Standard OR Persona with active persona) ── */}
      {(mode === "standard" || (mode === "persona" && activePersona)) && (
        <>
          {/* Active persona banner */}
          {mode === "persona" && activePersona && (
            <div className="mx-6 mb-3 flex items-center gap-3 bg-card border border-border rounded-lg px-4 py-2.5 border-l-2 border-l-primary">
              <AvatarCircle initials={activePersona.initials} size={32} />
              <span className="text-sm text-foreground">
                Viewing through: <span className="font-semibold text-primary">{activePersona.name}</span>
              </span>
              <button
                onClick={handleChangePersona}
                className="ml-auto text-xs text-muted-foreground border border-border rounded px-2.5 py-1 hover:text-foreground hover:border-muted-foreground transition-colors"
              >
                Change Persona
              </button>
            </div>
          )}

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 space-y-4 scrollbar-thin">
            {messages.length === 0 && (
              <div className="space-y-3 pt-4">
                <p className="text-sm text-muted-foreground">Try one of these questions:</p>
                <div className="flex flex-wrap gap-2">
                  {currentChips.map((chip) => (
                    <button
                      key={chip}
                      onClick={() => sendMessage(chip)}
                      className="text-xs bg-secondary border border-border rounded-full px-3 py-1.5 text-secondary-foreground hover:border-primary/40 hover:text-primary transition-colors"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg, i) => (
              <div key={i} className={cn("flex", msg.role === "user" ? "justify-end" : "justify-start")}>
                <div
                  className={cn(
                    "max-w-[80%] rounded-lg px-4 py-3 text-sm leading-relaxed",
                    msg.role === "user"
                      ? "bg-primary/15 text-foreground"
                      : "bg-card border border-border border-l-2 border-l-primary text-foreground"
                  )}
                >
                  {msg.role === "assistant" && msg.personaName && (
                    <div className="flex items-center gap-2 mb-2">
                      <AvatarCircle
                        initials={personas.find((p) => p.name === msg.personaName)?.initials ?? "?"}
                        size={24}
                      />
                      <span className="text-xs font-semibold text-primary italic">
                        {msg.personaName} says:
                      </span>
                    </div>
                  )}
                  <pre className="whitespace-pre-wrap font-sans">{msg.content}</pre>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-card border border-border rounded-lg px-4 py-3 border-l-2 border-l-primary">
                  <div className="flex gap-1.5">
                    <span className="h-2 w-2 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="h-2 w-2 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="h-2 w-2 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
          </div>

        </>
      )}
    </div>
  );
};

/* ── Sub-components ────────────────────────────────── */

function AvatarCircle({ initials, size = 40 }: { initials: string; size?: number }) {
  return (
    <div
      className="flex items-center justify-center rounded-full font-bold shrink-0"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.35,
        backgroundColor: "#1B2A4A",
        color: "#C9A84C",
      }}
    >
      {initials}
    </div>
  );
}

function PersonaCard({ persona, onSelect }: { persona: Persona; onSelect: () => void }) {
  return (
    <div className="bg-card border border-border rounded-lg p-4 flex flex-col gap-3 hover:border-primary/60 transition-colors group">
      <div className="flex items-center gap-3">
        <AvatarCircle initials={persona.initials} />
        <div>
          <h3 className="text-sm font-bold text-primary">{persona.name}</h3>
          <p className="text-[10px] text-muted-foreground">{persona.years}</p>
        </div>
      </div>
      <p className="text-xs text-muted-foreground leading-relaxed">{persona.philosophy}</p>
      <button
        onClick={onSelect}
        className="mt-auto text-xs border border-primary/50 text-primary rounded px-3 py-1.5 hover:bg-primary/10 transition-colors w-full"
      >
        Select
      </button>
    </div>
  );
}

/* ── Local response generator ─────────────────────── */

function generateLocalResponse(query: string, persona: Persona | null): string {
  const q = query.toLowerCase();

  // Persona-mode prefix
  const prefix = persona ? `*Speaking as ${persona.name}:*\n\n` : "";

  if (q.includes("regulatory") || q.includes("enforcement") || q.includes("sec") || q.includes("finra")) {
    const issues = managers.filter((m) => m.sec_enforcement !== "None" || m.finra_status !== "Clean" || m.adverse_media !== "None");
    if (issues.length === 0) return prefix + "No managers currently have regulatory issues on record.";
    return prefix + issues.map((m) => `• **${m.name}**\n  - SEC Enforcement: ${m.sec_enforcement}\n  - FINRA: ${m.finra_status}\n  - Adverse Media: ${m.adverse_media}`).join("\n\n");
  }

  if (q.includes("aum over") || q.includes("aum above")) {
    const threshold = parseFloat(q.match(/\d+/)?.[0] || "3");
    const result = managers.filter((m) => m.aum_bn > threshold);
    if (result.length === 0) return prefix + `No managers have AUM above $${threshold}B.`;
    return prefix + `Managers with AUM over $${threshold}B:\n\n` + result.map((m) => `• **${m.name}** — $${m.aum_bn}B (${m.strategy})`).join("\n");
  }

  if (q.includes("key person risk") || q.includes("key-person")) {
    const high = managers.filter((m) => m.key_person_risk === "High");
    return prefix + `Managers with **High** key person risk:\n\n` + high.map((m) => `• **${m.name}** — ${m.strategy}, AUM $${m.aum_bn}B, team size ${m.team_size}`).join("\n");
  }

  if (q.includes("decline") || q.includes("declining")) {
    const declining = managers.filter((m) => m.aum_trend === "Declining");
    return prefix + `Managers with declining AUM:\n\n` + declining.map((m) => `• **${m.name}** — $${m.aum_bn}B, Risk Score: ${m.risk_score}`).join("\n");
  }

  if (q.includes("biggest risk") || q.includes("highest risk") || q.includes("summarize")) {
    const worst = [...managers].sort((a, b) => b.risk_score - a.risk_score)[0];
    return prefix + `The highest-risk manager in your portfolio is **${worst.name}** with a risk score of **${worst.risk_score}/100**.\n\nKey concerns:\n• SEC enforcement: ${worst.sec_enforcement}\n• FINRA status: ${worst.finra_status}\n• Adverse media: ${worst.adverse_media}\n• Strategy drift: ${worst.strategy_drift ? "Detected" : "None"}\n• Key person risk: ${worst.key_person_risk}\n• AUM trend: ${worst.aum_trend}\n\nRecommendation: Immediate review and potential reallocation consideration.`;
  }

  const sorted = [...managers].sort((a, b) => b.risk_score - a.risk_score);
  return prefix + `Here's a summary of your portfolio:\n\n• **${managers.length}** managers monitored\n• Total AUM: $${managers.reduce((s, m) => s + m.aum_bn, 0).toFixed(1)}B\n• Highest risk: **${sorted[0].name}** (score: ${sorted[0].risk_score})\n• Lowest risk: **${sorted[sorted.length - 1].name}** (score: ${sorted[sorted.length - 1].risk_score})\n\nAsk me about specific managers, strategies, or risk factors for more detail.`;
}

export default AIAnalyst;
