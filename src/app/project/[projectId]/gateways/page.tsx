"use client";

import { use } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { GatewayListItem } from "@/components/gateway/gateway-list-item";
import { getGatewaysForProject } from "@/data/gateways";
import { projects } from "@/data/projects";

interface GatewaysPageProps {
  params: Promise<{ projectId: string }>;
}

export default function GatewaysPage({ params }: GatewaysPageProps) {
  const { projectId } = use(params);
  const gateways = getGatewaysForProject(projectId);
  const project = projects.find((p) => p.id === projectId);

  const passedCount = gateways.filter((g) => g.status === "passed").length;

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Gateways"
        description={`${passedCount} of ${gateways.length} gateways passed`}
      />

      <div className="space-y-3">
        {gateways.map((gw) => (
          <GatewayListItem
            key={gw.id}
            gateway={gw}
            isCurrent={gw.id === project?.currentGatewayId}
          />
        ))}
      </div>
    </div>
  );
}
