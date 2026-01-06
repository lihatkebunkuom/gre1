import { ReactNode } from "react";
import { FolderOpen } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
}

export const EmptyState = ({
  title = "Tidak ada data",
  description = "Belum ada data yang tersedia untuk ditampilkan saat ini.",
  icon,
  action,
  className,
}: EmptyStateProps) => {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center p-8 text-center min-h-[300px] border-2 border-dashed rounded-lg bg-muted/10",
      className
    )}>
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
        {icon || <FolderOpen className="h-10 w-10 text-muted-foreground" />}
      </div>
      <h3 className="mt-4 text-lg font-semibold">{title}</h3>
      <p className="mb-4 mt-2 text-sm text-muted-foreground max-w-sm">
        {description}
      </p>
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
};