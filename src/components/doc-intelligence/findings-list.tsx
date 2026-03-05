"use client";

import { useState, useMemo } from "react";
import { DocIntelligenceFinding } from "@/lib/types";
import { FINDING_TYPE_LABELS, FINDING_SEVERITY_LABELS } from "@/lib/constants";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronDown,
  ChevronRight,
  Wand2,
  FileX,
  GitCompare,
  CalendarClock,
  FileWarning,
  Link2Off,
  ShieldAlert,
  Filter,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface FindingsListProps {
  findings: DocIntelligenceFinding[];
  onSelectFinding: (finding: DocIntelligenceFinding) => void;
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

export function FindingsList({ findings, onSelectFinding }: FindingsListProps) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [severityFilter, setSeverityFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [gatewayFilter, setGatewayFilter] = useState("all");

  const gatewayCodes = useMemo(
    () => [...new Set(findings.map((f) => f.gatewayCode))].sort(),
    [findings]
  );

  const filtered = useMemo(() => {
    return findings.filter((f) => {
      if (severityFilter !== "all" && f.severity !== severityFilter) return false;
      if (typeFilter !== "all" && f.type !== typeFilter) return false;
      if (gatewayFilter !== "all" && f.gatewayCode !== gatewayFilter) return false;
      return true;
    });
  }, [findings, severityFilter, typeFilter, gatewayFilter]);

  const toggleExpand = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">Findings</h2>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-slate-500" />
          <Select value={severityFilter} onValueChange={setSeverityFilter}>
            <SelectTrigger className="h-8 w-[130px] text-xs">
              <SelectValue placeholder="Severity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Severities</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="h-8 w-[150px] text-xs">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {Object.entries(FINDING_TYPE_LABELS).map(([key, label]) => (
                <SelectItem key={key} value={key}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={gatewayFilter} onValueChange={setGatewayFilter}>
            <SelectTrigger className="h-8 w-[110px] text-xs">
              <SelectValue placeholder="Gateway" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Gates</SelectItem>
              {gatewayCodes.map((code) => (
                <SelectItem key={code} value={code}>{code}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <p className="text-xs text-slate-400">
        Showing {filtered.length} of {findings.length} findings
      </p>

      <div className="space-y-2">
        {filtered.map((finding) => {
          const isExpanded = expanded.has(finding.id);
          const TypeIcon = TYPE_ICONS[finding.type] ?? FileWarning;

          return (
            <Card
              key={finding.id}
              className="overflow-hidden transition-shadow hover:shadow-md"
            >
              <button
                onClick={() => toggleExpand(finding.id)}
                className="flex w-full items-start gap-3 px-4 py-3 text-left"
              >
                {isExpanded ? (
                  <ChevronDown className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" />
                ) : (
                  <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" />
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
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
                    <Badge variant="outline" className="text-[10px] text-slate-400">
                      {finding.gatewayCode}
                    </Badge>
                    {finding.autoFixable && (
                      <Badge variant="outline" className="gap-1 text-[10px] bg-emerald-50 text-emerald-700 border-emerald-200">
                        <Wand2 className="h-3 w-3" />
                        Auto-fixable
                      </Badge>
                    )}
                  </div>
                  <p className="mt-1.5 text-sm font-medium text-white">
                    {finding.title}
                  </p>
                </div>
              </button>

              {isExpanded && (
                <div className="border-t border-white/[0.04] bg-white/[0.03] px-4 py-3 pl-11">
                  <p className="text-sm text-slate-400 leading-relaxed">
                    {finding.description}
                  </p>
                  {finding.standardRef && (
                    <p className="mt-2 text-xs text-slate-400">
                      <span className="font-medium">Standard:</span> {finding.standardRef}
                    </p>
                  )}
                  <div className="mt-3 rounded-md bg-blue-50 border border-blue-100 px-3 py-2">
                    <p className="text-xs font-medium text-blue-800">Recommendation</p>
                    <p className="mt-0.5 text-sm text-blue-700">{finding.recommendation}</p>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectFinding(finding);
                      }}
                    >
                      View Details
                    </Button>
                    {finding.autoFixable && (
                      <Button
                        size="sm"
                        className="gap-1 bg-[#ED7D31] text-xs text-white hover:bg-[#d06a28]"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Wand2 className="h-3 w-3" />
                        Apply AI Fix
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
