# Nature Tek Solar Project Tracking & Management System

An enterprise-grade web application for managing the complete lifecycle of solar installation projects. The platform streamlines project planning, milestone tracking, progress monitoring, lifecycle management, and team collaboration through a secure role-based architecture.

---

## Overview

Managing solar projects involves coordinating multiple stakeholders, tracking installation milestones, monitoring project progress, and ensuring timely completion. Traditional spreadsheet-based workflows often result in poor visibility, delayed updates, and inefficient project management.

The Nature Tek Solar Project Tracking & Management System provides a centralized platform that enables organizations to manage projects from creation to handover while offering real-time dashboards, automated progress calculation, lifecycle tracking, and secure role-based access.

---

## Key Features

### Authentication & Authorization

- JWT-based authentication
- Secure login system
- Protected REST APIs
- Role-Based Access Control (RBAC)
- Persistent user sessions

Supported Roles

- Admin
- Project Manager
- Supervisor
- Executive
- Installer (Planned)

---

### Project Management

Manage the complete lifecycle of solar projects.

Features include:

- Create and manage projects
- Client and site information
- Capacity and project type management
- Target completion dates
- Project member assignment
- Current lifecycle stage tracking
- Automatic progress calculation
- Delay detection

Each project stores:

- Project Code
- Client Information
- Address
- Capacity (kW)
- Project Type
- Assigned Project Manager
- Assigned Supervisor
- Timeline
- Current Status

---

### Milestone Management

Every project consists of multiple milestones.

Example workflow:

- Site Survey
- Design Approval
- Material Procurement
- Material Delivery
- Structure Installation
- Panel Mounting
- Electrical Wiring
- Inverter Installation
- Testing & Commissioning
- Grid Approval
- Project Handover
- Completed

Supported operations:

- Create Milestones
- Update Status
- Edit
- Delete
- Target Dates
- Completion Dates
- Lifecycle Tracking

---

### Automatic Progress Tracking

Project progress is automatically calculated based on milestone completion.

Example

5 Milestones

- Completed: 2

Progress = 40%

No manual progress updates are required.

---

### Automatic Delay Detection

Projects are automatically marked as delayed when:

- Target End Date has passed
- Project Status is not Completed

Delayed projects are immediately reflected in the management dashboard.

---

### Dashboard & Analytics

The dashboard provides a centralized management overview.

Includes:

- Total Projects
- Active Projects
- Completed Projects
- Delayed Projects

Interactive Analytics

- Project Status Distribution
- Monthly Completion Trends
- Recent Projects
- Lifecycle Overview

---

### Lifecycle Management

Every project follows a predefined workflow.

```
Project Created
        ↓
Site Survey
        ↓
Design Approval
        ↓
Material Procurement
        ↓
Material Delivery
        ↓
Structure Installation
        ↓
Panel Mounting
        ↓
Electrical Wiring
        ↓
Inverter Installation
        ↓
Testing & Commissioning
        ↓
Grid Approval
        ↓
Project Handover
        ↓
Completed
```

The lifecycle allows management teams to monitor every installation stage in real time.

---

## Technology Stack

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- TanStack Query
- Lucide Icons
- Zod

### Backend

- NestJS
- TypeScript
- Prisma ORM
- JWT Authentication
- Passport.js
- Swagger
- Class Validator

### Database

- PostgreSQL
- Prisma ORM

---

## System Architecture

```
                React Frontend
                       │
                REST API Layer
                       │
               NestJS Backend
                       │
                 Prisma ORM
                       │
                PostgreSQL Database
```

---

## Database Design

Core entities:

- Users
- Organizations
- Projects
- Milestones
- Tasks
- Project Members
- Audit Logs
- Lifecycle History

Relationship

```
Organization
      │
   Projects
      │
  Milestones
      │
     Tasks

Users
      │
Project Members
      │
   Projects
```

---

## REST API

Example endpoints

```
POST   /auth/login

GET    /projects
POST   /projects
PATCH  /projects/:id

GET    /milestones
POST   /milestones
PATCH  /milestones/:id
```

---

## Security

- JWT Authentication
- Role Guards
- Protected Routes
- Organization Isolation
- Input Validation
- Parameterized Database Queries

---

## Current Workflow

```
User Login
      ↓
Create Project
      ↓
Create Milestones
      ↓
Update Milestones
      ↓
Automatic Progress Calculation
      ↓
Dashboard Updates
      ↓
Project Completion
```

---

## Future Enhancements

- Task Management Module
- User Management
- Notification System
- Email Reminders
- Document Uploads
- Audit Log Interface
- Analytics & Reports
- Mobile Optimization

---

## Installation

```bash
git clone https://github.com/salonitiwari24/Project-Tracking.git

cd Project-Tracking

# Frontend
npm install

# Backend
npm install

# Start development server
npm run dev
```

---

## Folder Structure

```
frontend/
backend/
docs/
```

---

## Screenshots

Add screenshots of:

- Login Page
- Dashboard
- Project Management
- Project Details
- Milestone Management
- Analytics Dashboard

---
t is licensed under the MIT License.
