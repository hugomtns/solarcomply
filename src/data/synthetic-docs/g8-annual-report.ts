/**
 * Synthetic G8 Annual Compliance Report Generator
 *
 * Generates a realistic-looking annual compliance report with intentional gaps
 * for the AI to find during compliance checking.
 */

import { projects } from "@/data/projects";

export interface G8AnnualReportData {
  projectId: string;
  projectName: string;
  reportingPeriod: string;
  sections: ReportSection[];
}

interface ReportSection {
  id: string;
  title: string;
  content: string;
}

export function generateG8AnnualReport(projectId: string): G8AnnualReportData {
  const project = projects.find((p) => p.id === projectId);
  if (!project) throw new Error(`Project ${projectId} not found`);

  if (projectId === "proj-sonnenberg") {
    return generateSonnenbergReport(project.name);
  } else if (projectId === "proj-sunridge") {
    return generateSunridgeReport(project.name);
  }

  throw new Error(`No synthetic report template for project ${projectId}`);
}

export function renderG8AnnualReportMarkdown(data: G8AnnualReportData): string {
  const lines: string[] = [
    `# Annual Compliance Report — ${data.projectName}`,
    `**Reporting Period:** ${data.reportingPeriod}`,
    `**Generated:** ${new Date().toISOString().split("T")[0]}`,
    "",
  ];

  for (const section of data.sections) {
    lines.push(`## ${section.title}`, "", section.content, "");
  }

  return lines.join("\n");
}

// ─── Sonnenberg Report (EU/DE) — 16 intentional gaps ─────────────

