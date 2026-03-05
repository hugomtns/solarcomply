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
    border: "border-red-200",
    bg: "bg-red-50",
    badge: "bg-red-100 text-red-800 border-red-200",
    iconColor: "text-red-600",
  },
  warning: {
    icon: AlertTriangle,
    border: "border-amber-200",
    bg: "bg-amber-50",
    badge: "bg-amber-100 text-amber-800 border-amber-200",
    iconColor: "text-amber-600",
  },
  info: {
    icon: Info,
    border: "border-blue-200",
    bg: "bg-blue-50",
    badge: "bg-blue-100 text-blue-800 border-blue-200",
    iconColor: "text-blue-600",
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
            <span className="text-sm font-medium text-slate-200">{finding.title}</span>
            <Badge variant="outline" className={`text-[10px] ${config.badge}`}>
              {finding.severity}
            </Badge>
          </div>

          {/* Description */}
          <p className="mt-1 text-xs leading-relaxed text-slate-300">
            {finding.description}
          </p>

          {/* Document section reference */}
          {finding.documentSection && (
            <p className="mt-1.5 text-[11px] text-slate-400">
              Report section: <span className="font-medium">{finding.documentSection}</span>
            </p>
          )}

          {/* Citations */}
          {finding.citations.length > 0 && (
            <div className="mt-2 space-y-0.5">
              <p className="text-[11px] font-medium text-slate-400">Regulation references:</p>
              {finding.citations.map((citation, i) => (
                <RegulationCitation key={i} citation={citation} />
              ))}
            </div>
          )}

          {/* Recommendation */}
          <div className="mt-2 rounded bg-white/80 px-2.5 py-1.5 text-xs text-slate-200">
            <span className="font-medium">Recommendation:</span> {finding.recommendation}
          </div>
        </div>
      </div>
    </div>
  );
}
