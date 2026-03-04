"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { LIFECYCLE_STAGE_LABELS } from "@/lib/constants";
import type { GatewayReferenceDefinition } from "@/lib/types";

interface GatewayRefCardProps {
  gateway: GatewayReferenceDefinition;
  isSelected: boolean;
  onClick: () => void;
}

export function GatewayRefCard({ gateway, isSelected, onClick }: GatewayRefCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full text-left rounded-lg border p-3 transition-colors hover:bg-gray-50",
        isSelected ? "border-[#2E75B6] bg-blue-50/50 ring-1 ring-[#2E75B6]" : "border-gray-200"
      )}
    >
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-semibold text-[#1B2A4A]">{gateway.code}</span>
        <div className="flex items-center gap-1.5">
          {gateway.isSolarComplyExtension && (
            <Badge variant="outline" className="text-[9px] px-1.5 py-0 bg-purple-50 text-purple-700 border-purple-200">
              SPE Extension
            </Badge>
          )}
          <Badge variant="outline" className="text-[9px] px-1.5 py-0 bg-gray-50 text-gray-600 border-gray-200">
            {gateway.requirements.length} req
          </Badge>
        </div>
      </div>
      <p className="text-xs font-medium text-gray-700 leading-tight">{gateway.name}</p>
      <p className="text-[10px] text-gray-400 mt-1">
        {LIFECYCLE_STAGE_LABELS[gateway.lifecycleStage]} &middot; {gateway.duration}
      </p>
    </button>
  );
}
