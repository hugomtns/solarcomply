import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface MetricCardProps {
  label: string;
  value: string | number;
  trend?: { value: number; label: string };
  icon?: ReactNode;
  accentColor?: string;
}

const accentColors: Record<string, { gradient: string; glow: string; iconBg: string }> = {
  blue: {
    gradient: "from-palette-blue-500 to-palette-blue-400",
    glow: "shadow-[0_0_20px_rgba(59,130,246,0.15)]",
    iconBg: "bg-status-info/15 text-palette-blue-400",
  },
  teal: {
    gradient: "from-primary to-palette-teal-400",
    glow: "shadow-[0_0_20px_rgba(6,214,160,0.15)]",
    iconBg: "bg-primary/15 text-primary",
  },
  amber: {
    gradient: "from-status-warning to-status-warning-light",
    glow: "shadow-[0_0_20px_rgba(245,158,11,0.15)]",
    iconBg: "bg-status-warning/15 text-status-warning-light",
  },
  orange: {
    gradient: "from-palette-orange-500 to-[#FB923C]",
    glow: "shadow-[0_0_20px_rgba(249,115,22,0.15)]",
    iconBg: "bg-palette-orange-500/15 text-[#FB923C]",
  },
  purple: {
    gradient: "from-palette-purple-500 to-palette-purple-400",
    glow: "shadow-[0_0_20px_rgba(139,92,246,0.15)]",
    iconBg: "bg-status-special/15 text-palette-purple-400",
  },
};

export function MetricCard({ label, value, trend, icon, accentColor = "blue" }: MetricCardProps) {
  const accent = accentColors[accentColor] || accentColors.blue;

  return (
    <div className={cn(
      "relative overflow-hidden rounded-2xl",
      "bg-gradient-to-br from-surface-glass-hover to-white/[0.02]",
      "backdrop-blur-xl",
      "border border-white/[0.06]",
      "shadow-[0_2px_8px_-2px_rgba(0,0,0,0.4)]",
      "transition-all duration-300",
      "hover:border-white/[0.10]",
      `hover:${accent.glow}`
    )}>
      {/* Top gradient accent line */}
      <div className={`h-[2px] w-full bg-gradient-to-r ${accent.gradient}`} />
      <div className="px-5 py-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-text-muted">{label}</p>
            <p className="mt-1.5 text-3xl font-bold font-display text-white">{value}</p>
            {trend && (
              <div className="mt-1.5 flex items-center gap-1">
                {trend.value >= 0 ? (
                  <TrendingUp className="h-3.5 w-3.5 text-primary" />
                ) : (
                  <TrendingDown className="h-3.5 w-3.5 text-palette-red-400" />
                )}
                <span
                  className={cn(
                    "text-xs font-medium",
                    trend.value >= 0 ? "text-primary" : "text-palette-red-400"
                  )}
                >
                  {trend.value > 0 ? "+" : ""}
                  {trend.value}%
                </span>
                <span className="text-xs text-text-muted">{trend.label}</span>
              </div>
            )}
          </div>
          {icon && (
            <div className={cn("rounded-xl p-2.5", accent.iconBg)}>
              {icon}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
