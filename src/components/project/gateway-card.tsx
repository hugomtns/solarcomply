"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, Clock, ShieldOff } from "lucide-react";
import { Gateway } from "@/lib/types";
import { COLORS } from "@/lib/constants";

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
    fillClass: "bg-white",
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
  const size = isCurrent ? 56 : 40;
  const isUpcoming = gateway.status === "upcoming";

  return (
    <div className="flex flex-col items-center">
      {/* Node + connector row */}
      <div className="flex items-center">
        <Link
          href={`/project/${gateway.projectId}/gateway/${gateway.id}`}
          className="group relative flex-shrink-0"
        >
          {isCurrent ? (
            <motion.div
              className={`relative flex items-center justify-center rounded-full ${config.fillClass} ${config.ringClass}`}
              style={{ width: size, height: size }}
              animate={{
                boxShadow: [
                  `0 0 0 0px ${config.color}40`,
                  `0 0 0 8px ${config.color}00`,
                ],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeOut",
              }}
            >
              <Icon className="h-6 w-6 text-white" />
            </motion.div>
          ) : (
            <div
              className={`flex items-center justify-center rounded-full transition-transform group-hover:scale-110 ${
                isUpcoming
                  ? "border-2 border-[#D1D5DB] bg-white"
                  : config.fillClass
              }`}
              style={{ width: size, height: size }}
            >
              {isUpcoming ? (
                <span className="text-xs font-semibold text-gray-400">
                  {gateway.code}
                </span>
              ) : (
                <Icon className="h-4 w-4 text-white" />
              )}
            </div>
          )}
        </Link>

        {/* Connecting line */}
        {!isLast && (
          <div
            className={`h-0.5 w-12 flex-shrink-0 ${
              gateway.status === "passed" ? "bg-[#00B0A0]" : "bg-gray-200"
            }`}
          />
        )}
      </div>

      {/* Label below node */}
      <div className="mt-2 flex w-20 flex-col items-center text-center">
        <span className="text-[11px] font-semibold text-gray-700">
          {gateway.code}
        </span>
        <span className="line-clamp-2 text-[10px] leading-tight text-gray-500">
          {gateway.name}
        </span>
        {gateway.completedDate && (
          <span className="mt-0.5 text-[9px] text-gray-400">
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
  );
}
