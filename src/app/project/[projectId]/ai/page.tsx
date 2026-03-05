"use client";

import { use, useState, useCallback } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScanOverlay } from "@/components/doc-intelligence/scan-overlay";
import { HealthDashboard } from "@/components/doc-intelligence/health-dashboard";
import { FindingsList } from "@/components/doc-intelligence/findings-list";
import { GatewayCoverageMatrix } from "@/components/doc-intelligence/gateway-coverage-matrix";
import { FindingDetailSheet } from "@/components/doc-intelligence/finding-detail-sheet";
import { ChatInterface } from "@/components/compliance-ai/chat-interface";
import { GapReportPreview } from "@/components/compliance-ai/gap-report-preview";
import { getProjectFindings, getProjectHealthScore, getGatewayCoverage } from "@/data/doc-intelligence";
import { useApp } from "@/contexts/app-context";
import { Sparkles, BarChart3, MessageSquare, FileBarChart, Clock, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { DocIntelligenceFinding, CheckStatus } from "@/lib/types";

const mockGapItems: { standard: string; requirement: string; status: CheckStatus; action: string }[] = [
  { standard: "IEC 62446-1", requirement: "System documentation package", status: "pass", action: "No action required" },
  { standard: "IEC 61724-1", requirement: "Monitoring system specification", status: "pass", action: "No action required" },
  { standard: "IEC 62548", requirement: "Array design documentation", status: "warning", action: "Review array string sizing calculations" },
  { standard: "IEC 61215", requirement: "Module qualification certificates", status: "pass", action: "No action required" },
  { standard: "IEC 62109-1", requirement: "Inverter safety compliance", status: "fail", action: "Obtain updated inverter safety certificates" },
  { standard: "UL 9540A", requirement: "BESS thermal runaway testing", status: "pending", action: "Schedule thermal runaway test" },
  { standard: "NFPA 855", requirement: "Fire safety compliance", status: "warning", action: "Update fire safety plan for latest NFPA 855 edition" },
  { standard: "IEEE 1547", requirement: "Grid interconnection compliance", status: "pass", action: "No action required" },
];

const quickPrompts = [
  "What fire safety standards apply to our BESS?",
  "Is our PAC documentation complete?",
  "EU Battery Passport readiness assessment",
  "Show hot commissioning non-conformances",
  "PR trend analysis vs. guarantee",
];

export default function AIHubPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = use(params);
  const { aiContext } = useApp();

  // Determine initial tab from AI context
  const initialTab = aiContext?.type === "chat" ? "chat" : "dashboard";
  const [activeTab, setActiveTab] = useState(initialTab);

  // Dashboard state
  const [scanComplete, setScanComplete] = useState(false);
  const [selectedFinding, setSelectedFinding] = useState<DocIntelligenceFinding | null>(null);

  const findings = getProjectFindings(projectId);
  const healthScore = getProjectHealthScore(projectId);
  const coverage = getGatewayCoverage(projectId);

  const handleScanComplete = useCallback(() => {
    setScanComplete(true);
  }, []);

  return (
    <div className="animate-fade-in flex flex-col" style={{ height: "calc(100vh - 7.5rem)" }}>
      <PageHeader
        title="AI Hub"
        description="Document intelligence, compliance chat, and gap analysis"
      >
        <div className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 border border-emerald-200">
          <Sparkles className="h-3 w-3" />
          AI-Powered
        </div>
      </PageHeader>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
        <TabsList className="shrink-0">
          <TabsTrigger value="dashboard" className="gap-1.5">
            <BarChart3 className="h-4 w-4" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="chat" className="gap-1.5">
            <MessageSquare className="h-4 w-4" />
            Chat
          </TabsTrigger>
          <TabsTrigger value="reports" className="gap-1.5">
            <FileBarChart className="h-4 w-4" />
            Reports
          </TabsTrigger>
        </TabsList>

        {/* Dashboard Tab */}
        <TabsContent value="dashboard" className="flex-1 overflow-y-auto mt-4">
          {!healthScore ? (
            <div className="flex items-center justify-center py-20">
              <p className="text-gray-500">No document intelligence data available for this project.</p>
            </div>
          ) : !scanComplete ? (
            <ScanOverlay onComplete={handleScanComplete} />
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Clock className="h-3 w-3" />
                  Last scan: 2 min ago
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-1.5 text-xs"
                  onClick={() => setScanComplete(false)}
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Re-scan
                </Button>
              </div>
              <HealthDashboard healthScore={healthScore} />
              <FindingsList
                findings={findings}
                onSelectFinding={setSelectedFinding}
              />
              <GatewayCoverageMatrix coverage={coverage} />
              <FindingDetailSheet
                finding={selectedFinding}
                onClose={() => setSelectedFinding(null)}
              />
            </div>
          )}
        </TabsContent>

        {/* Chat Tab */}
        <TabsContent value="chat" className="flex-1 overflow-hidden mt-4">
          <div className="flex h-full gap-4">
            {/* Quick prompts sidebar */}
            <div className="w-72 shrink-0 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-card">
              <div className="p-4">
                <div className="flex items-center gap-2 mb-1">
                  <MessageSquare className="h-4 w-4 text-[#2E75B6]" />
                  <h2 className="text-sm font-semibold text-[#1B2A4A]">Quick Prompts</h2>
                </div>
                <p className="text-[11px] text-gray-500 mb-3">Click to start a conversation</p>
                <Separator className="mb-3" />
                <div className="space-y-2">
                  {quickPrompts.map((prompt) => (
                    <button
                      key={prompt}
                      onClick={() => {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        const submitFn = (window as any).__chatSubmit as
                          | ((q: string) => void)
                          | undefined;
                        if (submitFn) submitFn(prompt);
                      }}
                      className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-left text-sm text-gray-700 transition-colors hover:border-[#2E75B6] hover:bg-blue-50/50"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Chat interface */}
            <div className="flex-1 overflow-hidden">
              <ChatInterface projectId={projectId} />
            </div>
          </div>
        </TabsContent>

        {/* Reports Tab */}
        <TabsContent value="reports" className="flex-1 overflow-y-auto mt-4">
          <div className="space-y-6">
            <GapReportPreview gapItems={mockGapItems} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
