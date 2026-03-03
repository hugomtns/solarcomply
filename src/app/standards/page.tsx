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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Search, BookOpen, Globe, Zap } from "lucide-react";
import { PROJECT_TYPE_LABELS } from "@/lib/constants";

const bodyOptions = Array.from(new Set(standards.map((s) => s.body))).sort();

const typeColors: Record<string, string> = {
  pv: "bg-amber-100 text-amber-800 border-amber-200",
  bess: "bg-blue-100 text-blue-800 border-blue-200",
  hybrid: "bg-purple-100 text-purple-800 border-purple-200",
};

export default function StandardsPage() {
  const [search, setSearch] = useState("");
  const [bodyFilter, setBodyFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

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

  return (
    <>
      <PageHeader
        title="Standards Library"
        description={`${standards.length} standards tracked across IEC, IEEE, UL, NFPA, ISO, UN, EU, and FIDIC`}
      >
        <div className="flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 border border-blue-200">
          <BookOpen className="h-3 w-3" />
          {standards.length} Standards
        </div>
      </PageHeader>

      {/* Filters */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
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
            className="text-xs text-gray-500 hover:text-gray-700 underline"
          >
            Clear filters
          </button>
        )}
      </div>

      <p className="mb-3 text-xs text-gray-500">
        Showing {filtered.length} of {standards.length} standards
      </p>

      {/* Standards Table */}
      <Card>
        <Accordion type="multiple" className="w-full">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[140px]">Standard</TableHead>
                <TableHead>Title</TableHead>
                <TableHead className="w-[100px]">Edition</TableHead>
                <TableHead className="w-[120px]">Gateways</TableHead>
                <TableHead className="w-[140px]">Project Types</TableHead>
                <TableHead className="w-[120px]">Jurisdictions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((std) => (
                <AccordionItem key={std.id} value={std.id} className="border-0">
                  <TableRow className="cursor-pointer hover:bg-gray-50">
                    <TableCell className="font-medium text-[#2E75B6]">
                      <AccordionTrigger className="py-0 hover:no-underline">
                        {std.number}
                      </AccordionTrigger>
                    </TableCell>
                    <TableCell className="text-sm text-gray-700 max-w-[400px] truncate">
                      {std.title}
                    </TableCell>
                    <TableCell className="text-xs text-gray-500">{std.edition}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {std.applicableGateways.map((g) => (
                          <Badge
                            key={g}
                            variant="outline"
                            className="text-[10px] px-1.5 py-0 bg-sky-50 text-sky-700 border-sky-200"
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
                        <span className="flex items-center gap-1 text-xs text-gray-400">
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
                  <TableRow>
                    <TableCell colSpan={6} className="p-0">
                      <AccordionContent className="px-4 pb-4 pt-0">
                        <div className="rounded-lg bg-gray-50 p-4">
                          <div className="flex items-start gap-2 mb-2">
                            <Zap className="h-4 w-4 mt-0.5 text-[#2E75B6]" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {std.body} {std.number} — {std.edition}
                              </p>
                              <p className="text-sm text-gray-700 mt-1">{std.title}</p>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mt-3 leading-relaxed">{std.scope}</p>
                          <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
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
                      </AccordionContent>
                    </TableCell>
                  </TableRow>
                </AccordionItem>
              ))}
            </TableBody>
          </Table>
        </Accordion>
      </Card>
    </>
  );
}
