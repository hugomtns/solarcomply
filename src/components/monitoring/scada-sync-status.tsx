import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Database } from "lucide-react";

interface SyncSource {
  name: string;
  status: "connected" | "degraded" | "disconnected";
  detail: string;
}

const SYNC_SOURCES: SyncSource[] = [
  { name: "SMA Inverter Fleet", status: "connected", detail: "last sync 2 min ago" },
  { name: "BYD BMS", status: "connected", detail: "last sync 45 sec ago" },
  { name: "Weather Station", status: "degraded", detail: "3 gaps in last 24h" },
  { name: "Grid Meter", status: "connected", detail: "last sync 5 min ago" },
];

const statusDot: Record<SyncSource["status"], string> = {
  connected: "bg-emerald-500",
  degraded: "bg-amber-500",
  disconnected: "bg-red-500",
};

const statusLabel: Record<SyncSource["status"], string> = {
  connected: "Connected",
  degraded: "Degraded",
  disconnected: "Disconnected",
};

export function ScadaSyncStatus() {
  return (
    <Card className="py-3">
      <CardContent className="flex items-center justify-between gap-6 px-5 py-0">
        <div className="flex items-center gap-6">
          {SYNC_SOURCES.map((src) => (
            <div key={src.name} className="flex items-center gap-2">
              <div className={cn("h-2 w-2 rounded-full", statusDot[src.status])} />
              <div className="text-xs">
                <span className="font-medium text-[#1B2A4A]">{src.name}</span>
                <span className="mx-1 text-gray-300">—</span>
                <span
                  className={cn(
                    src.status === "connected" && "text-emerald-600",
                    src.status === "degraded" && "text-amber-600",
                    src.status === "disconnected" && "text-red-600"
                  )}
                >
                  {statusLabel[src.status]}
                </span>
                <span className="ml-1 text-gray-400">{src.detail}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Database className="h-3.5 w-3.5" />
          <span>
            Today: <span className="font-semibold text-[#1B2A4A]">2,847,392</span> data points
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
