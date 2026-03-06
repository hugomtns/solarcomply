"use client";

import { CheckCircle, XCircle, Clock, AlertTriangle, Minus, FileText, ShieldAlert, Sparkles } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import type { GatewayRequirement, CheckStatus } from "@/lib/types";
import { documents } from "@/data/documents";
import { usePoc } from "@/contexts/poc-context";
import { useState } from "react";

interface RequirementsChecklistProps {
  requirements: GatewayRequirement[];
  projectId?: string;
  onRequestWaiver?: (requirement: GatewayRequirement) => void;
  onViewAiAnalysis?: () => void;
}

const statusIcons: Record<CheckStatus, { icon: typeof CheckCircle; className: string }> = {
  pass: { icon: CheckCircle, className: "text-emerald-600" },
  fail: { icon: XCircle, className: "text-red-600" },
  warning: { icon: AlertTriangle, className: "text-amber-500" },
  pending: { icon: Clock, className: "text-amber-500" },
  not_applicable: { icon: Minus, className: "text-text-muted" },
};

const categoryLabels: Record<string, string> = {
  document: "Documents",
  standard: "Standards Compliance",
  data_quality: "Data Quality",
  approval: "Approvals",
};

const categoryOrder: string[] = ["document", "standard", "data_quality", "approval"];

const checkTypeBadge: Record<string, { label: string; className: string }> = {
  automated: { label: "Automated", className: "bg-blue-100 text-blue-700 border-blue-200" },
  manual: { label: "Manual", className: "bg-white/[0.06] text-text-secondary border-gray-200" },
  ai_assisted: { label: "AI", className: "bg-purple-100 text-purple-700 border-purple-200" },
};

