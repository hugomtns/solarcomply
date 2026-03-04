"use client";

import { GatewayCoverageItem } from "@/lib/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

interface GatewayCoverageMatrixProps {
  coverage: GatewayCoverageItem[];
}

export function GatewayCoverageMatrix({ coverage }: GatewayCoverageMatrixProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-[#1B2A4A]">Gateway Coverage</h2>
      <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="w-[100px] text-xs">Gateway</TableHead>
              <TableHead className="text-xs">Name</TableHead>
              <TableHead className="w-[90px] text-center text-xs">Required</TableHead>
              <TableHead className="w-[90px] text-center text-xs">Present</TableHead>
              <TableHead className="w-[90px] text-center text-xs">Missing</TableHead>
              <TableHead className="w-[90px] text-center text-xs">Issues</TableHead>
              <TableHead className="w-[180px] text-xs">Coverage</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {coverage.map((item) => {
              const pct = item.requiredCount > 0
                ? Math.round((item.presentCount / item.requiredCount) * 100)
                : 100;
              const barColor =
                pct >= 100 ? "#00B0A0" : pct >= 50 ? "#F59E0B" : "#EF4444";

              return (
                <TableRow key={item.gatewayCode}>
                  <TableCell className="font-mono text-sm font-semibold text-[#2E75B6]">
                    {item.gatewayCode}
                  </TableCell>
                  <TableCell className="text-sm text-gray-700">
                    {item.gatewayName}
                  </TableCell>
                  <TableCell className="text-center text-sm">{item.requiredCount}</TableCell>
                  <TableCell className="text-center text-sm font-medium text-emerald-700">
                    {item.presentCount}
                  </TableCell>
                  <TableCell className="text-center text-sm">
                    <span className={cn(
                      "font-medium",
                      item.missingCount > 0 ? "text-red-600" : "text-gray-400"
                    )}>
                      {item.missingCount}
                    </span>
                  </TableCell>
                  <TableCell className="text-center text-sm">
                    <span className={cn(
                      "font-medium",
                      item.issueCount > 0 ? "text-amber-600" : "text-gray-400"
                    )}>
                      {item.issueCount}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{ width: `${pct}%`, backgroundColor: barColor }}
                        />
                      </div>
                      <span className="w-9 text-right text-xs font-medium tabular-nums text-gray-600">
                        {pct}%
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
