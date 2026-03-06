/**
 * G8 Synthetic Document Package — Sonnenberg Solar + Storage
 *
 * Generates realistic individual documents for each G8 gateway requirement.
 * Each document contains intentional compliance gaps for AI detection.
 */

import { projects } from "@/data/projects";

/* ─── Types ─── */

export interface SyntheticDocument {
  id: string;
  requirementIds: string[];
  title: string;
  category: string;
  regulationIds: string[];
  content: string;
}

export interface G8DocumentPackage {
  projectId: string;
  projectName: string;
  reportingPeriod: string;
  documents: SyntheticDocument[];
}

/* ─── Batch definitions ─── */

export interface ComplianceBatch {
  id: string;
  label: string;
  documentIds: string[];
  regulationIds: string[];
  requirementIds: string[];
}

export const G8_COMPLIANCE_BATCHES: ComplianceBatch[] = [
  {
    id: "sustainability",
    label: "Sustainability Reporting (CSRD + ESRS)",
    documentIds: ["doc-csrd", "doc-esrs-e1", "doc-esrs-e2", "doc-esrs-e4", "doc-esrs-e5"],
    regulationIds: ["csrd", "esrs-e1", "esrs-e2", "esrs-e4", "esrs-e5"],
    requirementIds: ["g8-son-r2", "g8-son-r3", "g8-son-r4", "g8-son-r5", "g8-son-r12"],
  },
  {
    id: "battery-taxonomy",
    label: "Battery Passport + Taxonomy + Environmental",
    documentIds: ["doc-battery-passport", "doc-taxonomy-env"],
    regulationIds: ["eu-battery-reg", "taxonomy-cda", "nature-restoration", "fgas"],
    requirementIds: ["g8-son-r6", "g8-son-r8", "g8-son-r9", "g8-son-r10", "g8-son-r11"],
  },
  {
    id: "technical",
    label: "Technical Performance + O&M",
    documentIds: ["doc-performance", "doc-om"],
    regulationIds: [],
    requirementIds: ["g8-son-r1", "g8-son-r7", "g8-son-r13"],
  },
];

/* ─── Generator ─── */

export function generateG8DocumentPackage(projectId: string): G8DocumentPackage {
  const project = projects.find((p) => p.id === projectId);
  if (!project) throw new Error(`Project ${projectId} not found`);
  if (projectId !== "proj-sonnenberg") {
    throw new Error(`Document package only available for Sonnenberg (got ${projectId})`);
  }

  return {
    projectId,
    projectName: project.name,
    reportingPeriod: "October 2026 -- September 2027",
    documents: [
      generatePerformanceReport(),
      generateCsrdReport(),
      generateEsrsE1(),
      generateEsrsE2(),
      generateEsrsE4(),
      generateEsrsE5(),
      generateBatteryPassport(),
      generateTaxonomyEnvAssessment(),
      generateOmReport(),
    ],
  };
}

export function renderDocumentMarkdown(doc: SyntheticDocument): string {
  return `# ${doc.title}\n\n${doc.content}`;
}

export function renderPackageMarkdown(pkg: G8DocumentPackage): string {
  return pkg.documents
    .map((d) => `# ${d.title}\n\n${d.content}`)
    .join("\n\n---\n\n");
}

/* ─── 1. Annual Performance Report (IEC 61724-1) ─── */

function generatePerformanceReport(): SyntheticDocument {
  return {
    id: "doc-performance",
    requirementIds: ["g8-son-r1", "g8-son-r13"],
    title: "Annual Performance Report -- Sonnenberg Solar + Storage (IEC 61724-1)",
    category: "performance_report",
    regulationIds: [],
    content: `**Document Reference:** SONN-G8-PERF-2027-001
**Revision:** 1.0
**Date:** 30 September 2027
**Author:** SolarOps GmbH (O&M Contractor)
**Classification:** Confidential -- Lender Copy

## 1. Reporting Scope and Methodology

This report covers the 12-month performance assessment of Sonnenberg Solar + Storage for the period 1 October 2026 to 30 September 2027 in accordance with IEC 61724-1:2021 (Photovoltaic system performance -- Part 1: Monitoring) and IEC 61724-3:2016 (Part 3: Energy evaluation method).

**Plant specifications:**
- Location: Sonnenberg, Brandenburg, Germany (52.42 N, 13.18 E)
- PV capacity: 100 MWp (JinkoSolar Tiger Neo N-type 620W x 161,290 modules)
- Inverter capacity: 90 MVA (SMA Sunny Central UP, 20 units)
- BESS capacity: 100 MWh / 50 MW (BYD MC Cube T2, LFP chemistry)
- Grid connection: 110 kV via 2x 63 MVA transformers to 50Hertz Transmission
- COD: 15 September 2026

**Monitoring system:** SCADA via Meteocontrol blue'Log X-Series with 1-minute resolution. Irradiance measured by 6x Kipp & Zonen SMP10 pyranometers (2 in-plane, 4 GHI). Back-of-module temperature via 12x PT1000 sensors. Revenue meter: Landis+Gyr E850.

## 2. Resource Assessment

### 2.1 Solar Irradiation

| Parameter | Value | P50 Forecast | Deviation |
|-----------|-------|-------------|-----------|
| GHI (kWh/m2) | 1,128 | 1,105 | +2.1% |
| POA irradiance (kWh/m2) | 1,312 | 1,285 | +2.1% |
| Effective irradiance (kWh/m2) | 1,278 | 1,252 | +2.1% |

Data source: On-site pyranometers cross-referenced with DWD satellite data (SolarGIS validation). Annual GHI exceeded the long-term average (1,085 kWh/m2, 20-year SolarGIS TMY) by 4.0%.

### 2.2 Ambient Conditions

| Parameter | Annual Mean | Max | Min |
|-----------|------------|-----|-----|
| Ambient temperature | 10.8 C | 38.2 C (Jul) | -12.4 C (Jan) |
| Module temperature | 23.4 C | 62.1 C | -11.8 C |
| Wind speed (10m) | 4.2 m/s | 18.6 m/s | 0.0 m/s |

## 3. PV Performance

### 3.1 Energy Production

| Month | POA (kWh/m2) | Energy (MWh) | PR (%) | Availability (%) |
|-------|-------------|-------------|--------|-----------------|
| Oct 2026 | 72.1 | 6,842 | 79.8 | 99.4 |
| Nov 2026 | 38.5 | 3,512 | 77.2 | 99.8 |
| Dec 2026 | 22.4 | 1,985 | 75.1 | 100.0 |
| Jan 2027 | 28.9 | 2,601 | 76.3 | 99.9 |
| Feb 2027 | 52.3 | 4,812 | 78.0 | 99.6 |
| Mar 2027 | 98.6 | 9,245 | 79.5 | 99.2 |
| Apr 2027 | 138.2 | 13,105 | 80.3 | 99.0 |
| May 2027 | 168.4 | 16,021 | 80.6 | 98.8 |
| Jun 2027 | 182.1 | 17,402 | 80.9 | 98.5 |
| Jul 2027 | 191.8 | 18,212 | 80.4 | 99.1 |
| Aug 2027 | 168.5 | 16,190 | 81.4 | 99.3 |
| Sep 2027 | 150.2 | 14,501 | 81.8 | 99.7 |

**Annual totals:**
- Net energy to grid (PV): 124,428 MWh
- Gross energy (before clipping/curtailment): 127,815 MWh
- Energy lost to clipping: 1,842 MWh (1.4%)
- Energy lost to curtailment (50Hertz): 1,545 MWh (1.2%)
- Annual Performance Ratio: 81.2% (guarantee threshold: 78.0%, margin: +3.2 pp)
- Specific yield: 1,244 kWh/kWp
- Capacity factor: 14.2%

### 3.2 Loss Waterfall (IEC 61724-3)

| Loss Category | Annual (MWh) | % of Ideal |
|--------------|-------------|-----------|
| Ideal energy (STC) | 153,210 | 100.0% |
| Temperature losses | -12,257 | -8.0% |
| Soiling losses | -3,217 | -2.1% |
| Shading losses | -1,072 | -0.7% |
| Module mismatch | -1,226 | -0.8% |
| DC cable losses | -1,379 | -0.9% |
| Inverter losses | -4,596 | -3.0% |
| AC losses (transformer + cable) | -2,145 | -1.4% |
| Clipping losses | -1,842 | -1.2% |
| Curtailment | -1,545 | -1.0% |
| Downtime | -1,503 | -1.0% |
| **Net to grid** | **124,428** | **81.2%** |

### 3.3 Module Degradation

First-year degradation measured via IV curve tracing (500-module sample, August 2027):
- Median Pmax degradation: -0.8% (manufacturer guarantee: -2.0% first year)
- Standard deviation: 0.3%
- No hotspot defects detected via IR thermography
- 15 modules replaced under warranty (microcracks from transport)

### 3.4 Inverter Performance

All 20 SMA Sunny Central UP units operated within specification. Weighted average inverter efficiency: 98.2% (rated: 98.6% peak). Two firmware updates applied (v4.2.1 in January, v4.3.0 in June). No hardware failures.

## 4. BESS Performance

### 4.1 Operational Summary

| Parameter | Value | Guarantee | Status |
|-----------|-------|-----------|--------|
| Round-trip efficiency (AC-AC) | 89.2% | 88.0% | Pass |
| Full equivalent cycles | 312 | -- | -- |
| State of Health (SOH) | 98.4% | >95% at year 1 | Pass |
| Auxiliary consumption | 1,820 MWh | -- | -- |
| Revenue (ancillary services) | EUR 2.1M | -- | -- |

### 4.2 Degradation Assessment

Capacity test conducted September 2027 per manufacturer protocol:
- Measured usable capacity: 98.4 MWh (rated: 100 MWh)
- Calendar aging: -0.8%
- Cycle aging: -0.8%
- Total degradation: -1.6% (manufacturer curve predicts -1.5%, within tolerance)

### 4.3 Thermal Management

Maximum cell temperature recorded: 34.2 C (within 45 C limit). HVAC system operated normally throughout. R-410A refrigerant: no leaks detected during bi-annual checks.

## 5. Grid Compliance

### 5.1 50Hertz Grid Code Compliance

- Zero grid code violations during reporting period
- Frequency response events: 47 (all within +/-200 ms response time)
- Reactive power delivery: confirmed within cos(phi) 0.95 ind/cap range per 50Hertz requirements
- Fault ride-through: 2 events (both successfully cleared)
- Power quality: THD < 3% at PCC (limit: 5%)

### 5.2 Curtailment

Total curtailment: 1,545 MWh (1.2% of gross). All curtailment events initiated by 50Hertz redispatch. Compensation claims filed per EEG Section 14.

## 6. SCADA Data Quality

| Metric | Value | Threshold | Status |
|--------|-------|-----------|--------|
| Data completeness | 99.4% | >= 99.0% | Pass |
| Irradiance sensor availability | 99.7% | >= 98.0% | Pass |
| Revenue meter accuracy | Class 0.2S | Class 0.5S | Pass |
| Missing data gaps > 1 hour | 3 events | < 10 | Pass |
| Timestamp accuracy | +/- 1s (NTP synced) | +/- 10s | Pass |

Three data gaps were caused by SCADA communication failures (fibre optic splice repair in November 2026, router reboot in March 2027, and firmware update in June 2027). All gaps were backfilled from inverter-level data loggers within 48 hours.

## 7. Recommendations

1. Investigate soiling losses (2.1%) -- consider optimizing cleaning schedule from quarterly to bi-monthly during high-soiling months (April-September).
2. Monitor clipping losses -- if curtailment + clipping exceeds 3% annually, evaluate BESS co-optimization to absorb clipped energy.
3. Continue annual IV curve sampling to track degradation trajectory.
4. Schedule transformer oil analysis for Q1 2028.

## Appendices

- Appendix A: Monthly irradiance and energy time series (CSV export)
- Appendix B: IV curve measurement results (500-module sample)
- Appendix C: Inverter availability logs
- Appendix D: SCADA data gap register
- Appendix E: 50Hertz curtailment event log`,
  };
}

