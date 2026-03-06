"use client";

import { AIMessage } from "@/lib/types";
import { StatusBadge } from "@/components/shared/status-badge";
import { StandardsCard } from "@/components/compliance-ai/standards-card";
import { GapReportPreview } from "@/components/compliance-ai/gap-report-preview";
import { Bot, User } from "lucide-react";

interface MessageBubbleProps {
  message: AIMessage;
}

function formatContent(content: string) {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];

  lines.forEach((line, i) => {
    // Bullet points
    if (line.trimStart().startsWith("- ")) {
      const bulletText = line.trimStart().slice(2);
      elements.push(
        <div key={i} className="flex items-start gap-1.5 pl-2">
          <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-current" />
          <span>{renderBold(bulletText)}</span>
        </div>
      );
      return;
    }

    // Numbered list items (e.g., "1. text")
    const numberedMatch = line.match(/^(\d+)\.\s+(.+)/);
    if (numberedMatch) {
      elements.push(
        <div key={i} className="flex items-start gap-1.5 pl-2">
          <span className="shrink-0 font-medium">{numberedMatch[1]}.</span>
          <span>{renderBold(numberedMatch[2])}</span>
        </div>
      );
      return;
    }

    // Empty line = spacing
    if (line.trim() === "") {
      elements.push(<div key={i} className="h-1" />);
      return;
    }

    // Regular text
    elements.push(
      <p key={i}>{renderBold(line)}</p>
    );
  });

  return elements;
}

function renderBold(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";
  const time = new Date(message.timestamp).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });

  if (isUser) {
    return (
      <div className="flex justify-end gap-2">
        <div className="max-w-[70%]">
          <div className="rounded-2xl rounded-br-sm bg-brand-blue px-4 py-2.5 text-sm text-white">
            {message.content}
          </div>
          <p className="mt-1 text-right text-[10px] text-gray-400">{time}</p>
        </div>
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-blue">
          <User className="h-4 w-4 text-white" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100 border border-gray-200">
        <Bot className="h-4 w-4 text-brand-navy" />
      </div>
      <div className="max-w-[80%] space-y-3">
        <div className="rounded-2xl rounded-bl-sm border border-gray-200 bg-white px-4 py-3 text-sm leading-relaxed text-gray-800">
          {formatContent(message.content)}
        </div>

        {message.standards && message.standards.length > 0 && (
          <div className="space-y-2">
            {message.standards.map((std) => (
              <StandardsCard key={std.id} standard={std} />
            ))}
          </div>
        )}

        {message.gapItems && message.gapItems.length > 0 && (
          <div className="space-y-2">
            <GapReportPreview gapItems={message.gapItems} />
            <div className="overflow-hidden rounded-lg border border-gray-200">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-gray-50 text-left text-gray-600">
                    <th className="px-3 py-2 font-medium">Standard</th>
                    <th className="px-3 py-2 font-medium">Requirement</th>
                    <th className="px-3 py-2 font-medium">Status</th>
                    <th className="px-3 py-2 font-medium">Action / Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {message.gapItems.map((item, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="whitespace-nowrap px-3 py-2 font-medium text-gray-700">
                        {item.standard}
                      </td>
                      <td className="px-3 py-2 text-gray-600">
                        {item.requirement}
                      </td>
                      <td className="px-3 py-2">
                        <StatusBadge status={item.status} />
                      </td>
                      <td className="px-3 py-2 text-gray-500">
                        {item.action}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <p className="text-[10px] text-gray-400">{time}</p>
      </div>
    </div>
  );
}
