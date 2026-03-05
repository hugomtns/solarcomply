"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";
import { StatusBadge } from "@/components/shared/status-badge";
import { SimpleMarkdown } from "@/components/shared/simple-markdown";
import { documents } from "@/data/documents";
import { gateways } from "@/data/gateways";
import { DOCUMENT_CATEGORY_LABELS } from "@/lib/constants";
import {
  generateG8AnnualReport,
  renderG8AnnualReportMarkdown,
} from "@/data/synthetic-docs/g8-annual-report";

interface DocumentPageProps {
  params: Promise<{ projectId: string; documentId: string }>;
}

export default function DocumentPage({ params }: DocumentPageProps) {
  const { projectId, documentId } = use(params);
  const doc = documents.find(
    (d) => d.id === documentId && d.projectId === projectId
  );

  if (!doc) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <h1 className="text-2xl font-semibold text-slate-200">
          Document Not Found
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          The requested document does not exist.
        </p>
        <Link
          href={`/project/${projectId}/documents`}
          className="mt-4 text-sm text-[#2E75B6] hover:underline"
        >
          Back to Documents
        </Link>
      </div>
    );
  }

  const gateway = gateways.find((g) => g.id === doc.gatewayId);
  const isSynthetic = doc.id.startsWith("doc-g8-annual-");

  return (
    <div className="space-y-4">
      {/* Back link */}
      <Link
        href={`/project/${projectId}/documents`}
        className="inline-flex items-center gap-1.5 text-sm text-[#2E75B6] hover:underline"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Documents
      </Link>

      {/* Compact header */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-xl font-semibold text-white">{doc.name}</h1>
          <div className="flex items-center gap-2 text-sm text-slate-400 flex-wrap">
            <StatusBadge status={doc.status} />
            <span>{DOCUMENT_CATEGORY_LABELS[doc.category] ?? doc.category}</span>
            <span>&middot;</span>
            <span>{gateway ? `${gateway.code} - ${gateway.name}` : "N/A"}</span>
            <span>&middot;</span>
            <span>v{doc.version}</span>
            <span>&middot;</span>
            <span>
              {new Date(doc.uploadedAt).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>
        </div>
      </div>

      {/* Content area */}
      {isSynthetic ? (
        <div className="rounded-lg border border-white/[0.08] bg-white/[0.05] p-6 md:p-8">
          <SimpleMarkdown
            content={renderG8AnnualReportMarkdown(
              generateG8AnnualReport(doc.projectId)
            )}
          />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-white/[0.04] py-20">
          <FileText className="h-12 w-12 text-gray-300 mb-3" />
          <p className="text-sm text-slate-500">
            Preview not available in prototype
          </p>
        </div>
      )}
    </div>
  );
}
