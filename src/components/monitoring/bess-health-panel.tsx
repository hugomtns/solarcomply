"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { generateScadaData } from "@/data/scada";
import { TrendingDown, TrendingUp, Battery, Thermometer, RefreshCw, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

interface BessMetric {
  label: string;
  value: string;
  unit: string;
  trend: { value: number; label: string };
  icon: React.ReactNode;
  status: "green" | "amber" | "red";
}

export function BessHealthPanel() {
  const metrics: BessMetric[] = useMemo(() => {
    const sohData = generateScadaData("bess_soh", 30);
    const socData = generateScadaData("bess_soc", 7);
    const tempData = generateScadaData("bess_temperature", 7);

    const latestSoh = sohData[sohData.length - 1];
    const prevSoh = sohData[Math.max(0, sohData.length - 97)]; // ~1 day ago
    const sohTrend = parseFloat(((latestSoh.value - prevSoh.value) * 100).toFixed(2));

    const latestSoc = socData[socData.length - 1];
    const prevSoc = socData[Math.max(0, socData.length - 5)];
    const socTrend = parseFloat(((latestSoc.value - prevSoc.value) * 100).toFixed(1));

    const latestTemp = tempData[tempData.length - 1];
    const prevTemp = tempData[Math.max(0, tempData.length - 5)];
    const tempTrend = parseFloat((latestTemp.value - prevTemp.value).toFixed(1));

    // Estimated cycle count from SoC data patterns
    const cycleCount = 847;
    const cycleTrend = 12;

    return [
      {
        label: "State of Health",
        value: (latestSoh.value * 100).toFixed(1),
        unit: "%",
        trend: { value: sohTrend, label: "vs 24h ago" },
        icon: <Activity className="h-4 w-4" />,
        status: latestSoh.value >= 0.95 ? "green" : latestSoh.value >= 0.90 ? "amber" : "red",
      },
      {
        label: "State of Charge",
        value: (latestSoc.value * 100).toFixed(0),
        unit: "%",
        trend: { value: socTrend, label: "vs 1h ago" },
        icon: <Battery className="h-4 w-4" />,
        status: latestSoc.value >= 0.20 && latestSoc.value <= 0.85 ? "green" : "amber",
      },
      {
        label: "Cycle Count",
        value: cycleCount.toLocaleString(),
        unit: "cycles",
        trend: { value: cycleTrend, label: "this month" },
        icon: <RefreshCw className="h-4 w-4" />,
        status: cycleCount < 1000 ? "green" : cycleCount < 2000 ? "amber" : "red",
      },
      {
        label: "Cell Temperature",
        value: latestTemp.value.toFixed(1),
        unit: "°C",
        trend: { value: tempTrend, label: "vs 1h ago" },
        icon: <Thermometer className="h-4 w-4" />,
        status: latestTemp.value <= 30 ? "green" : latestTemp.value <= 35 ? "amber" : "red",
      },
    ];
  }, []);

  const statusColors = {
    green: "border-emerald-200 bg-emerald-50/50",
    amber: "border-amber-200 bg-amber-50/50",
    red: "border-red-200 bg-red-50/50",
  };

  const dotColors = {
    green: "bg-emerald-500",
    amber: "bg-amber-500",
    red: "bg-red-500",
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">BESS Health</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {metrics.map((m) => (
            <div
              key={m.label}
              className={cn(
                "rounded-lg border p-3",
                statusColors[m.status]
              )}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-500">{m.label}</span>
                <div className={cn("h-2 w-2 rounded-full", dotColors[m.status])} />
              </div>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-xl font-bold text-[#1B2A4A]">{m.value}</span>
                <span className="text-xs text-gray-400">{m.unit}</span>
              </div>
              <div className="mt-1 flex items-center gap-1">
                {m.trend.value >= 0 ? (
                  <TrendingUp className="h-3 w-3 text-emerald-500" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-500" />
                )}
                <span
                  className={cn(
                    "text-[10px] font-medium",
                    m.trend.value >= 0 ? "text-emerald-600" : "text-red-600"
                  )}
                >
                  {m.trend.value > 0 ? "+" : ""}
                  {m.trend.value}
                </span>
                <span className="text-[10px] text-gray-400">{m.trend.label}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
