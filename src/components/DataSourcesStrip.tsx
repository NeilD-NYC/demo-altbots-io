import { useEffect, useRef, useState } from "react";

const DataSourcesStrip = () => {
  const [open, setOpen] = useState(false);
  const [live, setLive] = useState(true);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div className="h-7 border-b border-border bg-[#0B0F14] flex items-center justify-between px-6 text-[11px] text-muted-foreground">
      <div className="flex items-center gap-2 overflow-hidden whitespace-nowrap">
        <span className="text-[#C9A84C] font-bold uppercase tracking-wider">DATA SOURCES:</span>
        <span>SEC EDGAR <span className="text-[#22C55E]">✅</span> April 8, 2026</span>
        <span className="text-[#30363D]">|</span>
        <span>Fund Admin Feeds <span className="text-[#22C55E]">✅</span> April 8, 2026</span>
        <span className="text-[#30363D]">|</span>
        <span>Market Data <span className="text-[#22C55E]">✅</span> Real-time</span>
        <span className="text-[#30363D]">|</span>
        <div ref={wrapRef} className="relative">
          <button
            onClick={() => setOpen((v) => !v)}
            className="flex items-center gap-1 hover:opacity-80 focus:outline-none"
          >
            <span>Manual Inputs</span>
            <span className="text-[#C9A84C]">⚠️</span>
            <span className="text-[#F59E0B] font-semibold">2 Pending</span>
          </button>
          {open && (
            <div className="absolute left-0 top-full mt-1 z-50 w-80 bg-[#161B22] border border-[#30363D] border-l-2 border-l-[#C9A84C] rounded shadow-lg p-3 text-xs text-foreground">
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">Pending Manual Inputs</p>
              <ul className="space-y-1.5">
                <li>Helix Credit Fund Admin — Q1 2026 NAV unconfirmed</li>
                <li>Vega Special Sits — March statement not received</li>
              </ul>
            </div>
          )}
        </div>
        <span className="text-[#30363D]">|</span>
        <span>
          Quality Checks: <span className="text-[#22C55E]/80">847 passed</span>{" "}
          <span className="text-muted-foreground">·</span>{" "}
          <span className="text-muted-foreground">0 failed</span>
        </span>
      </div>
      <button
        onClick={() => setLive((v) => !v)}
        title={live ? "Click to pause real-time updates" : "Click to resume real-time updates"}
        className="flex items-center gap-1.5 pl-3 focus:outline-none hover:opacity-80"
      >
        <span className="relative flex h-2 w-2">
          {live && (
            <span className="animate-pulse-dot absolute inline-flex h-full w-full rounded-full bg-[#22C55E] opacity-75" />
          )}
          <span
            className={`relative inline-flex rounded-full h-2 w-2 ${live ? "bg-[#22C55E]" : "bg-muted-foreground"}`}
          />
        </span>
        <span
          className={`font-semibold tracking-wider text-[10px] ${live ? "text-[#22C55E]" : "text-muted-foreground"}`}
        >
          {live ? "LIVE" : "PAUSED"}
        </span>
      </button>
    </div>
  );
};

export default DataSourcesStrip;