/* ─── 2. CSRD Sustainability Report ─── */

function generateCsrdReport(): SyntheticDocument {
  return {
    id: "doc-csrd",
    requirementIds: ["g8-son-r2"],
    title: "CSRD Annual Sustainability Report -- Sonnenberg Solar + Storage",
    category: "csrd_report",
    regulationIds: ["csrd"],
    content: `**Document Reference:** SONN-G8-CSRD-2027-001
**Revision:** 1.0 (Draft)
**Date:** 30 September 2027
**Author:** GreenField Energy GmbH, Sustainability Department
**Reporting standard:** Directive (EU) 2022/2464 (Corporate Sustainability Reporting Directive)
**Assurance level:** Limited assurance (pending -- auditor engagement in progress)

## 1. Business Model and Value Chain

### 1.1 Business Description

GreenField Energy GmbH operates the Sonnenberg Solar + Storage facility (100 MWp PV / 100 MWh BESS) as part of its German renewable energy portfolio. The project sells electricity under a 15-year Corporate PPA with Deutsche Bahn AG and provides ancillary services to 50Hertz via the BESS.

**Value chain overview:**
- Upstream: Module procurement (JinkoSolar, China), inverters (SMA, Germany), BESS (BYD, China), BOS (various EU suppliers)
- Operations: SolarOps GmbH (O&M contractor, Germany)
- Downstream: Deutsche Bahn AG (offtaker), 50Hertz (TSO, ancillary services)

### 1.2 Strategy and Resource Allocation

GreenField's strategy aligns with the EU Green Deal and Germany's Energiewende targets. The company targets 1 GW of operational renewable capacity by 2030 (currently: 450 MW). Capital allocation for Sonnenberg totalled EUR 98M.

[GAP: No description of how the business model and strategy are compatible with the transition to a sustainable economy and with the limiting of global warming to 1.5 C, as required by ESRS 2 SBM-1.]

### 1.3 Stakeholder Engagement

Key stakeholder groups identified:
- Local community (Sonnenberg municipality)
- Employees and contractors
- Investors and lenders (EIB, KfW)
- Regulatory bodies (BNetzA, Umweltbundesamt)

Annual community engagement meeting held in June 2027. No material complaints received.

[GAP: No description of how stakeholder views have influenced the company's sustainability strategy or material topic identification, as required by CSRD Art. 19a(2)(d) and ESRS 2 SBM-2.]

## 2. Governance

### 2.1 Board Oversight

GreenField's Management Board includes 3 members. The CFO has delegated responsibility for ESG matters. The Sonnenberg Compliance Manager (Maria Schmidt) reports quarterly to the Sustainability Committee, which meets 4 times per year.

[GAP: No description of the sustainability-related expertise and skills of the Management Board or Supervisory Board as required by CSRD Art. 19a(2)(c) and ESRS 2 GOV-1. No disclosure of sustainability-linked remuneration policies per ESRS 2 GOV-3.]

### 2.2 Risk Management

Sustainability risks are integrated into GreenField's enterprise risk management framework. Key sustainability risks identified for Sonnenberg:
- Physical climate risks (heat stress, flooding)
- Transition risks (regulatory changes, carbon pricing)
- Supply chain risks (FEOC-equivalent restrictions, forced labour)

[GAP: No description of the process for identifying and assessing material sustainability-related risks and opportunities per ESRS 2 IRO-1. No assessment of financial materiality of identified risks.]

## 3. Due Diligence

### 3.1 Supply Chain Due Diligence

GreenField conducts supply chain due diligence for major procurement. Current status:
- **JinkoSolar (modules):** SA8000 certified. Annual supplier audit completed May 2027. No findings of concern. Polysilicon traceability documentation on file (Wacker Chemie and OCI sources).
- **SMA (inverters):** German manufacturer. Self-declaration of social and environmental compliance. No third-party audit conducted.
- **BYD (BESS):** Member of the Responsible Business Alliance. Third-party audit was scheduled for Q2 2027 but has been postponed to Q4 2027 due to auditor availability.

[GAP: Due diligence process does not meet the requirements of CSRD Art. 19a(2)(f). No formal adverse impact identification process. BYD BESS audit remains incomplete. No documented remediation process for identified adverse impacts. SMA self-declaration is insufficient for Tier 1 supplier assurance.]

### 3.2 Human Rights

GreenField has a human rights policy statement. No forced labour or child labour incidents identified in the reporting period.

[GAP: No human rights impact assessment conducted for the value chain as a whole. Policy statement does not reference the UNGPs or OECD Guidelines as required by best practice under CSRD.]

## 4. Material Topics

### 4.1 Double Materiality Assessment

A double materiality assessment was conducted in Q1 2027 covering financial and impact materiality. The following topics were identified as material:

| Topic | Impact Materiality | Financial Materiality |
|-------|-------------------|---------------------|
| Climate change mitigation | High | Medium |
| Energy | High | High |
| Biodiversity | Medium | Low |
| Circular economy | Medium | Medium |
| Workers in the value chain | Medium | Low |
| Pollution | Low | Low |

[GAP: Materiality assessment does not include quantitative thresholds or scoring methodology. No stakeholder input documented in the materiality assessment process. Climate adaptation not assessed separately from mitigation, contrary to ESRS E1 requirements.]

## 5. Metrics and Targets

### 5.1 Climate Targets

GreenField has committed to net-zero Scope 1 and 2 emissions by 2035. Sonnenberg contributes approximately 85,000 tonnes of avoided CO2 annually compared to the German grid average (400 g CO2/kWh).

[GAP: No specific GHG emission reduction targets with defined base year, target year, and interim milestones as required by ESRS E1-4. No Science Based Targets initiative (SBTi) alignment disclosed. "Net-zero by 2035" claim lacks a credible pathway and residual emissions plan.]

### 5.2 Key Performance Indicators

- Annual renewable energy generated: 142.8 GWh
- Avoided GHG emissions: ~85,000 t CO2e
- Water consumption: 850 m3
- Waste generated: 12.4 tonnes
- Zero lost-time injuries
- Community investment: EUR 45,000 (local environmental fund)

## 6. Outlook

GreenField plans to complete the following sustainability improvements for Sonnenberg in 2028:
- Complete BYD supply chain audit
- Publish project-level Scope 3 emissions inventory
- Initiate SBTi commitment process
- Develop end-of-life management plan for PV modules

## Appendices

- Appendix A: GreenField Human Rights Policy (v2.0, January 2027)
- Appendix B: Double Materiality Assessment Summary
- Appendix C: Stakeholder Engagement Log`,
  };
}

