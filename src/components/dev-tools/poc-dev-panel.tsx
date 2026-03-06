"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { usePoc } from "@/contexts/poc-context";
import { useApp } from "@/contexts/app-context";
import { projects } from "@/data/projects";
import { Wrench, ChevronDown, FileText, Zap, Trash2, Eye } from "lucide-react";

export function PocDevPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [showJson, setShowJson] = useState(false);
  const poc = usePoc();
  const { selectedProjectId } = useApp();
  const project = projects.find((p) => p.id === selectedProjectId);

  const resultCount = Object.keys(poc.complianceResults).length;
  const currentResult = poc.complianceResults[selectedProjectId];

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Floating button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="h-12 w-12 rounded-full bg-status-special shadow-lg hover:bg-status-special/80"
          size="icon"
        >
          <Wrench className="h-5 w-5 text-white" />
        </Button>
      )}

      {/* Panel */}
      {isOpen && (
        <div className="w-96 rounded-lg border border-white/[0.08] bg-surface-page shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/[0.08] bg-status-special/15 px-4 py-2.5 rounded-t-lg">
            <div className="flex items-center gap-2">
              <Wrench className="h-4 w-4 text-palette-purple-400" />
              <span className="text-sm font-semibold text-text-heading">POC Dev Tools</span>
              <Badge variant="outline" className="text-xs bg-status-special/20 text-palette-purple-400">
                G8 AI
              </Badge>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => setIsOpen(false)}
            >
              <ChevronDown className="h-4 w-4" />
            </Button>
          </div>

          {/* Content */}
          <div className="space-y-3 p-4">
            {/* Project info */}
            <div className="text-xs text-text-tertiary">
              Project: <span className="font-medium text-text-heading">{project?.name ?? "None"}</span>
              {project && (
                <span className="ml-1 text-text-muted">
                  [{project.jurisdictions.join(", ")}]
                </span>
              )}
            </div>

            {/* Synthetic doc */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-text-secondary">Synthetic Report</span>
                <Badge variant="outline" className={`text-xs ${poc.syntheticDoc ? "bg-primary/15 text-primary" : "bg-surface-glass text-text-tertiary"}`}>
                  {poc.syntheticDoc ? "Generated" : "Not generated"}
                </Badge>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full gap-1.5 text-xs"
                onClick={() => project && poc.generateSyntheticDoc(project.id)}
                disabled={!project}
              >
                <FileText className="h-3 w-3" />
                Generate Report
              </Button>
            </div>

            {/* AI Check */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-text-secondary">AI Compliance Check</span>
                <Badge variant="outline" className={`text-xs ${resultCount > 0 ? "bg-status-info/15 text-palette-blue-400" : "bg-surface-glass text-text-tertiary"}`}>
                  {resultCount} result{resultCount !== 1 ? "s" : ""} cached
                </Badge>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 gap-1.5 text-xs"
                  onClick={() => {
                    if (project) {
                      poc.runAllAiChecks(project.id, "G8", project.jurisdictions);
                    }
                  }}
                  disabled={!project || poc.isChecking}
                >
                  <Zap className="h-3 w-3" />
                  {poc.isChecking ? "Running..." : "Run All AI Checks"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5 text-xs text-status-error hover:text-status-error/80"
                  onClick={poc.clearResults}
                  disabled={resultCount === 0}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>

            {/* Error */}
            {poc.checkError && (
              <div className="rounded-md bg-status-error/15 px-3 py-2 text-xs text-palette-red-400">
                {poc.checkError}
              </div>
            )}

            {/* Token usage */}
            {poc.tokenUsage.calls > 0 && (
              <div className="rounded-md bg-surface-glass px-3 py-2">
                <div className="flex justify-between text-xs text-text-tertiary">
                  <span>API calls: {poc.tokenUsage.calls}</span>
                  <span>Total tokens: {poc.tokenUsage.total.toLocaleString()}</span>
                </div>
                {currentResult && (
                  <div className="mt-1 text-xs text-text-tertiary">
                    Duration: {currentResult.metadata.durationMs.toLocaleString()}ms
                  </div>
                )}
              </div>
            )}

            {/* Results summary */}
            {currentResult && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-text-secondary">
                    Results ({currentResult.results.length} checks)
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 gap-1 text-xs"
                    onClick={() => setShowJson(!showJson)}
                  >
                    <Eye className="h-3 w-3" />
                    {showJson ? "Hide" : "Raw"}
                  </Button>
                </div>
                <div className="flex gap-2 text-xs">
                  <span className="text-status-error">
                    {currentResult.results.filter((r) => r.status === "fail").length} fail
                  </span>
                  <span className="text-status-warning">
                    {currentResult.results.filter((r) => r.status === "warning").length} warning
                  </span>
                  <span className="text-primary">
                    {currentResult.results.filter((r) => r.status === "pass").length} pass
                  </span>
                </div>

                {showJson && (
                  <ScrollArea className="h-48 rounded border border-white/[0.08] bg-surface-page p-2">
                    <pre className="text-[10px] text-primary">
                      {JSON.stringify(currentResult, null, 2)}
                    </pre>
                  </ScrollArea>
                )}
              </div>
            )}

            {/* Regs loaded */}
            {currentResult && (
              <div className="space-y-1">
                <span className="text-xs font-medium text-text-secondary">Regulations loaded</span>
                <div className="flex flex-wrap gap-1">
                  {currentResult.metadata.regulationsLoaded.map((r, i) => (
                    <Badge key={i} variant="outline" className="text-[10px]">
                      {r.split("(")[0].trim()}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
