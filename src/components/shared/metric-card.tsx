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
    gradient: "from-[#3B82F6] to-[#60A5FA]",
    glow: "shadow-[0_0_20px_rgba(59,130,246,0.15)]",
    iconBg: "bg-[#3B82F6]/15 text-[#60A5FA]",
  },
  teal: {
    gradient: "from-[#06D6A0] to-[#34D399]",
    glow: "shadow-[0_0_20px_rgba(6,214,160,0.15)]",
    iconBg: "bg-[#06D6A0]/15 text-[#06D6A0]",
  },
  amber: {
    gradient: "from-[#F59E0B] to-[#FBBF24]",
    glow: "shadow-[0_0_20px_rgba(245,158,11,0.15)]",
    iconBg: "bg-[#F59E0B]/15 text-[#FBBF24]",
  },
  orange: {
    gradient: "from-[#F97316] to-[#FB923C]",
    glow: "shadow-[0_0_20px_rgba(249,115,22,0.15)]",
    iconBg: "bg-[#F97316]/15 text-[#FB923C]",
  },
  purple: {
    gradient: "from-[#8B5CF6] to-[#A78BFA]",
    glow: "shadow-[0_0_20px_rgba(139,92,246,0.15)]",
    iconBg: "bg-[#8B5CF6]/15 text-[#A78BFA]",
  },
};

export function MetricCard({ label, value, trend, icon, accentColor = "blue" }: MetricCardProps) {
  const accent = accentColors[accentColor] || accentColors.blue;

  return (
    <div className={cn(
      "relative overflow-hidden rounded-2xl",
      "bg-gradient-to-br from-white/[0.07] to-white/[0.02]",
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
            <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-slate-500">{label}</p>
            <p className="mt-1.5 text-3xl font-bold text-white" style={{ fontFamily: 'var(--font-heading)' }}>{value}</p>
            {trend && (
              <div className="mt-1.5 flex items-center gap-1">
                {trend.value >= 0 ? (
                  <TrendingUp className="h-3.5 w-3.5 text-[#06D6A0]" />
                ) : (
                  <TrendingDown className="h-3.5 w-3.5 text-red-400" />
                )}
                <span
                  className={cn(
                    "text-xs font-medium",
                    trend.value >= 0 ? "text-[#06D6A0]" : "text-red-400"
                  )}
                >
                  {trend.value > 0 ? "+" : ""}
                  {trend.value}%
                </span>
                <span className="text-xs text-slate-500">{trend.label}</span>
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
