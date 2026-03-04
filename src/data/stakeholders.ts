import { Organization, User } from "@/lib/types";

export const organizations: Organization[] = [
  { id: "org-greenfield", name: "GreenField Energy GmbH", type: "ipp", logo: "GF" },
  { id: "org-solaris", name: "Solaris Construction AG", type: "epc", logo: "SC" },
  { id: "org-techwind", name: "TechWind Operations GmbH", type: "om", logo: "TW" },
  { id: "org-eib", name: "European Infrastructure Bank", type: "lender", logo: "EI" },
  { id: "org-dnv", name: "DNV Energy Systems", type: "technical_advisor", logo: "DN" },
  { id: "org-50hertz", name: "50Hertz Transmission GmbH", type: "grid_operator", logo: "50" },
  { id: "org-jinko", name: "JinkoSolar", type: "oem", logo: "JK" },
  { id: "org-sma", name: "SMA Solar Technology AG", type: "oem", logo: "SM" },
  { id: "org-byd", name: "BYD Company Ltd.", type: "oem", logo: "BY" },
  { id: "org-sunridge-energy", name: "Sunridge Energy LLC", type: "ipp", logo: "SR" },
  { id: "org-blueoak-construction", name: "BlueOak Construction Inc.", type: "epc", logo: "BO" },
  { id: "org-ercot", name: "ERCOT (Electric Reliability Council of Texas)", type: "grid_operator", logo: "ER" },
  { id: "org-jpmorgan-energy", name: "JPMorgan Energy Finance", type: "lender", logo: "JP" },
];

export const users: User[] = [
  // GreenField Energy
  { id: "user-maria", name: "Maria Schmidt", email: "m.schmidt@greenfield.de", organizationId: "org-greenfield", role: "Compliance Manager", avatar: "MS" },
  { id: "user-thomas", name: "Thomas Weber", email: "t.weber@greenfield.de", organizationId: "org-greenfield", role: "Project Director", avatar: "TW" },
  { id: "user-anna", name: "Anna Müller", email: "a.mueller@greenfield.de", organizationId: "org-greenfield", role: "Finance Lead", avatar: "AM" },
  // Solaris Construction
  { id: "user-erik", name: "Erik Johansson", email: "e.johansson@solaris.de", organizationId: "org-solaris", role: "Site Manager", avatar: "EJ" },
  { id: "user-lars", name: "Lars Petersen", email: "l.petersen@solaris.de", organizationId: "org-solaris", role: "QA Engineer", avatar: "LP" },
  // TechWind Operations
  { id: "user-chen", name: "Chen Wei", email: "c.wei@techwind.de", organizationId: "org-techwind", role: "O&M Manager", avatar: "CW" },
  { id: "user-sophie", name: "Sophie Dupont", email: "s.dupont@techwind.de", organizationId: "org-techwind", role: "SCADA Engineer", avatar: "SD" },
  // European Infrastructure Bank
  { id: "user-james", name: "James Mitchell", email: "j.mitchell@eib.eu", organizationId: "org-eib", role: "Investment Analyst", avatar: "JM" },
  { id: "user-isabelle", name: "Isabelle Fournier", email: "i.fournier@eib.eu", organizationId: "org-eib", role: "Risk Manager", avatar: "IF" },
  // DNV
  { id: "user-hendrik", name: "Hendrik Vos", email: "h.vos@dnv.com", organizationId: "org-dnv", role: "Technical Advisor Lead", avatar: "HV" },
  { id: "user-priya", name: "Priya Sharma", email: "p.sharma@dnv.com", organizationId: "org-dnv", role: "Commissioning Inspector", avatar: "PS" },
  // 50Hertz
  { id: "user-markus", name: "Markus Braun", email: "m.braun@50hertz.com", organizationId: "org-50hertz", role: "Grid Compliance Officer", avatar: "MB" },
  { id: "user-katrin", name: "Katrin Engel", email: "k.engel@50hertz.com", organizationId: "org-50hertz", role: "Connection Engineer", avatar: "KE" },
  // JinkoSolar
  { id: "user-li", name: "Li Jun", email: "l.jun@jinkosolar.com", organizationId: "org-jinko", role: "Technical Support Manager", avatar: "LJ" },
  // SMA
  { id: "user-stefan", name: "Stefan Keller", email: "s.keller@sma.de", organizationId: "org-sma", role: "Commissioning Engineer", avatar: "SK" },
  { id: "user-nina", name: "Nina Fischer", email: "n.fischer@sma.de", organizationId: "org-sma", role: "Warranty Manager", avatar: "NF" },
  // BYD
  { id: "user-zhang", name: "Zhang Wei", email: "z.wei@byd.com", organizationId: "org-byd", role: "BESS Commissioning Lead", avatar: "ZW" },
  { id: "user-liu", name: "Liu Mei", email: "l.mei@byd.com", organizationId: "org-byd", role: "Battery Safety Engineer", avatar: "LM" },
  // Extra GreenField
  { id: "user-felix", name: "Felix Hartmann", email: "f.hartmann@greenfield.de", organizationId: "org-greenfield", role: "Environmental Lead", avatar: "FH" },
  { id: "user-laura", name: "Laura Becker", email: "l.becker@greenfield.de", organizationId: "org-greenfield", role: "Legal Counsel", avatar: "LB" },
  // Sunridge Energy
  { id: "user-sarah", name: "Sarah Chen", email: "s.chen@sunridge.com", organizationId: "org-sunridge-energy", role: "VP Development", avatar: "SC" },
  { id: "user-mike", name: "Mike Rodriguez", email: "m.rodriguez@sunridge.com", organizationId: "org-sunridge-energy", role: "Compliance Director", avatar: "MR" },
  // BlueOak Construction
  { id: "user-derek", name: "Derek Johnson", email: "d.johnson@blueoak.com", organizationId: "org-blueoak-construction", role: "Project Manager", avatar: "DJ" },
  { id: "user-rachel", name: "Rachel Kim", email: "r.kim@blueoak.com", organizationId: "org-blueoak-construction", role: "QA Lead", avatar: "RK" },
  // JPMorgan Energy Finance
  { id: "user-david", name: "David Park", email: "d.park@jpmorgan.com", organizationId: "org-jpmorgan-energy", role: "Senior Investment Officer", avatar: "DP" },
  // DNV (US office)
  { id: "user-karen", name: "Karen Thompson", email: "k.thompson@dnv.com", organizationId: "org-dnv", role: "US Technical Advisor", avatar: "KT" },
];

export const currentUser = users.find((u) => u.id === "user-maria")!;
