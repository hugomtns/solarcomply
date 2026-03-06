"use client";

import { use, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  FileText,
  FileSpreadsheet,
  FileImage,
  Download,
  Share2,
  Trash2,
  Sparkles,
  Clock,
  HardDrive,
  Tag,
  Calendar,
  User,
  Building2,
  ShieldCheck,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatusBadge } from "@/components/shared/status-badge";
import { SimpleMarkdown } from "@/components/shared/simple-markdown";
import { VersionHistory } from "@/components/documents/version-history";
import { DocumentApprovalPanel } from "@/components/documents/document-approval-panel";
import { documents } from "@/data/documents";
import { gateways } from "@/data/gateways";
import { users } from "@/data/stakeholders";
import { getApprovalsForDocument } from "@/data/document-approvals";
import { DOCUMENT_CATEGORY_LABELS } from "@/lib/constants";
import {
  generateG8AnnualReport,
  renderG8AnnualReportMarkdown,
} from "@/data/synthetic-docs/g8-annual-report";

interface DocumentPageProps {
  params: Promise<{ projectId: string; documentId: string }>;
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
  });
}

function formatSize(mb: number) {
  if (mb >= 1000) return `${(mb / 1000).toFixed(1)} GB`;
  if (mb < 1) return `${Math.round(mb * 1024)} KB`;
  return `${mb.toFixed(1)} MB`;
}

