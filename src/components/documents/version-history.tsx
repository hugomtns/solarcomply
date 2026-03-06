import { Circle, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/status-badge";
import { users } from "@/data/stakeholders";
import { getVersionsForDocument } from "@/data/document-versions";
import type { Document } from "@/lib/types";

interface VersionHistoryProps {
  document: Document;
}

function daysAgo(days: number, from: string): string {
  const d = new Date(from);
  d.setDate(d.getDate() - days);
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function VersionHistory({ document: doc }: VersionHistoryProps) {
  const versionRecords = getVersionsForDocument(doc.id);

  // If we have real version records, use them
  if (versionRecords.length > 0) {
    const sorted = [...versionRecords].sort((a, b) => b.version - a.version);

    return (
      <div className="space-y-3">
        <Button
          variant="outline"
          size="sm"
          className="w-full gap-1.5"
          onClick={() => alert("Upload new version (mock)")}
        >
          <Upload className="h-3.5 w-3.5" />
          Upload New Version
        </Button>

        <div className="relative pl-5">
          {/* Vertical line */}
          <div className="absolute left-[7px] top-1 bottom-1 w-px bg-gray-200" />

          <div className="space-y-4">
            {sorted.map((v) => {
              const uploader = users.find((u) => u.id === v.uploadedBy);
              return (
                <div key={v.id} className="relative flex items-start gap-3">
                  {/* Timeline dot */}
                  <Circle
                    className={`absolute -left-5 mt-0.5 h-3.5 w-3.5 shrink-0 ${
                      v.isCurrent
                        ? "fill-brand-blue text-brand-blue"
                        : "fill-gray-300 text-gray-300"
                    }`}
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-gray-900">
                        v{v.version}
                        {v.isCurrent && (
                          <span className="ml-2 text-xs font-normal text-brand-blue">
                            (current)
                          </span>
                        )}
                      </p>
                      <StatusBadge status={v.status} className="text-[10px] px-1.5 py-0" />
                    </div>
                    <p className="mt-0.5 text-xs text-gray-600">{v.changelog}</p>
                    <p className="mt-1 text-xs text-gray-500">
                      {uploader?.name ?? "Unknown"} &middot; {formatDate(v.uploadedAt)} &middot; {v.fileSizeMB} MB
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Fallback: generate mock version history (backward-compat for docs without records)
  const uploaderPool = users.filter((u) => u.id !== doc.uploadedBy);
  const versions = Array.from({ length: doc.version }, (_, i) => {
    const ver = i + 1;
    const isCurrent = ver === doc.version;
    const uploader = isCurrent
      ? users.find((u) => u.id === doc.uploadedBy) ?? uploaderPool[0]
      : uploaderPool[(ver - 1) % uploaderPool.length];
    const offset = (doc.version - ver) * 21;
    const date = daysAgo(offset, doc.uploadedAt);
    return { ver, uploader, date, isCurrent };
  });

  return (
    <div className="space-y-3">
      <Button
        variant="outline"
        size="sm"
        className="w-full gap-1.5"
        onClick={() => alert("Upload new version (mock)")}
      >
        <Upload className="h-3.5 w-3.5" />
        Upload New Version
      </Button>

      <div className="relative pl-5">
        {/* Vertical line */}
        <div className="absolute left-[7px] top-1 bottom-1 w-px bg-gray-200" />

        <div className="space-y-4">
          {versions.map((v) => (
            <div key={v.ver} className="relative flex items-start gap-3">
              <Circle
                className={`absolute -left-5 mt-0.5 h-3.5 w-3.5 shrink-0 ${
                  v.isCurrent
                    ? "fill-brand-blue text-brand-blue"
                    : "fill-gray-300 text-gray-300"
                }`}
              />
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-900">
                  v{v.ver}
                  {v.isCurrent && (
                    <span className="ml-2 text-xs font-normal text-brand-blue">
                      (current)
                    </span>
                  )}
                </p>
                <p className="text-xs text-gray-500">
                  {v.uploader.name} &middot; {v.date}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
