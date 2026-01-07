import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  className?: string;
  size?: number;
  text?: string;
}

export const LoadingSpinner = ({ className, size = 24, text }: LoadingSpinnerProps) => {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-2", className)}>
      <Loader2 className="animate-spin text-primary" size={size} />
      {text && <span className="text-sm text-muted-foreground">{text}</span>}
    </div>
  );
};

export const FullPageLoader = () => (
  <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
    <LoadingSpinner size={48} text="Memuat aplikasi..." />
  </div>
);