/* ─── 3. ESRS E1 -- Climate Change Disclosure ─── */

function generateEsrsE1(): SyntheticDocument {
  return {
    id: "doc-esrs-e1",
    requirementIds: ["g8-son-r3"],
    title: "ESRS E1 Climate Change Disclosure -- Sonnenberg Solar + Storage",
    category: "esrs_e1_disclosure",
    regulationIds: ["esrs-e1"],
    content: `**Document Reference:** SONN-G8-E1-2027-001
**Revision:** 1.0
**Date:** 30 September 2027
**Author:** GreenField Energy GmbH, Sustainability Department
**Standard:** ESRS E1 -- Climate Change (EU 2023/2772, Annex A)

## 1. Transition Plan for Climate Change Mitigation (E1-1)

GreenField Energy GmbH is committed to supporting the transition to a climate-neutral economy. As a pure-play renewable energy company, the group's core business directly contributes to climate change mitigation.

**High-level commitments:**
- Net-zero Scope 1 and 2 by 2035
- 1 GW operational renewable capacity by 2030
- Phased replacement of SF6 switchgear with F-gas-free alternatives by 2032

[GAP: No detailed transition plan as required by E1-1. Missing: (a) GHG reduction targets aligned with 1.5 C pathway, (b) decarbonisation levers with quantified impact, (c) investment plan and CapEx allocation for transition actions, (d) locked-in GHG emissions assessment for existing assets, (e) explanation of how the plan is compatible with limiting global warming to 1.5 C. Current "net-zero by 2035" statement is aspirational, not a plan.]

## 2. Policies Related to Climate Change (E1-2)

GreenField's Climate and Energy Policy (v1.2, March 2027) covers:
- Commitment to renewable energy development
- Energy efficiency in operations
- GHG emissions monitoring and reduction
- Climate risk assessment for new projects

The policy applies to all GreenField operations including Sonnenberg.

## 3. Actions and Resources (E1-3)

Climate-related actions implemented at Sonnenberg during the reporting period:
- Switched O&M fleet to 2x electric vehicles (avoided ~4 t CO2e/yr)
- Installed LED lighting at substation and O&M building
- Optimised BESS HVAC scheduling to reduce auxiliary consumption by 8%

Planned actions:
- Replace SF6 switchgear at next planned outage (2029)
- Install on-site EV charging for all maintenance vehicles

## 4. Targets Related to Climate Change (E1-4)

| Target | Scope | Base Year | Target Year | Current Progress |
|--------|-------|-----------|-------------|-----------------|
| Net-zero S1+S2 | Corporate | 2026 | 2035 | Baseline year |
| 100% EV fleet | Sonnenberg | 2026 | 2029 | 33% (2/6 vehicles) |
| SF6 phase-out | Sonnenberg | 2026 | 2032 | 0% (planning phase) |

[GAP: Targets do not meet E1-4 requirements. No absolute GHG reduction targets expressed in tonnes CO2e. No alignment with science-based 1.5 C pathways demonstrated. No Scope 3 reduction target. No interim milestones (e.g. 2030 target). Base year emissions not disclosed for the target boundary.]

## 5. Energy Consumption and Mix (E1-5)

### 5.1 Energy Consumption from Operations

| Source | Annual Consumption | Unit |
|--------|-------------------|------|
| Grid electricity (auxiliaries) | 2,450 MWh | MWh |
| Diesel (backup generator) | 4,200 litres | litres |
| Diesel (maintenance vehicles) | 3,100 litres | litres |
| BESS HVAC system | included in grid electricity above | -- |
| **Total final energy** | **~2,520 MWh (equiv.)** | MWh |

### 5.2 Energy Intensity

- Energy intensity per MWh generated: 0.020 MWh consumed per MWh generated (2.0%)
- Energy intensity per MW installed: 25.2 MWh/MW

## 6. GHG Emissions (E1-6)

### 6.1 Scope 1 -- Direct Emissions

| Source | Emissions (t CO2e) | Methodology |
|--------|-------------------|-------------|
| Backup diesel generator | 11.2 | DEFRA 2027 factors |
| Maintenance vehicles (diesel) | 8.3 | DEFRA 2027 factors |
| SF6 leakage (switchgear) | 0.0 | Measured (no leaks) |
| SF6 installed inventory | (604.8 potential) | 24 kg x 25,200 GWP |
| R-410A (BESS HVAC) | 0.0 | Measured (no leaks) |
| **Total Scope 1** | **19.5** | |

### 6.2 Scope 2 -- Energy Indirect Emissions

| Method | Emissions (t CO2e) | Notes |
|--------|-------------------|-------|
| Location-based | 980 | German grid factor 400 g/kWh |
| Market-based | 45 | Residual mix after GO cancellation |

GreenField cancels Guarantees of Origin for 90% of auxiliary consumption.

### 6.3 Scope 3 -- Value Chain Emissions

Scope 3 emissions have not been calculated for this reporting period.

[GAP: Scope 3 emissions not reported, which is a significant omission under E1-6. For a solar + storage project, material Scope 3 categories include: (a) Category 1 -- purchased goods (embodied carbon of PV modules, BESS, inverters, steel structures), estimated at 50,000-80,000 t CO2e over lifecycle; (b) Category 2 -- capital goods; (c) Category 4 -- upstream transportation; (d) Category 12 -- end-of-life treatment. E1-6 para 51 requires disaggregated Scope 3 by significant category. GreenField should conduct a Scope 3 screening and report material categories.]

### 6.4 GHG Intensity

- Scope 1+2 (market-based) intensity: 0.52 g CO2e per kWh generated
- Lifecycle emissions estimate: approximately 30 g CO2e/kWh (based on IPCC 2014 median for utility-scale PV, not project-specific)

[GAP: Lifecycle emissions figure (30 g CO2e/kWh) is cited from generic literature, not calculated project-specifically as required for EU Taxonomy substantial contribution assessment. No LCA conducted per ISO 14040/14044.]

## 7. Climate-Related Risks -- Physical (E1-7)

### 7.1 Acute Physical Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| Extreme heat (>40 C) | Medium | Module derating, inverter shutdown | Heat-resistant module selection (Tjunction 85 C), inverter derating curves |
| Hailstorm | Low | Module breakage | 35mm hail rating (IEC 61215), insurance |
| Flooding | Low | Substation damage | Elevated electrical equipment (+1.5m) |
| Lightning | Medium | Equipment damage | IEC 62305 lightning protection installed |

### 7.2 Chronic Physical Risks

- Irradiance variability: +/-5% annual variation expected (20-year SolarGIS data)
- Temperature increase: +0.3 C/decade projected -- marginal PR impact (-0.1%/decade)

[GAP: Climate risk assessment does not cover the full expected asset lifetime (25-30 years) as required by EU Taxonomy CDA Appendix A. No RCP 8.5 / SSP5-8.5 scenario modelling. No financial quantification of climate risk impacts. Assessment was conducted during development (2024) and has not been updated to 2027 climate projections.]

## 8. Climate-Related Risks -- Transition (E1-8)

| Risk | Description | Potential Impact |
|------|------------|-----------------|
| Regulatory | Stricter reporting requirements (CSRD, ESRS) | Increased compliance costs |
| Market | PPA price volatility | Revenue uncertainty |
| Technology | Module technology obsolescence | Repowering costs |
| Reputation | Greenwashing allegations | Stakeholder trust |

No financial quantification of transition risks has been conducted.

## Appendices

- Appendix A: GHG Emissions Calculation Methodology
- Appendix B: DEFRA Emission Factor References
- Appendix C: SF6 Leak Test Certificates`,
  };
}

/* ─── 4. ESRS E2 -- Pollution Disclosure ─── */

