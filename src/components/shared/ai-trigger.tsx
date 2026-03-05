"use client";

import { Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useApp } from "@/contexts/app-context";
import { useRouter, usePathname } from "next/navigation";

interface AITriggerProps {
  context: { type: "document" | "requirement" | "gateway"; id: string };
  label?: string;
  analysis?: string;
}

export function AITrigger({ context, label, analysis }: AITriggerProps) {
  const { setAiContext } = useApp();
  const router = useRouter();
  const pathname = usePathname();

  // Extract projectId from pathname
  const match = pathname.match(/\/project\/([^/]+)/);
  const projectId = match?.[1];

  const handleViewInAIHub = () => {
    setAiContext(context);
    if (projectId) {
      router.push(`/project/${projectId}/ai`);
    }
  };

  if (analysis) {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 text-purple-500 hover:text-purple-700 hover:bg-purple-50"
          >
            <Sparkles className="h-3.5 w-3.5" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-72" align="end">
          <div className="space-y-2">
            <div className="flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-purple-600" />
              <span className="text-xs font-semibold text-purple-900">AI Quick Analysis</span>
            </div>
            <p className="text-xs text-gray-700">{analysis}</p>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-full justify-between text-xs text-purple-700 hover:text-purple-900 hover:bg-purple-50"
              onClick={handleViewInAIHub}
            >
              {label || "Deep Analysis in AI Hub"}
              <ArrowRight className="h-3 w-3" />
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      className="h-6 gap-1 px-2 text-xs text-purple-600 hover:text-purple-800 hover:bg-purple-50"
      onClick={handleViewInAIHub}
    >
      <Sparkles className="h-3 w-3" />
      {label || "AI"}
    </Button>
  );
}
