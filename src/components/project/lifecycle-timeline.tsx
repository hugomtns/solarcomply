import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getGatewaysForProject } from "@/data/gateways";
import { organizations } from "@/data/stakeholders";
import { users } from "@/data/stakeholders";
import { STAKEHOLDER_ROLE_LABELS } from "@/lib/constants";
import {
  CheckCircle,
  Clock,
  AlertTriangle,
} from "lucide-react";

interface LifecycleTimelineProps {
  projectId: string;
}

interface TimelineEvent {
  id: string;
  icon: typeof CheckCircle;
  iconColor: string;
  iconBg: string;
  description: string;
  actor?: string;
  timestamp: string;
  date: Date;
}

const statusIconMap: Record<
  string,
  { icon: typeof CheckCircle; color: string; bg: string }
> = {
  passed: { icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-50" },
  blocked: { icon: AlertTriangle, color: "text-red-600", bg: "bg-red-50" },
  in_review: { icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
};

function formatEventDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatEventTime(dateStr: string): string {
  return new Date(dateStr).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getUserName(userId?: string): string | undefined {
  if (!userId) return undefined;
  const user = users.find((u) => u.id === userId);
  return user?.name;
}

function getOrgName(orgId: string): string {
  const org = organizations.find((o) => o.id === orgId);
  return org?.name || orgId;
}

export function LifecycleTimeline({ projectId }: LifecycleTimelineProps) {
  const gateways = getGatewaysForProject(projectId);

  // Build events from gateway data
  const events: TimelineEvent[] = [];

  for (const gateway of gateways) {
    // Add gateway completion events
    if (gateway.completedDate && gateway.status === "passed") {
      events.push({
        id: `${gateway.id}-completed`,
        icon: CheckCircle,
        iconColor: "text-emerald-600",
        iconBg: "bg-emerald-50",
        description: `${gateway.code} ${gateway.name} passed`,
        timestamp: gateway.completedDate,
        date: new Date(gateway.completedDate),
      });
    }

    // Add approval events
    for (const approval of gateway.approvals) {
      if (approval.timestamp && approval.status === "approved") {
        const actorName = getUserName(approval.approverUserId);
        const orgName = getOrgName(approval.stakeholderOrgId);
        const roleLabel =
          STAKEHOLDER_ROLE_LABELS[approval.requiredRole] ||
          approval.requiredRole;

        events.push({
          id: `${gateway.id}-approval-${approval.stakeholderOrgId}`,
          icon: CheckCircle,
          iconColor: "text-blue-600",
          iconBg: "bg-blue-50",
          description: `${gateway.code}: ${orgName} ${roleLabel.toLowerCase()} approval`,
          actor: actorName,
          timestamp: approval.timestamp,
          date: new Date(approval.timestamp),
        });
      }
    }

    // Add in_review gateway event
    if (gateway.status === "in_review") {
      const iconCfg = statusIconMap.in_review;
      events.push({
        id: `${gateway.id}-in-review`,
        icon: iconCfg.icon,
        iconColor: iconCfg.color,
        iconBg: iconCfg.bg,
        description: `${gateway.code} ${gateway.name} under review`,
        timestamp: gateway.targetDate || new Date().toISOString(),
        date: new Date(gateway.targetDate || new Date()),
      });
    }

    // Add blocked gateway event
    if (gateway.status === "blocked") {
      const iconCfg = statusIconMap.blocked;
      events.push({
        id: `${gateway.id}-blocked`,
        icon: iconCfg.icon,
        iconColor: iconCfg.color,
        iconBg: iconCfg.bg,
        description: `${gateway.code} ${gateway.name} blocked`,
        timestamp: gateway.targetDate || new Date().toISOString(),
        date: new Date(gateway.targetDate || new Date()),
      });
    }
  }

  // Sort by date descending (most recent first)
  events.sort((a, b) => b.date.getTime() - a.date.getTime());

  // Limit to recent events
  const recentEvents = events.slice(0, 15);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Lifecycle Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        {recentEvents.length === 0 ? (
          <p className="py-4 text-center text-sm text-gray-400">
            No events yet
          </p>
        ) : (
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-[15px] top-0 h-full w-px bg-gray-200" />

            <ul className="space-y-4">
              {recentEvents.map((event) => {
                const Icon = event.icon;
                return (
                  <li key={event.id} className="relative flex gap-3 pl-0">
                    {/* Icon circle */}
                    <div
                      className={`relative z-10 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${event.iconBg}`}
                    >
                      <Icon className={`h-4 w-4 ${event.iconColor}`} />
                    </div>

                    {/* Content */}
                    <div className="min-w-0 flex-1 pt-0.5">
                      <p className="text-sm text-gray-700">
                        {event.description}
                      </p>
                      <div className="mt-0.5 flex items-center gap-2 text-xs text-gray-400">
                        <span>{formatEventDate(event.timestamp)}</span>
                        {event.timestamp.includes("T") && (
                          <>
                            <span>&middot;</span>
                            <span>{formatEventTime(event.timestamp)}</span>
                          </>
                        )}
                        {event.actor && (
                          <>
                            <span>&middot;</span>
                            <span className="text-gray-500">
                              {event.actor}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