function generateEsrsE2(): SyntheticDocument {
  return {
    id: "doc-esrs-e2",
    requirementIds: ["g8-son-r4"],
    title: "ESRS E2 Pollution Disclosure -- Sonnenberg Solar + Storage",
    category: "esrs_e2_disclosure",
    regulationIds: ["esrs-e2"],
    content: `**Document Reference:** SONN-G8-E2-2027-001
**Revision:** 1.0
**Date:** 30 September 2027
**Author:** GreenField Energy GmbH, EHS Department
**Standard:** ESRS E2 -- Pollution (EU 2023/2772, Annex A)

## 1. Policies Related to Pollution (E2-1)

GreenField's Environmental Management Policy (v2.1, January 2027) addresses pollution prevention across all operations. The policy commits to:
- Compliance with all applicable environmental permits
- Minimisation of emissions to air, water, and soil
- Substitution of hazardous substances where technically feasible
- Emergency preparedness for pollution incidents

Sonnenberg operates under BImSchG permit BRB-2025-0847 (issued 12 March 2025, valid indefinitely).

## 2. Actions and Resources (E2-2)

Actions taken during the reporting period:
- Transitioned 2 maintenance vehicles from diesel to electric (eliminates local NOx and PM emissions)
- Installed secondary containment for transformer oil (mineral oil, 24,000 litres per transformer)
- Conducted annual groundwater monitoring (4 monitoring wells, quarterly sampling)
- Updated emergency response plan for transformer oil spill scenario

## 3. Targets Related to Pollution (E2-3)

| Target | Metric | Target Year | Status |
|--------|--------|-------------|--------|
| Zero pollution incidents | Count | Ongoing | Achieved (0 incidents) |
| 100% EV maintenance fleet | Fleet % | 2029 | 33% complete |
| Eliminate diesel backup generator | Replacement | 2030 | Planning phase |

## 4. Pollution of Air, Water, and Soil (E2-4)

### 4.1 Air Emissions

Sonnenberg has negligible air emissions during normal operations. Emission sources:

| Source | Pollutant | Annual Emission | Notes |
|--------|----------|----------------|-------|
| Backup diesel generator | NOx | 12.6 kg | 18 hrs operation |
| Backup diesel generator | PM2.5 | 0.8 kg | 18 hrs operation |
| Backup diesel generator | SO2 | 0.3 kg | 18 hrs operation |
| Maintenance vehicles (diesel) | NOx | 9.2 kg | 3,100 litres diesel |
| Maintenance vehicles (diesel) | PM2.5 | 0.4 kg | Euro 6d |

Total air emissions are negligible relative to the project's avoided emissions (~85,000 t CO2e).

### 4.2 Water Pollution

- Panel cleaning: demineralised water only, no chemical additives. Total water consumption: 850 m3/year.
- Groundwater monitoring: no contamination detected in any quarterly sampling event.
- No process wastewater discharge. Sanitary wastewater connected to municipal system.

### 4.3 Soil Pollution

- No soil contamination events during the reporting period.
- Transformer secondary containment: no spills or leaks.
- Herbicide-free vegetation management (mechanical mowing only).

## 5. Substances of Concern (E2-5)

### 5.1 Substances Present in Operations

| Substance | Location | Quantity | SVHC | CLP Classification |
|-----------|----------|----------|------|-------------------|
| SF6 | MV switchgear | 24 kg | No | GHG (GWP 25,200) |
| R-410A | BESS HVAC | 12 kg | No (but high GWP) | GHG (GWP 2,088) |
| Transformer oil | 2x transformers | 48,000 litres | No | H304, H411 |
| Diesel fuel | Backup generator + vehicles | ~2,000 litres stored | No | H226, H304, H332, H411 |

### 5.2 Substances in Products/Components

[GAP: No assessment of PFAS (per- and polyfluoroalkyl substances) content in PV module backsheets. Fluoropolymer backsheets (e.g., PVF/PVDF) are widely used in crystalline silicon modules and may contain PFAS regulated under the proposed EU PFAS restriction (ECHA, February 2023). JinkoSolar Tiger Neo modules use a fluoropolymer-based backsheet -- PFAS content has not been quantified or disclosed.]

[GAP: No assessment of substances of very high concern (SVHCs) in electrical/electronic components per SCIP database reporting obligations (REACH Art. 33). Lead solder in module junction boxes, cadmium in cable insulation, and phthalate plasticisers in cable sheathing have not been assessed.]

### 5.3 Microplastics

Not applicable -- solar PV and BESS operations do not generate microplastics under normal conditions.

## 6. Noise

Operational noise at nearest sensitive receptor (residential property at 1.2 km):
- Daytime: 28 dB(A) measured (limit: 55 dB(A) per TA Larm)
- Nighttime: 26 dB(A) measured (limit: 40 dB(A) per TA Larm / BImSchG)

Primary noise sources: inverter cooling fans and BESS HVAC units. All within specification.

## 7. Incidents and Deposits

Zero pollution incidents during the reporting period. No deposits, accumulations, or contamination identified.

## Appendices

- Appendix A: BImSchG Permit (BRB-2025-0847)
- Appendix B: Groundwater Monitoring Results (Q1-Q4 2027)
- Appendix C: Transformer Oil Analysis Reports
- Appendix D: Noise Measurement Report (June 2027)`,
  };
}

/* ─── 5. ESRS E4 -- Biodiversity Disclosure ─── */

function generateEsrsE4(): SyntheticDocument {
  return {
    id: "doc-esrs-e4",
    requirementIds: ["g8-son-r5"],
    title: "ESRS E4 Biodiversity and Ecosystems Disclosure -- Sonnenberg Solar + Storage",
    category: "esrs_e4_disclosure",
    regulationIds: ["esrs-e4"],
    content: `**Document Reference:** SONN-G8-E4-2027-001
**Revision:** 1.0
**Date:** 30 September 2027
**Author:** Brandenburg Environmental Consultants GbR (commissioned by GreenField Energy GmbH)
**Standard:** ESRS E4 -- Biodiversity and Ecosystems (EU 2023/2772, Annex A)

## 1. Transition Plan and Consideration of Biodiversity (E4-1)

GreenField Energy GmbH recognises biodiversity as a material sustainability topic for its solar operations. The company's Biodiversity Policy (v1.0, June 2027) commits to:
- Avoiding significant adverse impacts on biodiversity
- Implementing biodiversity enhancement measures at all solar sites
- Supporting pollinator-friendly vegetation management
- Compliance with all ecological permit conditions

[GAP: No formal transition plan addressing how operations will move towards no net loss or net positive impact on biodiversity, as indicated in E4-1. No quantified targets or timelines for biodiversity improvement.]

## 2. Policies Related to Biodiversity (E4-2)

GreenField's Biodiversity Policy covers:
- Pre-construction ecological baseline surveys
- Construction-phase ecological clerk of works
- Operational-phase annual ecological monitoring
- Decommissioning-phase habitat restoration

The policy applies to all GreenField solar and storage projects.

## 3. Actions and Resources (E4-3)

Biodiversity actions implemented at Sonnenberg:
- **Pollinator meadow:** 45 hectares seeded with native wildflower mix (seeded March 2026, established). Species include Centaurea jacea, Leucanthemum vulgare, Knautia arvensis, and Salvia pratensis.
- **Sheep grazing:** Contracted with local farm for low-intensity grazing (30 Skudde sheep, April-October).
- **Bird boxes:** 20 nest boxes installed (10x Parus major, 5x Falco tinnunculus, 5x Athene noctua).
- **Hedgerow planting:** 800m of native hedgerow (Crataegus monogyna, Prunus spinosa, Rosa canina) planted along southern boundary.

Annual expenditure on biodiversity measures: EUR 28,000.

## 4. Targets Related to Biodiversity (E4-4)

[GAP: No quantified biodiversity targets as required by E4-4. Specifically missing:
- No net loss or net positive gain commitment with quantified metrics
- No measurable targets for habitat quality, species abundance, or connectivity
- No reference to recognised frameworks (TNFD, SBTN, CBD GBF Target 15)
- No baseline against which progress can be measured
Current actions (pollinator meadow, nest boxes) are positive but lack outcome-based targets.]

## 5. Impact Metrics (E4-5)

### 5.1 Land Use and Land Use Change

| Metric | Value |
|--------|-------|
| Total site area | 180 hectares |
| Area under panels | 95 hectares |
| Infrastructure (roads, substation, BESS) | 12 hectares |
| Undeveloped / buffer zones | 73 hectares |
| Previous land use | Arable agriculture (wheat, rapeseed) |
| Land use change date | Construction commenced Q2 2025 |

[GAP: No land use change metrics reported as required by E4-5. Missing: (a) area of land converted per ecosystem type, (b) hectares sealed/compacted, (c) proximity to Natura 2000 sites -- the Sonnenberg Heide SPA (DE 3748-421) is located 4.2 km to the northeast, but no appropriate assessment or screening has been referenced in this disclosure.]

### 5.2 Ecological Monitoring Results (2027 Survey)

Annual ecological monitoring was conducted 12-14 June 2027 by Brandenburg Environmental Consultants. Key findings:

**Vegetation:**
- Pollinator meadow establishment: 78% target species coverage (good)
- 32 flowering plant species identified (baseline pre-construction: 12 species in arable monoculture)
- No invasive species detected

**Birds (point count survey, 8 survey points):**
- 34 species recorded (28 breeding, 6 passage)
- Species of conservation interest:
  - Lanius collurio (Red-backed Shrike) -- 2 breeding pairs (declining species)
  - Milvus milvus (Red Kite) -- foraging, not breeding on site
  - Alauda arvensis (Skylark) -- 8 territories (vs. 12 pre-construction baseline)

**Note on Skylark:** Skylark territory count declined from 12 (2024 baseline) to 8. This is consistent with the known response of Skylarks to solar farm construction (panel avoidance). Mitigation: Skylark plots (4x 20m x 20m open areas within the array) were created in Q3 2027.

**Invertebrates (pitfall traps + transect walks):**
- 145 invertebrate species identified (vs. 82 in 2024 arable baseline)
- Notable: 12 bee species including Bombus sylvarum (regionally scarce)
- Butterfly transect: 18 species, population density 3.2x higher than arable baseline

**Mammals:**
- Brown hare (Lepus europaeus): regular sightings
- Roe deer (Capreolus capreolus): using buffer zones
- No evidence of bat roosts on infrastructure; 5 bat species recorded foraging

### 5.3 IUCN Red List Assessment

[GAP: No formal IUCN Red List species impact assessment as required by E4-5. While some species of conservation interest are noted, no systematic screening against IUCN Red List, German Federal Red List, or Brandenburg State Red List has been conducted. Lanius collurio is listed on Annex I of the EU Birds Directive -- its presence requires specific monitoring and reporting under Article 12.]

## 6. Natura 2000 and Protected Areas

The nearest Natura 2000 site is Sonnenberg Heide SPA (DE 3748-421), located 4.2 km northeast.

[GAP: No Habitats Directive Article 6(3) appropriate assessment or screening conducted despite proximity to Natura 2000 site. While 4.2 km may be considered sufficient distance for a solar farm, the presence of foraging Red Kite and potential bat commuting routes between the site and the SPA should trigger at least a screening assessment. No reference to the original EIA's conclusions on Natura 2000 impacts.]

## 7. Dependencies on Ecosystem Services

Sonnenberg's operational dependencies on ecosystem services are limited:
- Pollination: not applicable to energy generation
- Water regulation: minimal -- site drainage designed for 1-in-100-year storm event
- Soil stability: maintained through permanent vegetation cover

## Appendices

- Appendix A: Ecological Monitoring Report (Brandenburg Environmental Consultants, July 2027)
- Appendix B: Bird Survey Data Sheets
- Appendix C: Invertebrate Species List
- Appendix D: Vegetation Quadrat Data`,
  };
}

