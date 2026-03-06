"use client";

import { Badge } from "@/components/ui/badge";
import { RegulationCitation } from "./regulation-citation";
import { AlertTriangle, XCircle, Info } from "lucide-react";
import type { ComplianceFinding } from "@/lib/types";

interface AiFindingCardProps {
  finding: ComplianceFinding;
}

const severityConfig = {
  critical: {
    icon: XCircle,
    border: "border-status-error/25",
    bg: "bg-status-error/15",
    badge: "bg-status-error/15 text-palette-red-400 border-status-error/25",
    iconColor: "text-palette-red-400",
  },
  warning: {
    icon: AlertTriangle,
    border: "border-status-warning/25",
    bg: "bg-status-warning/15",
    badge: "bg-status-warning/20 text-status-warning-light border-status-warning/25",
    iconColor: "text-status-warning-light",
  },
  info: {
    icon: Info,
    border: "border-status-info/25",
    bg: "bg-status-info/15",
    badge: "bg-status-info/15 text-palette-blue-400 border-status-info/25",
    iconColor: "text-palette-blue-400",
  },
};

export function AiFindingCard({ finding }: AiFindingCardProps) {
  const config = severityConfig[finding.severity];
  const Icon = config.icon;

  return (
    <div className={`rounded-lg border ${config.border} ${config.bg} p-3`}>
      {/* Header */}
      <div className="flex items-start gap-2">
        <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${config.iconColor}`} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-text-heading">{finding.title}</span>
            <Badge variant="outline" className={`text-[10px] ${config.badge}`}>
              {finding.severity}
            </Badge>
          </div>

          {/* Description */}
          <p className="mt-1 text-xs leading-relaxed text-text-secondary">
            {finding.description}
          </p>

          {/* Document section reference */}
          {finding.documentSection && (
            <p className="mt-1.5 text-[11px] text-text-tertiary">
              Report section: <span className="font-medium">{finding.documentSection}</span>
            </p>
          )}

          {/* Citations */}
          {finding.citations.length > 0 && (
            <div className="mt-2 space-y-0.5">
              <p className="text-[11px] font-medium text-text-tertiary">Regulation references:</p>
              {finding.citations.map((citation, i) => (
                <RegulationCitation key={i} citation={citation} />
              ))}
            </div>
          )}

          {/* Recommendation */}
          <div className="mt-2 rounded bg-white/[0.06] px-2.5 py-1.5 text-xs text-text-heading">
            <span className="font-medium">Recommendation:</span> {finding.recommendation}
          </div>
        </div>
      </div>
    </div>
  );
}
