import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

const AlertBanner = () => {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const showTimer = setTimeout(() => setVisible(true), 300);
    const hideTimer = setTimeout(() => setDismissed(true), 6300);
    return () => { clearTimeout(showTimer); clearTimeout(hideTimer); };
  }, []);

  if (dismissed) return null;

  const handleClick = () => {
    setDismissed(true);
    navigate("/manager/4");
  };

  return (
    <div
      onClick={handleClick}
      className={cn(
        "w-full bg-destructive cursor-pointer text-destructive-foreground text-sm font-medium text-center px-4 py-2.5 transition-all duration-500 ease-out overflow-hidden",
        visible ? "max-h-12 opacity-100" : "max-h-0 opacity-0"
      )}
    >
      <span className="animate-pulse-dot inline-block">⚠</span>
      {" "}ACTIVE ALERT: Helix Credit Opportunities — Regulatory risk escalated. Click to review.
    </div>
  );
};

export default AlertBanner;
