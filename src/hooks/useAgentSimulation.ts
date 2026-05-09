import { useCallback, useEffect, useRef, useState } from "react";

export type AgentLogLine = {
  type: "info" | "ok" | "warn" | "err";
  tag: string;
  message: string;
};

export type DisplayedLogLine = AgentLogLine & { ts: string };

export type UseAgentSimulationOptions = {
  agentKey: string;
  logSequence: AgentLogLine[];
  intervalMs?: number;
  onComplete?: () => void;
  flashElementIds?: string[];
};

function fmtTime(d = new Date()) {
  return d.toLocaleTimeString("en-US", { hour12: false });
}

function fmtShort(d = new Date()) {
  return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false });
}

/**
 * Centralized streaming-agent log simulator.
 * - Streams the provided log sequence at intervalMs cadence.
 * - On completion: fires onComplete, flashes DOM elements, swaps button labels,
 *   and broadcasts an `agent-complete` window event so the global activity feed
 *   can prepend a new entry.
 */
export function useAgentSimulation(opts: UseAgentSimulationOptions) {
  const { agentKey, logSequence, intervalMs = 280, onComplete, flashElementIds } = opts;

  const [isRunning, setIsRunning] = useState(false);
  const [currentLogs, setCurrentLogs] = useState<DisplayedLogLine[]>([]);
  const [isLogOpen, setIsLogOpen] = useState(false);

  const runningRef = useRef(false);
  const timeoutsRef = useRef<number[]>([]);

  const clearAll = () => {
    timeoutsRef.current.forEach((t) => window.clearTimeout(t));
    timeoutsRef.current = [];
  };

  useEffect(() => () => clearAll(), []);

  const reset = useCallback(() => {
    clearAll();
    runningRef.current = false;
    setIsRunning(false);
    setCurrentLogs([]);
    setIsLogOpen(false);
  }, []);

  const run = useCallback(() => {
    if (runningRef.current) return;
    runningRef.current = true;
    setIsRunning(true);
    setIsLogOpen(true);
    setCurrentLogs([]);

    logSequence.forEach((line, i) => {
      const t = window.setTimeout(() => {
        setCurrentLogs((prev) => [...prev, { ...line, ts: fmtTime() }]);

        if (i !== logSequence.length - 1) return;

        runningRef.current = false;
        setIsRunning(false);

        try { onComplete?.(); } catch { /* swallow */ }

        // Flash DOM nodes + swap button labels
        const updatedLabel = `✓ Updated · ${fmtShort()}`;
        flashElementIds?.forEach((id) => {
          const el = document.getElementById(id);
          if (!el) return;
          el.classList.add("flash");
          window.setTimeout(() => el.classList.remove("flash"), 1500);

          if (el.tagName === "BUTTON") {
            const original = el.dataset.originalLabel ?? el.textContent ?? "";
            el.dataset.originalLabel = original;
            el.textContent = updatedLabel;
            window.setTimeout(() => {
              if (el.textContent === updatedLabel) el.textContent = original;
            }, 4000);
          }
        });

        // Broadcast for the global activity feed
        window.dispatchEvent(
          new CustomEvent("agent-complete", { detail: { agent_key: agentKey } }),
        );
      }, intervalMs * (i + 1));
      timeoutsRef.current.push(t);
    });
  }, [agentKey, logSequence, intervalMs, onComplete, flashElementIds]);

  return { isRunning, currentLogs, isLogOpen, run, reset };
}