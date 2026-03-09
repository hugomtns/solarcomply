"use client";

import { Bell, AlertTriangle, AlertCircle, Info } from "lucide-react";
import { useApp } from "@/contexts/app-context";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

const severityConfig = {
  critical: { icon: AlertCircle, color: "text-red-500", bg: "bg-red-50", border: "border-l-red-500" },
  warning: { icon: AlertTriangle, color: "text-amber-500", bg: "bg-amber-50", border: "border-l-amber-500" },
  info: { icon: Info, color: "text-blue-500", bg: "bg-blue-50", border: "border-l-blue-500" },
};

export function NotificationBell() {
  const { notifications, acknowledgeAlert } = useApp();
  const unreadCount = notifications.filter((n) => !n.acknowledged).length;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative" aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ""}`}>
          <Bell className="h-5 w-5 text-gray-600" />
          {unreadCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0" align="end">
        <div className="border-b px-4 py-3">
          <h4 className="text-sm font-semibold">Notifications</h4>
          <p className="text-xs text-gray-500">{unreadCount} unread alerts</p>
        </div>
        <ScrollArea className="max-h-80">
          {notifications.slice(0, 8).map((alert) => {
            const config = severityConfig[alert.severity];
            const Icon = config.icon;
            return (
              <div
                key={alert.id}
                className={cn(
                  "border-b border-l-4 px-4 py-3 last:border-b-0",
                  config.border,
                  !alert.acknowledged ? config.bg : "bg-white"
                )}
              >
                <div className="flex items-start gap-2">
                  <Icon className={cn("mt-0.5 h-4 w-4 shrink-0", config.color)} />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900">{alert.title}</p>
                    <p className="mt-0.5 text-xs text-gray-500 line-clamp-2">{alert.description}</p>
                    <div className="mt-1 flex items-center justify-between">
                      <span className="text-xs text-gray-400">
                        {new Date(alert.timestamp).toLocaleDateString()}
                      </span>
                      {!alert.acknowledged && (
                        <button
                          onClick={() => acknowledgeAlert(alert.id)}
                          className="text-xs text-blue-600 hover:underline"
                        >
                          Dismiss
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
