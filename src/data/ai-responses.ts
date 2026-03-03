import { AIMessage } from "@/lib/types";

interface AIResponseEntry {
  keywords: string[];
  response: AIMessage;
}

export const aiGreeting: AIMessage = {
  id: "ai-greeting",
  role: "assistant",
  content: `Welcome to the SolarComply AI Assistant. I'm here to help with compliance, standards, and documentation queries for the **Sonnenberg Solar + Storage** project.

**Project snapshot:**
- 100 MW PV + 50 MW / 100 MWh BESS hybrid
- Currently at **Gateway G5 — Hot Commissioning** (82% compliance)
- 2 failed requirements, 2 pending approvals
- 3 active critical alerts

How can I help you today? You can ask about standards compliance, documentation status, performance analysis, or regulatory requirements.`,
  timestamp: new Date().toISOString(),
};

export const aiResponses: AIResponseEntry[] = [
  {
    keywords: ["fire", "safety", "bess", "nfpa", "battery fire"],
    response: {
      id: "ai-fire-safety",
      role: "assistant",
      content: `Here are the fire safety standards applicable to the BESS component of **Sonnenberg Solar + Storage** in Germany:`,
      standards: [
        { id: "std-nfpa855", body: "NFPA", number: "855", edition: "2023", title: "Standard for the Installation of Stationary Energy Storage Systems", scope: "Installation, commissioning, operation and maintenance of ESS", applicableGateways: ["G3", "G4", "G5"], jurisdictions: ["US"], projectTypes: ["bess", "hybrid"] },
        { id: "std-ul9540", body: "UL", number: "9540", edition: "Ed 3.0, 2023", title: "Energy Storage Systems and Equipment", scope: "Safety for ESS including fire, electrical, and mechanical hazards", applicableGateways: ["G3", "G4", "G5"], jurisdictions: [], projectTypes: ["bess", "hybrid"] },
        { id: "std-ul9540a", body: "UL", number: "9540A", edition: "Ed 5.0, 2023", title: "Test Method for Evaluating Thermal Runaway Fire Propagation in Battery Energy Storage Systems", scope: "Cell, module, unit, and installation-level thermal runaway testing", applicableGateways: ["G4", "G5"], jurisdictions: [], projectTypes: ["bess", "hybrid"] },
        { id: "std-iec62933", body: "IEC", number: "62933-5-2", edition: "Ed 1.0, 2020", title: "Electrical Energy Storage Systems — Safety Requirements", scope: "Safety of grid-connected EES systems", applicableGateways: ["G3", "G4", "G5"], jurisdictions: [], projectTypes: ["bess", "hybrid"] },
      ],
      gapItems: [
        { standard: "NFPA 855", requirement: "Fire suppression system design review", status: "pass", action: "Completed — clean agent system installed" },
        { standard: "UL 9540", requirement: "System-level safety certification", status: "warning", action: "Certification pending — expected by March 15" },
        { standard: "UL 9540A", requirement: "Cell-level thermal runaway testing", status: "pass", action: "BYD MC Cube passed Ed 5.0 testing" },
        { standard: "UL 9540A", requirement: "Installation-level fire propagation test", status: "warning", action: "Report under review by DNV" },
        { standard: "IEC 62933-5-2", requirement: "Electrical safety compliance", status: "pass", action: "Verified during cold commissioning" },
        { standard: "BVES Guidelines", requirement: "German-specific BESS safety requirements", status: "pass", action: "Compliance confirmed by TÜV assessment" },
      ],
      timestamp: new Date().toISOString(),
    },
  },
  {
    keywords: ["pac", "commissioning", "documentation", "complete", "provisional acceptance"],
    response: {
      id: "ai-pac-docs",
      role: "assistant",
      content: `Here's the **PAC documentation completeness assessment** for Sonnenberg against IEC 62446-1 requirements:

**Overall: 11 of 14 requirements met (79%)**

The following gaps must be addressed before PAC:`,
      gapItems: [
        { standard: "IEC 62446-1", requirement: "Commissioning test report — PV", status: "pass", action: "Completed and approved" },
        { standard: "IEC 62446-1 §7.2", requirement: "IV curve traces for all strings", status: "pass", action: "All 1,240 strings measured" },
        { standard: "IEC 62446-3", requirement: "Thermal imaging report", status: "pass", action: "IR survey completed, 3 hotspots identified and remediated" },
        { standard: "IEC 62446-1", requirement: "Insulation resistance tests", status: "pass", action: "All strings above 40 MΩ threshold" },
        { standard: "IEC 62619", requirement: "BESS commissioning report", status: "pass", action: "Charge/discharge cycling completed" },
        { standard: "IEC 62446-1 §6.2", requirement: "As-built drawings (editable DWG/DXF)", status: "fail", action: "3 drawings uploaded as PDF only — editable formats required" },
        { standard: "IEC 61724-1", requirement: "Performance monitoring system validation", status: "pass", action: "SCADA data quality verified" },
        { standard: "N/A", requirement: "BESS round-trip efficiency above 88%", status: "fail", action: "Currently at 87.3% — BYD investigating root cause" },
        { standard: "IEEE 2800", requirement: "Grid code compliance test results", status: "pending", action: "Testing scheduled for March 8-10" },
        { standard: "50Hertz", requirement: "Grid operator witnessed commissioning sign-off", status: "pending", action: "50Hertz visit pending — overdue by 12 days" },
        { standard: "EU 2023/1542", requirement: "Battery passport data population", status: "warning", action: "15 of 22 required data fields populated" },
        { standard: "N/A", requirement: "NCR register complete and current", status: "pass", action: "7 NCRs raised, 5 closed, 2 in remediation" },
        { standard: "N/A", requirement: "O&M manual handover", status: "pass", action: "Draft received from EPC" },
        { standard: "N/A", requirement: "Warranty certificates from all OEMs", status: "pass", action: "JinkoSolar, SMA, and BYD certificates on file" },
      ],
      timestamp: new Date().toISOString(),
    },
  },
  {
    keywords: ["battery passport", "eu regulation", "2023/1542", "passport"],
    response: {
      id: "ai-battery-passport",
      role: "assistant",
      content: `**EU Battery Regulation (2023/1542) — Battery Passport Readiness Assessment**

The EU Battery Regulation requires a digital "battery passport" for all industrial batteries (>2 kWh) placed on the EU market from **February 2027**.

**Sonnenberg BESS: BYD MC Cube — 50 MW / 100 MWh**

**Timeline:**
- Feb 2025: Regulation entered into force
- Aug 2025: Carbon footprint declaration required
- Feb 2027: Full battery passport required
- Our COD target: Sep 2026 (passport data should be ready)

**Data Field Readiness: 15 of 22 required fields populated (68%)**`,
      gapItems: [
        { standard: "EU 2023/1542 Art. 77", requirement: "Manufacturer identification & contact", status: "pass", action: "BYD Company Ltd. details on file" },
        { standard: "EU 2023/1542 Art. 77", requirement: "Battery model & batch identification", status: "pass", action: "MC Cube T2-100 batch data recorded" },
        { standard: "EU 2023/1542 Art. 77", requirement: "Manufacturing date & location", status: "pass", action: "Shenzhen facility, Oct 2025" },
        { standard: "EU 2023/1542 Art. 77", requirement: "Battery chemistry & materials", status: "pass", action: "LFP (LiFePO4) — documented" },
        { standard: "EU 2023/1542 Art. 77", requirement: "Rated capacity & voltage", status: "pass", action: "100 MWh / 800V DC" },
        { standard: "EU 2023/1542 Art. 77", requirement: "Carbon footprint declaration", status: "warning", action: "BYD calculating — due by Aug 2026" },
        { standard: "EU 2023/1542 Art. 77", requirement: "Recycled content share", status: "pending", action: "Data requested from BYD supply chain" },
        { standard: "EU 2023/1542 Art. 77", requirement: "Expected battery lifetime", status: "pass", action: "15 years / 6,000 cycles warranted" },
        { standard: "EU 2023/1542 Art. 77", requirement: "State of Health tracking methodology", status: "pass", action: "BMS SoH algorithm documented" },
        { standard: "EU 2023/1542 Art. 77", requirement: "Collection & recycling information", status: "pending", action: "End-of-life plan not yet developed" },
        { standard: "EU 2023/1542 Art. 77", requirement: "Due diligence — supply chain", status: "pending", action: "BYD cobalt-free (LFP) but full due diligence pending" },
        { standard: "EU 2023/1542 Art. 77", requirement: "QR code / digital passport link", status: "pending", action: "Awaiting EU passport platform launch" },
      ],
      timestamp: new Date().toISOString(),
    },
  },
  {
    keywords: ["non-conformance", "ncr", "hot commissioning", "defect"],
    response: {
      id: "ai-ncrs",
      role: "assistant",
      content: `**Non-Conformance Reports — Hot Commissioning Phase (G5)**

**Summary: 7 NCRs raised | 5 closed | 2 in remediation**`,
      gapItems: [
        { standard: "NCR-001", requirement: "Tracker motor failure — String B7", status: "pass", action: "Motor replaced, retested — Closed 15 Feb" },
        { standard: "NCR-002", requirement: "IV curve anomaly — String A12 (2 modules low Voc)", status: "pass", action: "Modules replaced from spare stock — Closed 18 Feb" },
        { standard: "NCR-003", requirement: "Grounding resistance above threshold — Inverter Station 3", status: "pass", action: "Additional ground rods installed — Closed 20 Feb" },
        { standard: "NCR-004", requirement: "BESS container ventilation fan vibration", status: "pass", action: "Fan bearing replaced — Closed 22 Feb" },
        { standard: "NCR-005", requirement: "Cable tray support spacing exceeds spec — Area C", status: "pass", action: "Additional supports installed — Closed 25 Feb" },
        { standard: "NCR-006", requirement: "BESS RTE below 88% during cycling tests", status: "fail", action: "BYD investigating — suspected BMS calibration issue. Target resolution: 10 Mar" },
        { standard: "NCR-007", requirement: "Inverter communication fault — SMA Station 2 to SCADA", status: "warning", action: "Firmware update applied, monitoring for recurrence. Remediation deadline exceeded by 5 days" },
      ],
      timestamp: new Date().toISOString(),
    },
  },
  {
    keywords: ["performance ratio", "pr", "guarantee", "trend", "forecast", "breach"],
    response: {
      id: "ai-pr-trend",
      role: "assistant",
      content: `**Performance Ratio Trend Analysis — Sonnenberg Solar + Storage**

**Current Status:**
- 7-day average PR: **79.1%**
- 30-day average PR: **80.3%**
- Guarantee threshold: **78.0%**
- Current margin: **1.1 percentage points** (7-day) / **2.3 pp** (30-day)

**Trend Analysis:**
The 7-day PR shows a declining trend of approximately **-0.15 pp/week** over the last 4 weeks. This is partly attributable to:
1. Seasonal irradiance reduction (winter → spring transition, low solar angles)
2. Soiling accumulation — last cleaning was 6 weeks ago
3. Two tracker strings (B7, C3) operating in fixed-tilt mode pending motor repair

**Projected Guarantee Breach:**
At the current rate of decline, the 30-day rolling average is projected to breach the 78% guarantee threshold in approximately **8 weeks (late April 2026)**.

**Recommended Actions:**
- Schedule panel cleaning — expected PR improvement of +0.5-1.0 pp
- Prioritize tracker motor repairs for strings B7 and C3
- Review inverter clipping losses at Stations 2 and 5
- Consider temporary PR exclusion for the 2 fixed-tilt strings per PPA provisions

**Note:** This analysis uses commissioning-period data only. Long-term PR baseline will be established after 12 months of operation per IEC 61724-1.`,
      timestamp: new Date().toISOString(),
    },
  },
];

export function findAIResponse(query: string): AIMessage | null {
  const lower = query.toLowerCase();
  for (const entry of aiResponses) {
    const matched = entry.keywords.some((kw) => lower.includes(kw));
    if (matched) return { ...entry.response, id: `ai-${Date.now()}`, timestamp: new Date().toISOString() };
  }
  return null;
}

export const fallbackResponse: AIMessage = {
  id: "ai-fallback",
  role: "assistant",
  content: `I can help with standards compliance, documentation review, and performance analysis for the Sonnenberg project. Try asking about:

- **Fire safety standards** for the BESS
- **PAC documentation completeness**
- **EU Battery Passport** requirements and readiness
- **Non-conformance reports** from hot commissioning
- **Performance ratio** trend analysis and guarantee threshold

What would you like to know?`,
  timestamp: new Date().toISOString(),
};
