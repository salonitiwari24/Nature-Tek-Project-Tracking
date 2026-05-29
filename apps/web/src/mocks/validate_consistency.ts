import { mockProjects } from './projectMockData';
import { mockTasks } from './taskMockData';
import { mockMilestones } from './milestoneMockData';
import { mockUsers } from './userMockData';
import { mockDocuments } from './documentMockData';
import { mockAlerts } from './alertMockData';

export interface AuditIssue {
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  entity: 'PROJECT' | 'TASK' | 'MILESTONE' | 'USER' | 'DOCUMENT' | 'ALERT';
  id: string;
  field: string;
  message: string;
}

export function runDataConsistencyAudit() {
  const issues: AuditIssue[] = [];

  // Create fast lookup maps
  const userMap = new Map(mockUsers.map((u) => [u.id, u]));
  const projectMap = new Map(mockProjects.map((p) => [p.id, p]));
  const taskMap = new Map(mockTasks.map((t) => [t.id, t]));
  const milestoneMap = new Map(mockMilestones.map((m) => [m.id, m]));
  const documentMap = new Map(mockDocuments.map((d) => [d.id, d]));

  console.log('--- Nature Tek Solar PMS: Starting Programmatic Data Consistency Audit ---');
  console.log(`Auditing: ${mockProjects.length} Projects, ${mockTasks.length} Tasks, ${mockMilestones.length} Milestones, ${mockUsers.length} Users, ${mockDocuments.length} Documents, ${mockAlerts.length} Alerts.`);

  // 1. AUDIT USERS
  mockUsers.forEach((u) => {
    // Validate assigned projects
    u.assignedProjects.forEach((pId) => {
      if (!projectMap.has(pId)) {
        issues.push({
          severity: 'CRITICAL',
          entity: 'USER',
          id: u.id,
          field: 'assignedProjects',
          message: `User assigned to non-existent Project "${pId}"`,
        });
      }
    });
  });

  // 2. AUDIT PROJECTS
  mockProjects.forEach((p) => {
    // Validate Project Manager references
    if (p.projectManagerId && !userMap.has(p.projectManagerId)) {
      issues.push({
        severity: 'CRITICAL',
        entity: 'PROJECT',
        id: p.id,
        field: 'projectManagerId',
        message: `Project Manager ID "${p.projectManagerId}" does not exist in User registry`,
      });
    }
  });

  // 3. AUDIT TASKS
  mockTasks.forEach((t) => {
    // Validate Project reference
    if (!projectMap.has(t.projectId)) {
      issues.push({
        severity: 'CRITICAL',
        entity: 'TASK',
        id: t.id,
        field: 'projectId',
        message: `Task mapped to non-existent Project ID "${t.projectId}"`,
      });
    }

    // Validate Assigned User reference
    if (t.assignedTo && !userMap.has(t.assignedTo)) {
      issues.push({
        severity: 'CRITICAL',
        entity: 'TASK',
        id: t.id,
        field: 'assignedTo',
        message: `Task assigned to non-existent User ID "${t.assignedTo}"`,
      });
    }

    // Validate Milestone reference
    if (t.milestoneId && !milestoneMap.has(t.milestoneId)) {
      issues.push({
        severity: 'CRITICAL',
        entity: 'TASK',
        id: t.id,
        field: 'milestoneId',
        message: `Task maps to non-existent Milestone ID "${t.milestoneId}"`,
      });
    }

    // Validate milestone-project alignment
    if (t.milestoneId && t.projectId) {
      const ms = milestoneMap.get(t.milestoneId);
      if (ms && ms.projectId !== t.projectId) {
        issues.push({
          severity: 'WARNING',
          entity: 'TASK',
          id: t.id,
          field: 'milestoneId',
          message: `Task Project ID "${t.projectId}" does not match parent Milestone Project ID "${ms.projectId}"`,
        });
      }
    }
  });

  // 4. AUDIT MILESTONES
  mockMilestones.forEach((m) => {
    // Validate Project reference
    if (!projectMap.has(m.projectId)) {
      issues.push({
        severity: 'CRITICAL',
        entity: 'MILESTONE',
        id: m.id,
        field: 'projectId',
        message: `Milestone maps to non-existent Project ID "${m.projectId}"`,
      });
    }

    // Validate Predecessor / Successor references
    if (m.predecessorId && !milestoneMap.has(m.predecessorId)) {
      issues.push({
        severity: 'WARNING',
        entity: 'MILESTONE',
        id: m.id,
        field: 'predecessorId',
        message: `Milestone predecessor ID "${m.predecessorId}" does not exist`,
      });
    }
    if (m.successorId && !milestoneMap.has(m.successorId)) {
      issues.push({
        severity: 'WARNING',
        entity: 'MILESTONE',
        id: m.id,
        field: 'successorId',
        message: `Milestone successor ID "${m.successorId}" does not exist`,
      });
    }
  });

  // 5. AUDIT DOCUMENTS
  mockDocuments.forEach((d) => {
    // Validate Project reference
    if (!projectMap.has(d.projectId)) {
      issues.push({
        severity: 'CRITICAL',
        entity: 'DOCUMENT',
        id: d.id,
        field: 'projectId',
        message: `Document maps to non-existent Project ID "${d.projectId}"`,
      });
    }
  });

  // 6. AUDIT ALERTS
  mockAlerts.forEach((a) => {
    // Validate Project reference
    if (a.projectId && !projectMap.has(a.projectId)) {
      issues.push({
        severity: 'CRITICAL',
        entity: 'ALERT',
        id: a.id,
        field: 'projectId',
        message: `Alert maps to non-existent Project ID "${a.projectId}"`,
      });
    }

    // Validate Related Resource references
    if (a.relatedId) {
      const isTask = taskMap.has(a.relatedId);
      const isMilestone = milestoneMap.has(a.relatedId);
      const isDoc = documentMap.has(a.relatedId);
      const isUser = userMap.has(a.relatedId);
      const isProject = projectMap.has(a.relatedId);

      if (!isTask && !isMilestone && !isDoc && !isUser && !isProject) {
        issues.push({
          severity: 'WARNING',
          entity: 'ALERT',
          id: a.id,
          field: 'relatedId',
          message: `Alert related resource ID "${a.relatedId}" could not be verified in any registry`,
        });
      }
    }
  });

  console.log(`Audit Complete. Found ${issues.length} issues.`);
  return issues;
}
