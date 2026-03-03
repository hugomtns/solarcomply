# SolarComply Prototype — Implementation Plan for Claude Code

> **Purpose:** This document is a step-by-step build plan for an AI coding agent (Claude Code) to execute autonomously. Every decision is pre-made. No design ambiguity exists. Follow instructions linearly — each step depends on the previous one.

---

## 0. PROJECT IDENTITY

- **Name:** SolarComply
- **Tagline:** Trusted Compliance & Data-Sharing Platform for Solar PV and BESS Lifecycles
- **What it is:** A prototype web application mocking the core workflows of an end-to-end compliance platform for utility-scale solar PV and battery energy storage projects.
- **What it is NOT:** A backend with real APIs. Everything is client-side with mock data. No database. No authentication server.

---

## 1. TECH STACK (Non-negotiable)

| Layer | Choice | Why |
|-------|--------|-----|
| Framework | **Next.js 14** (App Router) | File-based routing, server components for static mock data |
| Language | **TypeScript** (strict mode) | Type safety on domain model |
| Styling | **Tailwind CSS 3.4+** | Utility-first, fast iteration |
| Components | **shadcn/ui** | Polished, accessible, copy-paste components |
| Charts | **Recharts** | Simple declarative charts for time-series and gauges |
| Icons | **Lucide React** | Consistent icon set, already a shadcn peer dep |
| State | **React Context + useState** | Prototype-scale; no Redux needed |
| Animation | **Framer Motion** (optional) | Only for gateway pipeline transitions |
| Package manager | **pnpm** | Fast, disk efficient |

**Do NOT use:** Material UI, Chakra, Ant Design, D3 (too complex for prototype charts), any backend framework, any database, any auth library.

---

## 2. PROJECT SCAFFOLDING

Run these commands exactly:

```bash
pnpx create-next-app@latest solarcomply --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-pnpm
cd solarcomply
pnpm add recharts lucide-react framer-motion date-fns clsx tailwind-merge class-variance-authority
pnpx shadcn@latest init -d
pnpx shadcn@latest add badge button card dialog dropdown-menu input label progress select separator sheet tabs table textarea tooltip avatar scroll-area command popover switch accordion alert
```

### Directory Structure

Create this exact structure after scaffolding:

```
src/
├── app/
│   ├── layout.tsx                    # Root layout with sidebar
│   ├── page.tsx                      # Redirect to /portfolio
│   ├── portfolio/
│   │   └── page.tsx                  # Portfolio dashboard (Workflow 1a)
│   ├── project/
│   │   └── [projectId]/
│   │       ├── page.tsx              # Project overview + gateway pipeline (Workflow 1b)
│   │       ├── gateway/
│   │       │   └── [gatewayId]/
│   │       │       └── page.tsx      # Gateway detail + compliance checks (Workflow 2)
│   │       ├── documents/
│   │       │   └── page.tsx          # Document management (Workflow 3a)
│   │       ├── permissions/
│   │       │   └── page.tsx          # Permission matrix (Workflow 3b)
│   │       ├── monitoring/
│   │       │   └── page.tsx          # SCADA dashboard (Workflow 4)
│   │       └── compliance-ai/
│   │           └── page.tsx          # AI regulatory assistant (Workflow 5)
│   └── globals.css
├── components/
│   ├── layout/
│   │   ├── sidebar.tsx               # Main navigation sidebar
│   │   ├── topbar.tsx                # Breadcrumbs + user menu + notifications
│   │   └── page-header.tsx           # Reusable page title + actions bar
│   ├── portfolio/
│   │   ├── project-card.tsx          # Project summary card for portfolio grid
│   │   └── portfolio-stats.tsx       # Top-level KPI cards
│   ├── project/
│   │   ├── gateway-pipeline.tsx      # Horizontal gateway visualization (G0→G10)
│   │   ├── gateway-card.tsx          # Individual gateway in pipeline
│   │   ├── project-summary.tsx       # Key project metrics sidebar
│   │   └── lifecycle-timeline.tsx    # Vertical timeline of gateway events
│   ├── gateway/
│   │   ├── requirements-checklist.tsx # Document + standard requirements list
│   │   ├── approval-panel.tsx        # Multi-stakeholder approval status + actions
│   │   ├── compliance-score.tsx      # Radial gauge showing gateway compliance %
│   │   ├── document-upload.tsx       # Upload zone with format validation feedback
│   │   └── waiver-dialog.tsx         # Waiver request modal
│   ├── documents/
│   │   ├── document-table.tsx        # Sortable/filterable document list
│   │   ├── document-viewer.tsx       # Preview pane (mock)
│   │   ├── version-history.tsx       # Version timeline for a document
│   │   └── data-room-builder.tsx     # Drag-select documents into data room
│   ├── permissions/
│   │   ├── permission-matrix.tsx     # Stakeholders × doc categories grid
│   │   ├── access-log.tsx            # Who accessed what, when
│   │   └── share-dialog.tsx          # Generate share link with settings
│   ├── monitoring/
│   │   ├── performance-chart.tsx     # PR time-series + guarantee threshold line
│   │   ├── bess-health-panel.tsx     # SoH, SoC, cycle count, temperature
│   │   ├── data-quality-card.tsx     # Completeness %, gap alerts
│   │   ├── alert-feed.tsx            # Real-time compliance alerts
│   │   └── scada-sync-status.tsx     # Connection status indicators
│   ├── compliance-ai/
│   │   ├── chat-interface.tsx        # Chat-style Q&A
│   │   ├── message-bubble.tsx        # Individual message (user or AI)
│   │   ├── standards-card.tsx        # Structured answer card showing applicable standards
│   │   └── gap-report-preview.tsx    # Mock generated report preview
│   └── shared/
│       ├── status-badge.tsx          # Colored status indicator (passed/failed/pending/review)
│       ├── compliance-score-ring.tsx # Circular progress indicator
│       ├── metric-card.tsx           # KPI display card
│       ├── empty-state.tsx           # Placeholder for empty lists
│       └── notification-bell.tsx     # Notification dropdown
├── data/
│   ├── projects.ts                   # Mock project data
│   ├── gateways.ts                   # Gateway definitions + requirements per project
│   ├── documents.ts                  # Mock document library
│   ├── stakeholders.ts              # Users + organizations + roles
│   ├── permissions.ts                # Permission matrix data
│   ├── scada.ts                      # Mock time-series generator
│   ├── standards.ts                  # Standards library with metadata
│   ├── alerts.ts                     # Compliance alert feed
│   └── ai-responses.ts              # Pre-scripted AI Q&A pairs
├── lib/
│   ├── types.ts                      # All TypeScript interfaces
│   ├── utils.ts                      # Shared utility functions
│   ├── constants.ts                  # Colors, status labels, config
│   └── mock-generators.ts           # Functions to generate realistic time-series
└── contexts/
    └── app-context.tsx               # Global state: selected project, current user, notifications
```

