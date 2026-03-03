"use client";

import { useState } from "react";
import { Upload, FileText, CheckCircle, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/status-badge";
import { documents } from "@/data/documents";
import { projects } from "@/data/projects";
import { DOCUMENT_CATEGORY_LABELS } from "@/lib/constants";
import type { Document } from "@/lib/types";

interface DocumentUploadProps {
  gatewayId: string;
  projectId: string;
}

interface MockUpload {
  id: string;
  name: string;
  fileName: string;
  fileType: string;
  status: "pending_review";
  formatFeedback: string;
  formatValid: boolean;
  uploadedAt: string;
}

function getMockFiles(projectId: string) {
  const project = projects.find((p) => p.id === projectId);
  const slug = project?.name.split(/\s+/)[0] ?? "Project";
  return [
    {
      name: "As-Built SLD Rev4",
      fileName: `${slug}_AsBuilt_SLD_Rev4.dwg`,
      fileType: "dwg",
      formatFeedback: "DWG format detected -- editable as-built confirmed",
      formatValid: true,
    },
    {
      name: "As-Built Layout PDF Export",
      fileName: `${slug}_AsBuilt_Layout_Export.pdf`,
      fileType: "pdf",
      formatFeedback: "PDF format detected -- editable DWG/DXF required per IEC 62446-1 \u00A76.2",
      formatValid: false,
    },
  ];
}

export function DocumentUpload({ gatewayId, projectId }: DocumentUploadProps) {
  const mockFiles = getMockFiles(projectId);
  const [uploads, setUploads] = useState<MockUpload[]>([]);
  const [mockIndex, setMockIndex] = useState(0);

  const gatewayDocs = documents.filter(
    (d) => d.gatewayId === gatewayId && d.projectId === projectId
  );

  const handleMockUpload = () => {
    const mockFile = mockFiles[mockIndex % mockFiles.length];
    const newUpload: MockUpload = {
      id: `mock-upload-${Date.now()}`,
      name: mockFile.name,
      fileName: mockFile.fileName,
      fileType: mockFile.fileType,
      status: "pending_review",
      formatFeedback: mockFile.formatFeedback,
      formatValid: mockFile.formatValid,
      uploadedAt: new Date().toISOString(),
    };
    setUploads((prev) => [newUpload, ...prev]);
    setMockIndex((prev) => prev + 1);
  };

  return (
    <div className="space-y-6">
      {/* Upload zone */}
      <button
        type="button"
        onClick={handleMockUpload}
        className="w-full rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-8 text-center transition-colors hover:border-[#2E75B6] hover:bg-blue-50/50 focus:outline-none focus:ring-2 focus:ring-[#2E75B6] focus:ring-offset-2"
      >
        <Upload className="mx-auto h-8 w-8 text-gray-400" />
        <p className="mt-2 text-sm font-medium text-gray-700">
          Drop files here or click to upload
        </p>
        <p className="mt-1 text-xs text-gray-500">
          Supported: PDF, DWG, DXF, CSV, XLSX, DOCX, JPG, GeoTIFF, IFC
        </p>
      </button>

      {/* Mock upload results */}
      {uploads.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-[#1B2A4A]">Recent Uploads</h3>
          {uploads.map((upload) => (
            <div
              key={upload.id}
              className="rounded-lg border bg-white p-4 space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-900">
                    {upload.name}
                  </span>
                  <Badge variant="outline" className="text-xs">
                    {upload.fileType.toUpperCase()}
                  </Badge>
                  <StatusBadge status="pending_review" />
                </div>
              </div>
              <div
                className={`flex items-start gap-2 rounded-md px-3 py-2 text-xs ${
                  upload.formatValid
                    ? "bg-emerald-50 text-emerald-800"
                    : "bg-amber-50 text-amber-800"
                }`}
              >
                {upload.formatValid ? (
                  <CheckCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" />
                ) : (
                  <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-600" />
                )}
                {upload.formatFeedback}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Existing documents */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-[#1B2A4A]">
          Gateway Documents ({gatewayDocs.length})
        </h3>

        {gatewayDocs.length === 0 ? (
          <p className="text-sm text-gray-500 py-4 text-center">
            No documents associated with this gateway yet.
          </p>
        ) : (
          <div className="rounded-lg border divide-y">
            {gatewayDocs.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between px-4 py-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <FileText className="h-4 w-4 shrink-0 text-gray-400" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {doc.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {DOCUMENT_CATEGORY_LABELS[doc.category] ?? doc.category}
                      {" \u00B7 "}v{doc.version}
                      {" \u00B7 "}{doc.fileSizeMB} MB
                      {" \u00B7 "}
                      {new Date(doc.uploadedAt).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Badge variant="outline" className="text-xs">
                    {doc.fileType.toUpperCase()}
                  </Badge>
                  <StatusBadge status={doc.status} />
                  {!doc.formatValid && (
                    <Badge
                      variant="outline"
                      className="text-xs bg-red-50 text-red-700 border-red-200"
                    >
                      Format Invalid
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
