import { CheckCircle, Clock, AlertTriangle, XCircle, ShieldOff, Circle, Minus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type StatusVariant =
  | "passed" | "in_review" | "blocked" | "upcoming" | "waived"
  | "approved" | "pending_review" | "rejected" | "draft" | "expired"
  | "pass" | "fail" | "warning" | "pending" | "not_applicable"
  | "not_required";

const config: Record<StatusVariant, { label: string; icon: typeof CheckCircle; className: string }> = {
  passed: { label: "Passed", icon: CheckCircle, className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  in_review: { label: "In Review", icon: Clock, className: "bg-amber-50 text-amber-700 border-amber-200" },
  blocked: { label: "Blocked", icon: XCircle, className: "bg-red-50 text-red-700 border-red-200" },
  upcoming: { label: "Upcoming", icon: Circle, className: "bg-gray-50 text-gray-600 border-gray-200" },
  waived: { label: "Waived", icon: ShieldOff, className: "bg-purple-50 text-purple-700 border-purple-200" },
  approved: { label: "Approved", icon: CheckCircle, className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  pending_review: { label: "Pending Review", icon: Clock, className: "bg-amber-50 text-amber-700 border-amber-200" },
  rejected: { label: "Rejected", icon: XCircle, className: "bg-red-50 text-red-700 border-red-200" },
  draft: { label: "Draft", icon: Circle, className: "bg-gray-50 text-gray-600 border-gray-200" },
  expired: { label: "Expired", icon: AlertTriangle, className: "bg-orange-50 text-orange-700 border-orange-200" },
  pass: { label: "Pass", icon: CheckCircle, className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  fail: { label: "Fail", icon: XCircle, className: "bg-red-50 text-red-700 border-red-200" },
  warning: { label: "Warning", icon: AlertTriangle, className: "bg-amber-50 text-amber-700 border-amber-200" },
  pending: { label: "Pending", icon: Clock, className: "bg-amber-50 text-amber-700 border-amber-200" },
  not_applicable: { label: "N/A", icon: Minus, className: "bg-gray-50 text-gray-500 border-gray-200" },
  not_required: { label: "Not Required", icon: Minus, className: "bg-gray-50 text-gray-500 border-gray-200" },
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
