"use client";

import { use } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FEOCCompliancePanel } from "@/components/supply-chain/feoc-compliance-panel";
import { ForcedLabourPanel } from "@/components/supply-chain/forced-labour-panel";
import { BatteryPassportPanel } from "@/components/supply-chain/battery-passport-panel";
import { RegulatoryTimeline } from "@/components/supply-chain/regulatory-timeline";
import { projects } from "@/data/projects";
import { ShieldCheck, Scale, Battery, Clock } from "lucide-react";

export default function SupplyChainPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = use(params);
  const project = projects.find((p) => p.id === projectId);

  if (!project) return <div className="p-8">Project not found.</div>;

  const isUS = project.jurisdictions.includes("US");
  const isEU = project.jurisdictions.some((j) => j === "EU" || j === "DE");
  const hasBESS = project.type === "bess" || project.type === "hybrid";

  const defaultTab = isUS ? "feoc" : isEU ? "forced-labour" : "timeline";

  return (
    <div className="space-y-6">
      <PageHeader
        title="Supply Chain Compliance"
        description={`Regulatory supply chain requirements for ${project.name}`}
      />

      <Tabs defaultValue={defaultTab}>
        <TabsList>
          <TabsTrigger value="feoc" className="gap-1.5">
            <ShieldCheck className="h-4 w-4" />
            FEOC Compliance
          </TabsTrigger>
          <TabsTrigger value="forced-labour" className="gap-1.5">
            <Scale className="h-4 w-4" />
            EU Forced Labour
          </TabsTrigger>
          {hasBESS && (
            <TabsTrigger value="battery-passport" className="gap-1.5">
              <Battery className="h-4 w-4" />
              Battery Passport
            </TabsTrigger>
          )}
          <TabsTrigger value="timeline" className="gap-1.5">
            <Clock className="h-4 w-4" />
            Regulatory Timeline
          </TabsTrigger>
        </TabsList>

        <TabsContent value="feoc" className="mt-4">
          <FEOCCompliancePanel project={project} />
        </TabsContent>

        <TabsContent value="forced-labour" className="mt-4">
          <ForcedLabourPanel project={project} />
        </TabsContent>

        {hasBESS && (
          <TabsContent value="battery-passport" className="mt-4">
            <BatteryPassportPanel project={project} />
          </TabsContent>
        )}

        <TabsContent value="timeline" className="mt-4">
          <RegulatoryTimeline project={project} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
