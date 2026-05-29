import { z } from 'zod';
import { LIFECYCLE_STAGES } from '../constants/lifecycle';

export const createProjectSchema = z.object({
  code: z.string().min(3).max(32),
  name: z.string().min(3).max(200),
  description: z.string().optional(),
  clientName: z.string().min(1).max(200),
  clientEmail: z.string().email().optional(),
  clientPhone: z.string().optional(),
  siteAddress: z.string().min(5),
  siteCity: z.string().optional(),
  siteState: z.string().optional(),
  capacityKw: z.number().positive(),
  projectType: z.enum(['RESIDENTIAL', 'COMMERCIAL', 'INDUSTRIAL']).default('RESIDENTIAL'),
  pmId: z.string().uuid().optional(),
  supervisorId: z.string().uuid().optional(),
  targetStart: z.string().datetime().optional(),
  targetEnd: z.string().datetime().optional(),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;

export const advanceLifecycleSchema = z.object({
  targetStage: z.enum(LIFECYCLE_STAGES as unknown as [string, ...string[]]),
  reason: z.string().min(3).max(500).optional(),
});

export type AdvanceLifecycleInput = z.infer<typeof advanceLifecycleSchema>;
