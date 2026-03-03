import { PermissionEntry, DocumentCategory } from "@/lib/types";

const orgIds = [
  "org-greenfield", "org-solaris", "org-techwind", "org-eib",
  "org-dnv", "org-50hertz", "org-jinko", "org-sma", "org-byd",
];

const categories: DocumentCategory[] = [
  "design_drawings", "commissioning_report", "as_built_drawings",
  "financial_model", "ppa", "performance_report", "maintenance_log",
  "grid_compliance_cert", "bess_test_report", "insurance_policy",
];

type PermMap = Record<string, Record<string, PermissionEntry["level"]>>;

const matrix: PermMap = {
  "org-greenfield": {
    design_drawings: "admin", commissioning_report: "admin", as_built_drawings: "admin",
    financial_model: "admin", ppa: "admin", performance_report: "admin",
    maintenance_log: "admin", grid_compliance_cert: "admin", bess_test_report: "admin",
    insurance_policy: "admin",
  },
  "org-solaris": {
    design_drawings: "upload", commissioning_report: "upload", as_built_drawings: "upload",
    financial_model: "none", ppa: "none", performance_report: "view",
    maintenance_log: "none", grid_compliance_cert: "view", bess_test_report: "view",
    insurance_policy: "none",
  },
  "org-techwind": {
    design_drawings: "view", commissioning_report: "view", as_built_drawings: "download",
    financial_model: "none", ppa: "none", performance_report: "upload",
    maintenance_log: "upload", grid_compliance_cert: "view", bess_test_report: "view",
    insurance_policy: "none",
  },
  "org-eib": {
    design_drawings: "view", commissioning_report: "download", as_built_drawings: "view",
    financial_model: "download", ppa: "download", performance_report: "download",
    maintenance_log: "none", grid_compliance_cert: "download", bess_test_report: "download",
    insurance_policy: "download",
  },
  "org-dnv": {
    design_drawings: "download", commissioning_report: "download", as_built_drawings: "download",
    financial_model: "view", ppa: "view", performance_report: "download",
    maintenance_log: "view", grid_compliance_cert: "download", bess_test_report: "download",
    insurance_policy: "view",
  },
  "org-50hertz": {
    design_drawings: "view", commissioning_report: "view", as_built_drawings: "view",
    financial_model: "none", ppa: "none", performance_report: "view",
    maintenance_log: "none", grid_compliance_cert: "download", bess_test_report: "none",
    insurance_policy: "none",
  },
  "org-jinko": {
    design_drawings: "view", commissioning_report: "view", as_built_drawings: "none",
    financial_model: "none", ppa: "none", performance_report: "view",
    maintenance_log: "none", grid_compliance_cert: "none", bess_test_report: "none",
    insurance_policy: "none",
  },
  "org-sma": {
    design_drawings: "view", commissioning_report: "upload", as_built_drawings: "none",
    financial_model: "none", ppa: "none", performance_report: "view",
    maintenance_log: "none", grid_compliance_cert: "none", bess_test_report: "none",
    insurance_policy: "none",
  },
  "org-byd": {
    design_drawings: "view", commissioning_report: "upload", as_built_drawings: "none",
    financial_model: "none", ppa: "none", performance_report: "view",
    maintenance_log: "none", grid_compliance_cert: "none", bess_test_report: "upload",
    insurance_policy: "none",
  },
};

export const permissions: PermissionEntry[] = [];

for (const orgId of orgIds) {
  for (const cat of categories) {
    permissions.push({
      organizationId: orgId,
      documentCategory: cat,
      level: matrix[orgId]?.[cat] || "none",
    });
  }
}

export const permissionCategories = categories;
