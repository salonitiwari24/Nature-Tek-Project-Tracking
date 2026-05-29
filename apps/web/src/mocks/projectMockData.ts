export interface Milestone {
  name: string;
  targetDate: string;
  completionDate?: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'OVERDUE';
}

export interface Task {
  id: string;
  title: string;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'BLOCKED' | 'IN_REVIEW' | 'DONE' | 'CANCELLED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  dueDate?: string;
}

export interface Approval {
  id: string;
  title: string;
  type: 'DESIGN' | 'PROCUREMENT' | 'QA' | 'HANDOVER' | 'STAGE_GATE' | 'BUDGET';
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  requestedBy: string;
  actedAt?: string;
}

export interface Document {
  id: string;
  title: string;
  category: 'SURVEY' | 'DESIGN' | 'PERMIT' | 'PHOTO' | 'TEST' | 'HANDOVER' | 'OTHER';
  fileName: string;
  sizeKb: number;
  uploadedAt: string;
}

export interface ResourceAllocation {
  id: string;
  name: string;
  role: 'PROJECT_MANAGER' | 'SITE_SUPERVISOR' | 'DESIGN_ENGINEER' | 'QA_INSPECTOR' | 'PROCUREMENT_OFFICER' | 'VEHICLE' | 'EQUIPMENT';
  type: 'HUMAN' | 'VEHICLE' | 'EQUIPMENT';
  details?: string;
}

export interface ProjectDetail {
  id: string;
  code: string;
  name: string;
  projectType: 'RESIDENTIAL' | 'COMMERCIAL' | 'INDUSTRIAL';
  clientType: 'INDIVIDUAL' | 'CORPORATE' | 'GOVERNMENT' | 'ENTERPRISE';
  capacityKw: number;
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  siteAddress: string;
  siteCity: string;
  siteState: string;
  pmName: string;
  pmEmail: string;
  currentStage:
    | 'PROJECT_CREATED'
    | 'SITE_SURVEY'
    | 'DESIGN_APPROVAL'
    | 'MATERIAL_PROCUREMENT'
    | 'MATERIAL_DELIVERY'
    | 'STRUCTURE_INSTALLATION'
    | 'PANEL_MOUNTING'
    | 'ELECTRICAL_WIRING'
    | 'INVERTER_INSTALLATION'
    | 'TESTING_COMMISSIONING'
    | 'GRID_APPROVAL'
    | 'PROJECT_HANDOVER'
    | 'COMPLETED';
  status: 'ACTIVE' | 'ON_HOLD' | 'COMPLETED' | 'ARCHIVED';
  targetStart: string;
  targetEnd: string;
  actualStart?: string;
  actualEnd?: string;
  budget: number;
  description: string;
  delayDays: number;
  milestones: Milestone[];
  tasks: Task[];
  approvals: Approval[];
  documents: Document[];
  resources: ResourceAllocation[];
}

