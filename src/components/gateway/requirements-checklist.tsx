"use client";

import { CheckCircle, XCircle, Clock, AlertTriangle, Minus, FileText, ShieldAlert } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import type { GatewayRequirement, CheckStatus } from "@/lib/types";
import { documents } from "@/data/documents";
import { useState } from "react";

interface RequirementsChecklistProps {
  requirements: GatewayRequirement[];
  onRequestWaiver?: (requirement: GatewayRequirement) => void;
}

const statusIcons: Record<CheckStatus, { icon: typeof CheckCircle; className: string }> = {
  pass: { icon: CheckCircle, className: "text-emerald-600" },
  fail: { icon: XCircle, className: "text-red-600" },
  warning: { icon: AlertTriangle, className: "text-amber-500" },
  pending: { icon: Clock, className: "text-amber-500" },
  not_applicable: { icon: Minus, className: "text-gray-400" },
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
  manual: { label: "Manual", className: "bg-gray-100 text-gray-700 border-gray-200" },
  ai_assisted: { label: "AI", className: "bg-purple-100 text-purple-700 border-purple-200" },
};

export function RequirementsChecklist({ requirements, onRequestWaiver }: RequirementsChecklistProps) {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

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
      <div className="flex flex-wrap items-center gap-3 rounded-lg border bg-gray-50 px-4 py-3 text-sm">
        <span className="font-medium text-gray-900">
          {passCount} of {total} requirements passed
        </span>
        <span className="text-gray-300">|</span>
        {pendingCount > 0 && (
          <>
            <span className="text-amber-600">{pendingCount} in review</span>
            <span className="text-gray-300">|</span>
          </>
        )}
        {failCount > 0 && (
          <>
            <span className="text-red-600">{failCount} failed</span>
            <span className="text-gray-300">|</span>
          </>
        )}
        {naCount > 0 && (
          <span className="text-gray-500">{naCount} not applicable</span>
        )}
      </div>

      {/* Grouped requirements */}
      {grouped.map((group) => (
        <div key={group.category} className="rounded-lg border">
          <div className="flex items-center gap-2 border-b bg-gray-50 px-4 py-2.5">
            <h3 className="text-sm font-semibold text-[#1B2A4A]">{group.label}</h3>
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

              return (
                <AccordionItem key={req.id} value={req.id}>
                  <AccordionTrigger className="px-4 hover:no-underline">
                    <div className="flex flex-1 items-center gap-3">
                      <Icon className={`h-4 w-4 shrink-0 ${statusCfg.className}`} />
                      <div className="flex-1 text-left">
                        <span className="text-sm font-medium text-gray-900">
                          {req.label}
                        </span>
                        <span className="ml-2 text-xs text-gray-500">
                          {req.description}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
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
                            <span className="text-xs text-gray-500">
                              {Math.round(req.aiConfidence * 100)}%
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4">
                    <div className="space-y-3 rounded-md bg-gray-50 p-3">
                      {/* Linked documents */}
                      {linkedDocs.length > 0 && (
                        <div>
                          <p className="mb-1.5 text-xs font-medium text-gray-600">
                            Linked Documents
                          </p>
                          <ul className="space-y-1">
                            {linkedDocs.map((doc) => (
                              <li key={doc!.id} className="flex items-center gap-2 text-xs">
                                <FileText className="h-3 w-3 text-gray-400" />
                                <span className="text-gray-700">{doc!.name}</span>
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
                        <p className="mb-1 text-xs font-medium text-gray-600">
                          Check Result
                        </p>
                        <p className="text-xs text-gray-700">
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
