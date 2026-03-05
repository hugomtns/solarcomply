import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { GatewayPipeline } from "@/components/project/gateway-pipeline";
import { ProjectSummary } from "@/components/project/project-summary";
import { MetricCard } from "@/components/shared/metric-card";
import { projects } from "@/data/projects";
import { getGatewaysForProject } from "@/data/gateways";
import { documents } from "@/data/documents";
import { alerts } from "@/data/alerts";
import { notFound } from "next/navigation";
import { Layers, FileText, Bot, ShieldCheck, AlertTriangle, BarChart3 } from "lucide-react";

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

  const gateways = getGatewaysForProject(projectId);
  const passedGateways = gateways.filter((g) => g.status === "passed").length;
  const projectDocs = documents.filter((d) => d.projectId === projectId);
  const approvedDocs = projectDocs.filter((d) => d.status === "approved").length;
  const activeAlerts = alerts.filter((a) => a.projectId === projectId && !a.acknowledged).length;

  return (
    <div className="animate-fade-in">
      <PageHeader title={project.name}>
        <StatusBadge status={complianceStatus} />
      </PageHeader>

      {/* Project Health at a Glance */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="Compliance Score"
          value={`${project.complianceScore}%`}
          icon={<ShieldCheck className="h-5 w-5" />}
        />
        <MetricCard
          label="Gateways Passed"
          value={`${passedGateways}/${gateways.length}`}
          icon={<Layers className="h-5 w-5" />}
        />
        <MetricCard
          label="Documents"
          value={`${approvedDocs}/${projectDocs.length}`}
          icon={<FileText className="h-5 w-5" />}
        />
        <MetricCard
          label="Active Alerts"
          value={activeAlerts}
          icon={<AlertTriangle className="h-5 w-5" />}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left column: pipeline */}
        <div className="space-y-6 lg:col-span-8">
          <GatewayPipeline projectId={projectId} />

          {/* Quick Actions */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <QuickActionCard
              href={`/project/${projectId}/gateways`}
              icon={<Layers className="h-5 w-5 text-[#2E75B6]" />}
              title="Gateways"
              description="View all gateway requirements and progress"
            />
            <QuickActionCard
              href={`/project/${projectId}/documents`}
              icon={<FileText className="h-5 w-5 text-[#00B0A0]" />}
              title="Documents"
              description="Manage project documentation"
            />
            <QuickActionCard
              href={`/project/${projectId}/ai`}
              icon={<Bot className="h-5 w-5 text-purple-600" />}
              title="AI Hub"
              description="Document intelligence and compliance chat"
            />
          </div>
        </div>

        {/* Right column: project summary sidebar */}
        <div className="lg:col-span-4">
          <ProjectSummary projectId={projectId} />
        </div>
      </div>
    </div>
  );
}

function QuickActionCard({
  href,
  icon,
  title,
  description,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-start gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-card transition-all duration-200 hover:shadow-card-hover hover:border-gray-300"
    >
      <div className="mt-0.5 rounded-lg bg-gray-50 p-2 transition-colors group-hover:bg-gray-100">
        {icon}
      </div>
      <div>
        <p className="text-sm font-semibold text-[#1B2A4A]">{title}</p>
        <p className="mt-0.5 text-xs text-gray-500">{description}</p>
      </div>
    </Link>
  );
}
