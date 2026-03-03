"use client";

import { useMemo } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { MetricCard } from "@/components/shared/metric-card";
import { PerformanceChart } from "@/components/monitoring/performance-chart";
import { DataQualityCard } from "@/components/monitoring/data-quality-card";
import { BessHealthPanel } from "@/components/monitoring/bess-health-panel";
import { AlertFeed } from "@/components/monitoring/alert-feed";
import { ScadaSyncStatus } from "@/components/monitoring/scada-sync-status";
import { generateScadaData } from "@/data/scada";
import { Activity, Zap, Battery, Database } from "lucide-react";

export default function MonitoringPage() {
  const metrics = useMemo(() => {
    const prData = generateScadaData("performance_ratio", 7);
    const availData = generateScadaData("availability", 7);
    const sohData = generateScadaData("bess_soh", 30);
    const dcData = generateScadaData("data_completeness", 7);

    const latestPR = prData[prData.length - 1];
    const prevPR = prData[Math.max(0, prData.length - 97)];
    const prTrend = parseFloat(((latestPR.value - prevPR.value) * 100).toFixed(2));

    const latestAvail = availData[availData.length - 1];
    const prevAvail = availData[Math.max(0, availData.length - 97)];
    const availTrend = parseFloat(((latestAvail.value - prevAvail.value) * 100).toFixed(2));

    const latestSoh = sohData[sohData.length - 1];
    const prevSoh = sohData[Math.max(0, sohData.length - 97)];
    const sohTrend = parseFloat(((latestSoh.value - prevSoh.value) * 100).toFixed(2));

    const latestDC = dcData[dcData.length - 1];
    const prevDC = dcData[Math.max(0, dcData.length - 97)];
    const dcTrend = parseFloat(((latestDC.value - prevDC.value) * 100).toFixed(2));

    return {
      pr: {
        value: `${(latestPR.value * 100).toFixed(1)}%`,
        trend: { value: prTrend, label: "vs 24h ago" },
      },
      avail: {
        value: `${(latestAvail.value * 100).toFixed(1)}%`,
        trend: { value: availTrend, label: "vs 24h ago" },
      },
      soh: {
        value: `${(latestSoh.value * 100).toFixed(1)}%`,
        trend: { value: sohTrend, label: "vs 24h ago" },
      },
      dc: {
        value: `${(latestDC.value * 100).toFixed(1)}%`,
        trend: { value: dcTrend, label: "vs 24h ago" },
      },
    };
  }, []);

  return (
    <>
      <PageHeader
        title="Monitoring Dashboard"
        description="Real-time SCADA telemetry and compliance monitoring"
      />

      {/* SCADA Sync Status Bar */}
      <div className="mb-6">
        <ScadaSyncStatus />
      </div>

      {/* Section 1: Key Metrics Row */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="Current PR"
          value={metrics.pr.value}
          trend={metrics.pr.trend}
          icon={<Activity className="h-5 w-5" />}
        />
        <MetricCard
          label="Plant Availability"
          value={metrics.avail.value}
          trend={metrics.avail.trend}
          icon={<Zap className="h-5 w-5" />}
        />
        <MetricCard
          label="BESS SoH"
          value={metrics.soh.value}
          trend={metrics.soh.trend}
          icon={<Battery className="h-5 w-5" />}
        />
        <MetricCard
          label="Data Completeness"
          value={metrics.dc.value}
          trend={metrics.dc.trend}
          icon={<Database className="h-5 w-5" />}
        />
      </div>

      {/* Section 2: Performance Charts */}
      <div className="mb-6">
        <PerformanceChart />
      </div>

      {/* Section 3: Two-column grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left column */}
        <div className="space-y-6 lg:col-span-5">
          <DataQualityCard />
          <BessHealthPanel />
        </div>

        {/* Right column */}
        <div className="lg:col-span-7">
          <AlertFeed />
        </div>
      </div>
    </>
  );
}
