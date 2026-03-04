/**
 * Regulation Router — maps gateway checks to regulation source files
 * based on project jurisdiction.
 */

export interface RegulationFile {
  id: string;
  name: string;
  fileName: string;
  jurisdictions: string[];  // which jurisdictions require this regulation
  focusArticles?: string[];
}

/**
 * G8 regulation configuration — maps each regulation to its extracted text file
 * and the jurisdictions that require it.
 */
export const G8_REGULATION_CONFIG: RegulationFile[] = [
  {
    id: "eu-battery-reg",
    name: "EU Battery Regulation (2023/1542)",
    fileName: "eu-battery-reg-passport-arts.txt",
    jurisdictions: ["EU", "DE", "PT"],
    focusArticles: ["Art. 7", "Art. 8", "Art. 10", "Art. 48", "Art. 77", "Art. 78", "Annex XIII"],
  },
  {
    id: "csrd",
    name: "Corporate Sustainability Reporting Directive (2022/2464)",
    fileName: "csrd-reporting-arts.txt",
    jurisdictions: ["EU", "DE", "PT"],
    focusArticles: ["Art. 19a", "Art. 19b", "Art. 19c", "Art. 19d"],
  },
  {
    id: "esrs-e1",
    name: "ESRS E1 — Climate Change",
    fileName: "esrs-e1-climate.txt",
    jurisdictions: ["EU", "DE", "PT"],
  },
  {
    id: "esrs-e2",
    name: "ESRS E2 — Pollution",
    fileName: "esrs-e2-pollution.txt",
    jurisdictions: ["EU", "DE", "PT"],
  },
  {
    id: "esrs-e4",
    name: "ESRS E4 — Biodiversity and Ecosystems",
    fileName: "esrs-e4-biodiversity.txt",
    jurisdictions: ["EU", "DE", "PT"],
  },
  {
    id: "esrs-e5",
    name: "ESRS E5 — Resource Use and Circular Economy",
    fileName: "esrs-e5-circular-economy.txt",
    jurisdictions: ["EU", "DE", "PT"],
  },
  {
    id: "taxonomy-cda",
    name: "EU Taxonomy Climate Delegated Act — Solar & Storage",
    fileName: "taxonomy-cda-solar-storage.txt",
    jurisdictions: ["EU", "DE", "PT"],
    focusArticles: ["§4.1", "§4.10", "Appendix A"],
  },
  {
    id: "nature-restoration",
    name: "EU Nature Restoration Regulation (2024/1735)",
    fileName: "nature-restoration-art11.txt",
    jurisdictions: ["EU", "DE", "PT"],
    focusArticles: ["Art. 11"],
  },
  {
    id: "fgas",
    name: "EU F-Gas Regulation (2024/573)",
    fileName: "fgas-reg-relevant.txt",
    jurisdictions: ["EU", "DE", "PT"],
    focusArticles: ["Art. 3", "Art. 4"],
  },
];

/**
 * Returns the regulation files applicable to a given gateway and set of jurisdictions.
 */
export function getRegulationsForCheck(
  gatewayCode: string,
  jurisdictions: string[],
): RegulationFile[] {
  if (gatewayCode !== "G8") return [];

  return G8_REGULATION_CONFIG.filter((reg) =>
    reg.jurisdictions.some((j) => jurisdictions.includes(j))
  );
}

/**
 * Returns a flat list of focus articles for all applicable regulations.
 */
export function getFocusArticles(regulations: RegulationFile[]): string[] {
  return regulations.flatMap((r) => r.focusArticles ?? []);
}
