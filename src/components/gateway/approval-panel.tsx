"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { organizations, users, currentUser } from "@/data/stakeholders";
import { STAKEHOLDER_ROLE_LABELS } from "@/lib/constants";
import { StatusBadge } from "@/components/shared/status-badge";
import type { GatewayApproval } from "@/lib/types";
import { Info, Send, CheckCircle } from "lucide-react";

interface ApprovalPanelProps {
  approvals: GatewayApproval[];
}

const roleDescriptions: Record<string, string> = {
  execute: "Responsible for executing and delivering the work",
  review: "Reviews deliverables and provides technical feedback",
  approve: "Has authority to formally approve the gateway",
  witness: "Must be present to witness key tests or inspections",
  sign_off: "Provides formal sign-off on specific deliverables",
  shadow: "Observes process for knowledge transfer",
  input: "Provides input or data required for the gateway",
  none: "No specific role in this gateway",
};

export function ApprovalPanel({ approvals }: ApprovalPanelProps) {
  const currentUserOrg = currentUser.organizationId;

  const handleRequestApproval = (orgName: string) => {
    alert(`Approval request sent to ${orgName}. They will be notified via email.`);
  };

  const handleApproveGateway = () => {
    alert("Gateway approved successfully. All stakeholders will be notified.");
  };

  return (
    <TooltipProvider>
      <div className="space-y-4">
        {/* Summary */}
        <div className="flex items-center gap-3 rounded-lg border bg-surface-glass px-4 py-3 text-sm">
          <span className="font-medium text-text-heading">
            {approvals.filter((a) => a.status === "approved").length} of{" "}
            {approvals.filter((a) => a.status !== "not_required").length} approvals received
          </span>
          {approvals.some(
            (a) => a.status === "pending" && a.stakeholderOrgId === currentUserOrg
          ) && (
            <>
              <span className="text-text-muted">|</span>
              <span className="text-amber-600 font-medium">Your approval is pending</span>
            </>
          )}
        </div>

        {/* Table */}
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Organization</TableHead>
                <TableHead>Required Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Approver</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Comment</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {approvals.map((approval) => {
                const org = organizations.find((o) => o.id === approval.stakeholderOrgId);
                const approver = approval.approverUserId
                  ? users.find((u) => u.id === approval.approverUserId)
                  : null;
                const isCurrentOrg = approval.stakeholderOrgId === currentUserOrg;

                return (
                  <TableRow key={approval.stakeholderOrgId}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded bg-brand-navy text-[10px] font-bold text-white">
                          {org?.logo ?? "?"}
                        </div>
                        <span className="text-sm font-medium text-text-heading">
                          {org?.name ?? approval.stakeholderOrgId}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center gap-1 cursor-help">
                            <Badge variant="outline" className="text-xs">
                              {STAKEHOLDER_ROLE_LABELS[approval.requiredRole] ?? approval.requiredRole}
                            </Badge>
                            <Info className="h-3 w-3 text-text-muted" />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-[200px]">
                            {roleDescriptions[approval.requiredRole]}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={approval.status} />
                    </TableCell>
                    <TableCell>
                      {approver ? (
                        <span className="text-sm text-text-secondary">{approver.name}</span>
                      ) : (
                        <span className="text-sm text-text-muted">--</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {approval.timestamp ? (
                        <span className="text-sm text-text-tertiary">
                          {new Date(approval.timestamp).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      ) : (
                        <span className="text-sm text-text-muted">--</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {approval.comment ? (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="text-sm text-text-tertiary max-w-[200px] truncate block cursor-help">
                              {approval.comment}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-[300px]">{approval.comment}</p>
                          </TooltipContent>
                        </Tooltip>
                      ) : (
                        <span className="text-sm text-text-muted">--</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {approval.status === "pending" && isCurrentOrg && (
                        <Button
                          size="sm"
                          className="gap-1.5 bg-primary hover:bg-palette-teal-600 text-white"
                          onClick={handleApproveGateway}
                        >
                          <CheckCircle className="h-3.5 w-3.5" />
                          Approve Gateway
                        </Button>
                      )}
                      {approval.status === "pending" && !isCurrentOrg && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1.5 text-xs"
                          onClick={() => handleRequestApproval(org?.name ?? "organization")}
                        >
                          <Send className="h-3 w-3" />
                          Request Approval
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </TooltipProvider>
  );
}
