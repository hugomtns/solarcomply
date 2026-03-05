"use client";

import { use, useState } from "react";
import Link from "next/link";
import { StatusBadge } from "@/components/shared/status-badge";
import { ComplianceScoreRing } from "@/components/shared/compliance-score-ring";
import { Button } from "@/components/ui/button";
import { RequirementsChecklist } from "@/components/gateway/requirements-checklist";
import { ApprovalPanel } from "@/components/gateway/approval-panel";
import { gateways } from "@/data/gateways";
import { projects } from "@/data/projects";
import { Sparkles, ArrowRight } from "lucide-react";
import type { GatewayRequirement } from "@/lib/types";
import { WaiverDialog } from "@/components/gateway/waiver-dialog";
import { useApp } from "@/contexts/app-context";
import { useRouter } from "next/navigation";

interface GatewayPageProps {
  params: Promise<{ projectId: string; gatewayId: string }>;
}

export default function GatewayPage({ params }: GatewayPageProps) {
  const { projectId, gatewayId } = use(params);
  const gateway = gateways.find(
    (g) => g.id === gatewayId && g.projectId === projectId
  );
  const project = projects.find((p) => p.id === projectId);
  const { setAiContext } = useApp();
  const router = useRouter();

  const [waiverReq, setWaiverReq] = useState<GatewayRequirement | null>(null);

  if (!gateway) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <h1 className="text-2xl font-semibold text-gray-900">
          Gateway Not Found
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          The gateway you are looking for does not exist or you do not have
          access to it.
        </p>
      </div>
    );
  }

  const handleAnalyzeWithAI = () => {
    setAiContext({ type: "gateway", id: gatewayId });
    router.push(`/project/${projectId}/ai`);
  };

  return (
    <div className="animate-fade-in space-y-6">
      {/* Page header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <ComplianceScoreRing score={gateway.complianceScore} size="lg" />
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold text-[#1B2A4A]">
                {gateway.code}: {gateway.name}
              </h1>
              <StatusBadge status={gateway.status} />
            </div>
            <p className="mt-1 text-sm text-gray-500">
              {gateway.description}
            </p>
            <div className="mt-2 flex items-center gap-4 text-xs text-gray-400">
              {gateway.targetDate && (
                <span>
                  Target:{" "}
                  {new Date(gateway.targetDate).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              )}
              {gateway.completedDate && (
                <span>
                  Completed:{" "}
                  {new Date(gateway.completedDate).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              )}
              <span>
                {gateway.requirements.length} requirements
                {" \u00B7 "}
                {gateway.approvals.length} approvals
              </span>
            </div>
          </div>
        </div>

        {/* Analyze with AI button */}
        <Button
          onClick={handleAnalyzeWithAI}
          variant="outline"
          size="sm"
          className="gap-2 border-purple-200 text-purple-700 hover:bg-purple-50"
        >
          <Sparkles className="h-4 w-4" />
          Analyze with AI
          <ArrowRight className="h-3.5 w-3.5" />
        </Button>
      </div>

      {/* Requirements section */}
      <div>
        <h2 className="mb-3 text-lg font-semibold text-[#1B2A4A]">Requirements</h2>
        <RequirementsChecklist
          requirements={gateway.requirements}
          projectId={projectId}
          onRequestWaiver={(req) => setWaiverReq(req)}
          onViewAiAnalysis={handleAnalyzeWithAI}
        />
      </div>

      {/* Approvals section */}
      {gateway.approvals.length > 0 && (
        <div>
          <h2 className="mb-3 text-lg font-semibold text-[#1B2A4A]">Approvals</h2>
          <ApprovalPanel approvals={gateway.approvals} />
        </div>
      )}

      {/* Waiver dialog */}
      {waiverReq && (
        <WaiverDialog
          requirement={waiverReq}
          open={!!waiverReq}
          onOpenChange={(open) => {
            if (!open) setWaiverReq(null);
          }}
          onWaiver={(data) => {
            console.log("Waiver submitted:", data);
            setWaiverReq(null);
          }}
        />
      )}
    </div>
  );
}
