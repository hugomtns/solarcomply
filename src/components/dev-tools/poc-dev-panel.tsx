"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { usePoc } from "@/contexts/poc-context";
import { useApp } from "@/contexts/app-context";
import { projects } from "@/data/projects";
import { Wrench, ChevronDown, ChevronUp, FileText, Zap, Trash2, Eye } from "lucide-react";

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
          className="h-12 w-12 rounded-full bg-purple-600 shadow-lg hover:bg-purple-700"
          size="icon"
        >
          <Wrench className="h-5 w-5 text-white" />
        </Button>
      )}

      {/* Panel */}
      {isOpen && (
        <div className="w-96 rounded-lg border bg-white shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b bg-purple-50 px-4 py-2.5">
            <div className="flex items-center gap-2">
              <Wrench className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-semibold text-purple-900">POC Dev Tools</span>
              <Badge variant="outline" className="text-xs bg-purple-100 text-purple-700">
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
            <div className="text-xs text-gray-500">
              Project: <span className="font-medium text-gray-900">{project?.name ?? "None"}</span>
              {project && (
                <span className="ml-1 text-gray-400">
                  [{project.jurisdictions.join(", ")}]
                </span>
              )}
            </div>

            {/* Synthetic doc */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-700">Synthetic Report</span>
                <Badge variant="outline" className={`text-xs ${poc.syntheticDoc ? "bg-green-50 text-green-700" : "bg-gray-50 text-gray-500"}`}>
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
                <span className="text-xs font-medium text-gray-700">AI Compliance Check</span>
                <Badge variant="outline" className={`text-xs ${resultCount > 0 ? "bg-blue-50 text-blue-700" : "bg-gray-50 text-gray-500"}`}>
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
                  className="gap-1.5 text-xs text-red-600 hover:text-red-700"
                  onClick={poc.clearResults}
                  disabled={resultCount === 0}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>

            {/* Error */}
            {poc.checkError && (
              <div className="rounded-md bg-red-50 px-3 py-2 text-xs text-red-700">
                {poc.checkError}
              </div>
            )}

            {/* Token usage */}
            {poc.tokenUsage.calls > 0 && (
              <div className="rounded-md bg-gray-50 px-3 py-2">
                <div className="flex justify-between text-xs text-gray-600">
                  <span>API calls: {poc.tokenUsage.calls}</span>
                  <span>Total tokens: {poc.tokenUsage.total.toLocaleString()}</span>
                </div>
                {currentResult && (
                  <div className="mt-1 text-xs text-gray-500">
                    Duration: {currentResult.metadata.durationMs.toLocaleString()}ms
                  </div>
                )}
              </div>
            )}

            {/* Results summary */}
            {currentResult && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-700">
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
                  <span className="text-red-600">
                    {currentResult.results.filter((r) => r.status === "fail").length} fail
                  </span>
                  <span className="text-amber-600">
                    {currentResult.results.filter((r) => r.status === "warning").length} warning
                  </span>
                  <span className="text-green-600">
                    {currentResult.results.filter((r) => r.status === "pass").length} pass
                  </span>
                </div>

                {showJson && (
                  <ScrollArea className="h-48 rounded border bg-gray-950 p-2">
                    <pre className="text-[10px] text-green-400">
                      {JSON.stringify(currentResult, null, 2)}
                    </pre>
                  </ScrollArea>
                )}
              </div>
            )}

            {/* Regs loaded */}
            {currentResult && (
              <div className="space-y-1">
                <span className="text-xs font-medium text-gray-700">Regulations loaded</span>
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
