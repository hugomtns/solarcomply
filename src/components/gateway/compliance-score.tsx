import { ComplianceScoreRing } from "@/components/shared/compliance-score-ring";

interface ComplianceScoreProps {
  score: number;
  gatewayCode: string;
}

export function ComplianceScore({ score, gatewayCode }: ComplianceScoreProps) {
  const status =
    score >= 90
      ? "On track for approval"
      : score >= 70
        ? "Action required before approval"
        : score > 0
          ? "Significant gaps remain"
          : "Not yet assessed";

  return (
    <div className="flex items-center gap-4">
      <ComplianceScoreRing score={score} size="lg" />
      <div>
        <p className="text-sm font-medium text-gray-900">
          Gateway {gatewayCode} Compliance
        </p>
        <p className="mt-0.5 text-xs text-gray-500">{status}</p>
        <p className="mt-1 text-xs text-gray-400">
          {score}% of requirements satisfied
        </p>
      </div>
    </div>
  );
}
