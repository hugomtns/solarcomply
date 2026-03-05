import { CheckCircle, Clock, AlertTriangle, XCircle, ShieldOff, Circle, Minus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type StatusVariant =
  | "passed" | "in_review" | "blocked" | "upcoming" | "waived"
  | "approved" | "pending_review" | "rejected" | "draft" | "expired"
  | "pass" | "fail" | "warning" | "pending" | "not_applicable"
  | "not_required";

const config: Record<StatusVariant, { label: string; icon: typeof CheckCircle; className: string }> = {
  passed: { label: "Passed", icon: CheckCircle, className: "bg-[#06D6A0]/15 text-[#06D6A0] border-[#06D6A0]/25" },
  in_review: { label: "In Review", icon: Clock, className: "bg-[#F59E0B]/15 text-[#FBBF24] border-[#F59E0B]/25" },
  blocked: { label: "Blocked", icon: XCircle, className: "bg-red-500/15 text-red-400 border-red-500/25" },
  upcoming: { label: "Upcoming", icon: Circle, className: "bg-slate-500/15 text-slate-400 border-slate-500/25" },
  waived: { label: "Waived", icon: ShieldOff, className: "bg-purple-500/15 text-purple-400 border-purple-500/25" },
  approved: { label: "Approved", icon: CheckCircle, className: "bg-[#06D6A0]/15 text-[#06D6A0] border-[#06D6A0]/25" },
  pending_review: { label: "Pending Review", icon: Clock, className: "bg-[#F59E0B]/15 text-[#FBBF24] border-[#F59E0B]/25" },
  rejected: { label: "Rejected", icon: XCircle, className: "bg-red-500/15 text-red-400 border-red-500/25" },
  draft: { label: "Draft", icon: Circle, className: "bg-slate-500/15 text-slate-400 border-slate-500/25" },
  expired: { label: "Expired", icon: AlertTriangle, className: "bg-orange-500/15 text-orange-400 border-orange-500/25" },
  pass: { label: "Pass", icon: CheckCircle, className: "bg-[#06D6A0]/15 text-[#06D6A0] border-[#06D6A0]/25" },
  fail: { label: "Fail", icon: XCircle, className: "bg-red-500/15 text-red-400 border-red-500/25" },
  warning: { label: "Warning", icon: AlertTriangle, className: "bg-[#F59E0B]/15 text-[#FBBF24] border-[#F59E0B]/25" },
  pending: { label: "Pending", icon: Clock, className: "bg-[#F59E0B]/15 text-[#FBBF24] border-[#F59E0B]/25" },
  not_applicable: { label: "N/A", icon: Minus, className: "bg-slate-500/15 text-slate-500 border-slate-500/25" },
  not_required: { label: "Not Required", icon: Minus, className: "bg-slate-500/15 text-slate-500 border-slate-500/25" },
};

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const c = config[status as StatusVariant] || config.upcoming;
  const Icon = c.icon;
  return (
    <Badge
      variant="outline"
      className={cn(
        "gap-1 font-medium transition-all duration-200",
        c.className,
        className
      )}
    >
      <Icon className="h-3 w-3" />
      {c.label}
    </Badge>
  );
}
