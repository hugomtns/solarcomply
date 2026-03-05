import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface MetricCardProps {
  label: string;
  value: string | number;
  trend?: { value: number; label: string };
  icon?: ReactNode;
}

export function MetricCard({ label, value, trend, icon }: MetricCardProps) {
  return (
    <div className="rounded-2xl border border-gray-200/80 bg-white px-5 py-4 shadow-[0_1px_3px_0_rgb(0_0_0/0.04),0_1px_2px_-1px_rgb(0_0_0/0.04)] transition-shadow duration-200 hover:shadow-[0_4px_6px_-1px_rgb(0_0_0/0.07),0_2px_4px_-2px_rgb(0_0_0/0.05)]">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wider text-gray-400">{label}</p>
          <p className="mt-1 text-3xl font-bold text-[#1B2A4A]">{value}</p>
          {trend && (
            <div className="mt-1 flex items-center gap-1">
              {trend.value >= 0 ? (
                <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
              ) : (
                <TrendingDown className="h-3.5 w-3.5 text-red-500" />
              )}
              <span
                className={cn(
                  "text-xs font-medium",
                  trend.value >= 0 ? "text-emerald-600" : "text-red-600"
                )}
              >
                {trend.value > 0 ? "+" : ""}
                {trend.value}%
              </span>
              <span className="text-xs text-gray-400">{trend.label}</span>
            </div>
          )}
        </div>
        {icon && <div className="rounded-lg bg-gray-50 p-2 text-gray-400">{icon}</div>}
      </div>
    </div>
  );
}
