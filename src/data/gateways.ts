import { Gateway, LifecycleStage } from "@/lib/types";

// ─── Sonnenberg (existing, untouched) ─────────────────────────────

const sonnenbergGateways: Gateway[] = [
  {
    id: "gw-sonnenberg-g0", projectId: "proj-sonnenberg", code: "G0", name: "Site Identification",
    description: "Initial site screening, solar resource assessment, and preliminary feasibility.",
    status: "passed", complianceScore: 100, stage: "feasibility",
    completedDate: "2024-03-15", targetDate: "2024-03-15",
    requirements: [
      { id: "g0-r1", category: "document", label: "Solar Resource Assessment", description: "Preliminary solar resource data and yield estimate", status: "pass", checkType: "manual", linkedDocumentIds: ["doc-solar-resource"] },
      { id: "g0-r2", category: "document", label: "Site Identification Report", description: "Land availability and preliminary site layout", status: "pass", checkType: "manual" },
      { id: "g0-r3", category: "standard", label: "Grid Capacity Check", description: "Preliminary grid capacity assessment", status: "pass", checkType: "automated", standardRef: "50Hertz Technical Code" },
    ],
    approvals: [
      { stakeholderOrgId: "org-greenfield", requiredRole: "approve", status: "approved", approverUserId: "user-thomas", timestamp: "2024-03-15T10:00:00Z" },
    ],
  },
  {
    id: "gw-sonnenberg-g1", projectId: "proj-sonnenberg", code: "G1", name: "Development Approval",
    description: "EIA completion, land lease execution, grid connection agreement, development permits.",
    status: "passed", complianceScore: 100, stage: "development",
    completedDate: "2024-07-20", targetDate: "2024-07-31",
    requirements: [
      { id: "g1-r1", category: "document", label: "EIA Report", description: "Environmental Impact Assessment complete", status: "pass", checkType: "manual", linkedDocumentIds: ["doc-eia"] },
      { id: "g1-r2", category: "document", label: "Land Lease Agreement", description: "Executed land lease for project site", status: "pass", checkType: "manual", linkedDocumentIds: ["doc-land-lease"] },
      { id: "g1-r3", category: "document", label: "Grid Connection Agreement", description: "Signed grid connection agreement with 50Hertz", status: "pass", checkType: "manual", linkedDocumentIds: ["doc-grid-study"] },
      { id: "g1-r4", category: "approval", label: "Development Permits", description: "All required development permits obtained", status: "pass", checkType: "manual" },
    ],
    approvals: [
      { stakeholderOrgId: "org-greenfield", requiredRole: "approve", status: "approved", approverUserId: "user-thomas", timestamp: "2024-07-20T14:00:00Z" },
      { stakeholderOrgId: "org-dnv", requiredRole: "review", status: "approved", approverUserId: "user-hendrik", timestamp: "2024-07-18T09:00:00Z" },
    ],
  },
  {
    id: "gw-sonnenberg-g2", projectId: "proj-sonnenberg", code: "G2", name: "Financial Close",
    description: "Lender due diligence, PPA execution, financial model approval, insurance placement.",
    status: "passed", complianceScore: 100, stage: "financing",
    completedDate: "2024-11-10", targetDate: "2024-11-15",
    requirements: [
      { id: "g2-r1", category: "document", label: "Financial Model", description: "Approved financial model with sensitivity analysis", status: "pass", checkType: "manual", linkedDocumentIds: ["doc-financial-model"] },
      { id: "g2-r2", category: "document", label: "PPA Agreement", description: "Executed Power Purchase Agreement", status: "pass", checkType: "manual", linkedDocumentIds: ["doc-ppa"] },
      { id: "g2-r3", category: "document", label: "IE Report", description: "Independent Engineer's report", status: "pass", checkType: "manual", linkedDocumentIds: ["doc-ie-report"] },
      { id: "g2-r4", category: "document", label: "Insurance Policies", description: "All required insurance policies in place", status: "pass", checkType: "manual", linkedDocumentIds: ["doc-insurance"] },
    ],
    approvals: [
      { stakeholderOrgId: "org-greenfield", requiredRole: "approve", status: "approved", approverUserId: "user-anna", timestamp: "2024-11-10T11:00:00Z" },
      { stakeholderOrgId: "org-eib", requiredRole: "approve", status: "approved", approverUserId: "user-james", timestamp: "2024-11-08T16:00:00Z" },
      { stakeholderOrgId: "org-dnv", requiredRole: "sign_off", status: "approved", approverUserId: "user-hendrik", timestamp: "2024-11-09T10:00:00Z" },
    ],
  },
  {
    id: "gw-sonnenberg-g3", projectId: "proj-sonnenberg", code: "G3", name: "Design Freeze",
    description: "Detailed engineering complete, design drawings approved, procurement specifications finalized.",
    status: "passed", complianceScore: 98, stage: "engineering",
    completedDate: "2025-03-01", targetDate: "2025-02-28",
    requirements: [
      { id: "g3-r1", category: "document", label: "Single Line Diagram", description: "Approved SLD per IEC 62548-1", status: "pass", checkType: "automated", standardRef: "IEC 62548-1", linkedDocumentIds: ["doc-sld"] },
      { id: "g3-r2", category: "document", label: "Design Drawings Package", description: "Complete design drawings set", status: "pass", checkType: "manual", linkedDocumentIds: ["doc-design-drawings"] },
      { id: "g3-r3", category: "standard", label: "IEC 62548-1 Compliance", description: "PV array design per IEC 62548-1", status: "pass", checkType: "ai_assisted", standardRef: "IEC 62548-1", aiConfidence: 0.95 },
      { id: "g3-r4", category: "document", label: "Cable Schedule", description: "Complete cable schedule and sizing calculations", status: "pass", checkType: "manual", linkedDocumentIds: ["doc-cable-schedule"] },
      { id: "g3-r5", category: "document", label: "Structural Calculations", description: "Foundation and mounting structure calculations", status: "pass", checkType: "manual", linkedDocumentIds: ["doc-structural-calcs"] },
    ],
    approvals: [
      { stakeholderOrgId: "org-solaris", requiredRole: "execute", status: "approved", approverUserId: "user-erik", timestamp: "2025-02-28T09:00:00Z" },
      { stakeholderOrgId: "org-dnv", requiredRole: "review", status: "approved", approverUserId: "user-hendrik", timestamp: "2025-02-27T15:00:00Z" },
      { stakeholderOrgId: "org-greenfield", requiredRole: "approve", status: "approved", approverUserId: "user-thomas", timestamp: "2025-03-01T10:00:00Z" },
    ],
  },
  {
    id: "gw-sonnenberg-g4", projectId: "proj-sonnenberg", code: "G4", name: "Cold Commissioning",
    description: "Equipment installation complete, FAT reports accepted, cold commissioning tests passed.",
    status: "passed", complianceScore: 96, stage: "construction",
    completedDate: "2026-02-12", targetDate: "2026-02-15",
    requirements: [
      { id: "g4-r1", category: "document", label: "FAT Reports — Modules", description: "JinkoSolar module FAT reports for all batches", status: "pass", checkType: "automated", standardRef: "IEC 61215", linkedDocumentIds: ["doc-fat-modules"] },
      { id: "g4-r2", category: "document", label: "FAT Reports — Inverters", description: "SMA inverter FAT reports", status: "pass", checkType: "automated", standardRef: "IEC 62109-1", linkedDocumentIds: ["doc-fat-inverters"] },
      { id: "g4-r3", category: "document", label: "FAT Reports — BESS", description: "BYD BESS system FAT and safety reports", status: "pass", checkType: "manual", linkedDocumentIds: ["doc-fat-bess"] },
      { id: "g4-r4", category: "standard", label: "UL 9540A Testing", description: "BESS cell-level thermal runaway test results", status: "pass", checkType: "manual", standardRef: "UL 9540A", linkedDocumentIds: ["doc-ul9540a"] },
      { id: "g4-r5", category: "document", label: "ITP Sign-off", description: "Inspection and Test Plan fully executed", status: "pass", checkType: "manual", linkedDocumentIds: ["doc-itp"] },
      { id: "g4-r6", category: "data_quality", label: "SCADA Integration Test", description: "All SCADA signals verified and logging", status: "pass", checkType: "automated" },
    ],
    approvals: [
      { stakeholderOrgId: "org-solaris", requiredRole: "execute", status: "approved", approverUserId: "user-erik", timestamp: "2026-02-10T09:00:00Z" },
      { stakeholderOrgId: "org-dnv", requiredRole: "witness", status: "approved", approverUserId: "user-priya", timestamp: "2026-02-11T14:00:00Z" },
      { stakeholderOrgId: "org-greenfield", requiredRole: "approve", status: "approved", approverUserId: "user-thomas", timestamp: "2026-02-12T16:00:00Z" },
      { stakeholderOrgId: "org-sma", requiredRole: "sign_off", status: "approved", approverUserId: "user-stefan", timestamp: "2026-02-09T11:00:00Z" },
      { stakeholderOrgId: "org-byd", requiredRole: "sign_off", status: "approved", approverUserId: "user-zhang", timestamp: "2026-02-10T15:00:00Z" },
    ],
  },
  {
    id: "gw-sonnenberg-g5", projectId: "proj-sonnenberg", code: "G5", name: "Hot Commissioning",
    description: "Energization, performance testing, BESS cycling tests, grid compliance verification.",
    status: "in_review", complianceScore: 82, stage: "commissioning",
    targetDate: "2026-03-15",
    requirements: [
      { id: "g5-r1", category: "document", label: "Commissioning Test Report — PV", description: "Full PV string and inverter commissioning test results per IEC 62446-1", status: "pass", checkType: "automated", standardRef: "IEC 62446-1", linkedDocumentIds: ["doc-comm-pv"] },
      { id: "g5-r2", category: "document", label: "IV Curve Traces", description: "IV curve measurements for all PV strings", status: "pass", checkType: "automated", standardRef: "IEC 62446-1 §7.2", linkedDocumentIds: ["doc-iv-curves"] },
      { id: "g5-r3", category: "document", label: "Thermal Imaging Report", description: "IR thermography survey of all modules and connections", status: "pass", checkType: "ai_assisted", standardRef: "IEC 62446-3", aiConfidence: 0.92, linkedDocumentIds: ["doc-thermal"] },
      { id: "g5-r4", category: "document", label: "Insulation Resistance Tests", description: "Insulation resistance test results for all strings", status: "pass", checkType: "automated", linkedDocumentIds: ["doc-insulation"] },
      { id: "g5-r5", category: "document", label: "BESS Commissioning Report", description: "Full BESS charge/discharge cycling test results", status: "pass", checkType: "manual", standardRef: "IEC 62619", linkedDocumentIds: ["doc-bess-comm"] },
      { id: "g5-r6", category: "standard", label: "BESS Fire Safety Compliance", description: "NFPA 855 and UL 9540 compliance verification", status: "warning", checkType: "ai_assisted", standardRef: "NFPA 855 / UL 9540", aiConfidence: 0.78 },
      { id: "g5-r7", category: "data_quality", label: "Performance Ratio Validation", description: "PR within expected range for commissioning period", status: "pass", checkType: "automated", standardRef: "IEC 61724-1" },
      { id: "g5-r8", category: "data_quality", label: "BESS Round-Trip Efficiency", description: "RTE above 88% threshold per warranty terms", status: "fail", checkType: "automated" },
      { id: "g5-r9", category: "document", label: "As-Built Drawings", description: "Editable DWG/DXF as-built drawings per IEC 62446-1 §6.2", status: "fail", checkType: "automated", standardRef: "IEC 62446-1 §6.2", linkedDocumentIds: ["doc-asbuilt-sld", "doc-asbuilt-layout"] },
      { id: "g5-r10", category: "standard", label: "Grid Code Compliance", description: "Grid compliance testing per 50Hertz requirements and IEEE 2800", status: "pending", checkType: "manual", standardRef: "IEEE 2800" },
      { id: "g5-r11", category: "approval", label: "Grid Operator Witness", description: "50Hertz witnessed commissioning test sign-off", status: "pending", checkType: "manual" },
      { id: "g5-r12", category: "document", label: "Battery Passport Data", description: "EU Battery Regulation 2023/1542 passport data fields populated", status: "warning", checkType: "ai_assisted", standardRef: "EU 2023/1542", aiConfidence: 0.85 },
      { id: "g5-r13", category: "standard", label: "UN 38.3 Transport Certification", description: "Battery cell transport test certification verified", status: "pass", checkType: "automated", standardRef: "UN 38.3" },
      { id: "g5-r14", category: "document", label: "NCR Register", description: "All non-conformance reports documented and tracked", status: "pass", checkType: "manual", linkedDocumentIds: ["doc-ncr-1", "doc-ncr-2", "doc-ncr-3"] },
      { id: "g5-r15", category: "data_quality", label: "Data Completeness Check", description: "SCADA data completeness ≥99% for commissioning period", status: "pass", checkType: "automated" },
    ],
    approvals: [
      { stakeholderOrgId: "org-solaris", requiredRole: "execute", status: "approved", approverUserId: "user-erik", timestamp: "2026-02-25T09:00:00Z", comment: "All commissioning tests executed per ITP." },
      { stakeholderOrgId: "org-dnv", requiredRole: "witness", status: "approved", approverUserId: "user-priya", timestamp: "2026-02-26T14:00:00Z", comment: "Witnessed PV and BESS commissioning. Minor observations noted." },
      { stakeholderOrgId: "org-greenfield", requiredRole: "approve", status: "pending" },
      { stakeholderOrgId: "org-50hertz", requiredRole: "witness", status: "pending" },
      { stakeholderOrgId: "org-sma", requiredRole: "sign_off", status: "approved", approverUserId: "user-stefan", timestamp: "2026-02-24T11:00:00Z", comment: "SMA inverter commissioning parameters verified." },
      { stakeholderOrgId: "org-byd", requiredRole: "sign_off", status: "approved", approverUserId: "user-zhang", timestamp: "2026-02-25T15:00:00Z", comment: "BYD MC Cube commissioning completed. RTE issue under investigation." },
      { stakeholderOrgId: "org-techwind", requiredRole: "shadow", status: "approved", approverUserId: "user-chen", timestamp: "2026-02-26T10:00:00Z" },
    ],
  },
  {
    id: "gw-sonnenberg-g6", projectId: "proj-sonnenberg", code: "G6", name: "PAC",
    description: "Provisional Acceptance Certificate — plant meets minimum performance criteria.",
    status: "upcoming", complianceScore: 0, stage: "cod",
    targetDate: "2026-04-15",
    requirements: [], approvals: [],
  },
  {
    id: "gw-sonnenberg-g7", projectId: "proj-sonnenberg", code: "G7", name: "COD",
    description: "Commercial Operation Date — plant enters commercial operation.",
    status: "upcoming", complianceScore: 0, stage: "cod",
    targetDate: "2026-09-15",
    requirements: [], approvals: [],
  },
  {
    id: "gw-sonnenberg-g8", projectId: "proj-sonnenberg", code: "G8", name: "FAC",
    description: "Final Acceptance Certificate — performance test period completed, defects resolved.",
    status: "upcoming", complianceScore: 0, stage: "operations",
    targetDate: "2027-09-15",
    requirements: [], approvals: [],
  },
  {
    id: "gw-sonnenberg-g9", projectId: "proj-sonnenberg", code: "G9", name: "Warranty Expiry",
    description: "End of EPC warranty period, O&M transition complete.",
    status: "upcoming", complianceScore: 0, stage: "operations",
    targetDate: "2028-09-15",
    requirements: [], approvals: [],
  },
  {
    id: "gw-sonnenberg-g10", projectId: "proj-sonnenberg", code: "G10", name: "Decommissioning",
    description: "End-of-life planning, recycling compliance, site restoration.",
    status: "upcoming", complianceScore: 0, stage: "decommissioning",
    targetDate: "2051-09-15",
    requirements: [], approvals: [],
  },
];

