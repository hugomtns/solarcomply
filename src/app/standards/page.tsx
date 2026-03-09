"use client";

import { useState, useMemo } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { standards } from "@/data/standards";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, BookOpen, Globe, Zap, ChevronRight } from "lucide-react";
import { PROJECT_TYPE_LABELS } from "@/lib/constants";

const bodyOptions = Array.from(new Set(standards.map((s) => s.body))).sort();

const typeColors: Record<string, string> = {
  pv: "bg-status-warning/20 text-status-warning-light border-status-warning/25",
  bess: "bg-status-info/20 text-palette-blue-400 border-status-info/25",
  hybrid: "bg-status-special/20 text-palette-purple-400 border-status-special/25",
};

export default function StandardsPage() {
  const [search, setSearch] = useState("");
  const [bodyFilter, setBodyFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const filtered = useMemo(() => {
    return standards.filter((s) => {
      const matchSearch =
        !search ||
        s.number.toLowerCase().includes(search.toLowerCase()) ||
        s.title.toLowerCase().includes(search.toLowerCase()) ||
        s.scope.toLowerCase().includes(search.toLowerCase());
      const matchBody = bodyFilter === "all" || s.body === bodyFilter;
      const matchType =
        typeFilter === "all" || s.projectTypes.includes(typeFilter as "pv" | "bess" | "hybrid");
      return matchSearch && matchBody && matchType;
    });
  }, [search, bodyFilter, typeFilter]);

  function toggleRow(id: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <>
      <PageHeader
        title="Standards Library"
        description={`${standards.length} standards tracked across IEC, IEEE, UL, NFPA, ISO, UN, EU, and FIDIC`}
      >
        <div className="flex items-center gap-1.5 rounded-full bg-status-info/15 px-3 py-1 text-xs font-medium text-palette-blue-400 border border-status-info/25">
          <BookOpen className="h-3 w-3" />
          {standards.length} Standards
        </div>
      </PageHeader>

      {/* Filters */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
          <Input
            placeholder="Search standards..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={bodyFilter} onValueChange={setBodyFilter}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Standards Body" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Bodies</SelectItem>
            {bodyOptions.map((b) => (
              <SelectItem key={b} value={b}>
                {b}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Project Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="pv">Solar PV</SelectItem>
            <SelectItem value="bess">BESS</SelectItem>
            <SelectItem value="hybrid">Hybrid</SelectItem>
          </SelectContent>
        </Select>
        {(search || bodyFilter !== "all" || typeFilter !== "all") && (
          <button
            onClick={() => {
              setSearch("");
              setBodyFilter("all");
              setTypeFilter("all");
            }}
            className="text-xs text-text-muted hover:text-text-secondary underline"
          >
            Clear filters
          </button>
        )}
      </div>

      <p className="mb-3 text-xs text-text-muted">
        Showing {filtered.length} of {standards.length} standards
      </p>

      {/* Standards Table */}
      {filtered.length === 0 ? (
        <Card className="flex flex-col items-center justify-center py-16 text-center">
          <Search className="h-8 w-8 text-text-disabled mb-3" />
          <p className="text-sm font-medium text-text-secondary">No standards match your filters</p>
          <p className="text-xs text-text-muted mt-1">Try adjusting your search or filter criteria</p>
        </Card>
      ) : (
      <Card className="overflow-hidden">
        <Table className="table-fixed">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[12%]">Standard</TableHead>
              <TableHead className="w-[32%]">Title</TableHead>
              <TableHead className="w-[10%]">Edition</TableHead>
              <TableHead className="w-[16%]">Gateways</TableHead>
              <TableHead className="w-[15%]">Project Types</TableHead>
              <TableHead className="w-[15%]">Jurisdictions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((std) => (
              <>
                <TableRow
                  key={std.id}
                  className="cursor-pointer hover:bg-surface-glass"
                  onClick={() => toggleRow(std.id)}
                >
                  <TableCell className="font-medium text-brand-blue">
                    <div className="flex items-center gap-1.5">
                      <ChevronRight
                        className={`h-4 w-4 shrink-0 text-text-muted transition-transform ${
                          expanded.has(std.id) ? "rotate-90" : ""
                        }`}
                      />
                      {std.number}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-text-secondary truncate">
                    {std.title}
                  </TableCell>
                  <TableCell className="text-xs text-text-muted">{std.edition}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {std.applicableGateways.map((g) => (
                        <Badge
                          key={g}
                          variant="outline"
                          className="text-[10px] px-1.5 py-0 bg-status-info/15 text-palette-blue-400 border-status-info/25"
                        >
                          {g}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {std.projectTypes.map((t) => (
                        <Badge
                          key={t}
                          variant="outline"
                          className={`text-[10px] px-1.5 py-0 ${typeColors[t]}`}
                        >
                          {PROJECT_TYPE_LABELS[t]}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    {std.jurisdictions.length === 0 ? (
                      <span className="flex items-center gap-1 text-xs text-text-muted">
                        <Globe className="h-3 w-3" /> Global
                      </span>
                    ) : (
                      <div className="flex flex-wrap gap-1">
                        {std.jurisdictions.map((j) => (
                          <Badge
                            key={j}
                            variant="outline"
                            className="text-[10px] px-1.5 py-0"
                          >
                            {j}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </TableCell>
                </TableRow>
                {expanded.has(std.id) && (
                  <TableRow key={`${std.id}-detail`}>
                    <TableCell colSpan={6} className="p-0">
                      <div className="px-4 pb-4 pt-2">
                        <div className="rounded-lg bg-surface-glass p-4">
                          <div className="flex items-start gap-2 mb-2">
                            <Zap className="h-4 w-4 mt-0.5 text-brand-blue" />
                            <div>
                              <p className="text-sm font-medium text-text-heading">
                                {std.body} {std.number} — {std.edition}
                              </p>
                              <p className="text-sm text-text-secondary mt-1">{std.title}</p>
                            </div>
                          </div>
                          <p className="text-sm text-text-tertiary mt-3 leading-relaxed break-words">{std.scope}</p>
                          <div className="mt-3 flex items-center gap-4 text-xs text-text-muted">
                            <span>
                              <strong>Applicable Gateways:</strong>{" "}
                              {std.applicableGateways.join(", ")}
                            </span>
                            <span>
                              <strong>Jurisdictions:</strong>{" "}
                              {std.jurisdictions.length === 0
                                ? "Global"
                                : std.jurisdictions.join(", ")}
                            </span>
                          </div>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </>
            ))}
          </TableBody>
        </Table>
      </Card>
      )}
    </>
  );
}
