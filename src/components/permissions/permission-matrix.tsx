"use client";

import { useState } from "react";
import { toast } from "sonner";
import { organizations } from "@/data/stakeholders";
import { permissions, permissionCategories } from "@/data/permissions";
import {
  PERMISSION_LEVEL_LABELS,
  DOCUMENT_CATEGORY_LABELS,
  ORG_TYPE_LABELS,
} from "@/lib/constants";
import { PermissionLevel, DocumentCategory } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Save } from "lucide-react";

const LEVELS: PermissionLevel[] = [
  "none",
  "view",
  "download",
  "upload",
  "approve",
  "admin",
];

const LEVEL_COLORS: Record<PermissionLevel, string> = {
  none: "bg-white/[0.04] text-text-disabled",
  view: "bg-status-info/15 text-palette-blue-400",
  download: "bg-status-info/20 text-palette-blue-400",
  upload: "bg-primary/15 text-primary",
  approve: "bg-status-warning/15 text-status-warning-light",
  admin: "bg-status-special/15 text-palette-purple-400",
};

const ORG_TYPE_BADGE_COLORS: Record<string, string> = {
  ipp: "bg-status-special/20 text-palette-purple-400",
  epc: "bg-palette-orange-500/20 text-palette-orange-400",
  om: "bg-primary/20 text-primary",
  lender: "bg-status-info/20 text-palette-blue-400",
  technical_advisor: "bg-indigo-500/20 text-indigo-400",
  grid_operator: "bg-cyan-500/20 text-cyan-400",
  oem: "bg-white/[0.08] text-text-tertiary",
  insurer: "bg-rose-500/20 text-rose-400",
  regulator: "bg-status-error/20 text-red-400",
};

function abbreviateCategory(cat: DocumentCategory): string {
  const label = DOCUMENT_CATEGORY_LABELS[cat] || cat;
  if (label.length <= 10) return label;
  return label
    .split(/[\s-]+/)
    .map((w) => w[0]?.toUpperCase())
    .join("");
}

type MatrixState = Record<string, Record<string, PermissionLevel>>;

function buildInitialState(): MatrixState {
  const state: MatrixState = {};
  for (const org of organizations) {
    state[org.id] = {};
    for (const cat of permissionCategories) {
      const entry = permissions.find(
        (p) => p.organizationId === org.id && p.documentCategory === cat
      );
      state[org.id][cat] = entry?.level ?? "none";
    }
  }
  return state;
}

export function PermissionMatrix() {
  const [matrix, setMatrix] = useState<MatrixState>(buildInitialState);

  const handleChange = (
    orgId: string,
    cat: DocumentCategory,
    level: PermissionLevel
  ) => {
    setMatrix((prev) => ({
      ...prev,
      [orgId]: { ...prev[orgId], [cat]: level },
    }));
  };

  const handleSave = () => {
    toast.success("Permission changes saved");
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-base font-semibold">
          Permission Matrix
        </CardTitle>
        <Button size="sm" onClick={handleSave}>
          <Save className="mr-1.5 h-4 w-4" />
          Save Changes
        </Button>
      </CardHeader>
      <CardContent className="overflow-x-auto p-0 pb-4">
        <table className="w-full min-w-[900px] text-xs">
          <thead>
            <tr className="border-b border-white/[0.06]">
              <th className="sticky left-0 z-10 bg-surface-card px-3 py-2 text-left font-medium text-text-muted">
                Organization
              </th>
              {permissionCategories.map((cat) => (
                <th
                  key={cat}
                  className="px-1.5 py-2 text-center font-medium text-text-muted"
                  title={DOCUMENT_CATEGORY_LABELS[cat]}
                >
                  {abbreviateCategory(cat)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {organizations.map((org) => (
              <tr key={org.id} className="border-b border-white/[0.06] last:border-b-0">
                <td className="sticky left-0 z-10 bg-surface-card px-3 py-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-text-secondary whitespace-nowrap">
                      {org.name.length > 22
                        ? org.name.slice(0, 20) + "..."
                        : org.name}
                    </span>
                    <Badge
                      variant="secondary"
                      className={`text-[10px] px-1.5 py-0 ${ORG_TYPE_BADGE_COLORS[org.type] || ""}`}
                    >
                      {ORG_TYPE_LABELS[org.type]}
                    </Badge>
                  </div>
                </td>
                {permissionCategories.map((cat) => {
                  const level = matrix[org.id]?.[cat] ?? "none";
                  return (
                    <td key={cat} className="px-1 py-1.5 text-center">
                      <select
                        value={level}
                        onChange={(e) =>
                          handleChange(
                            org.id,
                            cat,
                            e.target.value as PermissionLevel
                          )
                        }
                        className={`w-full cursor-pointer rounded px-1 py-1 text-[11px] font-medium border-0 outline-none ${LEVEL_COLORS[level]}`}
                      >
                        {LEVELS.map((l) => (
                          <option key={l} value={l}>
                            {PERMISSION_LEVEL_LABELS[l]}
                          </option>
                        ))}
                      </select>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
