"use client";

import { Project } from "@/lib/types";
import { documents } from "@/data/documents";
import { EmptyState } from "@/components/shared/empty-state";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Scale, Clock, CheckCircle2, AlertTriangle, FileText } from "lucide-react";
import { COLORS } from "@/lib/constants";

interface ForcedLabourPanelProps {
  project: Project;
}

const enforcementMilestones = [
  { date: "Dec 2024", label: "Regulation entered into force", status: "complete" as const },
  { date: "Jun 2025", label: "Commission investigation guidelines published", status: "complete" as const },
  { date: "Dec 2027", label: "Full enforcement begins", status: "upcoming" as const },
  { date: "Ongoing", label: "Product withdrawal decisions possible", status: "upcoming" as const },
];

const supplierDueDiligence = [
  { supplier: "JinkoSolar", component: "PV Modules", auditType: "SA8000 / SSI Certified", status: "complete" as const, riskLevel: "Low" },
  { supplier: "SMA Solar", component: "Inverters", auditType: "Self-declaration on file", status: "partial" as const, riskLevel: "Medium" },
  { supplier: "BYD", component: "BESS", auditType: "RBA membership — audit pending", status: "pending" as const, riskLevel: "Medium" },
];

export function ForcedLabourPanel({ project }: ForcedLabourPanelProps) {
  const isEU = project.jurisdictions.some((j) => j === "EU" || j === "DE");

  if (!isEU) {
    return (
      <EmptyState
        icon={<Scale className="h-12 w-12" />}
        message="EU Forced Labour Regulation applies only to EU-jurisdiction projects."
      />
    );
  }

  const flDocs = documents.filter(
    (d) => d.projectId === project.id &&
    (d.category === "forced_labour_due_diligence" || d.category === "forced_labour_audit")
  );

  return (
    <div className="space-y-6">
      {/* Enforcement Timeline Banner */}
      <Alert className="border-blue-200 bg-blue-50">
        <Clock className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          <strong>EU Forced Labour Regulation (2024/3015)</strong> — Full enforcement begins December 2027. Competent authorities can investigate supply chains and order product withdrawals.
        </AlertDescription>
      </Alert>

      {/* Enforcement Milestones */}
      <Card className="p-5">
        <h3 className="mb-4 text-sm font-medium text-slate-200">Enforcement Timeline</h3>
        <div className="flex flex-wrap gap-3">
          {enforcementMilestones.map((m, i) => (
            <Badge
              key={i}
              variant="outline"
              className={
                m.status === "complete"
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : "bg-white/[0.04] text-slate-400 border-white/[0.08]"
              }
            >
              {m.status === "complete" && <CheckCircle2 className="mr-1 h-3 w-3" />}
              {m.status === "upcoming" && <Clock className="mr-1 h-3 w-3" />}
              <span className="font-semibold mr-1">{m.date}:</span> {m.label}
            </Badge>
          ))}
        </div>
      </Card>

      {/* Supplier Due Diligence Grid */}
      <Card className="p-5">
        <h3 className="mb-4 text-sm font-medium text-slate-200">Supplier Due Diligence Status</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {supplierDueDiligence.map((s) => (
            <Card key={s.supplier} className="p-4 border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-200">{s.supplier}</span>
                <Badge
                  variant="outline"
                  className={
                    s.status === "complete"
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : s.status === "partial"
                      ? "bg-amber-50 text-amber-700 border-amber-200"
                      : "bg-white/[0.04] text-slate-400 border-white/[0.08]"
                  }
                >
                  {s.status === "complete" ? "Verified" : s.status === "partial" ? "Partial" : "Pending"}
                </Badge>
              </div>
              <p className="text-xs text-slate-400">{s.component}</p>
              <p className="mt-1 text-xs text-slate-400">{s.auditType}</p>
              <div className="mt-2 flex items-center gap-1">
                <span className="text-[10px] uppercase tracking-wider text-slate-500">Risk:</span>
                <span
                  className="text-xs font-medium"
                  style={{ color: s.riskLevel === "Low" ? COLORS.teal : COLORS.amber }}
                >
                  {s.riskLevel}
                </span>
              </div>
            </Card>
          ))}
        </div>
      </Card>

      {/* Evidence Package Summary */}
      <Card className="p-5">
        <h3 className="mb-4 text-sm font-medium text-slate-200">Evidence Package Summary</h3>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="text-center">
            <p className="text-2xl font-bold" style={{ color: COLORS.navy }}>{flDocs.length}</p>
            <p className="text-xs text-slate-400">Documents on File</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold" style={{ color: COLORS.teal }}>
              {flDocs.filter((d) => d.status === "approved").length}
            </p>
            <p className="text-xs text-slate-400">Approved</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold" style={{ color: COLORS.amber }}>
              {flDocs.filter((d) => d.status === "pending_review").length}
            </p>
            <p className="text-xs text-slate-400">Pending Review</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold" style={{ color: COLORS.gray400 }}>
              {flDocs.filter((d) => d.status === "draft").length}
            </p>
            <p className="text-xs text-slate-400">Draft</p>
          </div>
        </div>
        {flDocs.length > 0 && (
          <div className="mt-4 space-y-2">
            {flDocs.map((d) => (
              <div key={d.id} className="flex items-center gap-2 text-xs text-slate-400">
                <FileText className="h-3.5 w-3.5 text-slate-500" />
                <span className="flex-1">{d.name}</span>
                <Badge variant="outline" className="text-[10px]">
                  {d.status.replace(/_/g, " ")}
                </Badge>
              </div>
            ))}
          </div>
        )}
        {flDocs.length === 0 && (
          <div className="mt-4 flex items-center gap-2 text-xs text-amber-600">
            <AlertTriangle className="h-3.5 w-3.5" />
            No forced labour due diligence documents uploaded yet.
          </div>
        )}
      </Card>
    </div>
  );
}
