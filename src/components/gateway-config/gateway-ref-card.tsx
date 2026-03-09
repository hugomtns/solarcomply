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
        "w-full text-left rounded-lg border p-3 transition-colors hover:bg-surface-glass",
        isSelected ? "border-brand-blue bg-status-info/10 ring-1 ring-brand-blue" : "border-white/[0.08]"
      )}
    >
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-semibold text-white">{gateway.code}</span>
        <div className="flex items-center gap-1.5">
          {gateway.isSolarComplyExtension && (
            <Badge variant="outline" className="text-[9px] px-1.5 py-0 bg-status-special/15 text-palette-purple-400 border-status-special/25">
              SPE Extension
            </Badge>
          )}
          <Badge variant="outline" className="text-[9px] px-1.5 py-0 bg-white/[0.06] text-text-tertiary border-white/[0.08]">
            {gateway.requirements.length} req
          </Badge>
        </div>
      </div>
      <p className="text-xs font-medium text-text-secondary leading-tight">{gateway.name}</p>
      <p className="text-[10px] text-text-disabled mt-1">
        {LIFECYCLE_STAGE_LABELS[gateway.lifecycleStage]} &middot; {gateway.duration}
      </p>
    </button>
  );
}
