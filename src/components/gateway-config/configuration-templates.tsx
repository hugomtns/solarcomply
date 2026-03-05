"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PROJECT_TYPE_LABELS } from "@/lib/constants";
import { Copy, Trash2, Download, Plus } from "lucide-react";
import { sampleConfigurations } from "@/data/gateway-config";
import type { GatewayConfiguration } from "@/lib/types";

export function ConfigurationTemplates() {
  const [templates, setTemplates] = useState<GatewayConfiguration[]>(sampleConfigurations);
  const [applied, setApplied] = useState<string | null>(null);

  const handleDuplicate = (config: GatewayConfiguration) => {
    const dupe: GatewayConfiguration = {
      ...config,
      id: `config-${Date.now()}`,
      name: `${config.name} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setTemplates((prev) => [...prev, dupe]);
  };

  const handleDelete = (id: string) => {
    setTemplates((prev) => prev.filter((t) => t.id !== id));
  };

  const handleApply = (id: string) => {
    setApplied(id);
    setTimeout(() => setApplied(null), 2000);
  };

  const typeColors: Record<string, string> = {
    pv: "bg-amber-100 text-amber-800 border-amber-200",
    bess: "bg-blue-100 text-blue-800 border-blue-200",
    hybrid: "bg-purple-100 text-purple-800 border-purple-200",
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-300">
            Save and reuse gateway configurations across projects.
          </p>
          <p className="text-xs text-slate-400 mt-0.5">
            {templates.length} saved templates
          </p>
        </div>
        <Button variant="outline" size="sm" className="gap-1.5">
          <Plus className="h-3.5 w-3.5" />
          Create New Template
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((config) => {
          const naCount = config.requirementConfigs.filter(
            (r) => r.status === "not_applicable"
          ).length;
          const disabledCount = config.requirementConfigs.filter(
            (r) => r.status === "disabled"
          ).length;

          return (
            <Card key={config.id} className="p-4 flex flex-col">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="text-sm font-semibold text-white">{config.name}</h4>
                  <div className="flex items-center gap-1.5 mt-1">
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                      {config.market}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={`text-[10px] px-1.5 py-0 ${typeColors[config.projectType]}`}
                    >
                      {PROJECT_TYPE_LABELS[config.projectType]}
                    </Badge>
                  </div>
                </div>
                {applied === config.id && (
                  <Badge className="bg-teal-500 text-white text-[10px]">Applied!</Badge>
                )}
              </div>

              <div className="grid grid-cols-3 gap-2 mb-3">
                <div className="rounded bg-white/[0.04] p-2 text-center">
                  <p className="text-lg font-semibold text-white">
                    {config.requirementConfigs.length}
                  </p>
                  <p className="text-[10px] text-slate-400">Configured</p>
                </div>
                <div className="rounded bg-white/[0.04] p-2 text-center">
                  <p className="text-lg font-semibold text-slate-400">{naCount}</p>
                  <p className="text-[10px] text-slate-400">N/A</p>
                </div>
                <div className="rounded bg-white/[0.04] p-2 text-center">
                  <p className="text-lg font-semibold text-orange-600">
                    {config.customRequirements.length}
                  </p>
                  <p className="text-[10px] text-slate-400">Custom</p>
                </div>
              </div>

              <p className="text-[10px] text-slate-500 mb-3">
                Updated {new Date(config.updatedAt).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </p>

              <div className="mt-auto flex items-center gap-2">
                <Button
                  size="sm"
                  className="flex-1 bg-[#2E75B6] hover:bg-[#245d91] gap-1 text-xs"
                  onClick={() => handleApply(config.id)}
                >
                  <Download className="h-3 w-3" />
                  Apply
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1 text-xs"
                  onClick={() => handleDuplicate(config)}
                >
                  <Copy className="h-3 w-3" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1 text-xs text-red-500 hover:text-red-700"
                  onClick={() => handleDelete(config.id)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </Card>
          );
        })}

        {templates.length === 0 && (
          <div className="col-span-full text-center py-12">
            <p className="text-sm text-slate-500">No templates yet. Create one to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
}
