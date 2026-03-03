"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { PermissionMatrix } from "@/components/permissions/permission-matrix";
import { AccessLog } from "@/components/permissions/access-log";
import { ShareDialog } from "@/components/permissions/share-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Share2, ShieldCheck, ScrollText } from "lucide-react";

export default function PermissionsPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const [shareOpen, setShareOpen] = useState(false);

  return (
    <>
      <PageHeader
        title="Access Control"
        description={`Manage document permissions and access for project ${projectId}`}
      >
        <Button variant="outline" size="sm" onClick={() => setShareOpen(true)}>
          <Share2 className="mr-1.5 h-4 w-4" />
          Share Document
        </Button>
      </PageHeader>

      <Tabs defaultValue="matrix">
        <TabsList>
          <TabsTrigger value="matrix">
            <ShieldCheck className="mr-1.5 h-4 w-4" />
            Permission Matrix
          </TabsTrigger>
          <TabsTrigger value="log">
            <ScrollText className="mr-1.5 h-4 w-4" />
            Access Log
          </TabsTrigger>
        </TabsList>

        <TabsContent value="matrix" className="mt-4">
          <PermissionMatrix />
        </TabsContent>

        <TabsContent value="log" className="mt-4">
          <AccessLog />
        </TabsContent>
      </Tabs>

      <ShareDialog open={shareOpen} onOpenChange={setShareOpen} />
    </>
  );
}
