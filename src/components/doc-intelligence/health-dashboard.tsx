"use client";

import { ProjectDocHealthScore } from "@/lib/types";
import { ComplianceScoreRing } from "@/components/shared/compliance-score-ring";
import { MetricCard } from "@/components/shared/metric-card";
import { Card } from "@/components/ui/card";
import { FileCheck, GitCompare, FileType, AlertTriangle } from "lucide-react";

interface HealthDashboardProps {
  healthScore: ProjectDocHealthScore;
}

const SEVERITY_CONFIG = {
  critical: { label: "Critical", color: "#EF4444" },
  high: { label: "High", color: "#ED7D31" },
  medium: { label: "Medium", color: "#F59E0B" },
  low: { label: "Low", color: "#2E75B6" },
} as const;

export function HealthDashboard({ healthScore }: HealthDashboardProps) {
  const totalFindings = Object.values(healthScore.findingCounts).reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-4">
        <Card className="flex items-center gap-4 px-5 py-4">
          <ComplianceScoreRing score={healthScore.overallScore} size="lg" />
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Overall Health
            </p>
            <p className="mt-1 text-sm text-slate-400">
              {healthScore.overallScore >= 80
                ? "Good standing"
                : healthScore.overallScore >= 60
                  ? "Needs attention"
                  : "Action required"}
            </p>
          </div>
        </Card>
        <MetricCard
          label="Completeness"
          value={`${healthScore.completenessScore}%`}
          icon={<FileCheck className="h-5 w-5" />}
        />
        <MetricCard
          label="Consistency"
          value={`${healthScore.consistencyScore}%`}
          icon={<GitCompare className="h-5 w-5" />}
        />
        <MetricCard
          label="Format Compliance"
          value={`${healthScore.formatComplianceScore}%`}
          icon={<FileType className="h-5 w-5" />}
        />
      </div>

      <Card className="px-5 py-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-slate-500" />
            <p className="text-sm font-medium text-white">Findings Breakdown</p>
          </div>
          <p className="text-sm text-slate-400">{totalFindings} total findings</p>
        </div>
        <div className="flex h-3 overflow-hidden rounded-full bg-white/[0.06]">
          {(["critical", "high", "medium", "low"] as const).map((severity) => {
            const count = healthScore.findingCounts[severity];
            if (count === 0) return null;
            const pct = (count / totalFindings) * 100;
            return (
              <div
                key={severity}
                className="transition-all duration-500"
                style={{
                  width: `${pct}%`,
                  backgroundColor: SEVERITY_CONFIG[severity].color,
                }}
              />
            );
          })}
        </div>
        <div className="mt-2 flex gap-4">
          {(["critical", "high", "medium", "low"] as const).map((severity) => (
            <div key={severity} className="flex items-center gap-1.5 text-xs text-slate-400">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: SEVERITY_CONFIG[severity].color }}
              />
              {SEVERITY_CONFIG[severity].label}: {healthScore.findingCounts[severity]}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
