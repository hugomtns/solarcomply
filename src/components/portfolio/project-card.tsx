"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ComplianceScoreRing } from "@/components/shared/compliance-score-ring";
import { Project } from "@/lib/types";
import { PROJECT_TYPE_LABELS, LIFECYCLE_STAGE_LABELS, LIFECYCLE_STAGE_ORDER } from "@/lib/constants";
import { MapPin, Calendar } from "lucide-react";

const typeColors: Record<string, string> = {
  pv: "bg-amber-100 text-amber-800 border-amber-200",
  bess: "bg-blue-100 text-blue-800 border-blue-200",
  hybrid: "bg-purple-100 text-purple-800 border-purple-200",
};

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const stageIndex = LIFECYCLE_STAGE_ORDER.indexOf(project.currentStage);
  const progress = ((stageIndex + 1) / LIFECYCLE_STAGE_ORDER.length) * 100;

  return (
    <Link href={`/project/${project.id}`}>
      <Card className="cursor-pointer rounded-2xl p-5 transition-all duration-200 hover:shadow-[0_4px_6px_-1px_rgb(0_0_0/0.07),0_2px_4px_-2px_rgb(0_0_0/0.05)] hover:border-gray-300/80">
        <div className="flex items-start justify-between">
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-[15px] font-medium text-gray-900">{project.name}</h3>
            <div className="mt-1.5 flex flex-wrap gap-1">
              <Badge variant="outline" className={typeColors[project.type]}>
                {PROJECT_TYPE_LABELS[project.type]}
              </Badge>
              {project.jurisdictions.includes("US") && (
                <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
                  Safe Harbor
                </Badge>
              )}
            </div>
          </div>
          <ComplianceScoreRing score={project.complianceScore} size="sm" />
        </div>

        <div className="mt-4 space-y-1.5 text-sm text-gray-500">
          <div className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5" />
            {project.location.region}, {project.location.country}
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            COD: {new Date(project.expectedCOD).toLocaleDateString("en-GB", { month: "short", year: "numeric" })}
          </div>
          <p className="text-xs text-gray-400">
            {project.capacityMW} MW{project.capacityMWh ? ` / ${project.capacityMWh} MWh` : ""} &middot;{" "}
            {LIFECYCLE_STAGE_LABELS[project.currentStage]}
          </p>
        </div>

        <div className="mt-4">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#2E75B6] to-[#00B0A0] transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </Card>
    </Link>
  );
}
