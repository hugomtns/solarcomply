"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { AIMessage } from "@/lib/types";
import { getAiGreeting, findAIResponse, getFallbackResponse } from "@/data/ai-responses";
import { MessageBubble } from "@/components/compliance-ai/message-bubble";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Bot, Loader2 } from "lucide-react";

interface ChatInterfaceProps {
  projectId?: string;
}

export function ChatInterface({ projectId }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<AIMessage[]>([getAiGreeting(projectId)]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  const handleSubmit = useCallback(
    (text?: string) => {
      const query = (text || inputValue).trim();
      if (!query || isTyping) return;

      const userMessage: AIMessage = {
        id: `user-${Date.now()}`,
        role: "user",
        content: query,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setInputValue("");
      setIsTyping(true);

      setTimeout(() => {
        const aiResponse = findAIResponse(query, projectId);
        const response = aiResponse || {
          ...getFallbackResponse(projectId),
          id: `ai-${Date.now()}`,
          timestamp: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, response]);
        setIsTyping(false);
      }, 800);
    },
    [inputValue, isTyping, projectId]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Expose submitQuery for external prompt triggers
  const submitQuery = useCallback(
    (query: string) => {
      setInputValue(query);
      // Use a small timeout to allow the input to update visually
      setTimeout(() => handleSubmit(query), 50);
    },
    [handleSubmit]
  );

  // Attach submitQuery to a ref so parent can call it
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).__chatSubmit = submitQuery;
    return () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (window as any).__chatSubmit;
    };
  }, [submitQuery]);

  return (
    <div className="flex h-full flex-col rounded-lg border border-gray-200 bg-gray-50">
      {/* Messages area */}
      <ScrollArea className="flex-1 overflow-auto">
        <div className="space-y-6 p-4">
          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}

          {isTyping && (
            <div className="flex gap-2">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100 border border-gray-200">
                <Bot className="h-4 w-4 text-brand-navy" />
              </div>
              <div className="flex items-center gap-2 rounded-2xl rounded-bl-sm border border-gray-200 bg-white px-4 py-3">
                <Loader2 className="h-4 w-4 animate-spin text-brand-blue" />
                <span className="text-sm text-gray-500">Analyzing...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input area */}
      <div className="border-t border-gray-200 bg-white p-3">
        <div className="flex items-center gap-2">
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about compliance, standards, documentation..."
            className="flex-1"
            disabled={isTyping}
          />
          <Button
            size="sm"
            onClick={() => handleSubmit()}
            disabled={!inputValue.trim() || isTyping}
            className="h-9 w-9 shrink-0 bg-brand-blue hover:bg-brand-blue-hover p-0"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <p className="mt-1.5 text-center text-[10px] text-gray-400">
          AI responses are based on project data and may not reflect real-time changes.
        </p>
      </div>
    </div>
  );
}
