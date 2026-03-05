"use client";

import { useState } from "react";
import { DocIntelligenceFinding } from "@/lib/types";
import { FINDING_TYPE_LABELS, FINDING_SEVERITY_LABELS } from "@/lib/constants";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { documents } from "@/data/documents";
import {
  Wand2,
  FileText,
  BookOpen,
  Lightbulb,
  CheckCircle,
  FileX,
  GitCompare,
  CalendarClock,
  FileWarning,
  Link2Off,
  ShieldAlert,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface FindingDetailSheetProps {
  finding: DocIntelligenceFinding | null;
  onClose: () => void;
}

const SEVERITY_COLORS: Record<string, string> = {
  critical: "bg-red-100 text-red-800 border-red-200",
  high: "bg-orange-100 text-orange-800 border-orange-200",
  medium: "bg-amber-100 text-amber-800 border-amber-200",
  low: "bg-blue-100 text-blue-800 border-blue-200",
};

const TYPE_ICONS: Record<string, typeof FileX> = {
  missing_document: FileX,
  inconsistency: GitCompare,
  outdated: CalendarClock,
  format_error: FileWarning,
  cross_reference: Link2Off,
  coverage_gap: ShieldAlert,
};

export function FindingDetailSheet({ finding, onClose }: FindingDetailSheetProps) {
  const [fixApplied, setFixApplied] = useState(false);

  if (!finding) return null;

  const TypeIcon = TYPE_ICONS[finding.type] ?? FileWarning;
  const affectedDocs = (finding.affectedDocumentIds ?? [])
    .map((id) => documents.find((d) => d.id === id))
    .filter(Boolean);

  return (
    <Sheet open={!!finding} onOpenChange={() => { setFixApplied(false); onClose(); }}>
      <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-lg">
        <SheetHeader>
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className={cn("text-[10px] font-semibold uppercase", SEVERITY_COLORS[finding.severity])}
            >
              {FINDING_SEVERITY_LABELS[finding.severity]}
            </Badge>
            <Badge variant="outline" className="gap-1 text-[10px] text-slate-400">
              <TypeIcon className="h-3 w-3" />
              {FINDING_TYPE_LABELS[finding.type]}
            </Badge>
          </div>
          <SheetTitle className="text-white">{finding.title}</SheetTitle>
          <SheetDescription>
            Gateway {finding.gatewayCode}
            {finding.standardRef && ` · ${finding.standardRef}`}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-4 space-y-5 px-4 pb-6">
          <div>
            <h3 className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Description
            </h3>
            <p className="text-sm leading-relaxed text-slate-300">
              {finding.description}
            </p>
          </div>

          <Separator />

          {affectedDocs.length > 0 && (
            <>
              <div>
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Affected Documents
                </h3>
                <div className="space-y-1.5">
                  {affectedDocs.map((doc) => (
                    <div
                      key={doc!.id}
                      className="flex items-center gap-2 rounded-md border border-white/[0.08] px-3 py-2"
                    >
                      <FileText className="h-4 w-4 shrink-0 text-[#2E75B6]" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-slate-300">
                          {doc!.name}
                        </p>
                        <p className="text-[11px] text-slate-500">
                          {doc!.fileName} · v{doc!.version}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <Separator />
            </>
          )}

          {finding.standardRef && (
            <>
              <div>
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Standard Reference
                </h3>
                <div className="flex items-center gap-2 rounded-md border border-white/[0.08] px-3 py-2">
                  <BookOpen className="h-4 w-4 shrink-0 text-[#2E75B6]" />
                  <p className="text-sm font-medium text-slate-300">
                    {finding.standardRef}
                  </p>
                </div>
              </div>
              <Separator />
            </>
          )}

          <div>
            <h3 className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
              <Lightbulb className="h-3.5 w-3.5" />
              Recommendation
            </h3>
            <div className="rounded-md bg-blue-50 border border-blue-100 px-3 py-2.5">
              <p className="text-sm leading-relaxed text-blue-700">
                {finding.recommendation}
              </p>
            </div>
          </div>

          {finding.autoFixable && (
            <div className="pt-2">
              {fixApplied ? (
                <div className="flex items-center gap-2 rounded-md bg-emerald-50 border border-emerald-200 px-4 py-3">
                  <CheckCircle className="h-5 w-5 text-emerald-600" />
                  <div>
                    <p className="text-sm font-medium text-emerald-800">AI Fix Applied</p>
                    <p className="text-xs text-emerald-600">
                      The suggested fix has been applied successfully.
                    </p>
                  </div>
                </div>
              ) : (
                <Button
                  className="w-full gap-2 bg-[#ED7D31] text-white hover:bg-[#d06a28]"
                  onClick={() => setFixApplied(true)}
                >
                  <Wand2 className="h-4 w-4" />
                  Apply AI Fix
                </Button>
              )}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
