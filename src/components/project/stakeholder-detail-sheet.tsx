"use client";

import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatusBadge } from "@/components/shared/status-badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { organizations } from "@/data/stakeholders";
import { users } from "@/data/stakeholders";
import {
  ORG_TYPE_BADGE_COLORS,
  PERMISSION_LEVEL_COLORS,
  getUsersForOrg,
  getGatewayApprovalsForOrg,
  getPermissionsForOrg,
  getDocApprovalActivityForOrg,
} from "@/lib/stakeholder-utils";
import {
  ORG_TYPE_LABELS,
  STAKEHOLDER_ROLE_LABELS,
  DOCUMENT_CATEGORY_LABELS,
  PERMISSION_LEVEL_LABELS,
} from "@/lib/constants";
import type { PermissionLevel } from "@/lib/types";
import { UserMinus, MessageSquare } from "lucide-react";

interface StakeholderDetailSheetProps {
  orgId: string | null;
  projectId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function StakeholderDetailSheet({
  orgId,
  projectId,
  open,
  onOpenChange,
}: StakeholderDetailSheetProps) {
  const org = orgId ? organizations.find((o) => o.id === orgId) : null;
  if (!org) return null;

  const orgUsers = getUsersForOrg(org.id);
  const gatewayApprovals = getGatewayApprovalsForOrg(org.id, projectId);
  const orgPermissions = getPermissionsForOrg(org.id);
  const activity = getDocApprovalActivityForOrg(org.id, projectId);

  const isProjectOwner = org.id === "org-greenfield";

  // Gateway approval summary for tab badge
  const approvedGateways = gatewayApprovals.filter(
    (ga) => ga.approval.status === "approved"
  ).length;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md bg-gray-100 text-sm font-bold text-gray-600">
                {org.logo || org.name.substring(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0">
                <SheetTitle className="text-lg">{org.name}</SheetTitle>
                <SheetDescription>
                  <Badge
                    variant="outline"
                    className={`mt-1 text-[10px] ${
                      ORG_TYPE_BADGE_COLORS[org.type] ||
                      "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {ORG_TYPE_LABELS[org.type] || org.type}
                  </Badge>
                </SheetDescription>
              </div>
            </div>
          </div>
        </SheetHeader>

        {/* Remove button */}
        <div className="px-4 pb-2">
          <Button
            variant="outline"
            size="sm"
            className="w-full text-red-600 border-red-200 hover:bg-red-50"
            disabled={isProjectOwner}
            onClick={() =>
              toast.success(`${org.name} removed from project`)
            }
            title={
              isProjectOwner ? "Cannot remove project owner" : undefined
            }
          >
            <UserMinus className="mr-1.5 h-4 w-4" />
            {isProjectOwner
              ? "Project Owner — Cannot Remove"
              : "Remove from Project"}
          </Button>
        </div>

        {/* Tabs */}
        <div className="px-4 pb-4">
          <Tabs defaultValue="team">
            <TabsList variant="line" className="w-full justify-start mb-4">
              <TabsTrigger value="team">
                Team
                <span className="ml-1.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-gray-100 px-1 text-[10px] font-medium text-gray-600">
                  {orgUsers.length}
                </span>
              </TabsTrigger>
              <TabsTrigger value="gateways">
                Gateways
                <span className="ml-1.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-gray-100 px-1 text-[10px] font-medium text-gray-600">
                  {approvedGateways}/{gatewayApprovals.length}
                </span>
              </TabsTrigger>
              <TabsTrigger value="permissions">Permissions</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>

            {/* ── Team Tab ────────────────────────────── */}
            <TabsContent value="team">
              <div className="space-y-2">
                {orgUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center gap-3 rounded-md border p-2.5"
                  >
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gray-200 text-xs font-medium text-gray-600">
                      {user.avatar || user.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {user.name}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {user.role}
                      </p>
                    </div>
                    <span className="text-xs text-gray-400 truncate max-w-[140px]">
                      {user.email}
                    </span>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* ── Gateways Tab ────────────────────────── */}
            <TabsContent value="gateways">
              {gatewayApprovals.length === 0 ? (
                <p className="py-6 text-center text-sm text-gray-400">
                  No gateway approvals for this organization.
                </p>
              ) : (
                <div className="space-y-2">
                  {gatewayApprovals.map((ga, i) => {
                    const approver = ga.approval.approverUserId
                      ? users.find((u) => u.id === ga.approval.approverUserId)
                      : null;
                    return (
                      <div
                        key={`${ga.gatewayCode}-${i}`}
                        className="flex items-center gap-2 rounded-md border p-2.5 text-sm"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-gray-900">
                            {ga.gatewayCode} — {ga.gatewayName}
                          </p>
                          <div className="mt-1 flex flex-wrap items-center gap-1.5">
                            <Badge
                              variant="outline"
                              className="text-[10px] bg-gray-50"
                            >
                              {STAKEHOLDER_ROLE_LABELS[
                                ga.approval.requiredRole
                              ] || ga.approval.requiredRole}
                            </Badge>
                            <StatusBadge status={ga.approval.status} />
                          </div>
                        </div>
                        <div className="text-right text-xs text-gray-400 flex-shrink-0">
                          {approver && (
                            <p className="text-gray-600">{approver.name}</p>
                          )}
                          {ga.approval.timestamp && (
                            <p>{formatDate(ga.approval.timestamp)}</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </TabsContent>

            {/* ── Permissions Tab ──────────────────────── */}
            <TabsContent value="permissions">
              {orgPermissions.length === 0 ? (
                <p className="py-6 text-center text-sm text-gray-400">
                  No permissions assigned.
                </p>
              ) : (
                <div className="space-y-1.5">
                  {orgPermissions.map((p) => (
                    <div
                      key={p.documentCategory}
                      className="flex items-center justify-between gap-2 rounded-md border px-3 py-2"
                    >
                      <span className="text-sm text-gray-700">
                        {DOCUMENT_CATEGORY_LABELS[p.documentCategory] ||
                          p.documentCategory}
                      </span>
                      <Badge
                        variant="outline"
                        className={`text-[10px] ${
                          PERMISSION_LEVEL_COLORS[p.level as PermissionLevel] ||
                          ""
                        }`}
                      >
                        {PERMISSION_LEVEL_LABELS[p.level] || p.level}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* ── Activity Tab ─────────────────────────── */}
            <TabsContent value="activity">
              {activity.length === 0 ? (
                <p className="py-6 text-center text-sm text-gray-400">
                  No document approval activity for this project.
                </p>
              ) : (
                <div className="space-y-2">
                  {activity.map((a) => (
                    <div
                      key={a.id}
                      className="flex items-start gap-2 rounded-md border p-2.5 text-sm"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-gray-900 truncate">
                          {a.documentName}
                        </p>
                        <div className="mt-1 flex flex-wrap items-center gap-1.5">
                          <StatusBadge status={a.status} />
                          <Badge
                            variant="outline"
                            className="text-[10px] bg-gray-50"
                          >
                            {STAKEHOLDER_ROLE_LABELS[a.requiredRole] ||
                              a.requiredRole}
                          </Badge>
                          {a.timestamp && (
                            <span className="text-xs text-gray-400">
                              {formatDate(a.timestamp)}
                            </span>
                          )}
                        </div>
                      </div>
                      {a.comment && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <MessageSquare className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-400" />
                            </TooltipTrigger>
                            <TooltipContent
                              side="left"
                              className="max-w-[240px]"
                            >
                              <p className="text-xs">{a.comment}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  );
}