/* ─── 6. ESRS E5 -- Circular Economy Disclosure ─── */

function generateEsrsE5(): SyntheticDocument {
  return {
    id: "doc-esrs-e5",
    requirementIds: ["g8-son-r12"],
    title: "ESRS E5 Resource Use and Circular Economy Disclosure -- Sonnenberg Solar + Storage",
    category: "esrs_e5_disclosure",
    regulationIds: ["esrs-e5"],
    content: `**Document Reference:** SONN-G8-E5-2027-001
**Revision:** 1.0
**Date:** 30 September 2027
**Author:** GreenField Energy GmbH, Sustainability Department
**Standard:** ESRS E5 -- Resource Use and Circular Economy (EU 2023/2772, Annex A)

## 1. Policies Related to Resource Use and Circular Economy (E5-1)

GreenField's Waste Management and Circular Economy Policy (v1.0, March 2027) addresses:
- Waste minimisation and segregation at source
- Preference for reuse and recycling over disposal
- Compliance with WEEE Directive obligations for end-of-life PV modules
- Engagement with suppliers on product design for recyclability

## 2. Actions and Resources (E5-2)

Circular economy actions at Sonnenberg:
- Established waste segregation system (5 streams: metals, plastics, glass, hazardous, general)
- Contracted certified waste management provider (Remondis GmbH)
- Enrolled in PV CYCLE for end-of-life module collection (registration pending)

## 3. Targets Related to Resource Use (E5-3)

| Target | Metric | Target Year | Status |
|--------|--------|-------------|--------|
| Zero waste to landfill | Diversion rate | 2028 | 85% diversion (2027) |
| PV CYCLE registration | Registration | Q1 2028 | In progress |

[GAP: No circular economy targets as required by E5-3. Missing: (a) targets for increasing recycled content in procurement, (b) targets for waste reduction, (c) targets for extending product lifetime. No quantified targets for end-of-life material recovery rates.]

## 4. Resource Inflows (E5-4)

### 4.1 Materials Inventory

[GAP: No material inflow reporting as required by E5-4. For a solar + storage facility, the following material flows should be disclosed:

Estimated material inventory (not reported):
- Silicon (modules): ~2,500 tonnes
- Glass (modules): ~12,000 tonnes
- Aluminium (frames, structures): ~4,500 tonnes
- Steel (structures, fencing): ~8,000 tonnes
- Copper (cables, transformers): ~800 tonnes
- Lithium iron phosphate (BESS): ~450 tonnes
- Polymers (cables, backsheets): ~500 tonnes

None of the above has been quantified. No distinction made between renewable and non-renewable materials. No recycled content data for any material category.]

### 4.2 Water Use

Total water consumption: 850 m3/year (panel cleaning only, demineralised water).
Source: Municipal supply (Sonnenberg Wasserbetrieb).

## 5. Resource Outflows (E5-5)

### 5.1 Waste Streams

| Waste Category | Quantity (t) | Treatment | EWC Code |
|---------------|-------------|-----------|----------|
| Used transformer oil | 0.4 | Recycled | 13 03 07* |
| Used hydraulic oil | 0.1 | Recycled | 13 01 10* |
| Cleaning solvents | 0.3 | Incineration (energy recovery) | 14 06 03* |
| **Total hazardous** | **0.8** | | |
| Mixed packaging waste | 4.2 | Recycled | 15 01 06 |
| Scrap metal (aluminium) | 3.8 | Recycled | 17 04 02 |
| Scrap cable | 1.2 | Recycled | 17 04 11 |
| General waste | 2.4 | Landfill | 20 03 01 |
| **Total non-hazardous** | **11.6** | | |
| **Total waste** | **12.4** | | |

Diversion from landfill: 10.0 t / 12.4 t = 80.6%

### 5.2 Products and Materials

15 PV modules were replaced under warranty during the reporting period. Defective modules were returned to JinkoSolar under their take-back programme.

## 6. End-of-Life Management

### 6.1 PV Modules

[GAP: No end-of-life management plan for PV modules as required by WEEE Directive (2012/19/EU) and ESRS E5. Sonnenberg has 161,290 PV modules with an expected lifetime of 25-30 years. At end of life, these represent approximately 14,500 tonnes of waste (glass, silicon, aluminium, polymers). While PV CYCLE registration is in progress, no financial provisioning for end-of-life costs has been established. No recyclability assessment per module type.]

### 6.2 BESS

[GAP: No battery second-life assessment or recycling plan as required by EU Battery Regulation (2023/1542) and ESRS E5. The 100 MWh BYD BESS contains approximately 450 tonnes of lithium iron phosphate cells. No assessment of:
- Second-life application feasibility
- Recycling process and expected material recovery rates (EU Battery Regulation requires 70% Li recovery by 2027)
- End-of-life logistics and costs
- Financial provisioning for decommissioning]

### 6.3 Other Equipment

No end-of-life plans exist for inverters, transformers, or steel structures. These are assumed to be recycled through standard metal recycling channels at decommissioning.

## Appendices

- Appendix A: Waste Transfer Notes (2027)
- Appendix B: Remondis Service Agreement
- Appendix C: PV CYCLE Registration Application`,
  };
}

/* ─── 7. Battery Passport Data Sheet ─── */

