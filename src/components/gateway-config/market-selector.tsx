"use client";

import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { PROJECT_TYPE_LABELS } from "@/lib/constants";
import { MARKET_PROFILES } from "@/data/gateway-reference";
import type { ProjectType } from "@/lib/types";

interface MarketSelectorProps {
  market: string;
  projectType: ProjectType;
  onMarketChange: (value: string) => void;
  onProjectTypeChange: (value: ProjectType) => void;
  filteredCount: number;
  totalCount: number;
}

export function MarketSelector({
  market,
  projectType,
  onMarketChange,
  onProjectTypeChange,
  filteredCount,
  totalCount,
}: MarketSelectorProps) {
  return (
    <div className="flex items-center gap-4 rounded-lg border border-white/[0.08] bg-white/[0.05] p-4">
      <div className="flex items-center gap-3">
        <div>
          <label className="text-xs text-slate-400 block mb-1">Market / Jurisdiction</label>
          <Select value={market} onValueChange={onMarketChange}>
            <SelectTrigger className="w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MARKET_PROFILES.map((m) => (
                <SelectItem key={m.id} value={m.code}>
                  {m.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-xs text-slate-400 block mb-1">Project Type</label>
          <Select value={projectType} onValueChange={(v) => onProjectTypeChange(v as ProjectType)}>
            <SelectTrigger className="w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(PROJECT_TYPE_LABELS).map(([k, v]) => (
                <SelectItem key={k} value={k}>{v}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="ml-auto text-right">
        <p className="text-sm font-medium text-white">
          {filteredCount} of {totalCount} requirements
        </p>
        <p className="text-xs text-slate-400">
          applicable for {MARKET_PROFILES.find((m) => m.code === market)?.name ?? market} &middot;{" "}
          {PROJECT_TYPE_LABELS[projectType]}
        </p>
      </div>
    </div>
  );
}
