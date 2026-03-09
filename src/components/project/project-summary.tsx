"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ComplianceScoreRing } from "@/components/shared/compliance-score-ring";
import { projects } from "@/data/projects";
import { organizations } from "@/data/stakeholders";
import { ORG_TYPE_BADGE_COLORS } from "@/lib/stakeholder-utils";
import {
  PROJECT_TYPE_LABELS,
  LIFECYCLE_STAGE_LABELS,
  ORG_TYPE_LABELS,
} from "@/lib/constants";
import {
  MapPin,
  Calendar,
  Zap,
  Globe,
  Layers,
  Users,
  Settings,
  Plus,
} from "lucide-react";
import { StakeholderDetailSheet } from "./stakeholder-detail-sheet";
import { ManageStakeholdersDialog } from "./manage-stakeholders-dialog";
import { InviteStakeholderDialog } from "./invite-stakeholder-dialog";

interface ProjectSummaryProps {
  projectId: string;
}

export function ProjectSummary({ projectId }: ProjectSummaryProps) {
  const [selectedOrgId, setSelectedOrgId] = useState<string | null>(null);
  const [manageOpen, setManageOpen] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);

  const project = projects.find((p) => p.id === projectId);
  if (!project) return null;

  const projectOrgs = organizations.filter((org) =>
    project.organizationIds.includes(org.id)
  );

  const facts = [
    {
      icon: Layers,
      label: "Type",
      value: PROJECT_TYPE_LABELS[project.type] || project.type,
    },
    {
      icon: Zap,
      label: "Capacity",
      value: `${project.capacityMW} MW${project.capacityMWh ? ` / ${project.capacityMWh} MWh` : ""}`,
    },
    {
      icon: MapPin,
      label: "Location",
      value: `${project.location.region}, ${project.location.country}`,
    },
    {
      icon: Calendar,
      label: "Expected COD",
      value: new Date(project.expectedCOD).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
    },
    {
      icon: Layers,
      label: "Current Stage",
      value: LIFECYCLE_STAGE_LABELS[project.currentStage] || project.currentStage,
    },
    {
      icon: Globe,
      label: "Jurisdictions",
      value: project.jurisdictions.join(", "),
    },
  ];

  return (
    <div className="space-y-4">
      {/* Compliance Score Card */}
      <Card>
        <CardContent className="flex flex-col items-center py-6">
          <ComplianceScoreRing score={project.complianceScore} size="lg" />
          <p className="mt-3 text-sm font-medium text-gray-500">
            Overall Compliance
          </p>
        </CardContent>
      </Card>

      {/* Key Facts Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Project Details</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="space-y-3">
            {facts.map((fact) => {
              const Icon = fact.icon;
              return (
                <div key={fact.label} className="flex items-start gap-2.5">
                  <Icon className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-400" />
                  <div className="min-w-0">
                    <dt className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
                      {fact.label}
                    </dt>
                    <dd className="text-sm text-gray-700">{fact.value}</dd>
                  </div>
                </div>
              );
            })}
          </dl>
        </CardContent>
      </Card>

      {/* Stakeholders Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-gray-400" />
              <CardTitle className="text-sm">Stakeholders</CardTitle>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon-xs"
                onClick={() => setManageOpen(true)}
                title="Manage stakeholders"
                aria-label="Manage stakeholders"
              >
                <Settings className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon-xs"
                onClick={() => setInviteOpen(true)}
                title="Invite stakeholder"
                aria-label="Invite stakeholder"
              >
                <Plus className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2.5">
            {projectOrgs.map((org) => (
              <li
                key={org.id}
                className="flex items-center justify-between gap-2 cursor-pointer rounded-md px-1 py-0.5 -mx-1 hover:bg-gray-50 transition-colors"
                onClick={() => setSelectedOrgId(org.id)}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md bg-gray-100 text-[10px] font-bold text-gray-600">
                    {org.logo || org.name.substring(0, 2).toUpperCase()}
                  </div>
                  <span className="truncate text-sm text-gray-700">
                    {org.name}
                  </span>
                </div>
                <Badge
                  variant="outline"
                  className={`flex-shrink-0 text-[10px] ${
                    ORG_TYPE_BADGE_COLORS[org.type] || "bg-gray-100 text-gray-600"
                  }`}
                >
                  {ORG_TYPE_LABELS[org.type] || org.type}
                </Badge>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Detail Sheet + Dialogs */}
      <StakeholderDetailSheet
        orgId={selectedOrgId}
        projectId={projectId}
        open={selectedOrgId !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedOrgId(null);
        }}
      />
      <ManageStakeholdersDialog
        projectId={projectId}
        open={manageOpen}
        onOpenChange={setManageOpen}
      />
      <InviteStakeholderDialog
        open={inviteOpen}
        onOpenChange={setInviteOpen}
      />
    </div>
  );
}
