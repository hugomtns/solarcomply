"use client";

import { useEffect, useState } from "react";

interface ComplianceScoreRingProps {
  score: number;
  size?: "sm" | "md" | "lg";
  label?: string;
}

const sizeMap = { sm: 48, md: 80, lg: 120 };
const strokeMap = { sm: 4, md: 6, lg: 8 };
const textMap = { sm: "text-xs", md: "text-lg", lg: "text-2xl" };

function getColor(score: number) {
  if (score < 60) return "#EF4444";
  if (score < 80) return "#F59E0B";
  return "#00B0A0";
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
          className="absolute inset-0 rounded-full opacity-20 blur-md transition-opacity duration-700"
          style={{ backgroundColor: color, opacity: animatedScore > 0 ? 0.15 : 0 }}
        />
        <svg width={dim} height={dim} className="-rotate-90">
          <circle
            cx={dim / 2}
            cy={dim / 2}
            r={radius}
            fill="none"
            stroke="#E5E7EB"
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
          />
        </svg>
        <span className={`absolute font-bold ${textMap[size]}`} style={{ color }}>
          {score}
        </span>
      </div>
      {label && (
        <span className="text-[10px] font-medium text-gray-500">{label}</span>
      )}
    </div>
  );
}
