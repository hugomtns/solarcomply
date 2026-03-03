"use client";

import { useState, useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  LineChart,
  Line,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { generateScadaData } from "@/data/scada";
import { format } from "date-fns";

const TIME_RANGES = [
  { label: "7d", days: 7 },
  { label: "30d", days: 30 },
  { label: "90d", days: 90 },
  { label: "1y", days: 365 },
] as const;

function formatTimestamp(ts: string, days: number) {
  const d = new Date(ts);
  if (days <= 7) return format(d, "MM/dd HH:mm");
  if (days <= 90) return format(d, "MM/dd");
  return format(d, "yyyy-MM");
}

function downsample<T>(data: T[], maxPoints: number): T[] {
  if (data.length <= maxPoints) return data;
  const step = Math.ceil(data.length / maxPoints);
  return data.filter((_, i) => i % step === 0);
}

export function PerformanceChart() {
  const [days, setDays] = useState(30);

  const prData = useMemo(() => {
    const raw = generateScadaData("performance_ratio", days);
    return downsample(
      raw.map((d) => ({
        date: formatTimestamp(d.timestamp, days),
        value: d.value,
      })),
      200
    );
  }, [days]);

  const energyData = useMemo(() => {
    const raw = generateScadaData("power_output_mw", days);
    return downsample(
      raw.map((d) => ({
        date: formatTimestamp(d.timestamp, days),
        value: d.value,
      })),
      200
    );
  }, [days]);

  const bessData = useMemo(() => {
    const raw = generateScadaData("bess_soh", days);
    return downsample(
      raw.map((d) => ({
        date: formatTimestamp(d.timestamp, days),
        value: d.value,
      })),
      200
    );
  }, [days]);

  const irradianceData = useMemo(() => {
    const raw = generateScadaData("irradiance", days);
    return downsample(
      raw.map((d) => ({
        date: formatTimestamp(d.timestamp, days),
        value: d.value,
      })),
      200
    );
  }, [days]);

  const timeRangeButtons = (
    <div className="flex gap-1">
      {TIME_RANGES.map((r) => (
        <Button
          key={r.label}
          variant={days === r.days ? "default" : "outline"}
          size="xs"
          onClick={() => setDays(r.days)}
        >
          {r.label}
        </Button>
      ))}
    </div>
  );

  return (
    <Card>
      <Tabs defaultValue="pr">
        <CardHeader className="flex-row items-center justify-between pb-2">
          <CardTitle className="text-base">Performance Charts</CardTitle>
          <div className="flex items-center gap-4">
            <TabsList>
              <TabsTrigger value="pr">PR</TabsTrigger>
              <TabsTrigger value="energy">Energy Output</TabsTrigger>
              <TabsTrigger value="bess">BESS Health</TabsTrigger>
              <TabsTrigger value="irradiance">Irradiance</TabsTrigger>
            </TabsList>
            {timeRangeButtons}
          </div>
        </CardHeader>
        <CardContent>
          <TabsContent value="pr">
            <div className="h-[340px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={prData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} interval="preserveStartEnd" />
                  <YAxis domain={[0.7, 0.9]} tick={{ fontSize: 11 }} tickFormatter={(v: number) => `${(v * 100).toFixed(0)}%`} />
                  <Tooltip
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    formatter={(value: any) => [`${(Number(value) * 100).toFixed(2)}%`, "PR"]}
                    labelFormatter={(label) => `Date: ${label}`}
                  />
                  <ReferenceLine
                    y={0.78}
                    stroke="#EF4444"
                    strokeDasharray="6 4"
                    label={{ value: "Guarantee (78%)", position: "right", fill: "#EF4444", fontSize: 11 }}
                  />
                  <ReferenceLine
                    y={0.741}
                    stroke="#F59E0B"
                    strokeDasharray="6 4"
                    label={{ value: "Warning (95%)", position: "right", fill: "#F59E0B", fontSize: 11 }}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#3B82F6"
                    fill="#3B82F6"
                    fillOpacity={0.15}
                    strokeWidth={1.5}
                    dot={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="energy">
            <div className="h-[340px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={energyData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} interval="preserveStartEnd" />
                  <YAxis tick={{ fontSize: 11 }} tickFormatter={(v: number) => `${v.toFixed(0)} MW`} />
                  <Tooltip
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    formatter={(value: any) => [`${Number(value).toFixed(2)} MW`, "Power Output"]}
                    labelFormatter={(label) => `Date: ${label}`}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#10B981"
                    fill="#10B981"
                    fillOpacity={0.15}
                    strokeWidth={1.5}
                    dot={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="bess">
            <div className="h-[340px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={bessData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} interval="preserveStartEnd" />
                  <YAxis
                    domain={[0.93, 0.99]}
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v: number) => `${(v * 100).toFixed(1)}%`}
                  />
                  <Tooltip
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    formatter={(value: any) => [`${(Number(value) * 100).toFixed(2)}%`, "SoH"]}
                    labelFormatter={(label) => `Date: ${label}`}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#8B5CF6"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="irradiance">
            <div className="h-[340px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={irradianceData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} interval="preserveStartEnd" />
                  <YAxis tick={{ fontSize: 11 }} tickFormatter={(v: number) => `${v.toFixed(0)} W/m²`} />
                  <Tooltip
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    formatter={(value: any) => [`${Number(value).toFixed(1)} W/m²`, "GHI"]}
                    labelFormatter={(label) => `Date: ${label}`}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#F59E0B"
                    fill="#F59E0B"
                    fillOpacity={0.15}
                    strokeWidth={1.5}
                    dot={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  );
}
