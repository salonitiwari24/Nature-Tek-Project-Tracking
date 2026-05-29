# Software Requirements Specification (SRS)

## Nature Tek Solar – Project Tracking & Management System

| Document | Version | Date | Status |
|----------|---------|------|--------|
| SRS – Requirement Analysis | 1.0.0 | 2026-05-29 | Approved |

---

## 1. Introduction

### 1.1 Purpose

This document defines functional and non-functional requirements for the **Nature Tek Solar Project Tracking & Management System**—an enterprise-grade platform for planning, executing, monitoring, and closing residential and commercial solar installation projects.

### 1.2 Scope

The system supports the full solar project lifecycle from project creation through grid approval and handover, including tasks, milestones, resources, documents, approvals, reports, alerts, and analytics.

### 1.3 Definitions

| Term | Definition |
|------|------------|
| Project | A solar installation engagement with defined scope, timeline, site, and stakeholders |
| Milestone | A phase-gate or deliverable tied to lifecycle stage |
| Task | Actionable work unit assigned to users or teams |
| Approval | Formal sign-off required to advance workflow |
| Commissioning | Post-install testing before grid connection |

### 1.4 References

- Nature Tek Solar Project Tracking System specification (stakeholder-provided)
- Industry practices: solar EPC project management, document control, role-based access

---

## 2. Stakeholders & User Roles

### 2.1 Primary Roles (Specified)

| Role | Code | Primary Responsibility |
|------|------|------------------------|
| **Admin** | `ADMIN` | System configuration, user/role management, org settings, audit oversight |
| **Project Manager** | `PM` | End-to-end project ownership, scheduling, approvals initiation, reporting |
| **Site Supervisor** | `SUPERVISOR` | On-site execution, task updates, safety/compliance, field documentation |
| **Team Member** | `MEMBER` | Assigned task execution, time/material logging, document upload |

### 2.2 Additional Recommended Roles

| Role | Code | Rationale |
|------|------|-----------|
| **Executive / Leadership** | `EXEC` | Read-only dashboards, portfolio KPIs, approval escalation |
| **Design Engineer** | `DESIGN` | Design packages, drawing revisions, design approval workflow |
| **Procurement Officer** | `PROCUREMENT` | Material orders, vendor POs, delivery tracking |
| **Quality & Safety Inspector** | `QA` | Inspection checklists, non-conformance, commissioning sign-off |
| **Finance / Billing** | `FINANCE` | Cost tracking, invoicing milestones, budget vs actual |
| **Customer / Client** | `CLIENT` | Limited portal: status, documents, approval requests (optional) |
| **System Integrator / API** | `SERVICE` | Machine accounts for integrations (ERP, CRM, accounting) |

### 2.3 Role–Capability Matrix (Summary)

| Capability | Admin | PM | Supervisor | Member | Design | Procurement | QA | Finance | Exec | Client |
|------------|:-----:|:--:|:----------:|:------:|:------:|:-------------:|:--:|:-------:|:----:|:------:|
| Create/edit projects | ✓ | ✓ | — | — | — | — | — | — | — | — |
| Manage lifecycle stage | ✓ | ✓ | propose | — | — | — | — | — | view | view |
| Task CRUD | ✓ | ✓ | ✓ | assigned | — | — | — | — | view | — |
| Approve workflows | ✓ | ✓ | limited | — | design | procurement | QA | budget | — | sign |
| Document upload | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | — | limited |
| Reports & analytics | ✓ | ✓ | team | own | — | procurement | QA | finance | ✓ | — |
| User management | ✓ | — | — | — | — | — | — | — | — | — |

---

## 3. Project Lifecycle Model

### 3.1 Lifecycle States

