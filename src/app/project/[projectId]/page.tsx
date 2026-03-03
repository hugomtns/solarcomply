import { PageHeader } from "@/components/layout/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { GatewayPipeline } from "@/components/project/gateway-pipeline";
import { LifecycleTimeline } from "@/components/project/lifecycle-timeline";
import { ProjectSummary } from "@/components/project/project-summary";
import { projects } from "@/data/projects";
import { notFound } from "next/navigation";

interface ProjectPageProps {
  params: Promise<{ projectId: string }>;
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { projectId } = await params;
  const project = projects.find((p) => p.id === projectId);

  if (!project) {
    notFound();
  }

  const complianceStatus =
    project.complianceScore >= 80
      ? "passed"
      : project.complianceScore >= 60
        ? "in_review"
        : "blocked";

  return (
    <>
      <PageHeader title={project.name}>
        <StatusBadge status={complianceStatus} />
      </PageHeader>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left column: pipeline + timeline */}
        <div className="space-y-6 lg:col-span-8">
          <GatewayPipeline projectId={projectId} />
          <LifecycleTimeline projectId={projectId} />
        </div>

        {/* Right column: project summary sidebar */}
        <div className="lg:col-span-4">
          <ProjectSummary projectId={projectId} />
        </div>
      </div>
    </>
  );
}