---

## 3. DESIGN SYSTEM

### 3.1 Color Palette

```typescript
// lib/constants.ts
export const COLORS = {
  // Brand
  navy:       '#1B2A4A',   // Primary headings, sidebar bg
  blue:       '#2E75B6',   // Links, secondary headings, active states
  teal:       '#00B0A0',   // Success, positive metrics
  amber:      '#F59E0B',   // Warning, in-review states
  orange:     '#ED7D31',   // Accent, CTAs
  red:        '#EF4444',   // Error, failed, blocked

  // Neutrals
  gray50:     '#F9FAFB',   // Page backgrounds
  gray100:    '#F3F4F6',   // Card backgrounds
  gray200:    '#E5E7EB',   // Borders
  gray400:    '#9CA3AF',   // Muted text
  gray600:    '#4B5563',   // Secondary text
  gray900:    '#111827',   // Primary text

  // Status mapping
  status: {
    passed:    '#00B0A0',
    inReview:  '#F59E0B',
    blocked:   '#EF4444',
    upcoming:  '#D1D5DB',
    waived:    '#8B5CF6',
  }
} as const;
```

### 3.2 Typography

- **Page titles:** 24px/semibold, navy
- **Section headers:** 18px/semibold, gray-900
- **Card titles:** 15px/medium, gray-900
- **Body text:** 14px/normal, gray-600
- **Small/labels:** 12px/medium, gray-400
- **Metrics (big numbers):** 32px/bold, navy

### 3.3 Layout Rules

- Sidebar: fixed, 256px wide, navy background, white text.
- Content area: max-width 1440px, padding 24px.
- Cards: white bg, border gray-200, rounded-lg, shadow-sm, padding 20px.
- Page header: sticky top, white bg, border-b, z-10. Contains breadcrumbs + page title + action buttons.
- Tables: use shadcn `<Table>` component. Striped rows (gray-50 alternating).
- Spacing rhythm: 8px base unit. Gaps between sections: 24px. Between cards: 16px.

### 3.4 Key UI Patterns

- **Gateway Pipeline:** Horizontal stepper with circles connected by lines. Circle states: filled green (passed), pulsing amber (in review), filled red (blocked), outline gray (upcoming). Click expands to gateway detail.
- **Compliance Score Ring:** Circular SVG progress indicator. 0-59 red, 60-79 amber, 80-100 green. Show percentage in center.
- **Status Badges:** Pill-shaped. Colors from status mapping. Always include icon: CheckCircle, Clock, AlertTriangle, XCircle, ShieldOff.
- **Document cards:** Show file type icon (FileText, FileSpreadsheet, FileImage, FileCode), name, version, upload date, status badge, uploader avatar.

---

## 4. DOMAIN TYPES

Create this file exactly as `src/lib/types.ts`:

