import { FEOCAssessment, BatteryPassport } from "@/lib/types";

// ─── FEOC Assessments ────────────────────────────────────────────

const feocAssessments: FEOCAssessment[] = [
  {
    projectId: "proj-sunridge",
    assessmentDate: "2026-02-01",
    overallEligible: false,
    safeHarborApplies: false,
    bocDate: "2025-11-20",
    itcAtRisk: "$18.2M",
    categoryAssessments: [
      {
        category: "solar_modules",
        label: "Solar Modules",
        totalCostUSD: 42_000_000,
        nonFEOCCostUSD: 18_060_000,
        feocRatio: 0.43,
        threshold: 0.75,
        passing: false,
        flaggedSuppliers: [
          { name: "Tongwei Solar", component: "Polysilicon", reason: "covered_nation_manufacturing", coveredNation: "CN", tier: 2 },
          { name: "LONGi Green Energy", component: "Wafers", reason: "covered_nation_manufacturing", coveredNation: "CN", tier: 2 },
        ],
      },
      {
        category: "inverters",
        label: "Inverters",
        totalCostUSD: 8_500_000,
        nonFEOCCostUSD: 7_650_000,
        feocRatio: 0.90,
        threshold: 0.75,
        passing: true,
        flaggedSuppliers: [],
      },
      {
        category: "energy_storage",
        label: "Energy Storage",
        totalCostUSD: 35_000_000,
        nonFEOCCostUSD: 19_250_000,
        feocRatio: 0.55,
        threshold: 0.40,
        passing: true,
        flaggedSuppliers: [
          { name: "Shanshan Technology", component: "Graphite Anode", reason: "covered_nation_manufacturing", coveredNation: "CN", tier: 3 },
        ],
      },
      {
        category: "critical_minerals",
        label: "Critical Minerals",
        totalCostUSD: 12_000_000,
        nonFEOCCostUSD: 4_800_000,
        feocRatio: 0.40,
        threshold: 0.50,
        passing: false,
        flaggedSuppliers: [
          { name: "Ganfeng Lithium", component: "Lithium Carbonate", reason: "covered_nation_manufacturing", coveredNation: "CN", tier: 3 },
          { name: "Shanshan Technology", component: "Graphite", reason: "covered_nation_manufacturing", coveredNation: "CN", tier: 3 },
        ],
      },
    ],
  },
];

// ─── Battery Passports ──────────────────────────────────────────

const batteryPassports: BatteryPassport[] = [
  {
    projectId: "proj-sonnenberg",
    batteryModel: "BYD MC Cube T2-100",
    manufacturer: "BYD Company Ltd.",
    chemistryType: "LFP (LiFePO4)",
    capacityMWh: 100,
    manufacturingDate: "2025-10-15",
    manufacturingLocation: "Shenzhen, China",
    carbonFootprint: {
      totalKgCO2PerKWh: 61.5,
      manufacturing: 28.2,
      rawMaterials: 25.8,
      transport: 7.5,
      status: "calculating",
    },
    performance: {
      ratedCapacity: 100_000,
      ratedVoltage: 800,
      expectedLifetimeYears: 15,
      expectedCycles: 6000,
    },
    stateOfHealth: {
      currentSoH: 99.2,
      lastUpdated: "2026-02-28",
      methodology: "BMS impedance-based estimation",
    },
    dueDiligence: {
      supplyChainPolicy: true,
      riskAssessment: true,
      thirdPartyAudit: false,
      status: "in_progress",
    },
    accessLevel: "restricted",
  },
];

// ─── Helpers ─────────────────────────────────────────────────────

export function getFEOCAssessment(projectId: string): FEOCAssessment | undefined {
  return feocAssessments.find((a) => a.projectId === projectId);
}

export function getBatteryPassport(projectId: string): BatteryPassport | undefined {
  return batteryPassports.find((p) => p.projectId === projectId);
}
