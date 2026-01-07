import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  trend?: string;
  className?: string;
}

export function MetricCard({ title, value, icon, trend, className }: MetricCardProps) {
  return (
    <div className={cn(
      "p-6 rounded-xl border border-border/60 bg-white shadow-sm hover:shadow-md transition-all duration-300",
      className
    )}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{title}</h3>
        {icon && <div className="text-muted-foreground/80">{icon}</div>}
      </div>
      <div className="flex items-end gap-2">
        <span className="text-3xl font-semibold text-foreground font-mono">{value}</span>
        {trend && (
          <span className="text-xs font-medium text-green-600 mb-1 bg-green-50 px-1.5 py-0.5 rounded">
            {trend}
          </span>
        )}
      </div>
    </div>
  );
}