```typescript
// ─── Core Entities ────────────────────────────────────────────────

export type ProjectType = 'pv' | 'bess' | 'hybrid';
export type LifecycleStage =
  | 'feasibility' | 'development' | 'financing'
  | 'engineering' | 'procurement' | 'construction'
  | 'commissioning' | 'cod' | 'operations' | 'decommissioning';

export type GatewayStatus = 'passed' | 'in_review' | 'blocked' | 'upcoming' | 'waived';
export type DocumentStatus = 'approved' | 'pending_review' | 'rejected' | 'draft' | 'expired';
export type ApprovalStatus = 'approved' | 'pending' | 'rejected' | 'not_required';
export type CheckType = 'automated' | 'manual' | 'ai_assisted';
export type CheckStatus = 'pass' | 'fail' | 'warning' | 'pending' | 'not_applicable';
export type StakeholderRole = 'execute' | 'review' | 'approve' | 'witness' | 'sign_off' | 'shadow' | 'input' | 'none';
export type PermissionLevel = 'none' | 'view' | 'download' | 'upload' | 'approve' | 'admin';
export type AlertSeverity = 'critical' | 'warning' | 'info';

export interface Organization {
  id: string;
  name: string;
  type: 'ipp' | 'epc' | 'om' | 'lender' | 'technical_advisor' | 'grid_operator' | 'oem' | 'insurer' | 'regulator';
  logo?: string;   // emoji or initials for prototype
}

export interface User {
  id: string;
  name: string;
  email: string;
  organizationId: string;
  role: string;     // e.g. "Compliance Manager", "Project Director"
  avatar?: string;  // initials
}

export interface Project {
  id: string;
  name: string;
  type: ProjectType;
  capacityMW: number;
  capacityMWh?: number;      // BESS only
  location: {
    country: string;
    region: string;
    lat: number;
    lng: number;
  };
  jurisdictions: string[];    // e.g. ['EU', 'DE']
  currentStage: LifecycleStage;
  complianceScore: number;    // 0-100
  expectedCOD: string;        // ISO date
  currentGatewayId: string;
  organizationIds: string[];
}

export interface Gateway {
  id: string;
  projectId: string;
  code: string;               // G0, G1, ... G10
  name: string;
  description: string;
  status: GatewayStatus;
  complianceScore: number;
  stage: LifecycleStage;
  requirements: GatewayRequirement[];
  approvals: GatewayApproval[];
  completedDate?: string;
  targetDate?: string;
}

export interface GatewayRequirement {
  id: string;
  category: 'document' | 'standard' | 'data_quality' | 'approval';
  label: string;
  description: string;
  status: CheckStatus;
  checkType: CheckType;
  standardRef?: string;       // e.g. 'IEC 62446-1 §7.2'
  linkedDocumentIds?: string[];
  aiConfidence?: number;      // 0-1, for AI-assisted checks
}

export interface GatewayApproval {
  stakeholderOrgId: string;
  requiredRole: StakeholderRole;
  status: ApprovalStatus;
  approverUserId?: string;
  timestamp?: string;
  comment?: string;
}

export interface Document {
  id: string;
  projectId: string;
  gatewayId?: string;
  name: string;
  fileName: string;
  fileType: 'pdf' | 'dwg' | 'csv' | 'xlsx' | 'pvsyst' | 'docx' | 'jpg' | 'geotiff' | 'ifc';
  category: DocumentCategory;
  version: number;
  status: DocumentStatus;
  uploadedBy: string;         // user ID
  uploadedAt: string;         // ISO datetime
  fileSizeMB: number;
  formatValid: boolean;
  tags: string[];
  retentionYears: number;
}

export type DocumentCategory =
  | 'solar_resource' | 'geotechnical' | 'eia' | 'grid_study'
  | 'financial_model' | 'ppa' | 'land_lease'
  | 'design_drawings' | 'sld' | 'cable_schedule' | 'structural_calcs'
  | 'fat_report' | 'itp' | 'ncr' | 'progress_report'
  | 'commissioning_report' | 'iv_curves' | 'thermal_imaging' | 'insulation_test'
  | 'as_built_drawings' | 'om_manual' | 'scada_documentation' | 'warranty_certificate'
  | 'performance_report' | 'maintenance_log' | 'drone_inspection'
  | 'bess_test_report' | 'ul9540a_report' | 'battery_passport'
  | 'insurance_policy' | 'ie_report' | 'grid_compliance_cert';

export interface Standard {
  id: string;
  body: string;               // IEC, IEEE, UL, NFPA, ISO, UN, EU
  number: string;
  edition: string;
  title: string;
  scope: string;
  applicableGateways: string[];
  jurisdictions: string[];     // empty = global
  projectTypes: ProjectType[];
  url?: string;
}

export interface PermissionEntry {
  organizationId: string;
  documentCategory: DocumentCategory;
  level: PermissionLevel;
}

export interface ScadaDataPoint {
  timestamp: string;
  metric: string;
  value: number;
  quality: 'good' | 'suspect' | 'bad';
}

export interface ComplianceAlert {
  id: string;
  projectId: string;
  severity: AlertSeverity;
  title: string;
  description: string;
  gatewayId?: string;
  standardRef?: string;
  timestamp: string;
  acknowledged: boolean;
}

export interface AuditEntry {
  id: string;
  action: string;
  entityType: string;
  entityId: string;
  userId: string;
  timestamp: string;
  details: string;
}

export interface AIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  standards?: Standard[];
  gapItems?: { standard: string; requirement: string; status: CheckStatus; action: string }[];
  timestamp: string;
}
```

---

## 5. MOCK DATA

### 5.1 Demo Scenario

Build all mock data around this single scenario:

