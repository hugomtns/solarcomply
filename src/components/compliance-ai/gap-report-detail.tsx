"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Minus,
  Sparkles,
  FileText,
  Download,
  ChevronRight,
  Info,
  Clock,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type {
  CheckStatus,
  ComplianceCheckResponse,
  ComplianceFinding,
} from "@/lib/types";
import { documents } from "@/data/documents";

/* ─── Types ─── */

interface GapItem {
  standard: string;
  requirement: string;
  status: CheckStatus;
  action: string;
}

type ReportKind = "compliance" | "gap";

interface GapReportDetailProps {
  kind: ReportKind;
  projectId: string;
  gapItems: GapItem[];
  complianceResult?: ComplianceCheckResponse | null;
  projectName?: string;
  onBack: () => void;
}

/* ─── Mock document source references ─── */

interface DocSourceRef {
  documentId: string;
  documentName: string;
  page: number;
}

// Map some findings/standards to mock document references
function getMockDocRefs(projectId: string, text: string): DocSourceRef[] {
  const projectDocs = documents.filter((d) => d.projectId === projectId);
  if (projectDocs.length === 0) return [];

  const refs: DocSourceRef[] = [];
  const lc = text.toLowerCase();

  if (lc.includes("fire") || lc.includes("nfpa") || lc.includes("safety")) {
    const doc = projectDocs.find((d) => d.category === "ul9540a_report" || d.category === "bess_test_report") ?? projectDocs[0];
    refs.push({ documentId: doc.id, documentName: doc.name, page: 4 });
    if (projectDocs.length > 2) {
      refs.push({ documentId: projectDocs[2].id, documentName: projectDocs[2].name, page: 12 });
    }
  } else if (lc.includes("inverter") || lc.includes("iec 62109")) {
    const doc = projectDocs.find((d) => d.category === "fat_report" || d.category === "design_drawings") ?? projectDocs[0];
    refs.push({ documentId: doc.id, documentName: doc.name, page: 8 });
  } else if (lc.includes("monitoring") || lc.includes("iec 61724")) {
    const doc = projectDocs.find((d) => d.category === "performance_report" || d.category === "scada_documentation") ?? projectDocs[0];
    refs.push({ documentId: doc.id, documentName: doc.name, page: 3 });
  } else if (lc.includes("grid") || lc.includes("ieee 1547")) {
    const doc = projectDocs.find((d) => d.category === "grid_study" || d.category === "grid_compliance_cert") ?? projectDocs[0];
    refs.push({ documentId: doc.id, documentName: doc.name, page: 15 });
  } else if (lc.includes("thermal") || lc.includes("bess") || lc.includes("ul 9540")) {
    const doc = projectDocs.find((d) => d.category === "bess_test_report" || d.category === "ul9540a_report") ?? projectDocs[0];
    refs.push({ documentId: doc.id, documentName: doc.name, page: 22 });
  } else if (projectDocs.length > 0) {
    refs.push({ documentId: projectDocs[0].id, documentName: projectDocs[0].name, page: 1 });
  }

  return refs;
}

/* ─── Severity config ─── */

const severityConfig = {
  critical: {
    icon: XCircle,
    border: "border-status-error/25",
    bg: "bg-status-error/10",
    badge: "bg-status-error/15 text-palette-red-400 border-status-error/25",
    iconColor: "text-palette-red-400",
  },
  warning: {
    icon: AlertTriangle,
    border: "border-status-warning/25",
    bg: "bg-status-warning/10",
    badge: "bg-status-warning/20 text-status-warning-light border-status-warning/25",
    iconColor: "text-status-warning-light",
  },
  info: {
    icon: Info,
    border: "border-status-info/25",
    bg: "bg-status-info/10",
    badge: "bg-status-info/15 text-palette-blue-400 border-status-info/25",
    iconColor: "text-palette-blue-400",
  },
};

const statusConfig: Record<CheckStatus, { icon: typeof CheckCircle; color: string; label: string }> = {
  pass: { icon: CheckCircle, color: "text-primary", label: "Compliant" },
  fail: { icon: XCircle, color: "text-status-error", label: "Non-Compliant" },
  warning: { icon: AlertTriangle, color: "text-status-warning", label: "Warning" },
  pending: { icon: Clock, color: "text-text-muted", label: "Pending" },
  not_applicable: { icon: Minus, color: "text-text-disabled", label: "Not Applicable" },
};

/* ─── Document Source Pill ─── */