```
┌─────────────────┐
│ Project Created │
└────────┬────────┘
         ▼
┌─────────────────┐     ┌──────────────────┐
│   Site Survey   │────►│ Design Approval  │
└────────┬────────┘     └────────┬─────────┘
         │                       ▼
         │              ┌──────────────────────┐
         │              │ Material Procurement │
         │              └──────────┬───────────┘
         │                         ▼
         │              ┌──────────────────────┐
         │              │  Material Delivery   │
         │              └──────────┬───────────┘
         │                         ▼
         │              ┌──────────────────────┐
         │              │Structure Installation│
         │              └──────────┬───────────┘
         │                         ▼
         │              ┌──────────────────────┐
         │              │   Panel Mounting       │
         │              └──────────┬───────────┘
         │                         ▼
         │              ┌──────────────────────┐
         │              │ Electrical Wiring    │
         │              └──────────┬───────────┘
         │                         ▼
         │              ┌──────────────────────┐
         │              │Inverter Installation │
         │              └──────────┬───────────┘
         │                         ▼
         │              ┌──────────────────────┐
         │              │Testing & Commissioning│
         │              └──────────┬───────────┘
         │                         ▼
         │              ┌──────────────────────┐
         │              │   Grid Approval      │
         │              └──────────┬───────────┘
         │                         ▼
         │              ┌──────────────────────┐
         │              │  Project Handover    │
         │              └──────────┬───────────┘
         │                         ▼
         └────────────────►┌─────────────┐
                           │  Completed  │
                           └─────────────┘
```

### 3.2 Lifecycle Rules

| Rule ID | Description |
|---------|-------------|
| LC-01 | Each project has exactly one current lifecycle stage at a time |
| LC-02 | Forward transitions require milestone completion and applicable approvals |
| LC-03 | Backward transitions (rework) require PM or Admin with reason code and audit log |
| LC-04 | `Completed` is terminal; reopening requires Admin |
| LC-05 | Parallel work allowed within a stage (e.g., tasks) but stage gate is sequential unless configured |
| LC-06 | Each stage maps to default task templates and required document types |

### 3.3 Stage–Milestone Mapping

| Stage | Typical Milestones | Required Approvals |
|-------|-------------------|-------------------|
| Project Created | Charter signed, team assigned | PM assignment |
| Site Survey | Survey report, roof assessment | PM |
| Design Approval | Single-line diagram, layout, BOM | Design + PM |
| Material Procurement | PO issued | Procurement + PM |
| Material Delivery | GRN, inventory receipt | Supervisor |
| Structure Installation | Racking complete | Supervisor + QA |
| Panel Mounting | Modules installed | Supervisor + QA |
| Electrical Wiring | AC/DC runs complete | QA |
| Inverter Installation | Inverter commissioned locally | QA |
| Testing & Commissioning | Test reports, IV curve | QA + PM |
| Grid Approval | Utility application, PTO | PM + Client |
| Project Handover | O&M docs, warranties | PM + Client |
| Completed | Close-out report | Admin archive |

---

## 4. Functional Requirements

