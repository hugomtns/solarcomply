import { Circle } from "lucide-react";
import { users } from "@/data/stakeholders";
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

export function VersionHistory({ document: doc }: VersionHistoryProps) {
  // Generate mock version history from the document's current version
  const uploaderPool = users.filter((u) => u.id !== doc.uploadedBy);
  const versions = Array.from({ length: doc.version }, (_, i) => {
    const ver = i + 1;
    const isCurrent = ver === doc.version;
    // The current version uses the actual uploader; older versions pick from the pool
    const uploader = isCurrent
      ? users.find((u) => u.id === doc.uploadedBy) ?? uploaderPool[0]
      : uploaderPool[(ver - 1) % uploaderPool.length];
    // Stagger dates backwards from the upload date
    const offset = (doc.version - ver) * 21; // ~3 weeks per version
    const date = daysAgo(offset, doc.uploadedAt);
    return { ver, uploader, date, isCurrent };
  });

  return (
    <div className="relative pl-5">
      {/* Vertical line */}
      <div className="absolute left-[7px] top-1 bottom-1 w-px bg-gray-200" />

      <div className="space-y-4">
        {versions.map((v) => (
          <div key={v.ver} className="relative flex items-start gap-3">
            {/* Timeline dot */}
            <Circle
              className={`absolute -left-5 mt-0.5 h-3.5 w-3.5 shrink-0 ${
                v.isCurrent
                  ? "fill-[#2E75B6] text-[#2E75B6]"
                  : "fill-gray-300 text-gray-300"
              }`}
            />
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-900">
                v{v.ver}
                {v.isCurrent && (
                  <span className="ml-2 text-xs font-normal text-[#2E75B6]">
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
  );
}
