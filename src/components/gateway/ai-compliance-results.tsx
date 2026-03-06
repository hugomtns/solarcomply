"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AiFindingCard } from "./ai-finding-card";
import { usePoc } from "@/contexts/poc-context";
import { Sparkles, RefreshCw, Loader2, Clock, Download } from "lucide-react";
import { exportCompliancePdf } from "@/lib/export-compliance-pdf";
import { projects } from "@/data/projects";
import type { ComplianceCheckResponse } from "@/lib/types";

interface AiComplianceResultsProps {
  projectId: string;
  gatewayCode: string;
  jurisdictions: string[];
}

export function AiComplianceResults({ projectId, gatewayCode, jurisdictions }: AiComplianceResultsProps) {
  const poc = usePoc();
  const result = poc.complianceResults[projectId];

  const handleRunCheck = () => {
    poc.runAllAiChecks(projectId, gatewayCode, jurisdictions);
  };

  if (poc.isChecking) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-palette-purple-400" />
        <p className="mt-3 text-sm font-medium text-text-secondary">Running AI Compliance Check...</p>
        <p className="mt-1 text-xs text-text-tertiary">Analyzing report against {jurisdictions.includes("EU") || jurisdictions.includes("DE") ? "EU" : "US"} regulations</p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="rounded-full bg-status-special/15 p-4">
          <Sparkles className="h-8 w-8 text-palette-purple-400" />
        </div>
        <h3 className="mt-4 text-sm font-semibold text-text-heading">AI Compliance Analysis</h3>
        <p className="mt-1 max-w-sm text-center text-xs text-text-tertiary">
          Run an AI-powered compliance check against applicable regulations.
          The AI will analyze the synthetic annual report and identify compliance gaps.
        </p>
        <Button
          onClick={handleRunCheck}
          className="mt-4 gap-2 bg-status-special hover:bg-status-special/80"
          size="sm"
        >
          <Sparkles className="h-4 w-4" />
          Run AI Compliance Check
        </Button>
        {poc.checkError && (
          <div className="mt-3 max-w-sm rounded-md bg-status-error/15 px-4 py-2 text-xs text-palette-red-400">
            {poc.checkError}
          </div>
        )}
      </div>
    );
  }

  return <ResultsDisplay result={result} onRerun={handleRunCheck} />;
}

function ResultsDisplay({
  result,
  onRerun,
}: {
  result: ComplianceCheckResponse;
  onRerun: () => void;
}) {
  const allFindings = result.results.flatMap((r) => r.findings);
  const criticalCount = allFindings.filter((f) => f.severity === "critical").length;
  const warningCount = allFindings.filter((f) => f.severity === "warning").length;
  const infoCount = allFindings.filter((f) => f.severity === "info").length;

  const failCount = result.results.filter((r) => r.status === "fail").length;
  const passCount = result.results.filter((r) => r.status === "pass").length;
  const warnCount = result.results.filter((r) => r.status === "warning").length;

  const overallStatus = failCount > 0 ? "fail" : warnCount > 0 ? "warning" : "pass";
  const avgConfidence = result.results.length > 0
    ? result.results.reduce((sum, r) => sum + r.confidence, 0) / result.results.length
    : 0;

  return (
    <div className="space-y-4">
      {/* Summary header */}
      <div className="flex items-start justify-between rounded-lg border bg-white/[0.04] p-4">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <OverallStatusBadge status={overallStatus} />
            <span className="text-sm font-semibold text-text-heading">
              AI Compliance Analysis Results
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-red-500" />
              {criticalCount} critical
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-amber-500" />
              {warningCount} warning
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-blue-500" />
              {infoCount} info
            </span>
            <span className="text-text-muted">|</span>
            <span className="text-text-tertiary">
              {passCount} pass / {warnCount} warn / {failCount} fail
            </span>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-text-tertiary">
            <span>Confidence: {Math.round(avgConfidence * 100)}%</span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {new Date(result.metadata.timestamp).toLocaleString()}
            </span>
            <span>
              {result.metadata.durationMs.toLocaleString()}ms
            </span>
            {result.metadata.totalTokens && (
              <span>{result.metadata.totalTokens.toLocaleString()} tokens</span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 text-xs"
            onClick={() => {
              const project = projects.find((p) => p.id === result.projectId);
              exportCompliancePdf(result, project?.name ?? result.projectId);
            }}
          >
            <Download className="h-3 w-3" />
            Download PDF
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={onRerun}>
            <RefreshCw className="h-3 w-3" />
            Re-run
          </Button>
        </div>
      </div>

      {/* Results by requirement */}
      <ScrollArea className="max-h-[600px]">
        <div className="space-y-4">
          {result.results.map((checkResult) => (
            <div key={checkResult.requirementId} className="rounded-lg border">
              {/* Check header */}
              <div className="flex items-center justify-between border-b bg-white/[0.04] px-4 py-2">
                <div className="flex items-center gap-2">
                  <CheckStatusBadge status={checkResult.status} />
                  <span className="text-sm font-medium text-text-heading">
                    {checkResult.requirementId}
                  </span>
                  <span className="text-xs text-text-tertiary">
                    {Math.round(checkResult.confidence * 100)}% confidence
                  </span>
                </div>
                <span className="text-xs text-text-tertiary">
                  {checkResult.findings.length} finding{checkResult.findings.length !== 1 ? "s" : ""}
                </span>
              </div>

              {/* Summary */}
              <div className="px-4 py-2 text-xs text-text-secondary">
                {checkResult.summary}
              </div>

              {/* Findings */}
              {checkResult.findings.length > 0 && (
                <div className="space-y-2 px-4 pb-3">
                  {checkResult.findings.map((finding) => (
                    <AiFindingCard key={finding.id} finding={finding} />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Model info */}
      <div className="flex flex-wrap items-center gap-2 text-[11px] text-text-muted">
        <span>Model: {result.metadata.model}</span>
        <span>|</span>
        <span>Regulations: {result.metadata.regulationsLoaded.length}</span>
      </div>
    </div>
  );
}

function OverallStatusBadge({ status }: { status: string }) {
  const config: Record<string, { label: string; className: string }> = {
    pass: { label: "Compliant", className: "bg-primary/15 text-primary border-primary/25" },
    warning: { label: "Issues Found", className: "bg-status-warning/20 text-status-warning-light border-status-warning/25" },
    fail: { label: "Non-Compliant", className: "bg-status-error/15 text-palette-red-400 border-status-error/25" },
  };
  const cfg = config[status] ?? config.warning;
  return <Badge variant="outline" className={cfg.className}>{cfg.label}</Badge>;
}

function CheckStatusBadge({ status }: { status: string }) {
  const config: Record<string, string> = {
    pass: "bg-primary/15 text-primary border-primary/25",
    warning: "bg-status-warning/20 text-status-warning-light border-status-warning/25",
    fail: "bg-status-error/15 text-palette-red-400 border-status-error/25",
    not_applicable: "bg-white/[0.06] text-text-tertiary border-white/[0.08]",
  };
  return (
    <Badge variant="outline" className={`text-[10px] ${config[status] ?? config.warning}`}>
      {status.toUpperCase().replace("_", " ")}
    </Badge>
  );
}
