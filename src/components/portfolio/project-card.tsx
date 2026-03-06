"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ComplianceScoreRing } from "@/components/shared/compliance-score-ring";
import { Project } from "@/lib/types";
import { PROJECT_TYPE_LABELS, LIFECYCLE_STAGE_LABELS, LIFECYCLE_STAGE_ORDER } from "@/lib/constants";
import { MapPin, Calendar } from "lucide-react";

const typeColors: Record<string, string> = {
  pv: "bg-amber-500/15 text-amber-400 border-amber-500/25",
  bess: "bg-blue-500/15 text-blue-400 border-blue-500/25",
  hybrid: "bg-purple-500/15 text-purple-400 border-purple-500/25",
};

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const stageIndex = LIFECYCLE_STAGE_ORDER.indexOf(project.currentStage);
  const progress = ((stageIndex + 1) / LIFECYCLE_STAGE_ORDER.length) * 100;

  return (
    <Link href={`/project/${project.id}`}>
      <Card className="group cursor-pointer p-0 gap-0 overflow-hidden">
        {/* Gradient top bar */}
        <div className="h-[2px] w-full bg-gradient-to-r from-primary via-palette-blue-500 to-palette-purple-500" />
        <div className="p-5">
          <div className="flex items-start justify-between">
            <div className="min-w-0 flex-1">
              <h3 className="truncate text-[15px] font-semibold text-white group-hover:text-primary transition-colors font-display">
                {project.name}
              </h3>
              <div className="mt-1.5 flex flex-wrap gap-1">
                <Badge variant="outline" className={typeColors[project.type]}>
                  {PROJECT_TYPE_LABELS[project.type]}
                </Badge>
                {project.jurisdictions.includes("US") && (
                  <Badge variant="outline" className="bg-blue-500/15 text-blue-400 border-blue-500/25">
                    Safe Harbor
                  </Badge>
                )}
              </div>
            </div>
            <ComplianceScoreRing score={project.complianceScore} size="sm" />
          </div>

          <div className="mt-4 space-y-1.5 text-sm text-text-tertiary">
            <div className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-text-disabled" />
              {project.location.region}, {project.location.country}
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-text-disabled" />
              COD: {new Date(project.expectedCOD).toLocaleDateString("en-GB", { month: "short", year: "numeric" })}
            </div>
            <p className="text-xs text-text-muted">
              {project.capacityMW} MW{project.capacityMWh ? ` / ${project.capacityMWh} MWh` : ""} &middot;{" "}
              {LIFECYCLE_STAGE_LABELS[project.currentStage]}
            </p>
          </div>

          <div className="mt-4">
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary to-palette-blue-500 transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
