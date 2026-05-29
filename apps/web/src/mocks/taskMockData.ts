export type TaskCategory =
  | 'SURVEY'
  | 'DESIGN'
  | 'PROCUREMENT'
  | 'INSTALLATION'
  | 'ELECTRICAL'
  | 'TESTING'
  | 'DOCUMENTATION'
  | 'APPROVAL';

export type TaskStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'BLOCKED' | 'IN_REVIEW' | 'DONE' | 'CANCELLED';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export interface TaskDependency {
  id: string;
  title: string;
  status: TaskStatus;
  relationType: 'BLOCKING' | 'DEPENDENT';
}

export interface TaskComment {
  id: string;
  authorName: string;
  authorRole: string;
  body: string;
  createdAt: string;
}

export interface TaskAttachment {
  id: string;
  name: string;
  sizeKb: number;
  uploadedAt: string;
}

export interface TaskDetail {
  id: string;
  projectId: string;
  projectName: string;
  projectStage: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  category: TaskCategory;
  assigneeName: string;
  assigneeRole: string;
  startDate: string;
  dueDate: string;
  completedDate?: string;
  estimatedHours: number;
  progress: number; // 0 to 100
  dependencies: TaskDependency[];
  comments: TaskComment[];
  attachments: TaskAttachment[];
  createdAt: string;
  assignedDate?: string;
  startedDate?: string;
}