**Project:** "Sonnenberg Solar + Storage"
- **Type:** Hybrid (100 MW PV + 50 MW / 100 MWh BESS)
- **Location:** Brandenburg, Germany (52.42°N, 13.53°E)
- **Jurisdictions:** EU, DE
- **Developer / IPP:** GreenField Energy GmbH
- **EPC:** Solaris Construction AG
- **O&M:** TechWind Operations GmbH
- **Lender:** European Infrastructure Bank
- **Technical Advisor:** DNV Energy Systems
- **Grid Operator:** 50Hertz Transmission GmbH
- **OEM (Modules):** JinkoSolar
- **OEM (Inverters):** SMA Solar Technology AG
- **OEM (BESS):** BYD Company Ltd.
- **Expected COD:** 15 September 2026
- **Current stage:** Hot Commissioning (G5 in review)
- **Compliance score:** 82/100

This means gateways G0–G4 are **passed**, G5 is **in_review**, and G6–G10 are **upcoming**. This creates the most interesting demo state — the project is mid-lifecycle with a mix of completed and pending items.

### 5.2 Secondary Projects (for portfolio view)

Add 4 more projects to make the portfolio view meaningful:

| Name | Type | Capacity | Country | Stage | Score |
|------|------|----------|---------|-------|-------|
| Algarve Sun Farm | PV | 150 MW | Portugal | Operations (G8) | 94 |
| Yorkshire Storage | BESS | 80 MW/160 MWh | UK | Financing (G2 in review) | 71 |
| Atacama Hybrid | Hybrid | 200 MW + 100 MW/200 MWh | Chile | Construction (G4 blocked) | 58 |
| Al Dhafra Extension | PV | 300 MW | UAE | Development (G1 in review) | 65 |

### 5.3 Mock Data Files — Specific Instructions

**`data/projects.ts`**: Export array of 5 Project objects. Sonnenberg is `id: "proj-sonnenberg"`.

**`data/stakeholders.ts`**: Export organizations (8 above) and users (2-3 per org). Export the "current user" as `currentUser` — make it Maria Schmidt, Compliance Manager at GreenField Energy.

**`data/gateways.ts`**: Export full gateway data for Sonnenberg. 11 gateways (G0-G10). For G5 (Hot Commissioning), create 12-15 detailed requirements mixing all check types and statuses — this is the main demo gateway. Include the SolarPower Europe Stakeholder Responsibility Matrix roles for each gateway's approvals.

**`data/documents.ts`**: Export 30-40 documents for Sonnenberg covering all categories. Mix statuses. Include realistic filenames like `"Sonnenberg_AsBuilt_SLD_Rev3.dwg"`, `"JinkoSolar_Tiger_Neo_FAT_Report_Batch_2024Q3.pdf"`, `"BYD_MC_Cube_UL9540A_Ed5_Test_Report.pdf"`. Mark a few DWG files as `formatValid: true` and a few PDF-only as-builts as `formatValid: false` (to demo the format validation feature).

**`data/permissions.ts`**: Export a permission matrix with 8 organizations × 10 document categories. Use realistic defaults (e.g., Lender gets 'view' for engineering docs but 'none' for maintenance logs; Grid Operator gets 'view' for grid compliance only).

**`data/scada.ts`**: Export a function `generateScadaData(metric: string, days: number): ScadaDataPoint[]` that generates synthetic time-series. Metrics to support:
- `performance_ratio`: oscillates between 0.76-0.84 with daily/seasonal pattern, occasional dips
- `availability`: mostly 0.97-0.99 with rare drops to 0.90
- `bess_soh`: slowly declining from 0.98 to 0.94 over 365 days
- `bess_soc`: cycling 0.10-0.90 with 2 cycles per day
- `bess_temperature`: 20-35°C with daily cycle and correlation to SoC
- `irradiance`: 0-1000 W/m² bell curve per day, cloud noise
- `power_output_mw`: correlated to irradiance × PR
- `data_completeness`: mostly 0.99+ with occasional drops to 0.95

Use `date-fns` for timestamp generation. Data resolution: 15-minute intervals for the last 30 days, hourly for 30-365 days.

**`data/standards.ts`**: Export array of 20-25 standards covering the key ones from the PRD: IEC 61215, 61730, 62446-1, 62446-3, 61724-1, 62548-1, 62619, 63056; UL 9540, 9540A; NFPA 855; IEEE 1547, 2800; UN 38.3; EU 2023/1542; ISO 9001, 14001, 45001; FIDIC Silver Book. Each with applicable gateways and jurisdictions.

**`data/alerts.ts`**: Export 8-10 alerts for Sonnenberg. Mix severities. Include domain-realistic examples:
- CRITICAL: "BESS Round-Trip Efficiency dropped below 88% threshold (87.3% measured). UL 9540 compliance review triggered."
- WARNING: "Performance Ratio 7-day average (79.1%) approaching guarantee threshold (78.0%). 2.1 percentage points margin remaining."
- WARNING: "3 as-built drawings uploaded as PDF only — editable DWG/DXF required per IEC 62446-1 §6.2"
- INFO: "IEC 62446-1 Edition 2.0 published — impact assessment available for active projects."
- CRITICAL: "Gateway G5 approval from 50Hertz Transmission overdue by 12 days."