// ─── Gateway scaffold definitions ─────────────────────────────────

const GATEWAY_DEFS: { code: string; name: string; description: string; stage: LifecycleStage }[] = [
  { code: "G0", name: "Site Identification", description: "Initial site screening, resource assessment, and preliminary feasibility.", stage: "feasibility" },
  { code: "G1", name: "Development Approval", description: "EIA, land rights, grid connection agreement, development permits.", stage: "development" },
  { code: "G2", name: "Financial Close", description: "Lender due diligence, PPA execution, financial model approval, insurance.", stage: "financing" },
  { code: "G3", name: "Design Freeze", description: "Detailed engineering complete, design drawings approved, procurement specs finalized.", stage: "engineering" },
  { code: "G4", name: "Cold Commissioning", description: "Equipment installed, FAT reports accepted, cold commissioning tests passed.", stage: "construction" },
  { code: "G5", name: "Hot Commissioning", description: "Energization, performance testing, grid compliance verification.", stage: "commissioning" },
  { code: "G6", name: "PAC", description: "Provisional Acceptance Certificate — plant meets minimum performance criteria.", stage: "cod" },
  { code: "G7", name: "COD", description: "Commercial Operation Date — plant enters commercial operation.", stage: "cod" },
  { code: "G8", name: "FAC", description: "Final Acceptance Certificate — performance test period completed, defects resolved.", stage: "operations" },
  { code: "G9", name: "Warranty Expiry", description: "End of EPC warranty period, O&M transition complete.", stage: "operations" },
  { code: "G10", name: "Decommissioning", description: "End-of-life planning, recycling compliance, site restoration.", stage: "decommissioning" },
];

