"use client";

import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import type { RegulationCitation as RegulationCitationType } from "@/lib/types";

interface RegulationCitationProps {
  citation: RegulationCitationType;
}

export function RegulationCitation({ citation }: RegulationCitationProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger className="flex w-full items-center gap-2 rounded px-2 py-1 text-left text-xs hover:bg-white/[0.06]">
        <ChevronRight className={`h-3 w-3 shrink-0 text-text-muted transition-transform ${isOpen ? "rotate-90" : ""}`} />
        <Badge variant="outline" className="shrink-0 text-[10px] bg-sky-50 text-sky-700 border-sky-200">
          {citation.article}
        </Badge>
        <span className="truncate text-text-secondary">{citation.regulationName}</span>
      </CollapsibleTrigger>
      {citation.excerpt && (
        <CollapsibleContent>
          <div className="ml-5 mt-1 rounded bg-sky-50 px-3 py-2 text-[11px] leading-relaxed text-sky-900">
            &ldquo;{citation.excerpt}&rdquo;
          </div>
        </CollapsibleContent>
      )}
    </Collapsible>
  );
}
