"use client";

import { Project } from "@/lib/types";
import { getBatteryPassport } from "@/data/supply-chain";
import { MetricCard } from "@/components/shared/metric-card";
import { EmptyState } from "@/components/shared/empty-state";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Battery, CheckCircle2, XCircle, Clock, QrCode } from "lucide-react";
import { COLORS } from "@/lib/constants";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface BatteryPassportPanelProps {
  project: Project;
}

export function BatteryPassportPanel({ project }: BatteryPassportPanelProps) {
  if (project.type === "pv") {
    return (
      <EmptyState
        icon={<Battery className="h-12 w-12" />}
        message="Battery Passport is only applicable to BESS and hybrid projects."
      />
    );
  }

  const passport = getBatteryPassport(project.id);

  if (!passport) {
    return (
      <EmptyState
        icon={<Battery className="h-12 w-12" />}
        message="No battery passport data available for this project yet."
      />
    );
  }

  // Calculate field population
  const fieldChecklist = [
    { field: "Manufacturer ID", populated: true },
    { field: "Battery model & batch", populated: true },
    { field: "Manufacturing date", populated: !!passport.manufacturingDate },
    { field: "Manufacturing location", populated: !!passport.manufacturingLocation },
    { field: "Chemistry & materials", populated: !!passport.chemistryType },
    { field: "Rated capacity", populated: !!passport.performance },
    { field: "Rated voltage", populated: !!passport.performance },
    { field: "Carbon footprint", populated: passport.carbonFootprint?.status === "declared" },
    { field: "Recycled content", populated: passport.recycledContent?.status === "declared" },
    { field: "Expected lifetime", populated: !!passport.performance?.expectedLifetimeYears },
    { field: "SoH methodology", populated: !!passport.stateOfHealth },
    { field: "Due diligence records", populated: passport.dueDiligence?.status === "complete" },
    { field: "QR code link", populated: !!passport.qrCodeUrl },
  ];

  const populatedCount = fieldChecklist.filter((f) => f.populated).length;
  const totalFields = fieldChecklist.length;

  const cfStatus = passport.carbonFootprint?.status === "declared"
    ? "Declared"
    : passport.carbonFootprint?.status === "calculating"
    ? "Calculating"
    : "Pending";

  const daysToMandate = Math.max(
    0,
    Math.floor((new Date("2027-02-01").getTime() - Date.now()) / (1000 * 60 * 60 * 24))
  );

  // Carbon footprint chart data
  const carbonData = passport.carbonFootprint
    ? [
        { name: "Raw Materials", value: passport.carbonFootprint.rawMaterials, color: COLORS.orange },
        { name: "Manufacturing", value: passport.carbonFootprint.manufacturing, color: COLORS.blue },
        { name: "Transport", value: passport.carbonFootprint.transport, color: COLORS.teal },
      ]
    : [];

  return (
    <div className="space-y-6">
      {/* Readiness Metrics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="Fields Populated"
          value={`${populatedCount} / ${totalFields}`}
          icon={<Battery className="h-5 w-5" />}
        />
        <MetricCard
          label="Carbon Footprint"
          value={cfStatus}
          icon={
            cfStatus === "Declared"
              ? <CheckCircle2 className="h-5 w-5 text-emerald-500" />
              : <Clock className="h-5 w-5 text-amber-500" />
          }
        />
        <MetricCard
          label="QR Code"
          value={passport.qrCodeUrl ? "Active" : "Pending"}
          icon={<QrCode className="h-5 w-5" />}
        />
        <MetricCard
          label="Days to Mandate"
          value={daysToMandate}
          icon={<Clock className="h-5 w-5" />}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Data Field Checklist */}
        <Card className="p-5">
          <h3 className="mb-4 text-sm font-medium text-slate-200">
            Passport Data Fields — {passport.batteryModel}
          </h3>
          <div className="space-y-2">
            {fieldChecklist.map((f) => (
              <div key={f.field} className="flex items-center gap-2 text-sm">
                {f.populated ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                ) : (
                  <XCircle className="h-4 w-4 text-slate-600" />
                )}
                <span className={f.populated ? "text-slate-300" : "text-slate-500"}>{f.field}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-2">
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/[0.06]">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${(populatedCount / totalFields) * 100}%`,
                  backgroundColor: populatedCount >= totalFields * 0.8 ? COLORS.teal : COLORS.amber,
                }}
              />
            </div>
            <span className="text-xs text-slate-400">{Math.round((populatedCount / totalFields) * 100)}%</span>
          </div>
        </Card>

        {/* Carbon Footprint Breakdown */}
        <Card className="p-5">
          <h3 className="mb-2 text-sm font-medium text-slate-200">Carbon Footprint Breakdown</h3>
          {passport.carbonFootprint ? (
            <>
              <p className="mb-4 text-xs text-slate-400">
                Total: {passport.carbonFootprint.totalKgCO2PerKWh} kg CO₂/kWh
                <Badge variant="outline" className="ml-2 text-[10px]">
                  {passport.carbonFootprint.status}
                </Badge>
              </p>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={carbonData} layout="vertical" margin={{ left: 10, right: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 11 }} unit=" kg" />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={100} />
                  <Tooltip
                    formatter={(value) => [`${value} kg CO₂/kWh`, ""]}
                    contentStyle={{ fontSize: 12 }}
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {carbonData.map((entry, idx) => (
                      <Cell key={idx} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </>
          ) : (
            <div className="flex h-[200px] items-center justify-center text-sm text-slate-500">
              Carbon footprint data not yet available.
            </div>
          )}
        </Card>
      </div>

      {/* Key Details */}
      <Card className="p-5">
        <h3 className="mb-4 text-sm font-medium text-slate-200">Battery Details</h3>
        <div className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
          <div>
            <p className="text-xs text-slate-500">Model</p>
            <p className="font-medium text-slate-200">{passport.batteryModel}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Chemistry</p>
            <p className="font-medium text-slate-200">{passport.chemistryType}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Capacity</p>
            <p className="font-medium text-slate-200">{passport.capacityMWh} MWh</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Manufacturer</p>
            <p className="font-medium text-slate-200">{passport.manufacturer}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Manufacturing Date</p>
            <p className="font-medium text-slate-200">{passport.manufacturingDate}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Location</p>
            <p className="font-medium text-slate-200">{passport.manufacturingLocation}</p>
          </div>
          {passport.stateOfHealth && (
            <>
              <div>
                <p className="text-xs text-slate-500">State of Health</p>
                <p className="font-medium text-slate-200">{passport.stateOfHealth.currentSoH}%</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">SoH Last Updated</p>
                <p className="font-medium text-slate-200">{passport.stateOfHealth.lastUpdated}</p>
              </div>
            </>
          )}
        </div>
      </Card>
    </div>
  );
}