function buildPassedGateway(
  projectSlug: string, projectId: string, gwIndex: number,
  completedDate: string, targetDate: string,
): Gateway {
  const def = GATEWAY_DEFS[gwIndex];
  return {
    id: `gw-${projectSlug}-g${gwIndex}`, projectId, code: def.code, name: def.name,
    description: def.description, status: "passed", complianceScore: 100, stage: def.stage,
    completedDate, targetDate,
    requirements: [
      { id: `${projectSlug}-g${gwIndex}-r1`, category: "document", label: `${def.name} Documentation`, description: `All ${def.name.toLowerCase()} documentation complete`, status: "pass", checkType: "manual" },
      { id: `${projectSlug}-g${gwIndex}-r2`, category: "approval", label: `${def.name} Approvals`, description: `All required approvals obtained for ${def.name.toLowerCase()}`, status: "pass", checkType: "manual" },
    ],
    approvals: [
      { stakeholderOrgId: "org-greenfield", requiredRole: "approve", status: "approved", approverUserId: "user-thomas", timestamp: `${completedDate}T10:00:00Z` },
    ],
  };
}

function buildUpcomingGateway(
  projectSlug: string, projectId: string, gwIndex: number, targetDate: string,
): Gateway {
  const def = GATEWAY_DEFS[gwIndex];
  return {
    id: `gw-${projectSlug}-g${gwIndex}`, projectId, code: def.code, name: def.name,
    description: def.description, status: "upcoming", complianceScore: 0, stage: def.stage,
    targetDate, requirements: [], approvals: [],
  };
}