function generateBatteryPassport(): SyntheticDocument {
  return {
    id: "doc-battery-passport",
    requirementIds: ["g8-son-r6"],
    title: "Battery Passport Data Sheet -- Sonnenberg BESS (EU 2023/1542)",
    category: "battery_passport",
    regulationIds: ["eu-battery-reg"],
    content: `**Document Reference:** SONN-G8-BATT-2027-001
**Revision:** 1.0
**Date:** 30 September 2027
**Author:** GreenField Energy GmbH, Asset Management
**Regulation:** Regulation (EU) 2023/1542 concerning batteries and waste batteries (EU Battery Regulation)
**Battery category:** Industrial battery (Art. 2(12)) with capacity > 2 kWh

---

## PART A: General Information (Art. 77, Annex XIII)

### A.1 Battery Identification

| Field | Value |
|-------|-------|
| Manufacturer | BYD Company Ltd. |
| Manufacturer address | No. 1, Yan'an Road, Kuichong, Dapeng New District, Shenzhen, Guangdong, China |
| EU Authorised Representative | BYD Europe B.V., Schiphol, Netherlands |
| Battery model | MC Cube T2-100 |
| Battery type | Stationary energy storage system (industrial) |
| Chemistry | Lithium Iron Phosphate (LiFePO4 / LFP) |
| Nominal capacity | 100 MWh |
| Nominal voltage | 800 V DC |
| Number of cells | 204,800 (3.2V prismatic cells) |
| Manufacturing date | October 2025 |
| Manufacturing location | BYD Shenzhen Factory, Guangdong, China |
| Serial number | BYD-MCC-T2-2025-SN78442 |
| Batch number | BATCH-2025-Q4-DE-001 |
| Weight | ~380 tonnes (cells + racks + BMS + HVAC) |
| Expected lifetime | 15 years / 6,000 cycles |

### A.2 Installation Details

| Field | Value |
|-------|-------|
| Installation date | August 2026 |
| Installation location | Sonnenberg, Brandenburg, Germany |
| Grid connection | 110 kV (50Hertz Transmission) |
| Operator | GreenField Energy GmbH |
| Application | Grid-scale energy storage (ancillary services + PPA optimisation) |

### A.3 QR Code and Digital Passport Link

[GAP: QR code has not been assigned. Digital passport link not yet available. Art. 77(3) requires a QR code providing access to the battery passport from 18 February 2027. BYD has indicated the EU Battery Passport Platform is not yet operational, but this does not exempt the obligation to have a QR code linking to the required information. GreenField and BYD must implement interim digital passport access.]

## PART B: Carbon Footprint (Art. 7)

### B.1 Carbon Footprint Declaration

[GAP: Carbon footprint declaration has not been provided. Art. 7(1) requires industrial batteries placed on the EU market to bear a carbon footprint declaration from 18 August 2025. This deadline has passed. BYD has committed to providing lifecycle carbon footprint data by Q4 2027, but this represents a 2+ year delay from the regulatory deadline.

Required information not yet provided:
- Total carbon footprint (kg CO2e)
- Carbon footprint per kWh of rated capacity (kg CO2e/kWh)
- Carbon footprint per lifecycle stage (raw material, manufacturing, distribution, end-of-life)
- Reference to the calculation methodology (Commission Delegated Regulation under Art. 7(2))
- Web link to the carbon footprint study]

### B.2 Carbon Footprint Performance Class

Not assignable without carbon footprint declaration. Art. 7(3) performance classes (A-E) cannot be determined.

## PART C: Recycled Content (Art. 8, Art. 10)

### C.1 Recycled Content Share

[GAP: Recycled content data has been requested from BYD but not received. Art. 10(1) requires declaration of recycled content share for the following materials:

| Material | Required Disclosure | BYD Declaration | Status |
|----------|-------------------|-----------------|--------|
| Cobalt | % recycled content | N/A (LFP -- no cobalt) | Not applicable |
| Lithium | % recycled content | Not provided | MISSING |
| Nickel | % recycled content | N/A (LFP -- no nickel) | Not applicable |
| Lead | % recycled content | Not provided | MISSING |

While minimum recycled content thresholds under Art. 8 do not take effect until 2031 (18% Li) and 2036 (25% Li), the declaration obligation under Art. 10 is active now. GreenField must obtain this data from BYD.]

## PART D: Performance and Durability (Art. 10, Annex IV)

### D.1 Rated Performance

| Parameter | At Installation | Current (Sep 2027) |
|-----------|----------------|-------------------|
| Rated capacity | 100 MWh | 98.4 MWh |
| Round-trip efficiency (AC-AC) | 90.5% | 89.2% |
| Self-discharge rate | < 2%/month | < 2%/month |
| Maximum power output | 50 MW | 50 MW |
| Operating temperature range | -10 C to +55 C | Confirmed |

### D.2 State of Health

| Metric | Value | Method |
|--------|-------|--------|
| State of Health (SOH) | 98.4% | Capacity test (Sep 2027) |
| Full equivalent cycles | 312 | BMS logged |
| Calendar age | 24 months | From manufacturing date |
| Remaining useful life (estimated) | 13+ years | Based on degradation curve |
| Capacity fade | -1.6% | Measured vs rated |

### D.3 Degradation Profile

Capacity degradation is within BYD's warranty curve (guaranteed >= 80% SOH at 10 years / 5,000 cycles). Current trajectory projects ~92% SOH at year 5 and ~85% at year 10.

## PART E: Supply Chain Due Diligence (Art. 48-52)

### E.1 Due Diligence Policy

BYD is a member of the Responsible Business Alliance (RBA) and has published a Responsible Minerals Sourcing Policy. GreenField has obtained a copy (BYD-RMP-2026-v3.0).

### E.2 Supply Chain Risk Assessment

[GAP: Due diligence records per Art. 48 are incomplete. Art. 48(2) requires economic operators to implement a supply chain due diligence policy conforming to internationally recognised standards (OECD Due Diligence Guidance for Responsible Supply Chains of Minerals). The following gaps exist:

1. **No independent third-party audit** has been conducted. The Q2 2027 audit was postponed to Q4 2027. Art. 48(3) requires verification by notified bodies.
2. **No supply chain risk assessment documentation** available for review. Art. 49 requires identification and assessment of adverse impacts in the supply chain.
3. **Lithium sourcing:** BYD sources lithium from multiple suppliers including Ganfeng Lithium (China) and SQM (Chile). No documentation of specific mine-level traceability.
4. **Graphite sourcing:** Natural graphite sourced from China (Heilongjiang province). No conflict mineral assessment or traceability documentation.
5. **Manganese sourcing:** Small quantities in LFP cathode. No traceability documentation.]

### E.3 Raw Material Sourcing Summary

| Material | Primary Source | Traceability Level | Third-Party Verified |
|----------|---------------|-------------------|---------------------|
| Lithium carbonate | Ganfeng (China), SQM (Chile) | Supplier declaration only | No |
| Iron phosphate | CATL Materials (China) | Supplier declaration only | No |
| Natural graphite | Heilongjiang (China) | Country-level only | No |
| Aluminium (casings) | Novelis (Germany) | Certified recycled content | Yes |
| Copper (busbars) | Aurubis (Germany) | Certified | Yes |

## PART F: Collection and Recycling (Art. 59-62)

### F.1 End-of-Life Responsibility

BYD offers a take-back programme for industrial batteries through their EU subsidiary. Contractual arrangements for Sonnenberg:
- BYD responsible for transport from site to recycling facility
- Recycling target: 70% material recovery by weight (Art. 71)

### F.2 Recycling Readiness

[GAP: No specific recycling facility identified for end-of-life processing. No assessment of whether second-life applications (e.g., behind-the-meter storage) are feasible before recycling. No financial provisioning for end-of-life costs (estimated EUR 2-5M for 100 MWh system). The BYD take-back programme terms are vague and do not specify recycling location, process, or material recovery guarantees.]

## PART G: Safety and Compliance

### G.1 Certifications

| Certification | Standard | Status | Certificate No. |
|--------------|----------|--------|----------------|
| System certification | UL 9540:2020 | Valid | UL-9540-2025-78442 |
| Cell safety | IEC 62619:2022 | Valid | IEC-62619-BYD-2025-001 |
| BMS functional safety | IEC 61508 SIL 2 | Valid | TUV-61508-BYD-2025 |
| Transport | UN 38.3 | Valid | UN383-BYD-2025-Q4 |
| CE marking | LVD + EMC | Applied | -- |

### G.2 Safety Events

Zero thermal events, fires, or safety incidents during the reporting period.

## Appendices

- Appendix A: BYD Product Data Sheet (MC Cube T2-100)
- Appendix B: Capacity Test Report (September 2027)
- Appendix C: BYD Responsible Minerals Sourcing Policy (v3.0)
- Appendix D: Safety Certification Certificates`,
  };
}

/* ─── 8. EU Taxonomy & Environmental Compliance Assessment ─── */

