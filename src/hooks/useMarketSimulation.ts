import { useState, useEffect, useRef, useCallback } from "react";

type SimValue = {
  current: number;
  base: number;
  lastDir: 1 | -1;
  nextTick: number; // ms timestamp of next update
};

type SimState = Record<string, SimValue>;

function randomBetween(a: number, b: number) {
  return a + Math.random() * (b - a);
}

function getMoveMagnitude(): number {
  const r = Math.random();
  if (r < 0.70) return randomBetween(0.0005, 0.004);   // small
  if (r < 0.95) return randomBetween(0.004, 0.01);      // medium
  return randomBetween(0.01, 0.02);                      // large
}

function tickValue(v: SimValue, maxDriftPct: number): SimValue {
  const mag = getMoveMagnitude();
  // momentum: 55% chance of same direction
  let dir: 1 | -1 = Math.random() < 0.55 ? v.lastDir : (v.lastDir === 1 ? -1 : 1);

  // mean-revert at boundary
  const drift = (v.current - v.base) / v.base;
  if (drift >= maxDriftPct) dir = -1;
  else if (drift <= -maxDriftPct) dir = 1;

  const newVal = v.current * (1 + dir * mag);
  return {
    ...v,
    current: newVal,
    lastDir: dir,
    nextTick: Date.now() + randomBetween(4000, 12000),
  };
}

export function useMarketSimulation(initialValues: Record<string, number>, maxDriftPct = 0.08) {
  const [liveValues, setLiveValues] = useState<Record<string, number>>(() => {
    const out: Record<string, number> = {};
    for (const k in initialValues) out[k] = initialValues[k];
    return out;
  });
  const [isLive, setIsLive] = useState(true);
  const stateRef = useRef<SimState>({});
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // init sim state
  useEffect(() => {
    const s: SimState = {};
    const now = Date.now();
    for (const k in initialValues) {
      s[k] = {
        current: initialValues[k],
        base: initialValues[k],
        lastDir: Math.random() < 0.5 ? 1 : -1,
        nextTick: now + randomBetween(1000, 6000),
      };
    }
    stateRef.current = s;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isLive) {
      if (timerRef.current) clearTimeout(timerRef.current);
      return;
    }

    function loop() {
      const now = Date.now();
      const state = stateRef.current;
      const keys = Object.keys(state);
      // find values due for update
      const due = keys.filter(k => now >= state[k].nextTick);
      // pick 2-5 random from due (or all if fewer)
      const count = Math.min(due.length, Math.floor(randomBetween(2, 6)));
      const shuffled = due.sort(() => Math.random() - 0.5).slice(0, count);

      if (shuffled.length > 0) {
        const updates: Record<string, number> = {};
        for (const k of shuffled) {
          state[k] = tickValue(state[k], maxDriftPct);
          updates[k] = state[k].current;
        }
        setLiveValues(prev => ({ ...prev, ...updates }));
      }

      timerRef.current = setTimeout(loop, 500);
    }

    loop();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isLive, maxDriftPct]);

  const toggleLive = useCallback(() => setIsLive(v => !v), []);

  return { liveValues, isLive, toggleLive };
}