export default function DocumentPage({ params }: DocumentPageProps) {
  const { projectId, documentId } = use(params);
  const [activeTab, setActiveTab] = useState("details");

  const doc = documents.find(
    (d) => d.id === documentId && d.projectId === projectId
  );

  if (!doc) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <h1 className="text-2xl font-semibold text-text-heading">
          Document Not Found
        </h1>
        <p className="mt-2 text-sm text-text-tertiary">
          The requested document does not exist.
        </p>
        <Link
          href={`/project/${projectId}/documents`}
          className="mt-4 text-sm text-brand-blue hover:underline"
        >
          Back to Documents
        </Link>
      </div>
    );
  }

  const Icon = getFileIcon(doc.fileType);
  const gateway = gateways.find((g) => g.id === doc.gatewayId);
  const uploader = users.find((u) => u.id === doc.uploadedBy);
  const isSynthetic = doc.id.startsWith("doc-g8-annual-");
  const approvals = getApprovalsForDocument(doc.id);
  const approvedCount = approvals.filter((a) => a.status === "approved").length;
  const requiredCount = approvals.filter((a) => a.status !== "not_required").length;

  return (
    <div className="animate-fade-in space-y-6">
      {/* Back link */}
      <Link
        href={`/project/${projectId}/documents`}
        className="inline-flex items-center gap-1.5 text-sm text-brand-blue hover:underline"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Documents
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-glass border border-white/[0.08]">
              <Icon className="h-5 w-5 text-text-tertiary" />
            </div>
            <div>
              <h1 className="text-xl font-semibold font-display text-white">{doc.name}</h1>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <StatusBadge status={doc.status} />
                {approvals.length > 0 && (
                  <Badge variant="outline" className="text-xs">
                    {approvedCount}/{requiredCount} approved
                  </Badge>
                )}
                <span className="text-xs text-text-muted">
                  v{doc.version} &middot; {formatDate(doc.uploadedAt)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <Button variant="outline" size="sm" className="gap-1.5">
            <Upload className="h-4 w-4" />
            New Version
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => alert("Download started (mock)")}>
            <Download className="h-4 w-4" />
            Download
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => alert("Share link copied (mock)")}>
            <Share2 className="h-4 w-4" />
            Share
          </Button>
          <Button variant="destructive" size="sm" onClick={() => alert("Document deleted (mock)")}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left: Preview + Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* AI Analysis Banner */}
          <div className="flex items-center gap-3 rounded-lg border border-status-special/25 bg-status-special/15 px-4 py-3">
            <Sparkles className="h-4 w-4 text-palette-purple-400 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-palette-purple-400">AI Document Analysis</p>
              <p className="text-[11px] text-text-tertiary mt-0.5">
                Analyze for compliance gaps, cross-reference findings, and standard alignment.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="shrink-0 gap-1.5 text-xs border-status-special/25 text-palette-purple-400 hover:bg-status-special/15"
            >
              <Sparkles className="h-3 w-3" />
              Analyze
            </Button>
          </div>

          {/* Document Preview / Content */}
          {isSynthetic ? (
            <Card className="p-6">
              <SimpleMarkdown
                content={renderG8AnnualReportMarkdown(
                  generateG8AnnualReport(doc.projectId)
                )}
              />
            </Card>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-white/[0.08] bg-surface-glass py-24">
              <Icon className="h-16 w-16 text-text-disabled mb-4" />
              <p className="text-sm text-text-muted">Preview not available in prototype</p>
              <p className="text-xs text-text-disabled mt-1">{doc.fileName}</p>
            </div>
          )}
        </div>

        {/* Right: Metadata + Tabs */}
        <div className="space-y-6">
          {/* Metadata Card */}
          <Card className="p-5">
            <h3 className="text-sm font-medium text-text-heading mb-4">Document Details</h3>
            <dl className="space-y-3">
              <div className="flex items-start gap-3 text-sm">
                <FileText className="h-4 w-4 text-text-muted mt-0.5 shrink-0" />
                <div>
                  <dt className="text-[11px] text-text-muted uppercase tracking-wider">File</dt>
                  <dd className="text-text-secondary">{doc.fileName}</dd>
                  <dd className="text-xs text-text-muted">{doc.fileType.toUpperCase()} &middot; {formatSize(doc.fileSizeMB)}</dd>
                </div>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <Tag className="h-4 w-4 text-text-muted mt-0.5 shrink-0" />
                <div>
                  <dt className="text-[11px] text-text-muted uppercase tracking-wider">Category</dt>
                  <dd className="text-text-secondary">{DOCUMENT_CATEGORY_LABELS[doc.category] ?? doc.category}</dd>
                </div>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <ShieldCheck className="h-4 w-4 text-text-muted mt-0.5 shrink-0" />
                <div>
                  <dt className="text-[11px] text-text-muted uppercase tracking-wider">Gateway</dt>
                  <dd className="text-text-secondary">{gateway ? `${gateway.code} — ${gateway.name}` : "N/A"}</dd>
                </div>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <User className="h-4 w-4 text-text-muted mt-0.5 shrink-0" />
                <div>
                  <dt className="text-[11px] text-text-muted uppercase tracking-wider">Uploaded By</dt>
                  <dd className="text-text-secondary">{uploader?.name ?? "Unknown"}</dd>
                </div>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <Building2 className="h-4 w-4 text-text-muted mt-0.5 shrink-0" />
                <div>
                  <dt className="text-[11px] text-text-muted uppercase tracking-wider">Organization</dt>
                  <dd className="text-text-secondary">{uploader?.role ?? "—"}</dd>
                </div>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <Calendar className="h-4 w-4 text-text-muted mt-0.5 shrink-0" />
                <div>
                  <dt className="text-[11px] text-text-muted uppercase tracking-wider">Upload Date</dt>
                  <dd className="text-text-secondary">{formatDate(doc.uploadedAt)}</dd>
                </div>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <HardDrive className="h-4 w-4 text-text-muted mt-0.5 shrink-0" />
                <div>
                  <dt className="text-[11px] text-text-muted uppercase tracking-wider">Retention</dt>
                  <dd className="text-text-secondary">{doc.retentionYears} years</dd>
                </div>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <Clock className="h-4 w-4 text-text-muted mt-0.5 shrink-0" />
                <div>
                  <dt className="text-[11px] text-text-muted uppercase tracking-wider">Format Valid</dt>
                  <dd className={doc.formatValid ? "text-primary" : "text-status-error"}>
                    {doc.formatValid ? "Yes" : "No"}
                  </dd>
                </div>
              </div>
              {doc.tags.length > 0 && (
                <div className="pt-2 border-t border-white/[0.06]">
                  <div className="flex flex-wrap gap-1.5">
                    {doc.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-[10px]">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </dl>
          </Card>

          {/* Versions & Approvals Tabs */}
          <Card className="p-5">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList variant="line" className="w-full justify-start mb-4">
                <TabsTrigger value="details" className="text-xs">Versions</TabsTrigger>
                <TabsTrigger value="approvals" className="text-xs">
                  Approvals
                  {approvals.length > 0 && (
                    <span className="ml-1.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-white/[0.06] px-1 text-[10px] font-medium text-text-tertiary">
                      {approvedCount}/{requiredCount}
                    </span>
                  )}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="details">
                <VersionHistory document={doc} />
              </TabsContent>

              <TabsContent value="approvals">
                <DocumentApprovalPanel documentId={doc.id} />
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </div>
    </div>
  );
}
