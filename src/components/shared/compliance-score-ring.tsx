"use client";

import { useEffect, useState } from "react";
import { COLORS } from "@/lib/constants";

interface ComplianceScoreRingProps {
  score: number;
  size?: "sm" | "md" | "lg";
  label?: string;
}

const sizeMap = { sm: 48, md: 80, lg: 120 };
const strokeMap = { sm: 4, md: 6, lg: 8 };
const textMap = { sm: "text-xs", md: "text-lg", lg: "text-2xl" };

function getColor(score: number) {
  if (score < 60) return COLORS.red;
  if (score < 80) return COLORS.amber;
  return COLORS.teal;
}

export function ComplianceScoreRing({ score, size = "md", label }: ComplianceScoreRingProps) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const dim = sizeMap[size];
  const stroke = strokeMap[size];
  const radius = (dim - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animatedScore / 100) * circumference;
  const color = getColor(score);

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedScore(score), 100);
    return () => clearTimeout(timer);
  }, [score]);

  return (
    <div className="inline-flex flex-col items-center gap-1">
      <div
        className="relative inline-flex items-center justify-center"
        style={{ width: dim, height: dim }}
      >
        {/* Glow effect */}
        <div
          className="absolute inset-0 rounded-full transition-opacity duration-700"
          style={{
            backgroundColor: color,
            opacity: animatedScore > 0 ? 0.15 : 0,
            filter: 'blur(10px)',
          }}
        />
        <svg width={dim} height={dim} className="-rotate-90">
          <circle
            cx={dim / 2}
            cy={dim / 2}
            r={radius}
            fill="none"
            stroke="rgba(148, 163, 184, 0.12)"
            strokeWidth={stroke}
          />
          <circle
            cx={dim / 2}
            cy={dim / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={stroke}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
            style={{
              filter: `drop-shadow(0 0 4px ${color}60)`,
            }}
          />
        </svg>
        <span className={`absolute font-bold font-display ${textMap[size]}`} style={{ color }}>
          {score}
        </span>
      </div>
      {label && (
        <span className="text-[10px] font-medium text-text-muted">{label}</span>
      )}
    </div>
  );
}
