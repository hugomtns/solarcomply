"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ComplianceScoreRing } from "@/components/shared/compliance-score-ring";
import { generateScadaData } from "@/data/scada";
import { cn } from "@/lib/utils";

const SENSOR_TYPES = [
  { name: "Pyranometer", status: "green" as const },
  { name: "Ambient Temp", status: "green" as const },
  { name: "Module Temp", status: "green" as const },
  { name: "Wind Sensor", status: "amber" as const },
  { name: "Grid Meter", status: "green" as const },
  { name: "String Monitor", status: "red" as const },
];

const DATA_GAPS = [
  { sensor: "Weather Station", start: "Mar 02, 14:22", end: "14:37", duration: "15 min" },
  { sensor: "Weather Station", start: "Mar 02, 08:11", end: "08:19", duration: "8 min" },
  { sensor: "Weather Station", start: "Mar 01, 23:45", end: "23:58", duration: "13 min" },
  { sensor: "String Monitor #14", start: "Mar 01, 11:02", end: "11:45", duration: "43 min" },
];

export function DataQualityCard() {
  const { completeness, qualityCounts } = useMemo(() => {
    const data = generateScadaData("data_completeness", 7);
    const latest = data[data.length - 1];
    const completenessPercent = parseFloat((latest.value * 100).toFixed(2));

    // Count quality flags across all recent data points
    let good = 0;
    let suspect = 0;
    let bad = 0;
    // Sample across multiple metrics for realistic counts
    const prData = generateScadaData("performance_ratio", 1);
    const irData = generateScadaData("irradiance", 1);
    const allPoints = [...prData, ...irData, ...data.slice(-96)];
    for (const pt of allPoints) {
      if (pt.quality === "good") good++;
      else if (pt.quality === "suspect") suspect++;
      else bad++;
    }

    return {
      completeness: completenessPercent,
      qualityCounts: { good, suspect, bad, total: good + suspect + bad },
    };
  }, []);

  const ringScore = Math.round(completeness);
  const meetsTarget = completeness >= 99;

  const statusDot = {
    green: "bg-emerald-500",
    amber: "bg-amber-500",
    red: "bg-red-500",
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Data Quality</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Completeness gauge */}
        <div className="flex items-center gap-5">
          <ComplianceScoreRing score={ringScore} size="lg" />
          <div>
            <p className="text-2xl font-bold text-[#1B2A4A]">{completeness}%</p>
            <p className="text-xs text-gray-500">Data Completeness</p>
            <p
              className={cn(
                "mt-1 text-xs font-medium",
                meetsTarget ? "text-emerald-600" : "text-red-600"
              )}
            >
              {meetsTarget ? "Meets" : "Below"} 99% target
            </p>
          </div>
        </div>

        {/* Signal quality breakdown */}
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
            Signal Quality
          </p>
          <div className="grid grid-cols-3 gap-2">
            <div className="rounded-md border border-emerald-200 bg-emerald-50/50 px-3 py-2 text-center">
              <p className="text-lg font-bold text-emerald-700">
                {qualityCounts.good.toLocaleString()}
              </p>
              <p className="text-[10px] text-emerald-600">Good</p>
            </div>
            <div className="rounded-md border border-amber-200 bg-amber-50/50 px-3 py-2 text-center">
              <p className="text-lg font-bold text-amber-700">
                {qualityCounts.suspect.toLocaleString()}
              </p>
              <p className="text-[10px] text-amber-600">Suspect</p>
            </div>
            <div className="rounded-md border border-red-200 bg-red-50/50 px-3 py-2 text-center">
              <p className="text-lg font-bold text-red-700">
                {qualityCounts.bad.toLocaleString()}
              </p>
              <p className="text-[10px] text-red-600">Bad</p>
            </div>
          </div>
        </div>

        {/* Gap detection */}
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
            Recent Gaps
          </p>
          <div className="space-y-1.5">
            {DATA_GAPS.map((gap, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-md border px-3 py-1.5 text-xs"
              >
                <div>
                  <span className="font-medium text-[#1B2A4A]">{gap.sensor}</span>
                  <span className="mx-1.5 text-gray-300">|</span>
                  <span className="text-gray-500">
                    {gap.start} — {gap.end}
                  </span>
                </div>
                <span className="font-medium text-amber-600">{gap.duration}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Sensor health */}
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
            Sensor Health
          </p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
            {SENSOR_TYPES.map((s) => (
              <div key={s.name} className="flex items-center gap-2">
                <div className={cn("h-2 w-2 rounded-full", statusDot[s.status])} />
                <span className="text-xs text-gray-600">{s.name}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