function generateTaxonomyEnvAssessment(): SyntheticDocument {
  return {
    id: "doc-taxonomy-env",
    requirementIds: ["g8-son-r8", "g8-son-r9", "g8-son-r10", "g8-son-r11"],
    title: "EU Taxonomy Alignment & Environmental Compliance Assessment -- Sonnenberg Solar + Storage",
    category: "taxonomy_assessment",
    regulationIds: ["taxonomy-cda", "nature-restoration", "fgas"],
    content: `**Document Reference:** SONN-G8-TAX-2027-001
**Revision:** 1.0
**Date:** 30 September 2027
**Author:** GreenField Energy GmbH, Regulatory Affairs
**Regulations:** EU Taxonomy Regulation (2020/852), Climate Delegated Act (2021/2139), Nature Restoration Regulation (2024/1735), F-Gas Regulation (2024/573)

---

## SECTION 1: EU TAXONOMY ALIGNMENT

### 1.1 Activity Classification

| Activity | NACE Code | Taxonomy Activity | Eligible |
|----------|-----------|------------------|----------|
| Solar PV electricity generation | D35.11 | 4.1 Electricity generation from solar PV | Yes |
| Battery energy storage | D35.11 | 4.10 Storage of electricity | Yes |

### 1.2 Substantial Contribution -- Climate Change Mitigation (Objective 1)

**Activity 4.1 -- Solar PV:**
The Taxonomy CDA requires that lifecycle GHG emissions from solar PV electricity generation are below 100 g CO2e/kWh.

Estimated lifecycle emissions: approximately 30 g CO2e/kWh based on IPCC 2014 median for utility-scale PV.

Assessment: Substantially contributes to climate change mitigation.

[GAP: The 30 g CO2e/kWh figure is based on generic IPCC literature, not a project-specific lifecycle assessment. The Taxonomy CDA Technical Screening Criteria reference ISO 14067. A project-specific carbon footprint assessment should be conducted, accounting for actual module manufacturing location (China), BESS manufacturing, transportation distances, and site-specific balance-of-system materials.]

**Activity 4.10 -- Battery storage:**
The Taxonomy CDA requires that the storage facility's primary purpose is to store renewable electricity. Sonnenberg BESS is co-located with the solar PV plant and primarily serves PPA optimisation and ancillary services.

Assessment: Substantially contributes to climate change mitigation.

### 1.3 DNSH Assessment -- Climate Change Adaptation (Objective 2)

**Requirement:** The activity must not lead to increased adverse impact of the current climate and the expected future climate on the activity itself or on people, nature, or assets (Appendix A of the Climate Delegated Act).

**Climate risk assessment summary:**
A physical climate risk assessment was conducted during the development phase (Q3 2024) by RiskConsult GmbH. Key findings:

| Hazard | Assessment | Horizon | Mitigation |
|--------|-----------|---------|-----------|
| Heat stress | Medium risk | 2040 | Heat-resistant modules, inverter derating |
| River flooding | Low risk | 2040 | Site elevation +2m above floodplain |
| Drought | Low risk | -- | Not material for operations |
| Wildfire | Low risk | -- | Fire breaks, vegetation management |
| Windstorm | Medium risk | 2040 | Structures rated to 150 km/h |
| Hailstorm | Medium risk | 2040 | IEC 61215 hail rating (35mm) |

[GAP: Climate risk assessment was conducted in 2024 and covers only a 15-year horizon to 2040. Appendix A of the Taxonomy CDA requires the assessment to cover "the expected lifetime of the activity" which for a solar PV plant is 25-30 years (to ~2052-2057). The assessment must include RCP 8.5 / SSP5-8.5 high-emission scenario projections. No financial quantification of adaptation costs. Assessment needs updating to current IPCC AR6 climate projections and extending the time horizon.]

### 1.4 DNSH Assessment -- Sustainable Use of Water (Objective 3)

Water consumption is limited to panel cleaning (850 m3/year from municipal supply). No process water discharge. Water management plan in place.

Assessment: DNSH -- Water criterion met.

### 1.5 DNSH Assessment -- Circular Economy (Objective 4)

**Activity 4.1 -- Solar PV (CDA Section 4.1 DNSH(4)):**
The CDA requires that a waste management plan is in place ensuring recycling at end of life, including through contractual agreements with waste management partners or through take-back or public collection schemes.

[GAP: No comprehensive waste management plan ensuring recycling at end of life. While PV CYCLE registration is in progress, no contractual arrangements are finalised for end-of-life module recycling. No assessment of component durability and recyclability as required by DNSH(4). Specifically:
- Module recyclability: not assessed (estimated 85-95% recoverable by weight)
- Inverter recyclability: not assessed
- Cable and structural steel: assumed recyclable but not documented
- No financial provisioning for end-of-life costs]

**Activity 4.10 -- Battery storage (CDA Section 4.10 DNSH(4)):**
The CDA requires a waste management plan for batteries, including assessment of second-life applications.

[GAP: No battery second-life assessment has been conducted. No waste management plan specific to the BESS. The BYD take-back programme is referenced but contractual terms are insufficiently detailed (see Battery Passport document for details). The EU Battery Regulation Art. 59 requirements for end-of-life management are not addressed in a standalone plan.]

### 1.6 DNSH Assessment -- Pollution Prevention (Objective 5)

[GAP: PFAS assessment not conducted for PV module components. JinkoSolar Tiger Neo modules use fluoropolymer-based backsheets which may contain PFAS substances subject to the proposed EU-wide PFAS restriction. No F-gas assessment for BESS cooling system documented in the Taxonomy context (see Section 3 below for standalone F-Gas compliance). No REACH SVHC screening for installed components.]

### 1.7 DNSH Assessment -- Biodiversity (Objective 6)

An Environmental Impact Assessment (EIA) was completed during the development phase (Brandenburg State Environmental Agency, approved December 2024).

[GAP: No ongoing biodiversity monitoring results have been formally reported against the original EIA commitments within the Taxonomy context. The ESRS E4 disclosure (separate document) contains monitoring data, but no formal Taxonomy DNSH(6) assessment has been conducted to demonstrate ongoing compliance. Additionally, no Natura 2000 appropriate assessment has been referenced despite the project's proximity (4.2 km) to Sonnenberg Heide SPA (DE 3748-421).]

### 1.8 Minimum Safeguards

GreenField has policies aligned with:
- OECD Guidelines for Multinational Enterprises
- UN Guiding Principles on Business and Human Rights
- ILO Core Conventions

Human rights due diligence gaps are noted in the CSRD disclosure.

### 1.9 Taxonomy Alignment Summary

| Criterion | 4.1 Solar PV | 4.10 Battery Storage |
|-----------|-------------|---------------------|
| Substantial Contribution | Pass (with caveat) | Pass |
| DNSH -- Adaptation | Fail (incomplete) | Fail (incomplete) |
| DNSH -- Water | Pass | Pass |
| DNSH -- Circular Economy | Fail | Fail |
| DNSH -- Pollution | Fail (PFAS gap) | Fail (PFAS gap) |
| DNSH -- Biodiversity | Fail (incomplete) | Fail (incomplete) |
| Minimum Safeguards | Pass (with caveats) | Pass (with caveats) |
| **Overall Alignment** | **Not Aligned** | **Not Aligned** |

---

## SECTION 2: NATURE RESTORATION REGULATION (EU 2024/1735)

### 2.1 Applicability

Sonnenberg benefits from the overriding public interest (OPI) presumption under Art. 11 of the Nature Restoration Regulation for renewable energy installations. This means:
- Planning, construction, and operation of the plant is presumed to be in the overriding public interest
- Streamlined permitting applies
- No derogation under Habitats Directive Art. 6(4) required solely for the renewable energy purpose

### 2.2 Art. 11(6) -- Contribution to Ecosystem Restoration

[GAP: Art. 11(6) may require renewable energy installations near restoration target areas to contribute to ecosystem restoration efforts. No assessment has been conducted of whether Sonnenberg is within or adjacent to a designated restoration target area. No formal contribution to ecosystem restoration targets has been committed. The pollinator meadow and hedgerow planting (documented in ESRS E4 disclosure) may partially satisfy this requirement, but have not been framed or quantified as a formal restoration contribution.]

### 2.3 Biodiversity Enhancement Measures

Summary of measures (cross-reference ESRS E4 disclosure):
- 45 ha pollinator meadow
- 800m native hedgerow
- 20 bird nest boxes
- Skylark plots (4x 20m x 20m)

No quantified enhancement metrics or restoration targets set.

---

## SECTION 3: F-GAS REGULATION COMPLIANCE (EU 2024/573)

### 3.1 F-Gas Inventory

| Equipment | Substance | Quantity | GWP | CO2e (tonnes) | Art. 4 Threshold |
|-----------|----------|----------|-----|---------------|-----------------|
| MV switchgear (3 units) | SF6 | 24 kg | 25,200 | 604.8 | >= 5 t CO2e: annual leak check |
| BESS HVAC (2 units) | R-410A | 12 kg | 2,088 | 25.1 | >= 5 t CO2e: annual leak check |

### 3.2 Leak Checks (Art. 4)

| Equipment | Last Check | Result | Next Due | Certified Technician |
|-----------|-----------|--------|----------|---------------------|
| MV switchgear | 15 Mar 2027 | No leaks | 15 Mar 2028 | TUV Rheinland (Cert. DE-FGAS-2025-1142) |
| BESS HVAC unit 1 | 22 Apr 2027 | No leaks | 22 Apr 2028 | Kalte-Klima GmbH (Cert. DE-FGAS-2024-0891) |
| BESS HVAC unit 2 | 22 Apr 2027 | No leaks | 22 Apr 2028 | Kalte-Klima GmbH (Cert. DE-FGAS-2024-0891) |

### 3.3 Record Keeping (Art. 4(4)(d))

F-gas records are maintained in GreenField's central EHS database. Records include:
- Equipment identification and location
- Quantity and type of F-gas (charged, recovered, topped up)
- Date and results of all leak checks
- Technician certification details
- Any leakage detected and actions taken

### 3.4 Phase-Down Compliance

SF6 is subject to phase-down provisions. GreenField has committed to replacing SF6 switchgear with clean-air (vacuum or C4-PFK) alternatives at the next planned outage (targeted 2029). R-410A will be subject to HFC phase-down quotas; replacement with R-290 (propane) or R-32 alternatives will be evaluated during next HVAC replacement cycle.

### 3.5 Compliance Status

| Requirement | Status |
|-------------|--------|
| Art. 3 -- Prohibition of intentional release | Compliant |
| Art. 4 -- Leak checks | Compliant |
| Art. 4(4)(d) -- Record keeping | Compliant |
| Art. 8 -- Recovery during servicing | N/A (no servicing events) |
| Art. 11 -- Reporting to EU registry | Compliant (reported via BNetzA portal) |

---

## Appendices

- Appendix A: RiskConsult Climate Risk Assessment (Q3 2024)
- Appendix B: EU Taxonomy Self-Assessment Workbook
- Appendix C: F-Gas Leak Check Certificates (2027)
- Appendix D: SF6 Switchgear Replacement Feasibility Study (Draft)`,
  };
}

/* ─── 9. O&M Annual Report ─── */