// ─── Algarve Sun Farm (PV, G8 current, operations) ───────────────

const algarveGateways: Gateway[] = [
  buildPassedGateway("algarve", "proj-algarve", 0, "2022-06-15", "2022-06-15"),
  buildPassedGateway("algarve", "proj-algarve", 1, "2022-11-20", "2022-12-01"),
  buildPassedGateway("algarve", "proj-algarve", 2, "2023-04-10", "2023-04-15"),
  buildPassedGateway("algarve", "proj-algarve", 3, "2023-09-01", "2023-08-31"),
  buildPassedGateway("algarve", "proj-algarve", 4, "2024-05-20", "2024-06-01"),
  buildPassedGateway("algarve", "proj-algarve", 5, "2024-09-10", "2024-09-15"),
  buildPassedGateway("algarve", "proj-algarve", 6, "2024-11-01", "2024-11-15"),
  buildPassedGateway("algarve", "proj-algarve", 7, "2025-03-01", "2025-03-01"),
  // G8 — current gateway (FAC, in_review)
  {
    id: "gw-algarve-g8", projectId: "proj-algarve", code: "G8", name: "FAC",
    description: "Final Acceptance Certificate — performance test period completed, defects resolved.",
    status: "in_review", complianceScore: 94, stage: "operations",
    targetDate: "2026-03-15",
    requirements: [
      { id: "alg-g8-r1", category: "document", label: "12-Month Performance Report", description: "Full annual performance report per IEC 61724-1", status: "pass", checkType: "automated", standardRef: "IEC 61724-1" },
      { id: "alg-g8-r2", category: "data_quality", label: "Performance Ratio Validation", description: "Annual PR above 81% guarantee threshold", status: "pass", checkType: "automated", standardRef: "IEC 61724-1" },
      { id: "alg-g8-r3", category: "document", label: "Defects Liability List", description: "All EPC defects documented and remediated", status: "pass", checkType: "manual" },
      { id: "alg-g8-r4", category: "document", label: "O&M Performance Report", description: "O&M contractor KPI report for warranty period", status: "pass", checkType: "manual" },
      { id: "alg-g8-r5", category: "standard", label: "Grid Code Compliance (12-month)", description: "Continuous grid compliance per REN requirements", status: "pass", checkType: "automated", standardRef: "REN Grid Code" },
      { id: "alg-g8-r6", category: "document", label: "Inverter Warranty Confirmation", description: "All inverter warranty claims settled", status: "pass", checkType: "manual" },
      { id: "alg-g8-r7", category: "data_quality", label: "Availability above 99%", description: "Plant technical availability above 99% target", status: "pass", checkType: "automated" },
      { id: "alg-g8-r8", category: "document", label: "Final As-Built Documentation", description: "Complete as-built documentation package delivered", status: "warning", checkType: "manual" },
      { id: "alg-g8-r9", category: "document", label: "Spare Parts Inventory", description: "Spare parts inventory transferred to O&M", status: "pass", checkType: "manual" },
      { id: "alg-g8-r10", category: "approval", label: "Lender Technical Advisor Sign-off", description: "DNV lender TA final acceptance report", status: "pending", checkType: "manual" },
    ],
    approvals: [
      { stakeholderOrgId: "org-solaris", requiredRole: "execute", status: "approved", approverUserId: "user-erik", timestamp: "2026-02-20T09:00:00Z" },
      { stakeholderOrgId: "org-dnv", requiredRole: "review", status: "pending" },
      { stakeholderOrgId: "org-greenfield", requiredRole: "approve", status: "pending" },
    ],
  },
  buildUpcomingGateway("algarve", "proj-algarve", 9, "2027-03-01"),
  buildUpcomingGateway("algarve", "proj-algarve", 10, "2049-03-01"),
];

