"use client";

import { useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { ChatInterface } from "@/components/compliance-ai/chat-interface";
import { Separator } from "@/components/ui/separator";
import { Sparkles, MessageSquare } from "lucide-react";

const quickPrompts = [
  {
    label: "What fire safety standards apply to our BESS?",
    icon: "fire",
  },
  {
    label: "Is our PAC documentation complete?",
    icon: "doc",
  },
  {
    label: "EU Battery Passport readiness assessment",
    icon: "battery",
  },
  {
    label: "Show hot commissioning non-conformances",
    icon: "ncr",
  },
  {
    label: "PR trend analysis vs. guarantee",
    icon: "trend",
  },
];

export default function ComplianceAIPage() {
  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null);

  const handlePromptClick = (prompt: string) => {
    setSelectedPrompt(prompt);
    const submitFn = (window as Record<string, unknown>).__chatSubmit as
      | ((q: string) => void)
      | undefined;
    if (submitFn) {
      submitFn(prompt);
    }
  };

  return (
    <div className="flex flex-col" style={{ height: "calc(100vh - 7.5rem)" }}>
      <PageHeader
        title="AI Compliance Assistant"
        description="Ask questions about standards, documentation, gaps, and performance"
      >
        <div className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 border border-emerald-200">
          <Sparkles className="h-3 w-3" />
          AI-Powered
        </div>
      </PageHeader>

      <div className="flex flex-1 gap-4 overflow-hidden">
        {/* Left sidebar - Quick prompts */}
        <div className="w-80 shrink-0 overflow-y-auto rounded-lg border border-gray-200 bg-white">
          <div className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <MessageSquare className="h-4 w-4 text-[#2E75B6]" />
              <h2 className="text-sm font-semibold text-[#1B2A4A]">
                Quick Prompts
              </h2>
            </div>
            <p className="text-[11px] text-gray-500 mb-3">
              Click a suggestion to start a conversation
            </p>
            <Separator className="mb-3" />
            <div className="space-y-2">
              {quickPrompts.map((prompt) => (
                <button
                  key={prompt.label}
                  onClick={() => handlePromptClick(prompt.label)}
                  className={`w-full rounded-lg border px-3 py-2.5 text-left text-sm transition-colors hover:border-[#2E75B6] hover:bg-blue-50/50 ${
                    selectedPrompt === prompt.label
                      ? "border-[#2E75B6] bg-blue-50/50 text-[#2E75B6]"
                      : "border-gray-200 text-gray-700"
                  }`}
                >
                  {prompt.label}
                </button>
              ))}
            </div>
          </div>

          <Separator />

          <div className="p-4">
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
              Capabilities
            </h3>
            <ul className="space-y-1.5 text-[11px] text-gray-500">
              <li className="flex items-start gap-1.5">
                <span className="mt-0.5 h-1 w-1 shrink-0 rounded-full bg-emerald-400" />
                Standards applicability lookup
              </li>
              <li className="flex items-start gap-1.5">
                <span className="mt-0.5 h-1 w-1 shrink-0 rounded-full bg-emerald-400" />
                Gap analysis and compliance checks
              </li>
              <li className="flex items-start gap-1.5">
                <span className="mt-0.5 h-1 w-1 shrink-0 rounded-full bg-emerald-400" />
                Documentation completeness review
              </li>
              <li className="flex items-start gap-1.5">
                <span className="mt-0.5 h-1 w-1 shrink-0 rounded-full bg-emerald-400" />
                Performance ratio trend analysis
              </li>
              <li className="flex items-start gap-1.5">
                <span className="mt-0.5 h-1 w-1 shrink-0 rounded-full bg-emerald-400" />
                Non-conformance tracking
              </li>
              <li className="flex items-start gap-1.5">
                <span className="mt-0.5 h-1 w-1 shrink-0 rounded-full bg-emerald-400" />
                Regulatory requirement mapping
              </li>
            </ul>
          </div>
        </div>

        {/* Main chat area */}
        <div className="flex-1 overflow-hidden">
          <ChatInterface />
        </div>
      </div>
    </div>
  );
}
