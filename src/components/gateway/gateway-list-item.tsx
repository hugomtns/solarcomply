"use client";

import Link from "next/link";
import { CheckCircle, XCircle, Clock, ShieldOff, Circle, ChevronRight } from "lucide-react";
import { ComplianceScoreRing } from "@/components/shared/compliance-score-ring";
import { StatusBadge } from "@/components/shared/status-badge";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import type { Gateway } from "@/lib/types";

interface GatewayListItemProps {
  gateway: Gateway;
  isCurrent: boolean;
}

const statusIcons: Record<string, typeof CheckCircle> = {
  passed: CheckCircle,
  blocked: XCircle,
  in_review: Clock,
  waived: ShieldOff,
  upcoming: Circle,
};

const statusAccent: Record<string, string> = {
  passed: "bg-primary",
  blocked: "bg-red-500",
  in_review: "bg-status-warning",
  waived: "bg-purple-500",
  upcoming: "bg-text-disabled",
};

function formatDate(dateStr?: string): string {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function GatewayListItem({ gateway, isCurrent }: GatewayListItemProps) {
  const Icon = statusIcons[gateway.status] || Circle;
  const passCount = gateway.requirements.filter((r) => r.status === "pass").length;
  const total = gateway.requirements.length;
  const progress = total > 0 ? (passCount / total) * 100 : 0;

  return (
    <Link
      href={`/project/${gateway.projectId}/gateway/${gateway.id}`}
      className="group block"
    >
      <div className={`relative overflow-hidden flex items-center gap-4 rounded-2xl bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-xl border p-4 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.4)] transition-all duration-300 hover:border-white/[0.12] hover:shadow-[0_8px_24px_-4px_rgba(0,0,0,0.5)] ${isCurrent ? "border-status-warning/30 shadow-[0_0_20px_rgba(245,158,11,0.08)]" : "border-border"}`}>
        {/* Left accent bar */}
        <div className={`absolute left-0 top-0 bottom-0 w-[3px] ${statusAccent[gateway.status] || statusAccent.upcoming}`} />

        {/* Score ring */}
        <div className="ml-2">
          <ComplianceScoreRing score={gateway.complianceScore} size="sm" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-white group-hover:text-primary transition-colors font-display">
              {gateway.code}: {gateway.name}
            </span>
            <StatusBadge status={gateway.status} />
            {isCurrent && (
              <Badge className="bg-status-warning/15 text-status-warning-light border-status-warning/25 text-[10px]">
                Current
              </Badge>
            )}
          </div>
          <p className="mt-0.5 text-xs text-text-muted truncate">
            {gateway.description}
          </p>
          <div className="mt-2 flex items-center gap-4">
            <div className="flex items-center gap-2 min-w-[140px]">
              <Progress value={progress} className="h-1.5 w-20" />
              <span className="text-[11px] text-text-muted">
                {passCount}/{total} requirements
              </span>
            </div>
            {gateway.approvals.length > 0 && (
              <span className="text-[11px] text-text-disabled">
                {gateway.approvals.filter((a) => a.status === "approved").length}/{gateway.approvals.length} approvals
              </span>
            )}
            {gateway.targetDate && (
              <span className="text-[11px] text-text-disabled">
                Target: {formatDate(gateway.targetDate)}
              </span>
            )}
            {gateway.completedDate && (
              <span className="text-[11px] text-primary">
                Completed: {formatDate(gateway.completedDate)}
              </span>
            )}
          </div>
        </div>

        {/* Arrow */}
        <ChevronRight className="h-5 w-5 text-text-disabled transition-all group-hover:translate-x-0.5 group-hover:text-primary" />
      </div>
    </Link>
  );
}
