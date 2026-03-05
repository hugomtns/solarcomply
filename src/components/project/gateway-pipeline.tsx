"use client";

import { useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GatewayCard } from "@/components/project/gateway-card";
import { getGatewaysForProject } from "@/data/gateways";
import { projects } from "@/data/projects";

interface GatewayPipelineProps {
  projectId: string;
}

export function GatewayPipeline({ projectId }: GatewayPipelineProps) {
  const gateways = getGatewaysForProject(projectId);
  const project = projects.find((p) => p.id === projectId);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Scroll to the current gateway on mount
  useEffect(() => {
    if (!scrollRef.current || !project) return;
    const currentIndex = gateways.findIndex(
      (g) => g.id === project.currentGatewayId
    );
    if (currentIndex > 0) {
      const nodeWidth = 104; // nodeBox (56px) + connector w-12 (48px)
      const scrollTarget = currentIndex * nodeWidth - 60;
      scrollRef.current.scrollTo({ left: scrollTarget, behavior: "smooth" });
    }
  }, [gateways, project]);

  if (gateways.length === 0) {
    return null;
  }

  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle className="text-sm font-semibold text-white">Gateway Pipeline</CardTitle>
      </CardHeader>
      <CardContent>
        <div
          ref={scrollRef}
          className="overflow-x-auto pb-2 scrollbar-thin"
        >
          <div className="flex items-start gap-0 px-2 py-2">
            {gateways.map((gateway, index) => (
              <GatewayCard
                key={gateway.id}
                gateway={gateway}
                isCurrent={gateway.id === project?.currentGatewayId}
                isLast={index === gateways.length - 1}
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