function DocSourcePill({ docRef, projectId }: { docRef: DocSourceRef; projectId: string }) {
  const shortName = docRef.documentName.length > 30
    ? docRef.documentName.slice(0, 28) + "..."
    : docRef.documentName;

  return (
    <Link
      href={`/project/${projectId}/documents/${docRef.documentId}`}
      className="inline-flex items-center gap-1 rounded-full bg-status-info/15 border border-status-info/25 px-2 py-0.5 text-[11px] font-medium text-palette-blue-400 hover:bg-status-info/25 transition-colors cursor-pointer"
    >
      <FileText className="h-3 w-3 shrink-0" />
      <span className="truncate max-w-[200px]">{shortName}</span>
      <span className="text-palette-blue-400/60">p.{docRef.page}</span>
    </Link>
  );
}

/* ─── Main Component ─── */

export function GapReportDetail({
  kind,
  projectId,
  gapItems,
  complianceResult,
  projectName,
  onBack,
}: GapReportDetailProps) {
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());

  function toggleItem(idx: number) {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  }

  const isCompliance = kind === "compliance" && complianceResult;

  const title = isCompliance
    ? "AI Compliance Analysis Report"
    : "Gap Analysis Report";

  const timestamp = isCompliance
    ? new Date(complianceResult.metadata.timestamp).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : new Date().toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });

  return (
    <div className="animate-fade-in space-y-6">
      {/* Back link */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-sm text-brand-blue hover:underline"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Reports
      </button>

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className={`flex h-10 w-10 items-center justify-center rounded-lg border border-white/[0.08] ${
              isCompliance ? "bg-status-special/15" : "bg-status-info/15"
            }`}>
              {isCompliance
                ? <Sparkles className="h-5 w-5 text-palette-purple-400" />
                : <FileText className="h-5 w-5 text-brand-blue" />
              }
            </div>
            <div>
              <h1 className="text-xl font-semibold font-display text-white">{title}</h1>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                {projectName && (
                  <Badge variant="outline" className="text-xs">{projectName}</Badge>
                )}
                {isCompliance && (
                  <Badge variant="outline" className="text-xs bg-status-special/15 text-palette-purple-400 border-status-special/25">
                    Gateway {complianceResult.gatewayCode}
                  </Badge>
                )}
                <span className="text-xs text-text-muted">{timestamp}</span>
              </div>
            </div>
          </div>
        </div>

        <Button variant="outline" size="sm" className="gap-1.5 shrink-0">
          <Download className="h-4 w-4" />
          Download PDF
        </Button>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left: Findings */}
        <div className="lg:col-span-2 space-y-4">
          {/* Summary stats */}
          <Card className="p-4">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
              {isCompliance ? (
                <>
                  <StatItem
                    icon={Shield}
                    iconColor="text-primary"
                    label="Assessed"
                    value={complianceResult.results.length}
                  />
                  <StatItem
                    icon={CheckCircle}
                    iconColor="text-primary"
                    label="Compliant"
                    value={complianceResult.results.filter((r) => r.status === "pass").length}
                  />
                  <StatItem
                    icon={XCircle}
                    iconColor="text-status-error"
                    label="Non-Compliant"
                    value={complianceResult.results.filter((r) => r.status === "fail").length}
                  />
                  <StatItem
                    icon={AlertTriangle}
                    iconColor="text-status-warning"
                    label="Warnings"
                    value={complianceResult.results.filter((r) => r.status === "warning").length}
                  />
                </>
              ) : (
                <>
                  <StatItem icon={Shield} iconColor="text-primary" label="Assessed" value={gapItems.length} />
                  <StatItem icon={CheckCircle} iconColor="text-primary" label="Compliant" value={gapItems.filter((i) => i.status === "pass").length} />
                  <StatItem icon={XCircle} iconColor="text-status-error" label="Gaps" value={gapItems.filter((i) => i.status === "fail").length} />
                  <StatItem icon={AlertTriangle} iconColor="text-status-warning" label="Warnings" value={gapItems.filter((i) => i.status === "warning").length} />
                  <StatItem icon={Clock} iconColor="text-text-muted" label="Pending" value={gapItems.filter((i) => i.status === "pending").length} />
                </>
              )}
            </div>
          </Card>

          {/* Findings list */}
          {isCompliance ? (
            <div className="space-y-3">
              <h2 className="text-sm font-medium text-text-heading">Findings by Requirement</h2>
              {complianceResult.results.map((result, idx) => (
                <Card
                  key={result.requirementId}
                  className="overflow-hidden"
                >
                  {/* Requirement header */}
                  <button
                    className="w-full flex items-center gap-3 p-4 text-left hover:bg-surface-glass-hover transition-colors"
                    onClick={() => toggleItem(idx)}
                  >
                    <ChevronRight
                      className={`h-4 w-4 shrink-0 text-text-muted transition-transform ${
                        expandedItems.has(idx) ? "rotate-90" : ""
                      }`}
                    />
                    {(() => {
                      const sc = statusConfig[result.status as CheckStatus] ?? statusConfig.pending;
                      const StatusIcon = sc.icon;
                      return <StatusIcon className={`h-4 w-4 shrink-0 ${sc.color}`} />;
                    })()}
                    <div className="flex-1 min-w-0">
                      <span className="text-sm font-medium text-text-heading">
                        {result.requirementId}
                      </span>
                      <p className="text-xs text-text-tertiary mt-0.5 line-clamp-1">{result.summary}</p>
                    </div>
                    <Badge variant="outline" className="text-[10px] shrink-0">
                      {Math.round(result.confidence * 100)}% confidence
                    </Badge>
                  </button>

                  {/* Expanded: findings detail */}
                  {expandedItems.has(idx) && (
                    <div className="border-t border-white/[0.06] px-4 pb-4 pt-3 space-y-3">
                      {result.findings.length === 0 ? (
                        <p className="text-xs text-text-muted italic">No specific findings for this requirement.</p>
                      ) : (
                        result.findings.map((finding) => (
                          <ComplianceFindingCard
                            key={finding.id}
                            finding={finding}
                            projectId={projectId}
                          />
                        ))
                      )}
                    </div>
                  )}
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              <h2 className="text-sm font-medium text-text-heading">Standards Assessment</h2>
              {gapItems.map((item, idx) => {
                const sc = statusConfig[item.status];
                const StatusIcon = sc.icon;
                const docRefs = getMockDocRefs(projectId, `${item.standard} ${item.requirement} ${item.action}`);

                return (
                  <Card key={idx} className="overflow-hidden">
                    <button
                      className="w-full flex items-center gap-3 p-4 text-left hover:bg-surface-glass-hover transition-colors"
                      onClick={() => toggleItem(idx)}
                    >
                      <ChevronRight
                        className={`h-4 w-4 shrink-0 text-text-muted transition-transform ${
                          expandedItems.has(idx) ? "rotate-90" : ""
                        }`}
                      />
                      <StatusIcon className={`h-4 w-4 shrink-0 ${sc.color}`} />
                      <div className="flex-1 min-w-0">
                        <span className="text-sm font-medium text-text-heading">{item.standard}</span>
                        <p className="text-xs text-text-tertiary mt-0.5">{item.requirement}</p>
                      </div>
                      <Badge
                        variant="outline"
                        className={`text-[10px] shrink-0 ${
                          item.status === "pass" ? "bg-primary/15 text-primary border-primary/25" :
                          item.status === "fail" ? "bg-status-error/15 text-palette-red-400 border-status-error/25" :
                          item.status === "warning" ? "bg-status-warning/20 text-status-warning-light border-status-warning/25" :
                          ""
                        }`}
                      >
                        {sc.label}
                      </Badge>
                    </button>

                    {expandedItems.has(idx) && (
                      <div className="border-t border-white/[0.06] px-4 pb-4 pt-3 space-y-3">
                        <div className="rounded-lg bg-surface-glass p-3 space-y-2">
                          <div className="text-xs text-text-secondary leading-relaxed">
                            <span className="font-medium text-text-heading">Assessment: </span>
                            {item.action}
                          </div>

                          {/* Document source references */}
                          {docRefs.length > 0 && (
                            <div className="space-y-1.5">
                              <p className="text-[11px] font-medium text-text-tertiary">Source documents:</p>
                              <div className="flex flex-wrap gap-1.5">
                                {docRefs.map((ref, ri) => (
                                  <DocSourcePill key={ri} docRef={ref} projectId={projectId} />
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Mock code requirement for fail/warning items */}
                        {(item.status === "fail" || item.status === "warning") && (
                          <div className="rounded-lg bg-white/[0.04] border border-white/[0.06] p-3">
                            <p className="text-[11px] font-medium text-text-tertiary mb-1">Code requirement</p>
                            <p className="text-xs text-text-secondary leading-relaxed">
                              {item.standard} requires that {item.requirement.toLowerCase()} shall be documented and verified
                              prior to gateway approval. All relevant test reports and certificates must be current and
                              reference the applicable edition of the standard.
                            </p>
                          </div>
                        )}

                        {/* Recommendation */}
                        {item.status !== "pass" && item.status !== "not_applicable" && (
                          <div className="rounded bg-primary/10 border border-primary/20 px-3 py-2">
                            <p className="text-[11px] font-medium text-primary mb-0.5">Recommendation</p>
                            <p className="text-xs text-text-secondary">{item.action}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* Right sidebar: metadata */}
        <div className="space-y-6">
          <Card className="p-5">
            <h3 className="text-sm font-medium text-text-heading mb-4">Report Details</h3>
            <dl className="space-y-3">
              <MetaRow icon={FileText} label="Report Type" value={isCompliance ? "AI Compliance Analysis" : "Standards Gap Analysis"} />
              {projectName && <MetaRow icon={Shield} label="Project" value={projectName} />}
              {isCompliance && (
                <>
                  <MetaRow icon={Shield} label="Gateway" value={complianceResult.gatewayCode} />
                  <MetaRow icon={Sparkles} label="AI Model" value={complianceResult.metadata.model} />
                  <MetaRow icon={Clock} label="Analysis Duration" value={`${(complianceResult.metadata.durationMs / 1000).toFixed(1)}s`} />
                  {complianceResult.metadata.totalTokens && (
                    <MetaRow icon={Info} label="Tokens Used" value={complianceResult.metadata.totalTokens.toLocaleString()} />
                  )}
                </>
              )}
              <MetaRow icon={Clock} label="Generated" value={timestamp} />
            </dl>

            {isCompliance && complianceResult.metadata.regulationsLoaded.length > 0 && (
              <>
                <Separator className="my-4" />
                <h4 className="text-[11px] font-medium text-text-tertiary uppercase tracking-wider mb-2">Regulations Analyzed</h4>
                <div className="flex flex-wrap gap-1.5">
                  {complianceResult.metadata.regulationsLoaded.map((reg) => (
                    <Badge key={reg} variant="outline" className="text-[10px]">{reg}</Badge>
                  ))}
                </div>
              </>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

/* ─── Sub-components ─── */

function StatItem({ icon: Icon, iconColor, label, value }: { icon: typeof CheckCircle; iconColor: string; label: string; value: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <Icon className={`h-4 w-4 ${iconColor}`} />
      <span className="text-text-heading font-medium">{value}</span>
      <span className="text-text-muted">{label}</span>
    </div>
  );
}

function MetaRow({ icon: Icon, label, value }: { icon: typeof FileText; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 text-sm">
      <Icon className="h-4 w-4 text-text-muted mt-0.5 shrink-0" />
      <div>
        <dt className="text-[11px] text-text-muted uppercase tracking-wider">{label}</dt>
        <dd className="text-text-secondary">{value}</dd>
      </div>
    </div>
  );
}

function ComplianceFindingCard({ finding, projectId }: { finding: ComplianceFinding; projectId: string }) {
  const config = severityConfig[finding.severity];
  const Icon = config.icon;
  const docRefs = getMockDocRefs(projectId, `${finding.title} ${finding.description}`);

  return (
    <div className={`rounded-lg border ${config.border} ${config.bg} p-3`}>
      <div className="flex items-start gap-2">
        <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${config.iconColor}`} />
        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium text-text-heading">{finding.title}</span>
            <Badge variant="outline" className={`text-[10px] ${config.badge}`}>
              {finding.severity}
            </Badge>
          </div>

          {/* Description with inline doc references */}
          <p className="text-xs leading-relaxed text-text-secondary">
            {finding.description}
          </p>

          {/* Document source references */}
          {docRefs.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {docRefs.map((ref, ri) => (
                <DocSourcePill key={ri} docRef={ref} projectId={projectId} />
              ))}
            </div>
          )}

          {/* Citations */}
          {finding.citations.length > 0 && (
            <div className="rounded-lg bg-white/[0.04] border border-white/[0.06] p-2.5">
              <p className="text-[11px] font-medium text-text-tertiary mb-1">Code requirement</p>
              {finding.citations.map((citation, i) => (
                <p key={i} className="text-xs text-text-secondary leading-relaxed">
                  <span className="font-medium">{citation.regulationName}</span> — {citation.article}
                  {citation.excerpt && (
                    <span className="block mt-0.5 text-text-tertiary italic">&ldquo;{citation.excerpt}&rdquo;</span>
                  )}
                </p>
              ))}
            </div>
          )}

          {/* Recommendation */}
          <div className="rounded bg-primary/10 border border-primary/20 px-2.5 py-1.5">
            <p className="text-[11px] font-medium text-primary mb-0.5">Recommendation</p>
            <p className="text-xs text-text-secondary">{finding.recommendation}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
