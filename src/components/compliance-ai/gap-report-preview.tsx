"use client";

import { toast } from "sonner";
import { CheckStatus, ComplianceCheckResponse } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, CheckCircle, XCircle, AlertTriangle, Minus, Sparkles, Eye } from "lucide-react";
import { exportCompliancePdf } from "@/lib/export-compliance-pdf";

interface GapItem {
  standard: string;
  requirement: string;
  status: CheckStatus;
  action: string;
}

interface GapReportPreviewProps {
  gapItems: GapItem[];
  complianceResult?: ComplianceCheckResponse | null;
  projectName?: string;
  onViewReport?: (kind: "compliance" | "gap") => void;
}

export function GapReportPreview({ gapItems, complianceResult, projectName, onViewReport }: GapReportPreviewProps) {
  const compliant = gapItems.filter((i) => i.status === "pass").length;
  const gaps = gapItems.filter((i) => i.status === "fail").length;
  const warnings = gapItems.filter((i) => i.status === "warning").length;
  const pending = gapItems.filter((i) => i.status === "pending").length;
  const na = gapItems.filter((i) => i.status === "not_applicable").length;

  const today = new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const handleDownloadGapPdf = () => {
    toast.success("Gap Analysis PDF export started");
  };

  const handleDownloadCompliancePdf = () => {
    if (complianceResult && projectName) {
      exportCompliancePdf(complianceResult, projectName);
    }
  };

  return (
    <div className="space-y-4">
      {/* AI Compliance Analysis Report (from POC G8 check) */}
      {complianceResult && (
        <Card className="border-status-special/25 bg-status-special/15 shadow-card">
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-purple-600" />
                <CardTitle className="text-sm font-semibold text-white">
                  AI Compliance Analysis Report
                </CardTitle>
              </div>
              <span className="text-[11px] text-text-tertiary">
                {new Date(complianceResult.metadata.timestamp).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-text-tertiary">
              <span className="font-medium">
                {complianceResult.results.length} requirements assessed
              </span>
              <span className="text-white/20">|</span>
              <span className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3 text-emerald-600" />
                {complianceResult.results.filter((r) => r.status === "pass").length} compliant
              </span>
              <span className="text-white/20">|</span>
              <span className="flex items-center gap-1">
                <XCircle className="h-3 w-3 text-red-600" />
                {complianceResult.results.filter((r) => r.status === "fail").length} non-compliant
              </span>
              <span className="text-white/20">|</span>
              <span className="flex items-center gap-1">
                <AlertTriangle className="h-3 w-3 text-amber-600" />
                {complianceResult.results.filter((r) => r.status === "warning").length} warnings
              </span>
              <span className="text-white/20">|</span>
              <span className="text-text-tertiary">
                Gateway {complianceResult.gatewayCode}
              </span>
            </div>
            <div className="mb-3 text-[11px] text-text-tertiary">
              Regulations: {complianceResult.metadata.regulationsLoaded.join(", ")}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 text-xs"
                onClick={() => onViewReport?.("compliance")}
              >
                <Eye className="h-3 w-3" />
                View Report
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 text-xs"
                onClick={handleDownloadCompliancePdf}
              >
                <Download className="h-3 w-3" />
                Download PDF
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Standards Gap Analysis Report */}
      <Card className="border-status-info/25 bg-status-info/15 shadow-card">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-brand-blue" />
              <CardTitle className="text-sm font-semibold text-white">
                Gap Analysis Report
              </CardTitle>
            </div>
            <span className="text-[11px] text-text-tertiary">{today}</span>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-text-tertiary">
            <span className="font-medium">
              {gapItems.length} requirements assessed
            </span>
            <span className="text-white/20">|</span>
            <span className="flex items-center gap-1">
              <CheckCircle className="h-3 w-3 text-emerald-600" />
              {compliant} compliant
            </span>
            <span className="text-white/20">|</span>
            <span className="flex items-center gap-1">
              <XCircle className="h-3 w-3 text-red-600" />
              {gaps} gaps identified
            </span>
            {warnings > 0 && (
              <>
                <span className="text-white/20">|</span>
                <span className="flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3 text-amber-600" />
                  {warnings} warnings
                </span>
              </>
            )}
            {pending > 0 && (
              <>
                <span className="text-white/20">|</span>
                <span>{pending} pending</span>
              </>
            )}
            {na > 0 && (
              <>
                <span className="text-white/20">|</span>
                <span className="flex items-center gap-1">
                  <Minus className="h-3 w-3 text-text-muted" />
                  {na} not applicable
                </span>
              </>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 text-xs"
              onClick={() => onViewReport?.("gap")}
            >
              <Eye className="h-3 w-3" />
              View Report
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 text-xs"
              onClick={handleDownloadGapPdf}
            >
              <Download className="h-3 w-3" />
              Download PDF
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