**`data/ai-responses.ts`**: Export a map of pre-scripted Q&A pairs (at least 5). Key queries:
1. "What fire safety standards apply to our BESS in Germany?" → structured response with NFPA 855, UL 9540, UL 9540A, IEC 62933, German BVES guidelines, project status against each
2. "Is our commissioning documentation complete for PAC?" → checklist against IEC 62446-1 with gap analysis
3. "What are the EU Battery Passport requirements and our readiness?" → EU 2023/1542 timeline, required data fields, project readiness assessment
4. "Show me all non-conformances from hot commissioning" → list of NCRs with severity and remediation status
5. "Compare our PR against guarantee and forecast when we might breach" → trend analysis with projected threshold crossing date

---

## 6. BUILD SEQUENCE

Build in this exact order. Each step must be complete and working before the next.

### Step 1: Scaffold + Layout Shell (est. 30 min)

1. Run scaffolding commands from Section 2.
2. Set up `globals.css` with Tailwind config and custom CSS variables from color palette.
3. Build `layout/sidebar.tsx`: Fixed left sidebar (w-64) with navy background. Logo "SolarComply" at top. Nav items with Lucide icons: Portfolio (LayoutDashboard), Projects (FolderKanban), Standards Library (BookOpen), Settings (Settings). Active state: white bg/10%, left border accent. Bottom: user avatar + name (Maria Schmidt) + org (GreenField Energy).
4. Build `layout/topbar.tsx`: Breadcrumb trail (auto from route), notification bell (red dot if unread), user dropdown.
5. Build `layout/page-header.tsx`: Reusable component with title, description, and action buttons slot.
6. Build root `layout.tsx` assembling sidebar + topbar + content area.
7. Verify: app boots, sidebar renders, navigation links exist (even if pages are stubs).

### Step 2: Mock Data Layer (est. 45 min)

1. Create `lib/types.ts` exactly as specified in Section 4.
2. Create `lib/constants.ts` with colors, status labels, category labels.
3. Create all 8 data files from Section 5. The `scada.ts` generator is the most complex — use seeded pseudo-random with sine waves for realistic patterns.
4. Create `contexts/app-context.tsx` with: selectedProjectId (default: "proj-sonnenberg"), currentUser, notifications array. Wrap app in provider.
5. Verify: import data in a test page, confirm types are correct, console.log a gateway object.

### Step 3: Shared Components (est. 30 min)

Build each shared component:
1. `shared/status-badge.tsx` — maps GatewayStatus/DocumentStatus/CheckStatus to color + icon + label.
2. `shared/compliance-score-ring.tsx` — SVG circular progress. Props: `score: number`, `size: 'sm' | 'md' | 'lg'`. Color thresholds: <60 red, 60-79 amber, 80+ green. Animated on mount.
3. `shared/metric-card.tsx` — Card with label (gray-400, 12px), value (32px bold), optional trend indicator (up/down arrow + percentage, green/red).
4. `shared/empty-state.tsx` — Centered icon + message + optional action button.
5. `shared/notification-bell.tsx` — Bell icon with count badge. Dropdown showing recent alerts.

### Step 4: Portfolio Dashboard — Workflow 1a (est. 45 min)

**Route:** `/portfolio`

**Layout:**
- Top row: 4 metric cards — Total Projects (5), Total Capacity (830 MW), Average Compliance Score (74%), Active Alerts (count from alerts data).
- Below: Grid of project cards (responsive: 1 col mobile, 2 col tablet, 3 col desktop).

**`portfolio/project-card.tsx`:**
- Card with project name (bold), type badge (PV/BESS/Hybrid with distinct colors), location flag + country.
- Compliance score ring (md size) on the right.
- Below: capacity, current stage label, expected COD.
- Bottom bar: thin progress bar showing lifecycle stage position (0-10 mapped to width).
- Click → navigates to `/project/[projectId]`.

### Step 5: Project Overview + Gateway Pipeline — Workflow 1b (est. 60 min)

**Route:** `/project/[projectId]`

**Layout:** Two-column on desktop (8/4 split). Left: gateway pipeline + activity feed. Right: project summary sidebar.

**`project/project-summary.tsx`:**
- Compliance score ring (lg).
- Key facts list: Type, Capacity, Location, Expected COD, Current Stage, Jurisdictions.
- Stakeholder list: org name + type badge for each participating org.

**`project/gateway-pipeline.tsx`:**
- This is the hero component. Horizontal scrollable pipeline of gateway nodes.
- Each node is a `gateway-card.tsx`: circle (40px) with gateway code (G0-G10), status color fill, connecting line to next node. Below circle: gateway name (truncated), date if completed.
- Current gateway (G5) is enlarged (56px circle) and pulsing if in_review.
- Passed gateways: solid green circle + checkmark icon.
- Blocked: red circle + X icon.
- Upcoming: gray outline circle.
- Waived: purple circle + shield-off icon.
- **Click a gateway →** navigates to `/project/[projectId]/gateway/[gatewayId]`.
- Below the pipeline: display compliance score for each gateway as tiny text.

**`project/lifecycle-timeline.tsx`:**
- Vertical timeline of recent gateway events (last 10): "G4 Cold Commissioning passed — 12 Feb 2026", "G5 Hot Commissioning entered review — 28 Feb 2026", etc.
- Each event has icon, timestamp, actor name, and brief description.

### Step 6: Gateway Detail + Compliance Checks — Workflow 2 (est. 90 min)

**Route:** `/project/[projectId]/gateway/[gatewayId]`

