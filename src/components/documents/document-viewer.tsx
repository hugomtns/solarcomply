"use client";

import { useState } from "react";
import {
  FileText,
  FileSpreadsheet,
  FileImage,
  Download,
  Share2,
  Trash2,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { StatusBadge } from "@/components/shared/status-badge";
import { DOCUMENT_CATEGORY_LABELS, DOCUMENT_STATUS_LABELS } from "@/lib/constants";
import { users } from "@/data/stakeholders";
import { gateways } from "@/data/gateways";
import { VersionHistory } from "./version-history";
import type { Document } from "@/lib/types";

interface DocumentViewerProps {
  document: Document | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

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
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function DocumentViewer({ document: doc, open, onOpenChange }: DocumentViewerProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  if (!doc) return null;

  const Icon = getFileIcon(doc.fileType);
  const uploader = users.find((u) => u.id === doc.uploadedBy);
  const gateway = gateways.find((g) => g.id === doc.gatewayId);

  const metaRows: { label: string; value: string }[] = [
    { label: "File Name", value: doc.fileName },
    { label: "File Type", value: doc.fileType.toUpperCase() },
    { label: "Category", value: DOCUMENT_CATEGORY_LABELS[doc.category] ?? doc.category },
    { label: "Version", value: `v${doc.version}` },
    { label: "Status", value: DOCUMENT_STATUS_LABELS[doc.status] ?? doc.status },
    { label: "Format Valid", value: doc.formatValid ? "Yes" : "No" },
    { label: "Gateway", value: gateway ? `${gateway.code} - ${gateway.name}` : "N/A" },
    { label: "Uploaded By", value: uploader?.name ?? "Unknown" },
    { label: "Organization", value: uploader?.role ?? "" },
    { label: "Upload Date", value: formatDate(doc.uploadedAt) },
    { label: "File Size", value: `${doc.fileSizeMB} MB` },
    { label: "Retention", value: `${doc.retentionYears} years` },
    { label: "Tags", value: doc.tags.join(", ") },
  ];

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent
          side="right"
          className="w-full sm:max-w-lg overflow-y-auto"
        >
          <SheetHeader>
            <SheetTitle className="text-lg">{doc.name}</SheetTitle>
            <SheetDescription>
              <StatusBadge status={doc.status} />
            </SheetDescription>
          </SheetHeader>

          {/* Preview Area */}
          <div className="mx-4 flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 py-12">
            <Icon className="h-12 w-12 text-gray-300 mb-3" />
            <p className="text-sm text-gray-400">Preview not available in prototype</p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 px-4">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => alert("Download started (mock)")}
            >
              <Download className="h-4 w-4" />
              Download
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => alert("Share link copied (mock)")}
            >
              <Share2 className="h-4 w-4" />
              Share
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setConfirmOpen(true)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          <Separator className="mx-4" />

          {/* Metadata Panel */}
          <div className="px-4 space-y-2">
            <h3 className="text-sm font-semibold text-gray-900">Metadata</h3>
            <dl className="space-y-1.5">
              {metaRows.map((row) => (
                <div key={row.label} className="flex gap-2 text-sm">
                  <dt className="w-28 shrink-0 text-gray-500">{row.label}</dt>
                  <dd className="text-gray-900 break-all">{row.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <Separator className="mx-4" />

          {/* Version History */}
          <div className="px-4 pb-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">
              Version History
            </h3>
            <VersionHistory document={doc} />
          </div>
        </SheetContent>
      </Sheet>

      {/* Delete Confirmation Dialog */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Document</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &ldquo;{doc.name}&rdquo;? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                setConfirmOpen(false);
                onOpenChange(false);
                alert("Document deleted (mock)");
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