export function RequirementsChecklist({ requirements, projectId, onRequestWaiver, onViewAiAnalysis }: RequirementsChecklistProps) {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const poc = usePoc();

  const passCount = requirements.filter((r) => r.status === "pass").length;
  const failCount = requirements.filter((r) => r.status === "fail").length;
  const pendingCount = requirements.filter((r) => r.status === "pending" || r.status === "warning").length;
  const naCount = requirements.filter((r) => r.status === "not_applicable").length;
  const total = requirements.length;

  const grouped = categoryOrder
    .map((cat) => ({
      category: cat,
      label: categoryLabels[cat],
      items: requirements.filter((r) => r.category === cat),
    }))
    .filter((g) => g.items.length > 0);

  return (
    <div className="space-y-4">
      {/* Summary bar */}
      <div className="flex flex-wrap items-center gap-3 rounded-lg border bg-white/[0.04] px-4 py-3 text-sm">
        <span className="font-medium text-text-heading">
          {passCount} of {total} requirements passed
        </span>
        <span className="text-text-disabled">|</span>
        {pendingCount > 0 && (
          <>
            <span className="text-amber-600">{pendingCount} in review</span>
            <span className="text-text-disabled">|</span>
          </>
        )}
        {failCount > 0 && (
          <>
            <span className="text-red-600">{failCount} failed</span>
            <span className="text-text-disabled">|</span>
          </>
        )}
        {naCount > 0 && (
          <span className="text-text-tertiary">{naCount} not applicable</span>
        )}
      </div>

      {/* Grouped requirements */}
      {grouped.map((group) => (
        <div key={group.category} className="rounded-lg border">
          <div className="flex items-center gap-2 border-b bg-white/[0.04] px-4 py-2.5">
            <h3 className="text-sm font-semibold text-white">{group.label}</h3>
            <Badge variant="outline" className="text-xs">
              {group.items.filter((i) => i.status === "pass").length}/{group.items.length}
            </Badge>
          </div>

          <Accordion
            type="multiple"
            value={expandedItems}
            onValueChange={setExpandedItems}
          >
            {group.items.map((req) => {
              const statusCfg = statusIcons[req.status];
              const Icon = statusCfg.icon;
              const checkCfg = checkTypeBadge[req.checkType];
              const linkedDocs = (req.linkedDocumentIds ?? [])
                .map((id) => documents.find((d) => d.id === id))
                .filter(Boolean);

              // Check for AI result for this requirement
              const aiResult = projectId
                ? poc.getResultForRequirement(projectId, req.id)
                : undefined;

              return (
                <AccordionItem key={req.id} value={req.id}>
                  <AccordionTrigger className="px-4 hover:no-underline">
                    <div className="flex flex-1 items-center gap-3">
                      <Icon className={`h-4 w-4 shrink-0 ${statusCfg.className}`} />
                      <div className="flex-1 text-left">
                        <span className="text-sm font-medium text-text-heading">
                          {req.label}
                        </span>
                        <span className="ml-2 text-xs text-text-tertiary">
                          {req.description}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {/* AI result mini badge */}
                        {aiResult && (
                          <AiResultBadge status={aiResult.status} findingCount={aiResult.findings.length} />
                        )}
                        <Badge variant="outline" className={`text-xs ${checkCfg.className}`}>
                          {checkCfg.label}
                        </Badge>
                        {req.standardRef && (
                          <Badge variant="outline" className="text-xs bg-sky-50 text-sky-700 border-sky-200">
                            {req.standardRef}
                          </Badge>
                        )}
                        {req.checkType === "ai_assisted" && req.aiConfidence != null && (
                          <div className="flex items-center gap-1.5 min-w-[80px]">
                            <Progress
                              value={req.aiConfidence * 100}
                              className="h-1.5 w-12"
                            />
                            <span className="text-xs text-text-tertiary">
                              {Math.round(req.aiConfidence * 100)}%
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4">
                    <div className="space-y-3 rounded-md bg-white/[0.04] p-3">
                      {/* Linked documents */}
                      {linkedDocs.length > 0 && (
                        <div>
                          <p className="mb-1.5 text-xs font-medium text-text-tertiary">
                            Linked Documents
                          </p>
                          <ul className="space-y-1">
                            {linkedDocs.map((doc) => (
                              <li key={doc!.id} className="flex items-center gap-2 text-xs">
                                <FileText className="h-3 w-3 text-text-muted" />
                                <span className="text-text-secondary">{doc!.name}</span>
                                <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                                  {doc!.fileType.toUpperCase()}
                                </Badge>
                                <Badge
                                  variant="outline"
                                  className={`text-[10px] px-1.5 py-0 ${
                                    doc!.status === "approved"
                                      ? "bg-emerald-50 text-emerald-700"
                                      : doc!.status === "rejected"
                                        ? "bg-red-50 text-red-700"
                                        : "bg-amber-50 text-amber-700"
                                  }`}
                                >
                                  {doc!.status.replace("_", " ")}
                                </Badge>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Check result detail */}
                      <div>
                        <p className="mb-1 text-xs font-medium text-text-tertiary">
                          Check Result
                        </p>
                        <p className="text-xs text-text-secondary">
                          {req.status === "pass" && "Requirement satisfied. All criteria met."}
                          {req.status === "fail" && "Requirement not met. Corrective action needed."}
                          {req.status === "warning" && "Partial compliance detected. Review recommended."}
                          {req.status === "pending" && "Awaiting verification. Check not yet executed."}
                          {req.status === "not_applicable" && "Not applicable to this gateway."}
                        </p>
                        {req.checkType === "ai_assisted" && req.aiConfidence != null && (
                          <p className="mt-1 text-xs text-purple-600">
                            AI confidence: {Math.round(req.aiConfidence * 100)}% — manual
                            verification {req.aiConfidence >= 0.9 ? "optional" : "recommended"}
                          </p>
                        )}
                      </div>

                      {/* AI result inline */}
                      {aiResult && (
                        <div className="rounded-md border border-purple-200 bg-purple-50 p-2.5">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Sparkles className="h-3.5 w-3.5 text-purple-600" />
                              <span className="text-xs font-medium text-purple-900">
                                AI Analysis: {aiResult.status.toUpperCase()}
                              </span>
                              <span className="text-xs text-purple-600">
                                ({Math.round(aiResult.confidence * 100)}% confidence)
                              </span>
                            </div>
                            {onViewAiAnalysis && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 gap-1 text-xs text-purple-700 hover:text-purple-900"
                                onClick={onViewAiAnalysis}
                              >
                                View AI Analysis
                              </Button>
                            )}
                          </div>
                          <p className="mt-1 text-xs text-purple-800">{aiResult.summary}</p>
                          {aiResult.findings.length > 0 && (
                            <p className="mt-1 text-[11px] text-purple-600">
                              {aiResult.findings.length} finding{aiResult.findings.length !== 1 ? "s" : ""}: {" "}
                              {aiResult.findings.filter(f => f.severity === "critical").length} critical, {" "}
                              {aiResult.findings.filter(f => f.severity === "warning").length} warning, {" "}
                              {aiResult.findings.filter(f => f.severity === "info").length} info
                            </p>
                          )}
                        </div>
                      )}

                      {/* AI check button for ai_assisted requirements without results */}
                      {req.checkType === "ai_assisted" && !aiResult && projectId && onViewAiAnalysis && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1.5 text-xs text-purple-700 border-purple-200 hover:bg-purple-50"
                          onClick={onViewAiAnalysis}
                        >
                          <Sparkles className="h-3 w-3" />
                          AI Check
                        </Button>
                      )}

                      {/* Waiver button for failed/warning */}
                      {(req.status === "fail" || req.status === "warning") && onRequestWaiver && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1.5 text-xs"
                          onClick={() => onRequestWaiver(req)}
                        >
                          <ShieldAlert className="h-3 w-3" />
                          Request Waiver
                        </Button>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </div>
      ))}
    </div>
  );
}

function AiResultBadge({ status, findingCount }: { status: string; findingCount: number }) {
  const config: Record<string, string> = {
    pass: "bg-green-100 text-green-700 border-green-200",
    warning: "bg-amber-100 text-amber-700 border-amber-200",
    fail: "bg-red-100 text-red-700 border-red-200",
  };
  return (
    <Badge variant="outline" className={`gap-1 text-[10px] ${config[status] ?? config.warning}`}>
      <Sparkles className="h-2.5 w-2.5" />
      {status.toUpperCase()}
      {findingCount > 0 && ` (${findingCount})`}
    </Badge>
  );
}