This is the most complex page. Build it carefully.

**Layout:** Page header with gateway code + name + status badge + compliance score ring. Below: 3-tab layout.

**Tab 1: Requirements Checklist (`gateway/requirements-checklist.tsx`)**
- Grouped by category: Documents, Standards Compliance, Data Quality, Approvals.
- Each requirement row: status icon (CheckCircle green, XCircle red, Clock amber, AlertTriangle yellow), label, description, check type badge (Automated/Manual/AI), linked standard ref (if any).
- For AI-assisted checks: show confidence percentage as a small progress bar.
- Expandable rows: click to see linked documents, detailed check results, or remediation notes.
- Summary bar at top: "14 of 18 requirements passed | 2 in review | 1 failed | 1 not applicable"

**Tab 2: Approvals (`gateway/approval-panel.tsx`)**
- Table layout mirroring the SolarPower Europe Stakeholder Responsibility Matrix.
- Columns: Organization, Required Role (with tooltip explaining: Execute, Review, Approve, Witness, Sign-off, Shadow), Status (badge), Approver Name, Date, Comment.
- For pending approvals: show "Request Approval" button (mock — shows toast notification on click).
- For the current user's org (GreenField): show "Approve Gateway" primary button if pending.

**Tab 3: Documents (`gateway/document-upload.tsx`)**
- Document list for this gateway (filtered from main document library).
- Upload zone: dashed border area with "Drop files here or click to upload" text.
- On mock upload: show format validation result (e.g., "✓ DWG format detected — editable as-built confirmed" or "✗ PDF format detected — editable DWG/DXF required per IEC 62446-1 §6.2").
- Mock upload adds document to the gateway's document list with 'pending_review' status.

**Waiver Dialog (`gateway/waiver-dialog.tsx`):**
- Triggered by "Request Waiver" button on any failed/blocked requirement.
- Dialog: requirement label, justification textarea, risk assessment dropdown (Low/Medium/High/Critical), approver selector, submit button.
- On submit: show success toast, change requirement status to 'waived' with purple badge.

### Step 7: Document Management — Workflow 3a (est. 45 min)

**Route:** `/project/[projectId]/documents`

**Layout:** Page header with "Documents" + document count + "Upload" button. Below: filter bar + table.

**Filter bar:** Search input, category dropdown (multi-select), status dropdown, file type dropdown, gateway dropdown.

**`documents/document-table.tsx`:**
- Columns: Type icon, Name (clickable), Category badge, Version, Status badge, Format Valid (✓/✗), Gateway, Uploaded By (avatar + name), Date, Size.
- Sortable by name, date, size, status.
- Row click opens `document-viewer.tsx` in a slide-over panel (Sheet component).

**`documents/document-viewer.tsx`:**
- Mock preview area (gray box with file type icon + "Preview not available in prototype" text).
- Metadata panel: all document fields displayed.
- Version history (`version-history.tsx`): vertical timeline showing v1, v2, v3 with uploader and date.
- Action buttons: Download (mock), Share, Delete (with confirmation).

**`documents/data-room-builder.tsx`:**
- Triggered by "Build Data Room" button in page header.
- Dialog or side panel: left column = document list with checkboxes, right column = selected documents.
- Settings: data room name, expiry date picker, access level (view-only / download), watermark toggle.
- "Generate Link" button → shows mock URL with copy-to-clipboard.

### Step 8: Permission Management — Workflow 3b (est. 45 min)

**Route:** `/project/[projectId]/permissions`

**Layout:** Page header with "Access Control". Below: matrix + access log tabs.

**Tab 1: Permission Matrix (`permissions/permission-matrix.tsx`)**
- Grid: rows = organizations (8), columns = document categories (10 most common).
- Cell: dropdown selector with permission levels (None, View, Download, Upload, Approve, Admin).
- Color-coded cells: None=gray, View=blue-50, Download=blue-100, Upload=green-50, Approve=amber-50, Admin=purple-50.
- Row header: org name + type badge.
- Column header: category name (angled text or abbreviated).
- "Save Changes" button (mock — toast confirmation).
- Pre-populated from `data/permissions.ts`.

**Tab 2: Access Log (`permissions/access-log.tsx`)**
- Reverse-chronological list of access events.
- Each entry: avatar + user name + org, action (Viewed/Downloaded/Uploaded/Shared), document name, timestamp, IP address (mock).
- Filter by organization and action type.
- Generate 20-30 mock access log entries for the last 7 days.

**Share Dialog (`permissions/share-dialog.tsx`):**
- Triggered from document viewer or data room builder.
- Fields: recipient email, permission level, expiry date, message.
- Toggle: "Watermark documents", "Disable downloads".
- Show generated link preview.

### Step 9: SCADA Monitoring — Workflow 4 (est. 60 min)

**Route:** `/project/[projectId]/monitoring`

**Layout:** Three sections stacked vertically.

**Section 1: Key Metrics Row** (4 metric cards)
- Current PR: value from latest data point, trend vs. 7-day average, guarantee threshold indicator.
- Plant Availability: current value, monthly trend.
- BESS State of Health: current SoH %, degradation rate per month.
- Data Completeness: current %, alert if <99%.

