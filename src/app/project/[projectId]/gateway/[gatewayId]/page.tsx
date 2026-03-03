"use client";

import { use, useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { ComplianceScoreRing } from "@/components/shared/compliance-score-ring";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RequirementsChecklist } from "@/components/gateway/requirements-checklist";
import { ApprovalPanel } from "@/components/gateway/approval-panel";
import { DocumentUpload } from "@/components/gateway/document-upload";
import { ComplianceScore } from "@/components/gateway/compliance-score";
import { WaiverDialog } from "@/components/gateway/waiver-dialog";
import { gateways } from "@/data/gateways";
import { ClipboardCheck, Users, FolderOpen } from "lucide-react";
import type { GatewayRequirement } from "@/lib/types";

interface GatewayPageProps {
  params: Promise<{ projectId: string; gatewayId: string }>;
}

export default function GatewayPage({ params }: GatewayPageProps) {
  const { projectId, gatewayId } = use(params);
  const gateway = gateways.find(
    (g) => g.id === gatewayId && g.projectId === projectId
  );

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

  return (
    <>
      {/* Page header */}
      <div className="mb-6 flex items-start justify-between">
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
      </div>

      {/* Tabs */}
      <Tabs defaultValue="requirements">
        <TabsList>
          <TabsTrigger value="requirements" className="gap-1.5">
            <ClipboardCheck className="h-4 w-4" />
            Requirements
          </TabsTrigger>
          <TabsTrigger value="approvals" className="gap-1.5">
            <Users className="h-4 w-4" />
            Approvals
          </TabsTrigger>
          <TabsTrigger value="documents" className="gap-1.5">
            <FolderOpen className="h-4 w-4" />
            Documents
          </TabsTrigger>
        </TabsList>

        <TabsContent value="requirements" className="mt-4">
          <RequirementsChecklist
            requirements={gateway.requirements}
            onRequestWaiver={(req) => setWaiverReq(req)}
          />
        </TabsContent>

        <TabsContent value="approvals" className="mt-4">
          <ApprovalPanel approvals={gateway.approvals} />
        </TabsContent>

        <TabsContent value="documents" className="mt-4">
          <DocumentUpload gatewayId={gatewayId} projectId={projectId} />
        </TabsContent>
      </Tabs>

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
    </>
  );
}
