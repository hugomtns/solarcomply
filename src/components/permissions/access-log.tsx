"use client";

import { useState, useMemo } from "react";
import { users, organizations } from "@/data/stakeholders";
import { documents } from "@/data/documents";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type ActionType = "Viewed" | "Downloaded" | "Uploaded" | "Shared";

interface AccessLogEntry {
  id: string;
  userId: string;
  action: ActionType;
  documentId: string;
  timestamp: string;
  ipAddress: string;
}

const ACTIONS: ActionType[] = ["Viewed", "Downloaded", "Uploaded", "Shared"];

const ACTION_BADGE: Record<ActionType, string> = {
  Viewed: "bg-blue-50 text-blue-700 border-blue-200",
  Downloaded: "bg-green-50 text-green-700 border-green-200",
  Uploaded: "bg-amber-50 text-amber-700 border-amber-200",
  Shared: "bg-purple-50 text-purple-700 border-purple-200",
};

const MOCK_IPS = [
  "192.168.1.42",
  "10.0.0.115",
  "172.16.8.203",
  "85.214.132.47",
  "91.108.12.88",
  "194.25.134.61",
  "78.47.163.210",
  "203.0.113.55",
  "141.76.45.12",
  "62.138.200.9",
];

function generateMockEntries(): AccessLogEntry[] {
  const entries: AccessLogEntry[] = [];
  const now = new Date("2026-03-03T12:00:00Z");
  const docsSubset = documents.slice(0, 20);

  for (let i = 0; i < 30; i++) {
    const user = users[i % users.length];
    const doc = docsSubset[i % docsSubset.length];
    const action = ACTIONS[i % ACTIONS.length];
    const hoursAgo = Math.floor(i * 5.5 + Math.floor((i * 7) % 11));
    const ts = new Date(now.getTime() - hoursAgo * 3600 * 1000);

    entries.push({
      id: `log-${i + 1}`,
      userId: user.id,
      action,
      documentId: doc.id,
      timestamp: ts.toISOString(),
      ipAddress: MOCK_IPS[i % MOCK_IPS.length],
    });
  }

  return entries.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
}

const mockEntries = generateMockEntries();

function formatTimestamp(iso: string): string {
  const d = new Date(iso);
  const now = new Date("2026-03-03T12:00:00Z");
  const diffMs = now.getTime() - d.getTime();
  const diffHrs = Math.floor(diffMs / 3600000);
  if (diffHrs < 1) return "Just now";
  if (diffHrs < 24) return `${diffHrs}h ago`;
  const diffDays = Math.floor(diffHrs / 24);
  if (diffDays === 1) return "Yesterday";
  return `${diffDays}d ago`;
}

export function AccessLog() {
  const [orgFilter, setOrgFilter] = useState("all");
  const [actionFilter, setActionFilter] = useState("all");

  const filtered = useMemo(() => {
    return mockEntries.filter((entry) => {
      const user = users.find((u) => u.id === entry.userId);
      if (orgFilter !== "all" && user?.organizationId !== orgFilter)
        return false;
      if (actionFilter !== "all" && entry.action !== actionFilter) return false;
      return true;
    });
  }, [orgFilter, actionFilter]);

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-base font-semibold">
            Access Log
          </CardTitle>
          <div className="flex items-center gap-2">
            <Select value={orgFilter} onValueChange={setOrgFilter}>
              <SelectTrigger size="sm" className="w-[180px]">
                <SelectValue placeholder="All Organizations" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Organizations</SelectItem>
                {organizations.map((org) => (
                  <SelectItem key={org.id} value={org.id}>
                    {org.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger size="sm" className="w-[140px]">
                <SelectValue placeholder="All Actions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                {ACTIONS.map((a) => (
                  <SelectItem key={a} value={a}>
                    {a}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y">
          {filtered.length === 0 && (
            <p className="px-6 py-8 text-center text-sm text-gray-500">
              No matching access log entries.
            </p>
          )}
          {filtered.map((entry) => {
            const user = users.find((u) => u.id === entry.userId);
            const org = organizations.find(
              (o) => o.id === user?.organizationId
            );
            const doc = documents.find((d) => d.id === entry.documentId);

            return (
              <div
                key={entry.id}
                className="flex items-start gap-3 px-6 py-3 hover:bg-gray-50 transition-colors"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-navy text-xs font-semibold text-white">
                  {user?.avatar || "??"}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-1.5 text-sm">
                    <span className="font-medium text-gray-900">
                      {user?.name || "Unknown"}
                    </span>
                    <span className="text-gray-400">-</span>
                    <span className="text-gray-500 text-xs">
                      {org?.name || ""}
                    </span>
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-xs">
                    <Badge
                      variant="outline"
                      className={`text-[11px] ${ACTION_BADGE[entry.action]}`}
                    >
                      {entry.action}
                    </Badge>
                    <span className="text-gray-700 truncate max-w-[300px]">
                      {doc?.name || "Unknown document"}
                    </span>
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-xs text-gray-500">
                    {formatTimestamp(entry.timestamp)}
                  </p>
                  <p className="mt-0.5 text-[11px] font-mono text-gray-400">
                    {entry.ipAddress}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
