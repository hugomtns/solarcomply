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
  logo?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  organizationId: string;
  role: string;
  avatar?: string;
}

export interface Project {
  id: string;
  name: string;
  type: ProjectType;
  capacityMW: number;
  capacityMWh?: number;
  location: {
    country: string;
    region: string;
    lat: number;
    lng: number;
  };
  jurisdictions: string[];
  currentStage: LifecycleStage;
  complianceScore: number;
  expectedCOD: string;
  currentGatewayId: string;
  organizationIds: string[];
}

export interface Gateway {
  id: string;
  projectId: string;
  code: string;
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
  standardRef?: string;
  linkedDocumentIds?: string[];
  aiConfidence?: number;
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
  uploadedBy: string;
  uploadedAt: string;
  fileSizeMB: number;
  formatValid: boolean;
  tags: string[];
  retentionYears: number;
  latestVersionId?: string;
  approvalRequired?: boolean;
}

export interface DocumentVersion {
  id: string;
  documentId: string;
  version: number;
  fileName: string;
  fileType: Document['fileType'];
  fileSizeMB: number;
  uploadedBy: string;
  uploadedAt: string;
  changelog: string;
  status: DocumentStatus;
  formatValid: boolean;
  isCurrent: boolean;
}

export interface DocumentApproval {
  id: string;
  documentId: string;
  documentVersionId: string;
  stakeholderOrgId: string;
  requiredRole: StakeholderRole;
  status: ApprovalStatus;
  approverUserId?: string;
  timestamp?: string;
  comment?: string;
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
  body: string;
  number: string;
  edition: string;
  title: string;
  scope: string;
  applicableGateways: string[];
  jurisdictions: string[];
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
