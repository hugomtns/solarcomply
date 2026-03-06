"use client";

import { useState, Fragment } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { STAKEHOLDER_ABBREV_LABELS, PROJECT_TYPE_LABELS } from "@/lib/constants";
import { ChevronRight, Globe } from "lucide-react";
import type { GatewayReferenceRequirement } from "@/lib/types";

interface RequirementsReferenceTableProps {
  requirements: GatewayReferenceRequirement[];
}

const typeColors: Record<string, string> = {
  pv: "bg-status-warning/20 text-status-warning-light border-status-warning/25",
  bess: "bg-status-info/20 text-palette-blue-400 border-status-info/25",
  hybrid: "bg-status-special/20 text-palette-purple-400 border-status-special/25",
};

export function RequirementsReferenceTable({ requirements }: RequirementsReferenceTableProps) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  function toggleRow(id: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16">#</TableHead>
            <TableHead>Document / Data Item</TableHead>
            <TableHead className="w-24">Provider</TableHead>
            <TableHead className="w-28">Reviewer</TableHead>
            <TableHead className="w-40">Standard</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requirements.map((req) => (
            <Fragment key={req.id}>
              <TableRow
                className="cursor-pointer hover:bg-surface-glass"
                onClick={() => toggleRow(req.id)}
              >
                <TableCell className="font-medium text-brand-blue text-xs">
                  <div className="flex items-center gap-1">
                    <ChevronRight
                      className={`h-3.5 w-3.5 shrink-0 text-text-muted transition-transform ${
                        expanded.has(req.id) ? "rotate-90" : ""
                      }`}
                    />
                    {req.id}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-text-secondary">{req.label}</span>
                    {req.isBessOnly && (
                      <Badge variant="outline" className="text-[9px] px-1 py-0 bg-status-info/20 text-palette-blue-400 border-status-info/25 shrink-0">
                        BESS
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-0.5">
                    {req.provider.map((p) => (
                      <Badge key={p} variant="outline" className="text-[9px] px-1 py-0">
                        {p}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-0.5">
                    {req.reviewerApprover.map((r) => (
                      <Badge key={r} variant="outline" className="text-[9px] px-1 py-0 bg-status-info/15 text-palette-blue-400 border-status-info/25">
                        {r}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="text-[10px] text-text-tertiary">
                  {req.standardRef || "—"}
                </TableCell>
              </TableRow>
              {expanded.has(req.id) && (
                <TableRow key={`${req.id}-detail`}>
                  <TableCell colSpan={5} className="p-0">
                    <div className="px-4 pb-4 pt-2">
                      <div className="rounded-lg bg-surface-glass p-4 space-y-3">
                        <p className="text-sm text-text-tertiary leading-relaxed">{req.description}</p>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-text-tertiary">
                          <span><strong>Format:</strong> {req.format}</span>
                          <span>
                            <strong>Provider:</strong>{" "}
                            {req.provider.map((p) => STAKEHOLDER_ABBREV_LABELS[p] || p).join(", ")}
                          </span>
                          <span>
                            <strong>Reviewer:</strong>{" "}
                            {req.reviewerApprover.map((r) => STAKEHOLDER_ABBREV_LABELS[r] || r).join(", ")}
                          </span>
                          {req.standardRef && <span><strong>Standard:</strong> {req.standardRef}</span>}
                        </div>
                        <div className="flex flex-wrap items-center gap-2 text-xs">
                          <span className="text-text-tertiary"><strong>Types:</strong></span>
                          {req.applicableProjectTypes.map((t) => (
                            <Badge key={t} variant="outline" className={`text-[9px] px-1.5 py-0 ${typeColors[t]}`}>
                              {PROJECT_TYPE_LABELS[t]}
                            </Badge>
                          ))}
                          <span className="text-text-disabled">|</span>
                          {req.jurisdictions.length === 0 ? (
                            <span className="flex items-center gap-1 text-text-muted">
                              <Globe className="h-3 w-3" /> Global
                            </span>
                          ) : (
                            req.jurisdictions.map((j) => (
                              <Badge key={j} variant="outline" className="text-[9px] px-1.5 py-0">
                                {j}
                              </Badge>
                            ))
                          )}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </Fragment>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