function generateOmReport(): SyntheticDocument {
  return {
    id: "doc-om",
    requirementIds: ["g8-son-r7"],
    title: "O&M Annual Report -- Sonnenberg Solar + Storage",
    category: "om_report",
    regulationIds: [],
    content: `**Document Reference:** SONN-G8-OM-2027-001
**Revision:** 1.0
**Date:** 30 September 2027
**Author:** SolarOps GmbH (O&M Contractor)
**Contract Reference:** GFE-SONN-OMA-2026-001

## 1. Executive Summary

SolarOps GmbH has provided Operations and Maintenance services for Sonnenberg Solar + Storage since COD (15 September 2026). This report covers the first full contract year (1 October 2026 to 30 September 2027).

**Key achievements:**
- Plant availability: 99.1% (target: 99.0%)
- Mean time to repair (MTTR): 4.2 hours (target: 8 hours)
- Zero lost-time injuries
- All preventive maintenance completed on schedule
- Warranty claim resolution: average 12 days

## 2. Organisation and Resources

### 2.1 Team Structure

| Role | Name | Location |
|------|------|----------|
| Site Manager | Klaus Weber | On-site |
| PV Technician (Lead) | Andreas Muller | On-site |
| PV Technician | Sophie Braun | On-site |
| BESS Technician | Marco Richter | On-site (Mon-Fri) |
| Electrical Engineer | Dr. Lisa Hoffmann | Regional office, Berlin |
| SCADA Engineer | Tobias Schneider | Remote (Freiburg) |

### 2.2 Subcontractors

| Service | Contractor | Contract Value |
|---------|-----------|---------------|
| BESS maintenance (OEM) | BYD Service Europe | EUR 185,000/yr |
| Inverter maintenance (OEM) | SMA Service | EUR 92,000/yr |
| Panel cleaning | CleanTech Brandenburg | EUR 38,000/yr |
| Vegetation management | Landschaftspflege Sonnenberg | EUR 22,000/yr |
| High-voltage maintenance | Siemens Energy Service | EUR 45,000/yr |

## 3. Preventive Maintenance

### 3.1 Schedule Adherence

| Maintenance Type | Frequency | Planned | Completed | Compliance |
|-----------------|-----------|---------|-----------|-----------|
| Module visual inspection | Quarterly | 4 | 4 | 100% |
| Inverter inspection | Monthly | 12 | 12 | 100% |
| BESS inspection | Monthly | 12 | 12 | 100% |
| Transformer inspection | Quarterly | 4 | 4 | 100% |
| HV switchgear inspection | Semi-annual | 2 | 2 | 100% |
| Panel cleaning | Quarterly | 4 | 4 | 100% |
| Vegetation management | 6x/year | 6 | 6 | 100% |
| IR thermography (modules) | Annual | 1 | 1 | 100% |
| IV curve testing | Annual | 1 | 1 | 100% |
| BESS capacity test | Annual | 1 | 1 | 100% |
| Fire system inspection | Annual | 1 | 1 | 100% |
| **Total** | | **48** | **48** | **100%** |

### 3.2 Key Preventive Maintenance Activities

**Q1 (Oct-Dec 2026):**
- Initial post-COD snagging inspection completed
- First quarterly module visual inspection (no defects)
- BESS commissioning verification checks
- Fire suppression system annual test

**Q2 (Jan-Mar 2027):**
- Winter inspection after frost/snow events
- Inverter firmware update (SMA v4.2.1 -- grid code compliance patch)
- SF6 leak check (no leaks)
- Panel cleaning (post-winter soiling)

**Q3 (Apr-Jun 2027):**
- Spring ecological monitoring coordination (with Brandenburg Environmental Consultants)
- R-410A leak check (no leaks)
- Transformer oil sampling and analysis (within specification)
- BESS HVAC filter replacement

**Q4 (Jul-Sep 2027):**
- Annual IR thermography survey (15 hotspots identified, all below threshold)
- Annual IV curve testing (500-module sample)
- BESS annual capacity test (98.4 MWh)
- Inverter firmware update (SMA v4.3.0 -- performance optimisation)

## 4. Corrective Maintenance

### 4.1 Summary

Total corrective maintenance events: 8

| Event | Date | Component | Description | Downtime | Resolution |
|-------|------|-----------|-------------|----------|-----------|
| CM-001 | 12 Nov 2026 | SCADA | Fibre optic splice failure, communication loss | 6.2 hrs | Splice repair |
| CM-002 | 28 Dec 2026 | PV modules | 3 modules cracked (frost heave on mounting) | 0 hrs | Replaced under warranty |
| CM-003 | 15 Feb 2027 | Inverter #7 | DC arc fault detection (false alarm) | 2.1 hrs | Firmware parameter adjustment |
| CM-004 | 03 Mar 2027 | SCADA | Router failure, data gap | 3.8 hrs | Router replaced |
| CM-005 | 22 Apr 2027 | Tracker | 2 tracker rows stuck (actuator failure) | 18 hrs | Actuator replaced |
| CM-006 | 10 Jun 2027 | SCADA | Firmware update caused 1-hour outage | 1.0 hr | Backfilled from inverter logs |
| CM-007 | 28 Jul 2027 | PV modules | 12 modules with transport microcracks found during IR survey | 0 hrs | Replaced under warranty |
| CM-008 | 15 Sep 2027 | BESS | BMS communication timeout (resolved by reboot) | 0.5 hrs | BMS firmware patched by BYD |

### 4.2 Warranty Claims

| Claim | Supplier | Items | Status | Resolution Time |
|-------|----------|-------|--------|----------------|
| WC-001 | JinkoSolar | 3 modules (frost damage) | Closed | 14 days |
| WC-002 | JinkoSolar | 12 modules (microcracks) | Closed | 11 days |
| WC-003 | Schletter | 2 tracker actuators | Closed | 8 days |
| WC-004 | SMA | Inverter #7 arc fault sensor | Closed -- no defect (firmware issue) | 5 days |

All warranty claims resolved within the 30-day SLA.

## 5. Key Performance Indicators

### 5.1 Availability

| Month | PV Availability | BESS Availability | Combined |
|-------|----------------|-------------------|----------|
| Oct 2026 | 99.4% | 100.0% | 99.4% |
| Nov 2026 | 99.8% | 100.0% | 99.8% |
| Dec 2026 | 100.0% | 100.0% | 100.0% |
| Jan 2027 | 99.9% | 100.0% | 99.9% |
| Feb 2027 | 99.6% | 100.0% | 99.6% |
| Mar 2027 | 99.2% | 100.0% | 99.2% |
| Apr 2027 | 99.0% | 100.0% | 99.0% |
| May 2027 | 98.8% | 100.0% | 98.8% |
| Jun 2027 | 98.5% | 99.9% | 98.5% |
| Jul 2027 | 99.1% | 100.0% | 99.1% |
| Aug 2027 | 99.3% | 100.0% | 99.3% |
| Sep 2027 | 99.7% | 99.9% | 99.7% |
| **Annual** | **99.1%** | **99.98%** | **99.1%** |

### 5.2 Response Times

| Metric | Target | Actual | Status |
|--------|--------|--------|--------|
| Emergency response (on-site) | 2 hours | 1.4 hours (avg) | Pass |
| MTTR (all events) | 8 hours | 4.2 hours | Pass |
| SCADA alarm acknowledgement | 15 minutes | 8 minutes (avg) | Pass |

### 5.3 Spare Parts Inventory

Critical spare parts held on-site:
- PV modules: 50 units (0.03% of installed)
- Inverter communication boards: 4 units
- Tracker actuators: 6 units
- SCADA routers: 2 units
- Fuses and circuit breakers: full set

No stockout events during the reporting period.

## 6. Health, Safety, and Environment

### 6.1 Safety Statistics

| Metric | Target | Actual |
|--------|--------|--------|
| Lost-time injury frequency rate (LTIFR) | 0 | 0 |
| Total recordable injury rate (TRIR) | 0 | 0 |
| Near misses reported | -- | 3 |
| Safety observations | -- | 24 |

### 6.2 Near Miss Summary

| Event | Date | Description | Corrective Action |
|-------|------|-------------|-------------------|
| NM-001 | 08 Jan 2027 | Ice fall from module edge during inspection | Added ice hazard to winter risk assessment, PPE updated |
| NM-002 | 14 May 2027 | Snake encounter in cable trench | Wildlife awareness briefing, first aid kit updated |
| NM-003 | 29 Aug 2027 | Incorrect lockout/tagout procedure observed | Refresher training for all technicians |

### 6.3 Training

All O&M personnel completed the following training during the reporting period:
- Annual electrical safety refresher (VDE 0105-100)
- BESS safety and emergency response (BYD certified)
- Working at height refresher
- First aid (2-day course)
- Fire safety and evacuation drill (June 2027)

## 7. Budget Performance

| Category | Budget (EUR) | Actual (EUR) | Variance |
|----------|-------------|-------------|---------|
| SolarOps fixed fee | 420,000 | 420,000 | 0% |
| Subcontractor services | 382,000 | 378,500 | -0.9% |
| Spare parts and consumables | 65,000 | 48,200 | -25.8% |
| Unplanned repairs | 50,000 | 18,400 | -63.2% |
| **Total O&M cost** | **917,000** | **865,100** | **-5.7%** |

O&M cost per MW installed: EUR 8,651/MW (benchmark: EUR 8,000-12,000/MW for utility-scale PV+BESS).

## 8. Recommendations for Year 2

1. **Panel cleaning frequency:** Increase from quarterly to bi-monthly during April-September to reduce soiling losses (currently 2.1%, target: <1.5%).
2. **Tracker actuator spares:** Increase on-site stock from 6 to 10 units based on failure rate.
3. **SCADA resilience:** Implement redundant communication path (4G backup) to eliminate single-point-of-failure fibre optic dependency.
4. **Training:** Add drone inspection certification for 2 technicians to improve module inspection efficiency.

## Appendices

- Appendix A: Monthly Maintenance Reports (12x)
- Appendix B: Corrective Maintenance Work Orders
- Appendix C: Warranty Claim Documentation
- Appendix D: Safety Training Records
- Appendix E: Spare Parts Inventory Register`,
  };
}
