import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type StatusType = "success" | "warning" | "error" | "info" | "neutral";

interface StatusBadgeProps {
  children: React.ReactNode;
  variant?: StatusType;
  className?: string;
}

const variantStyles: Record<StatusType, string> = {
  success: "bg-green-100 text-green-800 hover:bg-green-200 border-green-200",
  warning: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-yellow-200",
  error: "bg-red-100 text-red-800 hover:bg-red-200 border-red-200",
  info: "bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-200",
  neutral: "bg-gray-100 text-gray-800 hover:bg-gray-200 border-gray-200",
};

export const StatusBadge = ({ children, variant = "neutral", className }: StatusBadgeProps) => {
  return (
    <Badge 
      variant="outline" 
      className={cn("font-medium border px-2.5 py-0.5", variantStyles[variant], className)}
    >
      {children}
    </Badge>
  );
};