function generateSonnenbergReport(name: string): G8AnnualReportData {
  return {
    projectId: "proj-sonnenberg",
    projectName: name,
    reportingPeriod: "October 2026 – September 2027",
    sections: [
      {
        id: "exec-summary",
        title: "1. Executive Summary",
        content: `Sonnenberg Solar + Storage (100 MW PV / 100 MWh BESS) in Brandenburg, Germany completed its first full year of commercial operation on September 15, 2027. The plant achieved a Performance Ratio of 81.2% against a guarantee threshold of 78.0%, and technical availability of 99.1%.

This report covers annual compliance obligations under EU and German regulations, including sustainability reporting, battery passport requirements, taxonomy alignment, and environmental commitments.

Key areas requiring attention include CSRD reporting completeness, battery passport data gaps, and EU Taxonomy DNSH assessment.`,
      },
      {
        id: "performance",
        title: "2. Operational Performance",
        content: `### 2.1 PV System Performance
- Annual energy production: 142.8 GWh (vs. 138.5 GWh P50 estimate)
- Performance Ratio: 81.2% (guarantee: 78.0%)
- Specific yield: 1,428 kWh/kWp
- Soiling losses: 2.1%
- Availability: 99.1%

### 2.2 BESS Performance
- Round-trip efficiency: 89.2% (guarantee: 88.0%)
- Annual throughput: 312 full cycles
- State of Health: 98.4%
- Revenue from ancillary services: €2.1M

### 2.3 Grid Compliance
- Zero grid code violations during the reporting period
- Frequency response events: 47 (all within specification)
- Reactive power compliance: confirmed per 50Hertz requirements`,
      },
      {
        id: "csrd",
        title: "3. CSRD Sustainability Report",
        content: `### 3.1 Business Model and Strategy
GreenField Energy GmbH operates Sonnenberg as part of its EU renewable energy portfolio. The project contributes to Germany's renewable energy targets and the EU Green Deal objectives.

### 3.2 Climate Targets
GreenField has committed to net-zero Scope 1 and 2 emissions by 2035. Sonnenberg contributes approximately 85,000 tonnes of avoided CO2 annually compared to the German grid average.

**[GAP: No specific GHG emission reduction targets with base year and target year as required by ESRS E1-4. No Science Based Targets initiative alignment disclosed.]**

### 3.3 Governance
The Sonnenberg Compliance Manager reports quarterly to GreenField's Sustainability Committee. Board-level oversight of ESG matters is provided by the CFO.

**[GAP: No description of expertise and skills of governing bodies regarding sustainability matters as required by CSRD Art. 19a(2)(c).]**

### 3.4 Due Diligence
GreenField conducts supply chain due diligence for all major procurement. JinkoSolar modules are SA8000 certified. SMA inverters carry a self-declaration of social compliance.

**[GAP: No description of the due diligence process for identifying and mitigating adverse sustainability impacts as required by CSRD Art. 19a(2)(f). BYD BESS due diligence audit is still pending.]**`,
      },
      {
        id: "esrs-e1",
        title: "4. ESRS E1 — Climate Change",
        content: `### 4.1 GHG Emissions (Scope 1)
- Backup diesel generator: 12 tonnes CO2e (emergency operation only)
- Maintenance vehicles: 8 tonnes CO2e
- SF6 in switchgear: 0.2 tonnes CO2e (estimated, no leaks detected)
- Total Scope 1: 20.2 tonnes CO2e

### 4.2 GHG Emissions (Scope 2)
- Grid electricity for auxiliaries: 45 tonnes CO2e (market-based)
- Total Scope 2: 45 tonnes CO2e

### 4.3 Avoided Emissions
- Avoided grid emissions: approximately 85,000 tonnes CO2e

**[GAP: Scope 3 emissions not reported. No embodied carbon assessment for PV modules, BESS, or steel structures. ESRS E1-6 requires disaggregated Scope 3 reporting by material category.]**

**[GAP: No transition plan for climate change mitigation as required by ESRS E1-1. No locked-in emissions assessment.]**`,
      },
      {
        id: "esrs-e2",
        title: "5. ESRS E2 — Pollution",
        content: `### 5.1 Air Emissions
Negligible air emissions during normal operations. Backup diesel generator operated for 18 hours during grid outage events.

### 5.2 Water Management
Panel cleaning uses demineralized water with no chemical additives. Total water consumption: 850 m³/year.

### 5.3 Noise
Noise levels at nearest receptor (1.2 km): measured at 28 dB(A), well within the 45 dB(A) nighttime limit per BImSchG.

**[GAP: No assessment of PFAS content in PV module backsheets as potentially required under ESRS E2-5 substances of concern. No disclosure of substances of very high concern in components.]**`,
      },
      {
        id: "esrs-e4",
        title: "6. ESRS E4 — Biodiversity",
        content: `### 6.1 Ecological Monitoring
Annual ecological monitoring was conducted in June 2027 by Brandenburg Environmental Consultants.

- No significant adverse impacts on local biodiversity observed
- Bird monitoring: 3 species of conservation interest detected (none directly impacted)
- Vegetation under panels: native grassland maintained

**[GAP: No quantified biodiversity targets (no-net-loss or net-positive gain commitment) as required by ESRS E4-4. No IUCN Red List species impact assessment. No baseline biodiversity assessment against which progress is measured.]**

**[GAP: No land use change metrics reported (total hectares, proximity to Natura 2000 sites) as required by ESRS E4-5.]**`,
      },
      {
        id: "esrs-e5",
        title: "7. ESRS E5 — Circular Economy",
        content: `### 7.1 Waste Management
Total waste generated during the reporting period: 12.4 tonnes
- Hazardous waste: 0.8 tonnes (used oil, cleaning solvents)
- Non-hazardous waste: 11.6 tonnes (packaging, replaced components)

All waste disposed of through licensed contractors.

**[GAP: No recycled content disclosure for key materials. No end-of-life management plan for PV modules per WEEE Directive. No battery second-life assessment or recycling plan as required by EU Battery Regulation and ESRS E5.]**

**[GAP: No material inflow reporting (total weight of materials used, renewable vs. non-renewable) as required by ESRS E5-4.]**`,
      },
      {
        id: "battery-passport",
        title: "8. Battery Passport — EU 2023/1542",
        content: `### 8.1 Battery Identification
- Manufacturer: BYD Company Ltd.
- Model: MC Cube T2-100
- Chemistry: LFP (LiFePO4)
- Capacity: 100 MWh / 800V DC
- Manufacturing date: October 2025
- Manufacturing location: Shenzhen, China

### 8.2 Performance Data
- Rated capacity: 100 MWh
- Current State of Health: 98.4%
- Round-trip efficiency: 89.2%
- Cycles completed: 312

### 8.3 Carbon Footprint
Carbon footprint declaration is pending. BYD has committed to providing lifecycle carbon footprint data by Q4 2027.

**[GAP: Carbon footprint declaration per Art. 7 is overdue — required since August 2025 for industrial batteries. No kg CO2e/kWh value provided.]**

### 8.4 Recycled Content
Recycled content data has been requested from BYD but not yet received.

**[GAP: Recycled content share (Co, Li, Ni, Pb) not declared per Art. 10. While enforcement of minimum thresholds begins in 2031, declaration is required now.]**

### 8.5 Supply Chain Due Diligence
BYD is a member of the Responsible Business Alliance. Third-party audit is scheduled for Q2 2027.

**[GAP: Due diligence records per Art. 48 are incomplete. No third-party audit has been conducted. No supply chain risk assessment documentation available.]**

### 8.6 QR Code and Digital Passport
QR code not yet assigned. Awaiting EU Battery Passport platform availability.

**[GAP: QR code and digital passport link required from February 2027 per Art. 77. Platform integration not yet initiated.]**`,
      },
      {
        id: "taxonomy",
        title: "9. EU Taxonomy Alignment",
        content: `### 9.1 Eligible Activities
- Solar PV electricity generation (Activity 4.1): Eligible
- Battery energy storage (Activity 4.10): Eligible

### 9.2 Substantial Contribution
Both activities contribute substantially to climate change mitigation. Solar PV lifecycle emissions are estimated at approximately 30 g CO2e/kWh, well below the 100 g threshold.

### 9.3 DNSH Assessment
**Climate adaptation (Objective 2):**
A climate risk assessment was conducted during the development phase (2024). The assessment identified heat stress and flooding as potential risks. Mitigation measures include elevated electrical equipment and heat-resistant module selection.

**[GAP: Climate risk assessment does not cover the full expected lifetime (25-30 years) as required by Appendix A. No RCP 8.5 scenario analysis. Assessment needs updating to current climate projections.]**

**Water (Objective 3):**
Water management plan in place for panel cleaning. No chemical additives used.

**Circular economy (Objective 4):**
WEEE registration pending for PV modules.

**[GAP: No waste management plan ensuring recycling at end of life. No assessment of component durability and recyclability as required by Taxonomy CDA §4.1 DNSH(4). No battery second-life assessment per §4.10 DNSH(4).]**

**Pollution (Objective 5):**
No SVHC substances used in operations.

**[GAP: No PFAS assessment for PV module components. No F-gas reporting for BESS cooling system.]**

**Biodiversity (Objective 6):**
EIA was completed and approved during development phase.

**[GAP: No ongoing biodiversity monitoring results reported against EIA commitments. No Natura 2000 appropriate assessment referenced despite project proximity to protected areas.]**`,
      },
      {
        id: "nature-restoration",
        title: "10. Nature Restoration Regulation",
        content: `### 10.1 Regulatory Status
The project benefits from the overriding public interest presumption under Art. 11 of the EU Nature Restoration Regulation for renewable energy deployment.

### 10.2 Biodiversity Enhancement
Pollinator-friendly vegetation has been seeded under the solar panels. Initial results show increased insect diversity.

**[GAP: No formal contribution to ecosystem restoration targets as may be required under Art. 11(6) for installations near restoration target areas. No quantified biodiversity enhancement metrics.]**`,
      },
      {
        id: "fgas",
        title: "11. F-Gas Compliance",
        content: `### 11.1 SF6 Inventory
Medium-voltage switchgear contains 24 kg of SF6 (GWP: 25,200; CO2e: 604.8 tonnes).
Annual leak check conducted: no leaks detected.

### 11.2 BESS Cooling
The BESS thermal management system uses R-410A refrigerant (12 kg, GWP: 2,088; CO2e: 25.1 tonnes).
Leak check conducted: no leaks detected.

All F-gas records maintained per EU 2024/573 Art. 4(4)(d).`,
      },
      {
        id: "om-report",
        title: "12. O&M Annual Report",
        content: `### 12.1 Maintenance Summary
- Preventive maintenance events: 24 (monthly + quarterly schedules)
- Corrective maintenance events: 8
- Module replacements: 15 (warranty claims)
- Inverter events: 2 (firmware updates, no hardware failures)
- BESS events: 1 (BMS firmware update)

### 12.2 Key Performance Indicators
- Availability: 99.1% (target: 99.0%)
- Mean time to repair: 4.2 hours (target: 8 hours)
- Warranty claim resolution: average 12 days

### 12.3 Safety
Zero lost-time injuries during the reporting period.
All O&M personnel have completed annual safety training.`,
      },
    ],
  };
}