// ─── Yorkshire Storage (BESS, G2 current, financing, blocked) ────

const yorkshireGateways: Gateway[] = [
  buildPassedGateway("yorkshire", "proj-yorkshire", 0, "2025-03-10", "2025-03-15"),
  buildPassedGateway("yorkshire", "proj-yorkshire", 1, "2025-09-20", "2025-10-01"),
  // G2 — current gateway (Financial Close, blocked)
  {
    id: "gw-yorkshire-g2", projectId: "proj-yorkshire", code: "G2", name: "Financial Close",
    description: "Lender due diligence, PPA execution, financial model approval, insurance placement.",
    status: "blocked", complianceScore: 71, stage: "financing",
    targetDate: "2026-04-15",
    requirements: [
      { id: "yk-g2-r1", category: "document", label: "Financial Model", description: "Approved financial model with sensitivity analysis", status: "pass", checkType: "manual" },
      { id: "yk-g2-r2", category: "document", label: "Lender Term Sheet", description: "Signed term sheet from project finance lender", status: "pass", checkType: "manual" },
      { id: "yk-g2-r3", category: "document", label: "IE Report (BESS)", description: "Independent Engineer technical due diligence for BESS", status: "warning", checkType: "manual", standardRef: "DNV-RP-0043" },
      { id: "yk-g2-r4", category: "document", label: "Revenue Contract", description: "Tolling agreement or merchant revenue forecast", status: "fail", checkType: "manual" },
      { id: "yk-g2-r5", category: "standard", label: "BESS Safety Assessment", description: "Pre-investment BESS safety risk assessment per NFPA 855", status: "warning", checkType: "ai_assisted", standardRef: "NFPA 855", aiConfidence: 0.81 },
      { id: "yk-g2-r6", category: "document", label: "Insurance Quotation", description: "All-risk insurance quotation for BESS project", status: "fail", checkType: "manual" },
      { id: "yk-g2-r7", category: "document", label: "Grid Pre-Assessment", description: "National Grid ESO connection pre-assessment", status: "pending", checkType: "manual", standardRef: "NGESO Grid Code" },
      { id: "yk-g2-r8", category: "approval", label: "Planning Consent", description: "Local planning authority consent obtained", status: "pass", checkType: "manual" },
      { id: "yk-g2-r9", category: "document", label: "EPC Contract (Draft)", description: "Draft EPC contract with BESS scope", status: "pass", checkType: "manual" },
      { id: "yk-g2-r10", category: "standard", label: "UK Grid Code Compliance", description: "Compliance path for GC0137 and ECP-11-0019", status: "pending", checkType: "manual", standardRef: "GC0137" },
    ],
    approvals: [
      { stakeholderOrgId: "org-greenfield", requiredRole: "approve", status: "pending" },
      { stakeholderOrgId: "org-eib", requiredRole: "approve", status: "pending" },
      { stakeholderOrgId: "org-dnv", requiredRole: "review", status: "pending" },
    ],
  },
  buildUpcomingGateway("yorkshire", "proj-yorkshire", 3, "2026-08-01"),
  buildUpcomingGateway("yorkshire", "proj-yorkshire", 4, "2027-01-15"),
  buildUpcomingGateway("yorkshire", "proj-yorkshire", 5, "2027-04-01"),
  buildUpcomingGateway("yorkshire", "proj-yorkshire", 6, "2027-05-01"),
  buildUpcomingGateway("yorkshire", "proj-yorkshire", 7, "2027-06-01"),
  buildUpcomingGateway("yorkshire", "proj-yorkshire", 8, "2028-06-01"),
  buildUpcomingGateway("yorkshire", "proj-yorkshire", 9, "2029-06-01"),
  buildUpcomingGateway("yorkshire", "proj-yorkshire", 10, "2052-06-01"),
];

