"use client";

import { useState, useCallback, use } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { ScanOverlay } from "@/components/doc-intelligence/scan-overlay";
import { HealthDashboard } from "@/components/doc-intelligence/health-dashboard";
import { FindingsList } from "@/components/doc-intelligence/findings-list";
import { GatewayCoverageMatrix } from "@/components/doc-intelligence/gateway-coverage-matrix";
import { FindingDetailSheet } from "@/components/doc-intelligence/finding-detail-sheet";
import { getProjectFindings, getProjectHealthScore, getGatewayCoverage } from "@/data/doc-intelligence";
import { DocIntelligenceFinding } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Sparkles, RotateCcw, Clock } from "lucide-react";

export default function DocumentIntelligencePage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = use(params);
  const [scanComplete, setScanComplete] = useState(false);
  const [selectedFinding, setSelectedFinding] = useState<DocIntelligenceFinding | null>(null);

  const findings = getProjectFindings(projectId);
  const healthScore = getProjectHealthScore(projectId);
  const coverage = getGatewayCoverage(projectId);

  const handleScanComplete = useCallback(() => {
    setScanComplete(true);
  }, []);

  const handleRescan = () => {
    setScanComplete(false);
  };

  if (!healthScore) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-gray-500">No document intelligence data available for this project.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Document Intelligence"
        description="AI-powered document analysis, gap detection, and compliance verification"
      >
        <div className="flex items-center gap-2">
          {scanComplete && (
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <Clock className="h-3 w-3" />
              Last scan: 2 min ago
            </div>
          )}
          <div className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 border border-emerald-200">
            <Sparkles className="h-3 w-3" />
            AI-Powered
          </div>
          {scanComplete && (
            <Button
              size="sm"
              variant="outline"
              className="gap-1.5 text-xs"
              onClick={handleRescan}
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Re-scan
            </Button>
          )}
        </div>
      </PageHeader>

      {!scanComplete ? (
        <ScanOverlay onComplete={handleScanComplete} />
      ) : (
        <>
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
        </>
      )}
    </div>
  );
}
