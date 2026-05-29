# Nature Tek Solar – Project Tracking & Management System

Enterprise-grade solar project management platform.

## Documentation

| Phase | Document |
|-------|----------|
| 1 | [Requirement Analysis](docs/01-requirement-analysis/SRS.md) |
| 2 | [Architecture](docs/02-architecture/ARCHITECTURE.md) |

## Stack

- **Monorepo:** pnpm + Turborepo
- **API:** NestJS + Prisma + PostgreSQL
- **Web:** React + Vite + Tailwind CSS 4
- **Infra (local):** Docker Compose (Postgres, Redis, MinIO)

## Quick Start

### Prerequisites

- Node.js 20+
- pnpm 9+
- Docker Desktop

### Setup

```bash
# Copy environment file
cp .env.example .env

# Start infrastructure
pnpm docker:up

# Install dependencies
pnpm install

# Generate Prisma client & push schema
pnpm db:generate
pnpm db:push
pnpm db:seed

# Start dev servers
pnpm dev
```

- **Web:** http://localhost:5173
- **API:** http://localhost:3001/api/v1
- **Swagger:** http://localhost:3001/api/docs

### Seed credentials

| Email | Password | Role |
|-------|----------|------|
| admin@naturetek.com | Admin@123 | Admin |
| pm@naturetek.com | Pm@12345 | Project Manager |

## Project structure

```
apps/api          NestJS REST API
apps/web          React SPA
packages/database Prisma schema & client
packages/shared   Shared types & Zod schemas
docs/             Phase documentation
```
