"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LIFECYCLE_STAGE_LABELS } from "@/lib/constants";
import { Clock, Target, Layers, FileText } from "lucide-react";
import { RequirementsReferenceTable } from "./requirements-reference-table";
import { ApprovalMatrixTable } from "./approval-matrix-table";
import type { GatewayReferenceDefinition } from "@/lib/types";

interface GatewayRefDetailProps {
  gateway: GatewayReferenceDefinition;
}

export function GatewayRefDetail({ gateway }: GatewayRefDetailProps) {
  return (
    <div className="space-y-4">
      {/* Metadata Card */}
      <Card className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-lg font-semibold text-white">
              {gateway.code} — {gateway.name}
            </h3>
            {gateway.speGatewayRef && (
              <p className="text-xs text-slate-400 mt-0.5">SPE: {gateway.speGatewayRef}</p>
            )}
          </div>
          <div className="flex items-center gap-1.5">
            {gateway.isSolarComplyExtension && (
              <Badge variant="outline" className="text-[10px] bg-purple-50 text-purple-700 border-purple-200">
                SolarComply Extension
              </Badge>
            )}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 rounded-lg bg-white/[0.04] p-2.5">
            <Layers className="h-4 w-4 shrink-0 text-[#2E75B6]" />
            <div className="min-w-0">
              <p className="text-[10px] text-slate-500">Lifecycle Stage</p>
              <p className="text-xs font-medium text-slate-300">
                {LIFECYCLE_STAGE_LABELS[gateway.lifecycleStage]}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-white/[0.04] p-2.5">
            <Clock className="h-4 w-4 shrink-0 text-[#2E75B6]" />
            <div className="min-w-0">
              <p className="text-[10px] text-slate-500">Duration</p>
              <p className="text-xs font-medium text-slate-300">{gateway.duration}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-white/[0.04] p-2.5 col-span-2">
            <Target className="h-4 w-4 shrink-0 text-[#2E75B6]" />
            <div className="min-w-0">
              <p className="text-[10px] text-slate-500">Trigger</p>
              <p className="text-xs font-medium text-slate-300">{gateway.trigger}</p>
            </div>
            <div className="ml-auto flex items-center gap-2 shrink-0 rounded-lg bg-white/[0.05] px-3 py-1.5 border border-white/[0.04]">
              <FileText className="h-4 w-4 text-[#2E75B6]" />
              <div>
                <p className="text-[10px] text-slate-500">Requirements</p>
                <p className="text-xs font-medium text-slate-300">{gateway.requirements.length} items</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Requirements Table */}
      <Card className="overflow-hidden">
        <div className="p-4 pb-2">
          <h4 className="text-sm font-semibold text-white">Required Documents & Data</h4>
          <p className="text-xs text-slate-400 mt-0.5">Click a row to expand details</p>
        </div>
        <RequirementsReferenceTable requirements={gateway.requirements} />
      </Card>

      {/* Approval Matrix */}
      <Card>
        <div className="p-4 pb-2">
          <h4 className="text-sm font-semibold text-white">Gateway Approval Matrix</h4>
        </div>
        <ApprovalMatrixTable approvals={gateway.approvalMatrix} />
      </Card>
    </div>
  );
}
