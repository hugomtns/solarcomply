export const COLORS = {
  navy: '#0B1120',
  blue: '#3B82F6',
  teal: '#06D6A0',
  amber: '#F59E0B',
  orange: '#ED7D31',
  red: '#EF4444',
  purple: '#8B5CF6',
  status: {
    passed: '#06D6A0',
    inReview: '#F59E0B',
    blocked: '#EF4444',
    upcoming: '#94A3B8',
    waived: '#8B5CF6',
  },
} as const;

export const GATEWAY_STATUS_LABELS: Record<string, string> = {
  passed: 'Passed',
  in_review: 'In Review',
  blocked: 'Blocked',
  upcoming: 'Upcoming',
  waived: 'Waived',
};

export const DOCUMENT_STATUS_LABELS: Record<string, string> = {
  approved: 'Approved',
  pending_review: 'Pending Review',
  rejected: 'Rejected',
  draft: 'Draft',
  expired: 'Expired',
};

export const CHECK_STATUS_LABELS: Record<string, string> = {
  pass: 'Pass',
  fail: 'Fail',
  warning: 'Warning',
  pending: 'Pending',
  not_applicable: 'N/A',
};

export const APPROVAL_STATUS_LABELS: Record<string, string> = {
  approved: 'Approved',
  pending: 'Pending',
  rejected: 'Rejected',
  not_required: 'Not Required',
};

export const STAKEHOLDER_ROLE_LABELS: Record<string, string> = {
  execute: 'Execute',
  review: 'Review',
  approve: 'Approve',
  witness: 'Witness',
  sign_off: 'Sign-off',
  shadow: 'Shadow',
  input: 'Input',
  recommend: 'Recommend',
  confirm: 'Confirm',
  acknowledge: 'Acknowledge',
  support: 'Support',
  none: 'None',
};

export const PERMISSION_LEVEL_LABELS: Record<string, string> = {
  none: 'None',
  view: 'View',
  download: 'Download',
  upload: 'Upload',
  approve: 'Approve',
  admin: 'Admin',
};

export const DOCUMENT_CATEGORY_LABELS: Record<string, string> = {
  solar_resource: 'Solar Resource',
  geotechnical: 'Geotechnical',
  eia: 'EIA',
  grid_study: 'Grid Study',
  financial_model: 'Financial Model',
  ppa: 'PPA',
  land_lease: 'Land Lease',
  design_drawings: 'Design Drawings',
  sld: 'SLD',
  cable_schedule: 'Cable Schedule',
  structural_calcs: 'Structural Calcs',
  fat_report: 'FAT Report',
  itp: 'ITP',
  ncr: 'NCR',
  progress_report: 'Progress Report',
  commissioning_report: 'Commissioning Report',
  iv_curves: 'IV Curves',
  thermal_imaging: 'Thermal Imaging',
  insulation_test: 'Insulation Test',
  as_built_drawings: 'As-Built Drawings',
  om_manual: 'O&M Manual',
  scada_documentation: 'SCADA Documentation',
  warranty_certificate: 'Warranty Certificate',
  performance_report: 'Performance Report',
  maintenance_log: 'Maintenance Log',
  drone_inspection: 'Drone Inspection',
  bess_test_report: 'BESS Test Report',
  ul9540a_report: 'UL 9540A Report',
  battery_passport: 'Battery Passport',
  insurance_policy: 'Insurance Policy',
  ie_report: 'IE Report',
  grid_compliance_cert: 'Grid Compliance Cert',
  feoc_assessment: 'FEOC Assessment',
  feoc_supplier_certification: 'FEOC Supplier Certification',
  forced_labour_due_diligence: 'Forced Labour Due Diligence',
  forced_labour_audit: 'Forced Labour Audit',
  battery_passport_data: 'Battery Passport Data',
  carbon_footprint_declaration: 'Carbon Footprint Declaration',
  cbam_emissions_report: 'CBAM Emissions Report',
  pfas_declaration: 'PFAS Declaration',
  mineral_traceability: 'Mineral Traceability',
};

export const PROJECT_TYPE_LABELS: Record<string, string> = {
  pv: 'Solar PV',
  bess: 'BESS',
  hybrid: 'Hybrid',
};

export const ORG_TYPE_LABELS: Record<string, string> = {
  ipp: 'IPP',
  epc: 'EPC',
  om: 'O&M',
  lender: 'Lender',
  technical_advisor: 'Technical Advisor',
  grid_operator: 'Grid Operator',
  oem: 'OEM',
  insurer: 'Insurer',
  regulator: 'Regulator',
};

export const STAKEHOLDER_ABBREV_LABELS: Record<string, string> = {
  DEV: 'Developer / IPP',
  EPC: 'EPC Contractor',
  TA: 'Technical Advisor',
  'O&M': 'O&M Provider',
  LEN: 'Lender / Investor',
  GRID: 'Grid Operator',
  'OEM-M': 'Module OEM',
  'OEM-I': 'Inverter OEM',
  'OEM-B': 'BESS OEM',
  REG: 'Regulatory Authority',
  INS: 'Insurance Underwriter',
  IE: 'Independent Engineer',
  LEGAL: 'Legal Counsel',
  ENV: 'Environmental Consultant',
  LAND: 'Landowner',
  '3P-QA': 'Third-Party QA',
};

export const REQUIREMENT_CONFIG_STATUS_LABELS: Record<string, string> = {
  enabled: 'Enabled',
  disabled: 'Disabled',
  not_applicable: 'N/A',
};

export const LIFECYCLE_STAGE_ORDER: string[] = [
  'feasibility', 'development', 'financing', 'engineering',
  'procurement', 'construction', 'commissioning', 'cod',
  'operations', 'decommissioning',
];

export const FINDING_TYPE_LABELS: Record<string, string> = {
  missing_document: 'Missing Document',
  inconsistency: 'Inconsistency',
  outdated: 'Outdated',
  format_error: 'Format Error',
  cross_reference: 'Cross-Reference',
  coverage_gap: 'Coverage Gap',
};

export const FINDING_SEVERITY_LABELS: Record<string, string> = {
  critical: 'Critical',
  high: 'High',
  medium: 'Medium',
  low: 'Low',
};

export const FINDING_TYPE_ICONS: Record<string, string> = {
  missing_document: 'FileX',
  inconsistency: 'GitCompare',
  outdated: 'CalendarClock',
  format_error: 'FileWarning',
  cross_reference: 'Link2Off',
  coverage_gap: 'ShieldAlert',
};

export const AI_FINDING_SEVERITY_LABELS: Record<string, string> = {
  critical: 'Critical',
  warning: 'Warning',
  info: 'Info',
};

export const AI_CHECK_STATUS_LABELS: Record<string, string> = {
  pass: 'Pass',
  fail: 'Fail',
  warning: 'Warning',
  not_applicable: 'N/A',
};

export const LIFECYCLE_STAGE_LABELS: Record<string, string> = {
  feasibility: 'Feasibility',
  development: 'Development',
  financing: 'Financing',
  engineering: 'Engineering',
  procurement: 'Procurement',
  construction: 'Construction',
  commissioning: 'Commissioning',
  cod: 'COD',
  operations: 'Operations',
  decommissioning: 'Decommissioning',
};
