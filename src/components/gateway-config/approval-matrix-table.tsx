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
  approve: "bg-primary/15 text-primary border-primary/25",
  execute: "bg-status-info/15 text-palette-blue-400 border-status-info/25",
  review: "bg-status-warning/15 text-status-warning-light border-status-warning/25",
  witness: "bg-sky-500/15 text-sky-400 border-sky-500/25",
  sign_off: "bg-indigo-500/15 text-indigo-400 border-indigo-500/25",
  shadow: "bg-surface-glass text-text-tertiary border-white/[0.08]",
  input: "bg-palette-orange-500/15 text-palette-orange-400 border-palette-orange-500/25",
  recommend: "bg-emerald-500/15 text-emerald-400 border-emerald-500/25",
  confirm: "bg-primary/15 text-primary border-primary/25",
  acknowledge: "bg-violet-500/15 text-violet-400 border-violet-500/25",
  support: "bg-cyan-500/15 text-cyan-400 border-cyan-500/25",
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
