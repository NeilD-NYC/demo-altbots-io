import { cn } from "@/lib/utils";

const RiskScoreBadge = ({ score }: { score: number }) => {
  return (
    <span
      className={cn(
        "font-semibold tabular-nums",
        score < 30 && "text-success",
        score >= 30 && score <= 50 && "text-warning",
        score > 50 && "text-destructive"
      )}
    >
      {score}
    </span>
  );
};

export default RiskScoreBadge;