// 50 High-Fidelity realistic solar project tasks distributed across regional installations
export const mockTasks: TaskDetail[] = [
  // PROJECT 1: Pune Residential Rooftop (p-1)
  {
    id: 't-101',
    projectId: 'p-1',
    projectName: 'Pune Residential Rooftop',
    projectStage: 'ELECTRICAL_WIRING',
    title: 'Site survey structural clearance',
    description: 'Perform visual roof structural check to confirm anchor load bearing capacities.',
    status: 'DONE',
    priority: 'HIGH',
    category: 'SURVEY',
    assigneeName: 'Rajesh Patil',
    assigneeRole: 'SITE_SUPERVISOR',
    startDate: '2026-05-01',
    dueDate: '2026-05-05',
    completedDate: '2026-05-04',
    estimatedHours: 8,
    progress: 100,
    dependencies: [],
    comments: [
      { id: 'c-101a', authorName: 'Rajesh Patil', authorRole: 'Site Supervisor', body: 'Roof load test passed. Structures can anchor directly.', createdAt: '2026-05-04T10:00:00Z' }
    ],
    attachments: [
      { id: 'att-101a', name: 'pune_roof_load_report.pdf', sizeKb: 1420, uploadedAt: '2026-05-04' }
    ],
    createdAt: '2026-04-30',
    assignedDate: '2026-05-01',
    startedDate: '2026-05-02'
  },
  {
    id: 't-102',
    projectId: 'p-1',
    projectName: 'Pune Residential Rooftop',
    projectStage: 'ELECTRICAL_WIRING',
    title: 'Single-line drawing layout drafting',
    description: 'Draft the single line drawing (SLD) and safety protection configurations.',
    status: 'DONE',
    priority: 'MEDIUM',
    category: 'DESIGN',
    assigneeName: 'Priyanka Joshi',
    assigneeRole: 'DESIGN_ENGINEER',
    startDate: '2026-05-06',
    dueDate: '2026-05-12',
    completedDate: '2026-05-11',
    estimatedHours: 16,
    progress: 100,
    dependencies: [
      { id: 't-101', title: 'Site survey structural clearance', status: 'DONE', relationType: 'BLOCKING' }
    ],
    comments: [],
    attachments: [
      { id: 'att-102a', name: 'pune_roof_sld_draft.dwg', sizeKb: 4500, uploadedAt: '2026-05-10' }
    ],
    createdAt: '2026-05-01',
    assignedDate: '2026-05-06',
    startedDate: '2026-05-07'
  },
  {
    id: 't-103',
    projectId: 'p-1',
    projectName: 'Pune Residential Rooftop',
    projectStage: 'ELECTRICAL_WIRING',
    title: 'Procure hybrid string inverter',
    description: 'Acquire high efficiency 10kW single phase string inverter with dual MPPT trackers.',
    status: 'DONE',
    priority: 'HIGH',
    category: 'PROCUREMENT',
    assigneeName: 'Sanjay Mehta',
    assigneeRole: 'PROCUREMENT_OFFICER',
    startDate: '2026-05-13',
    dueDate: '2026-05-20',
    completedDate: '2026-05-19',
    estimatedHours: 12,
    progress: 100,
    dependencies: [],
    comments: [],
    attachments: [],
    createdAt: '2026-05-02',
    assignedDate: '2026-05-13',
    startedDate: '2026-05-14'
  },
  {
    id: 't-104',
    projectId: 'p-1',
    projectName: 'Pune Residential Rooftop',
    projectStage: 'ELECTRICAL_WIRING',
    title: 'Install anchor rails & brackets',
    description: 'Assemble L-feet anchor brackets and structural aluminum rails onto tin sheets.',
    status: 'DONE',
    priority: 'HIGH',
    category: 'INSTALLATION',
    assigneeName: 'Rajesh Patil',
    assigneeRole: 'SITE_SUPERVISOR',
    startDate: '2026-05-21',
    dueDate: '2026-05-25',
    completedDate: '2026-05-25',
    estimatedHours: 24,
    progress: 100,
    dependencies: [
      { id: 't-102', title: 'Single-line drawing layout drafting', status: 'DONE', relationType: 'BLOCKING' }
    ],
    comments: [],
    attachments: [],
    createdAt: '2026-05-02',
    assignedDate: '2026-05-21',
    startedDate: '2026-05-22'
  },
  {
    id: 't-105',
    projectId: 'p-1',
    projectName: 'Pune Residential Rooftop',
    projectStage: 'ELECTRICAL_WIRING',
    title: 'Mount solar modules on array',
    description: 'Align and clamp 18 units of 540W monocrystalline half-cut solar panels.',
    status: 'DONE',
    priority: 'MEDIUM',
    category: 'INSTALLATION',
    assigneeName: 'Rajesh Patil',
    assigneeRole: 'SITE_SUPERVISOR',
    startDate: '2026-05-26',
    dueDate: '2026-05-29',
    completedDate: '2026-05-29',
    estimatedHours: 20,
    progress: 100,
    dependencies: [
      { id: 't-104', title: 'Install anchor rails & brackets', status: 'DONE', relationType: 'BLOCKING' }
    ],
    comments: [],
    attachments: [],
    createdAt: '2026-05-02',
    assignedDate: '2026-05-26',
    startedDate: '2026-05-26'
  },
  {
    id: 't-106',
    projectId: 'p-1',
    projectName: 'Pune Residential Rooftop',
    projectStage: 'ELECTRICAL_WIRING',
    title: 'String DC cabling conduit routing',
    description: 'Route red/black 4sqmm solar cables from panels array through flexible conduits to inverter terminal boxes.',
    status: 'IN_PROGRESS',
    priority: 'MEDIUM',
    category: 'ELECTRICAL',
    assigneeName: 'Rajesh Patil',
    assigneeRole: 'SITE_SUPERVISOR',
    startDate: '2026-05-27',
    dueDate: '2026-06-02',
    estimatedHours: 16,
    progress: 40,
    dependencies: [
      { id: 't-105', title: 'Mount solar modules on array', status: 'DONE', relationType: 'BLOCKING' }
    ],
    comments: [
      { id: 'c-106a', authorName: 'Rajesh Patil', authorRole: 'Site Supervisor', body: 'Conduit laying done. Cable pulling is in progress.', createdAt: '2026-05-29T08:00:00Z' }
    ],
    attachments: [],
    createdAt: '2026-05-03',
    assignedDate: '2026-05-27',
    startedDate: '2026-05-28'
  },

  // PROJECT 2: Mumbai Corporate Solar Carport (p-2)
  {
    id: 't-201',
    projectId: 'p-2',
    projectName: 'Mumbai Corporate Solar Carport',
    projectStage: 'MATERIAL_DELIVERY',
    title: 'Topographic site survey layout',
    description: 'Map boundary lines and structural heights for shade checking at administrative parking lots.',
    status: 'DONE',
    priority: 'HIGH',
    category: 'SURVEY',
    assigneeName: 'Amol Deshmukh',
    assigneeRole: 'SITE_SUPERVISOR',
    startDate: '2026-04-15',
    dueDate: '2026-04-20',
    completedDate: '2026-04-19',
    estimatedHours: 12,
    progress: 100,
    dependencies: [],
    comments: [],
    attachments: [],
    createdAt: '2026-04-10',
    assignedDate: '2026-04-15',
    startedDate: '2026-04-16'
  },
  {
    id: 't-202',
    projectId: 'p-2',
    projectName: 'Mumbai Corporate Solar Carport',
    projectStage: 'MATERIAL_DELIVERY',
    title: 'Foundation structural calculation report',
    description: 'Execute finite element analysis (FEA) checking wind loads on structural steel brackets.',
    status: 'DONE',
    priority: 'HIGH',
    category: 'DESIGN',
    assigneeName: 'Kunal Sen',
    assigneeRole: 'DESIGN_ENGINEER',
    startDate: '2026-04-21',
    dueDate: '2026-04-28',
    completedDate: '2026-04-27',
    estimatedHours: 24,
    progress: 100,
    dependencies: [
      { id: 't-201', title: 'Topographic site survey layout', status: 'DONE', relationType: 'BLOCKING' }
    ],
    comments: [],
    attachments: [
      { id: 'att-202a', name: 'mumbai_carport_wind_analysis.pdf', sizeKb: 3420, uploadedAt: '2026-04-27' }
    ],
    createdAt: '2026-04-11',
    assignedDate: '2026-04-21',
    startedDate: '2026-04-22'
  },
  {
    id: 't-203',
    projectId: 'p-2',
    projectName: 'Mumbai Corporate Solar Carport',
    projectStage: 'MATERIAL_DELIVERY',
    title: 'Procure galvanized steel rafters',
    description: 'Procure structural hot-dip galvanized custom rafter framework supporting the panel spans.',
    status: 'DONE',
    priority: 'URGENT',
    category: 'PROCUREMENT',
    assigneeName: 'Nikhil Rane',
    assigneeRole: 'PROCUREMENT_OFFICER',
    startDate: '2026-04-29',
    dueDate: '2026-05-15',
    completedDate: '2026-05-15',
    estimatedHours: 40,
    progress: 100,
    dependencies: [
      { id: 't-202', title: 'Foundation structural calculation report', status: 'DONE', relationType: 'BLOCKING' }
    ],
    comments: [],
    attachments: [],
    createdAt: '2026-04-12',
    assignedDate: '2026-04-29',
    startedDate: '2026-04-30'
  },
  {
    id: 't-204',
    projectId: 'p-2',
    projectName: 'Mumbai Corporate Solar Carport',
    projectStage: 'MATERIAL_DELIVERY',
    title: 'Logistics rafter framework transit',
    description: 'Supervise transit logistics from fabrication unit in Nashik to site yard in Mumbai.',
    status: 'BLOCKED',
    priority: 'HIGH',
    category: 'PROCUREMENT',
    assigneeName: 'Nikhil Rane',
    assigneeRole: 'PROCUREMENT_OFFICER',
    startDate: '2026-05-16',
    dueDate: '2026-05-24',
    estimatedHours: 16,
    progress: 10,
    dependencies: [
      { id: 't-203', title: 'Procure galvanized steel rafters', status: 'DONE', relationType: 'BLOCKING' }
    ],
    comments: [
      { id: 'c-204a', authorName: 'Nikhil Rane', authorRole: 'Procurement Coordinator', body: 'Blocked due to local transport strike on national highway.', createdAt: '2026-05-20T12:00:00Z' }
    ],
    attachments: [],
    createdAt: '2026-04-15',
    assignedDate: '2026-05-16',
    startedDate: '2026-05-17'
  },

  // PROJECT 3: Nashik Vineyard Off-Grid Array (p-3)
  {
    id: 't-301',
    projectId: 'p-3',
    projectName: 'Nashik Vineyard Off-Grid Array',
    projectStage: 'PROJECT_CREATED',
    title: 'Vineyard ground layout analysis',
    description: 'Identify sun shadows from perimeter trees on the western bounds of vineyard grounds.',
    status: 'DONE',
    priority: 'MEDIUM',
    category: 'SURVEY',
    assigneeName: 'Vikram Salvi',
    assigneeRole: 'SITE_SUPERVISOR',
    startDate: '2026-05-20',
    dueDate: '2026-05-25',
    completedDate: '2026-05-24',
    estimatedHours: 10,
    progress: 100,
    dependencies: [],
    comments: [],
    attachments: [],
    createdAt: '2026-05-18',
    assignedDate: '2026-05-20',
    startedDate: '2026-05-21'
  },
  {
    id: 't-302',
    projectId: 'p-3',
    projectName: 'Nashik Vineyard Off-Grid Array',
    projectStage: 'PROJECT_CREATED',
    title: 'Vineyard project charter sign-off',
    description: 'Finalize core charter details, target metrics, and stage scopes with owners.',
    status: 'IN_REVIEW',
    priority: 'HIGH',
    category: 'APPROVAL',
    assigneeName: 'Anjali Sharma',
    assigneeRole: 'PROJECT_MANAGER',
    startDate: '2026-05-26',
    dueDate: '2026-05-30',
    estimatedHours: 6,
    progress: 90,
    dependencies: [
      { id: 't-301', title: 'Vineyard ground layout analysis', status: 'DONE', relationType: 'BLOCKING' }
    ],
    comments: [
      { id: 'c-302a', authorName: 'Anjali Sharma', authorRole: 'Project Manager', body: 'Awaiting client signature on contract docket.', createdAt: '2026-05-28T14:30:00Z' }
    ],
    attachments: [
      { id: 'att-302a', name: 'charter_draft_nashik.pdf', sizeKb: 890, uploadedAt: '2026-05-27' }
    ],
    createdAt: '2026-05-18',
    assignedDate: '2026-05-26',
    startedDate: '2026-05-26'
  },

  // PROJECT 4: Satara Hospital Hybrid Grid (p-4)
  {
    id: 't-401',
    projectId: 'p-4',
    projectName: 'Satara Hospital Hybrid Grid',
    projectStage: 'COMPLETED',
    title: 'Structural roof reinforcement checks',
    description: 'Ensure safety structural reinforcement on ICU wing roof spans.',
    status: 'DONE',
    priority: 'HIGH',
    category: 'SURVEY',
    assigneeName: 'Sunil Shinde',
    assigneeRole: 'SITE_SUPERVISOR',
    startDate: '2026-01-10',
    dueDate: '2026-01-15',
    completedDate: '2026-01-14',
    estimatedHours: 12,
    progress: 100,
    dependencies: [],
    comments: [],
    attachments: [],
    createdAt: '2026-01-05',
    assignedDate: '2026-01-10',
    startedDate: '2026-01-11'
  },
  {
    id: 't-402',
    projectId: 'p-4',
    projectName: 'Satara Hospital Hybrid Grid',
    projectStage: 'COMPLETED',
    title: 'Hospital hybrid CAD design SLD',
    description: 'Create SLDs integrating heavy emergency generator backups with solar synchronization.',
    status: 'DONE',
    priority: 'URGENT',
    category: 'DESIGN',
    assigneeName: 'Kunal Sen',
    assigneeRole: 'DESIGN_ENGINEER',
    startDate: '2026-01-16',
    dueDate: '2026-01-25',
    completedDate: '2026-01-24',
    estimatedHours: 32,
    progress: 100,
    dependencies: [
      { id: 't-401', title: 'Structural roof reinforcement checks', status: 'DONE', relationType: 'BLOCKING' }
    ],
    comments: [],
    attachments: [],
    createdAt: '2026-01-05',
    assignedDate: '2026-01-16',
    startedDate: '2026-01-17'
  },
  {
    id: 't-403',
    projectId: 'p-4',
    projectName: 'Satara Hospital Hybrid Grid',
    projectStage: 'COMPLETED',
    title: 'Procure lithium battery banks',
    description: 'Source 50kWh battery backup pack from verified OEM vendors.',
    status: 'DONE',
    priority: 'HIGH',
    category: 'PROCUREMENT',
    assigneeName: 'Nikhil Rane',
    assigneeRole: 'PROCUREMENT_OFFICER',
    startDate: '2026-01-26',
    dueDate: '2026-02-10',
    completedDate: '2026-02-09',
    estimatedHours: 20,
    progress: 100,
    dependencies: [],
    comments: [],
    attachments: [],
    createdAt: '2026-01-06',
    assignedDate: '2026-01-26',
    startedDate: '2026-01-27'
  },
  {
    id: 't-404',
    projectId: 'p-4',
    projectName: 'Satara Hospital Hybrid Grid',
    projectStage: 'COMPLETED',
    title: 'Mount brackets and racking grids',
    description: 'Secure chemical anchors and bracket rails on concrete columns.',
    status: 'DONE',
    priority: 'HIGH',
    category: 'INSTALLATION',
    assigneeName: 'Sunil Shinde',
    assigneeRole: 'SITE_SUPERVISOR',
    startDate: '2026-02-15',
    dueDate: '2026-02-22',
    completedDate: '2026-02-21',
    estimatedHours: 24,
    progress: 100,
    dependencies: [
      { id: 't-402', title: 'Hospital hybrid CAD design SLD', status: 'DONE', relationType: 'BLOCKING' }
    ],
    comments: [],
    attachments: [],
    createdAt: '2026-01-07',
    assignedDate: '2026-02-15',
    startedDate: '2026-02-16'
  },
  {
    id: 't-405',
    projectId: 'p-4',
    projectName: 'Satara Hospital Hybrid Grid',
    projectStage: 'COMPLETED',
    title: 'Cable runs DC routing layout',
    description: 'Pull high-voltage cables through safety fireproof conduits.',
    status: 'DONE',
    priority: 'MEDIUM',
    category: 'ELECTRICAL',
    assigneeName: 'Sunil Shinde',
    assigneeRole: 'SITE_SUPERVISOR',
    startDate: '2026-02-23',
    dueDate: '2026-02-28',
    completedDate: '2026-02-28',
    estimatedHours: 16,
    progress: 100,
    dependencies: [
      { id: 't-404', title: 'Mount brackets and racking grids', status: 'DONE', relationType: 'BLOCKING' }
    ],
    comments: [],
    attachments: [],
    createdAt: '2026-01-07',
    assignedDate: '2026-02-23',
    startedDate: '2026-02-24'
  },
  {
    id: 't-406',
    projectId: 'p-4',
    projectName: 'Satara Hospital Hybrid Grid',
    projectStage: 'COMPLETED',
    title: 'Hospital hybrid sync grid testing',
    description: 'Simulate utility blackout to test automatic generator and battery bank synchronization.',
    status: 'DONE',
    priority: 'HIGH',
    category: 'TESTING',
    assigneeName: 'Sunil Shinde',
    assigneeRole: 'SITE_SUPERVISOR',
    startDate: '2026-03-01',
    dueDate: '2026-03-05',
    completedDate: '2026-03-04',
    estimatedHours: 12,
    progress: 100,
    dependencies: [
      { id: 't-405', title: 'Cable runs DC routing layout', status: 'DONE', relationType: 'BLOCKING' }
    ],
    comments: [],
    attachments: [
      { id: 'att-406a', name: 'blackout_sync_report.pdf', sizeKb: 1820, uploadedAt: '2026-03-04' }
    ],
    createdAt: '2026-01-08',
    assignedDate: '2026-03-01',
    startedDate: '2026-03-01'
  },
  {
    id: 't-407',
    projectId: 'p-4',
    projectName: 'Satara Hospital Hybrid Grid',
    projectStage: 'COMPLETED',
    title: 'CEIG Inspector permit clearance',
    description: 'Apply for safety operating clearance from regional CEIG board inspectors.',
    status: 'DONE',
    priority: 'HIGH',
    category: 'APPROVAL',
    assigneeName: 'Aniket Mane',
    assigneeRole: 'PROJECT_MANAGER',
    startDate: '2026-03-06',
    dueDate: '2026-03-20',
    completedDate: '2026-03-19',
    estimatedHours: 8,
    progress: 100,
    dependencies: [
      { id: 't-406', title: 'Hospital hybrid sync grid testing', status: 'DONE', relationType: 'BLOCKING' }
    ],
    comments: [],
    attachments: [],
    createdAt: '2026-01-08',
    assignedDate: '2026-03-06',
    startedDate: '2026-03-07'
  },
  {
    id: 't-408',
    projectId: 'p-4',
    projectName: 'Satara Hospital Hybrid Grid',
    projectStage: 'COMPLETED',
    title: 'Client O&M training & handover',
    description: 'Walk through operations, safety shutdowns, and hand over the generation manuals.',
    status: 'DONE',
    priority: 'LOW',
    category: 'DOCUMENTATION',
    assigneeName: 'Aniket Mane',
    assigneeRole: 'PROJECT_MANAGER',
    startDate: '2026-03-21',
    dueDate: '2026-03-25',
    completedDate: '2026-03-25',
    estimatedHours: 8,
    progress: 100,
    dependencies: [
      { id: 't-407', title: 'CEIG Inspector permit clearance', status: 'DONE', relationType: 'BLOCKING' }
    ],
    comments: [],
    attachments: [],
    createdAt: '2026-01-08',
    assignedDate: '2026-03-21',
    startedDate: '2026-03-22'
  },

  // PROJECT 5: Kolhapur Textile MW Array (p-5)
  {
    id: 't-501',
    projectId: 'p-5',
    projectName: 'Kolhapur Textile MW Array',
    projectStage: 'STRUCTURE_INSTALLATION',
    title: 'Textile plant structural weight check',
    description: 'Ensure safety structural weight capability of truss framework over spinning shops.',
    status: 'DONE',
    priority: 'HIGH',
    category: 'SURVEY',
    assigneeName: 'Sanjay Sawant',
    assigneeRole: 'SITE_SUPERVISOR',
    startDate: '2026-04-10',
    dueDate: '2026-04-15',
    completedDate: '2026-04-14',
    estimatedHours: 16,
    progress: 100,
    dependencies: [],
    comments: [],
    attachments: [],
    createdAt: '2026-04-05',
    assignedDate: '2026-04-10',
    startedDate: '2026-04-11'
  },
  {
    id: 't-502',
    projectId: 'p-5',
    projectName: 'Kolhapur Textile MW Array',
    projectStage: 'STRUCTURE_INSTALLATION',
    title: 'Draft MW array mounting structures CAD',
    description: 'Draft the multi-row elevated structures supporting 1.2MW ground framework.',
    status: 'DONE',
    priority: 'URGENT',
    category: 'DESIGN',
    assigneeName: 'Priyanka Joshi',
    assigneeRole: 'DESIGN_ENGINEER',
    startDate: '2026-04-16',
    dueDate: '2026-04-26',
    completedDate: '2026-04-25',
    estimatedHours: 40,
    progress: 100,
    dependencies: [
      { id: 't-501', title: 'Textile plant structural weight check', status: 'DONE', relationType: 'BLOCKING' }
    ],
    comments: [],
    attachments: [],
    createdAt: '2026-04-05',
    assignedDate: '2026-04-16',
    startedDate: '2026-04-17'
  },
  {
    id: 't-503',
    projectId: 'p-5',
    projectName: 'Kolhapur Textile MW Array',
    projectStage: 'STRUCTURE_INSTALLATION',
    title: 'Procure 1200kW bifacial panels',
    description: 'Confirm material orders for heavy efficiency double glass bifacial panel tiers.',
    status: 'DONE',
    priority: 'HIGH',
    category: 'PROCUREMENT',
    assigneeName: 'Sanjay Mehta',
    assigneeRole: 'PROCUREMENT_OFFICER',
    startDate: '2026-04-27',
    dueDate: '2026-05-18',
    completedDate: '2026-05-18',
    estimatedHours: 60,
    progress: 100,
    dependencies: [],
    comments: [],
    attachments: [],
    createdAt: '2026-04-06',
    assignedDate: '2026-04-27',
    startedDate: '2026-04-28'
  },
  {
    id: 't-504',
    projectId: 'p-5',
    projectName: 'Kolhapur Textile MW Array',
    projectStage: 'STRUCTURE_INSTALLATION',
    title: 'Bifacial arrays delivery schedule',
    description: 'Coordinate cargo container shipments from Mundra port to Kolhapur industrial plant site yard.',
    status: 'DONE',
    priority: 'HIGH',
    category: 'PROCUREMENT',
    assigneeName: 'Sanjay Mehta',
    assigneeRole: 'PROCUREMENT_OFFICER',
    startDate: '2026-05-19',
    dueDate: '2026-05-25',
    completedDate: '2026-05-25',
    estimatedHours: 20,
    progress: 100,
    dependencies: [
      { id: 't-503', title: 'Procure 1200kW bifacial panels', status: 'DONE', relationType: 'BLOCKING' }
    ],
    comments: [],
    attachments: [],
    createdAt: '2026-04-07',
    assignedDate: '2026-05-19',
    startedDate: '2026-05-20'
  },
  {
    id: 't-505',
    projectId: 'p-5',
    projectName: 'Kolhapur Textile MW Array',
    projectStage: 'STRUCTURE_INSTALLATION',
    title: 'Install concrete ground pedestals',
    description: 'Excavate ground structures and cast concrete anchor blocks mapping the array tilt layout.',
    status: 'IN_PROGRESS',
    priority: 'HIGH',
    category: 'INSTALLATION',
    assigneeName: 'Sanjay Sawant',
    assigneeRole: 'SITE_SUPERVISOR',
    startDate: '2026-05-26',
    dueDate: '2026-06-05',
    estimatedHours: 80,
    progress: 50,
    dependencies: [
      { id: 't-502', title: 'Draft MW array mounting structures CAD', status: 'DONE', relationType: 'BLOCKING' },
      { id: 't-504', title: 'Bifacial arrays delivery schedule', status: 'DONE', relationType: 'BLOCKING' }
    ],
    comments: [
      { id: 'c-505a', authorName: 'Sanjay Sawant', authorRole: 'Site Supervisor', body: 'Pedestal casting is 50% done. Trusses mounting to start tomorrow.', createdAt: '2026-05-29T10:15:00Z' }
    ],
    attachments: [],
    createdAt: '2026-04-08',
    assignedDate: '2026-05-26',
    startedDate: '2026-05-27'
  },

  // PROJECT 6: Aurangabad Industrial Rooftop (p-6)
  {
    id: 't-601',
    projectId: 'p-6',
    projectName: 'Aurangabad Industrial Rooftop',
    projectStage: 'SITE_SURVEY',
    title: 'Industrial plant roof mapping survey',
    description: 'Analyze metallic sheets configurations and shade patterns on foundry shop roofs.',
    status: 'IN_PROGRESS',
    priority: 'HIGH',
    category: 'SURVEY',
    assigneeName: 'Ramesh Gore',
    assigneeRole: 'SITE_SUPERVISOR',
    startDate: '2026-05-25',
    dueDate: '2026-05-31',
    estimatedHours: 12,
    progress: 80,
    dependencies: [],
    comments: [
      { id: 'c-601a', authorName: 'Ramesh Gore', authorRole: 'Site Supervisor', body: 'Completed physical roof checks. Doing drone survey today.', createdAt: '2026-05-29T11:00:00Z' }
    ],
    attachments: [],
    createdAt: '2026-05-20',
    assignedDate: '2026-05-25',
    startedDate: '2026-05-26'
  },
  {
    id: 't-602',
    projectId: 'p-6',
    projectName: 'Aurangabad Industrial Rooftop',
    projectStage: 'SITE_SURVEY',
    title: 'Draft protection relay layout CAD',
    description: 'Design grid safety switchgear controls and safety protection relay schemes.',
    status: 'NOT_STARTED',
    priority: 'MEDIUM',
    category: 'DESIGN',
    assigneeName: 'Priyanka Joshi',
    assigneeRole: 'DESIGN_ENGINEER',
    startDate: '2026-06-01',
    dueDate: '2026-06-08',
    estimatedHours: 20,
    progress: 0,
    dependencies: [
      { id: 't-601', title: 'Industrial plant roof mapping survey', status: 'IN_PROGRESS', relationType: 'BLOCKING' }
    ],
    comments: [],
    attachments: [],
    createdAt: '2026-05-20',
    assignedDate: '2026-06-01'
  },

  // PROJECT 7: Pune Commercial Center Array (p-7)
  {
    id: 't-701',
    projectId: 'p-7',
    projectName: 'Pune Commercial Center Array',
    projectStage: 'MATERIAL_PROCUREMENT',
    title: 'Commercial array structural CAD approval',
    description: 'Acquire peer-review signature on structural canopy design drafts.',
    status: 'DONE',
    priority: 'HIGH',
    category: 'DESIGN',
    assigneeName: 'Priyanka Joshi',
    assigneeRole: 'DESIGN_ENGINEER',
    startDate: '2026-05-10',
    dueDate: '2026-05-18',
    completedDate: '2026-05-17',
    estimatedHours: 16,
    progress: 100,
    dependencies: [],
    comments: [],
    attachments: [],
    createdAt: '2026-05-05',
    assignedDate: '2026-05-10',
    startedDate: '2026-05-11'
  },
  {
    id: 't-702',
    projectId: 'p-7',
    projectName: 'Pune Commercial Center Array',
    projectStage: 'MATERIAL_PROCUREMENT',
    title: 'Procure 200kW central inverters',
    description: 'Issue procurement invoice for dual string central commercial inverters.',
    status: 'IN_PROGRESS',
    priority: 'HIGH',
    category: 'PROCUREMENT',
    assigneeName: 'Sanjay Mehta',
    assigneeRole: 'PROCUREMENT_OFFICER',
    startDate: '2026-05-19',
    dueDate: '2026-05-28',
    estimatedHours: 32,
    progress: 75,
    dependencies: [
      { id: 't-701', title: 'Commercial array structural CAD approval', status: 'DONE', relationType: 'BLOCKING' }
    ],
    comments: [
      { id: 'c-702a', authorName: 'Sanjay Mehta', authorRole: 'Procurement Officer', body: 'PO released. Material dispatched from warehouse.', createdAt: '2026-05-27T09:00:00Z' }
    ],
    attachments: [],
    createdAt: '2026-05-05',
    assignedDate: '2026-05-19',
    startedDate: '2026-05-20'
  },
  {
    id: 't-703',
    projectId: 'p-7',
    projectName: 'Pune Commercial Center Array',
    projectStage: 'MATERIAL_PROCUREMENT',
    title: 'Track transit central inverters log',
    description: 'Monitor cargo shipping schedules and handle port clearances.',
    status: 'NOT_STARTED',
    priority: 'MEDIUM',
    category: 'PROCUREMENT',
    assigneeName: 'Sanjay Mehta',
    assigneeRole: 'PROCUREMENT_OFFICER',
    startDate: '2026-05-29',
    dueDate: '2026-06-05',
    estimatedHours: 8,
    progress: 0,
    dependencies: [
      { id: 't-702', title: 'Procure 200kW central inverters', status: 'IN_PROGRESS', relationType: 'BLOCKING' }
    ],
    comments: [],
    attachments: [],
    createdAt: '2026-05-06',
    assignedDate: '2026-05-29'
  },

  // PROJECT 8: Mumbai High-Rise Microgrid (p-8)
  {
    id: 't-801',
    projectId: 'p-8',
    projectName: 'Mumbai High-Rise Microgrid',
    projectStage: 'PANEL_MOUNTING',
    title: 'High-rise balcony space surveys',
    description: 'Map solar path access and mechanical mounting structures on exterior facades.',
    status: 'DONE',
    priority: 'HIGH',
    category: 'SURVEY',
    assigneeName: 'Amol Deshmukh',
    assigneeRole: 'SITE_SUPERVISOR',
    startDate: '2026-05-01',
    dueDate: '2026-05-08',
    completedDate: '2026-05-07',
    estimatedHours: 12,
    progress: 100,
    dependencies: [],
    comments: [],
    attachments: [],
    createdAt: '2026-04-28',
    assignedDate: '2026-05-01',
    startedDate: '2026-05-02'
  },
  {
    id: 't-802',
    projectId: 'p-8',
    projectName: 'Mumbai High-Rise Microgrid',
    projectStage: 'PANEL_MOUNTING',
    title: 'Vertical panel clamping brackets design',
    description: 'Draft structural clamp rails secure enough to sustain 150 km/h wind gusts on high floors.',
    status: 'DONE',
    priority: 'URGENT',
    category: 'DESIGN',
    assigneeName: 'Kunal Sen',
    assigneeRole: 'DESIGN_ENGINEER',
    startDate: '2026-05-09',
    dueDate: '2026-05-15',
    completedDate: '2026-05-15',
    estimatedHours: 24,
    progress: 100,
    dependencies: [
      { id: 't-801', title: 'High-rise balcony space surveys', status: 'DONE', relationType: 'BLOCKING' }
    ],
    comments: [],
    attachments: [],
    createdAt: '2026-04-28',
    assignedDate: '2026-05-09',
    startedDate: '2026-05-10'
  },
  {
    id: 't-803',
    projectId: 'p-8',
    projectName: 'Mumbai High-Rise Microgrid',
    projectStage: 'PANEL_MOUNTING',
    title: 'Mount vertical solar panels array',
    description: 'Bolt half-cut solar panels onto exterior elevator shaft facades.',
    status: 'IN_PROGRESS',
    priority: 'HIGH',
    category: 'INSTALLATION',
    assigneeName: 'Amol Deshmukh',
    assigneeRole: 'SITE_SUPERVISOR',
    startDate: '2026-05-16',
    dueDate: '2026-05-25',
    estimatedHours: 32,
    progress: 80,
    dependencies: [
      { id: 't-802', title: 'Vertical panel clamping brackets design', status: 'DONE', relationType: 'BLOCKING' }
    ],
    comments: [
      { id: 'c-803a', authorName: 'Amol Deshmukh', authorRole: 'Site Supervisor', body: 'Mounting facade structures is complete. Final panel locks are delayed.', createdAt: '2026-05-25T11:00:00Z' }
    ],
    attachments: [],
    createdAt: '2026-04-29',
    assignedDate: '2026-05-16',
    startedDate: '2026-05-17'
  },

  // PROJECT 9: Satara Sugar Plant Carport (p-13)
  {
    id: 't-901',
    projectId: 'p-13',
    projectName: 'Satara Sugar Plant Carport',
    projectStage: 'PROJECT_CREATED',
    title: 'Sugar plant site survey layout',
    description: 'Verify canopy dimensions and shadow clearances from administrative office stacks.',
    status: 'DONE',
    priority: 'HIGH',
    category: 'SURVEY',
    assigneeName: 'Amit Sharma',
    assigneeRole: 'PROJECT_MANAGER',
    startDate: '2026-05-10',
    dueDate: '2026-05-18',
    completedDate: '2026-05-17',
    estimatedHours: 12,
    progress: 100,
    dependencies: [],
    comments: [],
    attachments: [],
    createdAt: '2026-05-08',
    assignedDate: '2026-05-10',
    startedDate: '2026-05-11'
  },
  {
    id: 't-902',
    projectId: 'p-13',
    projectName: 'Satara Sugar Plant Carport',
    projectStage: 'PROJECT_CREATED',
    title: 'Sugar plant charter sign-off',
    description: 'Compile project charter parameters and clear client signatures for municipal power gates.',
    status: 'IN_PROGRESS',
    priority: 'HIGH',
    category: 'APPROVAL',
    assigneeName: 'Amit Sharma',
    assigneeRole: 'PROJECT_MANAGER',
    startDate: '2026-05-19',
    dueDate: '2026-05-28',
    estimatedHours: 8,
    progress: 80,
    dependencies: [
      { id: 't-901', title: 'Sugar plant site survey layout', status: 'DONE', relationType: 'BLOCKING' }
    ],
    comments: [
      { id: 'c-902a', authorName: 'Amit Sharma', authorRole: 'Project Manager', body: 'Charter details are locked. Awaiting final corporate signature.', createdAt: '2026-05-28T16:00:00Z' }
    ],
    attachments: [],
    createdAt: '2026-05-09',
    assignedDate: '2026-05-19',
    startedDate: '2026-05-20'
  },

  // ─── ADDING MORE REALISTIC OVERDUE & FUTURE TASKS TO REACH exactly 50 TASKS ───
  // We distribute t-1001 to t-1025 over projects p-1 to p-12
  {
    id: 't-1001',
    projectId: 'p-1',
    projectName: 'Pune Residential Rooftop',
    projectStage: 'ELECTRICAL_WIRING',
    title: 'Inverter wall mount installation',
    description: 'Bolt single phase 10kW wall inverter onto cement walls adjacent to utility boards.',
    status: 'NOT_STARTED',
    priority: 'MEDIUM',
    category: 'INSTALLATION',
    assigneeName: 'Rajesh Patil',
    assigneeRole: 'SITE_SUPERVISOR',
    startDate: '2026-06-03',
    dueDate: '2026-06-07',
    estimatedHours: 8,
    progress: 0,
    dependencies: [
      { id: 't-106', title: 'String DC cabling conduit routing', status: 'IN_PROGRESS', relationType: 'BLOCKING' }
    ],
    comments: [],
    attachments: [],
    createdAt: '2026-05-29'
  },
  {
    id: 't-1002',
    projectId: 'p-1',
    projectName: 'Pune Residential Rooftop',
    projectStage: 'ELECTRICAL_WIRING',
    title: 'AC distribution box integration',
    description: 'Hook up AC breakers and surge protection modules into mains board panels.',
    status: 'NOT_STARTED',
    priority: 'HIGH',
    category: 'ELECTRICAL',
    assigneeName: 'Rajesh Patil',
    assigneeRole: 'SITE_SUPERVISOR',
    startDate: '2026-06-08',
    dueDate: '2026-06-12',
    estimatedHours: 12,
    progress: 0,
    dependencies: [
      { id: 't-1001', title: 'Inverter wall mount installation', status: 'NOT_STARTED', relationType: 'BLOCKING' }
    ],
    comments: [],
    attachments: [],
    createdAt: '2026-05-29'
  },
  {
    id: 't-1003',
    projectId: 'p-1',
    projectName: 'Pune Residential Rooftop',
    projectStage: 'ELECTRICAL_WIRING',
    title: 'Insulation & grounding tests log',
    description: 'Run grounding mega-ohm tests on panel rails and inverter frame mounts.',
    status: 'NOT_STARTED',
    priority: 'MEDIUM',
    category: 'TESTING',
    assigneeName: 'Rajesh Patil',
    assigneeRole: 'SITE_SUPERVISOR',
    startDate: '2026-06-13',
    dueDate: '2026-06-15',
    estimatedHours: 6,
    progress: 0,
    dependencies: [
      { id: 't-1002', title: 'AC distribution box integration', status: 'NOT_STARTED', relationType: 'BLOCKING' }
    ],
    comments: [],
    attachments: [],
    createdAt: '2026-05-29'
  },
  {
    id: 't-1004',
    projectId: 'p-2',
    projectName: 'Mumbai Corporate Solar Carport',
    projectStage: 'MATERIAL_DELIVERY',
    title: 'Concrete anchor columns casting',
    description: 'Cast concrete foundations to anchor massive steel rafter beams.',
    status: 'NOT_STARTED',
    priority: 'HIGH',
    category: 'INSTALLATION',
    assigneeName: 'Amol Deshmukh',
    assigneeRole: 'SITE_SUPERVISOR',
    startDate: '2026-06-01',
    dueDate: '2026-06-10',
    estimatedHours: 40,
    progress: 0,
    dependencies: [
      { id: 't-204', title: 'Logistics rafter framework transit', status: 'BLOCKED', relationType: 'BLOCKING' }
    ],
    comments: [],
    attachments: [],
    createdAt: '2026-05-29'
  },
  {
    id: 't-1005',
    projectId: 'p-2',
    projectName: 'Mumbai Corporate Solar Carport',
    projectStage: 'MATERIAL_DELIVERY',
    title: 'Structural rafters assembly structural checklist',
    description: 'Assemble structure framework sections on parking lot fields.',
    status: 'NOT_STARTED',
    priority: 'MEDIUM',
    category: 'INSTALLATION',
    assigneeName: 'Amol Deshmukh',
    assigneeRole: 'SITE_SUPERVISOR',
    startDate: '2026-06-11',
    dueDate: '2026-06-20',
    estimatedHours: 48,
    progress: 0,
    dependencies: [
      { id: 't-1004', title: 'Concrete anchor columns casting', status: 'NOT_STARTED', relationType: 'BLOCKING' }
    ],
    comments: [],
    attachments: [],
    createdAt: '2026-05-29'
  },
  {
    id: 't-1006',
    projectId: 'p-2',
    projectName: 'Mumbai Corporate Solar Carport',
    projectStage: 'MATERIAL_DELIVERY',
    title: 'Draft electrical wiring SLD',
    description: 'Create electrical wiring layouts showing AC combiner boxes and plant interfaces.',
    status: 'NOT_STARTED',
    priority: 'LOW',
    category: 'DESIGN',
    assigneeName: 'Kunal Sen',
    assigneeRole: 'DESIGN_ENGINEER',
    startDate: '2026-06-05',
    dueDate: '2026-06-15',
    estimatedHours: 20,
    progress: 0,
    dependencies: [],
    comments: [],
    attachments: [],
    createdAt: '2026-05-29'
  },
  {
    id: 't-1007',
    projectId: 'p-3',
    projectName: 'Nashik Vineyard Off-Grid Array',
    projectStage: 'PROJECT_CREATED',
    title: 'Structural CAD foundation blueprint',
    description: 'Draft steel structure specifications showing arrays angles and heights.',
    status: 'NOT_STARTED',
    priority: 'MEDIUM',
    category: 'DESIGN',
    assigneeName: 'Priyanka Joshi',
    assigneeRole: 'DESIGN_ENGINEER',
    startDate: '2026-06-02',
    dueDate: '2026-06-10',
    estimatedHours: 16,
    progress: 0,
    dependencies: [
      { id: 't-302', title: 'Vineyard project charter sign-off', status: 'IN_REVIEW', relationType: 'BLOCKING' }
    ],
    comments: [],
    attachments: [],
    createdAt: '2026-05-29'
  },
  {
    id: 't-1008',
    projectId: 'p-3',
    projectName: 'Nashik Vineyard Off-Grid Array',
    projectStage: 'PROJECT_CREATED',
    title: 'Procure lithium storage batteries bank',
    description: 'Confirm material orders for 30kWh lithium iron phosphate battery storage packs.',
    status: 'NOT_STARTED',
    priority: 'HIGH',
    category: 'PROCUREMENT',
    assigneeName: 'Sanjay Mehta',
    assigneeRole: 'PROCUREMENT_OFFICER',
    startDate: '2026-06-12',
    dueDate: '2026-06-25',
    estimatedHours: 24,
    progress: 0,
    dependencies: [
      { id: 't-1007', title: 'Structural CAD foundation blueprint', status: 'NOT_STARTED', relationType: 'BLOCKING' }
    ],
    comments: [],
    attachments: [],
    createdAt: '2026-05-29'
  },
  {
    id: 't-1009',
    projectId: 'p-5',
    projectName: 'Kolhapur Textile MW Array',
    projectStage: 'STRUCTURE_INSTALLATION',
    title: 'Assemble structural columns and steel trusses',
    description: 'Mount elevated rafter frameworks onto cast concrete pedestals.',
    status: 'NOT_STARTED',
    priority: 'HIGH',
    category: 'INSTALLATION',
    assigneeName: 'Sanjay Sawant',
    assigneeRole: 'SITE_SUPERVISOR',
    startDate: '2026-06-06',
    dueDate: '2026-06-16',
    estimatedHours: 64,
    progress: 0,
    dependencies: [
      { id: 't-505', title: 'Install concrete ground pedestals', status: 'IN_PROGRESS', relationType: 'BLOCKING' }
    ],
    comments: [],
    attachments: [],
    createdAt: '2026-05-29'
  },
  {
    id: 't-1010',
    projectId: 'p-5',
    projectName: 'Kolhapur Textile MW Array',
    projectStage: 'STRUCTURE_INSTALLATION',
    title: 'Wire runs and tray installation',
    description: 'Install hot-dip galvanized tray routes matching solar rows.',
    status: 'NOT_STARTED',
    priority: 'MEDIUM',
    category: 'ELECTRICAL',
    assigneeName: 'Sanjay Sawant',
    assigneeRole: 'SITE_SUPERVISOR',
    startDate: '2026-06-18',
    dueDate: '2026-06-26',
    estimatedHours: 40,
    progress: 0,
    dependencies: [
      { id: 't-1009', title: 'Assemble structural columns and steel trusses', status: 'NOT_STARTED', relationType: 'BLOCKING' }
    ],
    comments: [],
    attachments: [],
    createdAt: '2026-05-29'
  },
  {
    id: 't-1011',
    projectId: 'p-6',
    projectName: 'Aurangabad Industrial Rooftop',
    projectStage: 'SITE_SURVEY',
    title: 'Roof structural stress test audit',
    description: 'Validate localized bending moments on industrial roof purlins.',
    status: 'NOT_STARTED',
    priority: 'MEDIUM',
    category: 'SURVEY',
    assigneeName: 'Ramesh Gore',
    assigneeRole: 'SITE_SUPERVISOR',
    startDate: '2026-06-02',
    dueDate: '2026-06-06',
    estimatedHours: 8,
    progress: 0,
    dependencies: [
      { id: 't-601', title: 'Industrial plant roof mapping survey', status: 'IN_PROGRESS', relationType: 'BLOCKING' }
    ],
    comments: [],
    attachments: [],
    createdAt: '2026-05-29'
  },
  {
    id: 't-1012',
    projectId: 'p-7',
    projectName: 'Pune Commercial Center Array',
    projectStage: 'MATERIAL_PROCUREMENT',
    title: 'Prepare warehouse inventory storage slots',
    description: 'Ensure slots inside Pune inventory storage rooms support large central inverters.',
    status: 'NOT_STARTED',
    priority: 'LOW',
    category: 'PROCUREMENT',
    assigneeName: 'Sanjay Mehta',
    assigneeRole: 'PROCUREMENT_OFFICER',
    startDate: '2026-05-30',
    dueDate: '2026-06-03',
    estimatedHours: 6,
    progress: 0,
    dependencies: [],
    comments: [],
    attachments: [],
    createdAt: '2026-05-29'
  },
  {
    id: 't-1013',
    projectId: 'p-8',
    projectName: 'Mumbai High-Rise Microgrid',
    projectStage: 'PANEL_MOUNTING',
    title: 'Exterior array scaffolding assembly',
    description: 'Assemble exterior scaffolding grids and mechanical lifts on tall facades.',
    status: 'DONE',
    priority: 'HIGH',
    category: 'INSTALLATION',
    assigneeName: 'Amol Deshmukh',
    assigneeRole: 'SITE_SUPERVISOR',
    startDate: '2026-05-10',
    dueDate: '2026-05-15',
    completedDate: '2026-05-14',
    estimatedHours: 16,
    progress: 100,
    dependencies: [],
    comments: [],
    attachments: [],
    createdAt: '2026-05-29',
    assignedDate: '2026-05-10',
    startedDate: '2026-05-11'
  },
  {
    id: 't-1014',
    projectId: 'p-8',
    projectName: 'Mumbai High-Rise Microgrid',
    projectStage: 'PANEL_MOUNTING',
    title: 'Secure cladding cables conduit runs',
    description: 'Anchor metal conduits to outer concrete pillars.',
    status: 'NOT_STARTED',
    priority: 'MEDIUM',
    category: 'ELECTRICAL',
    assigneeName: 'Amol Deshmukh',
    assigneeRole: 'SITE_SUPERVISOR',
    startDate: '2026-06-01',
    dueDate: '2026-06-07',
    estimatedHours: 20,
    progress: 0,
    dependencies: [
      { id: 't-803', title: 'Mount vertical solar panels array', status: 'IN_PROGRESS', relationType: 'BLOCKING' }
    ],
    comments: [],
    attachments: [],
    createdAt: '2026-05-29'
  },
  {
    id: 't-1015',
    projectId: 'p-9',
    projectName: 'Mumbai Suburban Office Solar',
    projectStage: 'MATERIAL_PROCUREMENT',
    title: 'Suburban rooftop shade survey mapping',
    description: 'Identify solar access heights and sun trails across corporate office blocks.',
    status: 'DONE',
    priority: 'HIGH',
    category: 'SURVEY',
    assigneeName: 'Nitin Kadam',
    assigneeRole: 'SITE_SUPERVISOR',
    startDate: '2026-05-12',
    dueDate: '2026-05-16',
    completedDate: '2026-05-15',
    estimatedHours: 12,
    progress: 100,
    dependencies: [],
    comments: [],
    attachments: [],
    createdAt: '2026-05-29',
    assignedDate: '2026-05-12',
    startedDate: '2026-05-12'
  },
  {
    id: 't-1016',
    projectId: 'p-9',
    projectName: 'Mumbai Suburban Office Solar',
    projectStage: 'MATERIAL_PROCUREMENT',
    title: 'Rooftop mounting layouts CAD design',
    description: 'Draft structural layouts optimizing layout gaps to prevent self-shading.',
    status: 'DONE',
    priority: 'MEDIUM',
    category: 'DESIGN',
    assigneeName: 'Kunal Sen',
    assigneeRole: 'DESIGN_ENGINEER',
    startDate: '2026-05-17',
    dueDate: '2026-05-24',
    completedDate: '2026-05-23',
    estimatedHours: 20,
    progress: 100,
    dependencies: [
      { id: 't-1015', title: 'Suburban rooftop shade survey mapping', status: 'DONE', relationType: 'BLOCKING' }
    ],
    comments: [],
    attachments: [],
    createdAt: '2026-05-29',
    assignedDate: '2026-05-17',
    startedDate: '2026-05-18'
  },
  {
    id: 't-1017',
    projectId: 'p-9',
    projectName: 'Mumbai Suburban Office Solar',
    projectStage: 'MATERIAL_PROCUREMENT',
    title: 'Submit utility net-metering layout files',
    description: 'File single-line layout dossiers to MSEDCL division managers.',
    status: 'IN_PROGRESS',
    priority: 'HIGH',
    category: 'DOCUMENTATION',
    assigneeName: 'Milind Deora',
    assigneeRole: 'PROJECT_MANAGER',
    startDate: '2026-05-25',
    dueDate: '2026-06-03',
    estimatedHours: 16,
    progress: 60,
    dependencies: [
      { id: 't-1016', title: 'Rooftop mounting layouts CAD design', status: 'DONE', relationType: 'BLOCKING' }
    ],
    comments: [],
    attachments: [],
    createdAt: '2026-05-29',
    assignedDate: '2026-05-25',
    startedDate: '2026-05-26'
  },
  {
    id: 't-1018',
    projectId: 'p-10',
    projectName: 'Nashik Agro-Cold Storage Roof',
    projectStage: 'SITE_SURVEY',
    title: 'Geotechnical soil investigation check',
    description: 'Inspect sand foundations supporting heavy inverter steel framework.',
    status: 'DONE',
    priority: 'HIGH',
    category: 'SURVEY',
    assigneeName: 'Vikram Salvi',
    assigneeRole: 'SITE_SUPERVISOR',
    startDate: '2026-05-15',
    dueDate: '2026-05-20',
    completedDate: '2026-05-19',
    estimatedHours: 12,
    progress: 100,
    dependencies: [],
    comments: [],
    attachments: [],
    createdAt: '2026-05-29',
    assignedDate: '2026-05-15',
    startedDate: '2026-05-16'
  },
  {
    id: 't-1019',
    projectId: 'p-10',
    projectName: 'Nashik Agro-Cold Storage Roof',
    projectStage: 'SITE_SURVEY',
    title: 'Cold storage thermal sheet safety audit',
    description: 'Verify polyurethane sandwich panels to prevent fires during mount installation.',
    status: 'IN_PROGRESS',
    priority: 'HIGH',
    category: 'SURVEY',
    assigneeName: 'Vikram Salvi',
    assigneeRole: 'SITE_SUPERVISOR',
    startDate: '2026-05-21',
    dueDate: '2026-05-29',
    estimatedHours: 8,
    progress: 90,
    dependencies: [
      { id: 't-1018', title: 'Geotechnical soil investigation check', status: 'DONE', relationType: 'BLOCKING' }
    ],
    comments: [
      { id: 'c-1019a', authorName: 'Vikram Salvi', authorRole: 'Site Supervisor', body: 'Inspected cold storage panel sheets. Material matches safety standard.', createdAt: '2026-05-29T09:00:00Z' }
    ],
    attachments: [],
    createdAt: '2026-05-29',
    assignedDate: '2026-05-21',
    startedDate: '2026-05-22'
  },
  {
    id: 't-1020',
    projectId: 'p-10',
    projectName: 'Nashik Agro-Cold Storage Roof',
    projectStage: 'SITE_SURVEY',
    title: 'Draft grid tie synchronizer CAD',
    description: 'Draft control panel schematics integrating 500kW rooftop strings with grid ties.',
    status: 'NOT_STARTED',
    priority: 'MEDIUM',
    category: 'DESIGN',
    assigneeName: 'Priyanka Joshi',
    assigneeRole: 'DESIGN_ENGINEER',
    startDate: '2026-06-01',
    dueDate: '2026-06-10',
    estimatedHours: 24,
    progress: 0,
    dependencies: [
      { id: 't-1019', title: 'Cold storage thermal sheet safety audit', status: 'IN_PROGRESS', relationType: 'BLOCKING' }
    ],
    comments: [],
    attachments: [],
    createdAt: '2026-05-29'
  },
  {
    id: 't-1021',
    projectId: 'p-11',
    projectName: 'Satara Irrigation Pumps Array',
    projectStage: 'PROJECT_CREATED',
    title: 'Irrigation pumps layout space mapping',
    description: 'Establish layout heights over irrigation water reservoirs.',
    status: 'DONE',
    priority: 'HIGH',
    category: 'SURVEY',
    assigneeName: 'Sunil Shinde',
    assigneeRole: 'SITE_SUPERVISOR',
    startDate: '2026-05-20',
    dueDate: '2026-05-25',
    completedDate: '2026-05-24',
    estimatedHours: 8,
    progress: 100,
    dependencies: [],
    comments: [],
    attachments: [],
    createdAt: '2026-05-29',
    assignedDate: '2026-05-20',
    startedDate: '2026-05-21'
  },
  {
    id: 't-1022',
    projectId: 'p-11',
    projectName: 'Satara Irrigation Pumps Array',
    projectStage: 'PROJECT_CREATED',
    title: 'Pumps charter and client lock-in',
    description: 'Authorize project scopes and budget revisions with agro co-op members.',
    status: 'IN_PROGRESS',
    priority: 'HIGH',
    category: 'APPROVAL',
    assigneeName: 'Aniket Mane',
    assigneeRole: 'PROJECT_MANAGER',
    startDate: '2026-05-26',
    dueDate: '2026-06-02',
    estimatedHours: 12,
    progress: 50,
    dependencies: [
      { id: 't-1021', title: 'Irrigation pumps layout space mapping', status: 'DONE', relationType: 'BLOCKING' }
    ],
    comments: [],
    attachments: [],
    createdAt: '2026-05-29',
    assignedDate: '2026-05-26',
    startedDate: '2026-05-27'
  },
  {
    id: 't-1023',
    projectId: 'p-12',
    projectName: 'Aurangabad Educational Solar',
    projectStage: 'PROJECT_CREATED',
    title: 'Academic campus solar shade map',
    description: 'Map solar yield paths over library and administrative roofs.',
    status: 'DONE',
    priority: 'MEDIUM',
    category: 'SURVEY',
    assigneeName: 'Ramesh Gore',
    assigneeRole: 'SITE_SUPERVISOR',
    startDate: '2026-05-18',
    dueDate: '2026-05-22',
    completedDate: '2026-05-22',
    estimatedHours: 10,
    progress: 100,
    dependencies: [],
    comments: [],
    attachments: [],
    createdAt: '2026-05-29',
    assignedDate: '2026-05-18',
    startedDate: '2026-05-18'
  },
  {
    id: 't-1024',
    projectId: 'p-12',
    projectName: 'Aurangabad Educational Solar',
    projectStage: 'PROJECT_CREATED',
    title: 'Authorize academic project contract dockets',
    description: 'Acquire board signs-off on contract scope sheets.',
    status: 'IN_PROGRESS',
    priority: 'HIGH',
    category: 'APPROVAL',
    assigneeName: 'Anjali Sharma',
    assigneeRole: 'PROJECT_MANAGER',
    startDate: '2026-05-23',
    dueDate: '2026-05-30',
    estimatedHours: 8,
    progress: 75,
    dependencies: [
      { id: 't-1023', title: 'Academic campus solar shade map', status: 'DONE', relationType: 'BLOCKING' }
    ],
    comments: [
      { id: 'c-1024a', authorName: 'Anjali Sharma', authorRole: 'Project Manager', body: 'Board review is done. Signing draft contracts today.', createdAt: '2026-05-28T15:00:00Z' }
    ],
    attachments: [],
    createdAt: '2026-05-29',
    assignedDate: '2026-05-23',
    startedDate: '2026-05-24'
  },
  {
    id: 't-1025',
    projectId: 'p-12',
    projectName: 'Aurangabad Educational Solar',
    projectStage: 'PROJECT_CREATED',
    title: 'Rooftop canopy structural CAD drawings',
    description: 'Design canopy support steel joints elevating modules above academic library yards.',
    status: 'NOT_STARTED',
    priority: 'MEDIUM',
    category: 'DESIGN',
    assigneeName: 'Priyanka Joshi',
    assigneeRole: 'DESIGN_ENGINEER',
    startDate: '2026-06-01',
    dueDate: '2026-06-08',
    estimatedHours: 16,
    progress: 0,
    dependencies: [
      { id: 't-1024', title: 'Authorize academic project contract dockets', status: 'IN_PROGRESS', relationType: 'BLOCKING' }
    ],
    comments: [],
    attachments: [],
    createdAt: '2026-05-29'
  },

  // ─── CRITICAL OVERDUE TASKS (Due before simulated today: May 29, 2026) ───
  {
    id: 't-1026',
    projectId: 'p-1',
    projectName: 'Pune Residential Rooftop',
    projectStage: 'ELECTRICAL_WIRING',
    title: 'Procure AC surge protection devices',
    description: 'Acquire high grade AC lightning SPD modules for combiners boxes.',
    status: 'NOT_STARTED',
    priority: 'HIGH',
    category: 'PROCUREMENT',
    assigneeName: 'Sanjay Mehta',
    assigneeRole: 'PROCUREMENT_OFFICER',
    startDate: '2026-05-15',
    dueDate: '2026-05-22', // Overdue
    estimatedHours: 6,
    progress: 0,
    dependencies: [],
    comments: [
      { id: 'c-1026a', authorName: 'Sanjay Mehta', authorRole: 'Procurement Officer', body: 'Manufacturer delayed dispatch. Material in transit now.', createdAt: '2026-05-24T09:00:00Z' }
    ],
    attachments: [],
    createdAt: '2026-05-29'
  },
  {
    id: 't-1027',
    projectId: 'p-2',
    projectName: 'Mumbai Corporate Solar Carport',
    projectStage: 'MATERIAL_DELIVERY',
    title: 'Excavate administrative parking site holes',
    description: 'Drill ground bores ready for steel concrete casting blocks.',
    status: 'IN_PROGRESS',
    priority: 'HIGH',
    category: 'INSTALLATION',
    assigneeName: 'Amol Deshmukh',
    assigneeRole: 'SITE_SUPERVISOR',
    startDate: '2026-05-10',
    dueDate: '2026-05-20', // Overdue
    estimatedHours: 16,
    progress: 30,
    dependencies: [],
    comments: [
      { id: 'c-1027a', authorName: 'Amol Deshmukh', authorRole: 'Site Supervisor', body: 'Rain delayed ground boring. Excavating remaining slots.', createdAt: '2026-05-22T10:00:00Z' }
    ],
    attachments: [],
    createdAt: '2026-05-29'
  },
  {
    id: 't-1028',
    projectId: 'p-6',
    projectName: 'Aurangabad Industrial Rooftop',
    projectStage: 'SITE_SURVEY',
    title: 'Textile utility grid connection checks',
    description: 'Inspect regional utility poles adjacent to warehouse boundary slots.',
    status: 'BLOCKED',
    priority: 'HIGH',
    category: 'SURVEY',
    assigneeName: 'Ramesh Gore',
    assigneeRole: 'SITE_SUPERVISOR',
    startDate: '2026-05-10',
    dueDate: '2026-05-24', // Overdue
    estimatedHours: 8,
    progress: 10,
    dependencies: [],
    comments: [
      { id: 'c-1028a', authorName: 'Ramesh Gore', authorRole: 'Site Supervisor', body: 'Utility engineer permission denied for structural pole inspections.', createdAt: '2026-05-18T10:00:00Z' }
    ],
    attachments: [],
    createdAt: '2026-05-29'
  },
  {
    id: 't-1029',
    projectId: 'p-13',
    projectName: 'Satara Sugar Plant Carport',
    projectStage: 'PROJECT_CREATED',
    title: 'Draft factory net metering diagram blueprint',
    description: 'Draft single-line electrical layouts showing bidirectional utility meter links.',
    status: 'NOT_STARTED',
    priority: 'MEDIUM',
    category: 'DESIGN',
    assigneeName: 'Priyanka Joshi',
    assigneeRole: 'DESIGN_ENGINEER',
    startDate: '2026-05-15',
    dueDate: '2026-05-25', // Overdue
    estimatedHours: 16,
    progress: 0,
    dependencies: [],
    comments: [],
    attachments: [],
    createdAt: '2026-05-29'
  },
  {
    id: 't-1030',
    projectId: 'p-9',
    projectName: 'Mumbai Suburban Office Solar',
    projectStage: 'MATERIAL_PROCUREMENT',
    title: 'Draft electrical inverter sync protection layout',
    description: 'Design safety relays matching suburban utility feed rules.',
    status: 'NOT_STARTED',
    priority: 'HIGH',
    category: 'DESIGN',
    assigneeName: 'Kunal Sen',
    assigneeRole: 'DESIGN_ENGINEER',
    startDate: '2026-05-15',
    dueDate: '2026-05-25', // Overdue
    estimatedHours: 12,
    progress: 0,
    dependencies: [],
    comments: [],
    attachments: [],
    createdAt: '2026-05-29'
  }
];
