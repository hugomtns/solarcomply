"use client";

import { useState, useMemo, useCallback } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { gatewayReference, getRequirementsForMarketAndType } from "@/data/gateway-reference";
import { MarketSelector } from "./market-selector";
import { ConfigurableRequirementsList } from "./configurable-requirements-list";
import type { ProjectType, RequirementConfigStatus, CustomRequirement } from "@/lib/types";

export function GatewayConfigurator() {
  const [market, setMarket] = useState("Global");
  const [projectType, setProjectType] = useState<ProjectType>("hybrid");
  const [configs, setConfigs] = useState<Map<string, RequirementConfigStatus>>(new Map());
  const [naReasons, setNaReasons] = useState<Map<string, string>>(new Map());
  const [customRequirements, setCustomRequirements] = useState<CustomRequirement[]>([]);
  const [disabledGateways, setDisabledGateways] = useState<Set<string>>(new Set());

  const totalCount = gatewayReference.reduce((acc, g) => acc + g.requirements.length, 0);

  const filteredRequirements = useMemo(() => {
    const map = new Map<string, ReturnType<typeof getRequirementsForMarketAndType>>();
    for (const gw of gatewayReference) {
      map.set(gw.code, getRequirementsForMarketAndType(gw.code, market, projectType));
    }
    return map;
  }, [market, projectType]);

  const filteredCount = useMemo(() => {
    let count = 0;
    filteredRequirements.forEach((reqs) => { count += reqs.length; });
    return count;
  }, [filteredRequirements]);

  const handleToggle = useCallback((reqId: string, status: RequirementConfigStatus) => {
    setConfigs((prev) => {
      const next = new Map(prev);
      if (status === 'enabled') next.delete(reqId);
      else next.set(reqId, status);
      return next;
    });
    if (status !== 'not_applicable') {
      setNaReasons((prev) => {
        const next = new Map(prev);
        next.delete(reqId);
        return next;
      });
    }
  }, []);

  const handleNaReason = useCallback((reqId: string, reason: string) => {
    setNaReasons((prev) => {
      const next = new Map(prev);
      next.set(reqId, reason);
      return next;
    });
  }, []);

  const handleAddCustom = useCallback((gatewayCode: string, req: Omit<CustomRequirement, 'id' | 'gatewayCode'>) => {
    const id = `custom-${Date.now()}`;
    setCustomRequirements((prev) => [...prev, { ...req, id, gatewayCode }]);
  }, []);

  const handleRemoveCustom = useCallback((id: string) => {
    setCustomRequirements((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const handleToggleGateway = useCallback((gatewayCode: string, enabled: boolean) => {
    setDisabledGateways((prev) => {
      const next = new Set(prev);
      if (enabled) next.delete(gatewayCode);
      else next.add(gatewayCode);
      return next;
    });
  }, []);

  return (
    <div className="space-y-4">
      <MarketSelector
        market={market}
        projectType={projectType}
        onMarketChange={setMarket}
        onProjectTypeChange={setProjectType}
        filteredCount={filteredCount}
        totalCount={totalCount}
      />

      <ScrollArea className="h-[calc(100vh-380px)]">
        <ConfigurableRequirementsList
          gateways={gatewayReference}
          filteredRequirements={filteredRequirements}
          configs={configs}
          naReasons={naReasons}
          customRequirements={customRequirements}
          disabledGateways={disabledGateways}
          onToggle={handleToggle}
          onNaReason={handleNaReason}
          onAddCustom={handleAddCustom}
          onRemoveCustom={handleRemoveCustom}
          onToggleGateway={handleToggleGateway}
        />
      </ScrollArea>
    </div>
  );
}
