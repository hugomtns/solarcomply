"use client";

import { useState } from "react";
import {
  FileText,
  FileSpreadsheet,
  FileImage,
  Download,
  Share2,
  Trash2,
  Sparkles,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatusBadge } from "@/components/shared/status-badge";
import { DOCUMENT_CATEGORY_LABELS, DOCUMENT_STATUS_LABELS } from "@/lib/constants";
import { users } from "@/data/stakeholders";
import { gateways } from "@/data/gateways";
import { getApprovalsForDocument } from "@/data/document-approvals";
import { VersionHistory } from "./version-history";
import { DocumentApprovalPanel } from "./document-approval-panel";
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

  // Approval summary
  const approvals = getApprovalsForDocument(doc.id);
  const approvedCount = approvals.filter((a) => a.status === "approved").length;
  const requiredCount = approvals.filter((a) => a.status !== "not_required").length;
  const hasApprovals = approvals.length > 0;

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
            <SheetTitle className="text-lg">
              {doc.name}
            </SheetTitle>
            <SheetDescription>
              <span className="flex items-center gap-2 flex-wrap">
                <StatusBadge status={doc.status} />
                {hasApprovals && (
                  <span className="inline-flex items-center rounded-full border border-white/[0.08] bg-surface-glass px-2 py-0.5 text-xs font-medium text-text-secondary">
                    {approvedCount}/{requiredCount} approved
                  </span>
                )}
              </span>
            </SheetDescription>
          </SheetHeader>

          {/* Preview Area */}
          <div className="mx-4 flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-surface-glass py-12">
            <Icon className="h-12 w-12 text-gray-300 mb-3" />
            <p className="text-sm text-text-muted">Preview not available in prototype</p>
          </div>

          {/* AI Analysis Banner */}
          <div className="mx-4 flex items-center gap-3 rounded-lg border border-purple-200 bg-purple-50 px-4 py-3">
            <Sparkles className="h-4 w-4 text-purple-600 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-purple-900">AI Document Analysis</p>
              <p className="text-[11px] text-purple-700 mt-0.5">
                Analyze this document for compliance gaps, cross-reference findings, and standard alignment.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="shrink-0 gap-1.5 text-xs border-purple-200 text-purple-700 hover:bg-purple-100"
              onClick={() => alert("Navigate to AI Hub with document context (mock)")}
            >
              <Sparkles className="h-3 w-3" />
              Analyze
            </Button>
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

          {/* Tabbed Content */}
          <div className="px-4 pb-4">
            <Tabs defaultValue="details">
              <TabsList variant="line" className="w-full justify-start mb-4">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="versions">Versions</TabsTrigger>
                <TabsTrigger value="approvals">
                  Approvals
                  {hasApprovals && (
                    <span className="ml-1.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-white/[0.06] px-1 text-[10px] font-medium text-text-tertiary">
                      {approvedCount}/{requiredCount}
                    </span>
                  )}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="details">
                <div className="space-y-2">
                  <dl className="space-y-1.5">
                    {metaRows.map((row) => (
                      <div key={row.label} className="flex gap-2 text-sm">
                        <dt className="w-28 shrink-0 text-text-tertiary">{row.label}</dt>
                        <dd className="text-text-heading break-all">{row.value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </TabsContent>

              <TabsContent value="versions">
                <VersionHistory document={doc} />
              </TabsContent>

              <TabsContent value="approvals">
                <DocumentApprovalPanel documentId={doc.id} />
              </TabsContent>
            </Tabs>
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
