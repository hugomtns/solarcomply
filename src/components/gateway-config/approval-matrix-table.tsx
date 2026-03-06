"use client";

import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { STAKEHOLDER_ABBREV_LABELS, STAKEHOLDER_ROLE_LABELS } from "@/lib/constants";
import type { GatewayReferenceApproval } from "@/lib/types";

interface ApprovalMatrixTableProps {
  approvals: GatewayReferenceApproval[];
}

const roleBadgeColors: Record<string, string> = {
  approve: "bg-teal-50 text-teal-700 border-teal-200",
  execute: "bg-blue-50 text-blue-700 border-blue-200",
  review: "bg-amber-50 text-amber-700 border-amber-200",
  witness: "bg-sky-50 text-sky-700 border-sky-200",
  sign_off: "bg-indigo-50 text-indigo-700 border-indigo-200",
  shadow: "bg-surface-glass text-text-tertiary border-white/[0.08]",
  input: "bg-orange-50 text-orange-700 border-orange-200",
  recommend: "bg-emerald-50 text-emerald-700 border-emerald-200",
  confirm: "bg-teal-50 text-teal-700 border-teal-200",
  acknowledge: "bg-violet-50 text-violet-700 border-violet-200",
  support: "bg-cyan-50 text-cyan-700 border-cyan-200",
};

export function ApprovalMatrixTable({ approvals }: ApprovalMatrixTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Stakeholder</TableHead>
          <TableHead className="w-[100px]">Role</TableHead>
          <TableHead>Description</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {approvals.map((a, i) => (
          <TableRow key={i}>
            <TableCell>
              <div>
                <span className="text-sm font-medium text-white">{a.stakeholder}</span>
                <p className="text-[10px] text-text-muted">{STAKEHOLDER_ABBREV_LABELS[a.stakeholder]}</p>
              </div>
            </TableCell>
            <TableCell>
              <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${roleBadgeColors[a.role] || ""}`}>
                {STAKEHOLDER_ROLE_LABELS[a.role]}
              </Badge>
            </TableCell>
            <TableCell className="text-sm text-text-tertiary">{a.description}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
