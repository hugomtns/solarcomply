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
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-xl border border-white/[0.06] shadow-[0_2px_8px_-2px_rgba(0,0,0,0.4)] transition-all duration-300 hover:border-[#06D6A0]/20 hover:shadow-[0_0_20px_rgba(6,214,160,0.1)]">
          <div className="h-[2px] w-full bg-gradient-to-r from-[#06D6A0] to-[#3B82F6]" />
          <div className="p-5">
            <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-slate-500">
              Compliance
            </p>
            <div className="mt-3 flex items-center gap-3">
              <ComplianceScoreRing score={project.complianceScore} size="sm" />
              <div>
                <p className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-heading)' }}>
                  {project.complianceScore}%
                </p>
                <p className="text-[11px] text-slate-500">Overall score</p>
              </div>
            </div>
          </div>
        </div>

        <StatCard
          label="Gateways"
          value={`${passedGateways}/${gateways.length}`}
          sub="passed"
          icon={<Layers className="h-4.5 w-4.5" />}
          color="blue"
        />
        <StatCard
          label="Documents"
          value={`${approvedDocs}/${projectDocs.length}`}
          sub="approved"
          icon={<FileText className="h-4.5 w-4.5" />}
          color="teal"
        />
        <StatCard
          label="Active Alerts"
          value={String(activeAlerts)}
          sub={activeAlerts > 0 ? "needs attention" : "all clear"}
          icon={<AlertTriangle className="h-4.5 w-4.5" />}
          color={activeAlerts > 0 ? "amber" : "muted"}
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
            color="blue"
            title="Gateways"
            description="View all gateway requirements and progress"
          />
          <QuickActionCard
            href={`/project/${projectId}/documents`}
            icon={<FileText className="h-5 w-5" />}
            color="teal"
            title="Documents"
            description="Manage project documentation"
          />
          <QuickActionCard
            href={`/project/${projectId}/ai`}
            icon={<Bot className="h-5 w-5" />}
            color="purple"
            title="AI Hub"
            description="Document intelligence and compliance chat"
          />
        </div>

        {/* Project Details */}
        <div className="lg:col-span-7">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-xl border border-white/[0.06] shadow-[0_2px_8px_-2px_rgba(0,0,0,0.4)] p-6">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#3B82F6] via-[#8B5CF6] to-transparent" />
            <h3 className="text-sm font-semibold text-white mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
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

            {/* Stakeholders strip */}
            <div className="mt-5 pt-4 border-t border-white/[0.06]">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-[0.12em]">
                  Stakeholders
                </h4>
                <span className="text-[11px] text-slate-600">
                  {projectOrgs.length} organizations
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {projectOrgs.slice(0, 6).map((org) => (
                  <span
                    key={org.id}
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.04] px-2.5 py-1 text-[11px] font-medium text-slate-300 transition-colors hover:bg-white/[0.08] hover:border-[#06D6A0]/20"
                  >
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-gradient-to-br from-[#06D6A0] to-[#3B82F6] text-[8px] font-bold text-white">
                      {(org.logo || org.name.substring(0, 2)).toUpperCase()}
                    </span>
                    {org.name.length > 20 ? org.name.substring(0, 18) + "..." : org.name}
                    <span className="text-[9px] text-slate-500">
                      {ORG_TYPE_LABELS[org.type] || org.type}
                    </span>
                  </span>
                ))}
                {projectOrgs.length > 6 && (
                  <span className="inline-flex items-center rounded-full border border-white/[0.06] bg-white/[0.02] px-2.5 py-1 text-[11px] text-slate-500">
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

const colorMap: Record<string, { gradient: string; iconBg: string; iconText: string }> = {
  blue: { gradient: "from-[#3B82F6] to-[#60A5FA]", iconBg: "bg-[#3B82F6]/15", iconText: "text-[#60A5FA]" },
  teal: { gradient: "from-[#06D6A0] to-[#34D399]", iconBg: "bg-[#06D6A0]/15", iconText: "text-[#06D6A0]" },
  amber: { gradient: "from-[#F59E0B] to-[#FBBF24]", iconBg: "bg-[#F59E0B]/15", iconText: "text-[#FBBF24]" },
  purple: { gradient: "from-[#8B5CF6] to-[#A78BFA]", iconBg: "bg-[#8B5CF6]/15", iconText: "text-[#A78BFA]" },
  muted: { gradient: "from-slate-500 to-slate-400", iconBg: "bg-slate-500/15", iconText: "text-slate-400" },
};

function StatCard({
  label,
  value,
  sub,
  icon,
  color,
}: {
  label: string;
  value: string;
  sub: string;
  icon: React.ReactNode;
  color: string;
}) {
  const c = colorMap[color] || colorMap.blue;
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-xl border border-white/[0.06] shadow-[0_2px_8px_-2px_rgba(0,0,0,0.4)] transition-all duration-300 hover:border-white/[0.10]">
      <div className={`h-[2px] w-full bg-gradient-to-r ${c.gradient}`} />
      <div className="p-5">
        <div className="flex items-start justify-between">
          <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-slate-500">
            {label}
          </p>
          <div className={`rounded-xl p-1.5 ${c.iconBg} ${c.iconText}`}>{icon}</div>
        </div>
        <p className="mt-2 text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-heading)' }}>{value}</p>
        <p className="mt-0.5 text-[11px] text-slate-500">{sub}</p>
      </div>
    </div>
  );
}

function QuickActionCard({
  href,
  icon,
  color,
  title,
  description,
}: {
  href: string;
  icon: React.ReactNode;
  color: string;
  title: string;
  description: string;
}) {
  const c = colorMap[color] || colorMap.blue;
  return (
    <Link
      href={href}
      className="group flex items-center gap-4 rounded-2xl bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-xl border border-white/[0.06] px-5 py-4 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.4)] transition-all duration-300 hover:border-white/[0.12] hover:shadow-[0_8px_24px_-4px_rgba(0,0,0,0.5)]"
    >
      <div className={`rounded-xl p-2.5 ${c.iconBg} ${c.iconText} transition-transform duration-200 group-hover:scale-110`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-white group-hover:text-[#06D6A0] transition-colors" style={{ fontFamily: 'var(--font-heading)' }}>{title}</p>
        <p className="text-xs text-slate-500">{description}</p>
      </div>
      <ChevronRight className="h-4 w-4 text-slate-600 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-[#06D6A0]" />
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
      <div className="mt-0.5 text-slate-600">{icon}</div>
      <div className="min-w-0">
        <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-slate-600">
          {label}
        </p>
        <p className="text-sm text-slate-300">{value}</p>
      </div>
    </div>
  );
}
