"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertCircle, AlertTriangle, Info, Check } from "lucide-react";
import { useApp } from "@/contexts/app-context";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import type { AlertSeverity } from "@/lib/types";

const severityConfig: Record<
  AlertSeverity,
  { icon: typeof AlertCircle; border: string; bg: string; badge: string; label: string }
> = {
  critical: {
    icon: AlertCircle,
    border: "border-l-red-500",
    bg: "bg-red-50/50",
    badge: "bg-red-100 text-red-700",
    label: "Critical",
  },
  warning: {
    icon: AlertTriangle,
    border: "border-l-amber-500",
    bg: "bg-amber-50/50",
    badge: "bg-amber-100 text-amber-700",
    label: "Warning",
  },
  info: {
    icon: Info,
    border: "border-l-blue-500",
    bg: "bg-blue-50/50",
    badge: "bg-blue-100 text-blue-700",
    label: "Info",
  },
};

function timeAgo(ts: string) {
  try {
    return formatDistanceToNow(new Date(ts), { addSuffix: true });
  } catch {
    return ts;
  }
}

export function AlertFeed() {
  const { notifications, acknowledgeAlert } = useApp();
  const [tab, setTab] = useState("all");

  const filtered = notifications.filter((a) => {
    if (tab === "all") return true;
    return a.severity === tab;
  });

  return (
    <Card className="flex flex-col">
      <Tabs value={tab} onValueChange={setTab}>
        <CardHeader className="flex-row items-center justify-between pb-2">
          <CardTitle className="text-base">Compliance Alerts</CardTitle>
          <TabsList>
            <TabsTrigger value="all">
              All
              <Badge variant="secondary" className="ml-1 h-4 px-1 text-[10px]">
                {notifications.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="critical">Critical</TabsTrigger>
            <TabsTrigger value="warning">Warning</TabsTrigger>
            <TabsTrigger value="info">Info</TabsTrigger>
          </TabsList>
        </CardHeader>

        <CardContent className="flex-1 p-0">
          <TabsContent value={tab} className="mt-0">
            <ScrollArea className="h-[520px]">
              <div className="space-y-0 px-4 pb-4">
                {filtered.length === 0 && (
                  <p className="py-8 text-center text-sm text-gray-400">No alerts</p>
                )}
                {filtered.map((alert) => {
                  const cfg = severityConfig[alert.severity];
                  const Icon = cfg.icon;

                  return (
                    <div
                      key={alert.id}
                      className={cn(
                        "border-l-4 rounded-md border p-3 mt-2",
                        cfg.border,
                        alert.acknowledged ? "opacity-60" : cfg.bg
                      )}
                    >
                      <div className="flex items-start gap-2.5">
                        <Icon
                          className={cn(
                            "mt-0.5 h-4 w-4 shrink-0",
                            alert.severity === "critical" && "text-red-500",
                            alert.severity === "warning" && "text-amber-500",
                            alert.severity === "info" && "text-blue-500"
                          )}
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-[#1B2A4A] leading-tight">
                              {alert.title}
                            </span>
                            <Badge className={cn("shrink-0 text-[10px] px-1.5 py-0", cfg.badge)}>
                              {cfg.label}
                            </Badge>
                          </div>
                          <p className="mt-1 text-xs text-gray-500 leading-relaxed">
                            {alert.description}
                          </p>
                          <div className="mt-2 flex items-center justify-between">
                            <span className="text-[10px] text-gray-400">
                              {timeAgo(alert.timestamp)}
                              {alert.standardRef && (
                                <span className="ml-2 font-medium text-gray-500">
                                  {alert.standardRef}
                                </span>
                              )}
                            </span>
                            {!alert.acknowledged && (
                              <Button
                                variant="ghost"
                                size="xs"
                                className="text-[10px] text-gray-500 hover:text-emerald-600"
                                onClick={() => acknowledgeAlert(alert.id)}
                              >
                                <Check className="mr-1 h-3 w-3" />
                                Acknowledge
                              </Button>
                            )}
                            {alert.acknowledged && (
                              <span className="flex items-center gap-1 text-[10px] text-emerald-600">
                                <Check className="h-3 w-3" />
                                Acknowledged
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  );
}
