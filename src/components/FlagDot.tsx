import { cn } from "@/lib/utils";

interface FlagDotProps {
  flag: "green" | "yellow" | "red";
  size?: "sm" | "md";
}

const FlagDot = ({ flag, size = "md" }: FlagDotProps) => {
  const sizeClass = size === "sm" ? "h-2.5 w-2.5" : "h-3 w-3";
  return (
    <span
      className={cn(
        "inline-block rounded-full",
        sizeClass,
        flag === "green" && "bg-success",
        flag === "yellow" && "bg-warning",
        flag === "red" && "bg-destructive"
      )}
    />
  );
};

export default FlagDot;
