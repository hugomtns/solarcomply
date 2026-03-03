"use client";

import { useState } from "react";
import { FileText, FileSpreadsheet, FileImage, ArrowUpDown } from "lucide-react";
import { CheckCircle, X } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { StatusBadge } from "@/components/shared/status-badge";
import { DOCUMENT_CATEGORY_LABELS } from "@/lib/constants";
import { users } from "@/data/stakeholders";
import { gateways } from "@/data/gateways";
import type { Document } from "@/lib/types";

interface DocumentTableProps {
  documents: Document[];
  onSelect: (doc: Document) => void;
}

type SortField = "name" | "uploadedAt" | "fileSizeMB" | "status";
type SortDir = "asc" | "desc";

function getFileIcon(fileType: string) {
  const imageTypes = ["jpg", "geotiff"];
  const spreadsheetTypes = ["xlsx", "csv"];
  if (imageTypes.includes(fileType)) return FileImage;
  if (spreadsheetTypes.includes(fileType)) return FileSpreadsheet;
  return FileText;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatSize(mb: number) {
  if (mb >= 1000) return `${(mb / 1000).toFixed(1)} GB`;
  if (mb < 1) return `${Math.round(mb * 1024)} KB`;
  return `${mb.toFixed(1)} MB`;
}

export function DocumentTable({ documents, onSelect }: DocumentTableProps) {
  const [sortField, setSortField] = useState<SortField>("uploadedAt");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  function toggleSort(field: SortField) {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  }

  const sorted = [...documents].sort((a, b) => {
    const dir = sortDir === "asc" ? 1 : -1;
    switch (sortField) {
      case "name":
        return dir * a.name.localeCompare(b.name);
      case "uploadedAt":
        return dir * (new Date(a.uploadedAt).getTime() - new Date(b.uploadedAt).getTime());
      case "fileSizeMB":
        return dir * (a.fileSizeMB - b.fileSizeMB);
      case "status":
        return dir * a.status.localeCompare(b.status);
      default:
        return 0;
    }
  });

  function SortableHead({ field, children }: { field: SortField; children: React.ReactNode }) {
    return (
      <TableHead
        className="cursor-pointer select-none"
        onClick={() => toggleSort(field)}
      >
        <span className="inline-flex items-center gap-1">
          {children}
          <ArrowUpDown className="h-3 w-3 text-gray-400" />
        </span>
      </TableHead>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-gray-50">
          <TableHead className="w-8" />
          <SortableHead field="name">Name</SortableHead>
          <TableHead>Category</TableHead>
          <TableHead>Ver</TableHead>
          <SortableHead field="status">Status</SortableHead>
          <TableHead>Format</TableHead>
          <TableHead>Gateway</TableHead>
          <TableHead>Uploaded By</TableHead>
          <SortableHead field="uploadedAt">Date</SortableHead>
          <SortableHead field="fileSizeMB">Size</SortableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sorted.map((doc, idx) => {
          const Icon = getFileIcon(doc.fileType);
          const uploader = users.find((u) => u.id === doc.uploadedBy);
          const gateway = gateways.find((g) => g.id === doc.gatewayId);
          return (
            <TableRow
              key={doc.id}
              className={`cursor-pointer ${idx % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
              onClick={() => onSelect(doc)}
            >
              <TableCell>
                <Icon className="h-4 w-4 text-gray-500" />
              </TableCell>
              <TableCell>
                <span className="font-medium text-[#2E75B6] hover:underline">
                  {doc.name}
                </span>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className="text-xs">
                  {DOCUMENT_CATEGORY_LABELS[doc.category] ?? doc.category}
                </Badge>
              </TableCell>
              <TableCell className="text-center">v{doc.version}</TableCell>
              <TableCell>
                <StatusBadge status={doc.status} />
              </TableCell>
              <TableCell className="text-center">
                {doc.formatValid ? (
                  <CheckCircle className="h-4 w-4 text-emerald-500" />
                ) : (
                  <X className="h-4 w-4 text-red-500" />
                )}
              </TableCell>
              <TableCell>
                {gateway ? (
                  <Badge variant="outline" className="text-xs">
                    {gateway.code}
                  </Badge>
                ) : (
                  <span className="text-xs text-gray-400">--</span>
                )}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar size="sm">
                    <AvatarFallback className="text-[10px]">
                      {uploader?.avatar ?? "??"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-xs text-gray-700">
                    {uploader?.name ?? "Unknown"}
                  </span>
                </div>
              </TableCell>
              <TableCell className="text-xs text-gray-600">
                {formatDate(doc.uploadedAt)}
              </TableCell>
              <TableCell className="text-xs text-gray-600">
                {formatSize(doc.fileSizeMB)}
              </TableCell>
            </TableRow>
          );
        })}
        {sorted.length === 0 && (
          <TableRow>
            <TableCell colSpan={10} className="text-center py-8 text-gray-400">
              No documents match the current filters.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
