"use client";

import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { organizations, users, currentUser } from "@/data/stakeholders";
import { getApprovalsForDocument } from "@/data/document-approvals";
import { STAKEHOLDER_ROLE_LABELS } from "@/lib/constants";
import { StatusBadge } from "@/components/shared/status-badge";
import { Info, Send, CheckCircle, FileSearch, Mail } from "lucide-react";
import type { StakeholderRole } from "@/lib/types";

interface DocumentApprovalPanelProps {
  documentId: string;
  versionId?: string;
}

const roleDescriptions: Record<string, string> = {
  execute: "Responsible for executing and delivering the work",
  review: "Reviews deliverables and provides technical feedback",
  approve: "Has authority to formally approve the document",
  witness: "Must be present to witness key tests or inspections",
  sign_off: "Provides formal sign-off on specific deliverables",
  shadow: "Observes process for knowledge transfer",
  input: "Provides input or data required for the document",
  none: "No specific role for this document",
};

const selectableRoles: { value: StakeholderRole; label: string }[] = [
  { value: "review", label: "Review" },
  { value: "approve", label: "Approve" },
  { value: "sign_off", label: "Sign-off" },
  { value: "witness", label: "Witness" },
  { value: "execute", label: "Execute" },
  { value: "input", label: "Input" },
];

// Orgs available for approval (exclude current user's org — they're the submitter)
const availableOrgs = organizations.filter((o) => o.id !== currentUser.organizationId);

interface StakeholderSelection {
  orgId: string;
  selected: boolean;
  role: StakeholderRole;
}

