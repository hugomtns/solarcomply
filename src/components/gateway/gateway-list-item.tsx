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
      <div className={`flex items-center gap-4 rounded-xl border bg-white p-4 shadow-card transition-all duration-200 hover:shadow-card-hover ${isCurrent ? "ring-2 ring-orange-400/50 border-orange-200" : "border-gray-200"}`}>
        {/* Score ring */}
        <ComplianceScoreRing score={gateway.complianceScore} size="sm" />

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-[#1B2A4A]">
              {gateway.code}: {gateway.name}
            </span>
            <StatusBadge status={gateway.status} />
            {isCurrent && (
              <Badge className="bg-orange-100 text-orange-700 border-orange-200 text-[10px]">
                Current
              </Badge>
            )}
          </div>
          <p className="mt-0.5 text-xs text-gray-500 truncate">
            {gateway.description}
          </p>
          <div className="mt-2 flex items-center gap-4">
            <div className="flex items-center gap-2 min-w-[140px]">
              <Progress value={progress} className="h-1.5 w-20" />
              <span className="text-[11px] text-gray-500">
                {passCount}/{total} requirements
              </span>
            </div>
            {gateway.approvals.length > 0 && (
              <span className="text-[11px] text-gray-400">
                {gateway.approvals.filter((a) => a.status === "approved").length}/{gateway.approvals.length} approvals
              </span>
            )}
            {gateway.targetDate && (
              <span className="text-[11px] text-gray-400">
                Target: {formatDate(gateway.targetDate)}
              </span>
            )}
            {gateway.completedDate && (
              <span className="text-[11px] text-emerald-600">
                Completed: {formatDate(gateway.completedDate)}
              </span>
            )}
          </div>
        </div>

        {/* Arrow */}
        <ChevronRight className="h-5 w-5 text-gray-300 transition-transform group-hover:translate-x-0.5" />
      </div>
    </Link>
  );
}
