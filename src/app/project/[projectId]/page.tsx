import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { ComplianceScoreRing } from "@/components/shared/compliance-score-ring";
import { GatewayPipeline } from "@/components/project/gateway-pipeline";
import { projects } from "@/data/projects";
import { getGatewaysForProject } from "@/data/gateways";
import { documents } from "@/data/documents";
import { alerts } from "@/data/alerts";
import { organizations } from "@/data/stakeholders";
import { notFound } from "next/navigation";
import {
  Layers,
  FileText,
  Bot,
  AlertTriangle,
  MapPin,
  Calendar,
  Zap,
  Globe,
  ChevronRight,
} from "lucide-react";
import {
  PROJECT_TYPE_LABELS,
  LIFECYCLE_STAGE_LABELS,
  ORG_TYPE_LABELS,
} from "@/lib/constants";

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
  const activeAlerts = alerts.filter(
    (a) => a.projectId === projectId && !a.acknowledged
  ).length;
  const projectOrgs = organizations.filter((org) =>
    project.organizationIds.includes(org.id)
  );

  return (
    <div className="animate-fade-in space-y-8">
      <PageHeader title={project.name}>
        <StatusBadge status={complianceStatus} />
      </PageHeader>

      {/* Hero stats row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Compliance Score — featured card */}
        <div className="rounded-2xl border border-gray-200/80 bg-gradient-to-br from-white to-gray-50/80 p-5 shadow-[0_1px_3px_0_rgb(0_0_0/0.04),0_1px_2px_-1px_rgb(0_0_0/0.04)] transition-shadow duration-200 hover:shadow-[0_4px_6px_-1px_rgb(0_0_0/0.07),0_2px_4px_-2px_rgb(0_0_0/0.05)]">
          <p className="text-[11px] font-medium uppercase tracking-wider text-gray-400">
            Compliance
          </p>
          <div className="mt-3 flex items-center gap-3">
            <ComplianceScoreRing score={project.complianceScore} size="sm" />
            <div>
              <p className="text-2xl font-bold text-[#1B2A4A]">
                {project.complianceScore}%
              </p>
              <p className="text-[11px] text-gray-500">Overall score</p>
            </div>
          </div>
        </div>

        <StatCard
          label="Gateways"
          value={`${passedGateways}/${gateways.length}`}
          sub="passed"
          icon={<Layers className="h-4.5 w-4.5" />}
          accent="text-[#2E75B6]"
          accentBg="bg-blue-50"
        />
        <StatCard
          label="Documents"
          value={`${approvedDocs}/${projectDocs.length}`}
          sub="approved"
          icon={<FileText className="h-4.5 w-4.5" />}
          accent="text-[#00B0A0]"
          accentBg="bg-emerald-50"
        />
        <StatCard
          label="Active Alerts"
          value={String(activeAlerts)}
          sub={activeAlerts > 0 ? "needs attention" : "all clear"}
          icon={<AlertTriangle className="h-4.5 w-4.5" />}
          accent={activeAlerts > 0 ? "text-amber-600" : "text-gray-400"}
          accentBg={activeAlerts > 0 ? "bg-amber-50" : "bg-gray-50"}
        />
      </div>

      {/* Gateway Pipeline */}
      <GatewayPipeline projectId={projectId} />

      {/* Quick Actions + Project Details row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Quick Actions */}
        <div className="lg:col-span-5 grid grid-cols-1 gap-3">
          <QuickActionCard
            href={`/project/${projectId}/gateways`}
            icon={<Layers className="h-5 w-5" />}
            iconColor="text-[#2E75B6]"
            iconBg="bg-blue-50"
            title="Gateways"
            description="View all gateway requirements and progress"
          />
          <QuickActionCard
            href={`/project/${projectId}/documents`}
            icon={<FileText className="h-5 w-5" />}
            iconColor="text-[#00B0A0]"
            iconBg="bg-emerald-50"
            title="Documents"
            description="Manage project documentation"
          />
          <QuickActionCard
            href={`/project/${projectId}/ai`}
            icon={<Bot className="h-5 w-5" />}
            iconColor="text-purple-600"
            iconBg="bg-purple-50"
            title="AI Hub"
            description="Document intelligence and compliance chat"
          />
        </div>

        {/* Project Details — compact horizontal card */}
        <div className="lg:col-span-7">
          <div className="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-[0_1px_3px_0_rgb(0_0_0/0.04),0_1px_2px_-1px_rgb(0_0_0/0.04)]">
            <h3 className="text-sm font-semibold text-[#1B2A4A] mb-4">
              Project Details
            </h3>
            <div className="grid grid-cols-2 gap-x-8 gap-y-3">
              <DetailItem
                icon={<Layers className="h-3.5 w-3.5" />}
                label="Type"
                value={PROJECT_TYPE_LABELS[project.type] || project.type}
              />
              <DetailItem
                icon={<Zap className="h-3.5 w-3.5" />}
                label="Capacity"
                value={`${project.capacityMW} MW${project.capacityMWh ? ` / ${project.capacityMWh} MWh` : ""}`}
              />
              <DetailItem
                icon={<MapPin className="h-3.5 w-3.5" />}
                label="Location"
                value={`${project.location.region}, ${project.location.country}`}
              />
              <DetailItem
                icon={<Calendar className="h-3.5 w-3.5" />}
                label="Expected COD"
                value={new Date(project.expectedCOD).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              />
              <DetailItem
                icon={<Layers className="h-3.5 w-3.5" />}
                label="Stage"
                value={LIFECYCLE_STAGE_LABELS[project.currentStage] || project.currentStage}
              />
              <DetailItem
                icon={<Globe className="h-3.5 w-3.5" />}
                label="Jurisdictions"
                value={project.jurisdictions.join(", ")}
              />
            </div>

            {/* Compact stakeholders strip */}
            <div className="mt-5 pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Stakeholders
                </h4>
                <span className="text-[11px] text-gray-400">
                  {projectOrgs.length} organizations
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {projectOrgs.slice(0, 6).map((org) => (
                  <span
                    key={org.id}
                    className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-[11px] font-medium text-gray-600 transition-colors hover:bg-gray-100"
                  >
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-gray-200 text-[8px] font-bold text-gray-500">
                      {(org.logo || org.name.substring(0, 2)).toUpperCase()}
                    </span>
                    {org.name.length > 20 ? org.name.substring(0, 18) + "..." : org.name}
                    <span className="text-[9px] text-gray-400">
                      {ORG_TYPE_LABELS[org.type] || org.type}
                    </span>
                  </span>
                ))}
                {projectOrgs.length > 6 && (
                  <span className="inline-flex items-center rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-[11px] text-gray-400">
                    +{projectOrgs.length - 6} more
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  sub,
  icon,
  accent,
  accentBg,
}: {
  label: string;
  value: string;
  sub: string;
  icon: React.ReactNode;
  accent: string;
  accentBg: string;
}) {
  return (
    <div className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-[0_1px_3px_0_rgb(0_0_0/0.04),0_1px_2px_-1px_rgb(0_0_0/0.04)] transition-shadow duration-200 hover:shadow-[0_4px_6px_-1px_rgb(0_0_0/0.07),0_2px_4px_-2px_rgb(0_0_0/0.05)]">
      <div className="flex items-start justify-between">
        <p className="text-[11px] font-medium uppercase tracking-wider text-gray-400">
          {label}
        </p>
        <div className={`rounded-lg ${accentBg} p-1.5 ${accent}`}>{icon}</div>
      </div>
      <p className="mt-2 text-2xl font-bold text-[#1B2A4A]">{value}</p>
      <p className="mt-0.5 text-[11px] text-gray-500">{sub}</p>
    </div>
  );
}

function QuickActionCard({
  href,
  icon,
  iconColor,
  iconBg,
  title,
  description,
}: {
  href: string;
  icon: React.ReactNode;
  iconColor: string;
  iconBg: string;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-4 rounded-2xl border border-gray-200/80 bg-white px-5 py-4 shadow-[0_1px_3px_0_rgb(0_0_0/0.04),0_1px_2px_-1px_rgb(0_0_0/0.04)] transition-all duration-200 hover:shadow-[0_4px_6px_-1px_rgb(0_0_0/0.07),0_2px_4px_-2px_rgb(0_0_0/0.05)] hover:border-gray-300/80"
    >
      <div className={`rounded-xl ${iconBg} p-2.5 ${iconColor} transition-transform duration-200 group-hover:scale-105`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-[#1B2A4A]">{title}</p>
        <p className="text-xs text-gray-500">{description}</p>
      </div>
      <ChevronRight className="h-4 w-4 text-gray-300 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-gray-400" />
    </Link>
  );
}

function DetailItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2">
      <div className="mt-0.5 text-gray-400">{icon}</div>
      <div className="min-w-0">
        <p className="text-[10px] font-medium uppercase tracking-wider text-gray-400">
          {label}
        </p>
        <p className="text-sm text-gray-700">{value}</p>
      </div>
    </div>
  );
}