export function DocumentApprovalPanel({ documentId, versionId }: DocumentApprovalPanelProps) {
  const allApprovals = getApprovalsForDocument(documentId);
  const approvals = versionId
    ? allApprovals.filter((a) => a.documentVersionId === versionId)
    : allApprovals;

  const [dialogOpen, setDialogOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [stakeholders, setStakeholders] = useState<StakeholderSelection[]>(() =>
    availableOrgs.map((org) => ({
      orgId: org.id,
      selected: false,
      role: "review" as StakeholderRole,
    }))
  );

  const [confirmDialog, setConfirmDialog] = useState<{
    type: "approve" | "request" | "remind";
    orgName?: string;
  } | null>(null);
  const [successDialog, setSuccessDialog] = useState<{
    type: "approve" | "request" | "remind" | "submitted";
    orgName?: string;
    detail?: string;
  } | null>(null);

  const currentUserOrg = currentUser.organizationId;
  const approvedCount = approvals.filter((a) => a.status === "approved").length;
  const requiredCount = approvals.filter((a) => a.status !== "not_required").length;

  const toggleOrg = (orgId: string) => {
    setStakeholders((prev) =>
      prev.map((s) => (s.orgId === orgId ? { ...s, selected: !s.selected } : s))
    );
  };

  const setRole = (orgId: string, role: StakeholderRole) => {
    setStakeholders((prev) =>
      prev.map((s) => (s.orgId === orgId ? { ...s, role } : s))
    );
  };

  const selectedCount = stakeholders.filter((s) => s.selected).length;

  const handleSubmit = () => {
    const selected = stakeholders.filter((s) => s.selected);
    const names = selected
      .map((s) => {
        const org = organizations.find((o) => o.id === s.orgId);
        return `${org?.name} (${STAKEHOLDER_ROLE_LABELS[s.role]})`;
      })
      .join(", ");
    setDialogOpen(false);
    setSubmitted(true);
    setSuccessDialog({ type: "submitted", detail: names });
  };

  // Empty state with submit action
  if (approvals.length === 0 && !submitted) {
    return (
      <>
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <FileSearch className="h-10 w-10 text-text-muted mb-3" />
          <p className="text-sm text-text-muted mb-1">No approval workflow configured yet.</p>
          <p className="text-xs text-text-muted mb-4">Submit this document for stakeholder review and approval.</p>
          <Button
            className="gap-1.5 bg-brand-blue hover:bg-brand-blue-hover text-white"
            onClick={() => setDialogOpen(true)}
          >
            <Send className="h-4 w-4" />
            Submit for Review
          </Button>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Submit for Review</DialogTitle>
              <DialogDescription>
                Select stakeholders and their required roles for the approval workflow.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 py-2 max-h-[60vh] overflow-y-auto">
              {stakeholders.map((s) => {
                const org = organizations.find((o) => o.id === s.orgId);
                return (
                  <div
                    key={s.orgId}
                    className="flex items-center gap-3 rounded-lg border px-3 py-2.5"
                  >
                    <Checkbox
                      checked={s.selected}
                      onCheckedChange={() => toggleOrg(s.orgId)}
                    />
                    <div className="flex h-7 w-7 items-center justify-center rounded bg-brand-navy text-[10px] font-bold text-white shrink-0">
                      {org?.logo ?? "?"}
                    </div>
                    <span className="text-sm font-medium text-text-heading flex-1 min-w-0 truncate">
                      {org?.name}
                    </span>
                    <Select
                      value={s.role}
                      onValueChange={(v) => setRole(s.orgId, v as StakeholderRole)}
                      disabled={!s.selected}
                    >
                      <SelectTrigger className="w-28 h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {selectableRoles.map((r) => (
                          <SelectItem key={r.value} value={r.value}>
                            {r.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                );
              })}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                disabled={selectedCount === 0}
                className="gap-1.5 bg-brand-blue hover:bg-brand-blue-hover text-white"
                onClick={handleSubmit}
              >
                <Send className="h-3.5 w-3.5" />
                Send to {selectedCount} {selectedCount === 1 ? "stakeholder" : "stakeholders"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  // After mock submission — show a pending state
  if (approvals.length === 0 && submitted) {
    const selected = stakeholders.filter((s) => s.selected);
    return (
      <TooltipProvider>
        <div className="space-y-4">
          <div className="flex items-center gap-3 rounded-lg border bg-surface-glass px-4 py-3 text-sm">
            <span className="font-medium text-text-heading">
              0 of {selected.length} approvals received
            </span>
            <span className="text-text-muted">|</span>
            <span className="text-amber-600 font-medium">Awaiting responses</span>
          </div>

          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Organization</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Approver</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selected.map((s) => {
                  const org = organizations.find((o) => o.id === s.orgId);
                  return (
                    <TableRow key={s.orgId}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="flex h-7 w-7 items-center justify-center rounded bg-brand-navy text-[10px] font-bold text-white">
                            {org?.logo ?? "?"}
                          </div>
                          <span className="text-sm font-medium text-text-heading">
                            {org?.name ?? s.orgId}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {STAKEHOLDER_ROLE_LABELS[s.role]}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status="pending" />
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-text-muted">--</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-text-muted">--</span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1.5 text-xs"
                          onClick={() =>
                            setSuccessDialog({ type: "remind", orgName: org?.name ?? "organization" })
                          }
                        >
                          <Send className="h-3 w-3" />
                          Remind
                        </Button>
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

  // Existing approvals — full table
  return (
    <TooltipProvider>
      <div className="space-y-4">
        {/* Summary */}
        <div className="flex items-center gap-3 rounded-lg border bg-surface-glass px-4 py-3 text-sm">
          <span className="font-medium text-text-heading">
            {approvedCount} of {requiredCount} approvals received
          </span>
          {approvals.some(
            (a) => a.status === "pending" && a.stakeholderOrgId === currentUserOrg
          ) && (
            <>
              <span className="text-text-muted">|</span>
              <span className="text-amber-600 font-medium">Your approval is pending</span>
            </>
          )}
          {approvals.some((a) => a.status === "rejected") && (
            <>
              <span className="text-text-muted">|</span>
              <span className="text-red-600 font-medium">Revision requested</span>
            </>
          )}
        </div>

        {/* Table */}
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Organization</TableHead>
                <TableHead>Role</TableHead>
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
                  <TableRow key={approval.id}>
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
                          onClick={() => setConfirmDialog({ type: "approve" })}
                        >
                          <CheckCircle className="h-3.5 w-3.5" />
                          Approve
                        </Button>
                      )}
                      {approval.status === "pending" && !isCurrentOrg && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1.5 text-xs"
                          onClick={() =>
                            setConfirmDialog({ type: "request", orgName: org?.name ?? "organization" })
                          }
                        >
                          <Send className="h-3 w-3" />
                          Request
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

      {/* Confirmation dialog */}
      <Dialog open={confirmDialog !== null} onOpenChange={(open) => !open && setConfirmDialog(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>
              {confirmDialog?.type === "approve" ? "Approve Document" : "Request Approval"}
            </DialogTitle>
            <DialogDescription>
              {confirmDialog?.type === "approve"
                ? "This will record your formal approval for this document. All stakeholders will be notified."
                : `This will send an approval request to ${confirmDialog?.orgName}. They will be notified via email.`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDialog(null)}>
              Cancel
            </Button>
            <Button
              className={
                confirmDialog?.type === "approve"
                  ? "gap-1.5 bg-primary hover:bg-palette-teal-600 text-white"
                  : "gap-1.5 bg-brand-blue hover:bg-brand-blue-hover text-white"
              }
              onClick={() => {
                if (confirmDialog) {
                  setSuccessDialog(confirmDialog);
                  setConfirmDialog(null);
                }
              }}
            >
              {confirmDialog?.type === "approve" ? (
                <><CheckCircle className="h-3.5 w-3.5" />Confirm Approval</>
              ) : (
                <><Send className="h-3.5 w-3.5" />Send Request</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Success dialog */}
      <Dialog open={successDialog !== null} onOpenChange={(open) => !open && setSuccessDialog(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/15">
              {successDialog?.type === "approve" ? (
                <CheckCircle className="h-6 w-6 text-primary" />
              ) : (
                <Mail className="h-6 w-6 text-palette-blue-500" />
              )}
            </div>
            <DialogTitle className="text-center">
              {successDialog?.type === "approve" && "Document Approved"}
              {successDialog?.type === "request" && "Request Sent"}
              {successDialog?.type === "remind" && "Reminder Sent"}
              {successDialog?.type === "submitted" && "Submitted for Review"}
            </DialogTitle>
            <DialogDescription className="text-center">
              {successDialog?.type === "approve" &&
                "Your approval has been recorded. All stakeholders have been notified."}
              {successDialog?.type === "request" &&
                `Approval request sent to ${successDialog.orgName}. They will be notified via email.`}
              {successDialog?.type === "remind" &&
                `Reminder sent to ${successDialog.orgName}.`}
              {successDialog?.type === "submitted" &&
                `Approval requests sent to: ${successDialog.detail}. All stakeholders will be notified via email.`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center">
            <Button variant="outline" onClick={() => setSuccessDialog(null)}>
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
}