### 4.1 Project Management (FR-PM)

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-PM-01 | Create project with client, site address, capacity (kW), type (residential/commercial), target dates | Must |
| FR-PM-02 | Assign PM, supervisor, and team members | Must |
| FR-PM-03 | View project list with filters (stage, PM, date, status, region) | Must |
| FR-PM-04 | Project detail dashboard: timeline, tasks, milestones, documents, activity feed | Must |
| FR-PM-05 | Advance/regress lifecycle stage per rules LC-01–LC-06 | Must |
| FR-PM-06 | Project templates for repeatable project types | Should |
| FR-PM-07 | Custom fields (permit #, utility account, financing ref) | Should |
| FR-PM-08 | Project duplication / clone from template | Could |
| FR-PM-09 | Bulk import projects (CSV/API) | Could |
| FR-PM-10 | Archive and soft-delete with retention policy | Must |

### 4.2 Task Management (FR-TM)

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-TM-01 | Create tasks with title, description, priority, due date, assignee(s) | Must |
| FR-TM-02 | Link tasks to project and optionally lifecycle stage | Must |
| FR-TM-03 | Task statuses: Not Started, In Progress, Blocked, In Review, Done, Cancelled | Must |
| FR-TM-04 | Subtasks and checklists | Should |
| FR-TM-05 | Dependencies between tasks (finish-to-start) | Should |
| FR-TM-06 | Comments, @mentions, attachments on tasks | Must |
| FR-TM-07 | Kanban and list views per project | Must |
| FR-TM-08 | My Tasks view across projects | Must |
| FR-TM-09 | Auto-generate stage default tasks from templates | Should |
| FR-TM-10 | Time tracking / effort logging | Could |

### 4.3 Milestone Management (FR-ML)

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-ML-01 | Define milestones per project with target and actual dates | Must |
| FR-ML-02 | Milestone linked to lifecycle stage | Must |
| FR-ML-03 | Milestone completion criteria (tasks %, checklist, approval) | Must |
| FR-ML-04 | Overdue milestone alerts | Must |
| FR-ML-05 | Gantt / timeline visualization | Should |
| FR-ML-06 | Baseline vs actual schedule comparison | Should |

### 4.4 Resource Management (FR-RM)

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-RM-01 | Human resources: skills, availability, assignment to projects/tasks | Must |
| FR-RM-02 | Equipment/tools catalog and allocation | Should |
| FR-RM-03 | Material BOM per project linked to procurement stage | Must |
| FR-RM-04 | Inventory levels and delivery status | Should |
| FR-RM-05 | Resource utilization report (by person/team) | Should |
| FR-RM-06 | Conflict detection (double-booking) | Could |

### 4.5 Document Management (FR-DM)

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-DM-01 | Upload/download documents per project with versioning | Must |
| FR-DM-02 | Document categories (survey, design, permit, photo, test, handover) | Must |
| FR-DM-03 | Stage-required document checklist | Must |
| FR-DM-04 | Preview for PDF/images | Should |
| FR-DM-05 | Access control per document (role + project membership) | Must |
| FR-DM-06 | Full-text search metadata (title, tags, project) | Should |
| FR-DM-07 | Retention and legal hold flags | Could |

### 4.6 Approval Workflow (FR-AW)

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-AW-01 | Configurable approval chains per stage/type | Must |
| FR-AW-02 | Submit, approve, reject, request changes with comments | Must |
| FR-AW-03 | Multi-level sequential and parallel approvers | Must |
| FR-AW-04 | Email/in-app notification on pending approval | Must |
| FR-AW-05 | SLA timers and escalation | Should |
| FR-AW-06 | Digital signature capture (handover, client) | Could |
| FR-AW-07 | Immutable approval audit trail | Must |

### 4.7 Reports (FR-RP)

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-RP-01 | Standard reports: project status, stage pipeline, overdue tasks | Must |
| FR-RP-02 | Milestone variance and schedule performance | Must |
| FR-RP-03 | Resource workload report | Should |
| FR-RP-04 | Export PDF/Excel/CSV | Must |
| FR-RP-05 | Scheduled report delivery via email | Should |
| FR-RP-06 | Custom report builder | Could |

### 4.8 Notifications & Alerts (FR-NT)

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-NT-01 | In-app notification center | Must |
| FR-NT-02 | Email notifications for critical events | Must |
| FR-NT-03 | Alert types: task due, milestone overdue, approval pending, stage change | Must |
| FR-NT-04 | User notification preferences | Should |
| FR-NT-05 | SMS/push for urgent field alerts | Could |

### 4.9 User Management (FR-UM)

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-UM-01 | User registration invitation (no public signup) | Must |
| FR-UM-02 | Role-based access control (RBAC) | Must |
| FR-UM-03 | Project-level membership (project team) | Must |
| FR-UM-04 | Password policy, MFA (TOTP) | Must |
| FR-UM-05 | Session management and forced logout | Must |
| FR-UM-06 | User profile, avatar, contact info | Should |
| FR-UM-07 | SSO (SAML/OIDC) | Should |
| FR-UM-08 | Audit log of admin actions | Must |

### 4.10 Analytics (FR-AN)

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-AN-01 | Executive dashboard: projects by stage, completion rate | Must |
| FR-AN-02 | Cycle time per lifecycle stage | Must |
| FR-AN-03 | Task throughput and bottleneck analysis | Should |
| FR-AN-04 | Approval turnaround metrics | Should |
| FR-AN-05 | Drill-down from KPI to project list | Must |
| FR-AN-06 | Date range and regional filters | Must |

---

## 5. Non-Functional Requirements

### 5.1 Security (NFR-SEC)

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-SEC-01 | HTTPS only; HSTS | Enforced |
| NFR-SEC-02 | OWASP Top 10 mitigations (XSS, CSRF, SQLi, etc.) | Compliant |
| NFR-SEC-03 | Encryption at rest for DB and file storage | AES-256 |
| NFR-SEC-04 | Principle of least privilege (RBAC + project scope) | Enforced |
| NFR-SEC-05 | Secrets in vault/env, never in repo | Enforced |
| NFR-SEC-06 | Rate limiting on auth and API | Configurable |
| NFR-SEC-07 | Penetration test before production | Annual |

### 5.2 Performance (NFR-PERF)

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-PERF-01 | Page load (LCP) on dashboard | < 2.5s (p95) |
| NFR-PERF-02 | API read latency | < 300ms (p95) |
| NFR-PERF-03 | API write latency | < 500ms (p95) |
| NFR-PERF-04 | Support 500 concurrent users initial | Horizontal scale |
| NFR-PERF-05 | Document upload | Up to 50MB/file |

### 5.3 Scalability (NFR-SCALE)

| ID | Requirement |
|----|-------------|
| NFR-SCALE-01 | Stateless API tier for horizontal scaling |
| NFR-SCALE-02 | Object storage for documents (S3-compatible) |
| NFR-SCALE-03 | Database indexing strategy for project/task queries |
| NFR-SCALE-04 | Multi-tenant ready (org/branch) for future growth |

### 5.4 Availability (NFR-AVAIL)

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-AVAIL-01 | Uptime SLA | 99.5% |
| NFR-AVAIL-02 | Automated DB backups | Daily, 30-day retention |
| NFR-AVAIL-03 | RPO / RTO | 1h / 4h |
| NFR-AVAIL-04 | Health checks and alerting | Operational |

### 5.5 Maintainability (NFR-MAINT)

| ID | Requirement |
|----|-------------|
| NFR-MAINT-01 | TypeScript end-to-end; strict typing |
| NFR-MAINT-02 | Modular monolith or services with clear boundaries |
| NFR-MAINT-03 | ≥80% unit test coverage on critical domain logic |
| NFR-MAINT-04 | API versioning (v1) |
| NFR-MAINT-05 | Structured logging (correlation IDs) |
| NFR-MAINT-06 | CI/CD pipeline with lint, test, build gates |

### 5.6 Usability & Accessibility (NFR-UX)

| ID | Requirement |
|----|-------------|
| NFR-UX-01 | Responsive web (desktop, tablet, mobile field use) |
| NFR-UX-02 | WCAG 2.1 AA compliance target |
| NFR-UX-03 | Consistent design system (Nature Tek branding) |
| NFR-UX-04 | Offline-tolerant field capture (progressive enhancement) | Should |

### 5.7 Compliance & Data (NFR-DATA)

| ID | Requirement |
|----|-------------|
| NFR-DATA-01 | GDPR-style data export and deletion for users |
| NFR-DATA-02 | Audit trail for lifecycle, approvals, permission changes |
| NFR-DATA-03 | Data residency configurable per deployment |

---

## 6. Module Hierarchy

```
nature-tek-solar-pms/
├── apps/
│   ├── web/                          # React SPA – primary UI
│   └── api/                            # REST/GraphQL backend
├── packages/
│   ├── shared/                         # Types, constants, validators (Zod)
│   ├── ui/                             # Design system components
│   └── config/                         # ESLint, TS, env schemas
└── infrastructure/
    ├── database/                       # Migrations, seeds
    └── deploy/                         # Docker, IaC (phase-dependent)

DOMAIN MODULES (logical)
│
├── 1. Core Platform
│   ├── 1.1 Authentication & Sessions
│   ├── 1.2 Authorization (RBAC + Project ACL)
│   ├── 1.3 User & Organization Management
│   ├── 1.4 Audit & Activity Log
│   └── 1.5 System Settings & Feature Flags
│
├── 2. Project Hub
│   ├── 2.1 Project CRUD & Metadata
│   ├── 2.2 Lifecycle Engine (state machine)
│   ├── 2.3 Project Team & Roles
│   ├── 2.4 Project Dashboard
│   └── 2.5 Templates & Cloning
│
├── 3. Work Management
│   ├── 3.1 Tasks (CRUD, status, assignment)
│   ├── 3.2 Subtasks & Checklists
│   ├── 3.3 Dependencies & Scheduling
│   ├── 3.4 Milestones
│   └── 3.5 Views (List, Kanban, Calendar, Gantt)
│
├── 4. Resources
│   ├── 4.1 People & Skills
│   ├── 4.2 Equipment
│   ├── 4.3 Materials & BOM
│   └── 4.4 Allocation & Utilization
│
├── 5. Documents
│   ├── 5.1 Storage & Versioning
│   ├── 5.2 Categories & Stage Requirements
│   ├── 5.3 Preview & Download
│   └── 5.4 Search & Metadata
│
├── 6. Approvals
│   ├── 6.1 Workflow Definitions
│   ├── 6.2 Approval Instances
│   ├── 6.3 Notifications & Escalation
│   └── 6.4 Approval History
│
├── 7. Notifications
│   ├── 7.1 In-App Inbox
│   ├── 7.2 Email Dispatcher
│   ├── 7.3 Alert Rules Engine
│   └── 7.4 User Preferences
│
├── 8. Reporting
│   ├── 8.1 Standard Reports
│   ├── 8.2 Export Service
│   ├── 8.3 Scheduled Reports
│   └── 8.4 Report Permissions
│
├── 9. Analytics
│   ├── 9.1 KPI Aggregations
│   ├── 9.2 Stage Cycle-Time Metrics
│   ├── 9.3 Dashboards (Role-based)
│   └── 9.4 Drill-down Navigation
│
└── 10. Integrations (Future)
    ├── 10.1 REST API Public Surface
    ├── 10.2 Webhooks
    └── 10.3 ERP/Accounting Connectors
```

---

## 7. Workflow Specifications (Key Flows)

### 7.1 Project Creation Flow

1. PM creates project → status `Project Created`
2. System assigns default milestones/tasks for stage
3. PM assigns supervisor and team
4. Notification sent to team

### 7.2 Stage Advancement Flow

1. PM/Supervisor requests stage advance
2. System validates: required milestones complete, required documents uploaded, open approvals approved
3. If valid → update lifecycle stage, log audit, notify stakeholders
4. If invalid → return blocking reasons list

### 7.3 Approval Flow

1. Initiator submits approval request (type: design, procurement, QA, handover, etc.)
2. Route to configured approver(s)
3. Approver: Approve | Reject | Request Changes
4. On final approval → unlock dependent actions (e.g., stage gate)
5. All actions logged with timestamp and actor

### 7.4 Document Compliance Flow

1. Stage defines required document types
2. Dashboard shows checklist completion %
3. Stage advance blocked until required docs present (configurable strict/soft)

---

## 8. Data Entities (High-Level)

| Entity | Key Relationships |
|--------|-------------------|
| Organization | Users, Projects |
| User | Roles, ProjectMemberships |
| Project | Stages, Tasks, Milestones, Documents, Approvals |
| LifecycleStageHistory | Project, User, timestamp |
| Task | Project, Assignees, Comments, Attachments |
| Milestone | Project, Stage |
| Resource | Project allocation |
| Document | Project, Version, Category |
| ApprovalRequest | Project, Workflow, Steps |
| Notification | User, Entity reference |
| AuditLog | Polymorphic entity reference |

---

## 9. Constraints & Assumptions

### 9.1 Assumptions

- Web-first; native mobile apps out of scope for v1
- Single organization (Nature Tek) with optional multi-branch later
- English UI for v1; i18n structure recommended
- Specification details (exact form fields, integrations) may be refined in architecture phase

### 9.2 Constraints

- Enterprise security and auditability are mandatory
- Must support field supervisors on tablet/mobile browsers
- Production deployment target: cloud (AWS/Azure/GCP) TBD in architecture

---

## 10. Traceability Matrix (Specification → SRS)

| Specification Area | SRS Section | Coverage |
|--------------------|-------------|----------|
| Solar projects | FR-PM, Lifecycle | Complete |
| Tasks | FR-TM | Complete |
| Milestones | FR-ML | Complete |
| Resources | FR-RM | Complete |
| Documents | FR-DM | Complete |
| Approvals | FR-AW | Complete |
| Reports | FR-RP | Complete |
| Alerts | FR-NT | Complete |
| Analytics | FR-AN | Complete |
| User management | FR-UM | Complete |

---

*End of SRS – Step 1 Requirement Analysis*
