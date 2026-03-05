"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, Clock, ShieldOff } from "lucide-react";
import { Gateway } from "@/lib/types";
import { COLORS } from "@/lib/constants";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface GatewayCardProps {
  gateway: Gateway;
  isCurrent: boolean;
  isLast: boolean;
}

const statusConfig: Record<
  string,
  { color: string; icon: typeof CheckCircle; fillClass: string; ringClass: string }
> = {
  passed: {
    color: COLORS.status.passed,
    icon: CheckCircle,
    fillClass: "bg-[#00B0A0]",
    ringClass: "ring-[#00B0A0]/20",
  },
  blocked: {
    color: COLORS.status.blocked,
    icon: XCircle,
    fillClass: "bg-[#EF4444]",
    ringClass: "ring-[#EF4444]/20",
  },
  in_review: {
    color: COLORS.status.inReview,
    icon: Clock,
    fillClass: "bg-[#F59E0B]",
    ringClass: "ring-[#F59E0B]/20",
  },
  waived: {
    color: COLORS.status.waived,
    icon: ShieldOff,
    fillClass: "bg-[#8B5CF6]",
    ringClass: "ring-[#8B5CF6]/20",
  },
  upcoming: {
    color: COLORS.status.upcoming,
    icon: Clock,
    fillClass: "bg-slate-800",
    ringClass: "",
  },
};

function formatDate(dateStr?: string): string {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function GatewayCard({ gateway, isCurrent, isLast }: GatewayCardProps) {
  const config = statusConfig[gateway.status] || statusConfig.upcoming;
  const Icon = config.icon;
  const circleSize = isCurrent ? 64 : 48;
  const isUpcoming = gateway.status === "upcoming";
  const isPassed = gateway.status === "passed";

  const nodeBox = 64;

  const passCount = gateway.requirements.filter((r) => r.status === "pass").length;
  const totalReqs = gateway.requirements.length;

  return (
    <div className="flex items-start">
      {/* Circle column */}
      <div
        className="flex flex-shrink-0 flex-col items-center"
        style={{ width: nodeBox }}
      >
        <div
          className="flex items-center justify-center flex-shrink-0"
          style={{ width: nodeBox, height: nodeBox }}
        >
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href={`/project/${gateway.projectId}/gateway/${gateway.id}`}
                className="group relative"
              >
                {isCurrent ? (
                  <motion.div
                    className={`relative flex items-center justify-center rounded-full ${config.fillClass} ${config.ringClass}`}
                    style={{ width: circleSize, height: circleSize }}
                    animate={{
                      boxShadow: [
                        `0 0 0 0px ${config.color}40`,
                        `0 0 0 10px ${config.color}00`,
                      ],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeOut",
                    }}
                  >
                    <Icon className="h-7 w-7 text-white" />
                  </motion.div>
                ) : (
                  <div
                    className={`flex items-center justify-center rounded-full transition-all duration-200 group-hover:scale-110 ${
                      isUpcoming
                        ? "border-2 border-slate-600 bg-slate-800"
                        : config.fillClass
                    }`}
                    style={{ width: circleSize, height: circleSize }}
                  >
                    {isUpcoming ? (
                      <span className="text-xs font-semibold text-slate-500">
                        {gateway.code}
                      </span>
                    ) : (
                      <Icon className="h-5 w-5 text-white" />
                    )}
                  </div>
                )}
              </Link>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="max-w-[200px]">
              <p className="font-semibold">{gateway.code}: {gateway.name}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {passCount}/{totalReqs} requirements passed
              </p>
              {gateway.complianceScore > 0 && (
                <p className="text-xs mt-0.5">Score: {gateway.complianceScore}%</p>
              )}
              {gateway.targetDate && (
                <p className="text-xs text-muted-foreground">Target: {formatDate(gateway.targetDate)}</p>
              )}
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Label below node */}
        <div className="mt-2 flex w-20 flex-col items-center text-center">
          <span className="text-[11px] font-semibold text-slate-300" style={{ fontFamily: 'var(--font-heading)' }}>
            {gateway.code}
          </span>
          <span className="line-clamp-2 text-[10px] leading-tight text-slate-500">
            {gateway.name}
          </span>
          {gateway.completedDate && (
            <span className="mt-0.5 text-[9px] text-slate-600">
              {formatDate(gateway.completedDate)}
            </span>
          )}
          {gateway.complianceScore > 0 && (
            <span
              className="mt-0.5 text-[9px] font-medium"
              style={{
                color:
                  gateway.complianceScore >= 80
                    ? COLORS.status.passed
                    : gateway.complianceScore >= 60
                      ? COLORS.status.inReview
                      : COLORS.status.blocked,
              }}
            >
              {gateway.complianceScore}%
            </span>
          )}
        </div>
      </div>

      {/* Gradient connecting line */}
      {!isLast && (
        <div
          className="h-0.5 w-12 flex-shrink-0 rounded-full"
          style={{
            marginTop: nodeBox / 2,
            background: isPassed
              ? `linear-gradient(to right, ${COLORS.status.passed}, ${COLORS.status.passed}80)`
              : "linear-gradient(to right, rgba(148,163,184,0.15), rgba(148,163,184,0.05))",
          }}
        />
      )}
    </div>
  );
}
