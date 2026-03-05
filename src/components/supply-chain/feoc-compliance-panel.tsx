"use client";

import { Project } from "@/lib/types";
import { getFEOCAssessment } from "@/data/supply-chain";
import { MetricCard } from "@/components/shared/metric-card";
import { EmptyState } from "@/components/shared/empty-state";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ShieldCheck, ShieldAlert, AlertTriangle, Flag, Timer, DollarSign, Calendar } from "lucide-react";
import { COLORS } from "@/lib/constants";

interface FEOCCompliancePanelProps {
  project: Project;
}

export function FEOCCompliancePanel({ project }: FEOCCompliancePanelProps) {
  const isUS = project.jurisdictions.includes("US");

  if (!isUS) {
    return (
      <EmptyState
        icon={<ShieldCheck className="h-12 w-12" />}
        message="FEOC compliance is only applicable to US-jurisdiction projects."
      />
    );
  }

  const assessment = getFEOCAssessment(project.id);

  if (!assessment) {
    return (
      <EmptyState
        icon={<ShieldCheck className="h-12 w-12" />}
        message="No FEOC assessment data available for this project."
      />
    );
  }

  const passingCount = assessment.categoryAssessments.filter((c) => c.passing).length;
  const totalCount = assessment.categoryAssessments.length;
  const allSuppliers = assessment.categoryAssessments.flatMap((c) => c.flaggedSuppliers);

  const daysUntilSafeHarbor = assessment.bocDate
    ? Math.max(0, Math.floor((new Date("2025-01-01").getTime() - new Date(assessment.bocDate).getTime()) / (1000 * 60 * 60 * 24)))
    : null;

  return (
    <div className="space-y-6">
      {/* Safe Harbor Banner */}
      {assessment.safeHarborApplies ? (
        <Alert className="border-blue-200 bg-blue-50">
          <Timer className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            <strong>Safe Harbor Active</strong> — This project qualifies for safe harbor provisions under the OBBBA final rule (BOC before Jan 1, 2025).
          </AlertDescription>
        </Alert>
      ) : (
        <Alert className="border-amber-200 bg-amber-50">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800">
            <strong>Safe Harbor Not Available</strong> — BOC date ({assessment.bocDate}) is after the Jan 1, 2025 safe harbor cutoff. Full FEOC compliance required for ITC eligibility.
          </AlertDescription>
        </Alert>
      )}

      {/* Metric Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="FEOC Status"
          value={assessment.overallEligible ? "Eligible" : "Non-Compliant"}
          icon={assessment.overallEligible
            ? <ShieldCheck className="h-5 w-5 text-emerald-500" />
            : <ShieldAlert className="h-5 w-5 text-red-500" />
          }
        />
        <MetricCard
          label="Categories Passing"
          value={`${passingCount} / ${totalCount}`}
          icon={<Flag className="h-5 w-5" />}
        />
        <MetricCard
          label="BOC Date"
          value={assessment.bocDate ? new Date(assessment.bocDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "N/A"}
          icon={<Calendar className="h-5 w-5" />}
        />
        <MetricCard
          label="ITC at Risk"
          value={assessment.itcAtRisk}
          icon={<DollarSign className="h-5 w-5 text-red-500" />}
        />
      </div>

      {/* Category Assessments */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {assessment.categoryAssessments.map((cat) => (
          <Card key={cat.category} className="p-5">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-slate-200">{cat.label}</h4>
              <Badge
                variant="outline"
                className={cat.passing
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : "bg-red-50 text-red-700 border-red-200"
                }
              >
                {cat.passing ? "Pass" : "Fail"}
              </Badge>
            </div>
            <div className="mt-3">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span>Non-FEOC: {(cat.feocRatio * 100).toFixed(0)}%</span>
                <span>Threshold: {(cat.threshold * 100).toFixed(0)}%</span>
              </div>
              <div className="h-3 w-full overflow-hidden rounded-full bg-white/[0.06]">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${Math.min(cat.feocRatio * 100, 100)}%`,
                    backgroundColor: cat.passing ? COLORS.teal : COLORS.red,
                  }}
                />
              </div>
              <div
                className="relative h-0"
                style={{ left: `${cat.threshold * 100}%` }}
              >
                <div className="absolute -top-3 h-3 w-0.5 bg-gray-800" />
              </div>
            </div>
            <div className="mt-3 flex justify-between text-xs text-slate-400">
              <span>Total: ${(cat.totalCostUSD / 1_000_000).toFixed(1)}M</span>
              <span>Non-FEOC: ${(cat.nonFEOCCostUSD / 1_000_000).toFixed(1)}M</span>
            </div>
            {cat.flaggedSuppliers.length > 0 && (
              <div className="mt-2 space-y-1">
                {cat.flaggedSuppliers.map((s, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-xs text-red-600">
                    <AlertTriangle className="h-3 w-3" />
                    {s.name} ({s.component})
                  </div>
                ))}
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* Flagged Suppliers Table */}
      {allSuppliers.length > 0 && (
        <Card className="p-5">
          <h3 className="mb-4 text-sm font-medium text-slate-200">Flagged Suppliers</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Supplier</TableHead>
                <TableHead>Component</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Covered Nation</TableHead>
                <TableHead>Tier</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allSuppliers.map((s, i) => (
                <TableRow key={i}>
                  <TableCell className="font-medium">{s.name}</TableCell>
                  <TableCell>{s.component}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 text-xs">
                      {s.reason.replace(/_/g, " ")}
                    </Badge>
                  </TableCell>
                  <TableCell>{s.coveredNation}</TableCell>
                  <TableCell>Tier {s.tier}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
}
