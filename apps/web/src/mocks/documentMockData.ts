export type DocCategory =
  | 'SURVEY_REPORTS'
  | 'DESIGN_DRAWINGS'
  | 'CUSTOMER_AGREEMENTS'
  | 'GOVERNMENT_APPROVALS'
  | 'SAFETY_CHECKLISTS'
  | 'INSTALLATION_REPORTS'
  | 'COMPLETION_CERTIFICATES';

export type DocApprovalStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface VersionItem {
  version: string;
  updatedBy: string;
  updatedAt: string;
  comments: string;
}

export interface DocumentDetail {
  id: string;
  name: string;
  category: DocCategory;
  projectId: string;
  projectName: string;
  stage: string; // ProjectLifecycleStage enum string
  approvalStatus: DocApprovalStatus;
  size: string;
  version: string;
  versionHistory: VersionItem[];
  filePath: string;
  uploadedBy: string;
  uploadedAt: string;
  approvalTimeMinutes?: number; // for dynamic statistics
}

export const mockDocuments: DocumentDetail[] = [
  // SURVEY REPORTS
  {
    id: 'd-101',
    name: 'Topographical Shadow Analysis Report.pdf',
    category: 'SURVEY_REPORTS',
    projectId: 'p-1',
    projectName: 'Pune Residential Rooftop',
    stage: 'SITE_SURVEY',
    approvalStatus: 'APPROVED',
    size: '4.8 MB',
    version: 'v1.1.0',
    filePath: '/vault/p-1/topographical_shadow.pdf',
    uploadedBy: 'Amit Deshmukh',
    uploadedAt: '2026-05-02',
    approvalTimeMinutes: 120, // 2 hours
    versionHistory: [
      { version: 'v1.1.0', updatedBy: 'Amit Deshmukh', updatedAt: '2026-05-02', comments: 'Incorporated tree pruning metrics on West facade.' },
      { version: 'v1.0.0', updatedBy: 'Amit Deshmukh', updatedAt: '2026-05-01', comments: 'Initial drone canopy scan logs.' }
    ]
  },
  {
    id: 'd-102',
    name: 'ICU Structural Concrete Load Audit.pdf',
    category: 'SURVEY_REPORTS',
    projectId: 'p-4',
    projectName: 'Satara Hospital Hybrid Grid',
    stage: 'SITE_SURVEY',
    approvalStatus: 'APPROVED',
    size: '8.2 MB',
    version: 'v2.0.0',
    filePath: '/vault/p-4/icu_load_audit.pdf',
    uploadedBy: 'Amit Deshmukh',
    uploadedAt: '2026-01-12',
    approvalTimeMinutes: 240, // 4 hours
    versionHistory: [
      { version: 'v2.0.0', updatedBy: 'Rajesh Patil', updatedAt: '2026-01-12', comments: 'Re-certified by registered structural consultant.' },
      { version: 'v1.0.0', updatedBy: 'Amit Deshmukh', updatedAt: '2026-01-08', comments: 'Draft columns loading scans.' }
    ]
  },

  // DESIGN DRAWINGS
  {
    id: 'd-103',
    name: '10kW Hybrid Sync Wiring Schematics.dwg',
    category: 'DESIGN_DRAWINGS',
    projectId: 'p-1',
    projectName: 'Pune Residential Rooftop',
    stage: 'DESIGN_APPROVAL',
    approvalStatus: 'APPROVED',
    size: '12.4 MB',
    version: 'v1.0.0',
    filePath: '/vault/p-1/wiring_sync_sld.dwg',
    uploadedBy: 'Vivek Kulkarni',
    uploadedAt: '2026-05-10',
    approvalTimeMinutes: 180,
    versionHistory: [
      { version: 'v1.0.0', updatedBy: 'Vivek Kulkarni', updatedAt: '2026-05-10', comments: 'Signed-off by Chief Electrical Architect.' }
    ]
  },
  {
    id: 'd-104',
    name: 'Carport Canopy Fea Stress Structural CAD.dwg',
    category: 'DESIGN_DRAWINGS',
    projectId: 'p-2',
    projectName: 'Mumbai Corporate Solar Carport',
    stage: 'DESIGN_APPROVAL',
    approvalStatus: 'APPROVED',
    size: '28.1 MB',
    version: 'v1.2.0',
    filePath: '/vault/p-2/carport_canopy_cad.dwg',
    uploadedBy: 'Pooja Joshi',
    uploadedAt: '2026-04-26',
    approvalTimeMinutes: 480, // 8 hours
    versionHistory: [
      { version: 'v1.2.0', updatedBy: 'Pooja Joshi', updatedAt: '2026-04-26', comments: 'Refined bracing calculations for 150km/h winds.' },
      { version: 'v1.0.0', updatedBy: 'Pooja Joshi', updatedAt: '2026-04-22', comments: 'Initial framework CAD layout.' }
    ]
  },

  // CUSTOMER AGREEMENTS
  {
    id: 'd-105',
    name: 'Pune Rooftop Net-Metering SLA.pdf',
    category: 'CUSTOMER_AGREEMENTS',
    projectId: 'p-1',
    projectName: 'Pune Residential Rooftop',
    stage: 'PROJECT_CREATED',
    approvalStatus: 'APPROVED',
    size: '3.1 MB',
    version: 'v1.0.0',
    filePath: '/vault/p-1/rooftop_netmetering_sla.pdf',
    uploadedBy: 'Rajesh Patil',
    uploadedAt: '2026-04-28',
    approvalTimeMinutes: 60,
    versionHistory: [
      { version: 'v1.0.0', updatedBy: 'Rajesh Patil', updatedAt: '2026-04-28', comments: 'Executed digital sign-offs.' }
    ]
  },
  {
    id: 'd-106',
    name: 'Mumbai Carport Power Purchase Agreement.pdf',
    category: 'CUSTOMER_AGREEMENTS',
    projectId: 'p-2',
    projectName: 'Mumbai Corporate Solar Carport',
    stage: 'PROJECT_CREATED',
    approvalStatus: 'APPROVED',
    size: '5.5 MB',
    version: 'v2.1.0',
    filePath: '/vault/p-2/carport_ppa.pdf',
    uploadedBy: 'Rajesh Patil',
    uploadedAt: '2026-04-08',
    approvalTimeMinutes: 720, // 12 hours
    versionHistory: [
      { version: 'v2.1.0', updatedBy: 'Rajesh Patil', updatedAt: '2026-04-08', comments: 'Final pricing indexes attached.' }
    ]
  },

  // GOVERNMENT APPROVALS
  {
    id: 'd-107',
    name: 'Discom 10kW BiDirectional Meter NOC.pdf',
    category: 'GOVERNMENT_APPROVALS',
    projectId: 'p-1',
    projectName: 'Pune Residential Rooftop',
    stage: 'GRID_APPROVAL',
    approvalStatus: 'PENDING',
    size: '2.4 MB',
    version: 'v1.0.0',
    filePath: '/vault/p-1/discom_netmeter_noc.pdf',
    uploadedBy: 'Rajesh Patil',
    uploadedAt: '2026-05-24',
    versionHistory: [
      { version: 'v1.0.0', updatedBy: 'Rajesh Patil', updatedAt: '2026-05-24', comments: 'Awaiting inspector verification seal.' }
    ]
  },
  {
    id: 'd-108',
    name: 'CEIG Safety Operations Permit.pdf',
    category: 'GOVERNMENT_APPROVALS',
    projectId: 'p-4',
    projectName: 'Satara Hospital Hybrid Grid',
    stage: 'GRID_APPROVAL',
    approvalStatus: 'APPROVED',
    size: '4.1 MB',
    version: 'v1.0.0',
    filePath: '/vault/p-4/ceig_safety_permit.pdf',
    uploadedBy: 'Amit Deshmukh',
    uploadedAt: '2026-03-18',
    approvalTimeMinutes: 360,
    versionHistory: [
      { version: 'v1.0.0', updatedBy: 'Amit Deshmukh', updatedAt: '2026-03-18', comments: 'Permit signed-off by state inspector.' }
    ]
  },

  // SAFETY CHECKLISTS
  {
    id: 'd-109',
    name: 'Heavy Rigger Canopy Safety Log.pdf',
    category: 'SAFETY_CHECKLISTS',
    projectId: 'p-2',
    projectName: 'Mumbai Corporate Solar Carport',
    stage: 'STRUCTURE_INSTALLATION',
    approvalStatus: 'APPROVED',
    size: '1.8 MB',
    version: 'v1.0.0',
    filePath: '/vault/p-2/heavy_rigger_safety.pdf',
    uploadedBy: 'Amit Deshmukh',
    uploadedAt: '2026-05-18',
    approvalTimeMinutes: 30,
    versionHistory: [
      { version: 'v1.0.0', updatedBy: 'Amit Deshmukh', updatedAt: '2026-05-18', comments: 'Rigging harness and anchoring checks cleared.' }
    ]
  },
  {
    id: 'd-110',
    name: 'ICU Battery Storage Vault Safety Clearance.pdf',
    category: 'SAFETY_CHECKLISTS',
    projectId: 'p-4',
    projectName: 'Satara Hospital Hybrid Grid',
    stage: 'PANEL_MOUNTING',
    approvalStatus: 'APPROVED',
    size: '1.9 MB',
    version: 'v1.1.0',
    filePath: '/vault/p-4/battery_vault_safety.pdf',
    uploadedBy: 'Amit Deshmukh',
    uploadedAt: '2026-02-26',
    approvalTimeMinutes: 45,
    versionHistory: [
      { version: 'v1.1.0', updatedBy: 'Amit Deshmukh', updatedAt: '2026-02-26', comments: 'Verified fire suppression cabinets setup.' }
    ]
  },

  // INSTALLATION REPORTS
  {
    id: 'd-111',
    name: 'Pune Array Ground Mounting Report.pdf',
    category: 'INSTALLATION_REPORTS',
    projectId: 'p-1',
    projectName: 'Pune Residential Rooftop',
    stage: 'PANEL_MOUNTING',
    approvalStatus: 'APPROVED',
    size: '3.6 MB',
    version: 'v1.0.0',
    filePath: '/vault/p-1/mounting_report.pdf',
    uploadedBy: 'Amit Deshmukh',
    uploadedAt: '2026-05-28',
    approvalTimeMinutes: 90,
    versionHistory: [
      { version: 'v1.0.0', updatedBy: 'Amit Deshmukh', updatedAt: '2026-05-28', comments: '18 panels aligned and torque bolts certified.' }
    ]
  },
  {
    id: 'd-112',
    name: 'Carport Structural Anchor Pouring Report.pdf',
    category: 'INSTALLATION_REPORTS',
    projectId: 'p-2',
    projectName: 'Mumbai Corporate Solar Carport',
    stage: 'STRUCTURE_INSTALLATION',
    approvalStatus: 'REJECTED',
    size: '7.8 MB',
    version: 'v1.0.0',
    filePath: '/vault/p-2/foundations_pouring.pdf',
    uploadedBy: 'Amit Deshmukh',
    uploadedAt: '2026-05-24',
    approvalTimeMinutes: 150,
    versionHistory: [
      { version: 'v1.0.0', updatedBy: 'Amit Deshmukh', updatedAt: '2026-05-24', comments: 'Found core test failure on anchor block 4.' }
    ]
  },

  // COMPLETION CERTIFICATES
  {
    id: 'd-113',
    name: 'Satara ICU Grid Sync PTO Certificate.pdf',
    category: 'COMPLETION_CERTIFICATES',
    projectId: 'p-4',
    projectName: 'Satara Hospital Hybrid Grid',
    stage: 'COMPLETED',
    approvalStatus: 'APPROVED',
    size: '5.2 MB',
    version: 'v1.0.0',
    filePath: '/vault/p-4/pto_certificate.pdf',
    uploadedBy: 'Rajesh Patil',
    uploadedAt: '2026-03-24',
    approvalTimeMinutes: 240,
    versionHistory: [
      { version: 'v1.0.0', updatedBy: 'Rajesh Patil', updatedAt: '2026-03-24', comments: 'Signed PTO received.' }
    ]
  }
];
