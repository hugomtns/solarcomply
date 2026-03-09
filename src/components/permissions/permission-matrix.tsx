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
  none: "bg-gray-100 text-gray-500",
  view: "bg-blue-50 text-blue-700",
  download: "bg-blue-100 text-blue-800",
  upload: "bg-green-50 text-green-700",
  approve: "bg-amber-50 text-amber-700",
  admin: "bg-purple-50 text-purple-700",
};

const ORG_TYPE_BADGE_COLORS: Record<string, string> = {
  ipp: "bg-purple-100 text-purple-700",
  epc: "bg-orange-100 text-orange-700",
  om: "bg-teal-100 text-teal-700",
  lender: "bg-blue-100 text-blue-700",
  technical_advisor: "bg-indigo-100 text-indigo-700",
  grid_operator: "bg-cyan-100 text-cyan-700",
  oem: "bg-gray-100 text-gray-700",
  insurer: "bg-rose-100 text-rose-700",
  regulator: "bg-red-100 text-red-700",
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
            <tr className="border-b">
              <th className="sticky left-0 z-10 bg-white px-3 py-2 text-left font-medium text-gray-600">
                Organization
              </th>
              {permissionCategories.map((cat) => (
                <th
                  key={cat}
                  className="px-1.5 py-2 text-center font-medium text-gray-600"
                  title={DOCUMENT_CATEGORY_LABELS[cat]}
                >
                  {abbreviateCategory(cat)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {organizations.map((org) => (
              <tr key={org.id} className="border-b last:border-b-0">
                <td className="sticky left-0 z-10 bg-white px-3 py-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900 whitespace-nowrap">
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
