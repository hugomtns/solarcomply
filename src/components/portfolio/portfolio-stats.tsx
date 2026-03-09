import { MetricCard } from "@/components/shared/metric-card";
import { projects } from "@/data/projects";
import { alerts } from "@/data/alerts";
import { Briefcase, Zap, ShieldCheck, AlertTriangle } from "lucide-react";

export function PortfolioStats() {
  const totalCapacity = projects.reduce((sum, p) => sum + p.capacityMW, 0);
  const avgScore = projects.length > 0
    ? Math.round(projects.reduce((sum, p) => sum + p.complianceScore, 0) / projects.length)
    : 0;
  const activeAlerts = alerts.filter((a) => !a.acknowledged).length;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <MetricCard
        label="Total Projects"
        value={projects.length}
        icon={<Briefcase className="h-5 w-5" />}
        accentColor="blue"
      />
      <MetricCard
        label="Total Capacity"
        value={`${totalCapacity} MW`}
        icon={<Zap className="h-5 w-5" />}
        accentColor="teal"
      />
      <MetricCard
        label="Avg Compliance Score"
        value={`${avgScore}%`}
        trend={{ value: 2.3, label: "vs last month" }}
        icon={<ShieldCheck className="h-5 w-5" />}
        accentColor="purple"
      />
      <MetricCard
        label="Active Alerts"
        value={activeAlerts}
        icon={<AlertTriangle className="h-5 w-5" />}
        accentColor="amber"
      />
    </div>
  );
}
