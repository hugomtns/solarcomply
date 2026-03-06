"use client";

import { Standard } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/shared/status-badge";
import { BookOpen, ExternalLink } from "lucide-react";

interface StandardsCardProps {
  standard: Standard;
}

export function StandardsCard({ standard }: StandardsCardProps) {
  return (
    <Card className="border-gray-200 shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-brand-blue" />
            <CardTitle className="text-sm font-semibold text-brand-navy">
              {standard.body} {standard.number}
            </CardTitle>
          </div>
          <StatusBadge status="pass" />
        </div>
        <p className="text-xs text-gray-600">{standard.title}</p>
        {standard.edition && (
          <Badge variant="outline" className="w-fit text-[10px] text-gray-500">
            {standard.edition}
          </Badge>
        )}
      </CardHeader>
      <CardContent className="pt-0">
        <p className="mb-3 text-xs leading-relaxed text-gray-500">
          {standard.scope}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-1">
            {standard.applicableGateways.map((gw) => (
              <Badge
                key={gw}
                variant="outline"
                className="text-[10px] bg-blue-50 text-blue-700 border-blue-200"
              >
                {gw}
              </Badge>
            ))}
          </div>
          <button className="flex items-center gap-1 text-[11px] font-medium text-brand-blue hover:underline">
            View Full Requirements
            <ExternalLink className="h-3 w-3" />
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
