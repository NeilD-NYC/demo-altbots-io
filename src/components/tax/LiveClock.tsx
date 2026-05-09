import { useEffect, useState } from "react";

function formatNow() {
  return new Date().toLocaleTimeString("en-US", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZone: "America/New_York",
  });
}

export default function LiveClock() {
  const [t, setT] = useState(formatNow);
  useEffect(() => {
    const id = setInterval(() => setT(formatNow()), 1000);
    return () => clearInterval(id);
  }, []);
  return <span>{t} ET</span>;
}
