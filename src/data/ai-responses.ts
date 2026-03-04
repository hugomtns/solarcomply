import { AIMessage } from "@/lib/types";
import { projects } from "@/data/projects";

interface AIResponseEntry {
  keywords: string[];
  projectId?: string; // if set, only matches for this project
  response: AIMessage;
}

// ─── Project-aware greeting ───────────────────────────────────────

export function getAiGreeting(projectId?: string): AIMessage {
  const project = projects.find((p) => p.id === projectId);
  if (!project) {
    return {
      id: "ai-greeting",
      role: "assistant",
      content: `Welcome to the SolarComply AI Assistant. Select a project to get started with compliance, standards, and documentation queries.`,
      timestamp: new Date().toISOString(),
    };
  }

  const typeLabel = project.type === "pv" ? "Solar PV" : project.type === "bess" ? "BESS" : "Hybrid (PV + BESS)";
  const gwCode = project.currentGatewayId.replace(/^gw-\w+-/, "").toUpperCase();

  return {
    id: "ai-greeting",
    role: "assistant",
    content: `Welcome to the SolarComply AI Assistant. I'm here to help with compliance, standards, and documentation queries for **${project.name}**.

**Project snapshot:**
- ${project.capacityMW} MW ${typeLabel}${project.capacityMWh ? ` / ${project.capacityMWh} MWh` : ""} in ${project.location.region}, ${project.location.country}
- Currently at **Gateway ${gwCode}** (${project.complianceScore}% compliance)
- Stage: ${project.currentStage}

How can I help you today? You can ask about standards compliance, documentation status, performance analysis, or regulatory requirements.`,
    timestamp: new Date().toISOString(),
  };
}

// Backward-compatible export
export const aiGreeting: AIMessage = getAiGreeting("proj-sonnenberg");

// ─── Project-aware fallback ───────────────────────────────────────

export function getFallbackResponse(projectId?: string): AIMessage {
  const project = projects.find((p) => p.id === projectId);
  const name = project?.name ?? "your project";

  return {
    id: "ai-fallback",
    role: "assistant",
    content: `I can help with standards compliance, documentation review, and performance analysis for ${name}. Try asking about:

- **Applicable standards** and compliance requirements
- **Documentation status** and gap analysis
- **Gateway progress** and pending approvals
- **Regulatory requirements** for your jurisdiction

What would you like to know?`,
    timestamp: new Date().toISOString(),
  };
}

// Backward-compatible export
export const fallbackResponse: AIMessage = getFallbackResponse("proj-sonnenberg");

// ─── Responses (global + project-specific) ────────────────────────

