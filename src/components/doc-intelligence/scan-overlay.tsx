"use client";

import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { ScanSearch, Loader2 } from "lucide-react";

const SCAN_PHASES = [
  "Analyzing document metadata…",
  "Cross-referencing gateway requirements…",
  "Checking standard compliance…",
  "Detecting inconsistencies…",
  "Evaluating format compliance…",
  "Generating health score…",
];

const SCAN_DURATION_MS = 3000;
const TICK_INTERVAL = 50;

interface ScanOverlayProps {
  onComplete: () => void;
}

export function ScanOverlay({ onComplete }: ScanOverlayProps) {
  const [progress, setProgress] = useState(0);
  const [phaseIndex, setPhaseIndex] = useState(0);

  useEffect(() => {
    const increment = 100 / (SCAN_DURATION_MS / TICK_INTERVAL);
    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + increment;
        if (next >= 100) {
          clearInterval(timer);
          return 100;
        }
        return next;
      });
    }, TICK_INTERVAL);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const phaseInterval = SCAN_DURATION_MS / SCAN_PHASES.length;
    const timer = setInterval(() => {
      setPhaseIndex((prev) => {
        if (prev >= SCAN_PHASES.length - 1) {
          clearInterval(timer);
          return prev;
        }
        return prev + 1;
      });
    }, phaseInterval);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (progress >= 100) {
      const timeout = setTimeout(onComplete, 400);
      return () => clearTimeout(timeout);
    }
  }, [progress, onComplete]);

  return (
    <div className="flex flex-1 items-center justify-center">
      <div className="mx-auto w-full max-w-md space-y-6 rounded-xl border border-white/[0.08] bg-white/[0.05] p-8 shadow-sm">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="relative">
            <ScanSearch className="h-12 w-12 text-[#2E75B6]" />
            <Loader2 className="absolute -right-1 -bottom-1 h-5 w-5 animate-spin text-[#ED7D31]" />
          </div>
          <h2 className="text-lg font-semibold text-white">
            Scanning Documents
          </h2>
          <p className="text-sm text-slate-400">
            AI is analyzing your project documentation…
          </p>
        </div>

        <div className="space-y-2">
          <Progress value={progress} className="h-2.5" />
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="transition-opacity duration-300">
              {SCAN_PHASES[phaseIndex]}
            </span>
            <span className="font-medium tabular-nums">{Math.round(progress)}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
