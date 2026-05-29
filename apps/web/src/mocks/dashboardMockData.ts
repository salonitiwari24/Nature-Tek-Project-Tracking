export interface Project {
  id: string;
  code: string;
  name: string;
  clientName: string;
  siteAddress: string;
  siteCity: string;
  siteState: string;
  capacityKw: number;
  projectType: 'RESIDENTIAL' | 'COMMERCIAL' | 'INDUSTRIAL';
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
}

export interface MonthlyCompletion {
  month: string;
  completed: number;
}

export interface DashboardAlert {
  id: string;
  projectId: string;
  projectCode: string;
  projectName: string;
  type: 'DELAYED_PROJECT' | 'UPCOMING_DEADLINE' | 'PENDING_APPROVAL';
  title: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
  dueDate?: string;
}

export const mockProjects: Project[] = [
  {
    id: 'p-1',
    code: 'PRJ-2026-001',
    name: 'Mesa Verde Residential Grid',
    clientName: 'Robert Vance',
    siteAddress: '742 Evergreen Terrace',
    siteCity: 'Phoenix',
    siteState: 'AZ',
    capacityKw: 12.5,
    projectType: 'RESIDENTIAL',
    currentStage: 'STRUCTURE_INSTALLATION',
    status: 'ACTIVE',
    targetStart: '2026-05-01T00:00:00Z',
    targetEnd: '2026-06-15T00:00:00Z',
    actualStart: '2026-05-02T00:00:00Z',
  },
  {
    id: 'p-2',
    code: 'PRJ-2026-002',
    name: 'Apex Logistics Distribution Center',
    clientName: 'Apex Logistics Inc.',
    siteAddress: '10400 West Buckeye Road',
    siteCity: 'Tolleson',
    siteState: 'AZ',
    capacityKw: 450.0,
    projectType: 'COMMERCIAL',
    currentStage: 'DESIGN_APPROVAL',
    status: 'ACTIVE',
    targetStart: '2026-05-10T00:00:00Z',
    targetEnd: '2026-08-20T00:00:00Z',
    actualStart: '2026-05-12T00:00:00Z',
  },
  {
    id: 'p-3',
    code: 'PRJ-2026-003',
    name: 'Helix Biotech Campus Array',
    clientName: 'Helix Pharmaceuticals',
    siteAddress: '1600 Innovation Way',
    siteCity: 'San Diego',
    siteState: 'CA',
    capacityKw: 1200.0,
    projectType: 'INDUSTRIAL',
    currentStage: 'SITE_SURVEY',
    status: 'ACTIVE',
    targetStart: '2026-05-20T00:00:00Z',
    targetEnd: '2026-11-30T00:00:00Z',
  },
  {
    id: 'p-4',
    code: 'PRJ-2026-004',
    name: 'Desert Vista Commercial Depot',
    clientName: 'Desert Vista LLC',
    siteAddress: '4450 N Black Canyon Hwy',
    siteCity: 'Phoenix',
    siteState: 'AZ',
    capacityKw: 150.0,
    projectType: 'COMMERCIAL',
    currentStage: 'INVERTER_INSTALLATION',
    status: 'ACTIVE',
    targetStart: '2026-03-01T00:00:00Z',
    targetEnd: '2026-05-15T00:00:00Z', // Past target end - DELAYED
    actualStart: '2026-03-02T00:00:00Z',
  },
  {
    id: 'p-5',
    code: 'PRJ-2026-005',
    name: 'Loma Linda Farm Solar Power',
    clientName: 'Loma Linda Agribusiness',
    siteAddress: '8800 Highway 80',
    siteCity: 'Gila Bend',
    siteState: 'AZ',
    capacityKw: 850.0,
    projectType: 'INDUSTRIAL',
    currentStage: 'COMPLETED',
    status: 'COMPLETED',
    targetStart: '2026-01-10T00:00:00Z',
    targetEnd: '2026-04-30T00:00:00Z',
    actualStart: '2026-01-12T00:00:00Z',
    actualEnd: '2026-04-28T00:00:00Z',
  },
  {
    id: 'p-6',
    code: 'PRJ-2026-006',
    name: 'Pioneer School Rooftop Array',
    clientName: 'Pioneer Unified School Dist.',
    siteAddress: '300 Schoolhouse Lane',
    siteCity: 'Flagstaff',
    siteState: 'AZ',
    capacityKw: 85.0,
    projectType: 'COMMERCIAL',
    currentStage: 'PROJECT_CREATED',
    status: 'ACTIVE',
    targetStart: '2026-06-01T00:00:00Z',
    targetEnd: '2026-08-15T00:00:00Z',
  },
  {
    id: 'p-7',
    code: 'PRJ-2026-007',
    name: 'Sunset Heights Residential Solar',
    clientName: 'Emily Watson',
    siteAddress: '1240 Canyon Rim Drive',
    siteCity: 'Tucson',
    siteState: 'AZ',
    capacityKw: 9.6,
    projectType: 'RESIDENTIAL',
    currentStage: 'PROJECT_HANDOVER',
    status: 'ACTIVE',
    targetStart: '2026-04-05T00:00:00Z',
    targetEnd: '2026-05-25T00:00:00Z',
    actualStart: '2026-04-06T00:00:00Z',
  },
  {
    id: 'p-8',
    code: 'PRJ-2026-008',
    name: 'Oak Creek Commercial Plaza',
    clientName: 'Oak Creek Properties',
    siteAddress: '150 State Route 179',
    siteCity: 'Sedona',
    siteState: 'AZ',
    capacityKw: 220.0,
    projectType: 'COMMERCIAL',
    currentStage: 'MATERIAL_PROCUREMENT',
    status: 'ON_HOLD',
    targetStart: '2026-03-15T00:00:00Z',
    targetEnd: '2026-07-01T00:00:00Z',
    actualStart: '2026-03-20T00:00:00Z',
  },
  {
    id: 'p-9',
    code: 'PRJ-2026-009',
    name: 'Valley Care Medical Center',
    clientName: 'Valley Health Network',
    siteAddress: '9900 N 92nd Street',
    siteCity: 'Scottsdale',
    siteState: 'AZ',
    capacityKw: 310.0,
    projectType: 'COMMERCIAL',
    currentStage: 'COMPLETED',
    status: 'COMPLETED',
    targetStart: '2026-02-01T00:00:00Z',
    targetEnd: '2026-05-10T00:00:00Z',
    actualStart: '2026-02-03T00:00:00Z',
    actualEnd: '2026-05-08T00:00:00Z',
  },
  {
    id: 'p-10',
    code: 'PRJ-2026-010',
    name: 'River Basin Pumping Station',
    clientName: 'River Basin Water District',
    siteAddress: '550 Canal Road',
    siteCity: 'Yuma',
    siteState: 'AZ',
    capacityKw: 1500.0,
    projectType: 'INDUSTRIAL',
    currentStage: 'MATERIAL_DELIVERY',
    status: 'ACTIVE',
    targetStart: '2026-04-10T00:00:00Z',
    targetEnd: '2026-05-20T00:00:00Z', // Past target end - DELAYED
    actualStart: '2026-04-12T00:00:00Z',
  },
  {
    id: 'p-11',
    code: 'PRJ-2026-011',
    name: 'Skyline Ridge Residential Grid',
    clientName: 'Arthur Dent',
    siteAddress: '42 Hitchhiker Way',
    siteCity: 'Flagstaff',
    siteState: 'AZ',
    capacityKw: 15.0,
    projectType: 'RESIDENTIAL',
    currentStage: 'COMPLETED',
    status: 'COMPLETED',
    targetStart: '2026-03-01T00:00:00Z',
    targetEnd: '2026-04-10T00:00:00Z',
    actualStart: '2026-03-02T00:00:00Z',
    actualEnd: '2026-04-08T00:00:00Z',
  },
];