export const aiResponses: AIResponseEntry[] = [
  // ── Sonnenberg-specific responses (existing) ────────────────────
  {
    keywords: ["fire", "safety", "bess", "nfpa", "battery fire"],
    projectId: "proj-sonnenberg",
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
    projectId: "proj-sonnenberg",
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
    projectId: "proj-sonnenberg",
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
    projectId: "proj-sonnenberg",
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
    projectId: "proj-sonnenberg",
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

  // ── Algarve-specific responses ──────────────────────────────────
  {
    keywords: ["fac", "final acceptance", "defects", "warranty period"],
    projectId: "proj-algarve",
    response: {
      id: "ai-algarve-fac",
      role: "assistant",
      content: `**FAC Readiness Assessment — Algarve Sun Farm**

**Overall: 9 of 10 requirements met (90%)**

The project has completed its 12-month performance test period with strong results. One item remains outstanding:`,
      gapItems: [
        { standard: "IEC 61724-1", requirement: "12-month performance report", status: "pass", action: "Annual PR of 83.2% — above 81% guarantee" },
        { standard: "N/A", requirement: "Defects liability register cleared", status: "pass", action: "All 14 defects remediated and signed off" },
        { standard: "N/A", requirement: "O&M KPI targets met", status: "pass", action: "Availability 99.3%, response time within SLA" },
        { standard: "REN Grid Code", requirement: "Continuous grid compliance", status: "pass", action: "Zero grid code violations in 12 months" },
        { standard: "N/A", requirement: "Spare parts inventory handover", status: "warning", action: "Inventory list pending final reconciliation" },
        { standard: "N/A", requirement: "DNV lender TA final report", status: "pending", action: "Report overdue by 8 days — blocking FAC" },
      ],
      timestamp: new Date().toISOString(),
    },
  },
  {
    keywords: ["performance", "availability", "production", "yield"],
    projectId: "proj-algarve",
    response: {
      id: "ai-algarve-perf",
      role: "assistant",
      content: `**Performance Summary — Algarve Sun Farm (Year 1)**

- Annual energy production: **267.8 GWh** (vs. 260.5 GWh P50 estimate)
- Performance Ratio: **83.2%** (guarantee: 81.0%)
- Technical availability: **99.3%** (target: 99.0%)
- Specific yield: **1,785 kWh/kWp**
- Soiling losses: **1.8%** (within budget of 2.5%)

**Notable Events:**
- Inverter Station 3 downtime (4 days) due to IGBT failure — warranty replacement
- 12 modules replaced under warranty for >3% power degradation
- Zero curtailment events from REN grid operator`,
      timestamp: new Date().toISOString(),
    },
  },

  // ── Yorkshire-specific responses ────────────────────────────────
  {
    keywords: ["financial close", "lender", "bankability", "financing"],
    projectId: "proj-yorkshire",
    response: {
      id: "ai-yorkshire-fc",
      role: "assistant",
      content: `**Financial Close Readiness — Yorkshire Storage**

**Gateway G2 Status: 71% complete (BLOCKED)**

Key blockers preventing financial close:`,
      gapItems: [
        { standard: "N/A", requirement: "Revenue contract (tolling/merchant)", status: "fail", action: "Tolling agreement negotiations with Habitat Energy ongoing" },
        { standard: "N/A", requirement: "All-risk insurance quotation", status: "fail", action: "Previous quote expired — re-quotation needed with NFPA 855 data" },
        { standard: "NGESO Grid Code", requirement: "Grid pre-assessment received", status: "pending", action: "NGESO response awaited — submitted 6 weeks ago" },
        { standard: "DNV-RP-0043", requirement: "IE BESS safety assessment", status: "warning", action: "DNV report overdue by 14 days" },
        { standard: "GC0137", requirement: "UK Grid Code compliance path", status: "pending", action: "Compliance strategy to be finalized with EPC" },
      ],
      timestamp: new Date().toISOString(),
    },
  },
  {
    keywords: ["bess", "safety", "fire", "nfpa"],
    projectId: "proj-yorkshire",
    response: {
      id: "ai-yorkshire-bess-safety",
      role: "assistant",
      content: `**BESS Safety Standards — Yorkshire Storage (80 MW / 160 MWh)**

As a UK-based BESS project, the following safety standards and regulations apply:`,
      gapItems: [
        { standard: "NFPA 855", requirement: "ESS installation safety requirements", status: "warning", action: "Safety assessment in progress with DNV" },
        { standard: "UL 9540", requirement: "System-level safety certification", status: "pending", action: "OEM to provide system certification" },
        { standard: "UL 9540A", requirement: "Thermal runaway fire propagation testing", status: "pending", action: "Cell-level test results awaited from OEM" },
        { standard: "BS EN 62619", requirement: "UK-adopted IEC secondary lithium cell safety", status: "pending", action: "To be verified at design freeze stage" },
        { standard: "HSE CDM", requirement: "Construction Design Management compliance", status: "pass", action: "CDM coordinator appointed" },
      ],
      timestamp: new Date().toISOString(),
    },
  },

  // ── Atacama-specific responses ──────────────────────────────────
  {
    keywords: ["construction", "progress", "schedule", "delay"],
    projectId: "proj-atacama",
    response: {
      id: "ai-atacama-construction",
      role: "assistant",
      content: `**Construction Progress — Atacama Hybrid (200 MW PV + 200 MWh BESS)**

**Current Status: Gateway G4 — Cold Commissioning (58% complete)**

- PV tracker installation: **78%** complete (on track)
- BESS container installation: **35%** (2 weeks behind schedule)
- MV cabling: **65%** complete
- Substation: **90%** complete
- SCADA integration: **Not started** (blocked by BESS delay)

**Schedule Impact:**
- EPC schedule delay of 3 weeks on tracker installation milestone
- BESS container shipment delayed by 2 weeks (port congestion)
- Overall G4 completion target pushed to June 2026`,
      timestamp: new Date().toISOString(),
    },
  },
  {
    keywords: ["ncr", "non-conformance", "quality"],
    projectId: "proj-atacama",
    response: {
      id: "ai-atacama-ncr",
      role: "assistant",
      content: `**Non-Conformance Reports — Atacama Hybrid Construction Phase**

**Summary: 3 NCRs raised | 1 closed | 2 open**`,
      gapItems: [
        { standard: "NCR-ATK-001", requirement: "Cable tray routing deviation — MV Section B", status: "pass", action: "Design change approved, rework completed — Closed" },
        { standard: "NCR-ATK-002", requirement: "Tracker pile depth insufficient — Row C12-C18", status: "warning", action: "Geotechnical review in progress — additional piles may be needed" },
        { standard: "NCR-ATK-003", requirement: "Foundation alignment deviation — Section C", status: "warning", action: "15mm deviation detected — engineering review required" },
      ],
      timestamp: new Date().toISOString(),
    },
  },

  // ── Al Dhafra-specific responses ────────────────────────────────
  {
    keywords: ["eia", "environmental", "biodiversity", "assessment"],
    projectId: "proj-aldhafra",
    response: {
      id: "ai-aldhafra-eia",
      role: "assistant",
      content: `**EIA Status — Al Dhafra Extension (300 MW PV)**

The Environmental Impact Assessment is currently in draft stage, submitted to the Environment Agency Abu Dhabi (EAD).

**Key findings from draft EIA:**
- No significant biodiversity impact — desert habitat with low ecological sensitivity
- Dust management plan required during construction
- Groundwater monitoring recommended (sabkha terrain)
- Additional biodiversity survey requested by EAD (3-week delay)

**Timeline:**
- Draft submitted: November 2025
- EAD additional data request: February 2026
- Updated submission expected: March 2026
- EAD clearance expected: May 2026`,
      timestamp: new Date().toISOString(),
    },
  },
  {
    keywords: ["grid", "connection", "transco", "ewec"],
    projectId: "proj-aldhafra",
    response: {
      id: "ai-aldhafra-grid",
      role: "assistant",
      content: `**Grid Connection Status — Al Dhafra Extension**

**TRANSCO Grid Connection Study: In Review**

- Connection point: Al Dhafra 400kV substation
- Capacity requested: 300 MW
- Study submitted: January 2026
- TRANSCO requested updated reactive power compensation data
- Revised study expected: March 2026

**EWEC Technical Requirements:**
- Compliant with EWEC technical requirements (confirmed)
- Power factor range: 0.95 leading to 0.95 lagging
- Frequency response capability: required per EWEC code
- LVRT compliance: to be demonstrated during commissioning`,
      timestamp: new Date().toISOString(),
    },
  },

  // ── Sunridge-specific responses ────────────────────────────────
  {
    keywords: ["feoc", "foreign entity", "chinese", "material assistance", "obbba"],
    projectId: "proj-sunridge",
    response: {
      id: "ai-feoc",
      role: "assistant",
      content: `**FEOC Compliance Assessment — Sunridge Solar + Storage**

The OBBBA Final Rule establishes Foreign Entity of Concern (FEOC) restrictions for IRA clean energy tax credits. Projects using components from FEOC entities face reduced or eliminated ITC eligibility.

**Current FEOC Status: NON-COMPLIANT (2 of 4 categories failing)**

| Category | Non-FEOC Ratio | Threshold | Status |
|----------|---------------|-----------|--------|
| Solar Modules | 43% | ≥75% | ❌ Fail |
| Inverters | 90% | ≥75% | ✅ Pass |
| Energy Storage | 55% | ≥40% | ✅ Pass |
| Critical Minerals | 40% | ≥50% | ❌ Fail |

**ITC at Risk: $18.2M**

**Flagged Suppliers:**
- Tongwei Solar (polysilicon) — CN manufacturing
- LONGi Green Energy (wafers) — CN manufacturing
- Shanshan Technology (graphite anode) — CN manufacturing, UFLPA flag
- Ganfeng Lithium (lithium carbonate) — CN manufacturing

**Recommended Actions:**
1. Substitute Tongwei/LONGi with non-FEOC polysilicon suppliers (Wacker, REC Silicon, Hemlock)
2. Request BYD alternative graphite sourcing (Syrah Resources, Nouveau Monde)
3. Evaluate safe harbor provisions based on BOC date (Nov 20, 2025)
4. Engage tax counsel for ITC eligibility restructuring`,
      timestamp: new Date().toISOString(),
    },
  },

  // ── Sonnenberg supply chain responses ─────────────────────────
  {
    keywords: ["forced labour", "forced labor", "eu 2024/3015"],
    projectId: "proj-sonnenberg",
    response: {
      id: "ai-forced-labour",
      role: "assistant",
      content: `**EU Forced Labour Regulation (2024/3015) — Sonnenberg Assessment**

The EU Forced Labour Regulation prohibits products made with forced labour from being placed on or exported from the EU market.

**Enforcement Timeline:**
- Dec 2024: Regulation entered into force
- Jun 2025: Commission published investigation guidelines
- Dec 2027: Full enforcement begins (competent authority investigations)
- Ongoing: Product withdrawal decisions possible

**Sonnenberg Supplier Due Diligence Status:**

| Supplier | Component | Audit Status | Risk Level |
|----------|-----------|-------------|------------|
| JinkoSolar | PV Modules | SA8000 / SSI Certified | Low |
| SMA Solar | Inverters | Self-declaration on file | Medium |
| BYD | BESS | RBA membership — audit pending | Medium |

**Evidence Package:**
- Forced labour due diligence policy: ✅ Approved
- JinkoSolar SA8000 audit report: ✅ On file
- SMA supplier declaration: ✅ On file
- BYD RBA audit: ⏳ Scheduled Q2 2026
- Polysilicon traceability: ✅ Malaysian production verified

**Recommended Actions:**
1. Complete BYD RBA third-party audit before Dec 2027 enforcement
2. Obtain SMA third-party social compliance audit
3. Document full polysilicon traceability chain for all module batches`,
      timestamp: new Date().toISOString(),
    },
  },

  // ── Sonnenberg G8-specific responses ──────────────────────────
  {
    keywords: ["annual compliance", "annual review", "g8"],
    projectId: "proj-sonnenberg",
    response: {
      id: "ai-sonnenberg-g8",
      role: "assistant",
      content: `**G8 Annual Compliance Review — Sonnenberg Solar + Storage**

The G8 Annual Compliance Review for Sonnenberg covers EU regulatory obligations across multiple frameworks. Here's the current status:

**Overall: 6 of 14 requirements passed (43%)**

Key compliance areas requiring attention:`,
      gapItems: [
        { standard: "EU 2022/2464 (CSRD)", requirement: "Sustainability reporting disclosure", status: "warning", action: "Report drafted but missing key ESRS disclosures — GHG targets, governance expertise, due diligence process" },
        { standard: "ESRS E1", requirement: "Climate change disclosure", status: "warning", action: "Scope 1 & 2 reported but Scope 3 missing. No transition plan or locked-in emissions assessment" },
        { standard: "ESRS E2", requirement: "Pollution disclosure", status: "pending", action: "Not yet prepared — PFAS assessment and substances of concern needed" },
        { standard: "ESRS E4", requirement: "Biodiversity disclosure", status: "pending", action: "Ecological monitoring done but no quantified targets or land use metrics" },
        { standard: "ESRS E5", requirement: "Circular economy disclosure", status: "pending", action: "Basic waste data available but no material inflows or end-of-life plans" },
        { standard: "EU 2023/1542 Art. 77", requirement: "Battery passport data update", status: "warning", action: "15 of 22 fields populated — carbon footprint and recycled content declarations overdue" },
        { standard: "EU 2020/852", requirement: "Taxonomy alignment (solar §4.1)", status: "warning", action: "Substantial contribution met, but DNSH assessment incomplete across multiple objectives" },
        { standard: "EU Taxonomy CDA", requirement: "DNSH assessment", status: "fail", action: "Critical gaps: climate adaptation not covering full lifetime, no WEEE plan, no PFAS assessment, biodiversity monitoring incomplete" },
        { standard: "EU 2024/1735 Art. 11", requirement: "Nature restoration compliance", status: "pending", action: "No ecosystem restoration contribution assessment" },
        { standard: "EU 2024/573", requirement: "F-Gas regulation", status: "pass", action: "SF6 and HFC records maintained, leak checks completed" },
      ],
      timestamp: new Date().toISOString(),
    },
  },
  {
    keywords: ["csrd", "sustainability reporting", "corporate sustainability"],
    projectId: "proj-sonnenberg",
    response: {
      id: "ai-sonnenberg-csrd",
      role: "assistant",
      content: `**CSRD Compliance Assessment — Sonnenberg Solar + Storage**

The Corporate Sustainability Reporting Directive (EU 2022/2464) requires comprehensive sustainability disclosures under ESRS standards. Here's the Sonnenberg status:

**CSRD Art. 19a Disclosure Requirements:**`,
      gapItems: [
        { standard: "CSRD Art. 19a(2)(a)", requirement: "Business model & strategy resilience", status: "pass", action: "Basic disclosure provided in annual report" },
        { standard: "CSRD Art. 19a(2)(b)", requirement: "Time-bound sustainability targets", status: "fail", action: "No specific GHG reduction targets with base year/target year. No SBTi alignment." },
        { standard: "CSRD Art. 19a(2)(c)", requirement: "Governance body expertise", status: "fail", action: "No description of board/management expertise on sustainability matters" },
        { standard: "CSRD Art. 19a(2)(d)", requirement: "Sustainability policies", status: "warning", action: "Partial — supply chain policy exists but broader sustainability policy framework incomplete" },
        { standard: "CSRD Art. 19a(2)(f)", requirement: "Due diligence process", status: "fail", action: "No systematic due diligence process described for adverse impacts. BYD audit still pending." },
        { standard: "CSRD Art. 19a(2)(g)", requirement: "Principal risks description", status: "warning", action: "Climate risks partially addressed but no comprehensive risk taxonomy" },
      ],
      timestamp: new Date().toISOString(),
    },
  },
  {
    keywords: ["esrs", "european sustainability", "reporting standard"],
    projectId: "proj-sonnenberg",
    response: {
      id: "ai-sonnenberg-esrs",
      role: "assistant",
      content: `**ESRS Environmental Standards — Sonnenberg Compliance Overview**

The European Sustainability Reporting Standards (EU 2023/2772) require detailed environmental disclosures across five pillars:

| Standard | Status | Key Gap |
|----------|--------|---------|
| E1 Climate Change | ⚠️ Warning | Scope 3 not reported, no transition plan |
| E2 Pollution | ⏳ Pending | PFAS and substances of concern not assessed |
| E4 Biodiversity | ⏳ Pending | No quantified targets, missing land use metrics |
| E5 Circular Economy | ⏳ Pending | No material inflows, no end-of-life plans |

**Priority actions:**
1. Complete Scope 3 GHG inventory (embodied carbon in modules, BESS, steel)
2. Develop PFAS assessment for PV module backsheets
3. Set quantified biodiversity targets with baseline assessment
4. Create PV module and BESS end-of-life management plans`,
      timestamp: new Date().toISOString(),
    },
  },
  {
    keywords: ["taxonomy", "dnsh", "do no significant harm", "eu taxonomy"],
    projectId: "proj-sonnenberg",
    response: {
      id: "ai-sonnenberg-taxonomy",
      role: "assistant",
      content: `**EU Taxonomy Alignment — Sonnenberg Solar + Storage**

**Activities:** Solar PV (§4.1) + Battery Storage (§4.10)

**Substantial Contribution:** ✅ Met — lifecycle GHG < 100g CO2e/kWh

**DNSH Assessment Status:**`,
      gapItems: [
        { standard: "Taxonomy CDA Appendix A", requirement: "Climate adaptation — full lifetime risk assessment", status: "fail", action: "Current assessment only covers development phase. Must extend to full 25-30 year expected lifetime with RCP 8.5 scenario." },
        { standard: "Taxonomy CDA §4.1 DNSH(3)", requirement: "Water management plan", status: "pass", action: "Panel cleaning uses demineralized water, no chemical additives" },
        { standard: "Taxonomy CDA §4.1 DNSH(4)", requirement: "Circular economy — WEEE registration", status: "fail", action: "PV module WEEE registration pending. No waste management plan for end-of-life recycling." },
        { standard: "Taxonomy CDA §4.10 DNSH(4)", requirement: "Battery second-life assessment", status: "fail", action: "No assessment of second-life applications before recycling as required" },
        { standard: "Taxonomy CDA §4.1 DNSH(5)", requirement: "SVHC/PFAS assessment", status: "warning", action: "No PFAS content assessment for PV module components" },
        { standard: "Taxonomy CDA §4.1 DNSH(6)", requirement: "Biodiversity — ongoing monitoring", status: "warning", action: "EIA completed but ongoing monitoring not documented against EIA commitments" },
      ],
      timestamp: new Date().toISOString(),
    },
  },

  // ── Sunridge G8-specific responses ──────────────────────────
  {
    keywords: ["feoc annual", "annual feoc", "feoc re-certification", "g8"],
    projectId: "proj-sunridge",
    response: {
      id: "ai-sunridge-g8",
      role: "assistant",
      content: `**G8 Annual Compliance Review — Sunridge Solar + Storage**

The G8 Annual Compliance Review for Sunridge covers US federal regulatory obligations. Here's the current status:

**Overall: 5 of 11 requirements passed (45%)**

Key compliance areas:`,
      gapItems: [
        { standard: "OBBBA FEOC", requirement: "Annual FEOC re-certification", status: "warning", action: "All 4 categories currently passing but critical minerals ratio (54.9%) is close to 50% threshold" },
        { standard: "UFLPA", requirement: "Supply chain traceability", status: "warning", action: "Self-declarations on file but no third-party verification. Graphite processing chain incomplete." },
        { standard: "ERCOT Protocols", requirement: "Grid compliance (12-month)", status: "pass", action: "Zero protocol violations" },
        { standard: "NFPA 855", requirement: "Annual fire safety inspection", status: "pass", action: "Inspection completed August 2028" },
        { standard: "UL 9540", requirement: "System recertification", status: "warning", action: "Recertification due — in progress" },
        { standard: "ANSI/SEIA 101", requirement: "Traceability update", status: "pending", action: "Annual update not yet prepared" },
        { standard: "EU 2020/852", requirement: "EU Taxonomy alignment", status: "not_applicable", action: "Not applicable — US project" },
        { standard: "EU 2022/2464", requirement: "CSRD reporting", status: "not_applicable", action: "Not applicable — US project" },
      ],
      timestamp: new Date().toISOString(),
    },
  },

  // ── Global supply chain responses ─────────────────────────────
  {
    keywords: ["battery passport", "digital product passport", "dpp", "catena-x"],
    response: {
      id: "ai-battery-passport-global",
      role: "assistant",
      content: `**EU Battery Passport — Regulation Overview (EU 2023/1542)**

The EU Battery Regulation requires a digital "battery passport" for all industrial batteries (>2 kWh) placed on the EU market. This is a staggered rollout:

**Timeline:**
- Feb 2025: Carbon footprint declaration required
- Aug 2026: Performance class labels
- Feb 2027: QR code + full digital battery passport
- Aug 2027: Supply chain due diligence obligations
- Aug 2028: Recycled content targets

**Required Data Fields (Article 77):**
- Manufacturer identification & contact
- Battery model, batch, and serial numbers
- Manufacturing date and location
- Battery chemistry and materials
- Rated capacity, voltage, and energy
- Carbon footprint per kWh (lifecycle)
- Recycled content share (Co, Li, Ni, Pb)
- Expected lifetime (years and cycles)
- State of Health tracking methodology
- Collection and recycling information
- Supply chain due diligence records
- QR code linking to digital passport

**Platform:** EU Battery Passport platform (Catena-X / Battery Pass consortium)

**Impact on SolarComply Projects:**
- EU BESS/hybrid projects must populate all data fields
- Carbon footprint declaration is already overdue for new installations
- QR code requirement applies from Feb 2027`,
      timestamp: new Date().toISOString(),
    },
  },
  {
    keywords: ["cbam", "carbon border", "carbon adjustment", "embedded emissions"],
    response: {
      id: "ai-cbam-global",
      role: "assistant",
      content: `**EU CBAM — Carbon Border Adjustment Mechanism (EU 2023/956)**

CBAM requires importers of covered goods into the EU to declare embedded emissions and purchase CBAM certificates at the EU ETS carbon price.

**Materials in Scope for Solar/BESS Projects:**
- **Steel** (structural steel, tracker components, mounting structures)
- **Aluminium** (module frames, cable trays, enclosures)
- **Cement** (foundations — if imported)
- Hydrogen and fertilisers (not typically relevant)

**Timeline:**
- Oct 2023 – Dec 2025: Transitional reporting period (quarterly reports, no certificates)
- Jan 2026: Definitive regime — CBAM certificates required for imports
- 2026–2034: Phased reduction of free EU ETS allowances

**Cost Impact Estimate:**
At current EU ETS prices (~€65/tonne CO2), structural steel from non-EU sources adds approximately €15–25/tonne to material costs. For a 100 MW solar project, this could represent €200K–500K in additional costs.

**Recommended Actions:**
1. Identify all CBAM-relevant materials in project BOM
2. Request embedded emissions data from steel and aluminium suppliers
3. Evaluate EU-sourced alternatives to reduce CBAM exposure
4. Factor CBAM certificate costs into financial model`,
      timestamp: new Date().toISOString(),
    },
  },

  // ── Global responses (match any project) ────────────────────────
  {
    keywords: ["fire", "safety", "bess", "nfpa", "battery fire"],
    response: {
      id: "ai-fire-safety-global",
      role: "assistant",
      content: `**BESS Fire Safety Standards — Overview**

The following international standards apply to BESS fire safety across all projects:`,
      gapItems: [
        { standard: "NFPA 855", requirement: "ESS installation safety", status: "pass", action: "Applicable to all BESS and hybrid projects" },
        { standard: "UL 9540", requirement: "System-level ESS safety", status: "pass", action: "Required for system certification" },
        { standard: "UL 9540A", requirement: "Thermal runaway testing", status: "pass", action: "Cell, module, unit, and installation level" },
        { standard: "IEC 62933-5-2", requirement: "EES system safety", status: "pass", action: "Grid-connected storage systems" },
      ],
      timestamp: new Date().toISOString(),
    },
  },
];

// ─── Query matching ───────────────────────────────────────────────

export function findAIResponse(query: string, projectId?: string): AIMessage | null {
  const lower = query.toLowerCase();

  // First try project-specific match
  if (projectId) {
    for (const entry of aiResponses) {
      if (entry.projectId === projectId) {
        const matched = entry.keywords.some((kw) => lower.includes(kw));
        if (matched) return { ...entry.response, id: `ai-${Date.now()}`, timestamp: new Date().toISOString() };
      }
    }
  }

  // Then try global match (entries without projectId)
  for (const entry of aiResponses) {
    if (!entry.projectId) {
      const matched = entry.keywords.some((kw) => lower.includes(kw));
      if (matched) return { ...entry.response, id: `ai-${Date.now()}`, timestamp: new Date().toISOString() };
    }
  }

  return null;
}
