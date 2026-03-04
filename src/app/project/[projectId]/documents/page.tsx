"use client";

import { useState, useMemo, useCallback } from "react";
import { use } from "react";
import { useRouter } from "next/navigation";
import { Upload, FolderOpen, Search } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DocumentTable } from "@/components/documents/document-table";
import { DocumentViewer } from "@/components/documents/document-viewer";
import { DataRoomBuilder } from "@/components/documents/data-room-builder";
import { documents } from "@/data/documents";
import { projects } from "@/data/projects";
import { DOCUMENT_CATEGORY_LABELS, DOCUMENT_STATUS_LABELS } from "@/lib/constants";
import type { Document, DocumentCategory } from "@/lib/types";

interface DocumentsPageProps {
  params: Promise<{ projectId: string }>;
}

const FILE_TYPE_OPTIONS = [
  { value: "all", label: "All Types" },
  { value: "pdf", label: "PDF" },
  { value: "xlsx", label: "Excel" },
  { value: "csv", label: "CSV" },
  { value: "dwg", label: "DWG" },
  { value: "jpg", label: "Image" },
  { value: "docx", label: "Word" },
];

export default function DocumentsPage({ params }: DocumentsPageProps) {
  const { projectId } = use(params);
  const project = projects.find((p) => p.id === projectId);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [fileTypeFilter, setFileTypeFilter] = useState("all");
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [dataRoomOpen, setDataRoomOpen] = useState(false);

  const projectDocs = useMemo(
    () => documents.filter((d) => d.projectId === projectId),
    [projectId]
  );

  // Collect unique categories present in this project's documents
  const categories = useMemo(() => {
    const cats = new Set(projectDocs.map((d) => d.category));
    return Array.from(cats).sort();
  }, [projectDocs]);

  const filteredDocs = useMemo(() => {
    return projectDocs.filter((doc) => {
      if (search) {
        const q = search.toLowerCase();
        const nameMatch = doc.name.toLowerCase().includes(q);
        const fileMatch = doc.fileName.toLowerCase().includes(q);
        const tagMatch = doc.tags.some((t) => t.toLowerCase().includes(q));
        if (!nameMatch && !fileMatch && !tagMatch) return false;
      }
      if (categoryFilter !== "all" && doc.category !== categoryFilter) return false;
      if (statusFilter !== "all" && doc.status !== statusFilter) return false;
      if (fileTypeFilter !== "all" && doc.fileType !== fileTypeFilter) return false;
      return true;
    });
  }, [projectDocs, search, categoryFilter, statusFilter, fileTypeFilter]);

  const router = useRouter();

  const handleSelect = useCallback((doc: Document) => {
    if (doc.id.startsWith("doc-g8-annual-")) {
      router.push(`/project/${projectId}/documents/${doc.id}`);
      return;
    }
    setSelectedDoc(doc);
    setViewerOpen(true);
  }, [projectId, router]);

  return (
    <>
      <PageHeader
        title="Documents"
        description={`${projectDocs.length} documents in project`}
      >
        <Button
          variant="outline"
          onClick={() => setDataRoomOpen(true)}
        >
          <FolderOpen className="h-4 w-4" />
          Build Data Room
        </Button>
        <Button onClick={() => alert("Upload dialog (mock)")}>
          <Upload className="h-4 w-4" />
          Upload
        </Button>
      </PageHeader>

      {/* Filter Bar */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search documents..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {DOCUMENT_CATEGORY_LABELS[cat] ?? cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {Object.entries(DOCUMENT_STATUS_LABELS).map(([key, label]) => (
              <SelectItem key={key} value={key}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={fileTypeFilter} onValueChange={setFileTypeFilter}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="File Type" />
          </SelectTrigger>
          <SelectContent>
            {FILE_TYPE_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {(search || categoryFilter !== "all" || statusFilter !== "all" || fileTypeFilter !== "all") && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSearch("");
              setCategoryFilter("all");
              setStatusFilter("all");
              setFileTypeFilter("all");
            }}
          >
            Clear filters
          </Button>
        )}
      </div>

      {/* Result count */}
      <p className="mb-2 text-xs text-gray-500">
        Showing {filteredDocs.length} of {projectDocs.length} documents
      </p>

      {/* Document Table */}
      <div className="rounded-lg border bg-white">
        <DocumentTable documents={filteredDocs} onSelect={handleSelect} />
      </div>

      {/* Document Viewer Sheet */}
      <DocumentViewer
        document={selectedDoc}
        open={viewerOpen}
        onOpenChange={setViewerOpen}
      />

      {/* Data Room Builder Dialog */}
      <DataRoomBuilder
        documents={projectDocs}
        open={dataRoomOpen}
        onOpenChange={setDataRoomOpen}
        projectName={project?.name}
      />
    </>
  );
}
