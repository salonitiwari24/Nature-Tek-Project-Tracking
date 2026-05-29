import { PrismaClient, ProjectLifecycleStage, SystemRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const LIFECYCLE_STAGES: ProjectLifecycleStage[] = [
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
];

async function main() {
  const org = await prisma.organization.upsert({
    where: { slug: 'nature-tek' },
    update: {},
    create: {
      name: 'Nature Tek Solar',
      slug: 'nature-tek',
      settings: { timezone: 'Asia/Kolkata', currency: 'INR' },
    },
  });

  const passwordHash = await bcrypt.hash('Admin@123', 12);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@naturetek.com' },
    update: {},
    create: {
      orgId: org.id,
      email: 'admin@naturetek.com',
      passwordHash,
      firstName: 'System',
      lastName: 'Admin',
      role: SystemRole.ADMIN,
    },
  });

  const pm = await prisma.user.upsert({
    where: { email: 'pm@naturetek.com' },
    update: {},
    create: {
      orgId: org.id,
      email: 'pm@naturetek.com',
      passwordHash: await bcrypt.hash('Pm@12345', 12),
      firstName: 'Priya',
      lastName: 'Sharma',
      role: SystemRole.PM,
    },
  });

  for (const stage of LIFECYCLE_STAGES) {
    await prisma.stageRequirement.upsert({
      where: { stage },
      update: {},
      create: {
        stage,
        requiredDocCats: [],
        milestoneNames: [`${stage} complete`],
        approvalTypes: [],
      },
    });
  }

  const project = await prisma.project.upsert({
    where: { orgId_code: { orgId: org.id, code: 'NT-2026-001' } },
    update: {},
    create: {
      orgId: org.id,
      code: 'NT-2026-001',
      name: 'Green Villa Rooftop 5kW',
      clientName: 'Rajesh Kumar',
      siteAddress: '12 MG Road, Bangalore',
      capacityKw: 5.0,
      pmId: pm.id,
      currentStage: 'PROJECT_CREATED',
    },
  });

  await prisma.projectMember.upsert({
    where: { projectId_userId: { projectId: project.id, userId: pm.id } },
    update: {},
    create: { projectId: project.id, userId: pm.id, projectRole: 'PM' },
  });

  await prisma.lifecycleStageHistory.create({
    data: {
      projectId: project.id,
      fromStage: null,
      toStage: 'PROJECT_CREATED',
      changedBy: admin.id,
      reason: 'Initial project creation',
    },
  });

  console.log('Seed completed:', { org: org.slug, admin: admin.email, project: project.code });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
