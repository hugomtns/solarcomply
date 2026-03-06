import { CheckCircle, Clock, AlertTriangle, XCircle, ShieldOff, Circle, Minus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type StatusVariant =
  | "passed" | "in_review" | "blocked" | "upcoming" | "waived"
  | "approved" | "pending_review" | "rejected" | "draft" | "expired"
  | "pass" | "fail" | "warning" | "pending" | "not_applicable"
  | "not_required";

const config: Record<StatusVariant, { label: string; icon: typeof CheckCircle; className: string }> = {
  passed: { label: "Passed", icon: CheckCircle, className: "bg-status-success/15 text-status-success border-status-success/25" },
  in_review: { label: "In Review", icon: Clock, className: "bg-status-warning/15 text-status-warning-light border-status-warning/25" },
  blocked: { label: "Blocked", icon: XCircle, className: "bg-status-error/15 text-palette-red-400 border-status-error/25" },
  upcoming: { label: "Upcoming", icon: Circle, className: "bg-status-neutral/15 text-text-tertiary border-status-neutral/25" },
  waived: { label: "Waived", icon: ShieldOff, className: "bg-status-special/15 text-palette-purple-400 border-status-special/25" },
  approved: { label: "Approved", icon: CheckCircle, className: "bg-status-success/15 text-status-success border-status-success/25" },
  pending_review: { label: "Pending Review", icon: Clock, className: "bg-status-warning/15 text-status-warning-light border-status-warning/25" },
  rejected: { label: "Rejected", icon: XCircle, className: "bg-status-error/15 text-palette-red-400 border-status-error/25" },
  draft: { label: "Draft", icon: Circle, className: "bg-status-neutral/15 text-text-tertiary border-status-neutral/25" },
  expired: { label: "Expired", icon: AlertTriangle, className: "bg-palette-orange-500/15 text-palette-orange-500 border-palette-orange-500/25" },
  pass: { label: "Pass", icon: CheckCircle, className: "bg-status-success/15 text-status-success border-status-success/25" },
  fail: { label: "Fail", icon: XCircle, className: "bg-status-error/15 text-palette-red-400 border-status-error/25" },
  warning: { label: "Warning", icon: AlertTriangle, className: "bg-status-warning/15 text-status-warning-light border-status-warning/25" },
  pending: { label: "Pending", icon: Clock, className: "bg-status-warning/15 text-status-warning-light border-status-warning/25" },
  not_applicable: { label: "N/A", icon: Minus, className: "bg-status-neutral/15 text-text-muted border-status-neutral/25" },
  not_required: { label: "Not Required", icon: Minus, className: "bg-status-neutral/15 text-text-muted border-status-neutral/25" },
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
