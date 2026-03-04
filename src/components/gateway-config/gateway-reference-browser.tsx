"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search } from "lucide-react";
import { LIFECYCLE_STAGE_LABELS } from "@/lib/constants";
import { gatewayReference } from "@/data/gateway-reference";
import { GatewayRefCard } from "./gateway-ref-card";
import { GatewayRefDetail } from "./gateway-ref-detail";

export function GatewayReferenceBrowser() {
  const [selected, setSelected] = useState(gatewayReference[0].code);
  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const stageOptions = useMemo(() => {
    const stages = Array.from(new Set(gatewayReference.map((g) => g.lifecycleStage)));
    return stages;
  }, []);

  const filtered = useMemo(() => {
    return gatewayReference.filter((gw) => {
      const matchSearch =
        !search ||
        gw.code.toLowerCase().includes(search.toLowerCase()) ||
        gw.name.toLowerCase().includes(search.toLowerCase()) ||
        gw.requirements.some((r) => r.label.toLowerCase().includes(search.toLowerCase()));
      const matchStage = stageFilter === "all" || gw.lifecycleStage === stageFilter;
      const matchType =
        typeFilter === "all" ||
        gw.requirements.some((r) =>
          r.applicableProjectTypes.includes(typeFilter as "pv" | "bess" | "hybrid")
        );
      return matchSearch && matchStage && matchType;
    });
  }, [search, stageFilter, typeFilter]);

  const selectedGateway = gatewayReference.find((g) => g.code === selected) ?? gatewayReference[0];

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search gateways or requirements..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={stageFilter} onValueChange={setStageFilter}>
          <SelectTrigger className="w-[170px]">
            <SelectValue placeholder="Lifecycle Stage" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Stages</SelectItem>
            {stageOptions.map((s) => (
              <SelectItem key={s} value={s}>
                {LIFECYCLE_STAGE_LABELS[s]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Project Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="pv">Solar PV</SelectItem>
            <SelectItem value="bess">BESS</SelectItem>
            <SelectItem value="hybrid">Hybrid</SelectItem>
          </SelectContent>
        </Select>
        {(search || stageFilter !== "all" || typeFilter !== "all") && (
          <button
            onClick={() => { setSearch(""); setStageFilter("all"); setTypeFilter("all"); }}
            className="text-xs text-gray-500 hover:text-gray-700 underline"
          >
            Clear filters
          </button>
        )}
      </div>

      <p className="text-xs text-gray-500">
        Showing {filtered.length} of {gatewayReference.length} gateways &middot;{" "}
        {gatewayReference.reduce((acc, g) => acc + g.requirements.length, 0)} total requirements
      </p>

      {/* Two-column layout */}
      <div className="flex gap-4">
        {/* Left - Gateway list */}
        <div className="w-1/3 shrink-0">
          <ScrollArea className="h-[calc(100vh-320px)]">
            <div className="space-y-2 pr-2">
              {filtered.map((gw) => (
                <GatewayRefCard
                  key={gw.code}
                  gateway={gw}
                  isSelected={gw.code === selected}
                  onClick={() => setSelected(gw.code)}
                />
              ))}
              {filtered.length === 0 && (
                <p className="text-sm text-gray-400 text-center py-8">No gateways match your filters</p>
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Right - Detail panel */}
        <div className="flex-1 min-w-0">
          <ScrollArea className="h-[calc(100vh-320px)]">
            <GatewayRefDetail gateway={selectedGateway} />
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
