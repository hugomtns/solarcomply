"use client";

import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import {
  Tabs, TabsContent, TabsList, TabsTrigger,
} from "@/components/ui/tabs";
import { BookOpen, Settings2, LayoutTemplate, Workflow } from "lucide-react";
import { gatewayReference } from "@/data/gateway-reference";
import { GatewayReferenceBrowser } from "@/components/gateway-config/gateway-reference-browser";
import { GatewayConfigurator } from "@/components/gateway-config/gateway-configurator";
import { ConfigurationTemplates } from "@/components/gateway-config/configuration-templates";

const totalRequirements = gatewayReference.reduce((acc, g) => acc + g.requirements.length, 0);

export default function GatewayConfigurationPage() {
  return (
    <>
      <PageHeader
        title="Gateway Configuration"
        description="Browse, configure, and template gateway requirements across the G0–G10 lifecycle"
      >
        <div className="flex items-center gap-1.5 rounded-full bg-status-special/15 px-3 py-1 text-xs font-medium text-palette-purple-400 border border-status-special/25">
          <Workflow className="h-3 w-3" />
          {gatewayReference.length} Gateways &middot; {totalRequirements} Requirements
        </div>
      </PageHeader>

      <Tabs defaultValue="reference" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="reference" className="gap-1.5">
            <BookOpen className="h-3.5 w-3.5" />
            Reference Browser
          </TabsTrigger>
          <TabsTrigger value="configuration" className="gap-1.5">
            <Settings2 className="h-3.5 w-3.5" />
            Configuration
          </TabsTrigger>
          <TabsTrigger value="templates" className="gap-1.5">
            <LayoutTemplate className="h-3.5 w-3.5" />
            Templates
          </TabsTrigger>
        </TabsList>

        <TabsContent value="reference">
          <GatewayReferenceBrowser />
        </TabsContent>

        <TabsContent value="configuration">
          <GatewayConfigurator />
        </TabsContent>

        <TabsContent value="templates">
          <ConfigurationTemplates />
        </TabsContent>
      </Tabs>
    </>
  );
}
