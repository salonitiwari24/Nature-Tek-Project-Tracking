/** Ordered solar project lifecycle stages (SRS §3.1) */
export const LIFECYCLE_STAGES = [
  'PROJECT_CREATED',
  'SITE_SURVEY',
  'DESIGN_APPROVAL',
  'MATERIAL_PROCUREMENT',
  'MATERIAL_DELIVERY',
  'STRUCTURE_INSTALLATION',
  'PANEL_MOUNTING',
  'ELECTRICAL_WIRING',
  'INVERTER_INSTALLATION',
  'TESTING_COMMISSIONING',
  'GRID_APPROVAL',
  'PROJECT_HANDOVER',
  'COMPLETED',
] as const;

export type LifecycleStage = (typeof LIFECYCLE_STAGES)[number];

export const LIFECYCLE_STAGE_LABELS: Record<LifecycleStage, string> = {
  PROJECT_CREATED: 'Project Created',
  SITE_SURVEY: 'Site Survey',
  DESIGN_APPROVAL: 'Design Approval',
  MATERIAL_PROCUREMENT: 'Material Procurement',
  MATERIAL_DELIVERY: 'Material Delivery',
  STRUCTURE_INSTALLATION: 'Structure Installation',
  PANEL_MOUNTING: 'Panel Mounting',
  ELECTRICAL_WIRING: 'Electrical Wiring',
  INVERTER_INSTALLATION: 'Inverter Installation',
  TESTING_COMMISSIONING: 'Testing & Commissioning',
  GRID_APPROVAL: 'Grid Approval',
  PROJECT_HANDOVER: 'Project Handover',
  COMPLETED: 'Completed',
};

export function getNextStage(current: LifecycleStage): LifecycleStage | null {
  const index = LIFECYCLE_STAGES.indexOf(current);
  if (index < 0 || index >= LIFECYCLE_STAGES.length - 1) return null;
  return LIFECYCLE_STAGES[index + 1];
}

export function getPreviousStage(current: LifecycleStage): LifecycleStage | null {
  const index = LIFECYCLE_STAGES.indexOf(current);
  if (index <= 0) return null;
  return LIFECYCLE_STAGES[index - 1];
}