// ─── Atacama Hybrid (hybrid, G4 current, construction) ───────────

const atacamaGateways: Gateway[] = [
  buildPassedGateway("atacama", "proj-atacama", 0, "2024-01-15", "2024-01-15"),
  buildPassedGateway("atacama", "proj-atacama", 1, "2024-06-20", "2024-07-01"),
  buildPassedGateway("atacama", "proj-atacama", 2, "2024-11-10", "2024-11-15"),
  buildPassedGateway("atacama", "proj-atacama", 3, "2025-05-01", "2025-04-30"),
  // G4 — current gateway (Cold Commissioning, in_review)
  {
    id: "gw-atacama-g4", projectId: "proj-atacama", code: "G4", name: "Cold Commissioning",
    description: "Equipment installation complete, FAT reports accepted, cold commissioning tests passed.",
    status: "in_review", complianceScore: 58, stage: "construction",
    targetDate: "2026-06-15",
    requirements: [
      { id: "atc-g4-r1", category: "document", label: "FAT Reports — PV Modules", description: "JinkoSolar module FAT reports for all batches", status: "pass", checkType: "automated", standardRef: "IEC 61215" },
      { id: "atc-g4-r2", category: "document", label: "FAT Reports — Inverters", description: "Central inverter FAT reports", status: "pass", checkType: "automated", standardRef: "IEC 62109-1" },
      { id: "atc-g4-r3", category: "document", label: "FAT Reports — BESS", description: "BESS system FAT and safety reports", status: "warning", checkType: "manual" },
      { id: "atc-g4-r4", category: "standard", label: "UL 9540A Testing", description: "Cell-level thermal runaway test results", status: "pending", checkType: "manual", standardRef: "UL 9540A" },
      { id: "atc-g4-r5", category: "document", label: "ITP Sign-off", description: "Inspection and Test Plan — 72% executed", status: "warning", checkType: "manual" },
      { id: "atc-g4-r6", category: "data_quality", label: "SCADA Integration", description: "SCADA signal verification and data logging", status: "fail", checkType: "automated" },
      { id: "atc-g4-r7", category: "document", label: "Construction Progress Report", description: "Monthly construction progress report", status: "pass", checkType: "manual" },
      { id: "atc-g4-r8", category: "document", label: "Material Certificates", description: "Mill certificates for structural steel and cables", status: "pass", checkType: "manual" },
      { id: "atc-g4-r9", category: "standard", label: "Chilean Grid Code Compliance", description: "NTSyCS compliance path verification", status: "fail", checkType: "manual", standardRef: "NTSyCS" },
      { id: "atc-g4-r10", category: "approval", label: "SEC Environmental Approval", description: "Environmental monitoring plan approved by SEC", status: "pending", checkType: "manual" },
      { id: "atc-g4-r11", category: "document", label: "NCR Register", description: "Non-conformance reports tracked and current", status: "warning", checkType: "manual" },
      { id: "atc-g4-r12", category: "document", label: "Labor & Safety Permits", description: "SERNAGEOMIN and local labor permits valid", status: "fail", checkType: "manual" },
    ],
    approvals: [
      { stakeholderOrgId: "org-solaris", requiredRole: "execute", status: "approved", approverUserId: "user-erik", timestamp: "2026-02-15T09:00:00Z" },
      { stakeholderOrgId: "org-dnv", requiredRole: "witness", status: "pending" },
      { stakeholderOrgId: "org-greenfield", requiredRole: "approve", status: "pending" },
      { stakeholderOrgId: "org-jinko", requiredRole: "sign_off", status: "approved", approverUserId: "user-zhang", timestamp: "2026-02-10T08:00:00Z" },
    ],
  },
  buildUpcomingGateway("atacama", "proj-atacama", 5, "2027-02-01"),
  buildUpcomingGateway("atacama", "proj-atacama", 6, "2027-06-01"),
  buildUpcomingGateway("atacama", "proj-atacama", 7, "2027-12-01"),
  buildUpcomingGateway("atacama", "proj-atacama", 8, "2028-12-01"),
  buildUpcomingGateway("atacama", "proj-atacama", 9, "2029-12-01"),
  buildUpcomingGateway("atacama", "proj-atacama", 10, "2052-12-01"),
];

