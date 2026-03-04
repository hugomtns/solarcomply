"use client";

import { Project } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { COLORS } from "@/lib/constants";

interface RegulatoryTimelineProps {
  project: Project;
}

interface Deadline {
  date: string;
  regulation: string;
  description: string;
  jurisdictions: string[];
}

const allDeadlines: Deadline[] = [
  { date: "2025-02-18", regulation: "EU Battery Regulation", description: "Carbon footprint declaration required for batteries >2 kWh on EU market", jurisdictions: ["EU"] },
  { date: "2025-12-31", regulation: "OBBBA FEOC Final Rule", description: "FEOC restrictions fully in effect for ITC/PTC eligibility — no more safe harbor for new projects", jurisdictions: ["US"] },
  { date: "2026-01-01", regulation: "EU CBAM", description: "Definitive CBAM regime begins — certificates required for covered goods imports (steel, aluminium)", jurisdictions: ["EU"] },
  { date: "2026-08-18", regulation: "EU Battery Regulation", description: "Performance class labels required for batteries placed on EU market", jurisdictions: ["EU"] },
  { date: "2027-02-18", regulation: "EU Battery Regulation", description: "Full digital battery passport + QR code required for industrial batteries >2 kWh", jurisdictions: ["EU"] },
  { date: "2027-07-26", regulation: "CSDDD", description: "Corporate sustainability due diligence obligations begin for largest companies", jurisdictions: ["EU"] },
  { date: "2027-08-18", regulation: "EU Battery Regulation", description: "Supply chain due diligence obligations for battery manufacturers", jurisdictions: ["EU"] },
  { date: "2027-12-14", regulation: "EU Forced Labour Regulation", description: "Full enforcement — competent authorities can investigate and order product withdrawals", jurisdictions: ["EU"] },
  { date: "2028-08-18", regulation: "EU Battery Regulation", description: "Recycled content targets: 16% cobalt, 6% lithium, 6% nickel", jurisdictions: ["EU"] },
  { date: "2029-01-01", regulation: "REACH PFAS Restriction", description: "Expected earliest restriction date for PFAS in industrial applications (if adopted)", jurisdictions: ["EU"] },
];

export function RegulatoryTimeline({ project }: RegulatoryTimelineProps) {
  const now = Date.now();

  const filtered = allDeadlines.filter((d) =>
    d.jurisdictions.some((j) => project.jurisdictions.includes(j))
  );

  return (
    <div className="space-y-1">
      <div className="relative ml-4 border-l-2 border-gray-200 pl-6">
        {filtered.map((d, i) => {
          const deadlineDate = new Date(d.date);
          const daysUntil = Math.floor((deadlineDate.getTime() - now) / (1000 * 60 * 60 * 24));
          const isPast = daysUntil < 0;

          let dotColor: string = COLORS.gray400;
          let badgeClass = "bg-gray-100 text-gray-600";
          if (isPast) {
            dotColor = COLORS.teal;
            badgeClass = "bg-emerald-50 text-emerald-700";
          } else if (daysUntil < 90) {
            dotColor = COLORS.red;
            badgeClass = "bg-red-50 text-red-700";
          } else if (daysUntil < 180) {
            dotColor = COLORS.amber;
            badgeClass = "bg-amber-50 text-amber-700";
          }

          return (
            <div key={i} className="relative pb-8 last:pb-0">
              {/* Dot */}
              <div
                className="absolute -left-[31px] top-1 h-3.5 w-3.5 rounded-full border-2 border-white"
                style={{ backgroundColor: dotColor }}
              />

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-semibold text-gray-900">{d.regulation}</span>
                  {d.jurisdictions.map((j) => (
                    <Badge key={j} variant="outline" className="text-[10px]">{j}</Badge>
                  ))}
                </div>
                <p className="mt-0.5 text-xs text-gray-500">
                  {deadlineDate.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                </p>
                <p className="mt-1 text-sm text-gray-600">{d.description}</p>
                <Badge variant="outline" className={`mt-2 text-xs ${badgeClass}`}>
                  {isPast ? "Effective" : `${daysUntil} days remaining`}
                </Badge>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <p className="py-8 text-center text-sm text-gray-400">
          No upcoming regulatory deadlines for this project&apos;s jurisdictions.
        </p>
      )}
    </div>
  );
}