export const mockMonthlyCompletions: MonthlyCompletion[] = [
  { month: 'Jan', completed: 2 },
  { month: 'Feb', completed: 3 },
  { month: 'Mar', completed: 5 },
  { month: 'Apr', completed: 4 },
  { month: 'May', completed: 6 },
  { month: 'Jun', completed: 8 },
];

export const mockAlerts: DashboardAlert[] = [
  {
    id: 'a-1',
    projectId: 'p-4',
    projectCode: 'PRJ-2026-004',
    projectName: 'Desert Vista Commercial Depot',
    type: 'DELAYED_PROJECT',
    title: 'Project Overdue',
    description: 'Inverter Installation stage is lagging. Target completion was 2026-05-15.',
    severity: 'high',
  },
  {
    id: 'a-2',
    projectId: 'p-10',
    projectCode: 'PRJ-2026-010',
    projectName: 'River Basin Pumping Station',
    type: 'DELAYED_PROJECT',
    title: 'Material Delivery Delayed',
    description: 'Material Delivery stage past target date of 2026-05-20.',
    severity: 'high',
  },
  {
    id: 'a-3',
    projectId: 'p-1',
    projectCode: 'PRJ-2026-001',
    projectName: 'Mesa Verde Residential Grid',
    type: 'UPCOMING_DEADLINE',
    title: 'Structure Installation Due',
    description: 'Racking complete milestone is due in 3 days.',
    severity: 'medium',
    dueDate: '2026-06-01T17:00:00Z',
  },
  {
    id: 'a-4',
    projectId: 'p-2',
    projectCode: 'PRJ-2026-002',
    projectName: 'Apex Logistics Distribution Center',
    type: 'PENDING_APPROVAL',
    title: 'Single-Line Diagram Sign-off',
    description: 'Design package SLD requires engineering and PM sign-off.',
    severity: 'medium',
  },
  {
    id: 'a-5',
    projectId: 'p-8',
    projectCode: 'PRJ-2026-008',
    projectName: 'Oak Creek Commercial Plaza',
    type: 'PENDING_APPROVAL',
    title: 'Purchase Order Approval',
    description: 'Material procurement PO #77092 is awaiting budget approval ($24,500).',
    severity: 'medium',
  },
];