// ─── Al Dhafra Extension (PV, G1 current, development) ───────────

const aldhafraGateways: Gateway[] = [
  buildPassedGateway("aldhafra", "proj-aldhafra", 0, "2025-08-10", "2025-08-15"),
  // G1 — current gateway (Development Approval, in_review)
  {
    id: "gw-aldhafra-g1", projectId: "proj-aldhafra", code: "G1", name: "Development Approval",
    description: "EIA, land rights, grid connection agreement, development permits.",
    status: "in_review", complianceScore: 65, stage: "development",
    targetDate: "2026-06-01",
    requirements: [
      { id: "adh-g1-r1", category: "document", label: "EIA Report", description: "Environmental Impact Assessment per UAE EAD requirements", status: "warning", checkType: "manual" },
      { id: "adh-g1-r2", category: "document", label: "Land Concession Agreement", description: "Abu Dhabi government land concession", status: "pass", checkType: "manual" },
      { id: "adh-g1-r3", category: "document", label: "Grid Connection Study", description: "TRANSCO grid connection feasibility study", status: "pending", checkType: "manual" },
      { id: "adh-g1-r4", category: "standard", label: "ADWEA Technical Requirements", description: "Compliance with ADWEA/EWEC technical requirements", status: "pass", checkType: "manual", standardRef: "EWEC Technical Req." },
      { id: "adh-g1-r5", category: "document", label: "Solar Resource Assessment", description: "High-resolution DNI/GHI data from on-site station", status: "pass", checkType: "automated" },
      { id: "adh-g1-r6", category: "approval", label: "EAD Environmental Clearance", description: "Environmental clearance from Environment Agency Abu Dhabi", status: "pending", checkType: "manual" },
      { id: "adh-g1-r7", category: "document", label: "Preliminary Design Report", description: "Conceptual design and technology selection", status: "pass", checkType: "manual" },
      { id: "adh-g1-r8", category: "standard", label: "IEC 62548-1 Pre-assessment", description: "Preliminary PV array design compliance check", status: "warning", checkType: "ai_assisted", standardRef: "IEC 62548-1", aiConfidence: 0.73 },
      { id: "adh-g1-r9", category: "document", label: "Stakeholder Engagement Plan", description: "Community and stakeholder engagement documentation", status: "fail", checkType: "manual" },
      { id: "adh-g1-r10", category: "approval", label: "CNIA Security Clearance", description: "Critical national infrastructure security clearance", status: "pending", checkType: "manual" },
    ],
    approvals: [
      { stakeholderOrgId: "org-greenfield", requiredRole: "approve", status: "pending" },
      { stakeholderOrgId: "org-dnv", requiredRole: "review", status: "pending" },
    ],
  },
  buildUpcomingGateway("aldhafra", "proj-aldhafra", 2, "2026-12-01"),
  buildUpcomingGateway("aldhafra", "proj-aldhafra", 3, "2027-04-01"),
  buildUpcomingGateway("aldhafra", "proj-aldhafra", 4, "2027-10-01"),
  buildUpcomingGateway("aldhafra", "proj-aldhafra", 5, "2028-01-15"),
  buildUpcomingGateway("aldhafra", "proj-aldhafra", 6, "2028-02-15"),
  buildUpcomingGateway("aldhafra", "proj-aldhafra", 7, "2028-03-15"),
  buildUpcomingGateway("aldhafra", "proj-aldhafra", 8, "2029-03-15"),
  buildUpcomingGateway("aldhafra", "proj-aldhafra", 9, "2030-03-15"),
  buildUpcomingGateway("aldhafra", "proj-aldhafra", 10, "2053-03-15"),
];

