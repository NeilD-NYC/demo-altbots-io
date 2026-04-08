import { useState, useRef, useEffect } from "react";
import { Bot, Send } from "lucide-react";
import { managers } from "@/data/managers";
import { cn } from "@/lib/utils";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const exampleChips = [
  "Which managers have regulatory issues?",
  "Show me all managers with AUM over $3B",
  "Who has high key person risk?",
  "Which managers are seeing AUM declines?",
  "Summarize the biggest risk in my portfolio",
];

const systemPrompt = `You are AltBots AI Analyst, an institutional due diligence assistant. You have access to the following portfolio data: ${JSON.stringify(managers)}. Answer questions about these managers concisely and professionally. Always reference specific manager names and data points. Never make up data not in the dataset. Format responses cleanly with bullet points where appropriate.`;

const AIAnalyst = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMsg: Message = { role: "user", content: text.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    // Simple local response since no API is connected
    const response = generateLocalResponse(text.trim());
    setTimeout(() => {
      setMessages((prev) => [...prev, { role: "assistant", content: response }]);
      setIsLoading(false);
    }, 800);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)] max-w-[900px] mx-auto">
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex items-center gap-3 mb-1">
          <div className="p-2 rounded-lg bg-primary/10">
            <Bot className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">AltBots AI Analyst</h2>
            <p className="text-xs text-muted-foreground">Ask me anything about your portfolio managers</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 space-y-4 scrollbar-thin">
        {messages.length === 0 && (
          <div className="space-y-3 pt-4">
            <p className="text-sm text-muted-foreground">Try one of these questions:</p>
            <div className="flex flex-wrap gap-2">
              {exampleChips.map((chip) => (
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

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-6 pt-4">
        <div className="flex gap-2">
          <input
            className="flex-1 bg-secondary border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            placeholder="Ask about your portfolio managers…"
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
    </div>
  );
};

// Local response generator based on the data
function generateLocalResponse(query: string): string {
  const q = query.toLowerCase();

  if (q.includes("regulatory") || q.includes("enforcement") || q.includes("sec") || q.includes("finra")) {
    const issues = managers.filter((m) => m.sec_enforcement !== "None" || m.finra_status !== "Clean" || m.adverse_media !== "None");
    if (issues.length === 0) return "No managers currently have regulatory issues on record.";
    return issues.map((m) => `• **${m.name}**\n  - SEC Enforcement: ${m.sec_enforcement}\n  - FINRA: ${m.finra_status}\n  - Adverse Media: ${m.adverse_media}`).join("\n\n");
  }

  if (q.includes("aum over") || q.includes("aum above")) {
    const threshold = parseFloat(q.match(/\d+/)?.[0] || "3");
    const result = managers.filter((m) => m.aum_bn > threshold);
    if (result.length === 0) return `No managers have AUM above $${threshold}B.`;
    return `Managers with AUM over $${threshold}B:\n\n` + result.map((m) => `• **${m.name}** — $${m.aum_bn}B (${m.strategy})`).join("\n");
  }

  if (q.includes("key person risk") || q.includes("key-person")) {
    const high = managers.filter((m) => m.key_person_risk === "High");
    return `Managers with **High** key person risk:\n\n` + high.map((m) => `• **${m.name}** — ${m.strategy}, AUM $${m.aum_bn}B, team size ${m.team_size}`).join("\n");
  }

  if (q.includes("decline") || q.includes("declining")) {
    const declining = managers.filter((m) => m.aum_trend === "Declining");
    return `Managers with declining AUM:\n\n` + declining.map((m) => `• **${m.name}** — $${m.aum_bn}B, Risk Score: ${m.risk_score}`).join("\n");
  }

  if (q.includes("biggest risk") || q.includes("highest risk") || q.includes("summarize")) {
    const worst = [...managers].sort((a, b) => b.risk_score - a.risk_score)[0];
    return `The highest-risk manager in your portfolio is **${worst.name}** with a risk score of **${worst.risk_score}/100**.\n\nKey concerns:\n• SEC enforcement: ${worst.sec_enforcement}\n• FINRA status: ${worst.finra_status}\n• Adverse media: ${worst.adverse_media}\n• Strategy drift: ${worst.strategy_drift ? "Detected" : "None"}\n• Key person risk: ${worst.key_person_risk}\n• AUM trend: ${worst.aum_trend}\n\nRecommendation: Immediate review and potential reallocation consideration.`;
  }

  // Generic fallback
  const sorted = [...managers].sort((a, b) => b.risk_score - a.risk_score);
  return `Here's a summary of your portfolio:\n\n• **${managers.length}** managers monitored\n• Total AUM: $${managers.reduce((s, m) => s + m.aum_bn, 0).toFixed(1)}B\n• Highest risk: **${sorted[0].name}** (score: ${sorted[0].risk_score})\n• Lowest risk: **${sorted[sorted.length - 1].name}** (score: ${sorted[sorted.length - 1].risk_score})\n\nAsk me about specific managers, strategies, or risk factors for more detail.`;
}

export default AIAnalyst;
