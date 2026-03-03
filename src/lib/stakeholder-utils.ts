import { users } from "@/data/stakeholders";
import { gateways } from "@/data/gateways";
import { permissions } from "@/data/permissions";
import { documents } from "@/data/documents";
import { documentApprovals } from "@/data/document-approvals";
import type { PermissionLevel } from "@/lib/types";

// ─── Badge color maps ────────────────────────────────────────────

export const ORG_TYPE_BADGE_COLORS: Record<string, string> = {
  ipp: "bg-indigo-100 text-indigo-800 border-indigo-200",
  epc: "bg-orange-100 text-orange-800 border-orange-200",
  om: "bg-cyan-100 text-cyan-800 border-cyan-200",
  lender: "bg-green-100 text-green-800 border-green-200",
  technical_advisor: "bg-blue-100 text-blue-800 border-blue-200",
  grid_operator: "bg-yellow-100 text-yellow-800 border-yellow-200",
  oem: "bg-purple-100 text-purple-800 border-purple-200",
  insurer: "bg-rose-100 text-rose-800 border-rose-200",
  regulator: "bg-red-100 text-red-800 border-red-200",
};

export const PERMISSION_LEVEL_COLORS: Record<PermissionLevel, string> = {
  none: "bg-gray-100 text-gray-500",
  view: "bg-blue-50 text-blue-700",
  download: "bg-blue-100 text-blue-800",
  upload: "bg-green-50 text-green-700",
  approve: "bg-amber-50 text-amber-700",
  admin: "bg-purple-50 text-purple-700",
};

// ─── Data helpers ────────────────────────────────────────────────

export function getUsersForOrg(orgId: string) {
  return users.filter((u) => u.organizationId === orgId);
}

export function getGatewayApprovalsForOrg(orgId: string, projectId: string) {
  const projectGateways = gateways.filter((g) => g.projectId === projectId);
  const results: {
    gatewayCode: string;
    gatewayName: string;
    approval: (typeof projectGateways)[number]["approvals"][number];
  }[] = [];

  for (const gw of projectGateways) {
    for (const approval of gw.approvals) {
      if (approval.stakeholderOrgId === orgId) {
        results.push({
          gatewayCode: gw.code,
          gatewayName: gw.name,
          approval,
        });
      }
    }
  }

  return results;
}

export function getPermissionsForOrg(orgId: string) {
  return permissions.filter(
    (p) => p.organizationId === orgId && p.level !== "none"
  );
}

export function getDocApprovalActivityForOrg(orgId: string, projectId: string) {
  const projectDocIds = new Set(
    documents.filter((d) => d.projectId === projectId).map((d) => d.id)
  );

  const docMap = new Map(documents.map((d) => [d.id, d]));

  return documentApprovals
    .filter(
      (da) =>
        da.stakeholderOrgId === orgId && projectDocIds.has(da.documentId)
    )
    .map((da) => ({
      ...da,
      documentName: docMap.get(da.documentId)?.name ?? da.documentId,
    }))
    .sort(
      (a, b) =>
        new Date(b.timestamp ?? 0).getTime() -
        new Date(a.timestamp ?? 0).getTime()
    );
}