// ─── Sunridge Solar + Storage (hybrid, G3 current, engineering) ──

const sunridgeGateways: Gateway[] = [
  buildPassedGateway("sunridge", "proj-sunridge", 0, "2025-02-15", "2025-02-15"),
  buildPassedGateway("sunridge", "proj-sunridge", 1, "2025-07-10", "2025-07-15"),
  buildPassedGateway("sunridge", "proj-sunridge", 2, "2025-11-20", "2025-11-30"),
  // G3 — current gateway (Design Freeze, in_review)
  {
    id: "gw-sunridge-g3", projectId: "proj-sunridge", code: "G3", name: "Design Freeze",
    description: "Detailed engineering complete, design drawings approved, procurement specifications finalized.",
    status: "in_review", complianceScore: 72, stage: "engineering",
    targetDate: "2026-04-15",
    requirements: [
      { id: "sun-g3-r1", category: "document", label: "Single Line Diagram", description: "Approved SLD per IEC 62548-1", status: "pass", checkType: "automated", standardRef: "IEC 62548-1" },
      { id: "sun-g3-r2", category: "document", label: "Design Drawings Package", description: "Complete design drawings set", status: "pass", checkType: "manual" },
      { id: "sun-g3-r3", category: "document", label: "Structural Calculations", description: "Foundation and mounting structure calculations", status: "pass", checkType: "manual" },
      { id: "sun-g3-r4", category: "standard", label: "IEC 62548-1 Compliance", description: "PV array design per IEC 62548-1", status: "pass", checkType: "ai_assisted", standardRef: "IEC 62548-1", aiConfidence: 0.93 },
      { id: "sun-g3-r5", category: "document", label: "FEOC Compliance Package", description: "FEOC cost-origin analysis with supplier certifications per OBBBA final rule", status: "warning", checkType: "manual", standardRef: "OBBBA FEOC" },
      { id: "sun-g3-r6", category: "standard", label: "BESS Mineral Traceability", description: "Cell-level lithium and graphite traceability per UFLPA requirements", status: "fail", checkType: "manual", standardRef: "UFLPA" },
      { id: "sun-g3-r7", category: "standard", label: "ANSI/SEIA 101 Module Traceability", description: "Polysilicon supply chain traceability per ANSI/SEIA 101", status: "pending", checkType: "manual", standardRef: "ANSI/SEIA 101" },
      { id: "sun-g3-r8", category: "document", label: "Cable Schedule", description: "Complete cable schedule and sizing calculations", status: "pass", checkType: "manual" },
      { id: "sun-g3-r9", category: "standard", label: "UL 9540A Pre-Assessment", description: "BESS thermal runaway test methodology review", status: "pass", checkType: "manual", standardRef: "UL 9540A" },
      { id: "sun-g3-r10", category: "standard", label: "NFPA 855 Design Compliance", description: "BESS fire safety design review", status: "pass", checkType: "ai_assisted", standardRef: "NFPA 855", aiConfidence: 0.88 },
      { id: "sun-g3-r11", category: "approval", label: "ERCOT Interconnection Study", description: "ERCOT interconnection agreement and study completion", status: "pending", checkType: "manual" },
    ],
    approvals: [
      { stakeholderOrgId: "org-blueoak-construction", requiredRole: "execute", status: "approved", approverUserId: "user-derek", timestamp: "2026-02-20T09:00:00Z" },
      { stakeholderOrgId: "org-dnv", requiredRole: "review", status: "pending" },
      { stakeholderOrgId: "org-sunridge-energy", requiredRole: "approve", status: "pending" },
      { stakeholderOrgId: "org-jpmorgan-energy", requiredRole: "review", status: "pending" },
    ],
  },
  buildUpcomingGateway("sunridge", "proj-sunridge", 4, "2026-10-01"),
  buildUpcomingGateway("sunridge", "proj-sunridge", 5, "2027-03-01"),
  buildUpcomingGateway("sunridge", "proj-sunridge", 6, "2027-05-01"),
  buildUpcomingGateway("sunridge", "proj-sunridge", 7, "2027-09-15"),
  buildUpcomingGateway("sunridge", "proj-sunridge", 8, "2028-09-15"),
  buildUpcomingGateway("sunridge", "proj-sunridge", 9, "2029-09-15"),
  buildUpcomingGateway("sunridge", "proj-sunridge", 10, "2052-09-15"),
];

// ─── Combined export ─────────────────────────────────────────────

export const gateways: Gateway[] = [
  ...sonnenbergGateways,
  ...algarveGateways,
  ...yorkshireGateways,
  ...atacamaGateways,
  ...aldhafraGateways,
  ...sunridgeGateways,
];

export function getGatewaysForProject(projectId: string): Gateway[] {
  return gateways.filter((g) => g.projectId === projectId);
}