**Section 2: Performance Charts (`monitoring/performance-chart.tsx`)**
- Tabbed chart area: PR | Energy Output | BESS Health | Irradiance
- **PR Chart (default):** Recharts `AreaChart` with:
  - Y-axis: 0.70 to 0.90
  - Blue area fill for actual PR values
  - Red dashed horizontal line at 0.78 labeled "Guarantee Threshold (78%)"
  - Amber dashed horizontal line at PR × 0.95 labeled "Warning Threshold (95% of guarantee)"
  - Tooltip showing date, PR value, irradiance, temperature
  - Time range selector: 7d / 30d / 90d / 1y
- **BESS Health Chart:** Dual y-axis. Left: SoH (line, declining). Right: Cycle count (bar, cumulative). Show warranty limit lines.
- Use data from `scada.ts` generator.

**Section 3: Operational Panels** (2-column grid)

**Left: Data Quality Card (`monitoring/data-quality-card.tsx`)**
- Completeness gauge (target ≥99%): large number + ring.
- Breakdown: signals by quality flag (good/suspect/bad).
- Gap detection: list of recent gaps with timestamp ranges.
- Sensor health indicators: 5-6 sensor types with green/amber/red dots.

**Right: Alert Feed (`monitoring/alert-feed.tsx`)**
- Live-style feed of compliance alerts from `data/alerts.ts`.
- Each alert: severity icon + colored left border, title, description, timestamp, acknowledge button.
- Filtering: All / Critical / Warning / Info tabs.

**SCADA Sync Status (`monitoring/scada-sync-status.tsx`):**
- Small panel at top of monitoring page showing connection status for each data source:
  - SMA Inverter Fleet: "Connected — last sync 2 min ago" (green dot)
  - BYD BMS: "Connected — last sync 45 sec ago" (green dot)
  - Weather Station: "Degraded — 3 gaps in last 24h" (amber dot)
  - Grid Meter: "Connected — last sync 5 min ago" (green dot)
- Total data points today: "2,847,392"

### Step 10: AI Compliance Assistant — Workflow 5 (est. 45 min)

**Route:** `/project/[projectId]/compliance-ai`

**Layout:** Full-height chat interface similar to a chat application.

**Left panel (30% width):** Quick-access prompt suggestions:
- "What fire safety standards apply to our BESS?"
- "Is our PAC documentation complete?"
- "EU Battery Passport readiness assessment"
- "Show hot commissioning non-conformances"
- "PR trend analysis vs. guarantee"
- Clicking a suggestion fills the input and auto-submits.

**Main panel: Chat Interface (`compliance-ai/chat-interface.tsx`)**
- Message list scrolling area. Alternating user/assistant messages.
- User messages: right-aligned, blue background, white text.
- Assistant messages: left-aligned, white background, gray border.

**`compliance-ai/message-bubble.tsx`:**
- For assistant messages containing standards data: render `standards-card.tsx` inline.
- For gap analysis responses: render a mini-table of requirements with status badges.
- For trend analysis: render an inline Recharts chart.
- Support markdown-like formatting (bold, bullet points) in message text.

**`compliance-ai/standards-card.tsx`:**
- Card showing applicable standard: body + number + title.
- Project compliance status for this standard (pass/fail/pending badge).
- Key requirements summary (2-3 bullet points).
- "View Full Requirements" link (mock).

**`compliance-ai/gap-report-preview.tsx`:**
- Triggered by assistant message offering "Generate Gap Report".
- Preview card: mock report cover page image, title, date, "Download PDF" button (mock).
- Summary: "12 requirements assessed | 9 compliant | 2 gaps identified | 1 not applicable"

**Interaction model:**
- Pre-load the first AI response (assistant greeting with project context summary) on page load.
- On user input: match against pre-scripted queries in `ai-responses.ts` using keyword matching (not exact match — check for key terms like "fire", "BESS", "PAC", "battery passport", "PR", "performance ratio", "non-conformance", "NCR").
- For unmatched queries: return a generic helpful response: "I can help with standards compliance, documentation review, and performance analysis. Try asking about specific standards, documentation completeness, or performance trends."
- Add a small typing indicator delay (800ms) before showing AI response to feel realistic.

### Step 11: Navigation Wiring + Polish (est. 30 min)

1. Wire all sidebar links to correct routes. "Projects" shows a dropdown/submenu listing the 5 projects.
2. Ensure breadcrumbs update on every route: Portfolio > Sonnenberg Solar + Storage > Gateway G5 > etc.
3. Add notification bell with alert count from alerts data. Dropdown shows last 5 alerts with links.
4. Add a global "project selector" dropdown in the topbar for quick project switching.
5. Verify all navigation flows work end-to-end:
   - Portfolio → click project → Project overview
   - Project overview → click gateway → Gateway detail
   - Gateway detail → click document → Document viewer
   - Sidebar → Documents → Document table with filters
   - Sidebar → Monitoring → SCADA dashboard
   - Sidebar → AI Assistant → Chat interface
6. Add loading states (skeleton screens) for page transitions.
7. Ensure responsive behavior: sidebar collapses to icon-only on tablet, hamburger menu on mobile.

### Step 12: Final Verification Checklist

Before marking complete, verify every item:

