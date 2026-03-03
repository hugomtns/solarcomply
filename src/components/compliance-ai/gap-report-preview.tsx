"use client";

import { CheckStatus } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, CheckCircle, XCircle, AlertTriangle, Minus } from "lucide-react";

interface GapItem {
  standard: string;
  requirement: string;
  status: CheckStatus;
  action: string;
}

interface GapReportPreviewProps {
  gapItems: GapItem[];
}

export function GapReportPreview({ gapItems }: GapReportPreviewProps) {
  const compliant = gapItems.filter((i) => i.status === "pass").length;
  const gaps = gapItems.filter((i) => i.status === "fail").length;
  const warnings = gapItems.filter((i) => i.status === "warning").length;
  const pending = gapItems.filter((i) => i.status === "pending").length;
  const na = gapItems.filter((i) => i.status === "not_applicable").length;

  const today = new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <Card className="border-blue-200 bg-blue-50/30 shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-[#2E75B6]" />
            <CardTitle className="text-sm font-semibold text-[#1B2A4A]">
              Gap Analysis Report
            </CardTitle>
          </div>
          <span className="text-[11px] text-gray-500">{today}</span>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-600">
          <span className="font-medium">
            {gapItems.length} requirements assessed
          </span>
          <span className="text-gray-300">|</span>
          <span className="flex items-center gap-1">
            <CheckCircle className="h-3 w-3 text-emerald-600" />
            {compliant} compliant
          </span>
          <span className="text-gray-300">|</span>
          <span className="flex items-center gap-1">
            <XCircle className="h-3 w-3 text-red-600" />
            {gaps} gaps identified
          </span>
          {warnings > 0 && (
            <>
              <span className="text-gray-300">|</span>
              <span className="flex items-center gap-1">
                <AlertTriangle className="h-3 w-3 text-amber-600" />
                {warnings} warnings
              </span>
            </>
          )}
          {pending > 0 && (
            <>
              <span className="text-gray-300">|</span>
              <span>{pending} pending</span>
            </>
          )}
          {na > 0 && (
            <>
              <span className="text-gray-300">|</span>
              <span className="flex items-center gap-1">
                <Minus className="h-3 w-3 text-gray-400" />
                {na} not applicable
              </span>
            </>
          )}
        </div>
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5 text-xs"
          onClick={() => {}}
        >
          <Download className="h-3 w-3" />
          Download PDF
        </Button>
      </CardContent>
    </Card>
  );
}