export const mockProjects: ProjectDetail[] = [
  {
    id: 'p-1',
    code: 'PRJ-2026-001',
    name: 'Mesa Verde Residential Grid',
    projectType: 'RESIDENTIAL',
    clientType: 'INDIVIDUAL',
    capacityKw: 12.5,
    clientName: 'Robert Vance',
    clientEmail: 'bob@vance refrigeration.com',
    clientPhone: '+91 98230 11223',
    siteAddress: 'Block C-4, Kalyani Nagar',
    siteCity: 'Pune',
    siteState: 'MH',
    pmName: 'Amit Sharma',
    pmEmail: 'amit.sharma@naturetek.com',
    currentStage: 'STRUCTURE_INSTALLATION',
    status: 'ACTIVE',
    targetStart: '2026-05-01',
    targetEnd: '2026-06-15',
    actualStart: '2026-05-02',
    budget: 650000,
    description: '12.5 kW rooftop solar grid installation for a residential bungalow in Pune, incorporating premium glass-on-glass modules and a hybrid inverter battery backup system.',
    delayDays: 0,
    milestones: [
      { name: 'Charter signed & team assigned', targetDate: '2026-05-03', completionDate: '2026-05-03', status: 'COMPLETED' },
      { name: 'Roof structure survey & assessment', targetDate: '2026-05-07', completionDate: '2026-05-06', status: 'COMPLETED' },
      { name: 'Single-line diagram & design approval', targetDate: '2026-05-12', completionDate: '2026-05-11', status: 'COMPLETED' },
      { name: 'Material delivery to site', targetDate: '2026-05-20', completionDate: '2026-05-22', status: 'COMPLETED' },
      { name: 'Racking and mounting structures complete', targetDate: '2026-05-28', status: 'IN_PROGRESS' },
      { name: 'Modules installation & mounting', targetDate: '2026-06-03', status: 'PENDING' },
      { name: 'Electrical wiring & Inverter sync', targetDate: '2026-06-08', status: 'PENDING' },
      { name: 'PTO from utility board', targetDate: '2026-06-12', status: 'PENDING' },
    ],
    tasks: [
      { id: 't-101', title: 'Prepare mechanical racking components', status: 'DONE', priority: 'MEDIUM', dueDate: '2026-05-25' },
      { id: 't-102', title: 'Verify anchor bolt alignment on slate roof', status: 'IN_PROGRESS', priority: 'HIGH', dueDate: '2026-05-28' },
      { id: 't-103', title: 'Route DC conduits down to inverter bay', status: 'NOT_STARTED', priority: 'MEDIUM', dueDate: '2026-06-01' },
      { id: 't-104', title: 'Upload daily structure load test verification', status: 'NOT_STARTED', priority: 'LOW', dueDate: '2026-05-30' },
    ],
    approvals: [
      { id: 'app-101', title: 'SLD Electrical Drawing Sign-off', type: 'DESIGN', status: 'APPROVED', requestedBy: 'Amit Sharma', actedAt: '2026-05-11' },
      { id: 'app-102', title: 'Rooftop Structural Assessment Sign-off', type: 'STAGE_GATE', status: 'APPROVED', requestedBy: 'Amit Sharma', actedAt: '2026-05-06' },
    ],
    documents: [
      { id: 'doc-101', title: 'Structural Feasibility Report', category: 'SURVEY', fileName: 'MesaVerde_Structure_Report.pdf', sizeKb: 1450, uploadedAt: '2026-05-06' },
      { id: 'doc-102', title: 'Approved SLD CAD Blueprint', category: 'DESIGN', fileName: 'MesaVerde_SLD_Approved_v2.pdf', sizeKb: 3820, uploadedAt: '2026-05-11' },
    ],
    resources: [
      { id: 'res-101', name: 'Amit Sharma', role: 'PROJECT_MANAGER', type: 'HUMAN', details: 'PM - Overseeing daily timeline' },
      { id: 'res-102', name: 'Sandip Patil', role: 'SITE_SUPERVISOR', type: 'HUMAN', details: 'Field Supervisor - Kalyani Nagar' },
      { id: 'res-103', name: 'Mahindra Bolero Pickup (MH-12-PM-4532)', role: 'VEHICLE', type: 'VEHICLE', details: 'Logistics support' },
    ],
  },
  {
    id: 'p-2',
    code: 'PRJ-2026-002',
    name: 'Apex Logistics Distribution Center',
    projectType: 'COMMERCIAL',
    clientType: 'CORPORATE',
    capacityKw: 450.0,
    clientName: 'Apex Logistics Inc.',
    clientEmail: 'operations@apexlogistics.in',
    clientPhone: '+91 22 2450 9000',
    siteAddress: 'MIDC Industrial Area, Phase II',
    siteCity: 'Mumbai',
    siteState: 'MH',
    pmName: 'Priya Nair',
    pmEmail: 'priya.nair@naturetek.com',
    currentStage: 'DESIGN_APPROVAL',
    status: 'ACTIVE',
    targetStart: '2026-05-10',
    targetEnd: '2026-08-20',
    actualStart: '2026-05-12',
    budget: 18500000,
    description: '450 kW rooftop commercial solar PV array spanning across three warehouse sheds of Apex Logistics in Mumbai, utilizing tier-1 bifacial panels.',
    delayDays: 0,
    milestones: [
      { name: 'Charter signed & PM assignment', targetDate: '2026-05-12', completionDate: '2026-05-12', status: 'COMPLETED' },
      { name: 'Site structural mapping & roof load testing', targetDate: '2026-05-18', completionDate: '2026-05-19', status: 'COMPLETED' },
      { name: 'Single-line diagram layout submission', targetDate: '2026-05-25', status: 'IN_PROGRESS' },
      { name: 'Procurement invoice release', targetDate: '2026-06-15', status: 'PENDING' },
    ],
    tasks: [
      { id: 't-201', title: 'Submit 3D shading simulations report', status: 'DONE', priority: 'MEDIUM', dueDate: '2026-05-22' },
      { id: 't-202', title: 'Draft single-line diagram and protective relay settings', status: 'IN_PROGRESS', priority: 'HIGH', dueDate: '2026-05-25' },
      { id: 't-203', title: 'Review structural sheet thickness of warehouse shed 3', status: 'BLOCKED', priority: 'HIGH', dueDate: '2026-05-24' },
    ],
    approvals: [
      { id: 'app-201', title: 'Single-Line Diagram Verification', type: 'DESIGN', status: 'PENDING', requestedBy: 'Priya Nair' },
    ],
    documents: [
      { id: 'doc-201', title: 'Roof Structural Load Test Cert', category: 'SURVEY', fileName: 'Apex_Roof_Structure_Verification.pdf', sizeKb: 2890, uploadedAt: '2026-05-19' },
    ],
    resources: [
      { id: 'res-201', name: 'Priya Nair', role: 'PROJECT_MANAGER', type: 'HUMAN', details: 'PM - Commercial portfolio lead' },
      { id: 'res-202', name: 'Vikram Singh', role: 'DESIGN_ENGINEER', type: 'HUMAN', details: 'Designer - Electrical schematics' },
    ],
  },
  {
    id: 'p-3',
    code: 'PRJ-2026-003',
    name: 'Helix Biotech Campus Array',
    projectType: 'INDUSTRIAL',
    clientType: 'ENTERPRISE',
    capacityKw: 1200.0,
    clientName: 'Helix Pharmaceuticals Ltd.',
    clientEmail: 'facilities@helixbio.com',
    clientPhone: '+91 253 668 1111',
    siteAddress: 'Ambad MIDC, Sector 4',
    siteCity: 'Nashik',
    siteState: 'MH',
    pmName: 'Karan Malhotra',
    pmEmail: 'karan.malhotra@naturetek.com',
    currentStage: 'SITE_SURVEY',
    status: 'ACTIVE',
    targetStart: '2026-05-20',
    targetEnd: '2026-11-30',
    budget: 48000000,
    description: '1.2 MW high-capacity grid-tied solar array for Helix Biotech plant in Nashik. Combines rooftop modules with solar carport sheds to optimize ground coverage.',
    delayDays: 0,
    milestones: [
      { name: 'Charter sign-off & PM assignment', targetDate: '2026-05-22', completionDate: '2026-05-22', status: 'COMPLETED' },
      { name: 'Topographical and mechanical site survey', targetDate: '2026-05-30', status: 'IN_PROGRESS' },
      { name: 'Engineering layout package sign-off', targetDate: '2026-06-25', status: 'PENDING' },
    ],
    tasks: [
      { id: 't-301', title: 'Topographical drone mapping of site', status: 'IN_PROGRESS', priority: 'HIGH', dueDate: '2026-05-29' },
      { id: 't-302', title: 'Soil resistivity testing at carport locations', status: 'IN_PROGRESS', priority: 'MEDIUM', dueDate: '2026-05-30' },
    ],
    approvals: [],
    documents: [],
    resources: [
      { id: 'res-301', name: 'Karan Malhotra', role: 'PROJECT_MANAGER', type: 'HUMAN', details: 'PM - Industrial Lead' },
    ],
  },
  {
    id: 'p-4',
    code: 'PRJ-2026-004',
    name: 'Desert Vista Commercial Depot',
    projectType: 'COMMERCIAL',
    clientType: 'CORPORATE',
    capacityKw: 150.0,
    clientName: 'Desert Vista Commercials',
    clientEmail: 'info@desertvista.in',
    clientPhone: '+91 2162 230 456',
    siteAddress: 'Radhika Road, Near ST Stand',
    siteCity: 'Satara',
    siteState: 'MH',
    pmName: 'Amit Sharma',
    pmEmail: 'amit.sharma@naturetek.com',
    currentStage: 'INVERTER_INSTALLATION',
    status: 'ACTIVE',
    targetStart: '2026-03-01',
    targetEnd: '2026-05-15', // DELAYED! Current is May 29
    actualStart: '2026-03-02',
    budget: 7200000,
    description: '150 kW commercial solar carport and rooftop installation for Desert Vista Commercial complex in Satara. Delayed due to utility integration clearances.',
    delayDays: 14,
    milestones: [
      { name: 'Charter signed', targetDate: '2026-03-02', completionDate: '2026-03-02', status: 'COMPLETED' },
      { name: 'Site structural survey', targetDate: '2026-03-10', completionDate: '2026-03-09', status: 'COMPLETED' },
      { name: 'Electrical & structural designs approved', targetDate: '2026-03-20', completionDate: '2026-03-21', status: 'COMPLETED' },
      { name: 'Material procurement completion', targetDate: '2026-04-05', completionDate: '2026-04-08', status: 'COMPLETED' },
      { name: 'Material delivery to Satara site', targetDate: '2026-04-12', completionDate: '2026-04-15', status: 'COMPLETED' },
      { name: 'Mounting rack structures complete', targetDate: '2026-04-25', completionDate: '2026-04-24', status: 'COMPLETED' },
      { name: 'Solar modules panel mounting', targetDate: '2026-05-02', completionDate: '2026-05-03', status: 'COMPLETED' },
      { name: 'Electrical conduits and cabling runs', targetDate: '2026-05-10', completionDate: '2026-05-09', status: 'COMPLETED' },
      { name: 'Inverters mounting and grid integration', targetDate: '2026-05-14', status: 'OVERDUE' },
      { name: 'Testing and PTO commissioning', targetDate: '2026-05-20', status: 'PENDING' },
    ],
    tasks: [
      { id: 't-401', title: 'Mount three 50kW Sungrow Inverters', status: 'IN_PROGRESS', priority: 'HIGH', dueDate: '2026-05-14' },
      { id: 't-402', title: 'Complete inverter grounding grounding', status: 'BLOCKED', priority: 'URGENT', dueDate: '2026-05-16' },
      { id: 't-403', title: 'Prepare commission checklists', status: 'DONE', priority: 'LOW', dueDate: '2026-05-10' },
    ],
    approvals: [
      { id: 'app-401', title: 'Cabling Infrastructure QA', type: 'QA', status: 'APPROVED', requestedBy: 'Amit Sharma', actedAt: '2026-05-09' },
    ],
    documents: [
      { id: 'doc-401', title: 'QA Inspection Report - Cabling', category: 'TEST', fileName: 'Satara_Cabling_QA_Passed.pdf', sizeKb: 1820, uploadedAt: '2026-05-09' },
    ],
    resources: [
      { id: 'res-401', name: 'Amit Sharma', role: 'PROJECT_MANAGER', type: 'HUMAN', details: 'PM - Satara hub lead' },
      { id: 'res-402', name: 'Nikhil Kadam', role: 'SITE_SUPERVISOR', type: 'HUMAN', details: 'Supervisor - Satara' },
    ],
  },
  {
    id: 'p-5',
    code: 'PRJ-2026-005',
    name: 'Loma Linda Farm Solar Power',
    projectType: 'INDUSTRIAL',
    clientType: 'CORPORATE',
    capacityKw: 850.0,
    clientName: 'Loma Linda Agribusiness',
    clientEmail: 'info@lomalindafarms.com',
    clientPhone: '+91 231 268 9988',
    siteAddress: 'Shiroli MIDC, Block H-10',
    siteCity: 'Kolhapur',
    siteState: 'MH',
    pmName: 'Priya Nair',
    pmEmail: 'priya.nair@naturetek.com',
    currentStage: 'COMPLETED',
    status: 'COMPLETED',
    targetStart: '2026-01-10',
    targetEnd: '2026-04-30',
    actualStart: '2026-01-12',
    actualEnd: '2026-04-28',
    budget: 34000000,
    description: '850 kW ground-mounted solar plant for Loma Linda cold storage facilities in Kolhapur, achieving complete green power sustainability goals.',
    delayDays: 0,
    milestones: [
      { name: 'Charter signed', targetDate: '2026-01-12', completionDate: '2026-01-12', status: 'COMPLETED' },
      { name: 'Survey report & soil verification', targetDate: '2026-01-20', completionDate: '2026-01-19', status: 'COMPLETED' },
      { name: 'Electrical engineering blueprint approved', targetDate: '2026-02-05', completionDate: '2026-02-04', status: 'COMPLETED' },
      { name: 'Procurement complete', targetDate: '2026-02-25', completionDate: '2026-02-25', status: 'COMPLETED' },
      { name: 'Materials delivery to site', targetDate: '2026-03-05', completionDate: '2026-03-08', status: 'COMPLETED' },
      { name: 'Ground structure racking installation', targetDate: '2026-03-20', completionDate: '2026-03-18', status: 'COMPLETED' },
      { name: 'Panel mounting', targetDate: '2026-04-01', completionDate: '2026-03-29', status: 'COMPLETED' },
      { name: 'DC/AC runs & Inverter commission', targetDate: '2026-04-10', completionDate: '2026-04-09', status: 'COMPLETED' },
      { name: 'CEIG & MSEDCL Net Metering approval', targetDate: '2026-04-22', completionDate: '2026-04-23', status: 'COMPLETED' },
      { name: 'Operations Handover to Client', targetDate: '2026-04-30', completionDate: '2026-04-28', status: 'COMPLETED' },
    ],
    tasks: [
      { id: 't-501', title: 'Execute net metering synchronization test', status: 'DONE', priority: 'HIGH', dueDate: '2026-04-22' },
      { id: 't-502', title: 'Prepare O&M warranty booklets', status: 'DONE', priority: 'LOW', dueDate: '2026-04-26' },
    ],
    approvals: [
      { id: 'app-501', title: 'Net Metering Approval', type: 'HANDOVER', status: 'APPROVED', requestedBy: 'Priya Nair', actedAt: '2026-04-23' },
      { id: 'app-502', title: 'Final Handover Sign-off', type: 'HANDOVER', status: 'APPROVED', requestedBy: 'Priya Nair', actedAt: '2026-04-28' },
    ],
    documents: [
      { id: 'doc-501', title: 'MSEDCL Net Metering Approval Cert', category: 'PERMIT', fileName: 'Kolhapur_LomaLinda_NetMeter.pdf', sizeKb: 2450, uploadedAt: '2026-04-23' },
      { id: 'doc-502', title: 'Executed Handover Protocol Document', category: 'HANDOVER', fileName: 'Kolhapur_LomaLinda_Handover.pdf', sizeKb: 1220, uploadedAt: '2026-04-28' },
    ],
    resources: [
      { id: 'res-501', name: 'Priya Nair', role: 'PROJECT_MANAGER', type: 'HUMAN', details: 'PM - Kolhapur Lead' },
    ],
  },
  {
    id: 'p-6',
    code: 'PRJ-2026-006',
    name: 'Pioneer School Rooftop Array',
    projectType: 'COMMERCIAL',
    clientType: 'GOVERNMENT',
    capacityKw: 85.0,
    clientName: 'Pioneer Unified School Dist.',
    clientEmail: 'admin@pioneerschools.edu.in',
    clientPhone: '+91 240 233 4567',
    siteAddress: 'Cidco Sector 3, Town Center',
    siteCity: 'Aurangabad',
    siteState: 'MH',
    pmName: 'Karan Malhotra',
    pmEmail: 'karan.malhotra@naturetek.com',
    currentStage: 'PROJECT_CREATED',
    status: 'ACTIVE',
    targetStart: '2026-06-01',
    targetEnd: '2026-08-15',
    budget: 4200000,
    description: '85 kW solar grid installation on the primary block rooftop of Pioneer School, Aurangabad. Sponsored under municipal green educational campus initiatives.',
    delayDays: 0,
    milestones: [
      { name: 'Project initiation & PM sign-off', targetDate: '2026-06-01', status: 'PENDING' },
    ],
    tasks: [],
    approvals: [],
    documents: [],
    resources: [
      { id: 'res-601', name: 'Karan Malhotra', role: 'PROJECT_MANAGER', type: 'HUMAN', details: 'PM - Aurangabad regional Lead' },
    ],
  },
  {
    id: 'p-7',
    code: 'PRJ-2026-007',
    name: 'Sunset Heights Residential Solar',
    projectType: 'RESIDENTIAL',
    clientType: 'INDIVIDUAL',
    capacityKw: 9.6,
    clientName: 'Emily Watson',
    clientEmail: 'emily.watson@gmail.com',
    clientPhone: '+91 94220 54321',
    siteAddress: 'Sunset Bungalows, Highway Road',
    siteCity: 'Satara',
    siteState: 'MH',
    pmName: 'Amit Sharma',
    pmEmail: 'amit.sharma@naturetek.com',
    currentStage: 'PROJECT_HANDOVER',
    status: 'ACTIVE',
    targetStart: '2026-04-05',
    targetEnd: '2026-05-25', // DELAYED targetEnd
    actualStart: '2026-04-06',
    budget: 520000,
    description: '9.6 kW domestic rooftop solar system for Sunset bungalow. Handover documentation is currently under final review.',
    delayDays: 4,
    milestones: [
      { name: 'Charter signed & team assigned', targetDate: '2026-04-06', completionDate: '2026-04-06', status: 'COMPLETED' },
      { name: 'Site survey', targetDate: '2026-04-10', completionDate: '2026-04-10', status: 'COMPLETED' },
      { name: 'Drawings design signoff', targetDate: '2026-04-15', completionDate: '2026-04-14', status: 'COMPLETED' },
      { name: 'Material delivery', targetDate: '2026-04-22', completionDate: '2026-04-24', status: 'COMPLETED' },
      { name: 'Racking complete', targetDate: '2026-04-30', completionDate: '2026-04-29', status: 'COMPLETED' },
      { name: 'Panels installation', targetDate: '2026-05-06', completionDate: '2026-05-08', status: 'COMPLETED' },
      { name: 'Electrical integration & inverter commissioned', targetDate: '2026-05-14', completionDate: '2026-05-15', status: 'COMPLETED' },
      { name: 'Grid Net Metering approval', targetDate: '2026-05-22', completionDate: '2026-05-23', status: 'COMPLETED' },
      { name: 'Project Handover sign-off', targetDate: '2026-05-25', status: 'IN_PROGRESS' },
    ],
    tasks: [
      { id: 't-701', title: 'Collect net metering completion docket', status: 'DONE', priority: 'MEDIUM', dueDate: '2026-05-22' },
      { id: 't-702', title: 'PM site walkthrough with homeowner', status: 'IN_PROGRESS', priority: 'HIGH', dueDate: '2026-05-25' },
    ],
    approvals: [
      { id: 'app-701', title: 'Homeowner Handover Protocol', type: 'HANDOVER', status: 'PENDING', requestedBy: 'Amit Sharma' },
    ],
    documents: [
      { id: 'doc-701', title: 'Net Meter Synchronization Slip', category: 'PERMIT', fileName: 'Sunset_NetMeter_Slip.pdf', sizeKb: 650, uploadedAt: '2026-05-23' },
    ],
    resources: [
      { id: 'res-701', name: 'Amit Sharma', role: 'PROJECT_MANAGER', type: 'HUMAN', details: 'PM - Satara Lead' },
    ],
  },
  {
    id: 'p-8',
    code: 'PRJ-2026-008',
    name: 'Oak Creek Commercial Plaza',
    projectType: 'COMMERCIAL',
    clientType: 'CORPORATE',
    capacityKw: 220.0,
    clientName: 'Oak Creek Properties',
    clientEmail: 'facilities@oakcreek.co.in',
    clientPhone: '+91 2162 280 999',
    siteAddress: 'National Highway 4, Wadhe Phata',
    siteCity: 'Satara',
    siteState: 'MH',
    pmName: 'Amit Sharma',
    pmEmail: 'amit.sharma@naturetek.com',
    currentStage: 'MATERIAL_PROCUREMENT',
    status: 'ON_HOLD',
    targetStart: '2026-03-15',
    targetEnd: '2026-07-01',
    actualStart: '2026-03-20',
    budget: 9800000,
    description: '220 kW commercial plaza solar installation. Project is temporarily on hold due to commercial payment term revisions between client partners.',
    delayDays: 0,
    milestones: [
      { name: 'Charter signed', targetDate: '2026-03-20', completionDate: '2026-03-20', status: 'COMPLETED' },
      { name: 'Site mechanical assessment', targetDate: '2026-03-30', completionDate: '2026-04-02', status: 'COMPLETED' },
      { name: 'SLD blueprint approval', targetDate: '2026-04-15', completionDate: '2026-04-18', status: 'COMPLETED' },
      { name: 'Procurement invoice approvals', targetDate: '2026-05-10', status: 'IN_PROGRESS' },
    ],
    tasks: [
      { id: 't-801', title: 'Submit revised PO for structure framework', status: 'IN_PROGRESS', priority: 'HIGH', dueDate: '2026-05-15' },
    ],
    approvals: [
      { id: 'app-801', title: 'Procurement PO Approval - Structure', type: 'PROCUREMENT', status: 'PENDING', requestedBy: 'Amit Sharma' },
    ],
    documents: [],
    resources: [
      { id: 'res-801', name: 'Amit Sharma', role: 'PROJECT_MANAGER', type: 'HUMAN', details: 'PM - Satara Lead' },
    ],
  },
  {
    id: 'p-9',
    code: 'PRJ-2026-009',
    name: 'Valley Care Medical Center',
    projectType: 'COMMERCIAL',
    clientType: 'CORPORATE',
    capacityKw: 310.0,
    clientName: 'Valley Health Network',
    clientEmail: 'maintenance@valleyhealth.in',
    clientPhone: '+91 253 238 9090',
    siteAddress: 'Panchavati Road, Near Apollo Hospital',
    siteCity: 'Nashik',
    siteState: 'MH',
    pmName: 'Karan Malhotra',
    pmEmail: 'karan.malhotra@naturetek.com',
    currentStage: 'COMPLETED',
    status: 'COMPLETED',
    targetStart: '2026-02-01',
    targetEnd: '2026-05-10',
    actualStart: '2026-02-03',
    actualEnd: '2026-05-08',
    budget: 13500000,
    description: '310 kW rooftop solar project for clean emergency energy backup at Valley Care Medical Center, Nashik. Successfully completed ahead of target schedule.',
    delayDays: 0,
    milestones: [
      { name: 'Charter signed', targetDate: '2026-02-03', completionDate: '2026-02-03', status: 'COMPLETED' },
      { name: 'Site structure survey', targetDate: '2026-02-12', completionDate: '2026-02-11', status: 'COMPLETED' },
      { name: 'CAD design approved', targetDate: '2026-02-22', completionDate: '2026-02-21', status: 'COMPLETED' },
      { name: 'Procurement released', targetDate: '2026-03-10', completionDate: '2026-03-09', status: 'COMPLETED' },
      { name: 'Material delivery', targetDate: '2026-03-20', completionDate: '2026-03-22', status: 'COMPLETED' },
      { name: 'Structure installation complete', targetDate: '2026-04-05', completionDate: '2026-04-04', status: 'COMPLETED' },
      { name: 'Solar panels mounted', targetDate: '2026-04-15', completionDate: '2026-04-14', status: 'COMPLETED' },
      { name: 'Electrical sync done', targetDate: '2026-04-25', completionDate: '2026-04-26', status: 'COMPLETED' },
      { name: 'Grid connection Net Meter approved', targetDate: '2026-05-02', completionDate: '2026-05-04', status: 'COMPLETED' },
      { name: 'Operational handover complete', targetDate: '2026-05-10', completionDate: '2026-05-08', status: 'COMPLETED' },
    ],
    tasks: [],
    approvals: [
      { id: 'app-901', title: 'Hospital Commissioning Signoff', type: 'QA', status: 'APPROVED', requestedBy: 'Karan Malhotra', actedAt: '2026-05-04' },
    ],
    documents: [
      { id: 'doc-901', title: 'QA Technical Clearance Certificate', category: 'TEST', fileName: 'Nashik_Hospital_QA_Cert.pdf', sizeKb: 3420, uploadedAt: '2026-05-04' },
    ],
    resources: [
      { id: 'res-901', name: 'Karan Malhotra', role: 'PROJECT_MANAGER', type: 'HUMAN', details: 'PM - Nashik regional Lead' },
    ],
  },
  {
    id: 'p-10',
    code: 'PRJ-2026-010',
    name: 'River Basin Pumping Station',
    projectType: 'INDUSTRIAL',
    clientType: 'GOVERNMENT',
    capacityKw: 1500.0,
    clientName: 'River Basin Water District',
    clientEmail: 'waterops@yuma.gov.in',
    clientPhone: '+91 2162 220 112',
    siteAddress: 'Krishna River Canal, Outer Bypass',
    siteCity: 'Satara',
    siteState: 'MH',
    pmName: 'Amit Sharma',
    pmEmail: 'amit.sharma@naturetek.com',
    currentStage: 'MATERIAL_DELIVERY',
    status: 'ACTIVE',
    targetStart: '2026-04-10',
    targetEnd: '2026-05-20', // DELAYED targetEnd
    actualStart: '2026-04-12',
    budget: 56000000,
    description: '1.5 MW high-voltage solar energy facility supporting Satara municipal canal pumping operations. Delayed due to transit logistics problems from panel manufacturer.',
    delayDays: 9,
    milestones: [
      { name: 'Charter signed', targetDate: '2026-04-12', completionDate: '2026-04-12', status: 'COMPLETED' },
      { name: 'Topographical and geotechnical survey', targetDate: '2026-04-20', completionDate: '2026-04-18', status: 'COMPLETED' },
      { name: 'Engineering package drawings approved', targetDate: '2026-04-30', completionDate: '2026-04-29', status: 'COMPLETED' },
      { name: 'Material procurement issued', targetDate: '2026-05-10', completionDate: '2026-05-11', status: 'COMPLETED' },
      { name: 'Material delivery to Krishna canal site', targetDate: '2026-05-20', status: 'OVERDUE' },
    ],
    tasks: [
      { id: 't-1001', title: 'Verify invoice transit clearances at highway checkpost', status: 'IN_PROGRESS', priority: 'HIGH', dueDate: '2026-05-18' },
      { id: 't-1002', title: 'Layout structural foundations coordinate coordinates', status: 'NOT_STARTED', priority: 'MEDIUM', dueDate: '2026-05-25' },
    ],
    approvals: [
      { id: 'app-1001', title: 'Geotechnical Soil Survey Sign-off', type: 'DESIGN', status: 'APPROVED', requestedBy: 'Amit Sharma', actedAt: '2026-04-18' },
    ],
    documents: [
      { id: 'doc-1001', title: 'Geotechnical Soil resistivity Report', category: 'SURVEY', fileName: 'Satara_Canal_Soil_Geotech.pdf', sizeKb: 3950, uploadedAt: '2026-04-18' },
    ],
    resources: [
      { id: 'res-1001', name: 'Amit Sharma', role: 'PROJECT_MANAGER', type: 'HUMAN', details: 'PM - Satara Lead' },
    ],
  },
  {
    id: 'p-11',
    code: 'PRJ-2026-011',
    name: 'Skyline Ridge Residential Grid',
    projectType: 'RESIDENTIAL',
    clientType: 'INDIVIDUAL',
    capacityKw: 15.0,
    clientName: 'Arthur Dent',
    clientEmail: 'arthur.dent@galaxy.com',
    clientPhone: '+91 98900 42424',
    siteAddress: 'Plot 42, Gayan Samaj Road',
    siteCity: 'Pune',
    siteState: 'MH',
    pmName: 'Amit Sharma',
    pmEmail: 'amit.sharma@naturetek.com',
    currentStage: 'COMPLETED',
    status: 'COMPLETED',
    targetStart: '2026-03-01',
    targetEnd: '2026-04-10',
    actualStart: '2026-03-02',
    actualEnd: '2026-04-08',
    budget: 780000,
    description: '15 kW residential solar rooftop grid for Skyline Ridge estate villa, featuring a double inverter control board and integrated battery backup grid.',
    delayDays: 0,
    milestones: [
      { name: 'Initiation protocol signed', targetDate: '2026-03-02', completionDate: '2026-03-02', status: 'COMPLETED' },
      { name: 'Site rooftop scan survey', targetDate: '2026-03-08', completionDate: '2026-03-08', status: 'COMPLETED' },
      { name: 'Design wiring approval', targetDate: '2026-03-15', completionDate: '2026-03-14', status: 'COMPLETED' },
      { name: 'Procure materials complete', targetDate: '2026-03-24', completionDate: '2026-03-24', status: 'COMPLETED' },
      { name: 'Material delivery to site', targetDate: '2026-03-28', completionDate: '2026-03-28', status: 'COMPLETED' },
      { name: 'Structure mechanical racking complete', targetDate: '2026-04-02', completionDate: '2026-04-01', status: 'COMPLETED' },
      { name: 'Modules installation complete', targetDate: '2026-04-04', completionDate: '2026-04-03', status: 'COMPLETED' },
      { name: 'AC connection netmetering ready', targetDate: '2026-04-06', completionDate: '2026-04-05', status: 'COMPLETED' },
      { name: 'Net Metering commissioned', targetDate: '2026-04-08', completionDate: '2026-04-07', status: 'COMPLETED' },
      { name: 'Client handover complete', targetDate: '2026-04-10', completionDate: '2026-04-08', status: 'COMPLETED' },
    ],
    tasks: [],
    approvals: [],
    documents: [],
    resources: [],
  },
  {
    id: 'p-12',
    code: 'PRJ-2026-012',
    name: 'Saraswati Commercial complex',
    projectType: 'COMMERCIAL',
    clientType: 'CORPORATE',
    capacityKw: 110.0,
    clientName: 'Saraswati Trust Properties',
    clientEmail: 'trustee@saraswati.org',
    clientPhone: '+91 240 248 1122',
    siteAddress: 'Station Road, Near Railway Station',
    siteCity: 'Aurangabad',
    siteState: 'MH',
    pmName: 'Karan Malhotra',
    pmEmail: 'karan.malhotra@naturetek.com',
    currentStage: 'ELECTRICAL_WIRING',
    status: 'ACTIVE',
    targetStart: '2026-04-01',
    targetEnd: '2026-06-10',
    actualStart: '2026-04-02',
    budget: 5200000,
    description: '110 kW high-efficiency rooftop system for Saraswati commercial center in Aurangabad. Currently undergoing electrical cabling works.',
    delayDays: 0,
    milestones: [
      { name: 'Charter signed', targetDate: '2026-04-02', completionDate: '2026-04-02', status: 'COMPLETED' },
      { name: 'Survey mechanical scan complete', targetDate: '2026-04-10', completionDate: '2026-04-09', status: 'COMPLETED' },
      { name: 'Design SLD blueprint approved', targetDate: '2026-04-20', completionDate: '2026-04-19', status: 'COMPLETED' },
      { name: 'Material procurement invoice released', targetDate: '2026-05-02', completionDate: '2026-05-04', status: 'COMPLETED' },
      { name: 'Material delivery to station road site', targetDate: '2026-05-10', completionDate: '2026-05-12', status: 'COMPLETED' },
      { name: 'Racking frameworks and anchorage complete', targetDate: '2026-05-20', completionDate: '2026-05-19', status: 'COMPLETED' },
      { name: 'Panel modules installation mounted', targetDate: '2026-05-26', completionDate: '2026-05-25', status: 'COMPLETED' },
      { name: 'DC cable connections & conduit mapping', targetDate: '2026-06-02', status: 'IN_PROGRESS' },
    ],
    tasks: [
      { id: 't-1201', title: 'Route 10mm DC copper cables through conduits', status: 'IN_PROGRESS', priority: 'HIGH', dueDate: '2026-06-02' },
    ],
    approvals: [],
    documents: [],
    resources: [],
  },
  {
    id: 'p-13',
    code: 'PRJ-2026-013',
    name: 'Satara Sugar Plant Carport',
    projectType: 'INDUSTRIAL',
    clientType: 'CORPORATE',
    capacityKw: 600.0,
    clientName: 'Satara Sugar Cooperatives Ltd.',
    clientEmail: 'infrastructure@satarasugar.co.in',
    clientPhone: '+91 2162 254 7770',
    siteAddress: 'Industrial Zone, Block D-4',
    siteCity: 'Satara',
    siteState: 'MH',
    pmName: 'Amit Sharma',
    pmEmail: 'amit.sharma@naturetek.com',
    currentStage: 'PROJECT_CREATED',
    status: 'ACTIVE',
    targetStart: '2026-05-10',
    targetEnd: '2026-08-30',
    budget: 24000000,
    description: '600 kW heavy industrial solar carport for the sugar refinery parking terminal in Satara.',
    delayDays: 0,
    milestones: [
      { name: 'Charter signed', targetDate: '2026-05-18', completionDate: '2026-05-17', status: 'COMPLETED' },
      { name: 'Topographical layout survey', targetDate: '2026-05-25', status: 'PENDING' },
    ],
    tasks: [
      { id: 't-901', title: 'Sugar plant site survey layout', status: 'DONE', priority: 'HIGH', dueDate: '2026-05-18' },
      { id: 't-902', title: 'Sugar plant charter sign-off', status: 'IN_PROGRESS', priority: 'HIGH', dueDate: '2026-05-28' },
    ],
    approvals: [],
    documents: [],
    resources: [],
  },
];