// ─── Sunridge Report (US/TX) ─────────────────────────────────────

function generateSunridgeReport(name: string): G8AnnualReportData {
  return {
    projectId: "proj-sunridge",
    projectName: name,
    reportingPeriod: "October 2027 – September 2028",
    sections: [
      {
        id: "exec-summary",
        title: "1. Executive Summary",
        content: `Sunridge Solar + Storage (150 MW PV / 150 MWh BESS) in Pecos County, Texas completed its first full year of commercial operation on September 15, 2028. The plant achieved a Performance Ratio of 82.5% against a guarantee threshold of 79.0%, and technical availability of 99.3%.

This report covers annual compliance obligations under US federal and Texas state regulations, including FEOC re-certification, UFLPA supply chain compliance, ERCOT grid requirements, and fire safety inspections.`,
      },
      {
        id: "performance",
        title: "2. Operational Performance",
        content: `### 2.1 PV System Performance
- Annual energy production: 285.6 GWh (vs. 278.0 GWh P50 estimate)
- Performance Ratio: 82.5% (guarantee: 79.0%)
- Specific yield: 1,904 kWh/kWp
- Soiling losses: 3.2% (desert conditions)
- Availability: 99.3%

### 2.2 BESS Performance
- Round-trip efficiency: 90.1% (guarantee: 88.0%)
- Annual throughput: 365 full cycles
- State of Health: 97.8%
- Revenue from ERCOT ancillary services: $3.8M

### 2.3 Grid Compliance
- Zero ERCOT protocol violations
- Frequency response events: 62 (all within specification)
- No curtailment events during the reporting period`,
      },
      {
        id: "feoc",
        title: "3. FEOC Annual Re-certification",
        content: `### 3.1 Component Origin Summary
Annual FEOC cost-origin analysis conducted per OBBBA Final Rule requirements.

| Category | Total Cost | Non-FEOC Cost | Non-FEOC Ratio | Threshold | Status |
|----------|-----------|--------------|----------------|-----------|--------|
| Solar Modules | $42.5M | $38.2M | 89.9% | ≥75% | Pass |
| Inverters | $12.1M | $11.8M | 97.5% | ≥75% | Pass |
| Energy Storage | $35.0M | $17.5M | 50.0% | ≥40% | Pass |
| Critical Minerals | $8.2M | $4.5M | 54.9% | ≥50% | Pass |

### 3.2 Supplier Changes
During the reporting period, the following supply chain changes were made:
- Replaced Tongwei polysilicon with Wacker Chemie (German origin)
- BYD provided alternative graphite sourcing from Syrah Resources (Mozambique/US)

**[GAP: Critical minerals ratio of 54.9% is close to the 50% threshold. Annual monitoring recommended. No documentation of lithium hydroxide sourcing pathway.]**

### 3.3 Safe Harbor
Beginning of Construction (BOC) date: November 20, 2025. Safe harbor provisions apply for components procured before this date.`,
      },
      {
        id: "uflpa",
        title: "4. UFLPA Supply Chain Compliance",
        content: `### 4.1 Polysilicon Traceability
All PV modules use polysilicon from non-XUAR sources:
- Wacker Chemie (Germany): 65%
- REC Silicon (Moses Lake, WA): 35%

ANSI/SEIA 101 traceability documentation on file for all module batches.

### 4.2 BESS Mineral Traceability
- Lithium: sourced from Albemarle (Chile/US processing)
- Graphite: Syrah Resources (Mozambique, processed in Vidalia, LA)
- Iron phosphate: domestic US sources

**[GAP: No third-party verification of mineral traceability claims. UFLPA requires robust documentation trail — current self-declarations may be insufficient for CBP scrutiny. Graphite processing chain documentation incomplete.]**`,
      },
      {
        id: "safety",
        title: "5. Fire Safety and Inspections",
        content: `### 5.1 NFPA 855 Annual Inspection
Annual BESS fire safety inspection completed August 2028 by Texas Fire Marshal's office.
- Fire detection systems: operational
- Fire suppression systems: operational (last tested Q2 2028)
- Emergency ventilation: operational
- Signage and access: compliant

### 5.2 UL 9540 System Status
System-level UL 9540 certification remains valid. No modifications to certified configuration during the reporting period.

### 5.3 Safety Incidents
Zero fire incidents or thermal events during the reporting period.`,
      },
      {
        id: "om-report",
        title: "6. O&M Annual Report",
        content: `### 6.1 Maintenance Summary
- Preventive maintenance events: 24
- Corrective maintenance events: 12
- Module replacements: 22 (warranty + hail damage)
- Inverter events: 3
- BESS events: 2 (BMS updates)

### 6.2 Key Performance Indicators
- Availability: 99.3% (target: 99.0%)
- Mean time to repair: 3.8 hours (target: 8 hours)
- Hail damage: 22 modules replaced (insured event, May 2028)

### 6.3 Safety
Zero lost-time injuries. OSHA recordable rate: 0.0.`,
      },
    ],
  };
}