- [ ] App starts without errors (`pnpm dev`)
- [ ] Portfolio page loads with 5 project cards and KPI metrics
- [ ] Clicking Sonnenberg navigates to project overview with gateway pipeline
- [ ] Gateway pipeline shows G0-G4 green, G5 amber/pulsing, G6-G10 gray
- [ ] Clicking G5 opens gateway detail with 3 tabs populated
- [ ] Requirements checklist shows 12+ items with mixed statuses
- [ ] Approval panel shows stakeholder matrix with role labels
- [ ] Document upload zone shows format validation feedback
- [ ] Waiver dialog opens and submits
- [ ] Documents page shows 30+ documents with filters working
- [ ] Data room builder dialog opens with document selection
- [ ] Permissions page shows matrix with dropdowns and access log
- [ ] Monitoring page shows PR chart with guarantee threshold line
- [ ] BESS health panel shows SoH, SoC, cycle count
- [ ] Data quality card shows completeness and gap alerts
- [ ] Alert feed shows 8+ alerts filterable by severity
- [ ] AI chat shows greeting, accepts 5 pre-scripted queries, renders structured responses
- [ ] Breadcrumbs work on all routes
- [ ] No TypeScript errors
- [ ] No console errors
- [ ] Responsive: sidebar collapses at <1024px

---

## 7. IMPORTANT CONSTRAINTS FOR CLAUDE CODE

1. **No backend.** All data is in `src/data/*.ts` files imported directly. No fetch calls. No API routes. No database.
2. **No authentication.** The current user is hardcoded as Maria Schmidt. User switching is out of scope.
3. **No real file upload.** The upload zone simulates a result — it adds a mock document to local state.
4. **No real AI.** The chat uses keyword-matched pre-scripted responses. No LLM API calls.
5. **No real-time data.** SCADA data is generated once on page load. No WebSocket, no polling.
6. **shadcn components first.** Use shadcn `Button`, `Card`, `Table`, `Dialog`, `Sheet`, `Tabs`, `Badge`, `Input`, `Select`, `Tooltip`, `Accordion`, `Alert`, `ScrollArea` everywhere. Do not build custom components that duplicate shadcn functionality.
7. **Keep files under 300 lines.** Split large components. Extract sub-components aggressively.
8. **Use `"use client"` only where needed** — pages with useState/useEffect or event handlers. Data-only files and layout components should remain server components where possible.
9. **Test each step before proceeding.** After each Step in Section 6, run `pnpm dev` and verify the page renders. Do not build Steps 2-12 then try to run. Build incrementally.
10. **Tailwind only for styling.** No CSS modules. No styled-components. No inline style objects (except for dynamic values like chart dimensions).

---

## 8. MOCK DATA SIZING GUIDE

| Data Type | Count | Notes |
|-----------|-------|-------|
| Projects | 5 | 1 primary (Sonnenberg), 4 secondary |
| Organizations | 8 | Per Sonnenberg scenario |
| Users | 20 | 2-3 per org |
| Gateways (Sonnenberg) | 11 | G0-G10, detailed requirements for G5 |
| Gateway requirements (G5) | 15 | Mix of pass/fail/pending/warning |
| Documents (Sonnenberg) | 40 | Across all categories |
| Standards | 25 | Key IEC/IEEE/UL/NFPA standards |
| Alerts | 10 | Mix of critical/warning/info |
| SCADA data points | ~3,000 per metric | 30 days × ~96 points/day |
| Access log entries | 30 | Last 7 days |
| AI Q&A pairs | 5 | Pre-scripted with structured responses |

---

## 9. REFERENCE: GATEWAY PIPELINE VISUAL SPEC

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                                                                                       │
│  ●──●──●──●──●──◉──○──○──○──○──○                                                    │
│  G0  G1  G2  G3  G4  G5  G6  G7  G8  G9  G10                                       │
│  ✓   ✓   ✓   ✓   ✓   ◷   ·   ·   ·   ·   ·                                        │
│                                                                                       │
│  Legend:  ● Passed  ◉ In Review (pulsing)  ◼ Blocked  ◇ Waived  ○ Upcoming          │
│                                                                                       │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

Each node is clickable. Hovering shows tooltip with gateway name + date + score. The current gateway is 1.4× larger than others. The connecting lines use the same color as the left node (green for passed, gray for upcoming).

---

## 10. REFERENCE: STAKEHOLDER RESPONSIBILITY MATRIX (for G5 mock data)

Use these exact roles for the Hot Commissioning gateway approvals:

| Organization | Role |
|---|---|
| Solaris Construction AG (EPC) | Execute |
| DNV Energy Systems (TA) | Witness |
| GreenField Energy GmbH (IPP) | Approve |
| 50Hertz Transmission (Grid) | Witness |
| SMA Solar Technology (OEM) | Sign-off |
| BYD Company Ltd. (OEM BESS) | Sign-off |
| TechWind Operations (O&M) | Shadow |

Set statuses: EPC = approved, DNV = approved, GreenField = pending, 50Hertz = pending (overdue), SMA = approved, BYD = approved, TechWind = approved.

This creates a realistic scenario where the gateway is blocked waiting on the IPP's final approval and the grid operator's witnessed sign-off — a very common real-world bottleneck.

---

*End of implementation plan. Execute sequentially. Build and verify each step before proceeding to the next.*
